<script setup lang="ts">
import Image from 'primevue/image'
import { RouterLink } from 'vue-router'
import logo from '@/assets/images/logo.svg'
import SearchInput from '@/components/SearchInput.vue'

const modelLoginVisible = defineModel('loginVisible', { type: Boolean })
</script>

<template>
  <header class="flex items-center gap-5 flex-shrink-0 self-stretch bg-white h-70px px-30px">
    <!-- Logo -->
    <RouterLink to="/">
      <Image :src="logo" alt="Logo SneakPeak" />
    </RouterLink>

    <SearchInput />

    <div class="flex justify-end items-center gap-10 flex-1 self-stretch">
      <i class="pi pi-bell p-2.5 hover:bg-gray-50 rounded-full cursor-pointer"></i>
      <!-- Shopping cart -->
      <div
        id="cart"
        class="flex py-5px px-2.5 justify-end items-center gap-2.5 bg-sneakpeak-gray-50 hover:bg-sneakpeak-gray-100 cursor-pointer rounded-full"
      >
        <i class="pi pi-shopping-bag"></i>
        <span>2 articles</span>
      </div>

      <!-- User -->
      <div
        id="user"
        class="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-full py-5px px-2.5"
        @click="modelLoginVisible = !modelLoginVisible"
      >
        <i class="pi pi-user"></i>
        <span>Se connecter</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
}
</style>
