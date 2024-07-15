import express from 'express';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';
import { SessionService } from '../services/SessionService';
import { auth } from '../middlewares/auth';
import { setCookie } from '../helpers/cookie';
import { schema } from '../middlewares/schema';

export const SessionRouter = express.Router();

SessionRouter.post(
  '/',
  schema(
    z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  ),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { token } = await SessionService.login(email, password);

      //Creation cookie
      setCookie(res, 'accessToken', token);

      return res.sendStatus(StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  },
);

SessionRouter.get('/', auth, async (req, res, next) => {
  try {
    return res.status(StatusCodes.OK).json({ user: res.locals.user });
  } catch (error) {
    next(error);
  }
});

SessionRouter.get('/logout', auth, async (req, res, next) => {
  try {
    res.clearCookie('accessToken');
    return res.sendStatus(StatusCodes.OK);
  } catch (error) {
    next(error);
  }
});
