<template>
  <GenericModal v-model:visible="localVisible" header="Mot de passe oublié">
    <form @submit.prevent="onSubmit">
      <div class="align-items-center mb-3 flex flex-col gap-2">
        <label for="email" class="w-6rem">Adresse mail</label>
        <InputText id="email" class="flex-auto" placeholder="john.doe@gmail.com" v-model="email" />
        <span v-if="emailError" class="error-message">{{ emailError }}</span>
      </div>
      <div class="justify-content-end flex flex-col gap-2">
        <Button type="submit" label="Recevoir le lien" rounded></Button>
      </div>
      <div v-if="resetPasswordError" class="error-message">{{ resetPasswordError }}</div>
    </form>
  </GenericModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { z } from 'zod'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import GenericModal from './GenericModal.vue'

const toast = useToast()

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible'])
const API_URL = import.meta.env.VITE_API_URL

const email = ref('')
const resetPasswordError = ref('')
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

const emailSchema = z.string().email({ message: 'Adresse mail invalide' })

const emailError = computed(() => {
  const parsedEmail = emailSchema.safeParse(email.value)
  if (parsedEmail.success || email.value === '') {
    return ''
  }
  return parsedEmail.error.errors[0].message
})

async function onSubmit() {
  if (emailError.value !== '' || email.value === '') {
    return
  }
  await axios.post(`${API_URL}/users/password-reset`, { email: email.value })

  toast.add({
    severity: 'success',
    summary: 'Succès',
    detail:
      "Si l'adresse mail que vous avez entrée est associée à un compte, un lien de réinitialisation de mot de passe vient de vous être envoyé.",
    life: 5000
  })

  // reset les champs
  resetPasswordError.value = ''
  email.value = ''

  // ferme la modale
  localVisible.value = false
}
</script>

<style scoped>
.error-message {
  color: red;
}
</style>
