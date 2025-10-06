<template>
  <div>
    <svg :style="{ width, height }">
      <use :href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SvgIcon',
})
defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: '30px',
  },
  height: {
    type: [String, Number],
    default: '30px',
  },
})
</script>

<style lang="scss" scoped></style>
