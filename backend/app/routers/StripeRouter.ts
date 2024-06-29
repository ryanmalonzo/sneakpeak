import { NextFunction, Request, Response, Router } from 'express';
import stripe from 'stripe';
import dotenv from 'dotenv';
import { StripeService } from '../services/StripeService';

export const StripeRouter = Router();
dotenv.config();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

StripeRouter.post(
  '/',
  (request: Request, response: Response, next: NextFunction) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (error) {
      next(error);
    }

    StripeService.handleWebhookEvent(event).catch((err) => {
      console.error(err);
      response.status(500).send('Webhook Error');
    });

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  },
);
