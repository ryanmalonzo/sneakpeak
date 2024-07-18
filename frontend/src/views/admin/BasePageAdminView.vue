<script setup lang="ts">
import { ref } from 'vue'
import { logout } from '@/helpers/auth'
import logoWhite from '@/assets/images/logoWhite.svg'
import Image from 'primevue/image'
import { profileStore } from '@/store/profile'

const isSidebarOpen = ref(false)
const profile = profileStore()
const greeting = 'Hello, ' + (profile.profile?.firstName || profile.profile?.email)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <section class="flex h-screen">
    <!-- sidebar -->
    <nav
      :class="{
        flex: isSidebarOpen,
        hidden: !isSidebarOpen,
        'fixed left-0 top-0 h-screen md:hidden': isSidebarOpen
      }"
      class="z-50 flex-shrink-0 flex-col items-center gap-[6.25rem] bg-black bg-opacity-95 p-5 md:flex md:w-[15.625rem]"
    >
      <!-- Logo ou fermeture de la sidebar-->
      <div class="mt-8">
        <RouterLink class="hidden md:block" to="/admin">
          <Image
            :src="logoWhite"
            alt="Logo SneakPeak"
            class="flex h-[46.5px] items-center pr-2.5"
          />
        </RouterLink>
        <i
          class="pi pi-times-circle cursor-pointer md:!hidden"
          style="color: #ffff; font-size: 1.3rem"
          @click="toggleSidebar"
        >
        </i>
      </div>

      <!-- Items -->
      <div class="font-['Be Vietnam Pro'] w-full flex-col px-6 text-zinc-100">
        <ul>
          <li>
            <RouterLink to="/admin/dashboard" class="flex gap-4 rounded-xl p-4 hover:bg-orange-500">
              <i class="pi pi-home" style="color: #ffff; font-size: 1.3rem"></i>
              Accueil
            </RouterLink>
          </li>
          <li>
            <RouterLink to="#" class="flex gap-4 rounded-xl p-4 hover:bg-orange-500">
              <i class="pi pi-users" style="color: #ffff; font-size: 1.3rem"></i>
              Clients
            </RouterLink>
          </li>
          <li>
            <RouterLink to="#" class="flex gap-4 rounded-xl p-4 hover:bg-orange-500">
              <i class="pi pi-cart-arrow-down" style="color: #ffff; font-size: 1.3rem"></i>
              Commandes
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/admin/sneakers" class="flex gap-4 rounded-xl p-4 hover:bg-orange-500">
              <i class="pi pi-tags" style="color: #ffff; font-size: 1.3rem"></i>
              Chaussures
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/admin/categories"
              class="flex gap-4 rounded-xl p-4 hover:bg-orange-500"
            >
              <i class="pi pi-objects-column" style="color: #ffff; font-size: 1.3rem"></i>
              Catégories
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/admin/brands" class="flex gap-4 rounded-xl p-4 hover:bg-orange-500">
              <i class="pi pi-list" style="color: #ffff; font-size: 1.3rem"></i>
              Marques
            </RouterLink>
          </li>

          <li>
            <RouterLink to="#" class="flex gap-4 rounded-xl p-4 hover:bg-orange-500">
              <i class="pi pi-cog" style="color: #ffff; font-size: 1.3rem"></i>
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
          v-if="!isSidebarOpen"
          class="fixed left-2 top-2.5 cursor-pointer p-4 md:hidden"
          @click="toggleSidebar"
        >
          <i class="pi pi-bars" style="color: black; font-size: 1.3rem"></i>
        </div>

        <div class="flex items-center gap-5">
          {{ greeting }}

          <RouterLink to="/">
            <Button icon="pi pi-arrow-left" label="Retour à la boutique" />
          </RouterLink>

          <button @click="logout">
            <i class="pi pi-sign-out" style="color: black"></i>
          </button>
        </div>
      </nav>
      <hr />

      <!-- Contenu -->
      <main class="mt-6" id="content">
        <slot></slot>
      </main>
    </section>
  </section>
</template>
