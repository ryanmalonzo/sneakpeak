import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';
import jwt from 'jsonwebtoken';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token: string | undefined = req.headers.authorization?.split(' ')[1];

  if (!token) {
    next(new RequestError(StatusCodes.UNAUTHORIZED, 'unauthorized'));
    return;
  }

  if (!process.env.JWT_SECRET) {
    next(new RequestError(StatusCodes.INTERNAL_SERVER_ERROR));
    console.error('JWT_SECRET not set');
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    next(new RequestError(StatusCodes.UNAUTHORIZED, 'unauthorized'));
  }

  res.locals.token = token;
  next();
};
