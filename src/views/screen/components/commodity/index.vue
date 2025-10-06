<template>
  <div class="com">
    <Title :content="content" :color="color"></Title>
    <div class="content">
      <p>商品名称</p>
      <p>销量</p>
    </div>
    <div ref="charts" class="charts"></div>
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
let name = ref(['vivoX200', 'iPhone14', 'OPPO Reno8', 'Redmi K50', 'Honor50'])
let number = ref([20000, 40000, 50000, 70000, 80000])
let content = '热门商品排行'
const textcolor = getComputedStyle(document.documentElement)
  .getPropertyValue('--base-screen-textcolor')
  .trim()
onMounted(() => {
  let myChart = echarts.init(charts.value)
  myChart.setOption({
    xAxis: {
      show: false,
      min: 0,
      max: 100000,
    },
    yAxis: {
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: textcolor,
        fontSize: 16,
        margin: 50,
      },
      left: 50,
      type: 'category',
      data: name.value,
    },
    series: [
      {
        data: number.value,
        type: 'bar',
        itemStyle: {
          color: props.color,
          borderRadius: 15,
        },
        emphasis: {
          itemStyle: {
            color: props.color, // 与正常状态相同的颜色
            borderRadius: 15,
          },
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
          borderRadius: 15,
        },
        label: {
          show: true,
          position: 'right',
          color: textcolor,
        },
      },
    ],
    grid: {
      top: 20,
      left: 160,
      right: 20,
      bottom: 20,
    },
  })
})
</script>

<style scoped lang="scss">
.com {
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 15px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .content {
    display: flex;
    gap: 150px;
    font-size: 20px;
    box-sizing: border-box;
    border-radius: 15px;
    padding: 10px 30px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    p {
      margin: 0px 0px;
    }
  }
  .charts {
    width: 100%;
    height: 80%;
    border-radius: 15px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
}
</style>
