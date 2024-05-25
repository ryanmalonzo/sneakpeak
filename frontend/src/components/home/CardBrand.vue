<script setup lang="ts">
import { defineProps } from 'vue'
const { name, image } = defineProps<{ name: string, image: string }>()
</script>

<template>
    <a href="#">
        <img :src="image" :alt="name" class="w-[200px] h-auto">
    </a>
</template>