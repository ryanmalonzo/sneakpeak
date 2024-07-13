<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import Password from 'primevue/password'
import { useToast } from 'primevue/usetoast'
import { useForm } from '@/helpers/useForm'

const API_URL = import.meta.env.VITE_API_URL

const toast = useToast()

const router = useRouter()
const route = useRoute()

const userId = route.query.id as string
const token = route.query.token as string

const passwordMismatch = ref(false)

onMounted(() => {
  if (!userId || !token) {
    router.push('/')
  }
})

const initialData = {
  password: '',
  passwordConfirm: ''
}

const validationSchema = {
  password: z
    .string()
    .min(12, { message: 'Doit contenir au moins 12 caractères' })
    .max(32, { message: 'Doit contenir au maximum 32 caractères' })
    .regex(/[^A-Za-z0-9]/, { message: 'Doit contenir au moins un caractère spécial' })
    .regex(/[A-Z]/, { message: 'Doit contenir au moins une lettre majuscule' })
    .regex(/[a-z]/, { message: 'Doit contenir au moins une lettre minuscule' })
    .regex(/[0-9]/, { message: 'Doit contenir au moins un chiffre' })
}

// Traitement du formulaire
async function onSubmit({ password }: typeof initialData) {
  if (passwordMismatch.value) {
    return
  }

  // Appel de l'API
  try {
    await axios.put(
      `${API_URL}/users/${userId}/password`,
      {
        token: token,
        password
      },
      {
        withCredentials: true
      }
    )

    router.replace('/')

    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Votre mot de passe a été modifié avec succès.',
      life: 5000
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Une erreur est survenue lors de la réinitialisation du mot de passe.',
      life: 3000
    })
  }
}

const { formData, updateField, submitForm, isSubmitting, validationErrors, isValid } = useForm(
  initialData,
  {},
  validationSchema,
  onSubmit
)

watch(
  () => [formData.password, formData.passwordConfirm],
  ([password, passwordConfirm]) => {
    if (password !== passwordConfirm) {
      passwordMismatch.value = true
    } else {
      passwordMismatch.value = false
    }
  }
)
</script>

<template>
  <main class="flex h-screen items-center justify-center bg-zinc-100">
    <form @submit.prevent="submitForm">
      <div class="align-items-center mb-5 flex flex-col gap-2">
        <label for="password" class="w-6rem">Nouveau mot de passe</label>
        <Password
          id="password"
          inputClass="flex-auto"
          :feedback="false"
          placeholder="************"
          v-model="formData.password"
          @input="updateField('password', $event.target.value)"
        />
        <p v-if="validationErrors.password">
          <span class="text-sm text-red-500">{{ validationErrors.password }}</span>
        </p>
      </div>
      <div class="align-items-center mb-5 flex flex-col gap-2">
        <label for="passwordConfirm" class="w-6rem">Confirmation du mot de passe</label>
        <Password
          id="passwordConfirm"
          inputClass="flex-auto"
          :feedback="false"
          placeholder="************"
          v-model="formData.passwordConfirm"
          @input="updateField('passwordConfirm', $event.target.value)"
        />
        <p v-if="passwordMismatch">
          <span class="text-sm text-red-500">Les mots de passe ne correspondent pas</span>
        </p>
      </div>
      <div class="justify-content-end flex flex-col gap-2">
        <Button
          type="submit"
          label="Modifier"
          rounded
          :loading="isSubmitting"
          :disabled="!isValid"
        ></Button>
      </div>
    </form>
  </main>
</template>
