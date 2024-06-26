import { CartService } from './CartService';

export class StripeService {
  public static async handleWebhookEvent(event: any): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;

        break;
      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object;

        break;
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;

        // Mettre à jour la commande dans la base de données

        // Empty the cart
        CartService.emptyCart(paymentIntentSucceeded.metadata.userId);

        break;
      case 'checkout.session.cancelled':
        const checkoutSessionCancelled = event.data.object;

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
