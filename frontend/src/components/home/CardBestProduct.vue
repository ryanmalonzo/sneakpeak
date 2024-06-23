<script setup lang="ts">
defineProps({
  image: String,
  name: String,
  price: Number
})
</script>

<template>
  <div class="flex flex-wrap justify-center">
    <img :src="image" :alt="name" class="h-[162px] w-[172px] object-contain" />
    <div class="flex flex-1 flex-col flex-wrap items-center justify-center gap-4 p-4">
      <p>{{ name }}</p>
      <p class="font-bold">{{ price }} €</p>
      <a href="#" class="bg-black px-10 py-2 font-semibold text-white">Voir le produit</a>
    </div>
  </div>
</template>
