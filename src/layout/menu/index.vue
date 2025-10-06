<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <el-menu-item
      v-if="!item.children && !item.meta.hidden"
      :index="item.path"
      @click="goRoute"
    >
      <el-icon><component :is="item.meta.icon"></component></el-icon>
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有一个子路由 -->
    <el-menu-item
      v-if="item.children && item.children.length == 1 && !item.meta.hidden"
      :index="item.children[0].path"
      @click="goRoute"
    >
      <el-icon>
        <component :is="item.children[0].meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有多个子路由 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1 && !item.meta.hidden"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>

        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script lang="ts" setup>
defineProps(['menuList'])
defineOptions({ name: 'Menu' })

import { useRouter } from 'vue-router'
let $router = useRouter()
const goRoute = (vc: any) => {
  $router.push(vc.index)
}
</script>

<style scoped lang="scss"></style>
