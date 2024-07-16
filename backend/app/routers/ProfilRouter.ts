import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { auth } from '../middlewares/auth';
import { OrderService } from '../services/OrderService';
import { VariantRepository } from '../repositories/sql/VariantRepository';
import { ColorRepository } from '../repositories/sql/ColorRepository';
import { SizeRepository } from '../repositories/sql/SizeRepository';

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
    const orderProducts = await OrderService.findProductsByOrderId(order.id);

    if (!orderProducts) {
      return res.status(StatusCodes.NOT_FOUND).send();
    }
    const products = [];

    for (const orderProduct of orderProducts) {
      const variant = await VariantRepository.findVariantById(
        orderProduct.variantId,
      );
      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).send();
      }
      const color = await ColorRepository.findColorById(variant.colorId);
      if (!color) {
        return res.status(StatusCodes.NOT_FOUND).send();
      }
      const size = await SizeRepository.findSizeById(variant.sizeId);
      if (!size) {
        return res.status(StatusCodes.NOT_FOUND).send();
      }
      const product = {
        id: orderProduct.variantId,
        image: orderProduct.image,
        name: orderProduct.name,
        color: color.name,
        size: size.name,
        quantity: orderProduct.quantity,
        unitPrice: orderProduct.unitPrice,
      };
      products.push(product);
    }
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
        invoice_link: order.invoice_link,
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
      products,
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
