<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import InputNumber from 'primevue/inputnumber'
import FileUpload, { type FileUploadUploaderEvent } from 'primevue/fileupload'
import Image from 'primevue/image'
import { useToast } from 'primevue/usetoast'
import { useForm } from '@/helpers/useForm'
import ApiAutocomplete from '@/components/ApiAutocomplete.vue'
import BasePageAdminView from '../BasePageAdminView.vue'
import type { ColorApi } from '@/services/colorApi'
import type { SizeApi } from '@/services/sizeApi'
import type { SneakerApi } from '@/services/sneakerApi'
import Checkbox from 'primevue/checkbox'
import { Translation } from '@/helpers/translation'

const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const route = useRoute()
const variantId = route.params.id

const toast = useToast()

const selectedSneaker: Ref<Partial<SneakerApi.SneakerOut> | null> = ref(null)
const selectedColor: Ref<Partial<ColorApi.ColorOut> | null> = ref(null)
const selectedSize: Ref<Partial<SizeApi.SizeOut> | null> = ref(null)

const sneakerError = ref(false)
const colorError = ref(false)
const sizeError = ref(false)

const actions = reactive({
  title: variantId ? 'Modifier une variante' : 'Créer une variante',
  buttonText: variantId ? 'Modifier' : 'Créer',
  toastSuccess: variantId ? 'Variante modifiée' : 'Variante créée',
  toastSuccessDetail: variantId
    ? 'La variante a été modifiée avec succès'
    : 'La variante a été créée avec succès'
})

const initialData = reactive({
  image: '',
  isBest: false,
  stock: 0
})

onMounted(async () => {
  if (variantId) {
    const response = await fetch(`${API_URL}/sneakers/variants/${variantId}`, {
      credentials: 'include'
    })

    if (!response.ok) {
      router.push('/admin/variants')
      return
    }

    const data = await response.json()

    initialData.image = data.variantImage
    initialData.isBest = data.variantIsBest
    initialData.stock = data.sizeStock

    selectedSneaker.value = {
      id: data.sneakerId,
      name: data.sneakerName
    }

    selectedColor.value = {
      id: data.variantId,
      name: data.variantName
    }

    selectedSize.value = {
      id: data.sizeId,
      name: data.sizeName
    }
  }
})

const transformFunctions = {
  description: (value: string) => value.trim()
}

const validationSchema = {
  image: z.string().min(1, { message: 'Vous devez sélectionner une image' }),
  isBest: z.boolean(),
  stock: z.number({ invalid_type_error: 'Le stock ne peut pas être vide' })
}

const showErrorToast = (error: Error) => {
  toast.add({
    severity: 'error',
    summary: 'Erreur',
    detail: Translation.variantsErrors(error),
    life: 3000
  })
}

const onSubmit = async () => {
  if (!selectedSneaker.value) {
    sneakerError.value = true
    return
  }
  if (!selectedColor.value) {
    colorError.value = true
    return
  }
  if (!selectedSize.value) {
    sizeError.value = true
    return
  }

  try {
    const path = variantId ? `variants/${variantId}` : 'variants'
    const response = await fetch(`${API_URL}/${path}`, {
      method: variantId ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sneakerId: selectedSneaker.value.id,
        colorId: selectedColor.value.id,
        sizeId: selectedSize.value.id,
        ...formData
      }),
      credentials: 'include'
    })

    if (!response.ok) {
      throw response as Response
    }

    router.push('/admin/variants')

    toast.add({
      severity: 'success',
      summary: actions.toastSuccess,
      detail: actions.toastSuccessDetail,
      life: 5000
    })
  } catch (error) {
    if ((error as Response).status === 500) {
      showErrorToast(new Error('Servor Error'))
      return
    }

    showErrorToast(await (error as Response).json())
  }
}

const { formData, updateField, submitForm, isSubmitting, validationErrors, isValid } = useForm(
  initialData,
  transformFunctions,
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
      <!-- Is best -->
      <div class="card flex w-fit justify-start gap-2 rounded-md bg-zinc-100 p-2">
        <label for="isBest">Top vente :</label>
        <Checkbox v-model="formData.isBest" :binary="true" />
      </div>

      <!-- Sneaker -->
      <div v-if="!route.params.id" class="flex flex-col gap-2">
        <label for="sneaker">Sneaker</label>
        <ApiAutocomplete
          id="sneaker"
          :modelValue="selectedSneaker"
          @update:modelValue="selectedSneaker = $event"
          :apiURL="`${API_URL}/sneakers`"
          optionLabel="name"
          aria-describedby="sneaker-help"
        />
        <small id="sneaker-help" class="text-red-500" v-if="sneakerError"
          >Vous devez sélectionner une couleur</small
        >
      </div>

      <!-- Color -->
      <div class="flex flex-col gap-2">
        <label for="color">Couleur</label>
        <ApiAutocomplete
          id="color"
          :modelValue="selectedColor"
          @update:modelValue="selectedColor = $event"
          :apiURL="`${API_URL}/colors`"
          optionLabel="name"
          aria-describedby="color-help"
        />
        <small id="color-help" class="text-red-500" v-if="colorError"
          >Vous devez sélectionner une couleur</small
        >
      </div>

      <!-- Size -->
      <div class="flex flex-col gap-2">
        <label for="size">Taille</label>
        <ApiAutocomplete
          id="size"
          :modelValue="selectedSize"
          @update:modelValue="selectedSize = $event"
          :apiURL="`${API_URL}/sizes`"
          optionLabel="name"
          aria-describedby="size-help"
        />
        <small id="size-help" class="text-red-500" v-if="sizeError"
          >Vous devez sélectionner une taille</small
        >
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
          alt="Image de la variante"
          imageClass="h-40 w-40 object-cover"
        />
      </div>

      <!-- Stock -->
      <div class="card flex flex-col justify-center gap-2">
        <label for="stock">Stock</label>
        <InputNumber
          id="stock"
          v-model="formData.stock"
          @input="updateField('stock', $event.value)"
          showButtons
          buttonLayout="horizontal"
          :step="1"
          fluid
          aria-describedby="stock-help"
        >
          <template #incrementbuttonicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
        <small id="stock-help" class="text-red-500" v-if="validationErrors.stock">{{
          validationErrors.stock
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
