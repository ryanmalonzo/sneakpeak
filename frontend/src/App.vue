<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { checkAuth } from './helpers/auth'

onMounted(async () => {
  checkAuth()
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
