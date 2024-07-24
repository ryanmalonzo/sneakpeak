<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import MenuProfil from '@/components/profile/MenuProfil.vue'
import { useRoute } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import { type IProductReturn, OrderApi, type IOrder } from '@/services/orderApi'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const toast = useToast()

const route = useRoute()
const order = ref<IOrder | undefined>(undefined)
const error = ref<string | undefined>(undefined)
const modal = ref(false)
const modalRefund = ref(false)
const productRefund = ref<IProductReturn | undefined>(undefined)
const productId = ref('')
const reason = ref('')

const returnProduct = async () => {
  try {
    await OrderApi.returnProduct(productId.value, reason.value)
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Votre demande de retour a bien été prise en compte',
      life: 3000
    })
    order.value = await OrderApi.loadOrder(route.params.reference as string)
    if (order.value) {
      order.value.products = order.value.products.sort((a, b) => parseInt(a.id) - parseInt(b.id))
    }
    modalRefund.value = false
    modal.value = false
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Impossible de retourner l'article",
      life: 3000
    })
  }
}

onBeforeMount(async () => {
  const orderId = route.params.reference as string
  try {
    order.value = await OrderApi.loadOrder(orderId)
    // trier par id pour avoir le même ordre que la commande
    if (order.value) {
      order.value.products = order.value.products.sort((a, b) => parseInt(a.id) - parseInt(b.id))
    }
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

const openModal = async (id: string, isRefund: boolean) => {
  if (isRefund) {
    productId.value = id
    modal.value = true
    productRefund.value = await OrderApi.loadProductReturn(parseInt(id))
  } else {
    productId.value = id
    modalRefund.value = true
  }
}

const status = (status: string) => {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'approved':
      return 'Remboursé accepté'
    case 'rejected':
      return 'Remboursé refusé'
    case 'completed':
      return 'Remboursé'
    default:
      return status
  }
}

const reOrder = async () => {
  try {
    const data = await OrderApi.reOrder(order.value?.order.reference as string)
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Vous allez être redirigé vers le paiement',
      life: 3000
    })
    window.location.href = data.url
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail:
        (e as Error).message ??
        'Une erreur est survenue lors du traitement de votre commande. Veuillez recommencer la commande depuis le début. Si le problème persiste, contactez notre service client.',
      life: 3000
    })
  }
}
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
                <button
                  class="text-black underline"
                  v-if="order.order.payment_status == 'paid'"
                  @click="reOrder"
                >
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
                <p class="text-gray-600">{{ item.quantity }} x {{ item.unitPrice }} €</p>
              </div>
              <div class="self-end sm:self-center">
                <p
                  class="cursor-pointer text-black underline"
                  @click="openModal(item.id, item.isRefund)"
                  v-if="order.order.status == 'completed' && item.isRefund == false"
                >
                  Retourner un article
                </p>

                <p
                  v-if="item.isRefund"
                  class="cursor-pointer text-black underline"
                  @click="openModal(item.id, item.isRefund)"
                >
                  Voir le statut du remboursement
                </p>
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

  <Dialog
    v-model:visible="modalRefund"
    modalRefund
    :header="`Retourner l'article ${order?.products.find((p) => p.id === productId)?.name}`"
  >
    <strong class="mb-4 text-red-500">
      Si votre achat a été effectué, il y a moins de 14 jours, vous pouvez retourner votre article.
      Sinon votre demande sera soumise à l'approbation de notre service client.
    </strong>

    <div class="mt-4 flex flex-col gap-2">
      <label for="reason">Raison du retour</label>
      <Textarea id="reason" v-model="reason" rows="4" />
    </div>

    <template #footer>
      <Button
        label="Annuler"
        outlined
        severity="secondary"
        @click="modalRefund = false"
        autofocus
      />
      <Button label="Envoyer" outlined severity="secondary" @click="returnProduct" autofocus />
    </template>
  </Dialog>

  <Dialog
    v-model:visible="modal"
    modal
    :header="`Statut du remboursement de l'article ${order?.products.find((p) => p.id === productId)?.name}`"
  >
    <p><strong>Statut du remboursement :</strong> {{ status(productRefund?.status ?? '') }}</p>
  </Dialog>
</template>

<style></style>
