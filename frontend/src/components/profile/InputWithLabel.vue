<script setup lang="ts">
const { id, label } = defineProps<{
  id: string
  label: string
}>()
</script>

<template>
  <div class="flex flex-1 flex-col gap-1">
    <label :for="id" class="uppercase">{{ label }}</label>
    <InputText :id="id" />
  </div>
</template>
