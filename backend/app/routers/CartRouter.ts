import { NextFunction, Request, Response, Router } from 'express';
import { CartService } from '../services/CartService';
import { StatusCodes } from 'http-status-codes';
import { auth } from '../middlewares/auth';

export const CartRouter = Router();

CartRouter.get(
  '/',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await CartService.getCartProducts(req.body.cartId));
    } catch (error) {
      next(error);
    }
  },
);

CartRouter.post(
  '/',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.CREATED)
        .json(
          await CartService.addOrUpdateProductToCart(
            req.body.cartId,
            res.locals.user.id,
            req.body.variantId,
            req.body.quantity,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
);

CartRouter.delete(
  '/:id',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await CartService.deleteCart(parseInt(req.params.id)));
    } catch (error) {
      next(error);
    }
  },
);
