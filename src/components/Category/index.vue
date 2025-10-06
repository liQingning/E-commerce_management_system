<template>
  <el-card class="category-card">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类" width="100px">
        <el-select
          v-model="categoryStore.c1id"
          @change="handler"
          :disabled="scene == 0 ? false : true"
        >
          <!-- label即为显示文字，value是收集的数据 -->
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryStore.c2id"
          @change="handler2"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="categoryStore.c3id"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Category',
})

import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()
onMounted(async () => {
  getC1()
})
const getC1 = () => {
  //获取一级分类数据
  categoryStore.getC1()
}

const handler = () => {
  //重置二级三级分类数据
  categoryStore.c2id = ''
  categoryStore.c3id = ''
  categoryStore.c3Arr = []
  //获取二级分类数据
  categoryStore.getC2()
}
const handler2 = () => {
  //获取三级分类数据
  categoryStore.getC3()
  categoryStore.c3id = ''
}
defineProps(['scene'])
</script>

<style scoped lang="scss">
.demo-form-inline .el-select {
  --el-select-width: 220px;
}
.category-card {
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  :deep(.el-select__wrapper) {
    border-radius: 15px;
  }
}
</style>
