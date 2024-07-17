<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import Checkbox from 'primevue/checkbox'
import AutoComplete from 'primevue/autocomplete'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import axios from 'axios'
import { onMounted, onBeforeUnmount, reactive, ref, type Ref, watch } from 'vue'
import { CheckoutApi } from '@/services/checkoutApi'
import { CartStore } from '@/store/cart'
import { CartApi } from '@/services/cartApi'
import { useToast } from 'primevue/usetoast'

interface GeoapifyFeatureProperties {
  formatted: string
}

interface GeoapifyFeature {
  properties: GeoapifyFeatureProperties
}
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY
const isBilling = ref(false)
const filteredShippingAdress = ref([])
const shipping = reactive({
  firstName: '',
  lastName: '',
  address: '',
  phone: ''
})
const filteredBillingAdress = ref([])
const billing = reactive({
  firstName: '',
  lastName: '',
  address: '',
  phone: ''
})

watch(isBilling, (newVal) => {
  if (newVal) {
    billing.firstName = shipping.firstName
    billing.lastName = shipping.lastName
    billing.address = shipping.address
    billing.phone = shipping.phone
  }
})

watch(shipping, async (newVal) => {
  if (newVal.address.length > 3) {
    console.log(newVal.address)
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${newVal.address}&apiKey=${GEOAPIFY_API_KEY}`
      )
      console.log(response.data)
      filteredShippingAdress.value = response.data.features.map(
        (feature: GeoapifyFeature) => feature.properties.formatted
      )
    } catch (error) {
      console.error(error)
    }
  } else {
    filteredShippingAdress.value = []
  }
})

watch(billing, async (newVal) => {
  if (newVal.address.length > 3 && !isBilling.value) {
    console.log(newVal.address)
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${newVal.address}&apiKey=${GEOAPIFY_API_KEY}`
      )
      console.log(response.data)
      filteredBillingAdress.value = response.data.features.map(
        (feature: GeoapifyFeature) => feature.properties.formatted
      )
    } catch (error) {
      console.error(error)
    }
  } else {
    filteredBillingAdress.value = []
  }
})

const toast = useToast()
const onSubmit = async () => {
  if (!shipping.firstName || !shipping.lastName || !shipping.address || !shipping.phone) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Veuillez remplir tous les champs de l'adresse de livraison"
    })
    return
  }

  if (
    !isBilling.value &&
    (!billing.firstName || !billing.lastName || !billing.address || !billing.phone)
  ) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Veuillez remplir tous les champs de l'adresse de facturation"
    })
    return
  }
  if (isBilling.value) {
    billing.address = shipping.address
    billing.firstName = shipping.firstName
    billing.lastName = shipping.lastName
    billing.phone = shipping.phone
  }
  const data: CheckoutApi.CheckoutOut = await CheckoutApi.create({
    shipping,
    billing
  })

  if (data.url !== undefined) window.location.href = data.url

  console.log(data)
}

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
let intervalId: number
const startExpirationTimer = () => {
  updateExpirationText()
  intervalId = setInterval(updateExpirationText, 1000)
}

const updateCart = async () => {
  console.log('updateCart')
  const data = await CheckoutApi.getCheckoutProduct()
  cartProducts.value = data.cartProduct.sort((a, b) => a.id - b.id)
  cartTotal.value = cartProducts.value.reduce((total, product) => total + product.total, 0)
  cartTotalItems.value = cartProducts.value.length
  expirationTime.value = new Date(data.expiredAt)
  startExpirationTimer()
  CartStore().setCart(data)
}

