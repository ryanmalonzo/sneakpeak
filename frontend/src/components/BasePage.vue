<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import Login from '@/components/Login.vue'
import { ref } from 'vue'

const isLoginVisible = ref(false)
const isRegisterVisible = ref(false)
</script>

<template>
  <Login v-model:visible="isLoginVisible" />
  <AppHeader v-model:loginVisible="isLoginVisible" v-model:registerVisible="isRegisterVisible" />

  <main class="flex flex-1 self-stretch">
    <slot />
  </main>

  <AppFooter />
</template>

<style scoped></style>
