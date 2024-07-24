<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import CartProduct from '../components/cart/CartProduct.vue'
import { CartApi } from '@/services/cartApi'
import { onMounted, onBeforeUnmount, ref, type Ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CartStore } from '@/store/cart'

// Reactive references
const cartProducts: Ref<CartApi.CartProduct[]> = ref([])
const cartTotal: Ref<number> = ref(0)
const cartTotalItems: Ref<number> = ref(0)
const expirationTime: Ref<Date | null> = ref(null)
const expirationText: Ref<string> = ref('')

// Helper functions
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const updateExpirationText = () => {
  if (!expirationTime.value) return
  const now = Date.now()
  const timeLeft = Math.max(0, Math.floor((expirationTime.value.getTime() - now) / 1000)) // Calculate time left in seconds
  expirationText.value = formatTime(timeLeft)
  if (timeLeft <= 0) {
    clearInterval(intervalId)
  }
}

// Interval management
let intervalId: ReturnType<typeof setInterval>
const startExpirationTimer = () => {
  updateExpirationText()
  intervalId = setInterval(updateExpirationText, 1000)
}

const updateCart = async () => {
  const data = await CartApi.getAll()
  cartProducts.value = data.cartProduct.sort((a, b) => a.id - b.id)
  cartTotal.value = cartProducts.value.reduce((total, product) => total + product.total, 0)
  cartTotalItems.value = cartProducts.value.length
  expirationTime.value = new Date(data.expiredAt)
  startExpirationTimer()
  CartStore().setCart(data)
}

onMounted(async () => {
  await updateCart()
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})

const updateTotal = async () => {
  cartTotal.value = cartProducts.value.reduce((total, product) => total + product.total, 0)
}
</script>

<template>
  <BasePage>
    <div
      class="flex items-start gap-24 self-stretch max-md:flex-col max-md:p-3 md:w-full md:flex-row md:p-20"
    >
      <div class="flex flex-1 flex-col items-start gap-16 text-wrap">
        <!-- left -->
        <div class="flex flex-col items-start gap-4">
          <h1 class="self-stretch text-3xl font-bold">Mon panier</h1>
          <div v-if="cartTotalItems > 0" class="flex items-start gap-1 self-stretch">
            <p>TOTAL ({{ cartTotalItems }} articles)</p>
            <p class="font-bold">{{ cartTotal.toFixed(2) }} €</p>
          </div>
          <div v-if="cartTotalItems > 0" class="flex flex-col items-start gap-1 self-stretch">
            <p>Les articles de votre panier sont réservés pendant 15 minutes</p>

            <div class="flex items-start gap-1 self-stretch">
              <p>Temps restant :</p>
              <p class="font-bold" id="countdown">{{ expirationText }} minutes</p>
            </div>
          </div>
          <div v-else>
            <p>Le panier est vide</p>
          </div>
        </div>
        <CartProduct
          v-for="cartProduct in cartProducts"
          :key="cartProduct.id"
          :image="cartProduct.image"
          :name="cartProduct.name"
          :color="cartProduct.color"
          :size="cartProduct.size"
          :price="cartProduct.unitPrice"
          :quantity="cartProduct.quantity"
          :id="cartProduct.id"
          :stock="cartProduct.stock"
          @updateCart="async () => await updateCart()"
          @updatePrice="() => updateTotal()"
        />
      </div>

      <div class="flex flex-col items-start gap-5 max-md:self-center">
        <!-- right -->
        <div
          v-if="cartTotalItems > 0"
          class="flex flex-col items-center gap-5 self-stretch rounded-lg outline outline-offset-[-1px] outline-black"
        >
          <!-- right top -->
          <router-link
            to="/checkout"
            class="flex items-center gap-3 self-stretch rounded-t-lg bg-black p-3 px-5 text-white"
          >
            <p class="flex flex-1">Commander</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.38223 1.60173C8.11769 1.33718 7.68877 1.33718 7.42422 1.60173C7.15967 1.86628 7.15967 2.2952 7.42422 2.55975L11.6871 6.82267H0.677419C0.303291 6.82267 0 7.12597 0 7.50009C0 7.87422 0.303291 8.17751 0.677419 8.17751H11.6871L7.42422 12.4404C7.15967 12.705 7.15967 13.1339 7.42422 13.3985C7.68877 13.663 8.11769 13.663 8.38223 13.3985L13.8016 7.9791C14.0661 7.71455 14.0661 7.28564 13.8016 7.02109L8.38223 1.60173Z"
                fill="white"
              />
            </svg>
          </router-link>

          <div class="flex flex-col items-start gap-5 self-stretch p-5">
            <p class="text-base font-bold">RÉSUMÉ DE LA COMMANDE</p>

            <div class="flex items-start gap-12 self-stretch">
              <p class="flex flex-1">
                {{ cartTotalItems }} article{{ cartTotalItems > 1 ? 's' : 's' }}
              </p>
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
        <div v-else>
          <button
            type="submit"
            class="flex items-center gap-3 self-stretch bg-black p-3 px-5 text-white"
          >
            <RouterLink to="/search">
              <p class="flex flex-1">Retour à la boutique</p>
            </RouterLink>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.38223 1.60173C8.11769 1.33718 7.68877 1.33718 7.42422 1.60173C7.15967 1.86628 7.15967 2.2952 7.42422 2.55975L11.6871 6.82267H0.677419C0.303291 6.82267 0 7.12597 0 7.50009C0 7.87422 0.303291 8.17751 0.677419 8.17751H11.6871L7.42422 12.4404C7.15967 12.705 7.15967 13.1339 7.42422 13.3985C7.68877 13.663 8.11769 13.663 8.38223 13.3985L13.8016 7.9791C14.0661 7.71455 14.0661 7.28564 13.8016 7.02109L8.38223 1.60173Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        <p class="font-bold">MÉTHODES DE PAIEMENT ACCEPTÉES</p>
        <div class="flex items-start gap-5 max-md:pb-4">
          <img src="../assets/images/cartPaiement_1.png" alt="" />
          <img src="../assets/images/cartPaiement_2.png" alt="" />
          <img src="../assets/images/cartPaiement_3.png" alt="" />
          <img src="../assets/images/cartPaiement_4.png" alt="" />
        </div>
      </div>
      <button
        v-if="cartTotalItems > 0"
        class="fixed bottom-0 left-0 right-0 flex items-center gap-3 self-stretch bg-black p-3 px-5 text-white md:hidden"
      >
        <router-link to="/checkout">
          <p class="flex flex-1">Commander</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.38223 1.60173C8.11769 1.33718 7.68877 1.33718 7.42422 1.60173C7.15967 1.86628 7.15967 2.2952 7.42422 2.55975L11.6871 6.82267H0.677419C0.303291 6.82267 0 7.12597 0 7.50009C0 7.87422 0.303291 8.17751 0.677419 8.17751H11.6871L7.42422 12.4404C7.15967 12.705 7.15967 13.1339 7.42422 13.3985C7.68877 13.663 8.11769 13.663 8.38223 13.3985L13.8016 7.9791C14.0661 7.71455 14.0661 7.28564 13.8016 7.02109L8.38223 1.60173Z"
              fill="white"
            />
          </svg>
        </router-link>
      </button>
    </div>
  </BasePage>
</template>

<style></style>
