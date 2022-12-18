import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction, Errback } from 'express';

interface DefaultError {
  message: string;
  statusCode: StatusCodes;
}

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const defaultError: DefaultError = {
    message: err.message || 'Something went wrong, please try again later',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  res.status(defaultError.statusCode).json({ message: defaultError.message });
};

export default errorHandlerMiddleware;
