<script setup lang="ts">
import BasePageAdminView from './BasePageAdminView.vue'
import DataTable from '@/components/datatable/DataTable.vue'

const columns = [
    { key: 'reference', label: 'Référence' },
]
</script>

<template>
    <BasePageAdminView>
        <DataTable :columns="columns" resource="orders" uniqueKey="reference" headerTitle="Commandes"
            path="/admin/orders" />
    </BasePageAdminView>
</template>
