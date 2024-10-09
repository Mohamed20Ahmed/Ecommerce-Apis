import { Request, Response, NextFunction } from "express";

import ApiError from "../utils/apiError";

const sendErrorForDev = (err: ApiError, res: Response): Response =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorForProd = (err: ApiError, res: Response): Response =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJWTInvalidSignature = (): ApiError =>
  new ApiError("Invalid token, please login again..", 401);

const handleJWTExpired = (): ApiError =>
  new ApiError("Invalid token, please login again..", 401);

const globalError = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJWTInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJWTExpired();

    sendErrorForProd(err, res);
  }
};

export default globalError;
