import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { pagination } from '../middlewares/pagination';
import { OrderService } from '../services/OrderService';
import { ProductReturnService } from '../services/ProductReturnService';
import { ProductReturnRepository } from '../repositories/sql/ProductReturnRepository';
import { admin } from '../middlewares/admin';
import { auth } from '../middlewares/auth';

export const OrderRouter = Router();

OrderRouter.get(
  '/',
  pagination({
    reference: 'in',
    status: 'in',
  }),
  admin,
  auth,
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
  admin,
  auth,
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
  admin,
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id;
      const status = req.body.status;
      return res
        .status(StatusCodes.OK)
        .json(await OrderService.updateStatus(status, orderId));
    } catch (error) {
      next(error);
    }
  },
);

OrderRouter.put(
  '/:id/return',
  admin,
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.body.status;
      const productId = req.params.id;
      const productReturn = await ProductReturnService.find(
        parseInt(productId),
      );

      if (!productReturn) {
        return res.status(StatusCodes.NOT_FOUND).json();
      }
      productReturn.status = status;
      await ProductReturnRepository.save(productReturn);

      return res.status(StatusCodes.OK).json();
    } catch (error) {
      next(error);
    }
  },
);
