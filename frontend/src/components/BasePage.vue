<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import LoginModal from '@/components/LoginModal.vue'
import { ref } from 'vue'

const isLoginVisible = ref(false)
</script>

<template>
  <LoginModal v-model:loginVisible="isLoginVisible" />
  <AppHeader v-model:loginVisible="isLoginVisible" />

  <main class="flex flex-1 self-stretch">
    <slot />
  </main>

  <AppFooter />
</template>

<style scoped></style>
