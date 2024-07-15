<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import BasePage from '@/components/BasePage.vue'
import FormRow from '@/components/profile/FormRow.vue'
import InputWithLabel from '@/components/profile/InputWithLabel.vue'
import PasswordWithLabel from '@/components/profile/PasswordWithLabel.vue'
import type { IProfile } from '@/services/sessionApi'
import { useForm } from '@/helpers/useForm'
import MenuProfil from '@/components/profile/MenuProfil.vue'

const API_URL = import.meta.env.VITE_API_URL

const toast = useToast()

const localProfile = localStorage.getItem('profile')
const profile: IProfile = JSON.parse(localProfile!)

const passwordMismatch = ref(false)

const name = computed(() => {
  return profile.firstName || profile.email
})

const initialData = {
  firstName: profile.firstName || '',
  lastName: profile.lastName || '',
  phone: profile.phone || '',
  email: profile.email,
  password: '',
  passwordConfirm: ''
}

const transformFunctions = {
  firstName: (value: string) => value.trim(),
  lastName: (value: string) => value.trim(),
  phone: (value: string) => value.trim(),
  email: (value: string) => value.trim()
}

const validationSchema = {
  firstName: z.string().optional().or(z.literal('')),
  lastName: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email({ message: 'Adresse mail invalide' }).optional().or(z.literal('')),
  password: z
    .string()
    .min(12, { message: 'Le mot de passe doit contenir au moins 12 caractères' })
    .max(32, { message: 'Le mot de passe doit contenir au maximum 32 caractères' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,32}$/, {
      message:
        'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
    })
    .optional()
    .or(z.literal('')),
  passwordConfirm: z.string().optional().or(z.literal(''))
}

const sendErrorToast = () => {
  toast.add({
    severity: 'error',
    summary: 'Erreur',
    detail: 'Une erreur est survenue lors de la sauvegarde de vos informations',
    life: 3000
  })
}

const onSubmit = async () => {
  // Password confirmation should match if password is being modified
  if (formData.password) {
    if (passwordMismatch.value) {
      return
    }
  }

  // Update profile
  try {
    const response = await fetch(`${API_URL}/users/${profile.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        password: formData.password || undefined
      }),
      credentials: 'include'
    })

    if (response.ok) {
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Vos informations ont été mises à jour',
        life: 5000
      })
    } else {
      sendErrorToast()
    }
  } catch {
    sendErrorToast()
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

<template>
  <BasePage>
    <div class="flex flex-1 flex-col p-5 md:px-[100px] md:py-10">
      <div class="flex flex-col gap-30px md:flex-row md:gap-[100px]">
        <!-- Left -->
        <div class="order-2 flex flex-1 flex-col gap-5 md:order-1 md:gap-30px">
          <h2 class="text-2xl font-medium">Bonjour {{ name }}</h2>
          <p>Merci de vérifier que les informations ci-dessous sont à jour</p>

          <!-- Personal Information -->
          <form @submit.prevent="submitForm" class="flex flex-col gap-5 self-stretch md:gap-30px">
            <h2 class="text-2xl font-medium uppercase">Mes informations</h2>

            <FormRow>
              <InputWithLabel id="firstName" label="Prénom" placeholder="John" :value="formData.firstName"
                @input="updateField('firstName', ($event.target as HTMLInputElement).value)"
                :helperText="validationErrors.firstName" />
              <InputWithLabel id="lastName" label="Nom" placeholder="Doe" :value="formData.lastName"
                @input="updateField('lastName', ($event.target as HTMLInputElement).value)"
                :helperText="validationErrors.lastName" />
            </FormRow>

            <FormRow>
              <InputWithLabel id="phone" label="Téléphone" placeholder="06 01 02 03 04" :value="formData.phone"
                @input="updateField('phone', ($event.target as HTMLInputElement).value)"
                :helperText="validationErrors.phone" />
              <InputWithLabel id="email" label="Adresse mail" placeholder="john.doe@gmail.com" :value="formData.email"
                @input="updateField('email', ($event.target as HTMLInputElement).value)"
                :helperText="validationErrors.email" />
            </FormRow>

            <FormRow>
              <PasswordWithLabel id="password" label="Mot de passe" :value="formData.password"
                @input="updateField('password', $event)" :helperText="validationErrors.password"
                :invalid="!!validationErrors.password" />
              <PasswordWithLabel id="passwordConfirm" label="Confirmation du mot de passe"
                :value="formData.passwordConfirm" @input="updateField('passwordConfirm', $event)"
                helperText="Les mots de passe ne correspondent pas" :invalid="passwordMismatch" />
            </FormRow>

            <Button type="submit" label="Sauvegarder" severity="contrast"
              class="self-start !rounded-none !px-5 uppercase" :loading="isSubmitting" :disabled="!isValid" />
          </form>
        </div>

        <!-- Right -->
        <MenuProfil />
      </div>
    </div>
  </BasePage>
</template>
