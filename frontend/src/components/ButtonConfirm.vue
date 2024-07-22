<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import Button from 'primevue/button'
import GenericModal from './GenericModal.vue'

defineProps<{
  icon: string
  label: string
  severity: string
  confirmMessage: string
  errorMessage: string
  loading: boolean
  error: boolean
}>()

const emit = defineEmits(['cancel', 'confirm'])
const showConfirmDialog = ref(false)

const confirmAction = () => {
  emit('confirm')
}
</script>

<template>
  <div>
    <Button :icon="icon" :label="label" :severity="severity" @click="showConfirmDialog = true" />
    <GenericModal v-model:visible="showConfirmDialog" header="Confirmation" modal :closable="false">
      <p>{{ confirmMessage }}</p>
      <p v-if="error" class="mt-2.5 text-red-500">{{ errorMessage }}</p>
      <div class="mt-6 flex justify-end gap-2">
        <Button
          label="Annuler"
          icon="pi pi-times"
          @click="
            () => {
              showConfirmDialog = false
              emit('cancel')
            }
          "
          class="p-button-text"
        />
        <Button label="Confirmer" icon="pi pi-check" @click="confirmAction" :loading="loading" />
      </div>
    </GenericModal>
  </div>
</template>
