import express, { Router } from 'express';
import { Stripe } from 'stripe';
import { StripeService } from '../services/StripeService';

export const StripeRouter = Router();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

StripeRouter.post(
  '/',
  express.raw({ type: 'application/json' }),
  (request, response) => {
    const sig = request.headers['stripe-signature'] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send('verify error');
      return;
    }

    StripeService.handleWebhookEvent(event).catch((err): void => {
      response.status(500).send('Webhook Error ' + err.message);
      return;
    });

    response.json({ received: true });
  },
);
