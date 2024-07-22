<script setup lang="ts">
import BasePageAdminView from './BasePageAdminView.vue'
import DataTable from '@/components/datatable/DataTable.vue'

const columns = [
    { key: 'reference', label: 'Référence' },
    { key: 'total', label: 'Total' },
    { key: 'status', label: 'Statut' },
    { key: 'payment_status', label: 'Statut de paiement' },
    { key: 'createdAt', label: 'Date de création' },

]
</script>

<template>
    <BasePageAdminView>
        <DataTable :columns="columns" resource="orders" uniqueKey="reference" headerTitle="Commandes"
            path="/admin/orders" />
    </BasePageAdminView>
</template>
