<template>
  <GenericModal :visible="visible" header="Réinitialiser le mot de passe">
    <form>
      <div class="align-items-center mb-3 flex flex-col gap-2">
        <label for="password" class="w-6rem">Nouveau mot de passe</label>
        <InputText type="password" id="password" class="flex-auto" placeholder="************" />
      </div>
      <div class="align-items-center mb-3 flex flex-col gap-2">
        <label for="password1" class="w-6rem">Confirmer le mot de passe</label>
        <InputText type="password" id="password1" class="flex-auto" placeholder="************" />
      </div>
      <div class="justify-content-end flex flex-col gap-2">
        <Button type="submit" label="Réinitialiser le mot de passe" rounded></Button>
      </div>
    </form>
  </GenericModal>
</template>

<script setup lang="ts">
import GenericModal from './GenericModal.vue'

defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})
</script>

<style scoped></style>

