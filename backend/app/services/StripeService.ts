import { OrderRepository } from '../repositories/sql/OrderRepository';
import { CartService } from './CartService';
import { CheckoutService } from './CheckoutService';
import Stripe from 'stripe';

export class StripeService {
  public static async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    console.log('Received event', event);
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSessionCompleted = event.data.object;

        if (!checkoutSessionCompleted.metadata) {
          console.error('User id not found in checkout session');
          return;
        }

        if (!checkoutSessionCompleted.metadata.userId) {
          console.error('User id not found in checkout session');
          return;
        }
        const order = await OrderRepository.findBySessionId(
          checkoutSessionCompleted.id,
        );
        if (!order) {
          break;
        }
        CheckoutService.updateOrder(order.reference, 'completed', 'paid');

        // Empty the cart
        CartService.emptyCart(
          parseInt(checkoutSessionCompleted.metadata.userId),
        );

        break;
      }
      case 'checkout.session.expired': {
        const checkoutSessionCancelled = event.data.object;
        CheckoutService.updateOrder(
          'sneakpeak-' + checkoutSessionCancelled.id,
          'expired',
          'unpaid',
        );

        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
