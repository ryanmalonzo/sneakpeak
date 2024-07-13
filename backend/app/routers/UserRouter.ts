import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services/UserService';
import { RequestError } from '../helpers/error';
import { UserRepository } from '../repositories/sql/UserRepository';
import { setCookie } from '../helpers/cookie';
import { auth } from '../middlewares/auth';
import { permissions } from '../middlewares/permissions';

export const UserRouter = express.Router();

const findUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await UserRepository.findById(Number(id));
  if (!user) {
    next(new RequestError(StatusCodes.NOT_FOUND, 'user_not_found'));
  }

  res.locals.user = user;
  next();
};

// Register a new user
UserRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      return res
        .status(StatusCodes.CREATED)
        .json(await UserService.registerUser(email, password));
    } catch (error) {
      next(error);
    }
  },
);

// Verify if the user exists before sending email verification
UserRouter.use('/:id/challenge/email', findUser);
UserRouter.post(
  '/:id/challenge/email',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = res.locals;
      const { token } = req.body;

      const { token: authToken } = await UserService.verifyEmail(user, token);

      setCookie(res, 'accessToken', authToken);

      return res.sendStatus(StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  },
);

UserRouter.post(
  '/password-reset',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      return res
        .status(StatusCodes.OK)
        .json(await UserService.sendPasswordResetEmail(email));
    } catch (error) {
      next(error);
    }
  },
);

UserRouter.use('/:id/password', findUser);
UserRouter.put(
  '/:id/password',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = res.locals;
      const { token, password } = req.body;

      const { token: authToken } = await UserService.resetPassword(
        user,
        token,
        password,
      );

      setCookie(res, 'accessToken', authToken);

      return res.sendStatus(StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  },
);

UserRouter.patch(
  '/:id',
  findUser,
  auth,
  permissions(['user']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, phone, email, password } = req.body;

      return res.status(StatusCodes.OK).json(
        await UserService.update(Number(id), {
          firstName,
          lastName,
          phone,
          email,
          password,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);
