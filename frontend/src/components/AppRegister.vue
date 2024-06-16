<template>
  <GenericModal v-model:visible="modelRegisterVisible" header="Inscription">
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col align-items-center gap-2 mb-3">
        <label for="email" class="w-6rem">Adresse mail</label>
        <InputText
          id="email"
          class="flex-auto"
          placeholder="amine.nairi@gmail.com"
          v-model="email"
        />
        <p v-if="emailError">
          <span class="text-red-500 text-sm">{{ emailError }}</span>
        </p>
      </div>
      <div class="flex flex-col align-items-center gap-2 mb-3">
        <label for="password" class="w-6rem">Mot de passe</label>
        <InputText
          type="password"
          id="password"
          class="flex-auto"
          placeholder="************"
          v-model="password"
        />
      </div>
      <div class="flex flex-col align-items-center gap-2 mb-3">
        <label for="passwordConfirm" class="w-6rem">Confirmation du mot de passe</label>
        <InputText
          type="password"
          id="passwordConfirm"
          class="flex-auto"
          placeholder="************"
          v-model="passwordConfirm"
        />
        <p v-if="registerError">
          <span class="text-red-500 text-sm">{{ registerError }}</span>
        </p>
      </div>
      <div class="flex flex-col justify-content-end gap-2">
        <Button type="submit" label="S'inscrire" rounded></Button>
      </div>
    </form>
  </GenericModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import axios from 'axios'
import GenericModal from './GenericModal.vue'

// Initialisation des variables à utiliser
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const registerError = ref('')
const modelRegisterVisible = ref(false)
const emit = defineEmits(['update:visible'])

// Gestion des erreurs instantanément dans le formulaire avec zod
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

// Traitements à la soumission du formulaire
async function onSubmit() {
  if (password.value !== passwordConfirm.value || emailError.value !== '' || email.value === '' || password.value === '' || passwordConfirm.value === '') {
    return null
  }

  try {
    const response = await axios.post('http://localhost:3000/users', { // A modifier pour mettre directement l'URL de l'API (Je garde localhost pour le test sur le port 3000)
      email: email.value,
      password: password.value,
    })
    
    // Si l'inscription est réussie, on cache le formulaire d'inscription et on envoie
    emit('update:visible', false)

    // ... Pop up success .... //

  } catch (e: any) {
    registerError.value = e.response?.data?.message || 'L\'inscription a échoué'
  }
}
</script>

<style scoped></style>
