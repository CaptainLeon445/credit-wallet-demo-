import { NextFunction, Request, Response } from 'express';
import { AppError } from './ErrorHandlers/AppError';
import AuthUtilities from '../utils/auth/auth.utils';
import logger from '../logger';
import UserUtils from '../utils/user/user.utils';

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export class AuthMiddleware {
  private readonly verifyAndDecodeToken = async (
    token: string,
    secretKey: string
  ): Promise<any> => {
    return AuthUtilities.verifyAuthToken(token, secretKey);
  };

  private readonly getAccessToken = async (
    req: Request,
    next: NextFunction
  ): Promise<string | void> => {
    const authHeader = req.headers.authorization?.split(' ');
    if (authHeader && authHeader.length === 2) {
      const [bearer, accessToken] = authHeader;
      if (bearer !== 'Bearer')
        return next(new AppError('You are not authorized', 401));
      if (!accessToken)
        return next(new AppError('You are not authorized', 401));
      return accessToken;
    } else return next(new AppError('You are not authorized', 401));
  };

  private readonly getUserFromToken = async (id: number) => {
    return UserUtils.getUserById(id);
  };

  public authProtect = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const accessToken = await this.getAccessToken(req, next);
      if (!accessToken)
        return next(new AppError('You are not authorized', 401));
      const decoded: any = await this.verifyAndDecodeToken(
        accessToken,
        process.env.JWT_SECRET_KEY!
      );
      const user = await this.getUserFromToken(decoded.id);
      if (!user) return next(new AppError('You are not authorized', 401));
      req.user = user;
      next();
    } catch (error: any) {
      logger.error('Error', error);
      return next(new AppError('You are not authorized', 401));
    }
  };

  public authRestrictTo = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!roles.includes(req.user.role))
          return next(
            new AppError(
              'You do not have permission to perform this action.',
              401
            )
          );
        next();
      } catch (err: any) {
        logger.error('error', err);
        return next(new AppError(err.message, err.status));
      }
    };
  };
}
