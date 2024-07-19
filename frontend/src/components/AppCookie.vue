<template>
    <div v-if="show"
        class="fixed bottom-5 left-5 right-5 bg-black border border-gray-300 p-5 shadow-lg z-50 text-white">
        <p>Ce site utilise des cookies strictement nécessaires pour son bon fonctionnement. En continuant à utiliser ce
            site, vous acceptez l'utilisation de ces cookies.</p>
        <button @click="closeNotice" class="mt-3 bg-white text-black px-3 py-2 rounded">Compris</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: true,
        };
    },
    methods: {
        closeNotice() {
            localStorage.setItem('noticeClosed', 'true');
            this.show = false;
        },
    },
    mounted() {
        const noticeClosed = localStorage.getItem('noticeClosed');
        if (noticeClosed) {
            this.show = false;
        }
    },
};
</script>

<style scoped></style>