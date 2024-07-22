import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { pagination } from '../middlewares/pagination';
import { OrderService } from '../services/OrderService';

export const OrderRouter = Router();

OrderRouter.get(
  '/',
  pagination({
    reference: 'in',
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, page, limit, sortOptions, filterOptions } = res.locals;
      console.log('get all orders');
      console.log(
        OrderService.getPaginated(q, page, limit, sortOptions, filterOptions),
      );
      return res
        .status(StatusCodes.OK)
        .json(
          await OrderService.getPaginated(
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
