import { NextFunction, Request, Response, Router } from 'express';
import { VariantService } from '../services/VariantService';
import { StatusCodes } from 'http-status-codes';
import { pagination } from '../middlewares/pagination';

export const VariantRouter = Router();

VariantRouter.get(
  '/',
  pagination({
    color: 'in',
    size: 'in',
    price: 'range',
    stock: 'range',
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, page, limit, sortOptions, filterOptions } = res.locals;

      return res
        .status(StatusCodes.OK)
        .json(
          await VariantService.getPaginated(
            q,
            page,
            limit,
            sortOptions,
            filterOptions,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
);
