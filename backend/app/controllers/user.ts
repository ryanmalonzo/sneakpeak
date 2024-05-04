import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const JWT_EXPIRY_TIME = '1h';

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = new User({ email, password });

  try {
    await user.save();
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: JWT_EXPIRY_TIME,
  });

  return res.status(StatusCodes.CREATED).json({ token });
};
