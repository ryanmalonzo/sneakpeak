<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'
import { useForm } from '@/helpers/useForm'
import ApiAutocomplete from '@/components/ApiAutocomplete.vue'
import BasePageAdminView from '../BasePageAdminView.vue'
import type { BrandApi } from '@/services/brandApi'
import DataTable from '@/components/datatable/DataTable.vue'

const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const route = useRoute()
const sneakerId = route.params.id

const toast = useToast()

const selectedBrand: Ref<Partial<BrandApi.BrandOut> | null> = ref(null)
const selectedCategory: Ref<Partial<BrandApi.BrandOut> | null> = ref(null)

const brandError = ref(false)
const categoryError = ref(false)

const actions = reactive({
  title: sneakerId ? 'Modifier une sneaker' : 'Créer une sneaker',
  buttonText: sneakerId ? 'Modifier' : 'Créer',
  toastSuccess: sneakerId ? 'Sneaker modifiée' : 'Sneaker créée',
  toastSuccessDetail: sneakerId
    ? 'La sneaker a été modifiée avec succès'
    : 'La sneaker a été créée avec succès',
  toastErrorDetail: sneakerId
    ? 'Une erreur est survenue lors de la modification de la sneaker'
    : 'Une erreur est survenue lors de la création de la sneaker'
})

const initialData = reactive({
  name: '',
  description: '',
  price: 0.0
})

onMounted(async () => {
  if (sneakerId) {
    const response = await fetch(`${API_URL}/sneakers/${sneakerId}`, {
      credentials: 'include'
    })

    if (!response.ok) {
      router.push('/admin/sneakers')
      return
    }

    const data = await response.json()

    initialData.name = data.name
    initialData.description = data.description
    initialData.price = data.price

    selectedBrand.value = {
      id: data.brandId,
      name: data.brand
    }

    selectedCategory.value = {
      id: data.categoryId,
      name: data.category
    }
  }
})

const transformFunctions = {
  name: (value: string) => value.trim(),
  description: (value: string) => value.trim()
}

const validationSchema = {
  name: z.string().min(1, { message: 'Le nom ne peut pas être vide' }),
  description: z.string().min(1, { message: 'La description ne peut pas être vide' }),
  price: z
    .number({ invalid_type_error: 'Le prix ne peut pas être vide' })
    .positive({ message: 'Le prix doit être supérieur à 0' })
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
  if (!selectedBrand.value) {
    brandError.value = true
    return
  }
  if (!selectedCategory.value) {
    categoryError.value = true
    return
  }

  try {
    const path = sneakerId ? `sneakers/${sneakerId}` : 'sneakers'
    const response = await fetch(`${API_URL}/${path}`, {
      method: sneakerId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        brandId: selectedBrand.value.id,
        categoryId: selectedCategory.value.id,
        ...formData
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
  transformFunctions,
  validationSchema,
  onSubmit
)

const columns = [
  { key: 'sneakerName', label: 'Sneaker'},
  { key: 'variantName', label: 'Nom Couleur' },
  { key: 'variantImage', label: 'Image' },
  { key: 'variantIsBest', label: 'Top vente' },
  { key: 'sizeName', label: 'Taille' },
  { key: 'sizeStock', label: 'Stock' },
]
</script>

<template>
  <BasePageAdminView>
    <h1 class="mb-10 text-2xl">{{ actions.title }}</h1>

    <form @submit.prevent="submitForm" class="flex flex-col gap-5">
      <!-- Brand -->
      <div class="flex flex-col gap-2">
        <label for="brand">Marque</label>
        <ApiAutocomplete
          id="brand"
          :modelValue="selectedBrand"
          @update:modelValue="selectedBrand = $event"
          :apiURL="`${API_URL}/brands`"
          optionLabel="name"
          aria-describedby="brand-help"
        />
        <small id="brand-help" class="text-red-500" v-if="brandError"
          >Vous devez sélectionner une marque</small
        >
      </div>

      <!-- Category -->
      <div class="flex flex-col gap-2">
        <label for="category">Catégorie</label>
        <ApiAutocomplete
          id="category"
          :modelValue="selectedCategory"
          @update:modelValue="selectedCategory = $event"
          :apiURL="`${API_URL}/categories`"
          optionLabel="name"
          aria-describedby="category-help"
        />
        <small id="category-help" class="text-red-500" v-if="categoryError"
          >Vous devez sélectionner une catégorie</small
        >
      </div>

      <!-- Name -->
      <div class="flex flex-col gap-2">
        <label for="name">Nom</label>
        <InputText
          id="name"
          v-model="formData.name"
          @input="updateField('name', ($event.target as HTMLInputElement).value)"
          placeholder="Air Force 1"
          aria-describedby="name-help"
        />
        <small id="name-help" class="text-red-500" v-if="validationErrors.name">{{
          validationErrors.name
        }}</small>
      </div>

      <!-- Description -->
      <div class="flex flex-col gap-2">
        <label for="description">Description</label>
        <Textarea
          id="description"
          rows="3"
          v-model="formData.description"
          @input="updateField('description', ($event.target as HTMLInputElement).value)"
          placeholder="La sneaker la plus iconique de Nike"
          aria-describedby="description-help"
        />
        <small id="description-help" class="text-red-500" v-if="validationErrors.description">{{
          validationErrors.description
        }}</small>
      </div>

      <!-- Price -->
      <div class="card flex flex-col justify-center gap-2">
        <label for="price">Prix</label>
        <InputNumber
          id="price"
          v-model="formData.price"
          @input="updateField('price', $event.value)"
          mode="currency"
          currency="EUR"
          locale="fr-FR"
          showButtons
          buttonLayout="horizontal"
          :step="1"
          fluid
          aria-describedby="price-help"
        >
          <template #incrementbuttonicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
        <small id="price-help" class="text-red-500" v-if="validationErrors.price">{{
          validationErrors.price
        }}</small>
      </div>

      <Button
        type="submit"
        :label="actions.buttonText"
        :loading="isSubmitting"
        :disabled="!isValid"
      />
    </form>

    <hr class="mt-10 border border-zinc-200">

    <!-- Taleau des variantes -->
    <div class="mt-10">
      <DataTable
        :columns="columns"
        :resource="`sneakers/${sneakerId}/variants`"
        uniqueKey="id"
        headerTitle="Variantes de cette sneaker"
        path="/admin/variants"
        deleteResource="variants"
      />
    </div>
  </BasePageAdminView>
</template>
