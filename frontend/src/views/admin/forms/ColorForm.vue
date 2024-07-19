<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import { useForm } from '@/helpers/useForm'
import BasePageAdminView from '../BasePageAdminView.vue'
import ColorPicker from 'primevue/colorpicker'

const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const route = useRoute()
const colorId = route.params.id

const toast = useToast()

const actions = reactive({
  title: colorId ? 'Modifier une couleur' : 'Créer une couleur',
  buttonText: colorId ? 'Modifier' : 'Créer',
  toastSuccess: colorId ? 'Couleur modifiée' : 'Couleur créée',
  toastSuccessDetail: colorId
    ? 'La couleur a été modifiée avec succès'
    : 'La couleur a été créée avec succès',
  toastErrorDetail: colorId
    ? 'Une erreur est survenue lors de la modification de la couleur'
    : 'Une erreur est survenue lors de la création de la couleur'
})

const initialData = reactive({
  name: '',
  hexCode: '#000000'
})

onMounted(async () => {
  if (colorId) {
    const response = await fetch(`${API_URL}/colors/${colorId}`, {
      credentials: 'include'
    })

    if (!response.ok) {
      router.push('/admin/colors')
      return
    }

    const data = await response.json()
    initialData.name = data.name
    initialData.hexCode = data.hexCode
  }
})

const validationSchema = {
  name: z.string().min(1, { message: 'Le nom ne peut pas être vide' }),
  hexCode: z.string().min(1, { message: 'Le code hexadécimal ne peut pas être vide' })
}

const showErrorToast = () => {
  toast.add({
    severity: 'error',
    summary: 'Erreur',
    detail: actions.toastErrorDetail,
    life: 3000
  })
}

const onSubmit = async () => {
  try {
    const path = colorId ? `colors/${colorId}` : 'colors'
    const response = await fetch(`${API_URL}/${path}`, {
      method: colorId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        hexCode: '#' + formData.hexCode
      }),
      credentials: 'include'
    })

    if (!response.ok) {
      showErrorToast()
      return
    }

    toast.add({
      severity: 'success',
      summary: actions.toastSuccess,
      detail: actions.toastSuccessDetail,
      life: 5000
    })
  } catch (error) {
    showErrorToast()
  }
}

const { formData, updateField, submitForm, isSubmitting, validationErrors, isValid } = useForm(
  initialData,
  {},
  validationSchema,
  onSubmit
)
</script>

<template>
  <BasePageAdminView>
    <h1 class="mb-10 text-2xl">{{ actions.title }}</h1>

    <form @submit.prevent="submitForm" class="flex flex-col gap-5">
      <!-- Name -->
      <div class="flex flex-col gap-2">
        <label for="name">Nom</label>
        <InputText
          id="name"
          v-model="formData.name"
          @input="updateField('name', ($event.target as HTMLInputElement).value)"
          placeholder="Adidas"
          aria-describedby="name-help"
        />
        <small id="name-help" class="text-red-500" v-if="validationErrors.name">{{
          validationErrors.name
        }}</small>
      </div>

      <!-- Hex code -->
      <div class="flex flex-col gap-2">
        <label for="name">Couleur</label>
        <ColorPicker
          id="hexCode"
          v-model="formData.hexCode"
          @input="updateField('hexCode', ($event.target as HTMLInputElement).value)"
          aria-describedby="hexcode-help"
        />
        <small id="hexcode-help" class="text-red-500" v-if="validationErrors.hexCode">{{
          validationErrors.hexCode
        }}</small>
      </div>

      <Button
        type="submit"
        :label="actions.buttonText"
        :loading="isSubmitting"
        :disabled="!isValid"
      />
    </form>
  </BasePageAdminView>
</template>
