import { CartProduct } from '../models/sql/CartProduct';
import { FormattedAddress, FormattedAddressError } from '../helpers/interfaces';
import dotenv from 'dotenv';
dotenv.config();

import { Stripe } from 'stripe';
import { OrderAddressRepository } from '../repositories/sql/OrderAddressRepository';
import { OrderRepository } from '../repositories/sql/OrderRepository';
import { OrderProductRepository } from '../repositories/sql/OrderProductRepository';
import { Order } from '../models/sql/Order';
import { OrderProduct } from '../models/sql/OrderProduct';
import { OrderAddress } from '../models/sql/OrderAddress';
import { formatAddress } from '../helpers/address';
import { VariantRepository } from '../repositories/sql/VariantRepository';
import { ColorRepository } from '../repositories/sql/ColorRepository';
import { SizeRepository } from '../repositories/sql/SizeRepository';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:5173';

export class CheckoutService {
  public static async getCheckoutSession(
    cartProducts: CartProduct[] | OrderProduct[],
    userId: string,
    reference: string,
  ): Promise<Stripe.Checkout.Session> {
    const taxRate = await stripe.taxRates.create({
      display_name: 'TVA',
      inclusive: false,
      percentage: 20, // For a 20% VAT
      country: 'FR',
      description: 'French VAT',
    });

    // Map through cartProducts to create an array of promises
    const productPromises = cartProducts.map(async (product) => {
      const variant = await VariantRepository.findVariantById(
        product.variantId,
      );
      if (!variant) throw new Error('Variant not found');

      const color = await ColorRepository.findColorById(variant.colorId);
      if (!color) throw new Error('Color not found');

      const size = await SizeRepository.findSizeById(variant.sizeId);
      if (!size) throw new Error('Size not found');

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            description: `${color.name} - ${size.name}`,
          },
          unit_amount: parseInt((product.unitPrice * 100).toFixed(0)),
        },
        quantity: product.quantity,
        tax_rates: [taxRate.id],
      };
    });
    const lineItems = await Promise.all(productPromises);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      invoice_creation: {
        enabled: true,
      },
      metadata: { userId: userId },
      line_items: lineItems,
      mode: 'payment',
      cancel_url: `${WEBAPP_URL}/checkout/cancel/${reference}`,
      success_url: `${WEBAPP_URL}/checkout/success/${reference}`,
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
    userId: number,
    status: string,
    paymentStatus: string,
    invoice_link: string | null = null,
    payment_intent: string | null = null,
  ): Promise<Order> {
    const order = await OrderRepository.findByReference(reference, userId);
    if (!order) throw new Error('Order not found');
    order.status = status;
    order.payment_status = paymentStatus;
    invoice_link ? (order.invoice_link = invoice_link) : null;
    payment_intent ? (order.payment_intent = payment_intent) : null;
    return await OrderRepository.update(order);
  }

  public static async createOrderProduct(
    orderId: number,
    variantId: number,
    quantity: number,
    name: string,
    image: string,
    unitPrice: number,
  ): Promise<OrderProduct> {
    const new_order_product = OrderProductRepository.build({
      orderId: orderId,
      variantId: variantId,
      quantity: quantity,
      name: name,
      image: image,
      unitPrice: unitPrice,
    });
    await OrderProductRepository.create(new_order_product);
    return new_order_product;
  }

  public static async findOrderAddressById(
    orderId: number,
    type: string,
  ): Promise<OrderAddress | null> {
    return await OrderAddressRepository.findOrderAddressByOrderId(
      orderId,
      type,
    );
  }

  public static async saveAddress(
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
      formattedAddress = await formatAddress(address);
      const newAddress = OrderAddressRepository.build({
        street: formattedAddress.street,
        city: formattedAddress.city,
        postal_code: formattedAddress.zip,
        phone: phone,
        name: name,
        type: type,
        orderId: orderId,
      });

      await OrderAddressRepository.save(newAddress);
      return {
        street: formattedAddress.street,
        city: formattedAddress.city,
        state: formattedAddress.state,
        country: formattedAddress.country,
        zip: formattedAddress.zip,
      };
    } catch (error) {
      throw new Error('Invalid address');
    }
  }
}
