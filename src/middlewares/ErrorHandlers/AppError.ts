export class AppError extends Error {
  public status: string;

  public isOperational: boolean;

  constructor(
    message: string,
    public statusCode: number,
    // public errorName: string = ""
  ) {
    super();
    // this.name = errorName;
    this.message = message;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
