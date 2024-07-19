<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import ColorButton from '@/components/sneakers/ColorButton.vue'
import SizeCard from '@/components/sneakers/SizeCard.vue'
import { SneakerApi } from '@/services/sneakerApi'
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'
import { useDialog } from 'primevue/usedialog'
import { CartStore } from '@/store/cart'
import { profileStore } from '@/store/profile'
import AppLogin from '@/components/AppLogin.vue'

const MAX_QUANTITY_DISPLAYED = 5

const router = useRouter()
const route = useRoute()
const cart = CartStore() //Store cart
const profile = profileStore() //Store profile
const toast = useToast()
const dialog = useDialog()

let sneaker = ref<SneakerApi.SneakerOut | undefined>(undefined)
const selectedColor = ref<string>(route.query.color as string)
const selectedSize = ref<SneakerApi.SizeOut>()

const sizeList = ref<SneakerApi.SizeOut[]>([])
const selectedQuantity = ref<{ quantity: number }>()

onBeforeMount(async () => {
  sneaker.value = await SneakerApi.getOne(route.params.slugSneaker as string)

  if (!selectedColor.value) {
    selectedColor.value = sneaker.value?.variants[0].name
  }
  // preselectionner la bonne taille parmis les tailles de la variante
  if (selectedColor.value) {
    const querySizeName = route.query.size as string
    selectedSize.value = sneaker.value?.variants.find((variant) => variant.name === selectedColor.value)?.sizes.find(
      (size) => size.name === querySizeName
    )
  }
})

const selectColor = (color: string) => {
  resetSelectedSize()
  selectedColor.value = color
}

const selectSize = (size: SneakerApi.SizeOut) => {
  resetSelectedQuantity()
  selectedSize.value = size
}
const resetSelectedSize = () => {
  selectedSize.value = undefined
}
const resetSelectedQuantity = () => {
  selectedQuantity.value = undefined
}

const changeRouteColor = (color: string | undefined, size: string | undefined) => {
  if (color === undefined) return
  router.push({ query: { color, size } })
}

const selectedVariant = computed(() => {
  resetSelectedQuantity()
  changeRouteColor(selectedColor.value, selectedSize.value?.name)
  return sneaker.value?.variants.find((variant) => variant.name === selectedColor.value)
})

// Permet de réinitialiser la liste des tailles (à chaque changement de couleur),
// m'enlever si un jour le back renvoie toutes les tailles même avec un stock à zéro
const resetSizeList = () => {
  sizeList.value = [
    { idRef: 0, _id: '', id: 0, name: '34', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '35', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '36', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '37', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '38', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '39', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '40', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '41', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '42', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '43', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '44', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '45', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '46', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '47', slug: '', stock: 0 },
    { idRef: 0, _id: '', id: 0, name: '48', slug: '', stock: 0 }
  ]
}

//Permet de mettre à jour la liste des tailles en fonction de la couleur sélectionnée
// m'enlever si un jour le back renvoie toutes les tailles même avec un stock à zéro
const newSizeList = computed(() => {
  resetSizeList()
  sizeList.value.forEach((size) => {
    if (selectedVariant.value?.sizes) {
      for (const taille of selectedVariant.value.sizes) {
        if (size.name === taille.name) {
          Object.assign(size, taille)
        }
      }
    }
  })
  return sizeList.value
})

const openLoginModal = () => {
  dialog.open(AppLogin, { props: { dismissableMask: true, modal: true, header: "Connexion" } })
}

const onSubmit = async () => {
  if (selectedSize.value === undefined || selectedQuantity.value === undefined) {
    return
  }

  try {
    await cart.addProduct(selectedSize.value.idRef, selectedQuantity.value.quantity)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Produit ajouté au panier !',
      life: 3000
    })
    resetSelectedSize()
  } catch (error) {
    openLoginModal()
  }
}
</script>

