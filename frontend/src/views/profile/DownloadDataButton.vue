<script setup lang="ts">
import Button from 'primevue/button'
import JSZip from 'jszip'
import { SessionApi } from '@/services/sessionApi'

const BASE_URL = import.meta.env.VITE_API_URL

const fetchProfile = async () => {
  const user = await SessionApi.getProfile()
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

const fetchOrders = async () => {
  const response = await fetch(`${BASE_URL}/profile/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  const data = await response.json()
  return data.orders
}

const downloadData = async () => {
  const zip = new JSZip()

  zip.file('profile.json', JSON.stringify(await fetchProfile()))
  zip.file('orders.json', JSON.stringify(await fetchOrders()))

  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.zip'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <Button
    icon="pi pi-download"
    label="Télécharger mes données"
    severity="info"
    class="self-start"
    @click="downloadData"
  />
</template>
