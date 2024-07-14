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
    const order = await OrderService.findOrderByReference(req.params.reference);
    return res.status(StatusCodes.OK).json({ order });
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
