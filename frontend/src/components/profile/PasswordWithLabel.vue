<script setup lang="ts">
import Password from 'primevue/password'

const { id, label, value, helperText, invalid } = defineProps<{
  id: string
  label: string
  value?: unknown
  helperText?: string
  invalid?: boolean
}>()

const emit = defineEmits<{
  (e: 'input', value: Event): void
}>()
</script>

<template>
  <div class="flex flex-1 flex-col gap-1">
    <label :for="id" class="uppercase">{{ label }}</label>
    <Password
      :id="id"
      toggleMask
      :feedback="false"
      inputClass="flex-auto"
      placeholder="************"
      :modelValue="value"
      @update:modelValue="emit('input', $event)"
      :invalid="invalid"
    />
    <small v-if="invalid" :id="id + '-help'" class="text-red-500">{{ helperText }}</small>
  </div>
</template>
