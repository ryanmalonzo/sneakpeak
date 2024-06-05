import { NextFunction, Request, Response, Router } from 'express';
import { CategoryService } from '../services/CategoryService';
import { StatusCodes } from 'http-status-codes';

export const CategoryRouter = Router();

CategoryRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(StatusCodes.OK).json(await CategoryService.findAll());
    } catch (error) {
      next(error);
    }
  },
);
