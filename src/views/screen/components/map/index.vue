<template>
  <div class="map" ref="charts"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import chinaJson from './china.json'
let charts = ref()
echarts.registerMap('china', chinaJson as any)
let props = defineProps<{
  color: string
}>()
onMounted(() => {
  const chart = echarts.init(charts.value)
  chart.setOption({
    geo: {
      map: 'china',
      roam: true,
      left: 50,
      top: 50,
      bottom: 0,
      right: 50,
      label: {
        show: true,
        fontSize: 16,
      },
      itemStyle: {
        areaColor: '#ffffff',
        borderColor: props.color,
      },
      emphasis: {
        itemStyle: {
          color: props.color,
        },
        label: {
          show: true,
          fontSize: 26,
          color: '#fff',
        },
      },
    },
    grid: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
    },
    series: [
      {
        type: 'lines',
        coordinateSystem: 'geo',
        data: [
          {
            coords: [
              [116.407526, 39.90403],
              [121.473701, 31.230416],
            ],
            lineStyle: {
              color: '#000',
              width: 2,
              curveness: 0.2,
              type: 'dashed',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{b}',
              fontSize: 16,
            },
          },
          {
            coords: [
              [113.264385, 23.129112, 60],
              [106.551556, 29.563009, 10],
            ],
            lineStyle: {
              color: '#000',
              width: 2,
              curveness: 0.2,
              type: 'dashed',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{b}',
              fontSize: 16,
            },
          },
          {
            coords: [
              [114.057868, 22.543099, 50],
              [118.796877, 32.060255, 30],
            ],
            lineStyle: {
              color: '#000',
              width: 2,
              curveness: 0.2,
              type: 'dashed',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{b}',
              fontSize: 16,
            },
          },
          {
            coords: [
              [120.15507, 30.274084, 40],
              [117.200983, 39.084158, 20],
            ],
            lineStyle: {
              color: '#000',
              width: 2,
              curveness: 0.2,
              type: 'dashed',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{b}',
              fontSize: 16,
            },
          },
          {
            coords: [
              [106.551556, 29.563009, 10],
              [114.057868, 22.543099, 50],
            ],
            lineStyle: {
              color: '#000',
              width: 2,
              curveness: 0.2,
              type: 'dashed',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{b}',
              fontSize: 16,
            },
          },
          {
            coords: [
              [118.796877, 32.060255, 30],
              [116.407526, 39.90403],
            ],
            lineStyle: {
              color: '#000',
              width: 2,
              curveness: 0.2,
              type: 'dashed',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{b}',
              fontSize: 16,
            },
          },
          {
            coords: [
              [117.200983, 39.084158, 20],
              [113.264385, 23.129112, 60],
            ],
            lineStyle: {
              color: '#000',
              width: 2,
              curveness: 0.2,
              type: 'dashed',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{b}',
              fontSize: 16,
            },
          },
          {
            coords: [
              [114.057868, 22.543099, 50],
              [121.473701, 31.230416],
            ],
            lineStyle: {
              color: '#000',
              width: 2,
              curveness: 0.2,
              type: 'dashed',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{b}',
              fontSize: 16,
            },
          },
          {
            coords: [
              [118.796877, 32.060255, 30],
              [120.15507, 30.274084, 40],
            ],
            lineStyle: {
              color: '#000',
              width: 2,
              curveness: 0.2,
              type: 'dashed',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{b}',
              fontSize: 16,
            },
          },
          {
            coords: [
              [117.200983, 39.084158, 20],
              [116.407526, 39.90403],
            ],
            lineStyle: {
              color: '#000',
              width: 2,
              curveness: 0.2,
              type: 'dashed',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{b}',
              fontSize: 16,
            },
          },
          {
            coords: [
              [120.15507, 30.274084, 40],
              [113.264385, 23.129112, 60],
            ],
            lineStyle: {
              color: '#000',
              width: 2,
              curveness: 0.2,
              type: 'dashed',
            },
            label: {
              show: true,
              position: 'end',
              formatter: '{b}',
              fontSize: 16,
            },
          },
        ],
        effect: {
          show: true,

          symbol: 'arrow',
          symbolSize: 20,
          color: props.color,
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.map {
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
}
</style>
