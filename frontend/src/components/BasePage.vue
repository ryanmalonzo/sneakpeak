<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppLogin from '@/components/AppLogin.vue'
import { ref } from 'vue'

const isLoginVisible = ref(false)
const isRegisterVisible = ref(false)
</script>

<template>
  <AppLogin v-model:visible="isLoginVisible" />
  <AppHeader v-model:loginVisible="isLoginVisible" v-model:registerVisible="isRegisterVisible" />

  <main class="relative flex flex-1 self-stretch">
    <slot />
  </main>

  <AppFooter />
</template>

<style scoped></style>
