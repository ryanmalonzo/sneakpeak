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
        <DataTable :columns="columns" resource="sneakers/variants" uniqueKey="id" headerTitle="Variantes"
            path="/admin/variants" deleteResource="variants" :isAdd="false" :isDelete="false" />
    </BasePageAdminView>
</template>
