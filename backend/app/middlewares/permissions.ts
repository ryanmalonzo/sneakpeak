import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';
import { auth } from './auth';

/**
 * Verifies if the user is allowed to perform the action
 * @param  resources The resources to check
 * @throws 403 if the user is not allowed to perform the action
 */

export const permissions = (resources: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await auth(req, res, async () => {
      // Admin has access to everything
      if (res.locals.user.roles.includes('ADMIN')) {
        next();
      }

      // ***
      // Add all permission rules below
      // ***

      if (resources.includes('user')) {
        if (res.locals.user.id !== Number(req.params.id)) {
          next(new RequestError(StatusCodes.FORBIDDEN));
          return;
        }
      }

      next();
    });
  };
};
