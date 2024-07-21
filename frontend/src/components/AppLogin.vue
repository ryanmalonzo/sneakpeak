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
    </div>
  </form>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import Password from 'primevue/password'
import { SessionApi } from '@/services/sessionApi'
import { Translation } from '@/helpers/translation'
import AppRegister from './AppRegister.vue'
import ResetPassword from './ResetPassword.vue'
import { checkAuth } from '@/helpers/auth'
import { useForm } from '@/helpers/useForm'
import { useDialog } from 'primevue/usedialog'

const toast = useToast()
const dialog = useDialog()
const dialogRef = inject('dialogRef') as { value: { close: () => void } }

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

const closeModal = () => {
  dialogRef.value.close()
}

async function onSubmit({ email, password }: typeof initialData) {
  try {
    await SessionApi.login(email, password)
    await checkAuth()
    closeModal()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: Translation.loginErrors(e as Error)!,
      life: 3000
    })
  }
}

// La modale pour l'inscription
function openRegisterModal() {
  dialog.open(AppRegister, { props: { dismissableMask: true, modal: true, header: "Inscription" } })
}

// La modale pour la réinitialisation du mot de passe
function openResetPasswordModal() {
  dialog.open(ResetPassword, { props: { dismissableMask: true, modal: true, header: "Mot de passe oublié" } })
}

const { formData, updateField, submitForm, isSubmitting, validationErrors, isValid } = useForm(
  initialData,
  transformFunctions,
  validationSchema,
  onSubmit
)
</script>

<style scoped></style>