onMounted(async () => {
  await updateCart()
  console.log(cartProducts.value)
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <BasePage>
    <div
      class="flex items-start justify-around self-stretch max-md:flex-col max-md:gap-12 max-md:p-3 md:w-full md:flex-row md:gap-24 md:p-20"
    >
      <div class="flex flex-col items-start text-wrap md:gap-8">
        <!-- Adresse de livraison -->
        <div class="bg-white">
          <div class="flex w-fit flex-1 flex-col">
            <button
              type="button"
              class="flex items-center gap-3 self-stretch bg-black p-3 px-5 text-white"
            >
              <RouterLink to="/cart">
                <p class="flex flex-1">Retour au panier</p>
              </RouterLink>
            </button>
            <div class="flex items-start gap-1 self-stretch py-10">
              <p>Temps restant :</p>
              <p class="font-bold" id="countdown">{{ expirationText }} minutes</p>
            </div>
          </div>
          <h2 class="mb-8 text-2xl font-bold">Adresse de livraison</h2>
          <div class="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatLabel>
              <InputText id="first-name" v-model="shipping.firstName" class="max-md:w-full" />
              <label for="first-name">Prénom</label>
            </FloatLabel>

            <FloatLabel>
              <InputText id="last-name" v-model="shipping.lastName" class="max-md:w-full" />
              <label for="last-name">Nom</label>
            </FloatLabel>
          </div>
          <div class="my-8">
            <FloatLabel>
              <InputText id="phone-number" v-model="shipping.phone" class="w-full" />
              <label for="phone-number">Numéro de téléphone</label>
            </FloatLabel>
          </div>
          <div class="my-8">
            <FloatLabel>
              <AutoComplete
                v-model="shipping.address"
                :suggestions="filteredShippingAdress"
                placeholder="Commencez à taper votre adresse ou code postal"
                inputClass="w-full"
                class="w-full"
              />
              <label for="delivery-address">Adresse</label>
            </FloatLabel>
          </div>

          <div class="flex flex-wrap">
            <div class="flex md:gap-4">
              <label for="isBilling">Utiliser la même adresse pour la facturation</label>
              <Checkbox v-model="isBilling" :binary="true" inputId="isBilling" />
            </div>
          </div>
        </div>
        <div class="bg-white" v-if="isBilling === false">
          <h2 class="mb-8 text-2xl font-bold">Adresse de facturation</h2>
          <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatLabel>
              <InputText id="first-name" v-model="billing.firstName" class="max-md:w-full" />
              <label for="first-name">Prénom</label>
            </FloatLabel>
            <FloatLabel>
              <InputText id="last-name" v-model="billing.lastName" class="max-md:w-full" />
              <label for="last-name">Nom</label>
            </FloatLabel>
          </div>
          <div class="mb-8">
            <FloatLabel>
              <InputText id="phone-number" v-model="billing.phone" class="w-full" />
              <label for="phone-number">Numéro de téléphone</label>
            </FloatLabel>
          </div>
          <div class="mb-8">
            <FloatLabel>
              <AutoComplete
                v-model="billing.address"
                :suggestions="filteredBillingAdress"
                placeholder="Commencez à taper votre adresse ou code postal"
                inputClass="w-full"
                class="w-full"
              />
              <label for="delivery-address">Adresse</label>
            </FloatLabel>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-start gap-5 max-md:self-center">
        <!-- right -->
        <div
          v-if="cartTotalItems > 0"
          class="flex flex-col items-center gap-5 self-stretch rounded-lg border border-black"
        >
          <!-- right top -->
          <button
            @click="onSubmit"
            class="flex items-center gap-3 self-stretch bg-black p-3 px-5 text-white"
          >
            <p class="flex flex-1">PAYER</p>
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
            <p class="text-base font-bold">VOTRE COMMANDE</p>
            <div class="flex flex-col items-start gap-5 self-stretch p-5">
              <div
                v-for="product in cartProducts"
                :key="product.id"
                class="flex items-start gap-5 self-stretch"
              >
                <img :src="product.image" alt="" class="h-20 w-20 object-cover" />
                <div class="flex flex-col items-start gap-5 self-stretch">
                  <p class="font-bold">{{ product.name }}</p>
                  <p>{{ product.quantity }} x {{ product.unitPrice.toFixed(2) }} €</p>
                </div>
              </div>
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
    </div>
  </BasePage>
</template>

<style></style>
