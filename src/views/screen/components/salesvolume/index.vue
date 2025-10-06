<template>
  <div class="sales">
    <Title :content="content" :color="color"></Title>

    <!-- 内容区域 -->
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
let content = '年度销量对比'
let date1 = ref([
  64000, 43200, 30100, 56400, 90000, 34000, 25000, 50100, 26400, 90000, 34000,
  25000,
])
let date2 = ref([
  12000, 28200, 11100, 23400, 22000, 34000, 31000, 23400, 22000, 34000, 31000,
  40000,
])
let date3 = ref([
  32000, 13200, 20100, 33400, 19000, 13000, 22000, 33400, 19000, 13000, 22000,
  12000,
])
const textcolor = getComputedStyle(document.documentElement)
  .getPropertyValue('--base-screen-textcolor')
  .trim()
onMounted(() => {
  let myChart = echarts.init(charts.value)
  myChart.setOption({
    color: ['#80FFA5', '#00DDFF', '#37A2FF'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      top: 10,
      itemGap: 20,

      data: ['2023', '2024', '2025'],
      textStyle: {
        color: textcolor,
      },
    },
    title: {
      textStyle: {
        color: textcolor,
        fontSize: 16,
        fontWeight: 'normal',
        padding: [0, 0, 10, 0],
        borderWidth: 0,
        rich: {},
        align: 'left',
      },
    },
    toolbox: {
      top: -5,
      right: 10,
      itemSize: 20,
      itemGap: 15,
      emphasis: {
        iconStyle: {
          borderColor: '#000',
          fontSize: '40px',
        },
      },
      iconStyle: {
        color: props.color,
        borderColor: textcolor,
        borderWidth: 2,
      },
      tooltip: {},
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: [
      {
        axisLabel: {
          color: textcolor,
        },
        type: 'category',
        boundaryGap: false,
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      },
    ],
    yAxis: [
      {
        axisLabel: {
          color: textcolor,
        },
        min: 0,
        max: 100000,
        type: 'value',
      },
    ],
    grid: {
      left: 20,
      right: 20,
      top: 40,
      bottom: 30,
    },
    series: [
      {
        name: '2023',
        type: 'line',
        smooth: true,
        itemStyle: {
          color: 'rgba(128, 255, 165,0.5)',
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(128, 255, 165,0.5)',
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: date1.value,
      },
      {
        name: '2024',
        type: 'line',
        smooth: true,
        sampling: 'lttb',
        itemStyle: {
          color: 'rgba(255, 0, 135,0.5)',
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(255, 0, 135,0.5)',
            },
            {
              offset: 1,
              color: 'rgb(135, 0, 157)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: date2.value,
      },
      {
        name: '2025',
        type: 'line',
        smooth: true,
        itemStyle: {
          color: 'rgba(255, 191, 0,0.5)',
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(255, 191, 0,0.5)',
            },
            {
              offset: 1,
              color: 'rgb(224, 62, 76)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: date3.value,
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.sales {
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
  .charts {
    width: 100%;
    height: 180%;
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
