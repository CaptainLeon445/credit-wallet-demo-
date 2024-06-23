import { Response } from "express";

export class ErrorHandler {
  public static prodErrorHandler(err: any, res: Response) {
    return res.status(err.statusCode).json({
      status: "error",
      error: err.message,
    });
  }

  public static devErrorHandler(err: any, res: Response) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
}
