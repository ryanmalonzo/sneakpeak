<template>
    <GenericModal v-model:visible="modelResetPasswordVisible" header="Mot de passe oublié">
      <form>
        <div class="flex flex-col align-items-center gap-2 mb-3">
          <label for="email" class="w-6rem">Adresse mail</label>
          <InputText
            id="email"
            class="flex-auto"
            placeholder="amine.nairi@gmail.com"
            v-model="email"
          />
        </div>
        <div class="flex flex-col justify-content-end gap-2">
          <Button type="submit" label="Recevoir le lien" rounded></Button>
        </div>
      </form>
    </GenericModal>
</template>
  
<script setup lang="ts">
  import GenericModal from './GenericModal.vue'
</script>
  
<style scoped></style>
  