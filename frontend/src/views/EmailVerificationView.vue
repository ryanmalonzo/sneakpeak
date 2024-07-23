<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { checkAuth } from '@/helpers/auth'

const API_URL = import.meta.env.VITE_API_URL
const route = useRoute()
const router = useRouter()

const toast = useToast()

const invalidLink = ref(false)

onMounted(async () => {
  const userId = route.query.id
  const emailToken = route.query.token

  if (userId && emailToken) {
    const response = await fetch(`${API_URL}/users/${userId}/challenge/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: emailToken }),
      credentials: 'include'
    })

    if (response.ok) {
      // Set user profile
      await checkAuth()

      router.replace('/')

      toast.add({
        severity: 'success',
        summary: 'Adresse mail vérifiée',
        detail: 'Votre adresse mail a été vérifiée avec succès.'
      })
    } else {
      invalidLink.value = true
    }
  } else {
    invalidLink.value = true
  }
})
</script>

<template>
  <main>
    <p v-if="invalidLink">
      Lien invalide ou expiré. Si vous avez enregistré un compte sur SneakPeak, veuillez
      <RouterLink to="/login">vous connecter</RouterLink>.
    </p>
  </main>
</template>
