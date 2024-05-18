<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <Header />

  <main class="flex flex-1 self-stretch">
    <slot />
  </main>

  <Footer />
</template>

<style scoped></style>
