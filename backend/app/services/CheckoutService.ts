import { CartProduct } from '../models/sql/CartProduct';
import dotenv from 'dotenv';
dotenv.config();

import { Stripe } from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export class CheckoutService {
  public static async getCheckoutSession(
    cartProducts: CartProduct[],
    userId: string,
  ): Promise<any> {
    const products = cartProducts.map((product) => {
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
          },
          unit_amount: product.unitPrice * 100,
        },
        quantity: product.quantity,
      };
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products,
      mode: 'payment',
      cancel_url: 'http://localhost:5173/checkout/cancelled/' + userId,
      success_url: 'http://localhost:5173/checkout/success/' + userId,
    });
    return session;
  }
}
