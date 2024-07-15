<script setup lang="ts">
import BasePageAdminView from './BasePageAdminView.vue'
import DataTable from '@/components/datatable/DataTable.vue'

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'slug', label: 'Slug' }
]
</script>

<template>
  <BasePageAdminView>
    <DataTable :columns="columns" resource="categories" uniqueKey="slug" headerTitle="Catégories" />
  </BasePageAdminView>
</template>
