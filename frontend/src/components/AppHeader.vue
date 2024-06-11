<script setup lang="ts">
import Image from 'primevue/image'
import logo from '@/assets/images/logo.svg'
import SearchInput from '@/components/search/SearchInput.vue'
import MegaMenu from 'primevue/megamenu'
import Menu from 'primevue/menu'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from 'underscore'
import { profileStore } from '@/store/profile'
import { logout } from '@/helpers/auth'

const router = useRouter()
const route = useRoute()

const showMobileSearchRef = ref(false)
const searchRef = ref((route.query.q as string) || '')
const profile = profileStore() //Store profile

const modelLoginVisible = defineModel('loginVisible', { type: Boolean })
const items = ref([
  {
    label: 'Promotions',
    root: true
  },
  {
    label: 'Marques',
    root: true
  },
  {
    label: 'Catégories',
    root: true
  }
])

const goToSearch = debounce(() => {
  router.push({ path: '/search', query: { q: searchRef.value } })
}, 500)

watch(searchRef, () => {
  goToSearch()
})

const handleSubmit = () => {
  goToSearch()
}

// Menu Profile
const itemsProfile = ref([
  {
    label: 'Mon profil',
    icon: 'pi pi-spin pi-cog',
    command: () => {
      router.push('/search') //TODO change path
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
])

const menuProfile = ref<Menu>()
const displayMenuProfile = (event: Event) => {
  menuProfile.value?.toggle(event)
}
</script>

<template>
  <MegaMenu :model="items" class="sticky top-0 z-50 rounded-none px-2.5 md:px-5">
    <template #start>
      <a href="/">
        <Image :src="logo" alt="Logo SneakPeak" class="pr-2.5" />
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
        <!-- Shopping cart -->
        <div
          id="cart"
          class="flex cursor-pointer items-center justify-end gap-2.5 rounded-full p-2.5 hover:bg-gray-50"
        >
          <i class="pi pi-shopping-bag"></i>
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
          @click="modelLoginVisible = !modelLoginVisible"
        >
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
