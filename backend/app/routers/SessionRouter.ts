import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { SessionService } from '../services/SessionService';
import { auth } from '../middlewares/auth';

export const SessionRouter = express.Router();

const cookieParser = require('cookie-parser');
SessionRouter.use(cookieParser());

SessionRouter.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await SessionService.login(email, password);

    //Creation cookie
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1h
    });

    return res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
});

SessionRouter.get('/', auth, async (req, res, next) => {
  try {
    return res.status(StatusCodes.OK).json({ user: res.locals.user });
  } catch (error) {
    next(error);
  }
});
