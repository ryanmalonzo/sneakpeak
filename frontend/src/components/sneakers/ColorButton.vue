<script setup lang="ts">
const props = defineProps({
  variant: Object,
  isColorSelected: Boolean
})

const emit = defineEmits(['colorEmittion'])

const handleClick = () => {
  emit('colorEmittion', props.variant?.colorSlug)
}
</script>

<template>
  <div
    class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-400 transition-transform hover:scale-105 hover:border-blue-500 hover:shadow-md"
    :style="{ backgroundColor: props.variant?.hexCode }"
    @click="handleClick"
  >
    <span :class="{ 'display-none': !props.isColorSelected }"></span>
    <i
      class="pi pi-check"
      style="color: white; font-size: 0.8rem"
      :class="{ 'display-none': !props.isColorSelected }"
    ></i>
  </div>
</template>

<style scoped>
.display-none {
  display: none;
}
</style>
