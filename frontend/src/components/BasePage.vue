<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppCookie from '@/components/AppCookie.vue'
</script>

<template>
  <AppHeader />
  <AppCookie />
  <main class="relative flex flex-1 self-stretch">
    <slot />
  </main>

  <AppFooter />
</template>

<style scoped></style>
