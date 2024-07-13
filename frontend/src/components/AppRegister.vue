<template>
  <GenericModal v-model:visible="localVisible" header="Inscription">
    <form @submit.prevent="submitForm">
      <div class="align-items-center mb-3 flex flex-col gap-2">
        <label for="email" class="w-6rem">Adresse mail</label>
        <InputText
          id="email"
          class="flex-auto"
          placeholder="john.doe@gmail.com"
          v-model="formData.email"
          @input="updateField('email', $event.target.value)"
        />
        <p v-if="validationErrors.email">
          <span class="text-sm text-red-500">{{ validationErrors.email }}</span>
        </p>
      </div>
      <div class="align-items-center mb-3 flex flex-col gap-2">
        <label for="password" class="w-6rem">Mot de passe</label>
        <Password
          v-model="formData.password"
          @input="updateField('password', $event.target.value)"
          id="password"
          toggleMask
          :feedback="false"
          inputClass="flex-auto"
          placeholder="************"
          :invalid="!!validationErrors.password"
        />
        <p v-if="validationErrors.password">
          <span class="text-sm text-red-500">{{ validationErrors.password }}</span>
        </p>
      </div>
      <div class="align-items-center mb-3 flex flex-col gap-2">
        <label for="passwordConfirm" class="w-6rem">Confirmation du mot de passe</label>
        <Password
          v-model="formData.passwordConfirm"
          @input="updateField('passwordConfirm', $event.target.value)"
          id="passwordConfirm"
          toggleMask
          :feedback="false"
          inputClass="flex-auto"
          placeholder="************"
          :invalid="!!validationErrors.passwordConfirm"
        />
        <p v-if="passwordMismatch">
          <span class="text-sm text-red-500">Les mots de passe ne correspondent pas</span>
        </p>
      </div>
      <!-- Checkbox -->
      <div class="mb-3">
        <Checkbox
          id="cgu"
          v-model="formData.cguAccepted"
          @change="updateField('cguAccepted', $event.target.checked)"
          :binary="true"
          :invalid="validationErrors.cguAccepted"
        />
        <label
          for="cgu"
          class="ml-2 text-sm"
          :class="validationErrors.cguAccepted && 'text-red-500'"
        >
          En cochant cette case, j'accepte les
          <RouterLink to="/legal/cgu" target="_blank" class="underline"
            >conditions générales d'utilisation</RouterLink
          >
        </label>
      </div>
      <div class="justify-content-end flex flex-col gap-2">
        <Button
          type="submit"
          label="S'inscrire"
          rounded
          :loading="isSubmitting"
          :disabled="!isValid"
        ></Button>
      </div>
    </form>
  </GenericModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { z } from 'zod'
import axios, { AxiosError } from 'axios'
import { useToast } from 'primevue/usetoast'
import GenericModal from './GenericModal.vue'
import Password from 'primevue/password'
import { Translation } from '@/helpers/translation'
import { useForm } from '@/helpers/useForm'

const API_URL = import.meta.env.VITE_API_URL

const toast = useToast()

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible'])

const localVisible = ref(props.visible)
const passwordMismatch = ref(false)

const initialData = {
  email: '',
  password: '',
  passwordConfirm: '',
  cguAccepted: false
}

const transformFunctions = {
  email: (value: string) => value.trim()
}

const validationSchema = {
  email: z.string().email({ message: 'Adresse mail invalide' }),
  password: z
    .string()
    .min(12, { message: 'Le mot de passe doit contenir au moins 12 caractères' })
    .max(32, { message: 'Le mot de passe doit contenir au maximum 32 caractères' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,32}$/, {
      message:
        'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
    }),
  passwordConfirm: z.string(),
  cguAccepted: z.literal<boolean>(true, {
    message: "Vous devez accepter les conditions générales d'utilisation"
  })
}

watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal
  }
)

watch(localVisible, (newVal) => {
  emit('update:visible', newVal)
})

async function onSubmit({ email, password }: typeof initialData) {
  if (passwordMismatch.value) {
    return
  }

  try {
    await axios.post(`${API_URL}/users`, {
      email: email,
      password: password
    })

    localVisible.value = false

    toast.add({
      severity: 'success',
      summary: 'Inscription réussie',
      detail: 'Veuillez vérifier votre boîte mail pour activer votre compte',
      life: 5000
    })
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: Translation.registerErrors(e.response?.data)!,
        life: 3000
      })
    }
  }
}

const { formData, updateField, submitForm, isSubmitting, validationErrors, isValid } = useForm(
  initialData,
  transformFunctions,
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
