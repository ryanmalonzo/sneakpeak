import express, { Router } from 'express';
import { Stripe } from 'stripe';
import dotenv from 'dotenv';
import { StripeService } from '../services/StripeService';

export const StripeRouter = Router();
dotenv.config();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

StripeRouter.post(
  '/',
  express.raw({ type: 'application/json' }),
  (request, response) => {
    const sig = request.headers['stripe-signature'];
    console.log('signature', sig);
    console.log('endpointSecret', endpointSecret);

    const event = request.body;

    // try {
    //   event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    // } catch (err) {
    //   response.status(500).send('test');
    //   return;
    // }

    StripeService.handleWebhookEvent(event).catch((err) => {
      console.error(err);
      response.status(500).send('Webhook Error');
    });

    response.json({ received: true });
  },
);
