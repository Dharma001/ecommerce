import { Request, Response, NextFunction } from 'express';

export interface NewUserRequestBody {
  _id: string;
  name: string;
  email: string;
  photo: string;
  gender: 'male' | 'female';
  dob: Date;
  createAt: Date;
  updatedAt: Date;
}

export type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>
