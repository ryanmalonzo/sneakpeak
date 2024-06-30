<script setup lang="ts">
defineProps<{
  image: string
}>()
</script>

<template>
  <a href="#">
    <img :src="image" alt="" class="h-auto w-[200px]" />
  </a>
</template>
