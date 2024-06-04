<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

defineProps<{
  open: boolean
}>()

const emit = defineEmits(['open'])

const breakpoints = useBreakpoints(breakpointsTailwind)

const getOpenClasses = () => {
  if (breakpoints.smaller('md').value) {
    return 'absolute top-0 left-0 z-[60]'
  }
  return 'sticky top-[66px]'
}
</script>

<template>
  <div
    class="flex h-full w-full flex-col gap-30px bg-white px-5 py-5 md:sticky md:w-[300px] md:py-10"
    :class="[open ? getOpenClasses() : 'hidden']"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-medium">Filtrer par</h2>
      <button
        type="button"
        class="pi pi-times cursor-pointer md:!hidden"
        @click="emit('open', false)"
      ></button>
    </div>

    <!-- Accordions -->
    <Accordion multiple>
      <AccordionTab header="Marques">
        <p>Contenu</p>
      </AccordionTab>
      <AccordionTab header="Catégories">
        <p>Contenu</p>
      </AccordionTab>
      <AccordionTab header="Prix">
        <p>Contenu</p>
      </AccordionTab>
    </Accordion>
  </div>
</template>
