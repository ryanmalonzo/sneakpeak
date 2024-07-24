import { NextFunction, Request, Response, Router } from 'express';
import { CartService } from '../services/CartService';
import { CartRepository } from '../repositories/mongodb/CartRepository';
import { StatusCodes } from 'http-status-codes';
import { auth } from '../middlewares/auth';
import { schema } from '../middlewares/schema';
import { z } from 'zod';

export const CartRouter = Router();

CartRouter.get(
  '/',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await CartRepository.findByUserId(res.locals.user.id));
    } catch (error) {
      next(error);
    }
  },
);

CartRouter.post(
  '/',
  schema(
    z.object({
      variantId: z.number(),
      quantity: z.number(),
    }),
  ),
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.CREATED)
        .json(
          await CartService.addProductToCart(
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

CartRouter.put(
  '/',
  schema(
    z.object({
      variantId: z.number(),
      quantity: z.number(),
    }),
  ),
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(
          await CartService.updateProductInCart(
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
        .json(
          await CartService.deleteProductFromCart(
            res.locals.user.id,
            parseInt(req.params.id),
          ),
        );
    } catch (error) {
      next(error);
    }
  },
);
