<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <main class="h-screen flex justify-center items-center">
        <img src="/src/assets/images/success.png" alt="Succès" class="w-32 h-32">
        <p class="text-xl">
            Votre mot de passe a été modifié avec succès. Vous pouvez maintenant <br>fermer cette page ou
            <RouterLink to="/"><span class="text-blue-500">cliquer sur ce lien</span></RouterLink> pour vous connecter.
        </p>
    </main>
</template>