<template>
  <GenericModal v-model:visible="localVisible" header="Connexion">
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
      <div class="align-items-center mb-5 flex flex-col gap-2">
        <label for="password" class="w-6rem">Mot de passe</label>
        <Password
          id="password"
          inputClass="flex-auto"
          toggleMask
          placeholder="************"
          v-model="formData.password"
          @input="updateField('password', $event.target.value)"
          :feedback="false"
        />
        <a
          href="#"
          class="text-sm text-gray-500 underline hover:text-sneakpeak-gray-900"
          @click="openResetPasswordModal"
          >Mot de passe oublié ?</a
        >
        <ResetPassword v-model:visible="modelResetPasswordVisible" />
      </div>
      <!-- Buttons -->
      <div class="justify-content-end flex flex-col gap-2">
        <Button
          type="submit"
          label="Se connecter"
          rounded
          :loading="isSubmitting"
          :disabled="!isValid"
        ></Button>
        <a
          href="#"
          class="text-center text-sm text-gray-500 underline hover:text-sneakpeak-gray-900"
          @click="openRegisterModal"
          >Pas encore de compte ? Inscrivez-vous</a
        >
        <AppRegister v-model:visible="modelRegisterVisible" />
      </div>
    </form>
  </GenericModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import Password from 'primevue/password'
import { SessionApi } from '@/services/sessionApi'
import { Translation } from '@/helpers/translation'
import GenericModal from './GenericModal.vue'
import AppRegister from './AppRegister.vue'
import ResetPassword from './ResetPassword.vue'
import { checkAuth } from '@/helpers/auth'
import { useForm } from '@/helpers/useForm'

const toast = useToast()

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible'])

const localVisible = ref(props.visible)

watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal
  }
)

watch(localVisible, (newVal) => {
  emit('update:visible', newVal)
})

const initialData = {
  email: '',
  password: ''
}

const transformFunctions = {
  email: (value: string) => value.trim()
}

const validationSchema = {
  email: z.string().email({ message: 'Adresse mail invalide' }),
  password: z.string()
}

async function onSubmit({ email, password }: typeof initialData) {
  try {
    await SessionApi.login(email, password)
    checkAuth()

    localVisible.value = false
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: Translation.loginErrors(e as Error)!,
      life: 3000
    })
  }
}

// Par défaut les modales sont fermées
const modelRegisterVisible = ref(false)
const modelResetPasswordVisible = ref(false)

// La modale pour l'inscription
function openRegisterModal() {
  modelRegisterVisible.value = true
}

// La modale pour la réinitialisation du mot de passe
function openResetPasswordModal() {
  modelResetPasswordVisible.value = true
}

const { formData, updateField, submitForm, isSubmitting, validationErrors, isValid } = useForm(
  initialData,
  transformFunctions,
  validationSchema,
  onSubmit
)
</script>

<style scoped></style>
