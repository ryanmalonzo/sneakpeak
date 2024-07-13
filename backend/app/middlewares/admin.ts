import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';
import { auth } from './auth';

/**
 * Verifies if the user has role admin
 * @returns the user data in `res.locals.user`
 * @throws 403 if the user is not an admin
 */

export const admin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await auth(req, res, async () => {
    if (!res.locals.user.roles.includes('ADMIN')) {
      next(new RequestError(StatusCodes.FORBIDDEN, 'not_enough_permissions'));
      return;
    }

    next();
  });
};
