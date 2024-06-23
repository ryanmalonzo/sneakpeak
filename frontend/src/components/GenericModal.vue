<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :modal="true"
    :dismissableMask="true"
    :header="header"
    :style="{ width: width }"
  >
    <slot></slot>
  </Dialog>
</template>

<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  header: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '30rem'
  }
})

defineEmits(['update:visible'])
</script>
