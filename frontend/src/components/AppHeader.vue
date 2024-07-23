<script setup lang="ts">
import Image from 'primevue/image'
import logo from '@/assets/images/logo.svg'
import SearchInput from '@/components/search/SearchInput.vue'
import MegaMenu from 'primevue/megamenu'
import Menu from 'primevue/menu'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from 'underscore'
import AppLogin from '@/components/AppLogin.vue'
import { logout } from '@/helpers/auth'
import { RouterLink } from 'vue-router'
import { CartStore } from '@/store/cart'
import { profileStore } from '@/store/profile'
import { useDialog } from 'primevue/usedialog'

// Utilisation de la route et du routeur
const router = useRouter()
const route = useRoute()
const dialog = useDialog()

// Références et variables réactives
const showMobileSearchRef = ref(false)
const searchRef = ref((route.query.q as string) || '')
const profile = profileStore() //Store profile

// Ouvrir de la modale de connexion
const openLoginModal = () => {
  dialog.open(AppLogin, { props: { dismissableMask: true, modal: true, header: 'Connexion' } })
}

// Éléments de menu
const items = ref([
  { label: 'Promotions', root: true },
  { label: 'Marques', root: true },
  { label: 'Catégories', root: true }
])

// Déclenche la recherche 500 ms après fin de saisie
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
        icon: 'pi pi-user',
        command: () => {
          router.push('/profile')
        }
      },
      {
        label: 'Mes commandes',
        icon: 'pi pi-truck',
        command: () => {
          router.push('/profile/orders') //TODO change path
        }
      },
      {
        label: 'Déconnexion',
        icon: 'pi pi-sign-out',
        command: () => {
          logout()
        }
      }
    ]
  }
])

onMounted(() => {
  if (profile.profile && profile.profile.roles.includes('ADMIN')) {
    itemsProfile.value.push({
      label: 'Administration',
      items: [
        { label: 'Back office', icon: 'pi pi-database', command: () => router.push('/admin') }
      ]
    })
  }
  if (profile.profile && profile.profile.roles.includes('STORE_KEEPER')) {
    itemsProfile.value.push({
      label: 'Gestionnaire de stock',
      items: [
        { label: 'Stock', icon: 'pi pi-shopping-cart', command: () => router.push('/admin/store') }
      ]
    })
  }
})

const menuProfile = ref<typeof Menu>()
const displayMenuProfile = (event: Event) => {
  itemsProfile.value[0].label = `Bienvenue ${profile.profile?.firstName || profile.profile?.email} !`
  menuProfile.value?.toggle(event)
}

// Compter les éléments du panier
const cart = CartStore() //Store cart
const cartItemCount = ref(0)
watch(cart, async () => {
  cartItemCount.value = cart.getCart().cartProduct.length
})
</script>

<template>
  <MegaMenu :model="items" class="!sticky top-0 z-50 hidden !rounded-none !px-2.5 md:!px-5">
    <template #start>
      <a @click="router.push('/')" class="cursor-pointer">
        <Image :src="logo" alt="Logo SneakPeak" class="flex h-[46.5px] items-center pr-2.5" />
      </a>
    </template>
    <template #end>
      <div class="flex items-center gap-2.5">
        <SearchInput class="hidden md:block" :submit="handleSubmit" v-model="searchRef" />
        <div class="absolute left-0 top-0 flex w-full flex-1 items-center gap-2.5 bg-white p-2.5 md:hidden"
          id="search-mobile" v-if="showMobileSearchRef">
          <SearchInput :submit="handleSubmit" v-model="searchRef" />
          <button type="button" @click="showMobileSearchRef = false">Annuler</button>
        </div>
        <div class="cursor-pointer md:hidden" @click="showMobileSearchRef = true">
          <i class="pi pi-search cursor-pointer rounded-full p-2.5 hover:bg-gray-50"></i>
        </div>
        <i class="pi pi-bell cursor-pointer rounded-full p-2.5 hover:bg-gray-50"></i>
        <RouterLink to="/cart">
          <div id="cart"
            class="relative flex cursor-pointer items-center justify-end gap-2.5 rounded-full p-2.5 hover:bg-gray-50">
            <i class="pi pi-shopping-bag"></i>
            <span v-if="cartItemCount"
              class="absolute right-0 top-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#10b981] text-xs text-white">
              {{ cartItemCount }}
            </span>
          </div>
        </RouterLink>

        <!-- Menu Profile -->
        <div v-if="profile.profile">
          <div class="card flex justify-center">
            <Button type="button" icon="pi pi-user" @click="displayMenuProfile" />
            <Menu ref="menuProfile" :model="itemsProfile" :popup="true"></Menu>
          </div>
        </div>
        <!-- Login -->
        <div v-else id="user" class="flex cursor-pointer items-center gap-2.5 rounded-full p-2.5 hover:bg-gray-50"
          @click="openLoginModal">
          <i class="pi pi-user"></i>
        </div>
      </div>
    </template>
  </MegaMenu>
</template>

<style scoped>
header,
#search-mobile {
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
}
</style>
