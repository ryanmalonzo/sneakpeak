<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Select, { type SelectChangeEvent } from 'primevue/select'
import { debounce } from 'underscore'
import DataPagination from './DataPagination.vue'
import DataHeaderCell from './DataHeaderCell.vue'
import { downloadCSV } from './utils/csv'

const API_URL = import.meta.env.VITE_API_URL
const DEFAULT_LIMIT = 25

const { resource, headerTitle, uniqueKey } = defineProps<{
  columns: { key: string; label: string }[]
  resource: string
  uniqueKey: string
  headerTitle: string
}>()

const rows = ref<Record<string, string>[]>([])
const currentPage = ref(1)
const maxPage = ref(1)
const limit = ref(DEFAULT_LIMIT)
const searchQuery = ref('')
const sortKeyRef = ref('')
const orderRef = ref<'asc' | 'desc' | null>(null)

const selectedRows = ref<Record<string, unknown>[]>([])

watch(
  searchQuery,
  // Déclenche la recherche 500 ms après fin de saisie
  debounce(() => {
    currentPage.value = 1
    fetchData()
  }, 500)
)

const getUrl = () => {
  const url = new URL(`${API_URL}/${resource}`)
  url.searchParams.append('page', currentPage.value.toString())
  url.searchParams.append('limit', limit.value.toString())

  if (sortKeyRef.value && orderRef.value) {
    url.searchParams.append('sort', sortKeyRef.value)
    url.searchParams.append('order', orderRef.value)
  }

  if (searchQuery.value) {
    url.searchParams.append('q', searchQuery.value)
  }

  return url
}

const fetchData = async () => {
  const response = await fetch(getUrl())
  const data = await response.json()

  rows.value = data.items

  maxPage.value = Math.ceil(data.total / data.limit)
}

onMounted(fetchData)

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
  fetchData()
}

const handleLimitChange = (e: SelectChangeEvent) => {
  currentPage.value = 1
  limit.value = e.value
  fetchData()
}

const handleOrderChange = ({ sortKey, order }: { sortKey: string; order: 'asc' | 'desc' }) => {
  currentPage.value = 1
  sortKeyRef.value = sortKey
  orderRef.value = order
  fetchData()
}

const exportToCSV = () => {
  downloadCSV(
    selectedRows.value.length ? selectedRows.value : rows.value,
    `${new Date().toISOString()}-${resource}.csv`
  )
}

const handleSelectRow = (row: Record<string, string>, event: Event) => {
  const checkbox = event.target as HTMLInputElement

  if (checkbox.checked) {
    selectedRows.value.push(row)
  } else {
    selectedRows.value = selectedRows.value.filter((r) => r[uniqueKey] !== row[uniqueKey])
  }
}

const isRowSelected = (row: Record<string, string>) => {
  return !!selectedRows.value.find((r) => r.id === row.id)
}

const thClasses = 'border border-black px-2.5 py-1 text-left font-semibold text-white'
const tdClasses = 'border border-gray-300 px-2.5 py-1'
</script>

<template>
  <div class="flex flex-1 flex-col items-center gap-5">
    <!-- Header -->
    <div class="flex items-center justify-between gap-2.5 self-stretch">
      <div class="flex items-center gap-2.5">
        <h2 class="text-2xl font-semibold">{{ headerTitle }}</h2>
        <Button icon="pi pi-plus" label="Ajouter" />
        <Button
          icon="pi pi-download"
          severity="secondary"
          :label="selectedRows.length ? `Exporter (${selectedRows.length})` : 'Exporter'"
          @click="exportToCSV"
        />
        <Button
          v-if="selectedRows.length"
          icon="pi pi-times"
          severity="secondary"
          label="Tout déselectionner"
          outlined
          @click="selectedRows = []"
        />
      </div>

      <div class="flex items-center gap-2.5">
        <InputText placeholder="Rechercher" icon="pi pi-search" v-model="searchQuery" />
        <Select
          v-model="limit"
          :options="[10, 25, 50, 75, 100]"
          aria-label="Nombre d'éléments par page"
          @change="handleLimitChange"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="w-full overflow-x-auto rounded-md">
      <table class="w-full table-auto">
        <thead class="rounded-t-md bg-black outline outline-offset-[-1px] outline-black">
          <tr>
            <th :class="thClasses"></th>
            <DataHeaderCell
              v-for="column in columns"
              :key="column.key"
              :sortKey="column.key"
              :currentSort="sortKeyRef"
              :label="column.label"
              :classes="thClasses"
              @orderChange="handleOrderChange"
            />
            <th :class="thClasses">Actions</th>
          </tr>
        </thead>
        <tbody class="rounded-b-md outline outline-offset-[-1px] outline-gray-300">
          <tr
            v-for="row in rows"
            :key="row[uniqueKey]"
            :class="isRowSelected(row) ? 'bg-[#12b9813b]' : 'bg-white'"
          >
            <td class="text-center" :class="tdClasses">
              <input
                type="checkbox"
                class="h-4 w-4"
                :checked="isRowSelected(row)"
                @change="(event: Event) => handleSelectRow(row, event)"
              />
            </td>
            <td v-for="column in columns" :key="column.key" :class="tdClasses">
              {{ row[column.key] }}
            </td>
            <td :class="tdClasses">
              <div class="flex justify-center gap-2.5 self-stretch">
                <Button icon="pi pi-pen-to-square" severity="contrast" aria-label="Modifier" />
                <Button icon="pi pi-trash" severity="secondary" aria-label="Supprimer" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <DataPagination :currentPage="currentPage" :maxPage="maxPage" @pageChange="handlePageChange" />
  </div>
</template>
