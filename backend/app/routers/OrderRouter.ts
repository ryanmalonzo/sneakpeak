import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { pagination } from '../middlewares/pagination';
import { OrderService } from '../services/OrderService';
import { ProductReturnService } from '../services/ProductReturnService';
import { ProductReturnRepository } from '../repositories/sql/ProductReturnRepository';
import { admin } from '../middlewares/admin';
import { auth } from '../middlewares/auth';
import { stripe } from '../services/CheckoutService';
import { OrderProductRepository } from '../repositories/sql/OrderProductRepository';
import { OrderRepository } from '../repositories/sql/OrderRepository';

export const OrderRouter = Router();

OrderRouter.get(
  '/',
  auth,
  admin,
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
      if (status === 'approved') {
        const orderProduct = await OrderProductRepository.findById(
          productReturn.order_products_id,
        );
        if (!orderProduct) {
          return res.status(StatusCodes.NOT_FOUND).json();
        }
        const order = await OrderRepository.findById(orderProduct.orderId);
        if (!order) {
          return res.status(StatusCodes.NOT_FOUND).json();
        }

        const refund = await stripe.refunds.create({
          payment_intent: order.payment_intent,
          amount: parseInt(
            (orderProduct.unitPrice * orderProduct.quantity * 100).toFixed(0),
          ),
        });

        const charge = refund.charge as string;

        const url = await stripe.charges.retrieve(charge);

        order.amount_refunded += orderProduct.unitPrice * orderProduct.quantity;
        orderProduct.linkRefund = url.receipt_url as string;
        await OrderProductRepository.update(orderProduct);
        await OrderRepository.update(order);
      }
      await ProductReturnRepository.save(productReturn);

      return res.status(StatusCodes.OK).json();
    } catch (error) {
      next(error);
    }
  },
);
