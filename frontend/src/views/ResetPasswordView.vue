<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter} from 'vue-router'

// Initialisation des variables
const password = ref('')
const passwordConfirm = ref('')
const API_URL = import.meta.env.VITE_API_URL
const route = useRoute();
const userId = route.query.id
const token = route.query.token;
const router = useRouter();

// Traitement du formulaire
async function onSubmit() {
    // Vérifie que les mdp sont identiques ainsi que la présence de l'id et du token
    if (password.value !== passwordConfirm.value || !userId || !token) {
        return;
    }
    
    // Appel de l'api
    try {
        await axios.put(`${API_URL}/users/${userId}/password`, {
            token: token,
            password: password.value,
        });

        // Redirection vers la page de succès
        router.push('/resetPasswordSuccess')

    } catch (error) {
        console.error("Erreur lors de la modification du mot de passe :", error);
    }
}
</script>

<template>
    <main class="h-screen flex justify-center items-center bg-zinc-100">
        <form @submit.prevent="onSubmit">
            <div class="align-items-center mb-5 flex flex-col gap-2">
                <label for="password" class="w-6rem">Nouveau mot de passe</label>
                <InputText
                    type="password"
                    id="password"
                    class="flex-auto"
                    placeholder="************"
                    v-model="password"
                />
            </div>
            <div class="align-items-center mb-5 flex flex-col gap-2">
                <label for="passwordConfirm" class="w-6rem">Confirmation du mot de passe</label>
                <InputText
                    type="password"
                    id="passwordConfirm"
                    class="flex-auto"
                    placeholder="************"
                    v-model="passwordConfirm"
                />
            </div>
            <div class="justify-content-end flex flex-col gap-2">
                <Button type="submit" label="Modifier" rounded></Button>
            </div>
        </form>
    </main>
</template>
