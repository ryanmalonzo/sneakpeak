<script setup lang="ts">
import { ref } from 'vue'
import AutoComplete from 'primevue/autocomplete'

interface Props {
  optionLabel?: string
  modelValue: unknown
  apiURL: string
}

const { apiURL } = withDefaults(defineProps<Props>(), {
  optionLabel: 'name'
})

const emit = defineEmits(['update:modelValue'])

const suggestions = ref([])

// Le composant debounce déjà la saisie
const search = async (e: { query: string }) => {
  try {
    const response = await fetch(`${apiURL}?q=${e.query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      return
    }

    const data = await response.json()
    suggestions.value = data.items
  } catch {
    suggestions.value = []
  }
}

const updateValue = (value: any) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <AutoComplete
    :suggestions="suggestions"
    :model-value="modelValue"
    @update:model-value="updateValue"
    dropdown
    forceSelection
    :optionLabel="optionLabel"
    @complete="search"
    emptySearchMessage="Aucun résultat trouvé"
  />
</template>
