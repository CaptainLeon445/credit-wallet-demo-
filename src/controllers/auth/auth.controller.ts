import { NextFunction, Request, Response } from "express";
import { LoginDTO, UserDTO } from "../../utils/dto/user.dto";
import { GlobalUtilities } from "../../utils/global.utils";
import AuthService from "../../services/auth/auth.service";
import { catchAsync } from "../../utils/catchAsyncError";
import AuthUtilities from "../../utils/auth/auth.utils";

export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register
   */
  public register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userData: UserDTO = req.body;
      const data = await this.authService.createUser(userData, next);
      if (data) {
        await GlobalUtilities.response(
          res,
          "Account created successfully",
          201,
          data
        );
      }
    }
  );

  /**
   * Login
   */
  public login = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const loginData: LoginDTO = req.body;
      const user = await this.authService.login(loginData, next);
      if (user) {
        const data = await AuthUtilities.getLoginData(req, user);
        await GlobalUtilities.response(
          res,
          "User logged in successfully.",
          200,
          data
        );
      }
    }
  );
}
