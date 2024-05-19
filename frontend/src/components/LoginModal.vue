<script setup lang="ts">
const modelLoginVisible = defineModel('loginVisible', { type: Boolean })
</script>

<template>
  <div class="card flex justify-content-center">
    <Dialog
      v-model:visible="modelLoginVisible"
      modal
      header="Connexion"
      :style="{ width: '30rem' }"
    >
      <div class="flex flex-col align-items-center gap-2 mb-3">
        <label for="email" class="w-6rem">Adresse mail</label>
        <InputText id="email" class="flex-auto" placeholder="john.doe@gmail.com" />
      </div>
      <div class="flex flex-col align-items-center gap-2 mb-5">
        <label for="password" class="w-6rem">Mot de passe</label>
        <InputText id="password" class="flex-auto" placeholder="************" />
        <a href="#" class="text-sm text-gray-500 underline hover:text-sneakpeak-gray-900"
          >Mot de passe oublié ?</a
        >
      </div>
      <!-- Buttons -->
      <div class="flex flex-col justify-content-end gap-2">
        <Button
          type="button"
          label="Se connecter"
          @click="modelLoginVisible = false"
          rounded
        ></Button>
        <a
          href="#"
          class="text-center text-sm text-gray-500 underline hover:text-sneakpeak-gray-900"
          >Pas encore de compte ?</a
        >
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
