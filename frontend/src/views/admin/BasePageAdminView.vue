<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { logout } from '@/helpers/auth'
import { profileStore } from '@/store/profile'
import logo from '@/assets/images/logo.svg'
import Image from 'primevue/image'

const isSidebarOpen = ref(false)
const isMobile = ref(window.innerWidth <= 768)
const profile = profileStore()
const firstName = profile.profile?.firstName ?? 'Hello,'

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

const Logout = () => {
  logout()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <section class="flex h-screen">
    <!-- sidebar -->
    <nav
      :class="{
        flex: isSidebarOpen,
        hidden: !isSidebarOpen,
        'fixed left-0 top-0 h-screen': isSidebarOpen && isMobile
      }"
      class="flex-shrink-0 flex-col items-center gap-[6.25rem] bg-black bg-opacity-95 p-5 md:flex md:w-[15.625rem]"
    >
      <!-- Logo ou fermeture de la sidebar-->
      <div class="mt-8">
        <RouterLink v-if="!isMobile" to="/admin">
          <Image :src="logo" alt="Logo SneakPeak" class="flex h-[46.5px] items-center pr-2.5" />
        </RouterLink>
        <i
          v-else
          class="pi pi-times-circle"
          style="color: #ffff; font-size: 1.3rem"
          @click="toggleSidebar"
        >
        </i>
      </div>

      <!-- Items -->
      <div class="font-['Be Vietnam Pro'] w-full flex-col px-6 text-zinc-100">
        <ul>
          <li>
            <RouterLink to="/admin" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-home" style="color: #ffff; font-size: 1.3rem"></i>
              Accueil
            </RouterLink>
          </li>
          <li>
            <RouterLink to="#" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-users" style="color: #ffff; font-size: 1.3rem"></i>
              Clients
            </RouterLink>
          </li>
          <li>
            <RouterLink to="#" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-cart-arrow-down" style="color: #ffff; font-size: 1.3rem"></i>
              Commandes
            </RouterLink>
          </li>
          <li>
            <RouterLink to="#" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-tags" style="color: #ffff; font-size: 1.3rem"></i>
              Chaussures
            </RouterLink>
          </li>
          <li>
            <RouterLink to="#" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-objects-column" style="color: #ffff; font-size: 1.3rem"></i>
              Catégories
            </RouterLink>
          </li>

          <li>
            <RouterLink to="#" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-spin pi-cog" style="color: #ffff; font-size: 1.3rem"></i>
              Paramètres
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>
    <section class="flex-grow p-6">
      <!-- navbar -->
      <nav class="mb-2 flex justify-end gap-4">
        <!-- Ouvre le menu -->
        <div
          v-if="isMobile && !isSidebarOpen"
          class="fixed left-2 top-2.5 p-4 md:hidden"
          @click="toggleSidebar"
        >
          <i class="pi pi-bars" style="color: black; font-size: 1.3rem"></i>
        </div>

        <!-- déconnexion -->
        {{ firstName }}

        <button @click="Logout">
          <i class="pi pi-sign-out" style="color: black"></i>
        </button>
      </nav>
      <hr />

      <!-- Contenu -->
      <main class="mt-6 h-screen">
        <slot></slot>
      </main>
    </section>
  </section>
</template>
