<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'

// Initialisation des variables
const password = ref('')
const passwordConfirm = ref('')
const ResetPasswordError = ref('')
const API_URL = import.meta.env.VITE_API_URL
const route = useRoute()
const userId = route.query.id as string
const token = route.query.token as string
const router = useRouter()

// Validation des champs avec Zod
const passwordSchema = z
  .string()
  .min(12, { message: 'Doit contenir au moins 12 caractères' })
  .regex(/[^A-Za-z0-9]/, { message: 'Doit contenir au moins un caractère spécial' })
  .regex(/[A-Z]/, { message: 'Doit contenir au moins une lettre majuscule' })
  .regex(/[a-z]/, { message: 'Doit contenir au moins une lettre minuscule' })
  .regex(/[0-9]/, { message: 'Doit contenir au moins un chiffre' })

// Traitement du formulaire
async function onSubmit() {
  // Vérifie que les mots de passe sont identiques
  if (password.value !== passwordConfirm.value) {
    ResetPasswordError.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  // Validation des mots de passe avec Zod
  const result = passwordSchema.safeParse(password.value)
  if (!result.success) {
    ResetPasswordError.value = result.error.issues[0].message
    return
  }

  // Vérifie la présence de l'id et du token
  if (!userId || !token) {
    ResetPasswordError.value = 'ID utilisateur ou token manquant.'
    return
  }

  // Appel de l'API
  try {
    await axios.put(
      `${API_URL}/users/${userId}/password`,
      {
        token: token,
        password: password.value
      },
      { withCredentials: true }
    )

    // TODO: afficher un toast avec un message de succès
    router.replace('/')
  } catch (e) {
    ResetPasswordError.value = 'Erreur lors de la modification du mot de passe.'
    console.error(e)
  }
}
</script>

<template>
  <main class="flex h-screen items-center justify-center bg-zinc-100">
    <form @submit.prevent="onSubmit">
      <div class="align-items-center mb-5 flex flex-col gap-2">
        <label for="password" class="w-6rem">Nouveau mot de passe</label>
        <InputText
          type="password"
          id="password"
          class="flex-auto"
          placeholder="************"
          v-model="password"
        />
      </div>
      <div class="align-items-center mb-5 flex flex-col gap-2">
        <label for="passwordConfirm" class="w-6rem">Confirmation du mot de passe</label>
        <InputText
          type="password"
          id="passwordConfirm"
          class="flex-auto"
          placeholder="************"
          v-model="passwordConfirm"
        />
      </div>
      <p v-if="ResetPasswordError">
        <span class="text-sm text-red-500">{{ ResetPasswordError }}</span>
      </p>
      <div class="justify-content-end flex flex-col gap-2">
        <Button type="submit" label="Modifier" rounded></Button>
      </div>
    </form>
  </main>
</template>
