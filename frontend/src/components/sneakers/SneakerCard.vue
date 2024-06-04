<script setup lang="ts">
defineProps<{
  image: string
  name: string
  price: number
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-3" id="sneaker-card">
    <img
      :src="image"
      :alt="name"
      class="h-[105px] w-[159px] rounded-[10px] object-cover md:h-[144px] md:w-[264px]"
      id="cover"
    />
    <div class="flex flex-col text-center">
      <p>{{ name }}</p>
      <p class="text-sm font-bold">{{ price }} €</p>
    </div>
  </div>
</template>

<style scoped>
#cover {
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
}
</style>
