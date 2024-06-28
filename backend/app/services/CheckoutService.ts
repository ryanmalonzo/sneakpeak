import { CartProduct } from '../models/sql/CartProduct';
import { FormattedAddress, FormattedAddressError } from '../helpers/interfaces';
import axios from 'axios';
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
  ): Promise<Stripe.Checkout.Session> {
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

  public static async getFormattedAddress(
    address: string,
  ): Promise<FormattedAddress | FormattedAddressError> {
    let formattedAddress = {
      street: '',
      city: '',
      state: '',
      country: '',
      zip: '',
    };

    try {
      formattedAddress = await this.formatAddress(address);

      return {
        street: formattedAddress.street,
        city: formattedAddress.city,
        state: formattedAddress.state,
        country: formattedAddress.country,
        zip: formattedAddress.zip,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Invalid address');
    }
  }

  public static async formatAddress(
    address: string,
  ): Promise<FormattedAddress> {
    const config = {
      method: 'get',
      url:
        'https://api.geoapify.com/v1/geocode/search?text=' +
        encodeURIComponent(address) +
        '&apiKey=' +
        process.env.GEOAPIFY_API_KEY,
      headers: {},
    };

    try {
      const response = await axios(config);
      if (response.data.features.length === 0) {
        throw new Error('Invalid address');
      }

      const properties = response.data.features[0].properties;
      return {
        street: properties.street || '',
        city: properties.city || '',
        state: properties.state || '',
        country: properties.country || '',
        zip: properties.postcode || '',
      };
    } catch (error) {
      console.error(error);
      throw new Error('Invalid address');
    }
  }
}
