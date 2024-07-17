import { ref, reactive, computed, watch } from 'vue'
import { z, type ZodTypeAny } from 'zod'

export function useForm(
  initialData: Record<string, unknown>,
  transformFunctions: Record<string, Function>,
  validationSchema: Record<string, unknown>,
  onSubmit: Function
) {
  const formData = reactive({ ...initialData })
  const isSubmitting = ref(false)
  const validationErrors: Record<string, string> = reactive({})

  watch(initialData, () => {
    Object.keys(initialData).forEach((field) => {
      formData[field] = initialData[field]
      validateField(field)
    })
  })

  const schema = z.object(validationSchema as unknown as Record<string, ZodTypeAny>)

  const transformField = (field: string, value: unknown) => {
    if (transformFunctions[field]) {
      return transformFunctions[field](value)
    }
    return value
  }

  const updateField = (field: string, value: unknown) => {
    formData[field] = transformField(field, value)
    validateField(field)
  }

  const validateField = (field: string) => {
    const { error } = schema.shape[field].safeParse(formData[field])
    delete validationErrors[field]
    if (error) {
      validationErrors[field] = error.errors[0].message
    }
  }

  const validateForm = () => {
    const { error } = schema.safeParse(formData)
    Object.keys(validationErrors).forEach((key) => delete validationErrors[key])

    if (error) {
      error.errors.forEach((err) => {
        validationErrors[err.path[0]] = err.message
      })
      return false
    }

    return true
  }

  const submitForm = async () => {
    if (validateForm()) {
      isSubmitting.value = true
      await onSubmit(formData)
      isSubmitting.value = false
    }
  }

  const isValid = computed(() => Object.keys(validationErrors).length === 0)

  return {
    formData,
    updateField,
    submitForm,
    isSubmitting,
    validationErrors,
    isValid
  }
}
