<script setup lang="ts">
const props = defineProps({
  size: Object,
  isSizeSelected: Boolean,
  isEnoughStock: Boolean
})

const emit = defineEmits(['sizeEmittion'])

const handleClick = () => {
  emit('sizeEmittion', props.size)
}
</script>

<template>
  <div
    class="relative w-36 cursor-pointer rounded-md p-8 text-center font-medium"
    @click="isEnoughStock ? handleClick() : null"
    :class="{
      'bg-zinc-200': !props.isSizeSelected,
      selected: props.isSizeSelected,
      'select-disable': !props.isEnoughStock,
      'transition-transform': props.isEnoughStock,
      'hover:scale-105': props.isEnoughStock
    }"
  >
    <i
      class="pi pi-verified absolute right-2 top-2"
      style="color: white"
      :class="{ 'display-none': !props.isSizeSelected }"
    ></i>
    EU {{ props.size?.name }}
  </div>
</template>

<style scoped>
.selected {
  color: white;
  background: rgb(255, 98, 0);
  background: linear-gradient(90deg, #10b981 0%, #0a7a55 100%);
}
.display-none {
  display: none;
}
.select-disable {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
