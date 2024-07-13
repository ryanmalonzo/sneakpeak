import { CartProduct } from '../models/sql/CartProduct';
import { FormattedAddress, FormattedAddressError } from '../helpers/interfaces';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

import { Stripe } from 'stripe';
import { OrderAddressRepository } from '../repositories/sql/OrderAddressRepository';
import { OrderRepository } from '../repositories/sql/OrderRepository';
import { OrderProductRepository } from '../repositories/sql/OrderProductRepository';
import { Order } from '../models/sql/Order';
import { OrderProduct } from '../models/sql/OrderProduct';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export class CheckoutService {
  public static async getCheckoutSession(
    cartProducts: CartProduct[] | OrderProduct[],
    userId: string,
    reference: string,
  ): Promise<Stripe.Checkout.Session> {
    const products = cartProducts.map((product) => {
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
          },
          unit_amount: parseInt((product.unitPrice * 100).toFixed(0)),
        },
        quantity: product.quantity,
      };
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      metadata: { userId: userId },
      line_items: products,
      mode: 'payment',
      cancel_url: 'http://localhost:5173/checkout/cancel/' + reference,
      success_url: 'http://localhost:5173/checkout/success/' + reference,
    });
    return session;
  }

  public static async getCheckoutSessionByOrderId(
    orderId: number,
  ): Promise<Stripe.Checkout.Session> {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new Error('Order not found');
    return await stripe.checkout.sessions.retrieve(order.session_id);
  }

  public static async getCheckoutSessionById(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    return await stripe.checkout.sessions.retrieve(sessionId);
  }
  public static async createOrder(
    total: number,
    reference: string,
    session_id: string,
    userId: number,
  ): Promise<Order> {
    console.log(total, reference, userId);
    const new_order = OrderRepository.build({
      total: total / 100,
      status: 'pending',
      payment_status: 'pending',
      reference: reference,
      userId: userId,
      session_id: session_id,
    });

    return await OrderRepository.create(new_order);
  }

  public static async updateOrder(
    reference: string,
    status: string,
    paymentStatus: string,
  ): Promise<Order> {
    const order = await OrderRepository.findByReference(reference);
    if (!order) throw new Error('Order not found');
    order.status = status;
    order.payment_status = paymentStatus;
    return await OrderRepository.update(order);
  }

  public static async createOrderProduct(
    orderId: number,
    variantId: number,
    quantity: number,
    name: string,
    unitPrice: number,
  ): Promise<OrderProduct> {
    const new_order_product = OrderProductRepository.build({
      orderId: orderId,
      variantId: variantId,
      quantity: quantity,
      name: name,
      unitPrice: unitPrice,
    });
    await OrderProductRepository.create(new_order_product);
    return new_order_product;
  }

  public static async saveAdress(
    address: string,
    name: string,
    phone: string,
    type: string,
    orderId: number,
  ): Promise<FormattedAddress | FormattedAddressError> {
    let formattedAddress = {
      street: '',
      city: '',
      state: '',
      country: '',
      zip: '',
    };

    try {
      formattedAddress = await this._formatAddress(address);
      const new_address = OrderAddressRepository.build({
        street: formattedAddress.street,
        city: formattedAddress.city,
        postal_code: formattedAddress.zip,
        phone: phone,
        name: name,
        type: type,
        orderId: orderId,
      });

      await OrderAddressRepository.save(new_address);
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

  private static async _formatAddress(
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
