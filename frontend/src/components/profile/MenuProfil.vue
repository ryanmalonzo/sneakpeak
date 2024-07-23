<script lang="ts" setup>
import { logout } from '../../helpers/auth'
</script>

<template>
  <div class="order-1 flex flex-col gap-5 md:order-2">
    <p class="text-2xl font-medium">Menu</p>

    <div class="flex flex-col gap-5 border border-black p-5">
      <RouterLink to="/profile" class="font-medium underline"
        >Mes informations personnelles
      </RouterLink>
      <RouterLink to="/profile/addresses" class="font-medium underline">Mes adresses</RouterLink>
      <RouterLink to="/profile/orders" class="font-medium underline">Mes commandes</RouterLink>
      <p class="cursor-pointer font-medium underline" @click="logout()">Se déconnecter</p>
    </div>
  </div>
</template>

<style scoped></style>