import { CronJob } from 'cron';
import { UserService } from '../app/services/UserService';
import { CartService } from '../app/services/CartService';
import { VariantRepository } from '../app/repositories/sql/VariantRepository';

export const checkCartExpired = new CronJob(
  // every minute check  if cart is expired and restore stock
  '0 * * * * *',
  async function () {
    const users = await UserService.findAll();

    console.log('checking cart expiration');
    for (const user of users) {
      const cart = await CartService.getCart(user.id);
      if (cart && cart.expiredAt < new Date()) {
        const cartProducts = await CartService.getCartProducts(user.id);

        for (const item of cartProducts) {
          const variant = await VariantRepository.findVariantById(
            item.variantId,
          );
          if (!variant) {
            console.log(`Variant ${item.variantId} not found`);
            continue;
          }

          variant.stock += item.quantity;
          await VariantRepository.update(variant.id, { stock: variant.stock });
        }
        await CartService.deleteProductFromCart(user.id, cart.id);
      }
    }
  }, // onTick
  null, // onComplete
  true, // start
  'Europe/Paris', // timeZone
);
