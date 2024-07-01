<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { checkAuth } from './helpers/auth'
import Toast from 'primevue/toast'

onMounted(async () => {
  checkAuth()
})
</script>

<template>
  <Toast />
  <RouterView />
</template>

<style scoped></style>
