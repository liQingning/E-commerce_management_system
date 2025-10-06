<template>
  <div class="logo_part">
    <img src="../../../logo.png" alt="" />
    <div :class="{ fold: settingStore.fold ? true : false }">
      <span>{{ setting.titleMain }}</span>
      <span>{{ setting.titleSub }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'LogoPart',
})
import setting from '@/setting'
import useLayoutSettingStore from '@/store/modules/setting'
let settingStore = useLayoutSettingStore()
// let title=document.getElementsByClassName('title')
// if(settingStore.fold==true){
//   title.
// }
</script>

<style scoped lang="scss">
.logo_part {
  width: 100%;
  height: 7vh;
  min-height: 45px;
  box-sizing: border-box;
  padding-left: 12px;
  padding-right: 10px;
  display: flex;
  overflow: hidden;
  align-items: center;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.25);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-right: 1.5px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  z-index: 10;
  transition: all 0.5s ease-in-out;
  img {
    width: 40px;
  }

  div {
    padding-left: 12px;
    display: flex;
    flex-direction: column;
    width: 130px;
    min-width: 100px;
    gap: 3px;
    opacity: 1;

    span:nth-child(1) {
      font-weight: 700;
      font-size: 20px;
    }
    span:nth-child(2) {
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 2px;
    }
  }
}
</style>
