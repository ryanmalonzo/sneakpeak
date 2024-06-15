<template>
    <GenericModal v-model:visible="modelRegisterVisible" header="Inscription">
      <form>
        <div class="flex flex-col align-items-center gap-2 mb-3">
            <label for="email" class="w-6rem">Adresse mail</label>
            <InputText
              id="email"
              class="flex-auto"
              placeholder="amine.nairi@gmail.com"
              v-model="email"
            />
            <p v-if="emailError">
                <span class="text-red-500 text-sm">{{ emailError }}</span>
            </p>
        </div>
        <div class="flex flex-col align-items-center gap-2 mb-3">
            <label for="password" class="w-6rem">Mot de passe</label>
            <InputText
              type="password"
              id="password"
              class="flex-auto"
              placeholder="************"
              v-model="password"
            />
        </div>
        <div class="flex flex-col align-items-center gap-2 mb-3">
            <label for="passwordConfirm" class="w-6rem">Confirmation du mot de passe</label>
            <InputText
              type="password"
              id="passwordConfirm"
              class="flex-auto"
              placeholder="************"
              v-model="password"
            />
        </div>
        <div class="flex flex-col justify-content-end gap-2">
          <Button type="submit" label="S'inscrire" rounded></Button>
        </div>
      </form>
    </GenericModal>
</template>
  
<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { z } from 'zod'
  import GenericModal from './GenericModal.vue'
  
  // Gestion des erreurs dans le formulaire instantanément avec zod
  const emailSchema = z
    .string()
    .min(5, { message: 'Doit contenir au moins 5 caractères' })
    .max(30, { message: 'Doit contenir au plus 30 caractères' })
    .email({ message: 'Email invalide' })
  
  const email = ref('')
  const password = ref('')

  const emailError = computed(() => {
    const parsedEmail = emailSchema.safeParse(email.value)
    if (parsedEmail.success || email.value === '') {
      return ''
    }
    return parsedEmail.error.errors[0].message
  })
  
  const modelRegisterVisible = ref(false)
</script>
  
<style scoped></style>
  