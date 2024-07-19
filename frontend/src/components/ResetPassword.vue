<template>
  <form @submit.prevent="submitForm">
    <div class="align-items-center mb-3 flex flex-col gap-2">
      <label for="email" class="w-6rem">Adresse mail</label>
      <InputText
        id="email"
        class="flex-auto"
        placeholder="john.doe@gmail.com"
        v-model="formData.email"
        @input="updateField('email', ($event.target as HTMLInputElement).value)"
      />
        <span v-if="validationErrors.email" class="error-message">{{
          validationErrors.email
        }}</span>
    </div>
    <div class="justify-content-end flex flex-col gap-2">
      <Button
        type="submit"
        label="Recevoir le lien"
        rounded
        :loading="isSubmitting"
        :disabled="!isValid"
      ></Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { z } from 'zod'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useForm } from '@/helpers/useForm'

const toast = useToast()
const dialogRef = inject('dialogRef')

const API_URL = import.meta.env.VITE_API_URL


const initialData = {
  email: ''
}

const transformFunctions = {
  email: (value: string) => value.trim()
}

const validationSchema = {
  email: z.string().email('Adresse mail invalide')
}

const closeModal = () => {
  dialogRef.value.close()
}

async function onSubmit({ email }: typeof initialData) {
  await axios.post(`${API_URL}/users/password-reset`, { email })
  closeModal()
  toast.add({
    severity: 'success',
    summary: 'Succès',
    detail:
      "Si l'adresse mail que vous avez entrée est associée à un compte, un lien de réinitialisation de mot de passe vient de vous être envoyé.",
    life: 5000
  })
}

const { formData, updateField, submitForm, isSubmitting, validationErrors, isValid } = useForm(
  initialData,
  transformFunctions,
  validationSchema,
  onSubmit
)
</script>

<style scoped>
.error-message {
  color: red;
}
</style>
