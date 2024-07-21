import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';
import { UserService } from '../services/UserService';
import { ChallengeService } from '../services/ChallengeService';

/**
 * Verifies if the user is authenticated
 * @returns in "res.locals.user" the user data
 */

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

  const challenge = await ChallengeService.findByUserAndType(user, 'email');

  if (!challenge) {
    next(new RequestError(StatusCodes.INTERNAL_SERVER_ERROR));
    return;
  }

  if (!challenge.disabled) {
    next(new RequestError(StatusCodes.UNAUTHORIZED, 'email_not_verified'));
    return;
  }

  res.locals.user = user;
  next();
};
