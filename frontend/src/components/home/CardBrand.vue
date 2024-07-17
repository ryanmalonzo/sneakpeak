<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{
  name: string
  image: string
}>()
</script>

<template>
  <img
    :src="image"
    alt=""
    class="h-auto w-[200px] cursor-pointer"
    @click="router.push(`/search?brand=${name}`)"
  />
</template>
