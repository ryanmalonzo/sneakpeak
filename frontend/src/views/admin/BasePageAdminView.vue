<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { logout } from '@/helpers/auth'
import { profileStore } from '@/store/profile'

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
        <svg
          v-if="!isMobile"
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10 0C15.5228 0 20 4.47715 20 10V0H30C35.5228 0 40 4.47715 40 10C40 15.5228 35.5228 20 30 20C35.5228 20 40 24.4772 40 30C40 32.7423 38.8961 35.2268 37.1085 37.0334L37.0711 37.0711L37.0379 37.1041C35.2309 38.8943 32.7446 40 30 40C27.2741 40 24.8029 38.9093 22.999 37.1405C22.9756 37.1175 22.9522 37.0943 22.9289 37.0711C22.907 37.0492 22.8852 37.0272 22.8635 37.0051C21.0924 35.2009 20 32.728 20 30C20 35.5228 15.5228 40 10 40C4.47715 40 0 35.5228 0 30V20H10C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM18 10C18 14.4183 14.4183 18 10 18V2C14.4183 2 18 5.58172 18 10ZM38 30C38 25.5817 34.4183 22 30 22C25.5817 22 22 25.5817 22 30H38ZM2 22V30C2 34.4183 5.58172 38 10 38C14.4183 38 18 34.4183 18 30V22H2ZM22 18V2H30C34.4183 2 38 5.58172 38 10C38 14.4183 34.4183 18 30 18H22Z"
            fill="#EFEFEF"
          />
        </svg>
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
