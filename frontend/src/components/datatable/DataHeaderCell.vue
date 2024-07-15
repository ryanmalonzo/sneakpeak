<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'

const emit = defineEmits(['orderChange'])

const props = defineProps<{
  sortKey: string
  currentSort: string
  label: string
  classes: string
}>()
const { sortKey, label, classes } = props

const currentOrder: Ref<'asc' | 'desc' | 'unordered'> = ref('unordered')

watch(
  () => props.currentSort,
  (newSort) => {
    if (newSort !== sortKey) {
      currentOrder.value = 'unordered'
    }
  }
)

const icons = {
  unordered: 'pi pi-sort',
  asc: 'pi pi-sort-up',
  desc: 'pi pi-sort-down'
}

const getOrder = (): 'asc' | 'desc' => {
  if (currentOrder.value === 'asc') {
    currentOrder.value = 'desc'
  } else {
    currentOrder.value = 'asc'
  }

  return currentOrder.value
}
</script>

<template>
  <th
    class="cursor-pointer"
    :class="classes"
    @click="emit('orderChange', { sortKey, order: getOrder() })"
  >
    <div class="flex items-center justify-between gap-2.5">
      <p>{{ label }}</p>
      <i :class="icons[currentOrder]"></i>
    </div>
  </th>
</template>
