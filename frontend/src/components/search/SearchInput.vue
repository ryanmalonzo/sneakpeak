<script setup lang="ts">
import InputText from 'primevue/inputtext'

defineProps<{
  modelValue: string
  submit: () => void
}>()

const emit = defineEmits(['update:modelValue'])

const handleInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const styleOverrides = {
  root: 'flex h-12 py-2.5 px-5 flex-1 rounded-full border border-sneakpeak-gray-50'
}
</script>

<template>
  <form @submit.prevent="submit" class="flex flex-1">
    <span class="relative flex flex-1">
      <button class="pi pi-search absolute right-4 top-1/2 -translate-y-1/2 transform"></button>
      <InputText
        type="text"
        placeholder="Nike Air Force 1"
        :pt="styleOverrides"
        :value="modelValue"
        @input="handleInput"
      />
    </span>
  </form>
</template>
