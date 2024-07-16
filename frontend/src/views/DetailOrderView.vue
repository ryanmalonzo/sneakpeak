<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import MenuProfil from '@/components/profile/MenuProfil.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

interface Order {
    order: {
        total: number;
        status: string;
        payment_status: string;
        reference: string;
        createdAt: string;
        invoice_link: string;
    };
    shipping: {
        name: string;
        city: string;
        street: string;
        phone: string;
        postal_code: string;
    };
    billing: {
        name: string;
        city: string;
        street: string;
        phone: string;
        postal_code: string;
    };
    products: {
        id: string;
        image: string;
        color: string;
        size: string;
        name: string;
        quantity: number;
        unit_price: number;
    }[];
}
const route = useRoute()
const order = ref({} as Order)
const BASE_URL = import.meta.env.VITE_API_URL
const loadOrder = async () => {
    const response = await fetch(`${BASE_URL}/profile/orders/${route.params.reference}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    const data = await response.json()
    order.value = data
}

loadOrder()
</script>

<template>
    <BasePage>
        <div class="flex flex-col lg:flex-row p-4 md:p-6 lg:p-10 justify-between gap-6 lg:gap-[45px]">
            <div class="w-full lg:w-3/4">
                <h2 class="text-2xl md:text-3xl font-medium mb-6">Ma commande</h2>

                <div class="mb-6 bg-white shadow rounded-lg">
                    <div class="flex flex-col md:flex-row bg-gray-100 p-4 md:p-5 rounded-t-lg justify-between">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mb-4 md:mb-0">
                            <div class="flex flex-col">
                                <span class="font-light">Commandé le :</span>
                                <p class="truncate">
                                    {{ new Date(order.order.createdAt).toLocaleDateString() }}
                                </p>
                            </div>

                            <div class="flex flex-col">
                                <span class="font-light">Total:</span>
                                <p class="truncate">
                                    {{ order.order.total }} €
                                </p>
                            </div>

                            <div class="flex flex-col">
                                <span class="font-light">Livré à :</span>
                                <p class="">{{ order.shipping.name }} {{ order.shipping.city }} {{
                                    order.shipping.street }} {{ order.shipping.postal_code }}</p>
                            </div>

                            <div class="flex flex-col">
                                <span class="font-light">Facturé à :</span>
                                <p class="">{{ order.billing.name }} {{ order.billing.city }} {{
                                    order.billing.street }} {{ order.billing.postal_code }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col justify-between mt-4 md:mt-0">
                            <p class="truncate">
                                <span class="font-light">Ref : {{ order.order.reference }}</span>
                            </p>
                            <div class="flex flex-wrap gap-4 mt-4">
                                <button class="text-black underline">
                                    <a :href="order.order.invoice_link" target="_blank">
                                        Voir la facture
                                    </a>
                                </button>
                                <button class="text-black underline">Commander à nouveau</button>
                            </div>
                        </div>
                    </div>

                    <div v-for="item in order.products" :key="item.id" class="flex flex-col sm:flex-row mb-4 p-4">
                        <img :src="item.image" alt=""
                            class="w-full sm:w-[130px] h-[130px] object-cover mb-4 sm:mb-0 sm:mr-4">
                        <div class="flex flex-col sm:flex-row justify-between w-full">
                            <div class="flex justify-between flex-col mb-4 sm:mb-0">
                                <p class="font-medium">{{ item.name }}</p>
                                <p class="text-gray-600">Couleur : {{ item.color }}</p>
                                <p class="text-gray-600">Taille : {{ item.size }}</p>
                                <p class="text-gray-600">{{ item.quantity }} x {{ item.unit_price }} €</p>
                            </div>
                            <div class="self-end sm:self-center">
                                <button class="text-black underline">Retourner un article</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full lg:w-1/4">
                <MenuProfil />
            </div>
        </div>
    </BasePage>
</template>



<style></style>