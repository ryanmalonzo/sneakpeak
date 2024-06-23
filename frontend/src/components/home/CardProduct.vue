<script setup lang="ts">
defineProps<{
  image: string
  name: string
  price: number
}>()
</script>

<template>
  <div class="flex justify-center align-middle">
    <a href="" class="flex h-auto w-[264px] shrink-0 flex-col justify-center text-center">
      <img :src="image" :alt="name" />
      <p>{{ name }}</p>
      <p class="font-bold">{{ price }} €</p>
    </a>
  </div>
</template>

<style scoped>
img {
  width: 100%;
  height: 144px;
  object-fit: cover;
  padding-bottom: 20px;
}
</style>
