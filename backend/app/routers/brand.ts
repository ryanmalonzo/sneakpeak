import { NextFunction, Request, Response, Router } from 'express';
import { BrandService } from '../services/brand';
import { StatusCodes } from 'http-status-codes';
import { auth } from '../middlewares/auth';

export const BrandRouter = Router();

BrandRouter.use(auth);

BrandRouter.get(
  '/brands',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(StatusCodes.OK).json(await BrandService.findBrands());
    } catch (error) {
      next(error);
    }
  },
);

BrandRouter.get(
  '/brands/best',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await BrandService.findBrandsByIsBest());
    } catch (error) {
      next(error);
    }
  },
);
