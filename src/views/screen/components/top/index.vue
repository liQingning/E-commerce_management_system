<template>
  <div class="top">
    <div class="left">
      <el-button class="lbtn" @click="gohome">首页</el-button>
    </div>
    <div class="center">商品销售可视化大数据平台</div>
    <div class="right">
      <el-button class="rbtn">统计报告</el-button>
      <span class="time">{{ time }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'
let time = ref(moment().format('YYYY年MM月DD日 hh:mm'))
let route = useRouter()
let timer = ref(0)
const gohome = () => {
  route.push('/home')
}
onMounted(() => {
  setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 hh:mm')
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
  .left {
    flex: 1;
    height: 70%;
    border-radius: 15px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .lbtn {
      width: auto;
      padding: 0px 20px;
      letter-spacing: 2px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      line-height: 30px;
      text-align: center;
      font-size: 22px;
      border-radius: 15px;
      background: var(--base-glass-bgcolor);
      backdrop-filter: $base-backdrop-filter;
      box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      margin: 0px 20px;
      cursor: pointer;
    }
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    letter-spacing: 4px;
    flex: 2;
    border-radius: 15px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  .right {
    height: 70%;
    flex: 1;
    border-radius: 15px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rbtn {
      letter-spacing: 2px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: auto;
      padding: 0px 20px;
      height: 40px;
      line-height: 30px;
      text-align: center;
      font-size: 22px;
      border-radius: 15px;
      background: var(--base-glass-bgcolor);
      backdrop-filter: $base-backdrop-filter;
      box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      margin: 0px 20px;
      cursor: pointer;
    }
    .time {
      margin: 0px 20px;
      font-size: 22px;
    }
  }
}
</style>
