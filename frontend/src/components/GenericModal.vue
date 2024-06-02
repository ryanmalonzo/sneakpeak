<template>
    <Dialog
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      :modal="true"
      :header="header"
      :style="{ width: width }"
    >
      <slot></slot>
    </Dialog>
</template>
  
<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
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
  
  const emits = defineEmits(['update:visible'])
</script>
  
  <style scoped></style>