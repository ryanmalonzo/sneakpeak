import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';
import { UserService } from '../services/UserService';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies?.accessToken;

  if (!cookie) {
    next(new RequestError(StatusCodes.UNAUTHORIZED, 'not_logged_in'));
    return;
  }

  const user = await UserService.verifyAuthToken(cookie);

  if (!user) {
    next(new RequestError(StatusCodes.UNAUTHORIZED, 'invalid_token'));
    return;
  }

  res.locals.user = user;
  next();
};
