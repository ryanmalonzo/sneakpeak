import { NextFunction, Request, Response, Router } from 'express';
import { CategoryService } from '../services/category';
import { StatusCodes } from 'http-status-codes';
import { auth } from '../middlewares/auth';

export const CategoryRouter = Router();

CategoryRouter.use(auth);

CategoryRouter.get(
  '/categories',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await CategoryService.findCategories());
    } catch (error) {
      next(error);
    }
  },
);

CategoryRouter.get(
  '/categories/best',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await CategoryService.findCategoriesByIsBest());
    } catch (error) {
      next(error);
    }
  },
);
