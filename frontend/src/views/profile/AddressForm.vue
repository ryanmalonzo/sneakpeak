<script setup lang="ts">
import { onMounted, reactive, ref, toRef, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { z } from 'zod'
import axios from 'axios'
import { debounce } from 'underscore'
import { useForm } from '@/helpers/useForm'
import FormRow from '@/components/profile/FormRow.vue'
import InputWithLabel from '@/components/profile/InputWithLabel.vue'
import AutoComplete from 'primevue/autocomplete'
import { profileStore } from '@/store/profile'

const props = defineProps<{
  type: 'shipping' | 'billing'
  header: string
  useSameAddress?: boolean
}>()

const useSameAddressRef = toRef(props, 'useSameAddress')

const emit = defineEmits<{
  (e: 'data', value: Object): void
  (e: 'use-same-address', value: boolean): void
}>()

interface GeoapifyFeatureProperties {
  formatted: string
}

interface GeoapifyFeature {
  properties: GeoapifyFeatureProperties
}

const toast = useToast()

const profile = profileStore()

const API_URL = import.meta.env.VITE_API_URL
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY

const filteredAddresses = ref([])
const address = ref('')

const initialData = reactive({
  name: '',
  phone: '',
  address: ''
})

const transformFunctions = {
  name: (value: string) => value.trim(),
  phone: (value: string) => value.trim(),
  address: (value: string) => value.trim()
}

const validationSchema = {
  name: z.string().min(1, { message: 'Le nom est requis' }),
  phone: z.string().min(1, { message: 'Le numéro de téléphone est requis' }),
  address: z.string().min(1, { message: "L'adresse est requise" })
}

const sendErrorToast = () => {
  toast.add({
    severity: 'error',
    summary: 'Erreur',
    detail: 'Une erreur est survenue lors de la sauvegarde de vos informations',
    life: 3000
  })
}

const doPut = async (type: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${profile.profile?.id}/address`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        ...formData
      }),
      credentials: 'include'
    })

    return response.ok
  } catch {
    return false
  }
}

const onSubmit = async () => {
  if (useSameAddressRef.value && props.type === 'billing') {
    return
  }

  if (useSameAddressRef.value && props.type === 'shipping') {
    const [shipping, billing] = await Promise.all([doPut('shipping'), doPut('billing')])

    if (shipping && billing) {
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Vos adresses ont été mises à jour',
        life: 5000
      })
    } else {
      sendErrorToast()
    }

    return
  }

  const success = await doPut(props.type)

  if (success) {
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Votre adresse a été mise à jour',
      life: 5000
    })
  } else {
    sendErrorToast()
  }
}

const { formData, updateField, submitForm, isSubmitting, validationErrors, isValid } = useForm(
  initialData,
  transformFunctions,
  validationSchema,
  onSubmit
)

onMounted(async () => {
  const response = await axios.get(
    `${API_URL}/users/${profile.profile?.id}/address?type=${props.type}`,
    {
      withCredentials: true
    }
  )

  if (response.data) {
    const dataAddress = [response.data.street, response.data.zip, response.data.city]
      .filter(Boolean)
      .join(' ')

    updateField('name', response.data.name)
    updateField('phone', response.data.phone)
    updateField('address', dataAddress)

    emit('data', response.data)
  }
})

const debouncedSearch = debounce(async (newVal: string) => {
  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${newVal}&apiKey=${GEOAPIFY_API_KEY}`
    )
    filteredAddresses.value = response.data.features.map(
      (feature: GeoapifyFeature) => feature.properties.formatted
    )
  } catch (error) {
    console.error(error)
  }
}, 500)

watch(address, (newVal) => {
  if (newVal.length < 3) {
    return
  }

  debouncedSearch(newVal)
})
</script>

<template>
  <form @submit.prevent="submitForm" class="flex flex-col gap-5 self-stretch md:gap-30px">
    <h3 class="text-xl font-medium">Adresse de {{ header }}</h3>

    <FormRow>
      <InputWithLabel
        id="name"
        label="Nom"
        placeholder="John Doe"
        :value="formData.name"
        @input="updateField('name', ($event.target as HTMLInputElement).value)"
        :helperText="validationErrors.name"
      />
    </FormRow>

    <FormRow>
      <InputWithLabel
        id="phone"
        label="Numéro de téléphone"
        placeholder="06 01 02 03 04"
        :value="formData.phone"
        @input="updateField('phone', ($event.target as HTMLInputElement).value)"
        :helperText="validationErrors.phone"
      />
    </FormRow>

    <FormRow>
      <div class="flex flex-1 flex-col gap-1">
        <label for="address" class="uppercase">Adresse</label>
        <AutoComplete
          :modelValue="formData.address"
          @update:modelValue="
            (value: string) => {
              updateField('address', value)
              address = value
            }
          "
          :suggestions="filteredAddresses"
          placeholder="Commencez à taper votre adresse ou code postal"
          inputClass="w-full"
          class="w-full"
        />
        <small v-if="validationErrors.address" class="text-red-500">{{
          validationErrors.address
        }}</small>
      </div>
    </FormRow>

    <div v-if="type === 'shipping'" class="flex items-center">
      <Checkbox
        :modelValue="useSameAddress"
        @update:modelValue="emit('use-same-address', $event)"
        inputId="use-same-address"
        :binary="true"
      />
      <label for="use-same-address" class="ml-2"
        >Utiliser la même adresse pour la facturation</label
      >
    </div>

    <Button
      type="submit"
      label="Sauvegarder"
      severity="contrast"
      class="self-start !rounded-none !px-5 uppercase"
      :loading="isSubmitting"
      :disabled="!isValid"
    />
  </form>
</template>
