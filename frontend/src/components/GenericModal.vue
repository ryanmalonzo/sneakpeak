<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :modal="true"
    :dismissableMask="true"
    :header="header"
    :style="{ width: width }"
    :closable="closable"
  >
    <slot></slot>
  </Dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    visible: boolean
    header: string
    width: string
    closable: boolean
  }>(),
  {
    width: '30rem',
    closable: true
  }
)

defineEmits(['update:visible'])
</script>
