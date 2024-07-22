import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';
import { UserService } from '../services/UserService';
import { RequestError } from '../helpers/error';
import { UserRepository } from '../repositories/sql/UserRepository';
import { setCookie } from '../helpers/cookie';
import { auth } from '../middlewares/auth';
import { permissions } from '../middlewares/permissions';
import { schema } from '../middlewares/schema';

export const UserRouter = express.Router();

const findUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await UserRepository.findById(Number(id));
  if (!user) {
    next(new RequestError(StatusCodes.NOT_FOUND));
  }

  res.locals.user = user;
  next();
};

// Register a new user
UserRouter.post(
  '/',
  schema(
    z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  ),
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
  schema(
    z.object({
      token: z.string(),
    }),
  ),
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
  schema(
    z.object({
      email: z.string().email(),
    }),
  ),
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
  schema(
    z.object({
      token: z.string(),
      password: z.string(),
    }),
  ),
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
  schema(
    z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().optional(),
    }),
  ),
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

UserRouter.post(
  '/:id/anonymize',
  findUser,
  auth,
  permissions(['user']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await UserService.anonymize(Number(id));

      return res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);

UserRouter.get(
  '/:id/address',
  findUser,
  auth,
  permissions(['user']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { type } = req.query;

      if (!type) {
        return res
          .status(StatusCodes.OK)
          .json(await UserService.getAddresses(Number(id)));
      }

      return res
        .status(StatusCodes.OK)
        .json(await UserService.getAddress(Number(id), type as string));
    } catch (error) {
      next(error);
    }
  },
);

UserRouter.put(
  '/:id/address',
  findUser,
  auth,
  permissions(['user']),
  schema(
    z.object({
      type: z.string(),
      address: z.string(),
      phone: z.string(),
      name: z.string(),
    }),
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { type, address, phone, name } = req.body;

      // TODO CREATED if it did not exist before,
      // OK if it was updated
      return res
        .status(StatusCodes.OK)
        .json(
          await UserService.saveAddress(Number(id), type, address, phone, name),
        );
    } catch (error) {
      next(error);
    }
  },
);
