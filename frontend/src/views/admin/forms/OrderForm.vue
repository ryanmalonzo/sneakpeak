<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import { useForm } from '@/helpers/useForm'
import BasePageAdminView from '../BasePageAdminView.vue'
import Card from 'primevue/card';
import Select from 'primevue/select';
import DataView from 'primevue/dataview'

const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const route = useRoute()
const orderId = route.params.id

const toast = useToast()

const actions = reactive({
    title: 'Modifier une commande',
    buttonText: 'Sauvegarder',
    toastSuccess: 'Commande modifiée',
    toastSuccessDetail: 'La commande a été modifiée avec succès',
    toastErrorDetail: 'Une erreur est survenue lors de la modification de la commande'
})

const statusShipping = ref([
    { name: 'En attente de paiement', code: 'pending' },
    { name: 'En cours de livraison', code: 'isDelivered' },
    { name: 'Livré', code: 'completed' }
])
const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
        paid: 'Payé',
        pending: 'En attente de paiement',
        isDelivered: 'En cours de livraison',
        completed: 'Livré'
    }
    return translations[status] || status
}

const orderDetails = reactive({
    user: {
        id: '',
        email: '',
        firstName: '',
        lastName: ''
    },
    billing: {
        postal_code: '',
        street: '',
        city: '',
        phone: '',
        name: '',
    },
    shipping: {
        postal_code: '',
        street: '',
        city: '',
        phone: '',
        name: '',
    },
    invoice: '',
    payment_status: '',
    reference: '',
    total: '',
    createdAt: '',
    orderProduct: [],
    selectedStatus: '',
    status: ''
})

const initialData = reactive({
    status: ''
})

const fetchOrderDetails = async () => {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, { credentials: 'include' })
        if (!response.ok) throw new Error('Failed to fetch order details')

        const data = await response.json()
        initialData.status = data.status
        Object.assign(orderDetails, {
            reference: data.reference,
            total: data.total,
            createdAt: data.createdAt,
            orderProduct: data.orderProduct,
            selectedStatus: data.status,
            status: data.status,
            invoice: data.invoice_link,
            payment_status: data.payment_status,
            user: {
                id: data.user.id,
                email: data.user.email,
                firstName: data.user.firstName,
                lastName: data.user.lastName
            },
            billing: {
                postal_code: data.billing.postal_code,
                street: data.billing.street,
                city: data.billing.city,
                phone: data.billing.phone,
                name: data.billing.name,
            },
            shipping: {
                postal_code: data.shipping.postal_code,
                street: data.shipping.street,
                city: data.shipping.city,
                phone: data.shipping.phone,
                name: data.shipping.name,
            }
        })
        orderDetails.selectedStatus = data.status
        formData.status = data.status
        console.log(orderDetails.selectedStatus)
    } catch {
        router.push('/admin/orders')
    }
}

onMounted(() => {
    if (orderId) {
        fetchOrderDetails()
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
            headers: { 'Content-Type': 'application/json' },
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
    } catch {
        showErrorToast()
    }
}

const { formData, submitForm, isSubmitting, validationErrors, isValid } = useForm(
    initialData,
    {},
    validationSchema,
    onSubmit
)

watch(() => orderDetails.selectedStatus, (value) => {
    formData.status = value
})
</script>

<template>
    <BasePageAdminView>
        <h1 class="mb-10 text-2xl">{{ actions.title }}</h1>

        <Card class="p-5 mb-5">

            <template #content>
                <div class="flex flex-col sm:flex-row gap-5 justify-between">


                    <div class="flex flex-col gap-5">
                        <h2 class="text-xl font-semibold">Informations de la commande</h2>
                        <div class="flex gap-2">
                            <label for="reference">Référence : </label>
                            <p>{{ orderDetails.reference }}</p>
                        </div>
                        <div class="flex gap-2">
                            <label for="total">Total : </label>
                            <p>{{ orderDetails.total }}</p>
                        </div>
                        <div class="flex gap-2">
                            <label for="total">Status de paiement : </label>
                            <p>{{ translateStatus(orderDetails.payment_status) }}</p>
                        </div>
                        <div class="flex gap-2">
                            <label for="createdAt">Date de création : </label>
                            <p>{{ orderDetails.createdAt }}</p>
                        </div>

                        <div class="flex flex-col gap-2">
                            <form @submit.prevent="submitForm" class="flex flex-col gap-5">
                                <Select v-model="orderDetails.selectedStatus" :options="statusShipping"
                                    optionLabel="name" optionValue="code" placeholder="Changer le statut de livraison"
                                    aria-describedby="name-help"
                                    @update:modelValue="orderDetails.selectedStatus = $event" />
                                <small id="name-help" class="text-red-500" v-if="validationErrors.name">{{
                                    validationErrors.name }}</small>
                                <Button type="submit" :label="actions.buttonText" :loading="isSubmitting"
                                    :disabled="!isValid"></Button>
                            </form>
                        </div>
                    </div>
                    <div class="flex flex-col gap-5">
                        <h2 class="text-xl font-semibold">Informations de l'utilisateur</h2>
                        <p>{{ orderDetails.user.firstName }} {{ orderDetails.user.lastName }}</p>
                        <p>{{ orderDetails.user.email }}</p>

                    </div>

                    <div class="flex flex-col gap-5">
                        <h2 class="text-xl font-semibold">Adresse de livraison</h2>
                        <p>{{ orderDetails.shipping.name }}</p>
                        <p>{{ orderDetails.shipping.street }}</p>
                        <p>{{ orderDetails.shipping.postal_code }} {{ orderDetails.shipping.city }}</p>
                        <p>{{ orderDetails.shipping.phone }}</p>
                    </div>

                    <div class="flex flex-col gap-5">


                        <h2 class="text-xl font-semibold">Adresse de facturation</h2>
                        <p>{{ orderDetails.billing.name }}</p>
                        <p>{{ orderDetails.billing.street }}</p>
                        <p>{{ orderDetails.billing.postal_code }} {{ orderDetails.billing.city }}</p>
                        <p>{{ orderDetails.billing.phone }}</p>




                        <a :href="orderDetails.invoice" target="_blank" class="text-blue-500">
                            <Button type="submit" label="Voir la facture" />
                        </a>




                    </div>
                </div>
            </template>
        </Card>

        <DataView :value="orderDetails.orderProduct" paginator: rows="5">
            <template #list="slotProps">
                <div class="flex flex-col">
                    <div v-for="(item, index) in slotProps.items" :key="index">
                        <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                            :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                            <div class="md:w-40 relative">
                                <img class="block xl:block mx-auto rounded w-full" :src="item.image" :alt="item.name" />
                            </div>
                            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                    <div class="text-lg font-medium mt-2"> {{ item.name }}</div>
                                    <div class="text-sm text-surface-500 dark:text-surface-400">Couleur: {{ item.color
                                        }}</div>
                                    <div class="text-sm text-surface-500 dark:text-surface-400">Taille: {{ item.size }}
                                    </div>
                                    <div class="text-sm text-surface-500 dark:text-surface-400">Quantité: {{
                                        item.quantity }}</div>
                                </div>
                                <div class="flex flex-col md:items-end gap-8">
                                    <span class="text-xl font-semibold">{{ item.unitPrice }} €</span>
                                    <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <Button label="Demande de retour demandé !" v-if="item.isRefund"
                                            class="flex-auto md:flex-initial whitespace-nowrap">
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
    </BasePageAdminView>
</template>
