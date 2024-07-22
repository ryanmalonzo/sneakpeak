<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { logout } from '@/helpers/auth'
import ButtonConfirm from '@/components/ButtonConfirm.vue'
import { SessionApi } from '@/services/sessionApi'
import { useToast } from 'primevue/usetoast'

const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')
const API_URL = import.meta.env.VITE_API_URL
const userId = ref<number | null>(null)
const toast = useToast()

const getUserId = async () => {
  try {
    const profile = await SessionApi.getProfile()
    userId.value = profile.id
  } catch (err) {
    error.value = true
    errorMessage.value = "Impossible de récupérer les informations de l'utilisateur."
  }
}

const deleteAccount = async () => {
  loading.value = true
  error.value = false

  // Vérification supplémentairement pour savoir si l'user est connecté
  if (userId.value === null) {
    error.value = true
    errorMessage.value = 'Utilisateur non connecté.'
    loading.value = false
    return
  }

  // Requete pour anonymiser l'user
  try {
    const response = await fetch(`${API_URL}/users/${userId.value}/anonymize`, {
      method: 'POST',
      credentials: 'include'
    })

    if (response.status === 204) {
      // Déconnecte l'utilisateur
      logout()

      toast.add({
        severity: 'success',
        summary: 'Compte supprimé',
        detail: 'Votre compte a bien été supprimé.'
      })
    } else {
      throw new Error('Erreur lors de la suppression du compte')
    }
  } catch (err) {
    error.value = true
    errorMessage.value = 'Une erreur est survenue lors de la suppression du compte.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getUserId()
})
</script>

<template>
  <div class="order-1 flex flex-col gap-5 md:order-2">
    <p class="text-2xl font-medium">Menu</p>

    <div class="flex flex-col gap-5 border border-black p-5">
      <RouterLink to="/profile" class="font-medium underline"
        >Mes informations personnelles</RouterLink
      >
      <RouterLink to="/profile" class="font-medium underline">Mes adresses</RouterLink>
      <RouterLink to="/profile/orders" class="font-medium underline">Mes commandes</RouterLink>
      <p class="cursor-pointer font-medium underline" @click="logout()">Se déconnecter</p>
      <ButtonConfirm
        icon="pi pi-trash"
        label="Supprimer mon compte"
        severity="danger"
        confirmMessage="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
        errorMessage="Une erreur est survenue lors de la suppression du compte."
        :loading="loading"
        :error="error"
        @confirm="deleteAccount"
      />
    </div>
  </div>
</template>

<style scoped></style>
