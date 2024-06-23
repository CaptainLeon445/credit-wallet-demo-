import { NextFunction, Request, Response } from "express";
import { GlobalUtilities } from "../../utils/global.utils";
import { catchAsync } from "../../utils/catchAsyncError";
import { UserService } from "../../services/user/user.service";

export default class UserController {
  constructor(private readonly userService: UserService) {}

  public getUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.userService.getUsers();
      if (data)
        await GlobalUtilities.response(
          res,
          "Users returned successfully",
          200,
          data,
          data.length
        );
    }
  );

  public getUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: number = Number(req.params.id);
      const data = await this.userService.getUser(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          "User details returned successfully!",
          200,
          data
        );
    }
  );

  public deactivateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: number = Number(req.params.id);
      const data = await this.userService.deactivateUser(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          "User deactivated successfully!",
          201,
          data
        );
    }
  );
}
