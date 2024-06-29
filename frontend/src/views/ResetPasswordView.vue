<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import Password from 'primevue/password'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Initialisation des variables
const password = ref('')
const passwordConfirm = ref('')
const passwordConfirmError = ref('')
const ResetPasswordError = ref('')
const API_URL = import.meta.env.VITE_API_URL
const route = useRoute()
const userId = route.query.id as string
const token = route.query.token as string
const router = useRouter()

const passwordError = computed(() => {
  const result = passwordSchema.safeParse(password.value)
  if (result.success || password.value === '') {
    return ''
  }
  return result.error.issues[0].message
})

onMounted(() => {
  if (!userId || !token) {
    router.push('/')
  }
})

watch([password, passwordConfirm], () => {
  if (password.value !== passwordConfirm.value) {
    passwordConfirmError.value = 'Les mots de passe ne correspondent pas.'
  } else {
    passwordConfirmError.value = ''
  }
})

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
    return
  }

  // Validation des mots de passe avec Zod
  const result = passwordSchema.safeParse(password.value)
  if (!result.success) {
    return
  }

  // Appel de l'API
  try {
    await axios.put(`${API_URL}/users/${userId}/password`, {
      token: token,
      password: password.value
    })

    // Redirection vers la page de succès
    router.push('/resetPasswordSuccess')
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Une erreur est survenue lors de la réinitialisation du mot de passe.',
      life: 3000
    })
  }
}
</script>

<template>
  <main class="flex h-screen items-center justify-center bg-zinc-100">
    <form @submit.prevent="onSubmit">
      <div class="align-items-center mb-5 flex flex-col gap-2">
        <label for="password" class="w-6rem">Nouveau mot de passe</label>
        <Password
          id="password"
          inputClass="flex-auto"
          :feedback="false"
          placeholder="************"
          v-model="password"
        />
        <p v-if="passwordError">
          <span class="text-sm text-red-500">{{ passwordError }}</span>
        </p>
      </div>
      <div class="align-items-center mb-5 flex flex-col gap-2">
        <label for="passwordConfirm" class="w-6rem">Confirmation du mot de passe</label>
        <Password
          id="passwordConfirm"
          inputClass="flex-auto"
          :feedback="false"
          placeholder="************"
          v-model="passwordConfirm"
        />
        <p v-if="passwordConfirmError">
          <span class="text-sm text-red-500">{{ passwordConfirmError }}</span>
        </p>
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
