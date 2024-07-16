<script setup lang="ts">

import BasePage from '@/components/BasePage.vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api';
import MenuProfil from '@/components/profile/MenuProfil.vue';

import { ref, onMounted } from 'vue'

const orders = ref([])
const loading = ref(true);
const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
        paid: 'Payé',
        pending: 'En attente de paiement',
        isDelivered: 'En cours de livraison',
        completed: 'Livré',
    }
    return translations[status] || status;
}


const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    reference: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    total: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: "", matchMode: FilterMatchMode.EQUALS },
    payment_status: { value: "", matchMode: FilterMatchMode.EQUALS },
    createdAt: { value: null, matchMode: FilterMatchMode.DATE_IS },
});

const getSeverity = (status: string) => {
    switch (status) {
        case 'pending':
            return 'text-red-500 bg-red-100 border-red-500 text-center rounded-full px-3 py-1 font-semibold text-sm';
        case 'isDelivered':
            return 'text-blue-500 bg-blue-100 border-blue-500 text-center rounded-full px-3 py-1 font-semibold text-sm';
        case 'completed':
            return 'text-green-500 bg-green-100 border-green-500 text-center rounded-full px-3 py-1 font-semibold text-sm';
        case 'paid':
            return 'text-green-500 bg-green-100 border-green-500 text-center rounded-full px-3 py-1 font-semibold text-sm';
    }
}
const BASE_URL = import.meta.env.VITE_API_URL
onMounted(async () => {
    // Load orders
    const loadOrders = async () => {
        const response = await fetch(`${BASE_URL}/profile/orders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const data = await response.json()
        console.log(data)
        orders.value = data.orders
        loading.value = false;
    }

    loadOrders()
})

</script>

<template>

    <BasePage>
        <router-view>
            <div class="flex flex-1 flex-col p-2 md:px-[100px] md:py-10">
                <div class="flex flex-col max-md:gap-30px md:flex-row gap-5 max-md:w-[75vw] mx-auto">
                    <!-- Left -->
                    <div class="order-2 flex flex-1 flex-col gap-5 md:order-1 md:gap-30px">
                        <h2 class="text-2xl font-medium">Mes commandes</h2>

                        <DataTable v-model:filters="filters" :value="orders" paginator :rows="5" dataKey="id"
                            filterDisplay="row" :loading="loading"
                            :globalFilterFields="['reference', 'total', 'status', 'payment_status', 'createdAt']">
                            <template #header>
                                <div class="flex justify-end">
                                    <IconField>
                                        <InputText v-model="filters['global'].value" placeholder="Recherche par mot-clé"
                                            class="mx-3" />
                                    </IconField>
                                </div>
                            </template>
                            <template #empty> Aucune commande n'a été trouvée </template>
                            <template #loading> Chargement des commandes... </template>
                            <Column field="reference" header="Référence" style="min-width: 12rem;text-align: center;"
                                class="mx-auto">
                                <template #body="{ data }">
                                    {{ data.reference }}
                                </template>
                            </Column>
                            <Column field="total" header="Total" style="min-width: 12rem;text-align: center;"
                                class="mx-auto">
                                <template #body="{ data }">
                                    {{ data.total }}
                                </template>
                            </Column>
                            <Column field="status" header="Status" :showFilterMenu="false"
                                style="min-width: 12rem;text-align: center;" class="mx-auto">
                                <template #body="{ data }">
                                    <p :class="getSeverity(data.status)"> {{ translateStatus(data.status) }}</p>
                                </template>
                            </Column>
                            <Column field="payment_status" header="Paiement" :showFilterMenu="false"
                                style="min-width: 12rem;text-align: center;" class="mx-auto">
                                <template #body="{ data }">
                                    <p :class="getSeverity(data.payment_status)"> {{
                                        translateStatus(data.payment_status) }}
                                    </p>
                                </template>
                            </Column>
                            <Column field="updatedAt" header="Derière mise à jour"
                                style="min-width: 12rem;text-align: center;" class="mx-auto">
                                <template #body="{ data }">
                                    {{ new Date(data.createdAt).toLocaleDateString() }}
                                </template>
                            </Column>
                            <Column field="actions" header="Actions" style="min-width: 12rem;text-align: center;"
                                class="mx-auto">
                                <template #body="{ data }">
                                    <RouterLink :to="'/profile/orders/' + data.reference" class="">
                                        <IconField>
                                            <i class="pi pi-eye"></i>
                                        </IconField>
                                    </RouterLink>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                    <!-- Right -->
                    <MenuProfil />
                </div>
            </div>
        </router-view>
    </BasePage>

</template>

<style>
.p-datatable-column-title {
    margin-left: auto;
    margin-right: auto;
}
</style>