import { Response } from 'express';

export class GlobalUtilities {
  public static async response(
    res: Response,
    message: string,
    statusCode: number,
    data?: Record<string, any>,
    count?: number
  ) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      count,
      data,
    });
  }
}
