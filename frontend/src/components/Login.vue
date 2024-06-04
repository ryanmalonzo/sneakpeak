<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { ComputedRef } from 'vue'
import { SessionApi } from '@/services/sessionApi'
import { Translation } from '@/helpers/translation'
import GenericModal from './GenericModal.vue'
import Register from './Register.vue'
import ResetPassword from './ResetPassword.vue'

const emailSchema = z
  .string()
  .min(5, { message: 'Doit contenir au moins 5 caractères' })
  .max(30, { message: 'Doit contenir au plus 30 caractères' })
  .email({ message: 'Email invalide' })

const email = ref('')
const password = ref('')
const loginError = ref('')

const emailError: ComputedRef<string> = computed(() => {
  const parsedEmail = emailSchema.safeParse(email.value)
  if (parsedEmail.success || email.value === '') {
    return ''
  }
  return parsedEmail.error.errors[0].message
})

async function onSubmit() {
  if (emailError.value !== '' || email.value === '' || password.value === '') {
    return null
  }

  try {
    await SessionApi.login(email.value, password.value)
    email.value = ''
    password.value = ''
    loginError.value = ''
    modelLoginVisible.value = false
  } catch (e) {
    loginError.value = Translation.loginErrors(e as Error)!
  }
}

// Par défaut les modales sont fermées
const modelLoginVisible = ref(false)
const modelRegisterVisible = ref(false)
const modelResetPasswordVisible = ref(false) 

// La modale pour l'inscription
function openRegisterModal() {
  modelLoginVisible.value = false
  modelRegisterVisible.value = true
}

// La modale pour la réinitialisation du mot de passe
function openResetPasswordModal() {
  modelLoginVisible.value = false
  modelResetPasswordVisible.value = true
}
</script>

<template>
  <GenericModal v-model:visible="modelLoginVisible" header="Connexion">
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col align-items-center gap-2 mb-3">
        <label for="email" class="w-6rem">Adresse mail</label>
        <InputText
          id="email"
          class="flex-auto"
          placeholder="john.doe@gmail.com"
          v-model="email"
        />
        <p v-if="emailError">
          <span class="text-red-500 text-sm">{{ emailError }}</span>
        </p>
      </div>
      <div class="flex flex-col align-items-center gap-2 mb-5">
        <label for="password" class="w-6rem">Mot de passe</label>
        <InputText
          type="password"
          id="password"
          class="flex-auto"
          placeholder="************"
          v-model="password"
        />
        <p v-if="loginError">
          <span class="text-red-500 text-sm">{{ loginError }}</span>
        </p>
        <a href="#" class="text-sm text-gray-500 underline hover:text-sneakpeak-gray-900" @click="openResetPasswordModal">Mot de passe oublié ?</a>
        <ResetPassword v-model:visible="modelResetPasswordVisible" />
      </div>
      <!-- Buttons -->
      <div class="flex flex-col justify-content-end gap-2">
        <Button type="submit" label="Se connecter" rounded></Button>
        <a href="#" class="text-center text-sm text-gray-500 underline hover:text-sneakpeak-gray-900" @click="openRegisterModal">Pas encore de compte ? Inscrivez-vous</a>
        <Register v-model:visible="modelRegisterVisible" />
      </div>
    </form>
  </GenericModal>

</template>

<style scoped></style>
