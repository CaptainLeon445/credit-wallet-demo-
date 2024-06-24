import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';
import { ErrorHandler } from '../../utils/errorHandler.utilities';

class GlobalErrorHandler {
  static handleError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
  ): void {
    const error = err as AppError;
    error.statusCode = error.statusCode || 500;
    error.message =
      error.message || 'Internal server error! Please try again later';
    ErrorHandler.devErrorHandler(error, res);
  }
}

export { GlobalErrorHandler };
