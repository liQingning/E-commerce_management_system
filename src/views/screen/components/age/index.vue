<template>
  <div class="age">
    <Title :content="content" :color="color"></Title>
    <div class="main">
      <div ref="charts" class="charts"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Title from '../title/index.vue'
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
let charts = ref()
let props = defineProps<{
  color: string
}>()
let content = '年龄分布'
const textcolor = getComputedStyle(document.documentElement)
  .getPropertyValue('--base-screen-textcolor')
  .trim()
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 'center',
      right: '10%',
      orient: 'vertical',
      itemGap: 13,
      textStyle: {
        color: textcolor,
        fontSize: 16, // 可以根据需要调整字体大小
      },
    },
    series: [
      {
        name: '年龄分布',
        type: 'pie',
        radius: ['60%', '90%'],
        center: ['35%', '50%'], // 向左移动，x轴从50%改为40%
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 6, name: '10岁以下' },
          { value: 18, name: '10-18岁' },
          { value: 32, name: '18-25岁' },
          { value: 24, name: '25-40岁' },
          { value: 20, name: '40-60岁' },
          { value: 10, name: '60岁以上' },
        ],
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.age {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
  display: flex;
  flex-direction: column;
  .main {
    height: 200px;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    font-size: 20px;
    border-radius: 15px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    .charts {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
