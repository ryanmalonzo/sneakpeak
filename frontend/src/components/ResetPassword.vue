<template>
  <GenericModal v-model:visible="modelResetPasswordVisible" header="Mot de passe oublié">
    <form>
      <div class="align-items-center mb-3 flex flex-col gap-2">
        <label for="email" class="w-6rem">Adresse mail</label>
        <InputText id="email" class="flex-auto" placeholder="john.doe@gmail.com" />
      </div>
      <div class="justify-content-end flex flex-col gap-2">
        <Button type="submit" label="Recevoir le lien" rounded></Button>
      </div>
    </form>
  </GenericModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GenericModal from './GenericModal.vue'

const modelResetPasswordVisible = ref(false)

</script>
