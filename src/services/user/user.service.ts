import { NextFunction } from "express";
import db from "../../config/db.connection";
import { AppError } from "../../middlewares/ErrorHandlers/AppError";
import UserUtils from "../../utils/user/user.utils";

export class UserService {
  public async getUsers() {
    const users = await db("users").returning("*");
    return users;
  }

  public async getUser(id: number, next: NextFunction) {
    const [user] = await UserUtils.getUserById(id);
    if (!user) return next(new AppError("User profile not found", 404));
    return user;
  }

  public async deactivateUser(id: number, next: NextFunction) {
    const [user] = await UserUtils.getUserById(id);
    if (!user) return next(new AppError("User profile not found", 404));
    const data = await UserUtils.deactivateUser(id);
    return data;
  }
}
