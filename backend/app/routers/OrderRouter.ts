import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { pagination } from '../middlewares/pagination';
import { OrderService } from '../services/OrderService';

export const OrderRouter = Router();

OrderRouter.get(
  '/',
  pagination({
    reference: 'in',
    status: 'in',
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, page, limit, sortOptions, filterOptions } = res.locals;
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

OrderRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      return res
        .status(StatusCodes.OK)
        .json(await OrderService.findOrderById(id));
    } catch (error) {
      next(error);
    }
  },
);

OrderRouter.put(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id;
      console.log('orderId', orderId);
      const status = req.body.status;
      return res
        .status(StatusCodes.CREATED)
        .json(await OrderService.updateStatus(status, orderId));
    } catch (error) {
      next(error);
    }
  },
);
