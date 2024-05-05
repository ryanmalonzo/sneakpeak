import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import postmark from '../helpers/postmark';
import { StatusCodes } from 'http-status-codes';

const JWT_EXPIRY_TIME = '1h';
const ACCOUNT_ACTIVATION_TEMPLATE_ID = 35812359;

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = new User({ email, password });

  try {
    await user.save();
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }

  let token;
  try {
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: JWT_EXPIRY_TIME,
    });
  } catch (error) {
    console.error('Could not sign JWT', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  try {
    // TODO: generate confirmation token and store it in db

    await postmark.sendEmail(email, ACCOUNT_ACTIVATION_TEMPLATE_ID, {
      activation_url: 'https://google.com',
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  return res.status(StatusCodes.CREATED).json({ token });
};
