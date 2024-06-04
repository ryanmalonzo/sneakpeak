<template>
    <GenericModal v-model:visible="modelNewPasswordVisible" header="Réinitialiser le mot de passe">
      <form>
        <div class="flex flex-col align-items-center gap-2 mb-3">
            <label for="password" class="w-6rem">Nouveau mot de passe</label>
            <InputText
                type="password"
                id="password"
                class="flex-auto"
                placeholder="************"
                v-model="password"
            />
        </div>
        <div class="flex flex-col align-items-center gap-2 mb-3">
            <label for="password1" class="w-6rem">Confirmer le mot de passe</label>
            <InputText
                type="password"
                id="password1"
                class="flex-auto"
                placeholder="************"
                v-model="password1"
            />
        </div>
        <div class="flex flex-col justify-content-end gap-2">
          <Button type="submit" label="Réinitialiser le mot de passe" rounded></Button>
        </div>
      </form>
    </GenericModal>
</template>
  
<script setup lang="ts">
  import GenericModal from './GenericModal.vue'
</script>
  
<style scoped></style>
  