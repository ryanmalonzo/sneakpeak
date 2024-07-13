import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { CheckoutService } from '../services/CheckoutService';
import { CartService } from '../services/CartService';
import { CartRepository } from '../repositories/mongodb/CartRepository';
import { VariantRepository } from '../repositories/sql/VariantRepository';
import { auth } from '../middlewares/auth';

dotenv.config();

export const CheckoutRouter = Router();

CheckoutRouter.get('/', auth, async (req: Request, res: Response) => {
  const cartProducts = await CartRepository.findByUserId(res.locals.user.id);
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

    for (const item of cartProducts) {
      const cart = await CartService.getCart(res.locals.user.id);
      if (!cart) {
        return res.status(400).json({ error: 'Cart not found' });
      }
      if (cart.expiredAt < new Date()) {
        const variant = await VariantRepository.findVariantById(item.variantId);
        if (!variant) {
          return res.status(400).json({ error: 'Variant not found' });
        }
        if (item.quantity > variant.stock) {
          return res.status(400).json({
            error: `Not enough stock for ${item.id}`,
          });
        }
      }
    }
    try {
      const session = await CheckoutService.getCheckoutSession(
        cartProducts,
        res.locals.user.id,
      );

      const order = await CheckoutService.createOrder(
        session.amount_total as number,
        session.id as string,
        parseInt(res.locals.user.id),
      );

      for (const item of cartProducts) {
        await CheckoutService.createOrderProduct(
          order.id,
          item.variantId,
          item.quantity,
          item.name,
          item.unitPrice,
        );
      }

      const data = {
        url: session.url,
        total: session.amount_total,
        shipping: await CheckoutService.saveAdress(
          shipping.address,
          shipping.firstName + ' ' + shipping.lastName,
          shipping.phone,
          'shipping',
          order.id,
        ),
        billing: await CheckoutService.saveAdress(
          billing.address,
          billing.firstName + ' ' + billing.lastName,
          billing.phone,
          'billing',
          order.id,
        ),
      };
      res.json(data);
    } catch (error) {
      next(error);
    }
  },
);

CheckoutRouter.get('/success', async (req: Request, res: Response) => {
  const success_url = req.body.success_url;
  res.json(success_url);
});

CheckoutRouter.get('/cancel', async (req: Request, res: Response) => {
  const cancel_url = req.body.cancel_url;
  res.json(cancel_url);
});
