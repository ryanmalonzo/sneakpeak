<script setup lang="ts">

import BasePage from '@/components/BasePage.vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api';

import { ref, onMounted } from 'vue'

const orders = ref([])
const loading = ref(true);
const statuses = ref(['completed', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);


const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    reference: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    total: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: "completed", matchMode: FilterMatchMode.EQUALS },
    payment_status: { value: "paid", matchMode: FilterMatchMode.EQUALS },
    createdAt: { value: null, matchMode: FilterMatchMode.DATE_IS },
});

const getSeverity = (status) => {
    switch (status) {
        case 'pending':
            return 'text-red-500 bg-red-100 border-red-500 text-center rounded-full px-3 py-1 font-semibold text-sm';
        case 'completed':
            return 'text-green-500 bg-green-100 border-green-500 text-center rounded-full px-3 py-1 font-semibold text-sm';
        case 'paid':
            return 'text-green-500 bg-green-100 border-green-500 text-center rounded-full px-3 py-1 font-semibold text-sm';
    }
}

onMounted(async () => {
    // Load orders
    const loadOrders = async () => {
        const response = await fetch('http://localhost:3000/profile/orders', {
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
        <h1>Vos commandes</h1>
        <!-- <DataTable :value="orders" tableStyle="min-width: 50rem">
            <Column field="reference" header="Référence"></Column>
            <Column field="total" header="Total"></Column>
            <Column field="status" header="Status"></Column>
            <Column field="payment_status" header="Paiement"></Column>
            <Column field="createdAt" header="Date"></Column>
        </DataTable> -->
        <DataTable v-model:filters="filters" :value="orders" paginator :rows="10" dataKey="id" filterDisplay="row"
            :loading="loading" :globalFilterFields="['reference', 'total', 'status', 'payment_status', 'createdAt']">
            <template #header>
                <div class="flex justify-end">
                    <IconField>
                        <InputText v-model="filters['global'].value" placeholder="Recherche par mot-clé" class="mx-3" />
                    </IconField>
                </div>
            </template>
            <template #empty> Aucune commande n'a été trouvée </template>
            <template #loading> Chargement des commandes... </template>
            <Column field="reference" header="Name" style="min-width: 12rem" class="text-center">
                <template #body="{ data }">
                    {{ data.reference }}
                </template>
            </Column>
            <Column field="total" header="Total" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.total }}
                </template>
            </Column>
            <Column field="status" header="Status" :showFilterMenu="false" style="min-width: 12rem"
                class="justify-center flex">
                <template #body="{ data }">
                    <p :class="getSeverity(data.status)"> {{ data.status }}</p>
                </template>
            </Column>
            <Column field="payment_status" header="Paiement" :showFilterMenu="false" style="min-width: 12rem">
                <template #body="{ data }">
                    <p :class="getSeverity(data.payment_status)"> {{ data.payment_status }}</p>
                </template>
            </Column>
        </DataTable>


    </BasePage>
</template>

<style scoped>
.p-datatable-column-header-content {
    font-weight: bold;
    justify-content: center;
}
</style>