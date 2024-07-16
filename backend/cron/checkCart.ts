import { CronJob } from 'cron';
import { UserService } from '../app/services/UserService';
import { CartService } from '../app/services/CartService';
import { VariantRepository } from '../app/repositories/sql/VariantRepository';
import { HistoryCartProductRepository } from '../app/repositories/sql/HistoryCartProductRepository';

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
        const historyCartProducts =
          await HistoryCartProductRepository.findHistoryCartProductsByCartId(
            cart.id,
          );
        await HistoryCartProductRepository.deleteAllHistoryCartProducts(
          historyCartProducts,
        );
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
          const historyCartProduct = HistoryCartProductRepository.build({
            cartId: cart.id,
            variantId: item.variantId,
            quantity: item.quantity,
            name: item.name,
            image: item.image,
            unitPrice: item.unitPrice,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          await HistoryCartProductRepository.addHistoryCartProduct(
            historyCartProduct,
          );
          await CartService.deleteProductFromCart(user.id, item.variantId);
        }
      }
    }
  }, // onTick
  null, // onComplete
  true, // start
  'Europe/Paris', // timeZone
);
