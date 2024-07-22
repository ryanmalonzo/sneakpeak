<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import { useForm } from '@/helpers/useForm'
import BasePageAdminView from '../BasePageAdminView.vue'
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';


const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const route = useRoute()
const orderId = route.params.id

const toast = useToast()

const actions = reactive({
    title: 'Modifier une commande',
    buttonText: 'Modifier',
    toastSuccess: 'Commande modifiée',
    toastSuccessDetail: 'La commande a été modifiée avec succès',
    toastErrorDetail: 'Une erreur est survenue lors de la modification de la commande'
})

const initialData = reactive({
    status: '',
})


const statusShipping = ref(['En attente de paiement', 'En cours de livraison', 'Livré'])
const statusPayment = [
    { label: 'Payé', value: 'paid' },
    { label: 'En attente de paiement', value: 'pending' }
]

onMounted(async () => {
    if (orderId) {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            credentials: 'include'
        })

        if (!response.ok) {
            router.push('/admin/orders')
            return
        }

        const data = await response.json()
        initialData.status = data.status
        console.log(data)
        console.log(initialData.status)
    }
})

const validationSchema = {
    status: z.string().min(2, { message: 'Le statut ne peut pas être vide' }),
}

const showErrorToast = () => {
    toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: actions.toastErrorDetail,
        life: 3000
    })
}

const onSubmit = async () => {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            toast.add({
                severity: 'success',
                summary: actions.toastSuccess,
                detail: actions.toastSuccessDetail,
                life: 3000
            })
            router.push('/admin/orders')
        } else {
            showErrorToast()
        }
    } catch (error) {
        showErrorToast()
    }
}

const { formData, updateField, submitForm, isSubmitting, validationErrors, isValid } = useForm(
    initialData,
    {},
    validationSchema,
    onSubmit
)

</script>

<template>
    <BasePageAdminView>
        <h1 class="mb-10 text-2xl">{{ actions.title }}</h1>


        <div class=" flex justify-center">
            <form @submit.prevent="submitForm" class="flex flex-col gap-5">
                <SelectButton v-model="formData.status" :options="statusShipping" aria-labelledby="basic"
                    @onchange="updateField('status', ($event.target as HTMLInputElement).value)" class="w-full" />
                <small id="name-help" class="text-red-500" v-if="validationErrors.name">{{
                    validationErrors.name
                }}</small>
                <Button type="submit" :label="actions.buttonText" :loading="isSubmitting" :disabled="!isValid" />
            </form>
        </div>

    </BasePageAdminView>
</template>
