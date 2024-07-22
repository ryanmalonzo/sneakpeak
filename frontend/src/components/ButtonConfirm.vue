<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import Button from 'primevue/button'
import GenericModal from './GenericModal.vue'

const props = defineProps<{
  icon: string
  label: string
  severity: string
  confirmMessage: string
}>()

const emit = defineEmits(['confirm'])
const showConfirmDialog = ref(false)

const confirmAction = () => {
  emit('confirm')
  showConfirmDialog.value = false
}
</script>

<template>
  <div>
    <Button :icon="icon" :label="label" :severity="severity" @click="showConfirmDialog = true" />
    <GenericModal v-model:visible="showConfirmDialog" header="Confirmation" modal>
      <p>{{ confirmMessage }}</p>
      <div class="mt-6 flex justify-end gap-2">
        <Button
          label="Annuler"
          icon="pi pi-times"
          @click="showConfirmDialog = false"
          class="p-button-text"
        />
        <Button label="Confirmer" icon="pi pi-check" @click="confirmAction" />
      </div>
    </GenericModal>
  </div>
</template>
