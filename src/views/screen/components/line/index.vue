<template>
  <div class="line">
    <Title :content="content" :color="color"></Title>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script lang="ts" setup>
import Title from '../title/index.vue'
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

let charts = ref()
let content = '未来七天销售量趋势图'
let props = defineProps<{
  color: string
}>()
const textcolor = getComputedStyle(document.documentElement)
  .getPropertyValue('--base-screen-textcolor')
  .trim()
onMounted(() => {
  let myChart = echarts.init(charts.value)
  myChart.setOption({
    title: {
      text: '访问量',
      left: '0',
      top: '0',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal',
        color: textcolor,
      },
    },
    xAxis: {
      axisLabel: {
        color: textcolor,
      },
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      axisLabel: {
        color: textcolor,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: textcolor,
        },
      },
    },
    grid: {
      left: 10,
      right: 10,
      top: 40,
      bottom: 20,
    },
    tooltip: {
      trigger: 'axis',
      position: function (pt: number[]) {
        return [pt[0], '10%']
      },
    },
    toolbox: {
      top: -14,
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
        dataZoom: {
          yAxisIndex: 'none',
        },
        restore: {},
        saveAsImage: {},
      },
    },
    series: [
      {
        data: [150, 230, 224, 218, 147, 260, 800, 200],
        name: '总销量',
        type: 'line',
        smooth: true,
        sampling: 'lttb',

        itemStyle: {
          color: props.color,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 158, 68)',
            },
            {
              offset: 1,
              color: props.color,
            },
          ]),
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.line {
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
    height: 200px;
  }
}
</style>
