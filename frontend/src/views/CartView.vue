<script setup lang="ts">
import BasePage from '@/components/BasePage.vue';
import CardProduct from '../components/cart/CartProduct.vue';
import { CartApi } from '@/services/cartApi';
import { onMounted, onBeforeUnmount, ref, type Ref } from 'vue';

// Reactive references
const cartProducts: Ref<CartApi.CartProduct[] | undefined> = ref([]);
const cartTotal: Ref<number> = ref(0);
const cartTotalItems: Ref<number> = ref(0);
const expirationTime: Ref<Date | null> = ref(null);
const expirationText: Ref<string> = ref('');

// Helper functions
const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const updateExpirationText = () => {
    if (!expirationTime.value) return;
    const now = Date.now();
    const timeLeft = Math.max(0, Math.floor((expirationTime.value.getTime() - now) / 1000)); // Calculate time left in seconds
    expirationText.value = formatTime(timeLeft);
    if (timeLeft <= 0) {
        clearInterval(intervalId);
    }
}

// Interval management
let intervalId: number;
const startExpirationTimer = () => {
    updateExpirationText();
    intervalId = setInterval(updateExpirationText, 1000);
}

const updateCart = async () => {
    console.log('updateCart');
    const data = await CartApi.getAll();
    cartProducts.value = data.cartProduct;
    cartTotal.value = cartProducts.value.reduce((total, product) => total + product.total, 0);
    cartTotalItems.value = cartProducts.value.length;
    expirationTime.value = new Date(data.expiredAt);
    startExpirationTimer();
}

onMounted(async () => {
    await updateCart();
    console.log(cartProducts.value);
});

onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId);
});
</script>


<template>
    <BasePage>
        <div class="max-md:p-3 md:p-20 gap-24 flex max-md:flex-col md:flex-row self-stretch items-start md:w-full">



            <div class="flex-col flex gap-16 flex-1 items-start text-wrap"> <!-- left -->
                <div class="flex flex-col items-start gap-4">
                    <h1 class="self-stretch text-3xl font-bold">Mon panier</h1>
                    <div class="flex items-start gap-1 self-stretch">
                        <p>TOTAL ({{ cartTotalItems }} articles)</p>
                        <p class="font-bold"> {{ cartTotal.toFixed(2) }} €</p>
                    </div>
                    <p>Les articles de votre panier sont réservés pendant 15 minutes</p>
                    <div class="flex items-start gap-1 self-stretch">
                        <p>Temps restant :</p>
                        <p class="font-bold" id="countdown"> {{ expirationText }} minutes</p>
                    </div>
                </div>
                <CardProduct v-for="cartProduct in cartProducts" :key="cartProduct.id" :image="cartProduct.image"
                    :name="cartProduct.name" :color="cartProduct.color" :size="cartProduct.size"
                    :price="cartProduct.unitPrice" :quantity="cartProduct.quantity" :id="cartProduct.id"
                    @updateCart="async () => await updateCart()" />

            </div>

            <div class="flex flex-col items-start gap-5 max-md:self-center"> <!-- right -->
                <div class="flex gap-5 flex-col self-stretch items-center border border-black rounded-lg">
                    <!-- right top -->

                    <button type="submit" class="bg-black text-white p-3 px-5 flex items-center self-stretch gap-3">
                        <p class="flex-1 flex">Commander</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M8.38223 1.60173C8.11769 1.33718 7.68877 1.33718 7.42422 1.60173C7.15967 1.86628 7.15967 2.2952 7.42422 2.55975L11.6871 6.82267H0.677419C0.303291 6.82267 0 7.12597 0 7.50009C0 7.87422 0.303291 8.17751 0.677419 8.17751H11.6871L7.42422 12.4404C7.15967 12.705 7.15967 13.1339 7.42422 13.3985C7.68877 13.663 8.11769 13.663 8.38223 13.3985L13.8016 7.9791C14.0661 7.71455 14.0661 7.28564 13.8016 7.02109L8.38223 1.60173Z"
                                fill="white" />
                        </svg>
                    </button>

                    <div class="flex gap-5 flex-col items-start self-stretch p-5">
                        <p class="font-bold text-base">RÉSUMÉ DE LA COMMANDE</p>

                        <div class="flex items-start gap-12 self-stretch">
                            <p class="flex flex-1"> {{ cartTotalItems }} article{{ cartTotalItems > 1 ? "s" : "s" }}</p>
                            <p class="flex flex-1">{{ cartTotal.toFixed(2) }} €</p>

                        </div>
                        <div class="flex items-start gap-12 self-stretch">
                            <p class="flex flex-1">Livraison</p>
                            <p class="flex flex-1">Gratuite</p>
                        </div>
                        <div class="flex items-start gap-12 self-stretch">
                            <p class="flex flex-1 font-bold">Total</p>
                            <p class="flex flex-1">{{ cartTotal.toFixed(2) }} €</p>
                        </div>

                    </div>


                </div>
                <p class="font-bold">MÉTHODES DE PAIEMENT ACCEPTÉES</p>
                <div class="flex gap-5 items-start max-md:pb-4">
                    <img src="../assets/images/cartPaiement_1.png" alt="" />
                    <img src="../assets/images/cartPaiement_2.png" alt="" />
                    <img src="../assets/images/cartPaiement_3.png" alt="" />
                    <img src="../assets/images/cartPaiement_4.png" alt="" />
                </div>

            </div>
            <button
                class="md:hidden right-0 left-0 bottom-0 fixed bg-black text-white p-3 px-5 flex items-center self-stretch gap-3">
                <p class="flex-1 flex">Commander</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M8.38223 1.60173C8.11769 1.33718 7.68877 1.33718 7.42422 1.60173C7.15967 1.86628 7.15967 2.2952 7.42422 2.55975L11.6871 6.82267H0.677419C0.303291 6.82267 0 7.12597 0 7.50009C0 7.87422 0.303291 8.17751 0.677419 8.17751H11.6871L7.42422 12.4404C7.15967 12.705 7.15967 13.1339 7.42422 13.3985C7.68877 13.663 8.11769 13.663 8.38223 13.3985L13.8016 7.9791C14.0661 7.71455 14.0661 7.28564 13.8016 7.02109L8.38223 1.60173Z"
                        fill="white" />
                </svg>
            </button>
        </div>



    </BasePage>
</template>

<style></style>