<template>
  <BasePage>
    <div v-if="sneaker" class="flex w-full flex-col justify-around gap-20 p-8">
      <!-- Haut page produit -->
      <main class="flex justify-around gap-4 max-lg:flex-col">
        <!-- Image produit -->
        <section class="border--100 flex-1 rounded-2xl border p-2">
          <div class="flex h-full items-center rounded-xl bg-zinc-100 p-2">
            <img :src="selectedVariant?.image" :alt="selectedVariant?.slug" class="h-full w-full object-cover" />
          </div>
        </section>

        <!-- Main Infos produit -->
        <section class="flex flex-1 flex-col justify-around gap-2 p-4 max-sm:p-0">
          <h1 class="text-2xl text-orange-600">NOUVELLE ARRIVÉE !</h1>
          <h1 class="text-4xl font-medium">{{ sneaker.name }}</h1>

          <div class="flex items-baseline gap-2">
            <h2 class="text-title">Catégorie:</h2>
            <p>{{ sneaker.category }}</p>
          </div>

          <!-- Marque + note + nombre de ventes -->
          <div class="flex flex-wrap items-center gap-2">
            <div class="flex h-8 min-h-8 w-8 min-w-8 items-center rounded-full border border-slate-400 bg-white p-1">
              <img src="../assets/images/logo_nike.png" alt="logo marque" class="" />
            </div>
            <p class="font-medium">{{ sneaker.brand }}</p>
            <img src="../assets/images/pastille_bleu.png" alt="logo certificat" class="h-6 w-6" />
            <div class="h-2 min-h-2 w-2 min-w-2 rounded-full bg-slate-200"></div>
            <img src="../assets/images/logo_star.png" alt="logo étoile" class="h-5 w-5" />
            <div class="flex gap-1">
              <p class="font-medium">4.9</p>
              <p class="text-slate-800">(30 avis)</p>
            </div>
            <div class="h-2 min-h-2 w-2 min-w-2 rounded-full bg-slate-200"></div>
            <p class="text-slate-800">120 ventes</p>
          </div>

          <!-- Prix -->
          <div class="mb-4 mt-4 flex flex-col items-start">
            <h2 class="text-slate-800 line-through">{{ sneaker.price + 50 }} €</h2>
            <h1 class="text-4xl font-medium">{{ sneaker.price }} €</h1>
          </div>

          <!-- Couleurs -->
          <div class="mb-4 flex flex-col items-start gap-2">
            <h2 class="text-title">Couleurs disponibles :</h2>
            <div class="flex gap-2">
              <div v-for="color in sneaker.variants" :key="color.name">
                <ColorButton :variant="color" :isColorSelected="color.name === selectedVariant?.name"
                  @color-emittion="(color) => selectColor(color)" />
              </div>
            </div>
          </div>

          <!-- Tailles -->
          <div class="mb-6 flex flex-col items-start gap-2">
            <h2 class="text-title">Tailles disponibles :</h2>
            <div class="flex flex-wrap gap-2">
              <div v-for="size in newSizeList" :key="size?.name">
                <!-- {{ size }} -->
                <SizeCard :size="size" :isSizeSelected="size?.name === selectedSize?.name"
                  :isEnoughStock="size.stock > 0" @size-emittion="(size) => selectSize(size)" />
              </div>
            </div>
          </div>

          <!-- Quantité -->
          <div class="card mb-4 flex flex-col">
            <label for="quantity" class="text-title">Quantité :</label>
            <Select v-model="selectedQuantity" :options="selectedSize?.stock
                  ? Array.from(
                      { length: Math.min(selectedSize.stock, MAX_QUANTITY_DISPLAYED) },
                      (_, i) => ({
                        quantity: i + 1
                      })
                    )
                  : null
              " optionLabel="quantity" placeholder="Selectionnez une quantité" class="w-full" />
          </div>

          <!-- Boutton CTA -->
          <div class="flex justify-center gap-3">
            <Button :label="profile.profile ? 'Ajouter au panier' : 'Se connecter'" rounded size="large" icon="pi pi-shopping-bag" class="w-fit" :class="{
                'select-disable': !selectedQuantity,
                'transition-transform': selectedQuantity,
                'hover:scale-105': selectedQuantity
            }" style="padding: 1rem 4rem; background-color: black; border: 1px solid black"
              @click="selectedSize && selectedQuantity ? onSubmit() : null" />
          </div>
        </section>
      </main>

      <!-- Bas de Page -->
      <aside class="mb-11 flex gap-12 max-lg:flex-col">
        <!-- Description + Infos livraison -->
        <section class="flex flex-1 flex-col gap-8">
          <div>
            <h2 class="text-title">Description :</h2>
            <p class="max-h-44">
              {{ sneaker.description }}
            </p>
          </div>
          <div>
            <h2 class="text-title">Infos livraison :</h2>
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-4">
                <i class="pi pi-truck" style="font-size: 1.8rem"></i>
                <p>
                  Pour vous offrir encore plus de choix, nous livrons désormais des articles de
                  toute la France métropolitaine jusqu'à vous.
                </p>
              </div>
              <div class="flex items-center gap-4">
                <i class="pi pi-calendar-clock" style="font-size: 1.8rem"></i>
                <p>
                  Les délais de livraison sont de 5 à 7 jours ouvrés. Les frais de port sont offerts
                  à partir de 100€ d'achat.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Notes + Etoiles -->
        <section class="flex flex-1 items-center gap-12 rounded-lg bg-white">
          <!-- Notes -->
          <div class="flex flex-col gap-4">
            <h2 class="text-xl font-semibold">Notes</h2>
            <div class="flex items-baseline">
              <span class="text-7xl font-bold">4.9</span>
              <span class="ml-2 text-lg">/5</span>
            </div>
            <span class="text-gray-500">(41 New Reviews)</span>
          </div>

          <!-- Etoiles -->
          <div class="w-full space-y-1">
            <div class="flex items-center">
              <span class="text-yellow-400">★★★★★</span>
              <div class="ml-2 h-2 w-full rounded-full bg-gray-300">
                <div class="h-2 rounded-full bg-yellow-400" style="width: 90%"></div>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-yellow-400">★★★★</span>
              <span class="text-slate-200">★</span>
              <div class="ml-2 h-2 w-full rounded-full bg-gray-300">
                <div class="h-2 rounded-full bg-yellow-400" style="width: 7%"></div>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-yellow-400">★★★</span>
              <span class="text-slate-200">★★</span>
              <div class="ml-2 h-2 w-full rounded-full bg-gray-300">
                <div class="h-2 rounded-full bg-yellow-400" style="width: 2%"></div>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-yellow-400">★★</span>
              <span class="text-slate-200">★★★</span>
              <div class="ml-2 h-2 w-full rounded-full bg-gray-300">
                <div class="h-2 rounded-full bg-yellow-400" style="width: 1%"></div>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-yellow-400">★</span>
              <span class="text-slate-200">★★★★</span>
              <div class="ml-2 h-2 w-full rounded-full bg-gray-300">
                <div class="h-2 rounded-full bg-yellow-400" style="width: 0.5%"></div>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </BasePage>
</template>

<style scoped>
.select-disable {
  cursor: not-allowed;
  opacity: 0.5;
}

.text-title {
  padding-bottom: 0.5rem
    /* 8px */
  ;
  font-weight: 600;
  font-size: 1.25rem
    /* 20px */
  ;
  line-height: 1.75rem;
  /* 28px */
}
</style>
