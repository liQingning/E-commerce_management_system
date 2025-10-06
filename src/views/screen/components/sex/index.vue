<template>
  <div class="sex">
    <Title :content="content" :color="props.color"></Title>
    <div class="main">
      <div class="people">
        <div class="man">
          <img src="../../images/man.png" alt="" />
        </div>
        <div class="woman">
          <img src="../../images/woman.png" alt="" />
        </div>
      </div>
      <div class="rate">
        <p>男士{{ man }}%</p>
        <p>女士{{ woman }}%</p>
      </div>

      <div ref="charts" class="charts"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
import Title from '../title/index.vue'
let charts = ref()
let props = defineProps<{
  color: string
}>()
let man = 58
let woman = 100 - man
let content = '男女比例'
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    xAxis: {
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      type: 'category',
    },
    series: [
      {
        type: 'bar',
        barWidth: 20,
        data: [man],
        z: 2,
        itemStyle: {
          color: 'rgb(0 122 254)',
          borderRadius: 15,
        },
        emphasis: {
          itemStyle: {
            color: 'rgb(0 122 254)', // 与正常状态相同的颜色
            borderRadius: 15,
          },
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        itemStyle: {
          color: 'rgb(255 75 122)',
          borderRadius: 15,
        },
        emphasis: {
          itemStyle: {
            color: 'rgb(255 75 122)', // 与正常状态相同的颜色
            borderRadius: 15,
          },
        },
        showBackground: false,

        z: 1,
        barGap: '-100%',
      },
    ],
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.sex {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

    .rate {
      display: flex;
      justify-content: space-between;
      padding: 0px 20px;
      box-sizing: border-box;
      width: 100%;
      p {
        margin: 0px 0px;
      }
    }
    .charts {
      width: 80%;
      height: 100%;
      margin-left: 10%;
    }
    .people {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
      gap: 20px;
      .man {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px;
        width: 100px;
        height: 100px;
        background-size: cover;
        background: url(../../images/man-bg.png) center no-repeat;
        img {
          width: 70px;
          height: 70px;
        }
      }
      .woman {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px;
        width: 90px;
        height: 100px;
        background-size: cover;
        background: url(../../images/woman-bg.png) center no-repeat;
        img {
          width: 70px;
          height: 70px;
        }
      }
    }
  }
}
</style>
