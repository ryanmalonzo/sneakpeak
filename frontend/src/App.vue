<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import DynamicDialog from 'primevue/dynamicdialog'
</script>

<template>
  <DynamicDialog />
  <Toast />
  <RouterView />
</template>

<style scoped></style>
