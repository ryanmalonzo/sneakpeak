<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import CardProduct from '../components/cart/CartProduct.vue'
</script>

<template>
    <BasePage>
        <div class="max-md:p-3 md:p-20 gap-24 flex max-md:flex-col md:flex-row self-stretch items-start md:w-full">



            <div class="flex-col flex gap-16 flex-1 items-start text-wrap"> <!-- left -->
                <div class="flex flex-col items-start gap-4">
                    <h1 class="self-stretch text-3xl font-bold">Mon panier</h1>
                    <div class="flex items-start gap-1 self-stretch">
                        <p>TOTAL (2 produits)</p>
                        <p class="font-bold">80,00 €</p>
                    </div>
                    <p>Les articles de votre panier sont réservés pendant 15 minutes</p>
                    <div class="flex items-start gap-1 self-stretch">
                        <p>Temps restant :</p>
                        <p class="font-bold">14:59</p>
                    </div>
                </div>
                <CardProduct />
                <CardProduct />
            </div>

            <div class="flex flex-col items-start gap-5 max-md:self-center"> <!-- right -->
                <div class="flex gap-5 flex-col self-stretch items-center border border-black rounded-lg">
                    <!-- right top -->

                    <button type="submit" class="bg-black text-white p-3 px-5 flex items-center self-stretch gap-3">
                        <p class="flex-1 flex">Commander</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M8.38223 1.60173C8.11769 1.33718 7.68877 1.33718 7.42422 1.60173C7.15967 1.86628 7.15967 2.2952 7.42422 2.55975L11.6871 6.82267H0.677419C0.303291 6.82267 0 7.12597 0 7.50009C0 7.87422 0.303291 8.17751 0.677419 8.17751H11.6871L7.42422 12.4404C7.15967 12.705 7.15967 13.1339 7.42422 13.3985C7.68877 13.663 8.11769 13.663 8.38223 13.3985L13.8016 7.9791C14.0661 7.71455 14.0661 7.28564 13.8016 7.02109L8.38223 1.60173Z"
                                fill="white" />
                        </svg>
                    </button>

                    <div class="flex gap-5 flex-col items-start self-stretch p-5">
                        <p class="font-bold text-base">RÉSUMÉ DE LA COMMANDE</p>

                        <div class="flex items-start gap-12 self-stretch">
                            <p class="flex flex-1"> 2 produits</p>
                            <p class="flex flex-1">80.00 €</p>

                        </div>
                        <div class="flex items-start gap-12 self-stretch">
                            <p class="flex flex-1">Livraison</p>
                            <p class="flex flex-1">Gratuite</p>
                        </div>
                        <div class="flex items-start gap-12 self-stretch">
                            <p class="flex flex-1 font-bold">Total</p>
                            <p class="flex flex-1">80.00 €</p>
                        </div>

                    </div>


                </div>
                <p class="font-bold">MÉTHODES DE PAIEMENT ACCEPTÉES</p>
                <div class="flex gap-5 items-start max-md:pb-4">
                    <img src="../assets/images/cartPaiement_1.png" alt="" />
                    <img src="../assets/images/cartPaiement_2.png" alt="" />
                    <img src="../assets/images/cartPaiement_3.png" alt="" />
                    <img src="../assets/images/cartPaiement_4.png" alt="" />
                </div>

            </div>
            <button
                class="md:hidden right-0 left-0 bottom-0 fixed bg-black text-white p-3 px-5 flex items-center self-stretch gap-3">
                <p class="flex-1 flex">Commander</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M8.38223 1.60173C8.11769 1.33718 7.68877 1.33718 7.42422 1.60173C7.15967 1.86628 7.15967 2.2952 7.42422 2.55975L11.6871 6.82267H0.677419C0.303291 6.82267 0 7.12597 0 7.50009C0 7.87422 0.303291 8.17751 0.677419 8.17751H11.6871L7.42422 12.4404C7.15967 12.705 7.15967 13.1339 7.42422 13.3985C7.68877 13.663 8.11769 13.663 8.38223 13.3985L13.8016 7.9791C14.0661 7.71455 14.0661 7.28564 13.8016 7.02109L8.38223 1.60173Z"
                        fill="white" />
                </svg>
            </button>
        </div>



    </BasePage>
</template>

<style></style>