<script setup lang="ts">
import Image from 'primevue/image'
import { RouterLink } from 'vue-router'
import logo from '@/assets/images/logo.svg'
import SearchInput from '@/components/SearchInput.vue'
import MegaMenu from 'primevue/megamenu'
import { ref } from 'vue'

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
</script>

<template>
  <MegaMenu :model="items" class="px-2.5 md:px-5">
    <template #start>
      <Image :src="logo" alt="Logo SneakPeak" class="pr-2.5" />
    </template>

    <template #end>
      <div class="flex items-center gap-2.5">
        <SearchInput class="hidden md:block" />
        <i class="pi pi-search cursor-pointer rounded-full p-2.5 hover:bg-gray-50 md:hidden"></i>

        <i class="pi pi-bell cursor-pointer rounded-full p-2.5 hover:bg-gray-50"></i>
        <!-- Shopping cart -->
        <div
          id="cart"
          class="flex cursor-pointer items-center justify-end gap-2.5 rounded-full p-2.5 hover:bg-gray-50"
        >
          <i class="pi pi-shopping-bag"></i>
        </div>

        <!-- User -->
        <div
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
header {
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
}
</style>
