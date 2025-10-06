<template>
  <div class="top">
    <p>{{ props.content }}</p>
  </div>
</template>

<script lang="ts" setup>
let props = defineProps<{
  color: string
  content: string
}>()
</script>

<style scoped lang="scss">
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  border-radius: 15px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  p {
    margin: 10px 10px;
    span {
      color: v-bind(color);
    }
  }
}
</style>
