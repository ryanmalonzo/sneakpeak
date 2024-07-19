<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import FileUpload, { type FileUploadUploaderEvent } from 'primevue/fileupload'
import Image from 'primevue/image'
import { useToast } from 'primevue/usetoast'
import { useForm } from '@/helpers/useForm'
import BasePageAdminView from '../BasePageAdminView.vue'

const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const route = useRoute()
const categoryId = route.params.id

const toast = useToast()

const actions = reactive({
  title: categoryId ? 'Modifier une catégorie' : 'Créer une catégorie',
  buttonText: categoryId ? 'Modifier' : 'Créer',
  toastSuccess: categoryId ? 'Catégorie modifiée' : 'Catégorie créée',
  toastSuccessDetail: categoryId
    ? 'La catégorie a été modifiée avec succès'
    : 'La catégorie a été créée avec succès',
  toastErrorDetail: categoryId
    ? 'Une erreur est survenue lors de la modification de la catégorie'
    : 'Une erreur est survenue lors de la création de la catégorie'
})

const initialData = reactive({
  name: '',
  image: ''
})

onMounted(async () => {
  if (categoryId) {
    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
      credentials: 'include'
    })

    if (!response.ok) {
      router.push('/admin/categories')
      return
    }

    const data = await response.json()
    initialData.name = data.name
    initialData.image = data.image
  }
})

const validationSchema = {
  name: z.string().min(1, { message: 'Le nom ne peut pas être vide' }),
  image: z.string().min(1, { message: 'Vous devez sélectionner une image' })
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
    const path = categoryId ? `categories/${categoryId}` : 'categories'
    const response = await fetch(`${API_URL}/${path}`, {
      method: categoryId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
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

// Transform to base64
const handleUpload = async (event: FileUploadUploaderEvent) => {
  const file: File = (event.files as File[])[0]
  const reader = new FileReader()
  let blob = await fetch(URL.createObjectURL(file)).then((r) => r.blob())
  reader.readAsDataURL(blob)

  reader.onloadend = function () {
    updateField('image', reader.result as string)
  }
}
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
          placeholder="Running"
          aria-describedby="name-help"
        />
        <small id="name-help" class="text-red-500" v-if="validationErrors.name">{{
          validationErrors.name
        }}</small>
      </div>

      <!-- Image -->
      <div class="card flex flex-col justify-center gap-2">
        <label for="image">Image</label>
        <FileUpload
          mode="basic"
          id="image"
          name="image"
          accept="image/*"
          chooseLabel="Sélectionner un fichier"
          auto
          customUpload
          @uploader="handleUpload"
          aria-describedby="image-help"
        />
        <small id="image-help" class="text-red-500" v-if="validationErrors.image">{{
          validationErrors.image
        }}</small>
      </div>

      <div class="mx-auto h-40 w-40 border">
        <Image
          v-if="formData.image"
          :src="formData.image"
          alt="Image de la catégorie"
          imageClass="h-40 w-40 object-cover"
        />
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
