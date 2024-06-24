import bcrypt from 'bcrypt';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export default class AuthUtilities {
  public static async verifyAuthToken(
    token: string,
    secret: string
  ): Promise<string | jwt.JwtPayload> {
    return jwt.verify(token, secret);
  }

  public static async generateHash(text: string): Promise<string> {
    const saltRounds: number = 10;
    const hashedPassword: string = bcrypt.hashSync(text, saltRounds);
    return hashedPassword;
  }

  public static async validateHash(
    text: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }

  public static async validatePasswordLength(password: string) {
    const passwordRegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/;
    if (!passwordRegExp.test(password)) {
      return false;
    }
    return true;
  }

  public static async getLoginData(
    req: Request,
    user: any
  ): Promise<Record<string, any>> {
    const accessToken: string = await AuthUtilities.getAuthToken(user.id);
    const refreshToken: string = await AuthUtilities.getRefreshAuthToken(
      user.id
    );
    delete user.password;
    delete user.id;

    const data: Record<string, any> = {
      accessToken,
      refreshToken,
      ...user,
    };

    return data;
  }

  public static async getRefreshAuthToken(id: number) {
    const expiresIn: string = process.env.JWT_RefreshToken_ExpiresIn!;
    const result: string = await this.getToken(expiresIn, id);
    return result;
  }

  public static async getAuthToken(id: number) {
    const expiresIn: string = process.env.JWT_ExpiresIn!;
    const result: string = await this.getToken(expiresIn, id);
    return result;
  }

  private static async getToken(expiryTime: string, id: number) {
    const secret: string = process.env.JWT_SECRET_KEY!;
    const expiresIn: string = expiryTime;
    const token: string = jwt.sign({ id }, secret, {
      expiresIn: expiresIn,
    });
    return token;
  }
}
