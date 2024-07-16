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
/*
 const data = {
      order: {
        total: order.total,
        status: order.status,
        payment_status: order.payment_status,
        reference: order.reference,
      },
      shipping: {
        name: shipping.name,
        city: shipping.city,
        street: shipping.street,
        phone: shipping.phone,
        postal_code: shipping.postal_code,
      },
      billing: {
        name: billing.name,
        city: billing.city,
        street: billing.street,
        phone: billing.phone,
        postal_code: billing.postal_code,
      },
      products: products.map((product) => ({
        image: 'https://via.placeholder.com/150',
        name: product.name,
        quantity: product.quantity,
        unit_price: product.unitPrice,
      })),
    };
*/
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
    console.log(data)
    order.value = data
}

loadOrder()
console.log(order.value)
</script>

<template>
    <BasePage>
        <div class="flex p-4 md:px-20 md:py-10 justify-between gap-[45px]">
            <div class="">
                <h2 class="text-3xl font-medium mb-6">Ma commande</h2>



                <div class="mb-6 bg-white shadow rounded-lg">
                    <div class="flex mb-2 bg-gray-100 p-5 rounded-t-lg justify-between px-16">
                        <div class="flex gap-8">
                            <div class="flex flex-col">
                                <span class="font-light w-max">Commandé le :</span>
                                <p>
                                    {{ new Date(order.order.createdAt).toLocaleDateString() }}
                                </p>
                            </div>

                            <div class="flex flex-col w-max">
                                <span class="font-light">Total:</span>
                                <p class="w-max">
                                    {{ order.order.total }} €
                                </p>
                            </div>

                            <div class="flex flex-col">
                                <span class="font-light">Livré à :</span>
                                <p> {{ order.shipping.name }} {{ order.shipping.city }} {{ order.shipping.street }} {{
                                    order.shipping.postal_code }}</p>

                            </div>
                            <div class="flex flex-col">
                                <span class="font-light">Facturé à :</span>
                                <p>{{ order.billing.name }} {{ order.billing.city }} {{ order.billing.street }} {{
                                    order.billing.postal_code }}</p>

                            </div>



                        </div>
                        <div class="flex flex-col justify-between">
                            <p>
                                <span class="font-light w-max">Ref : {{ order.order.reference }}</span>


                            </p>
                            <div class="flex gap-4 mt-4 w-max">
                                <button class="text-black underline">Voir la facture</button>
                                <button class="text-black underline">Commander à nouveau</button>

                            </div>
                        </div>
                    </div>

                    <div v-for="item in order.products" :key="item.id" class="flex mb-4 p-4">
                        <img :src="item.image" alt="" class="w-[130px] h-[130px] object-cover mr-4">
                        <div class="flex justify-between w-full">
                            <div class="flex justify-between flex-col">
                                <p class="font-medium">{{ item.name }}</p>
                                <p class="text-gray-600">Couleur : {{ item.color }}</p>
                                <p class="text-gray-600">Taille : {{ item.size }}</p>
                                <p class="text-gray-600">{{ item.quantity }} x {{ item.unit_price }} €</p>
                            </div>
                            <div class="">
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