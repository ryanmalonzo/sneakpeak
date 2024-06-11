<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['onCriteriaChange'])

const isMenuOpen = ref(false)

const handleClick = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const onClickOutside = () => {
  isMenuOpen.value = false
}

const setSortAndOrder = (sort: string, order: string) => {
  emit('onCriteriaChange', { sort, order })
  isMenuOpen.value = false
}
</script>

<template>
  <div class="relative" v-click-outside="onClickOutside">
    <button type="button" @click="handleClick">Trier par <i class="pi pi-chevron-down"></i></button>

    <!-- Menu -->
    <div
      class="absolute right-0 top-10 w-48 rounded-md border border-gray-200 bg-white shadow-lg"
      v-if="isMenuOpen"
    >
      <ul class="py-1">
        <li
          class="cursor-pointer px-4 py-2 hover:bg-gray-100"
          @click="setSortAndOrder('price', 'asc')"
        >
          Prix croissant
        </li>
        <li
          class="cursor-pointer px-4 py-2 hover:bg-gray-100"
          @click="setSortAndOrder('price', 'desc')"
        >
          Prix décroissant
        </li>
        <li class="px-4 py-2 hover:bg-gray-100">Nouveautés</li>
        <li class="px-4 py-2 hover:bg-gray-100">Meilleures ventes</li>
      </ul>
    </div>
  </div>
</template>
