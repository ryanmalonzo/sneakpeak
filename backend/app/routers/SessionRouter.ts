import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { SessionService } from '../services/SessionService';

export const SessionRouter = express.Router();

SessionRouter.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    return res
      .status(StatusCodes.OK)
      .json(await SessionService.login(email, password));
  } catch (error) {
    next(error);
  }
});
