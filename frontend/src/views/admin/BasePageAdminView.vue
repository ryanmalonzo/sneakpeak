<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { logout } from '@/helpers/auth'
import { profileStore } from '@/store/profile'
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
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 14 14"
          fill="none"
          @click="toggleSidebar"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7 1.16667C3.77834 1.16667 1.16667 3.77834 1.16667 7C1.16667 10.2217 3.77834 12.8333 7 12.8333C10.2217 12.8333 12.8333 10.2217 12.8333 7C12.8333 3.77834 10.2217 1.16667 7 1.16667ZM0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7ZM9.74581 4.25419C9.97362 4.48199 9.97362 4.85134 9.74581 5.07915L7.82496 7L9.74581 8.92085C9.97362 9.14866 9.97362 9.51801 9.74581 9.74581C9.51801 9.97362 9.14866 9.97362 8.92085 9.74581L7 7.82496L5.07915 9.74581C4.85134 9.97362 4.48199 9.97362 4.25419 9.74581C4.02638 9.51801 4.02638 9.14866 4.25419 8.92085L6.17504 7L4.25419 5.07915C4.02638 4.85134 4.02638 4.48199 4.25419 4.25419C4.48199 4.02638 4.85134 4.02638 5.07915 4.25419L7 6.17504L8.92085 4.25419C9.14866 4.02638 9.51801 4.02638 9.74581 4.25419Z"
            fill="white"
          />
        </svg>
      </div>

      <!-- Items -->
      <div class="font-['Be Vietnam Pro'] w-full flex-col px-6 text-zinc-100">
        <ul>
          <li>
            <a href="" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-home" style="color: #FFFF; font-size: 1.3rem"></i>
              Accueil
            </a>
          </li>
          <li>
            <a href="" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-users" style="color: #FFFF; font-size: 1.3rem"></i>
              Clients
            </a>
          </li>
          <li>
            <a href="" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-cart-arrow-down" style="color: #FFFF; font-size: 1.3rem"></i>
              Commandes
            </a>
          </li>
          <li>
            <a href="" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-tags" style="color: #FFFF; font-size: 1.3rem"></i>
              Chaussures
            </a>
          </li>
          <li>
            <a href="" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-objects-column" style="color: #FFFF; font-size: 1.3rem"></i>
              Catégories
            </a>
          </li>
          <li>
            <a href="" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-crown" style="color: #FFFF; font-size: 1.3rem"></i>
              Marques
            </a>
          </li>
          <li>
            <a href="" class="flex gap-4 rounded-xl p-4 hover:bg-sky-700">
              <i class="pi pi-spin pi-cog" style="color: #FFFF; font-size: 1.3rem"></i>
              Paramètres
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <section class="flex-grow p-6">
      <!-- navbar -->
      <nav class="mb-2 flex justify-end gap-4">
        <!-- Ouvre le menu -->
        <div class="fixed left-2 top-4 p-4 md:hidden">
          <i class="pi pi-home" style="color: #FFFF; font-size: 1.3rem"></i>
        </div>

        <!-- déconnexion -->
        {{ firstName }}

        <button @click="Logout">
          <i class="pi pi-sign-out" style="color:black"></i>
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
