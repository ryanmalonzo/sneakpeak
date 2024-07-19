<script setup lang="ts">
import BasePageAdminView from './BasePageAdminView.vue'
import DataTable from '@/components/datatable/DataTable.vue'

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'hexCode', label: 'Code hexadécimal' }
]
</script>

<template>
  <BasePageAdminView>
    <DataTable
      :columns="columns"
      resource="colors"
      uniqueKey="slug"
      headerTitle="Couleurs"
      path="/admin/colors"
    />
  </BasePageAdminView>
</template>
