<script setup lang="ts">
import BasePage from '@/components/BasePage.vue';
import { RouterLink, useRoute } from 'vue-router';


import { ref, onMounted } from 'vue';

const reference = ref('');


onMounted(async () => {
    const route = useRoute();
    reference.value = route.params.reference as string;
});
</script>

<template>
    <BasePage>
        <div class="text-center h-full w-full my-auto">
            <h1 class="text-2xl font-semibold">Merci pour votre commande</h1>

            <p class="mt-4">Votre commande a été traitée avec succès.</p>



            <button type="button" class="bg-black text-white p-3 px-5  my-4">

                <RouterLink :to="'/order/' + reference">
                    Voir les détails de la commande
                </RouterLink>



            </button>
        </div>
    </BasePage>
</template>

<style scoped></style>