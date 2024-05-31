<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { ComputedRef } from 'vue'
import { SessionApi } from '@/services/sessionApi'

import { Traduction } from '@/helpers/traduction'

const emailSchema = z
  .string()
  .min(5, {
    message: 'Doit contenir au moins 5 caractères'
  })
  .max(30, {
    message: 'Doit contenir au plus 30 caractères'
  })
  .email({
    message: 'Email invalide'
  })

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
    const responseUser = await SessionApi.login(email.value, password.value)    
    email.value = ''
    password.value = ''
    loginError.value = ''
    modelLoginVisible.value = !modelLoginVisible.value
  } catch(e) {    
     loginError.value = Traduction.loginErrors(e as Error)!
  }
}

const modelLoginVisible = defineModel('loginVisible', { type: Boolean })
</script>

<template>
  <div class="card flex justify-content-center">
    <Dialog
      v-model:visible="modelLoginVisible"
      modal
      header="Connexion"
      :style="{ width: '30rem' }"
    >
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
          <a href="#" class="text-sm text-gray-500 underline hover:text-sneakpeak-gray-900"
            >Mot de passe oublié ?</a
          >
        </div>
        <!-- Buttons -->
        <div class="flex flex-col justify-content-end gap-2">
          <Button type="submit" label="Se connecter" rounded></Button>
          <a
            href="#"
            class="text-center text-sm text-gray-500 underline hover:text-sneakpeak-gray-900"
            >Pas encore de compte ?</a
          >
        </div>
      </form>
    </Dialog>
  </div>
</template>

<style scoped></style>
