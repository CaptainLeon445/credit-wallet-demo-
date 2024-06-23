import { NextFunction } from "express";
import db from "../../config/db.connection";
import { LoginDTO, UserDTO } from "../../utils/dto/user.dto";
import { AppError } from "../../middlewares/ErrorHandlers/AppError";
import AuthUtilities from "../../utils/auth/auth.utils";
import { WalletService } from "../wallet/wallet.service";
import UserUtils from "../../utils/user/user.utils";

export default class AuthService {
  constructor(private readonly walletService: WalletService) {}
  public async createUser(userDTO: UserDTO, next: NextFunction) {
    const { username, password, email } = userDTO;
    try {
      const [emailExist] = await db("users").where({ email });
      if (emailExist)
        return next(new AppError("User with the email already exists", 409));
      const [user] = await db("users").where({ username });
      if (user)
        return next(new AppError("User with the username already exists", 409));
      const strongPassword =
        await AuthUtilities.validatePasswordLength(password);
      if (!strongPassword)
        return next(
          new AppError(
            "Password must be 8 characters long with a number,special character, lowercase and uppercase letter.",
            400
          )
        );
      userDTO.password = await AuthUtilities.generateHash(password);
      const [data] = await db("users").insert(userDTO).returning("*");
      await this.walletService.createWallet({ uid: data.id }, next);
      delete data.password;
      delete data.id;
      return data;
    } catch (error: any) {
      return next(new AppError(error.message, error.status));
    }
  }

  public async login(userData: LoginDTO, next: NextFunction) {
    const user = await UserUtils.getUserByUsername(userData.username);
    if (!user)
      return next(
        new AppError(
          `No account associated with the username ${userData.username}`,
          404
        )
      );
    if (!user.active)
      return next(
        new AppError(
          `Your account is not active. Kindly reactivate your account.`,
          403
        )
      );
    const comparePassword = await AuthUtilities.validateHash(
      userData.password,
      user.password
    );
    if (!comparePassword)
      return next(new AppError(`Username or Password is incorrect.`, 401));
    return user;
  }
}
