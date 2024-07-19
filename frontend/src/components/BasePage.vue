<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppLogin from '@/components/AppLogin.vue'
import { ref } from 'vue'
</script>

<template>
  <AppHeader />

  <main class="relative flex flex-1 self-stretch">
    <slot />
  </main>

  <AppFooter />
</template>

<style scoped></style>
