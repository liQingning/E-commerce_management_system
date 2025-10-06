<template>
  <div class="tourist">
    <div class="top">
      <p>实时销售统计</p>
      <p></p>
      <p>
        库存总量
        <span>{{ total }}</span>
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
let charts = ref()
let total = ref(99999)
let currentnumber = ref(72345)
onMounted(() => {
  let myChart = echarts.init(charts.value)
  let option = {
    series: [
      {
        type: 'liquidFill',
        data: [
          currentnumber.value / total.value,
          (currentnumber.value / total.value) * 0.6,
        ],
        color: [props.color],
        radius: '88%',
        label: {
          color: '',
          fontWeight: 'bold',
        },

        backgroundStyle: {
          color: '#00000000',
        },
        outline: {
          itemStyle: {
            borderColor: props.color,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
    ],
  }
  myChart.setOption(option)
})
let people = ref(currentnumber.value.toString().split(''))
// 定义props接收color属性
let props = defineProps<{
  color: string
}>()
</script>

<style scoped lang="scss">
.tourist {
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
  .number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 30px;
    margin: 10px 0px;
    width: 100%;
    span {
      box-sizing: border-box;
      padding: 10px 15px;
      color: v-bind(color);
      border-radius: 15px;
      background: var(--base-glass-bgcolor);
      backdrop-filter: $base-backdrop-filter;
      box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
  .charts {
    width: 100%;
    height: 63%;
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
