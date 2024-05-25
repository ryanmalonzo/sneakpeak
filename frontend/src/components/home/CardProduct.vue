<script setup lang="ts">
import { defineProps } from 'vue'
const { name, price, image } = defineProps<{ name: string, price: number, image: string }>()

</script>


<template>

    <div class="align-middle justify-center flex">
        <a href=""
            class="flex w-[264px] h-auto justify-center items-start text-center content-start gap-5 shrink-0 flex-wrap">

            <img :src="image" alt="" />
            <p>{{ name }}</p>
            <p class="font-bold">{{ price }} €</p>
        </a>
    </div>
</template>