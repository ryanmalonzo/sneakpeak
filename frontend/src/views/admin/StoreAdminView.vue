<script setup lang="ts">
import BasePageAdminView from './BasePageAdminView.vue'
import DataTable from '@/components/datatable/DataTable.vue'

const columns = [
    { key: 'sneakerName', label: 'Nom' },
    { key: 'sizeName', label: 'Taille' },
    { key: 'variantName', label: 'Couleur' },
    { key: 'sizeStock', label: 'Stock' },
]
</script>

<template>
    <BasePageAdminView>
        <DataTable :columns="columns" resource="sneakers/variants" uniqueKey="variantId"
            headerTitle="Le stock de sneakers" :isDelete="false" :isAdd="false" path="/admin/sneakers/variants" />
    </BasePageAdminView>
</template>
