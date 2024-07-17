<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import MenuProfil from '@/components/profile/MenuProfil.vue'
import { useRoute } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import { OrderApi, type IOrder } from '@/services/orderApi'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const route = useRoute()
const order = ref<IOrder | undefined>(undefined)
const error = ref<string | undefined>(undefined)

onBeforeMount(async () => {
  const orderId = route.params.reference as string
  try {
    order.value = await OrderApi.loadOrder(orderId)
  } catch (e) {
    error.value = 'Commande introuvable'
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Commande introuvable',
      life: 3000
    })
  }
})
</script>

<template>
  <BasePage>
    <div
      class="flex flex-col justify-between gap-6 p-4 md:p-6 lg:flex-row lg:gap-[45px] lg:p-10"
      v-if="order"
    >
      <div class="w-full lg:w-3/4">
        <h2 class="mb-6 text-2xl font-medium md:text-3xl">Ma commande</h2>

        <div class="mb-6 rounded-lg bg-white shadow">
          <div
            class="flex flex-col justify-between rounded-t-lg bg-gray-100 p-4 md:flex-row md:p-5"
          >
            <div class="mb-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:mb-0 md:grid-cols-4">
              <div class="flex flex-col">
                <span class="font-light">Commandé le :</span>
                <p class="truncate">
                  {{ new Date(order.order.createdAt).toLocaleDateString() }}
                </p>
              </div>

              <div class="flex flex-col">
                <span class="font-light">Total:</span>
                <p class="truncate">{{ order.order.total }} €</p>
              </div>

              <div class="flex flex-col">
                <span class="font-light">Livré à :</span>
                <p class="">
                  {{ order.shipping.name }} {{ order.shipping.city }} {{ order.shipping.street }}
                  {{ order.shipping.postal_code }}
                </p>
              </div>

              <div class="flex flex-col">
                <span class="font-light">Facturé à :</span>
                <p class="">
                  {{ order.billing.name }} {{ order.billing.city }} {{ order.billing.street }}
                  {{ order.billing.postal_code }}
                </p>
              </div>
            </div>

            <div class="mt-4 flex flex-col justify-between md:mt-0">
              <p class="truncate">
                <span class="font-light">Ref : {{ order.order.reference }}</span>
              </p>
              <div class="mt-4 flex flex-wrap gap-4">
                <button class="text-black underline" v-if="order.order.payment_status == 'paid'">
                  <a :href="order.order.invoice_link" target="_blank"> Voir la facture </a>
                </button>
                <button class="text-black underline" v-else>
                  <a :href="order.order.linkPaiement" target="_blank"> Payer la commande </a>
                </button>
                <button class="text-black underline" v-if="order.order.payment_status == 'paid'">
                  Commander à nouveau
                </button>
              </div>
            </div>
          </div>

          <div
            v-for="item in order.products"
            :key="item.id"
            class="mb-4 flex flex-col p-4 sm:flex-row"
          >
            <img
              :src="item.image"
              alt=""
              class="mb-4 h-[130px] w-full object-cover sm:mb-0 sm:mr-4 sm:w-[130px]"
            />
            <div class="flex w-full flex-col justify-between sm:flex-row">
              <div class="mb-4 flex flex-col justify-between sm:mb-0">
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-gray-600">Couleur : {{ item.color }}</p>
                <p class="text-gray-600">Taille : {{ item.size }}</p>
                <p class="text-gray-600">{{ item.quantity }} x {{ item.unit_price }} €</p>
              </div>
              <div class="self-end sm:self-center">
                <button class="text-black underline">Retourner un article</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-1/4">
        <MenuProfil />
      </div>
    </div>
    <div v-else class="flex h-[80vh] w-full items-center justify-center">
      <h1 class="">{{ error }}</h1>
    </div>
  </BasePage>
</template>

<style></style>
