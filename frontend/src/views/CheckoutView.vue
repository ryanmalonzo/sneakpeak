<script setup lang="ts">
import BasePage from '@/components/BasePage.vue';
import Checkbox from 'primevue/checkbox';
import AutoComplete from 'primevue/autocomplete';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import axios from 'axios';
import { reactive, ref, watch } from 'vue';
import { CheckoutApi } from '@/services/checkoutApi';
import { CartStore } from '@/store/cart';
import type { CartApi } from '@/services/cartApi';

interface GeoapifyFeatureProperties {
    formatted: string

}

interface GeoapifyFeature {
    properties: GeoapifyFeatureProperties
}
const isBilling = ref(false);
const filteredShippingAdress = ref([]);
const shipping = reactive({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
});
const filteredBillingAdress = ref([]);
const billing = reactive({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
});


watch(isBilling, (newVal) => {
    if (newVal) {
        billing.firstName = shipping.firstName;
        billing.lastName = shipping.lastName;
        billing.address = shipping.address;
        billing.phone = shipping.phone;
    }
});

watch(shipping, async (newVal) => {
    if (newVal.address.length > 3) {
        console.log(newVal.address);
        try {

            const response = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${newVal.address}&apiKey=ae0f10d502564e4aa6781d24d19593be`);
            console.log(response.data);
            filteredShippingAdress.value = response.data.features.map((feature: GeoapifyFeature) => (
                feature.properties.formatted
            ));
        } catch (error) {
            console.error(error);
        }
    } else {
        filteredShippingAdress.value = [];
    }
});

watch(billing, async (newVal) => {
    if (newVal.address.length > 3 && !isBilling.value) {
        console.log(newVal.address);
        try {

            const response = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${newVal.address}&apiKey=ae0f10d502564e4aa6781d24d19593be`);
            console.log(response.data);
            filteredBillingAdress.value = response.data.features.map((feature: GeoapifyFeature) => (
                feature.properties.formatted
            ));
        } catch (error) {
            console.error(error);
        }
    } else {
        filteredBillingAdress.value = [];
    }
});

const onSubmit = async () => {
    if (isBilling.value) {
        billing.address = shipping.address;
        billing.firstName = shipping.firstName;
        billing.lastName = shipping.lastName;
        billing.phone = shipping.phone;

    }
    const data = await CheckoutApi.create({
        shipping,
        billing,
    });

    console.log(data);
};


const cart: CartApi.CartApiOut = CartStore().cart;
const cartProducts = cart.cartProduct.sort((a, b) => a.id - b.id);
const cartTotal = cartProducts.reduce((total, product) => total + product.total, 0);
const cartTotalItems = cartProducts.length;
const expirationTime = new Date(cart.expiredAt);


</script>

