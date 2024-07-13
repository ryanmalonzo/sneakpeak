<script setup lang="ts">
import Image from 'primevue/image'
import logo from '@/assets/images/logo.svg'
import SearchInput from '@/components/search/SearchInput.vue'
import MegaMenu from 'primevue/megamenu'
import Menu from 'primevue/menu'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from 'underscore'
import AppLogin from '@/components/AppLogin.vue'
import { profileStore } from '@/store/profile'
import { logout } from '@/helpers/auth'
import { RouterLink } from 'vue-router'
import { cartStore } from '@/store/cart'

// Utilisation de la route et du routeur
const router = useRouter()
const route = useRoute()

// Références et variables réactives
const showMobileSearchRef = ref(false)
const searchRef = ref((route.query.q as string) || '')
const profile = profileStore() //Store profile

// Synchronisation de la visibilité de la modale de connexion
const modelLoginVisible = ref(false)

// Éléments de menu
const items = ref([
  { label: 'Promotions', root: true },
  { label: 'Marques', root: true },
  { label: 'Catégories', root: true }
])

// Déclencher la recherche avec un délai
const goToSearch = debounce(() => {
  router.push({ path: '/search', query: { q: searchRef.value } })
}, 500)

// Surveiller les modifications de la recherche
watch(searchRef, () => {
  goToSearch()
})

// Soumettre la recherche
const handleSubmit = () => {
  goToSearch()
}

// Éléments du menu de profil
const itemsProfile = ref([
  {
    label: ``,
    items: [
      {
        label: 'Mon profil',
        icon: 'pi pi-spin pi-cog',
        command: () => {
          router.push('/profile')
        }
      },
      {
        label: 'Mes commandes',
        icon: 'pi pi-truck',
        command: () => {
          router.push('/search') //TODO change path
        }
      },
      {
        label: 'Se déconnecter',
        icon: 'pi pi-sign-out',
        command: () => {
          logout()
        }
      }
    ]
  }
])

const menuProfile = ref<typeof Menu>()
const displayMenuProfile = (event: Event) => {
  itemsProfile.value[0].label = `Bienvenue ${profile.profile?.firstName} !`
  menuProfile.value?.toggle(event)
}

// Compter les éléments du panier
const cart = cartStore() //Store cart
const cartItemCount = ref(0)
watch(cart, async () => {
  cartItemCount.value = await cart.getCart()
})
</script>

<template>
  <MegaMenu :model="items" class="!sticky top-0 z-50 hidden !rounded-none !px-2.5 md:!px-5">
    <template #start>
      <a href="/">
        <Image :src="logo" alt="Logo SneakPeak" class="flex h-[46.5px] items-center pr-2.5" />
      </a>
    </template>
    <template #end>
      <div class="flex items-center gap-2.5">
        <SearchInput class="hidden md:block" :submit="handleSubmit" v-model="searchRef" />
        <div
          class="absolute left-0 top-0 flex w-full flex-1 items-center gap-2.5 bg-white p-2.5 md:hidden"
          id="search-mobile"
          v-if="showMobileSearchRef"
        >
          <SearchInput :submit="handleSubmit" v-model="searchRef" />
          <button type="button" @click="showMobileSearchRef = false">Annuler</button>
        </div>
        <div class="cursor-pointer md:hidden" @click="showMobileSearchRef = true">
          <i class="pi pi-search cursor-pointer rounded-full p-2.5 hover:bg-gray-50"></i>
        </div>
        <i class="pi pi-bell cursor-pointer rounded-full p-2.5 hover:bg-gray-50"></i>
        <div
          id="cart"
          class="relative flex cursor-pointer items-center justify-end gap-2.5 rounded-full p-2.5 hover:bg-gray-50"
        >
          <RouterLink to="/cart">
            <i class="pi pi-shopping-bag"></i>
            <span
              v-if="cartItemCount > 0"
              class="absolute right-0 top-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#10b981] text-xs text-white"
            >
              {{ cartItemCount }}
            </span>
          </RouterLink>
        </div>

        <!-- Menu Profile -->
        <div v-if="profile.profile">
          <div class="card flex justify-center">
            <Button type="button" icon="pi pi-user" @click="displayMenuProfile" />
            <Menu ref="menuProfile" :model="itemsProfile" :popup="true"></Menu>
          </div>
        </div>
        <!-- Login -->
        <div
          v-else
          id="user"
          class="flex cursor-pointer items-center gap-2.5 rounded-full p-2.5 hover:bg-gray-50"
          @click="modelLoginVisible = true"
        >
          <i class="pi pi-user"></i>
        </div>
      </div>
    </template>
  </MegaMenu>
  <AppLogin v-model:visible="modelLoginVisible" />
</template>

<style scoped>
header,
#search-mobile {
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
}
</style>
