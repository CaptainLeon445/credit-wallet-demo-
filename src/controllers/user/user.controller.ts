import { NextFunction, Request, Response } from 'express';
import { GlobalUtilities } from '../../utils/global.utils';
import { catchAsync } from '../../utils/catchAsyncError';
import { UserService } from '../../services/user/user.service';
import { AppError } from '../../middlewares/ErrorHandlers/AppError';

export default class UserController {
  constructor(private readonly userService: UserService) {}

  public getUsers = catchAsync(async (req: Request, res: Response) => {
    const data = await this.userService.getUsers();
    if (data)
      await GlobalUtilities.response(
        res,
        'Users returned successfully',
        200,
        data,
        data.length
      );
  });

  public getUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!user.active) return next(new AppError('User account inactive', 403));
      let id: number;
      if (user.role === 'superadmin') id = Number(req.params.id);
      else id = user.id;
      const data = await this.userService.getUser(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          'User details returned successfully!',
          200,
          data
        );
    }
  );

  public deactivateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!user.active) return next(new AppError('User account inactive', 403));
      let id: number;
      if (user.role === 'superadmin') id = Number(req.params.id);
      else id = user.id;
      const data = await this.userService.deactivateUser(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          'User deactivated successfully!',
          201,
          data
        );
    }
  );
}
