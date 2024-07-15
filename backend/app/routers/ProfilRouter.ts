import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { auth } from '../middlewares/auth';
import { OrderService } from '../services/OrderService';

export const ProfilRouter = express.Router();

ProfilRouter.get('/orders', auth, async (req, res, next) => {
  try {
    const orders = await OrderService.findAllOrders(res.locals.user.id);
    return res.status(StatusCodes.OK).json({ orders });
  } catch (error) {
    next(error);
  }
});

ProfilRouter.get('/orders/:reference', auth, async (req, res, next) => {
  try {
    const order = await OrderService.findOrderByReference(
      req.params.reference,
      res.locals.user.id,
    );
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).send();
    }
    const shipping = await OrderService.findAddressByType(order.id, 'shipping');

    const billing = await OrderService.findAddressByType(order.id, 'billing');
    const products = await OrderService.findProductsByOrderId(order.id);

    if (!shipping || !billing || !products) {
      return res.status(StatusCodes.NOT_FOUND).send();
    }
    const data = {
      order: {
        createdAt: order.createdAt,
        total: order.total,
        status: order.status,
        payment_status: order.payment_status,
        reference: order.reference,
      },
      shipping: {
        name: shipping.name,
        city: shipping.city,
        street: shipping.street,
        phone: shipping.phone,
        postal_code: shipping.postal_code,
      },
      billing: {
        name: billing.name,
        city: billing.city,
        street: billing.street,
        phone: billing.phone,
        postal_code: billing.postal_code,
      },
      products: products.map((product) => ({
        id: product.id,
        image: 'https://via.placeholder.com/150',
        name: product.name,
        quantity: product.quantity,
        unit_price: product.unitPrice,
      })),
    };
    return res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(error);
  }
});

ProfilRouter.get('/orders/:reference/invoice', auth, async (req, res, next) => {
  try {
    return res.status(StatusCodes.OK).json({ user: res.locals.user });
  } catch (error) {
    next(error);
  }
});
