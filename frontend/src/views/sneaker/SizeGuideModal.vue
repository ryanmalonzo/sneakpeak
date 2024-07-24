<script setup lang="ts">
import { ref } from 'vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'

const visible = ref(false)
const sizes = ref([
  { eu: '35', uk: '2.5', us: '5', cm: '22', inches: '8.66' },
  { eu: '36', uk: '3.5', us: '6', cm: '22.5', inches: '8.86' },
  { eu: '37', uk: '4', us: '6.5', cm: '23', inches: '9.06' },
  { eu: '38', uk: '5', us: '7.5', cm: '24', inches: '9.45' },
  { eu: '39', uk: '6', us: '8.5', cm: '25', inches: '9.84' },
  { eu: '40', uk: '6.5', us: '9', cm: '25.5', inches: '10.04' },
  { eu: '41', uk: '7', us: '9.5', cm: '26', inches: '10.24' },
  { eu: '42', uk: '8', us: '10', cm: '27', inches: '10.63' },
  { eu: '43', uk: '9', us: '11', cm: '28', inches: '11.02' },
  { eu: '44', uk: '9.5', us: '11.5', cm: '28.5', inches: '11.22' },
  { eu: '45', uk: '10.5', us: '12.5', cm: '29.5', inches: '11.61' },
  { eu: '46', uk: '11', us: '13', cm: '30', inches: '11.81' },
  { eu: '47', uk: '12', us: '14', cm: '31', inches: '12.20' },
  { eu: '48', uk: '13', us: '15', cm: '32', inches: '12.60' }
])
</script>

<template>
  <a class="mb-6 cursor-pointer underline" @click="visible = true"
    ><p class="text-sneakpeak-gray-900">Guide des tailles</p></a
  >

  <Dialog v-model:visible="visible" :dismissable-mask="true" modal header="Guide des tailles">
    <DataTable :value="sizes">
      <Column field="eu" header="EU" />
      <Column field="uk" header="UK" />
      <Column field="us" header="US" />
      <Column field="cm" header="cm" />
      <Column field="inches" header="inches" />
    </DataTable>
  </Dialog>
</template>
