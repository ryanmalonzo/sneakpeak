<script setup lang="ts">
import BasePageAdminView from './BasePageAdminView.vue'
import DataTable from '@/components/datatable/DataTable.vue'

const columns = [
  { key: 'sneakerName', label: 'Sneaker'},
  { key: 'variantName', label: 'Nom Couleur' },
  { key: 'variantImage', label: 'Image' },
  { key: 'variantIsBest', label: 'Top vente' },
  { key: 'sizeName', label: 'Taille' },
  { key: 'sizeStock', label: 'Stock' },
]
</script>

<template>
  <BasePageAdminView>
    <DataTable
      :columns="columns"
      resource="sneakers/variants"
      uniqueKey="id"
      headerTitle="Variantes"
      path="/admin/variants"
      deleteResource="variants"
    />
  </BasePageAdminView>
</template>
