<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import MenuProfil from '@/components/profile/MenuProfil.vue'
import { ref } from 'vue'

const order = ref({
    id: 2,
    placed: 'June 3, 2023',
    total: '$57.99',
    shipTo: 'Irakli Lolashvili',
    orderNumber: '112-0822160-5390024',
    items: [
        {
            id: 1,
            image: 'https://placekitten.com/200/200',
            name: 'ORICO M.2 NVMe SSD Enclosure, USB 3.1 Gen 2 (10 Gbps) to NVMe PCI-E M.2 SSD Case Support UASP for NVMe',
            deliveryStatus: 'Delivered June 7',
            eligibleUntil: 'July 7, 2023'
        },
        {
            id: 1,
            image: 'https://placekitten.com/200/200',
            name: 'ORICO M.2 NVMe SSD Enclosure, USB 3.1 Gen 2 (10 Gbps) to NVMe PCI-E M.2 SSD Case Support UASP for NVMe',
            deliveryStatus: 'Delivered June 7',
            eligibleUntil: 'July 7, 2023'
        }
    ]
})
</script>

<template>
    <BasePage>
        <div class="flex p-4 md:px-20 md:py-10 justify-between gap-[45px]">
            <div class="">
                <h2 class="text-3xl font-medium mb-6">Ma commande</h2>



                <div class="mb-6 bg-white shadow rounded-lg">
                    <div class="flex mb-2 bg-gray-100 p-5 rounded-t-lg justify-between px-16">
                        <div class="flex gap-8">
                            <p class="flex flex-col">
                                <span class="font-light">Commandé le :</span>
                                {{ order.placed }}
                            </p>

                            <p class="flex flex-col">
                                <span class="font-light">Total:</span>
                                {{ order.total }}
                            </p>

                            <p class="flex flex-col">
                                <span class="font-light">Livré à :</span>
                                {{ order.shipTo }}
                            </p>
                            <p class="flex flex-col">
                                <span class="font-light">Facturé à :</span>
                                {{ order.shipTo }}
                            </p>



                        </div>
                        <div>
                            <p class="flex flex-col">
                                <span class="font-light">Commande : </span>
                                {{ order.orderNumber }}
                            </p>
                            <div class="flex gap-4 mt-4">
                                <button class="text-black underline">Voir la facture</button>
                                <button class="text-black underline">Commander à nouveau</button>

                            </div>
                        </div>
                    </div>

                    <div v-for="item in order.items" :key="item.id" class="flex mb-4 p-4">
                        <img :src="item.image" alt="" class="w-20 h-20 object-cover mr-4">
                        <div class="flex-1">
                            <p class="font-medium">{{ item.name }}</p>
                            <p class="text-gray-600">{{ item.deliveryStatus }}</p>
                            <div class="flex gap-4 mt-4">
                                <button class="text-black underline">Retourner un article</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <MenuProfil />
        </div>
    </BasePage>
</template>



<style>
/* Add any additional styling here */
</style>