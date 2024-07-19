<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import DynamicDialog from 'primevue/dynamicdialog'
import AppCookie from './components/AppCookie.vue'
</script>

<template>
  <AppCookie />
  <DynamicDialog />
  <Toast />
  <RouterView />
</template>

<style scoped></style>
