import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import ErrorHandler from '../utils/utility-class.js';
import { ControllerType } from '../types/types.js';

export const errorMiddleware: ErrorRequestHandler = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "An unexpected error occurred",
  });
};


//wrapper function

export const TryCatch = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
