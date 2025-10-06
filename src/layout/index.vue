<template>
  <div class="layout_container">
    <div
      class="layout_slider"
      :class="{ fold: settingStore.fold ? true : false }"
    >
      <logo></logo>
      <!-- 滚动组件 -->
      <el-scrollbar style="height: auto">
        <el-menu :default-active="$route.path" :collapse="settingStore.fold">
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>

    <div
      class="layout_tabber"
      :class="{ fold: settingStore.fold ? true : false }"
      ref="tabberRef"
    >
      <Tabber></Tabber>
    </div>
    <div
      class="layout_main"
      :class="{ fold: settingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Logo from './logo/index.vue'
import Tabber from './tabber/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRoute } from 'vue-router'
import useLayoutSettingStore from '@/store/modules/setting'
let settingStore = useLayoutSettingStore()
let userStore = useUserStore()

let $route = useRoute()
const tabberRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

// 监听tabber宽度变化
const handleTabberResize = () => {
  if (tabberRef.value) {
    const width = tabberRef.value.offsetWidth
    // 当宽度小于758px时折叠侧边栏
    if (width <= 558 && !settingStore.fold) {
      settingStore.fold = true
    }
  }
}

onMounted(() => {
  // 初始化监听
  if (tabberRef.value) {
    resizeObserver = new ResizeObserver(handleTabberResize)
    resizeObserver.observe(tabberRef.value)
    // 初始检查
    handleTabberResize()
  }
})

onUnmounted(() => {
  // 清理监听
  if (resizeObserver && tabberRef.value) {
    resizeObserver.unobserve(tabberRef.value)
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

defineOptions({
  name: 'Layout',
})
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    position: fixed;
    top: 2.5vh;
    left: 1.3vw;
    width: $base-menu-width;
    min-width: 200px;
    min-height: 370px;
    height: 95vh;
    background: var(--base-glass-bgcolor);
    padding: 20px;
    z-index: 1000;
    border-radius: 25px;
    backdrop-filter: blur(15px) saturate(140%);
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.25);
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    border-right: 1.5px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1.5px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease-in-out;
    &.fold {
      transition: all 0.2s ease-in-out;
      width: $base-menu-fold-width;
      min-width: 64px;
    }
  }
  .layout_tabber {
    display: flex;
    box-sizing: border-box;
    position: fixed;
    top: 1vh;
    align-items: center;
    min-width: 530px;
    left: calc(max($base-menu-width, 200px) + 2.6vw);
    border-radius: 15px;
    width: calc(100% - max($base-menu-width, 200px) - 3.9vw);
    height: $base-tabber-height;
    background: var(--base-glass-bgcolor);
    backdrop-filter: blur(15px) saturate(140%);
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.25);
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    border-right: 1.5px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1.5px solid rgba(255, 255, 255, 0.2);
    z-index: 1000;
    transition: all 0.2s ease-in-out;
    &.fold {
      left: calc($base-menu-fold-width + 2.6vw);
      width: calc(100% - $base-menu-fold-width - 3.9vw);
    }
  }
  .layout_main {
    box-sizing: border-box;
    position: absolute;
    padding: 20px;
    min-width: 530px;
    min-height: 378px;
    top: calc($base-tabber-height + 3vh);
    left: calc(max($base-menu-width, 200px) + 2.6vw);
    width: calc(100% - max($base-menu-width, 200px) - 3.9vw);
    height: calc(100vh - $base-tabber-height - 5vh);
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.25);
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    border-right: 1.5px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1.5px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    overflow: auto;
    z-index: 1000;
    transition: all 0.2s ease-in-out;
    &.fold {
      left: calc($base-menu-fold-width + 2.6vw);
      width: calc(100% - $base-menu-fold-width - 3.9vw);
    }
  }
}

:deep(.el-scrollbar) {
  border-radius: 15px;
  background: #ffffff00;
  height: 10%;
  transition: all 0.2s ease-in-out;
  box-shadow: 0px -25px 45px rgba(0, 0, 0, 0.18470588235294117);
}

:deep(.el-menu) {
  height: 100%;
  background: #ffffff00;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: none;
  transition: all 0.2s ease-in-out;
}

:deep(.el-menu-item) {
  box-sizing: border-box;
  border-radius: 15px;
  width: 100%;
  height: 7vh;
  min-height: 45px;

  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 44px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 1px;

  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.25);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-right: 1.5px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease-in-out;
  overflow: hidden;
}

:deep(.el-menu-item.is-active) {
  border-radius: 15px;
  background-color: var(--base-menu-active-bgcolor);
  backdrop-filter: $base-backdrop-filter;
}
:deep(.el-menu-item::before) {
  content: '';
  position: absolute;
  left: 0px;
  width: 0px;
  height: 7vh;
  min-height: 45px;
  transition: 0.2s;
  border-radius: 10px;
  transition-delay: 0ms;
  z-index: -12;
  border-radius: 15px;
  background-color: var(--base-menu-hover-bgcolor);
  backdrop-filter: $base-backdrop-filter;
}
:deep(.el-menu-item:hover:before) {
  width: 100%;
  height: 7vh;
  min-height: 45px;
}

:deep(.el-sub-menu) {
  border-radius: 15px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.25);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-right: 1.5px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}
:deep(.el-sub-menu__title) {
  box-sizing: border-box;
  border-radius: 15px;
  // width: 100%;
  height: 7vh;
  min-height: 45px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  font-weight: 500;
  letter-spacing: 1px;

  background: rgba(255, 255, 255, 0);
  transition: all 0.2s ease-in-out;
  .el-sub-menu__icon-arrow {
    width: 20px;
    height: 20px;
    position: absolute;
    padding-left: 0px;
    top: 45%;
    left: 80%;
  }

  svg {
    width: 20px;
    height: 20px;
    font-weight: 700;
  }
}
:deep(.el-sub-menu::before) {
  content: '';
  position: absolute;
  left: 0px;
  width: 0px;
  height: 7vh;
  min-height: 45px;
  transition: 0.2s;
  border-radius: 10px;
  transition-delay: 0ms;
  z-index: -12;
  border-radius: 15px;
  background-color: var(--base-menu-hover-bgcolor);
  backdrop-filter: $base-backdrop-filter;
}
:deep(.el-sub-menu:hover:before) {
  width: 100%;
  height: 7vh;
  min-height: 45px;
}
:deep(.el-menu .el-menu--inline) {
  padding-top: 10px;
  width: 70%;
  box-sizing: border-box;
  position: relative;
  left: 15%;
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  .el-menu-item {
    height: 5vh;
    min-height: max(5vh, 30px);
    font-size: 15px;
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    padding: 0px;
  }
}
</style>
