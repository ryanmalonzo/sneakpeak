import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { CheckoutService } from '../services/CheckoutService';
import { CartService } from '../services/CartService';
import { auth } from '../middlewares/auth';

dotenv.config();

export const CheckoutRouter = Router();

CheckoutRouter.get('/', auth, async (req: Request, res: Response) => {
  const cartProducts = await CartService.getCartProducts(res.locals.user.id);
  res.json(cartProducts);
});

CheckoutRouter.post(
  '/',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    const cartProducts = await CartService.getCartProducts(res.locals.user.id);

    const billing = req.body.billing;
    const shipping = req.body.shipping;

    if (!billing || !shipping) {
      return res
        .status(400)
        .json({ error: 'Billing and shipping information are required' });
    }

    if (cartProducts.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    try {
      const session = await CheckoutService.getCheckoutSession(
        cartProducts,
        res.locals.user.id,
      );

      const data = {
        url: session.url,
        total: session.amount_total,
        shipping: await CheckoutService.getFormattedAddress(shipping),
        billing: await CheckoutService.getFormattedAddress(billing),
      };
      res.json(data);
    } catch (error) {
      next(error);
    }
  },
);

CheckoutRouter.get('/success/:id', async (req: Request, res: Response) => {
  const success_url = req.body.success_url;
  res.json(success_url);
});

CheckoutRouter.get('/cancel/:id', async (req: Request, res: Response) => {
  const cancel_url = req.body.cancel_url;
  res.json(cancel_url);
});
