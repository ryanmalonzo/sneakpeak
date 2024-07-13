<script setup lang="ts">
const { id, label, placeholder } = defineProps<{
  id: string
  label: string
  placeholder?: string
  value?: unknown
  helperText?: string
}>()

const emit = defineEmits<{
  (e: 'input', value: Event): void
}>()
</script>

<template>
  <div class="flex flex-1 flex-col gap-1">
    <label :for="id" class="uppercase">{{ label }}</label>
    <InputText
      :id="id"
      :placeholder="placeholder"
      :value="value"
      @input="(event: Event) => emit('input', event)"
      :aria-describedby="id + '-help'"
    />
    <small v-if="helperText" :id="id + '-help'" class="text-red-500">{{ helperText }}</small>
  </div>
</template>
