<script setup lang="ts">
import BasePageAdminView from './BasePageAdminView.vue'
import DataTable from '@/components/datatable/DataTable.vue'

const columns = [{ key: 'name', label: 'Nom' }]
</script>

<template>
  <BasePageAdminView>
    <DataTable
      :columns="columns"
      resource="brands"
      uniqueKey="slug"
      headerTitle="Marques"
      path="/admin/brands"
    />
  </BasePageAdminView>
</template>