<template>
    <BasePage>
        <div
            class="max-md:p-3 md:p-20 gap-24 flex max-md:flex-col md:flex-row self-stretch items-start md:w-full justify-around">
            <div class="flex-col flex md:gap-16  items-start text-wrap">
                <!-- Adresse de livraison -->
                <div class="bg-white p-6">
                    <h2 class="text-2xl font-bold mb-8">Adresse de livraison</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">

                        <FloatLabel>
                            <InputText id="first-name" v-model="shipping.firstName" class="max-md:w-full" />
                            <label for="first-name">Prénom</label>
                        </FloatLabel>

                        <FloatLabel>
                            <InputText id="last-name" v-model="shipping.lastName" class="max-md:w-full" />
                            <label for="last-name">Nom</label>
                        </FloatLabel>
                    </div>
                    <div class="my-8">

                        <FloatLabel>
                            <InputText id="phone-number" v-model="shipping.phone" class="w-full" />
                            <label for="phone-number">Numéro de téléphone</label>
                        </FloatLabel>

                    </div>
                    <div class="my-8">
                        <FloatLabel>
                            <AutoComplete v-model="shipping.address" :suggestions="filteredShippingAdress"
                                placeholder="Commencez à taper votre adresse ou code postal" inputClass="w-full"
                                class="w-full" />
                            <label for="delivery-address">Adresse</label>

                        </FloatLabel>
                    </div>

                    <div class="flex flex-wrap ">
                        <div class="flex md:gap-4">
                            <label for="isBilling">Utiliser la même adresse pour la facturation</label>
                            <Checkbox v-model="isBilling" :binary="true" inputId="isBilling" />
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 " v-if="isBilling === false">
                    <h2 class="text-2xl font-bold mb-8">Adresse de facturation</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <FloatLabel>
                            <InputText id="first-name" v-model="billing.firstName" class="max-md:w-full" />
                            <label for="first-name">Prénom</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText id="last-name" v-model="billing.lastName" class="max-md:w-full" />
                            <label for="last-name">Nom</label>
                        </FloatLabel>
                    </div>
                    <div class="mb-8">
                        <FloatLabel>
                            <InputText id="phone-number" v-model="billing.phone" class="w-full" />
                            <label for="phone-number">Numéro de téléphone</label>
                        </FloatLabel>

                    </div>
                    <div class="mb-8">
                        <FloatLabel>
                            <AutoComplete v-model="billing.address" :suggestions="filteredBillingAdress"
                                placeholder="Commencez à taper votre adresse ou code postal" inputClass="w-full"
                                class="w-full" />
                            <label for="delivery-address">Adresse</label>

                        </FloatLabel>
                    </div>

                </div>
            </div>



            <div class="flex flex-col items-start gap-5 max-md:self-center"> <!-- right -->
                <div v-if="cartTotalItems > 0"
                    class="flex gap-5 flex-col self-stretch items-center border border-black rounded-lg">
                    <!-- right top -->
                    <router-link to="/checkout"
                        class="bg-black text-white p-3 px-5 flex items-center self-stretch gap-3">

                        <p class="flex-1 flex">Commander</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M8.38223 1.60173C8.11769 1.33718 7.68877 1.33718 7.42422 1.60173C7.15967 1.86628 7.15967 2.2952 7.42422 2.55975L11.6871 6.82267H0.677419C0.303291 6.82267 0 7.12597 0 7.50009C0 7.87422 0.303291 8.17751 0.677419 8.17751H11.6871L7.42422 12.4404C7.15967 12.705 7.15967 13.1339 7.42422 13.3985C7.68877 13.663 8.11769 13.663 8.38223 13.3985L13.8016 7.9791C14.0661 7.71455 14.0661 7.28564 13.8016 7.02109L8.38223 1.60173Z"
                                fill="white" />
                        </svg>


                    </router-link>

                    <div class="flex gap-5 flex-col items-start self-stretch p-5">
                        <p class="font-bold text-base">RÉSUMÉ DE LA COMMANDE</p>

                        <div class="flex items-start gap-12 self-stretch">
                            <p class="flex flex-1"> {{ cartTotalItems }} article{{ cartTotalItems > 1 ? "s" : "s" }}</p>
                            <p class="flex flex-1">{{ cartTotal.toFixed(2) }} €</p>

                        </div>
                        <div class="flex items-start gap-12 self-stretch">
                            <p class="flex flex-1">Livraison</p>
                            <p class="flex flex-1">Gratuite</p>
                        </div>
                        <div class="flex items-start gap-12 self-stretch">
                            <p class="flex flex-1 font-bold">Total</p>
                            <p class="flex flex-1">{{ cartTotal.toFixed(2) }} €</p>
                        </div>

                    </div>


                </div>
                <div v-else>

                    <button type="submit" class="bg-black text-white p-3 px-5 flex items-center self-stretch gap-3">

                        <RouterLink to="/search">
                            <p class="flex-1 flex">Retour à la boutique</p>
                        </RouterLink>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M8.38223 1.60173C8.11769 1.33718 7.68877 1.33718 7.42422 1.60173C7.15967 1.86628 7.15967 2.2952 7.42422 2.55975L11.6871 6.82267H0.677419C0.303291 6.82267 0 7.12597 0 7.50009C0 7.87422 0.303291 8.17751 0.677419 8.17751H11.6871L7.42422 12.4404C7.15967 12.705 7.15967 13.1339 7.42422 13.3985C7.68877 13.663 8.11769 13.663 8.38223 13.3985L13.8016 7.9791C14.0661 7.71455 14.0661 7.28564 13.8016 7.02109L8.38223 1.60173Z"
                                fill="white" />
                        </svg>
                    </button>
                </div>
                <p class="font-bold">MÉTHODES DE PAIEMENT ACCEPTÉES</p>
                <div class="flex gap-5 items-start max-md:pb-4">
                    <img src="../assets/images/cartPaiement_1.png" alt="" />
                    <img src="../assets/images/cartPaiement_2.png" alt="" />
                    <img src="../assets/images/cartPaiement_3.png" alt="" />
                    <img src="../assets/images/cartPaiement_4.png" alt="" />
                </div>

            </div>

        </div>


    </BasePage>
</template>

<style></style>
