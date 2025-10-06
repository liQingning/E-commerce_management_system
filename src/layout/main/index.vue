<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition
        enter-active-class="enter-active"
        leave-active-class="leave-active"
      >
        <!-- 渲染layout一级路由组件的子路由 -->
        <component :is="Component" v-if="flag" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Main',
})
import { watch, ref, nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
let settingStore = useLayoutSettingStore()

let flag = ref(true)
watch(
  () => settingStore.refresh,
  () => {
    //点击刷新按钮，路由组件销毁
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<style scoped>
.enter-active {
  opacity: 0;
  transform: translateY(60px);
}
.enter-active-to {
  transition: all 0.3s ease-in-out;
  opacity: 1;
  transform: translateY(0);
}

/* 离开动画：0s，瞬间消失 */
.leave-active {
  transition: none;
}
</style>
