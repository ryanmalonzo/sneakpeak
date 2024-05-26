<!-- TODO: Factorize better -->
<script setup lang="ts">
import InputText from 'primevue/inputtext'

const styleOverrides = {
  root: 'flex h-12 py-2.5 px-5 flex-1 rounded-full border border-sneakpeak-gray-50'
}
</script>

<template>
  <span class="relative flex flex-1">
    <i class="pi pi-search absolute right-4 top-1/2 -translate-y-1/2 transform"></i>
    <InputText type="text" placeholder="Nike Air Force 1" :pt="styleOverrides" />
  </span>
</template>
