<template>
  <GenericModal v-model:visible="modelResetPasswordVisible" header="Mot de passe oublié">
    <form @submit.prevent="onSubmit">
      <div class="align-items-center mb-3 flex flex-col gap-2">
        <label for="email" class="w-6rem">Adresse mail</label>
        <InputText id="email" class="flex-auto" placeholder="amine.nairi@gmail.com" v-model="email" />
        <span v-if="emailError" class="error-message">{{ emailError }}</span>
      </div>
      <div class="justify-content-end flex flex-col gap-2">
        <Button type="submit" label="Recevoir le lien" rounded></Button>
      </div>
      <div v-if="resetPasswordError" class="error-message">{{ resetPasswordError }}</div>
    </form>
  </GenericModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import GenericModal from './GenericModal.vue'
import { Translation } from '@/helpers/translation'
import axios from 'axios'

// Initialisation des variables à utiliser
const email = ref('')
const modelResetPasswordVisible = ref(false)
const resetPasswordError = ref('')
const emit = defineEmits(['update:visible'])

const emailSchema = z
  .string()
  .min(5, { message: 'Doit contenir au moins 5 caractères' })
  .max(30, { message: 'Doit contenir au plus 30 caractères' })
  .email({ message: 'Email invalide' })

const emailError = computed(() => {
  const parsedEmail = emailSchema.safeParse(email.value)
  if (parsedEmail.success || email.value === '') {
    return ''
  }
  return parsedEmail.error.errors[0].message
})

// Traitement de l'envoi du mail de resetPassword
async function onSubmit() {
  if (emailError.value !== '' || email.value === '') {
    return
  }

  try {
    await axios.post('http://localhost:3000/users/password-reset', { email: email.value })
    
    resetPasswordError.value = ''
    email.value = ''
    
    // ferme la modale
    emit('update:visible', false)
     
  } catch (e) {
    resetPasswordError.value = Translation.resetPasswordErrors(e as Error)!
  }
}
</script>

<style scoped>
.error-message {
  color: red;
}
</style>
