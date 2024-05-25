<script setup lang="ts">
import { defineProps } from 'vue'
const { name, price, coverImage } = defineProps<{ name: string, price: number, coverImage: string }>()

</script>

<template>
    <div class="flex justify-center items-start content-start">
        <a href="#">
            <img :src="coverImage" alt="" class=" w-[172px] h-[162px]">
        </a>
        <a href="#" class="text-center gap-y-4 flex flex-col p-4">


            <p class="">{{ name }}</p>


            <p class="font-bold">{{ price }} €</p>

            <button class="bg-black text-white px-2 py-2 font-semibold">Voir le produit</button>

        </a>

    </div>
</template>