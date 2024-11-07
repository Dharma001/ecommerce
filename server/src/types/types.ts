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

export interface NewProductRequestBody {
  name: string;
  category: string;
  photo: string;
  price: number;
  stock: number;
  createAt: Date;
  updatedAt: Date;
}

export type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>

// Request<{}, {}, NewProductRequestBody>:
// Params: {} → No route parameters.
// ResBody: {} → Not specifying a specific type for the response body.
// ReqBody: NewProductRequestBody → This is the type of the data expected in the request body.

export type SearchRequestQuery =  {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
}

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number; }
  category?: string;
}

export type InvalidateCacheType = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
}