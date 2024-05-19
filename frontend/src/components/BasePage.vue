<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import LoginModal from '@/components/LoginModal.vue'
import { ref } from 'vue'

const isLoginVisible = ref(true)
</script>

<template>
  <LoginModal v-model:loginVisible="isLoginVisible" />
  <Header v-model:loginVisible="isLoginVisible" />

  <main class="flex flex-1 self-stretch">
    <slot />
  </main>

  <Footer />
</template>

<style scoped></style>
