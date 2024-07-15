<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  currentPage: number
  maxPage: number
}>()

const emit = defineEmits(['pageChange'])
</script>

<template>
  <div class="flex items-center justify-between gap-2.5">
    <Button
      icon="pi pi-angle-double-left"
      text
      rounded
      aria-label="Aller à la première page"
      @click="emit('pageChange', 1)"
      :disabled="currentPage === 1"
    />
    <Button
      icon="pi pi-angle-left"
      text
      rounded
      aria-label="Aller à la page précédente"
      @click="emit('pageChange', Math.max(1, currentPage - 1))"
      :disabled="currentPage === 1"
    />
    <span>{{ currentPage }}</span>
    <Button
      icon="pi pi-angle-right"
      text
      rounded
      aria-label="Aller à la page suivante"
      @click="emit('pageChange', Math.min(maxPage, currentPage + 1))"
      :disabled="currentPage === maxPage"
    />
    <Button
      icon="pi pi-angle-double-right"
      text
      rounded
      aria-label="Aller à la dernière page"
      @click="emit('pageChange', maxPage)"
      :disabled="currentPage === maxPage"
    />
  </div>
</template>
