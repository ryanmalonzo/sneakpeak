import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services/user';

export const UserRouter = express.Router();

const findUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await UserService.findById(id);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'user_not_found' });
  }

  res.locals.user = user;
  next();
};

UserRouter.post(
  '/users',
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

UserRouter.use('/users/:id/challenge/email', findUser);
UserRouter.post(
  '/users/:id/challenge/email',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = req.params;
      const { token } = req.body;

      return res
        .status(StatusCodes.OK)
        .json(await UserService.verifyEmail(userId, token));
    } catch (error) {
      next(error);
    }
  },
);
