<template>
  <GenericModal v-model:visible="localVisible" header="Inscription">
    <form @submit.prevent="onSubmit">
      <div class="align-items-center mb-3 flex flex-col gap-2">
        <label for="email" class="w-6rem">Adresse mail</label>
        <InputText id="email" class="flex-auto" placeholder="john.doe@gmail.com" v-model="email" />
        <p v-if="emailError">
          <span class="text-sm text-red-500">{{ emailError }}</span>
        </p>
      </div>
      <div class="align-items-center mb-3 flex flex-col gap-2">
        <label for="password" class="w-6rem">Mot de passe</label>
        <Password
          v-model="password"
          id="password"
          toggleMask
          :feedback="false"
          inputClass="flex-auto"
          placeholder="************"
          :invalid="!!passwordError"
        />
        <p v-if="passwordError">
          <span class="text-sm text-red-500">{{ passwordError }}</span>
        </p>
      </div>
      <div class="align-items-center mb-3 flex flex-col gap-2">
        <label for="passwordConfirm" class="w-6rem">Confirmation du mot de passe</label>
        <Password
          v-model="passwordConfirm"
          id="passwordConfirm"
          toggleMask
          :feedback="false"
          inputClass="flex-auto"
          placeholder="************"
        />
        <p v-if="passwordConfirmError">
          <span class="text-sm text-red-500">{{ passwordConfirmError }}</span>
        </p>
      </div>
      <!-- Checkbox -->
      <div class="mb-3">
        <Checkbox id="cgu" v-model="cguAccepted" :binary="true" :invalid="cguInvalid" />
        <label for="cgu" class="ml-2 text-sm" :class="cguInvalid && 'text-red-500'">
          En cochant cette case, j'accepte les
          <RouterLink to="/legal/cgu" target="_blank" class="underline"
            >conditions générales d'utilisation</RouterLink
          >
        </label>
      </div>
      <div class="justify-content-end flex flex-col gap-2">
        <Button type="submit" label="S'inscrire" rounded></Button>
      </div>
    </form>
  </GenericModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { z } from 'zod'
import axios, { AxiosError } from 'axios'
import { useToast } from 'primevue/usetoast'
import GenericModal from './GenericModal.vue'
import Password from 'primevue/password'
import { Translation } from '@/helpers/translation'

const toast = useToast()

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible'])

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const cguAccepted = ref(false)
const cguInvalid = ref(false)
const passwordConfirmError = ref('')
const localVisible = ref(props.visible)
const API_URL = import.meta.env.VITE_API_URL

watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal
  }
)

watch(localVisible, (newVal) => {
  emit('update:visible', newVal)
})

watch(cguAccepted, (newVal) => {
  cguInvalid.value = !newVal
})

watch(cguAccepted, (newVal) => {
  cguInvalid.value = !newVal
})

watch([password, passwordConfirm], () => {
  if (password.value !== passwordConfirm.value) {
    passwordConfirmError.value = 'Les mots de passe ne correspondent pas'
  } else {
    passwordConfirmError.value = ''
  }
})

const emailSchema = z.string().email({ message: 'Adresse mail invalide' })
const passwordSchema = z
  .string()
  .min(12, { message: 'Le mot de passe doit contenir au moins 12 caractères' })
  .max(32, { message: 'Le mot de passe doit contenir au maximum 32 caractères' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,32}$/, {
    message:
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
  })

const emailError = computed(() => {
  const parsedEmail = emailSchema.safeParse(email.value)
  if (parsedEmail.success || email.value === '') {
    return ''
  }
  return parsedEmail.error.errors[0].message
})

const passwordError = computed(() => {
  const parsedPassword = passwordSchema.safeParse(password.value)
  if (parsedPassword.success || password.value === '') {
    return ''
  }
  return parsedPassword.error.errors[0].message
})

async function onSubmit() {
  if (!cguAccepted.value) {
    cguInvalid.value = true
    return
  }

  if (
    password.value !== passwordConfirm.value ||
    emailError.value !== '' ||
    email.value === '' ||
    password.value === '' ||
    passwordConfirm.value === ''
  ) {
    return
  }

  try {
    await axios.post(`${API_URL}/users`, {
      email: email.value,
      password: password.value
    })

    email.value = ''
    password.value = ''
    passwordConfirm.value = ''
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
</script>
