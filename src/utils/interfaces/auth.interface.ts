import { NextFunction } from "express";
import { UserDTO, LoginDTO } from "../dto/user.dto";

export default interface AuthInterface {
  createUser(data: UserDTO, next: NextFunction): Promise<any>;
  login(loginData: LoginDTO, next: NextFunction): Promise<any>;
}
