<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import InputNumber from 'primevue/inputnumber'
import { useToast } from 'primevue/usetoast'
import { useForm } from '@/helpers/useForm'
import BasePageAdminView from '../BasePageAdminView.vue'
import { Translation } from '@/helpers/translation'

const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const route = useRoute()
const variantId = route.params.id

const toast = useToast()

const actions = reactive({
    title: 'Modifier le stock',
    buttonText: 'Modifier',
    toastSuccess: 'Le stock a été modifié',
    toastSuccessDetail: 'Le stock a été modifié avec succès'

})

const initialData = reactive({
    stock: 0,
})

onMounted(async () => {
    if (variantId) {
        const response = await fetch(`${API_URL}/sneakers/variants/${variantId}`, {
            credentials: 'include'
        })
        if (!response.ok) {
            router.push('/admin/variants')
            return
        }
        const data = await response.json()
        initialData.stock = data.sizeStock
    }
})

const transformFunctions = {
    description: (value: string) => value.trim()
}

const validationSchema = {
    stock: z.number({ invalid_type_error: 'Le stock ne peut pas être vide' })
}

const showErrorToast = (error: Error) => {
    toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: Translation.variantsErrors(error),
        life: 3000
    })
}

const onSubmit = async () => {
    try {
        const path = variantId ? `variants/${variantId}` : 'variants'
        const response = await fetch(`${API_URL}/${path}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData
            }),
            credentials: 'include'
        })

        if (!response.ok) {
            throw response as Response
        }

        router.push('/admin/variants')

        toast.add({
            severity: 'success',
            summary: actions.toastSuccess,
            detail: actions.toastSuccessDetail,
            life: 5000
        })
    } catch (error) {
        console.log('error', error);
        if ((error as Response).status === 500) {
            showErrorToast(new Error('Servor Error'))
            return
        }

        showErrorToast(await (error as Response).json());
    }
}

const { formData, updateField, submitForm, isSubmitting, validationErrors, isValid } = useForm(
    initialData,
    transformFunctions,
    validationSchema,
    onSubmit
)

</script>

<template>
    <BasePageAdminView>
        <h1 class="mb-10 text-2xl">{{ actions.title }}</h1>

        <form @submit.prevent="submitForm" class="flex flex-col gap-5">
            <!-- Stock -->
            <div class="card flex flex-col justify-center gap-2">
                <label for="stock">Stock</label>
                <InputNumber id="stock" v-model="formData.stock" @input="updateField('stock', $event.value)" showButtons
                    buttonLayout="horizontal" :step="1" fluid aria-describedby="stock-help">
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                    </template>
                </InputNumber>
                <small id="stock-help" class="text-red-500" v-if="validationErrors.stock">{{
                    validationErrors.stock
                    }}</small>
            </div>

            <Button type="submit" :label="actions.buttonText" :loading="isSubmitting" :disabled="!isValid" />
        </form>
    </BasePageAdminView>
</template>
