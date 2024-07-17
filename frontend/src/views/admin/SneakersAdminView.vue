<script setup lang="ts">
import BasePageAdminView from './BasePageAdminView.vue'
import DataTable from '@/components/datatable/DataTable.vue'

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'description', label: 'Description' },
  { key: 'price', label: 'Prix' },
  { key: 'brand', label: 'Marque' },
  { key: 'category', label: 'Catégorie' }
]
</script>

<template>
  <BasePageAdminView>
    <DataTable
      :columns="columns"
      resource="sneakers"
      uniqueKey="_id"
      headerTitle="Sneakers"
      path="/"
    />
  </BasePageAdminView>
</template>
