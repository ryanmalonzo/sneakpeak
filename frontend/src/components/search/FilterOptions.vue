<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
</script>

<template>
  <div class="sticky left-0 top-[64.5px] flex h-full w-1/5 flex-col gap-30px px-5 py-5 md:py-10">
    <h2 class="text-lg font-medium">Filtrer par</h2>

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
