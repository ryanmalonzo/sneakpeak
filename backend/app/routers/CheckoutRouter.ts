import { Router } from 'express';
import dotenv from 'dotenv';
import { CheckoutService } from '../services/CheckoutService';
import { CartService } from '../services/CartService';
import { auth } from '../middlewares/auth';

dotenv.config();

export const CheckoutRouter = Router();

CheckoutRouter.get('/', auth, async (req, res) => {
  const cartProducts = await CartService.getCartProducts(res.locals.user.id);

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
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

CheckoutRouter.get('/success/:id', async (req, res) => {
  const success_url = req.body.success_url;
  res.json(success_url);
});

CheckoutRouter.get('/cancelled/:id', async (req, res) => {
  const cancel_url = req.body.cancel_url;
  res.json(cancel_url);
});
