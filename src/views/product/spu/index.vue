<template>
  <el-card class="box-card">
    <category :scene="scene"></category>
    <el-card style="margin: 20px 0" class="form-box">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          style="width: 140px"
          icon="plus"
          @click="addspu"
          :disabled="!categoryStore.c3id"
          v-permission="'btn.Spu.add'"
        >
          添加SPU
        </el-button>
        <!-- 展示数据 -->
        <el-table style="margin: 20px 0px" border :data="records">
          <el-table-column
            prop="date"
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU名称"
            width="160px"
          ></el-table-column>
          <el-table-column prop="description" label="SPU描述"></el-table-column>
          <el-table-column label="操作" width="350px">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="plus"
                title="添加sku"
                @click="addsku(row)"
                v-permission="'btn.Spu.addsku'"
              ></el-button>
              <el-button
                type="success"
                size="small"
                icon="edit"
                title="修改spu"
                @click="updataspu(row)"
                v-permission="'btn.Spu.update'"
              ></el-button>
              <el-button
                type="warning"
                size="small"
                icon="view"
                title="查看"
                @click="findSku(row)"
                v-permission="'btn.Spu.skus'"
              ></el-button>
              <el-popconfirm
                :title="`你确定要删除${row.spuName}吗？`"
                @confirm="delspu(row)"
                width="200px"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="delete"
                    title="删除"
                    v-permission="'btn.Spu.delete'"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :size="size"
          :disabled="disabled"
          :background="background"
          layout=" prev, pager, next, jumper,->,total, sizes,"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getHasSpu"
        />
      </div>
      <spu-form
        ref="spuform"
        v-show="scene == 1"
        :scene="scene"
        @changescene="changescene"
      ></spu-form>
      <sku-form
        ref="skuform"
        v-show="scene == 2"
        :scene="scene"
        @changeScene="changescene"
      ></sku-form>
      <el-dialog v-model="dialogVisible" title="SKU列表" width="50%">
        <el-table :data="skuarr" border>
          <el-table-column prop="skuName" label="SKU名称"></el-table-column>
          <el-table-column prop="price" label="SKU价格"></el-table-column>
          <el-table-column prop="weight" label="SKU重量"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width: 100px" alt="" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
    <template #footer>spu management</template>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuInfoData,
} from '@/api/product/spu/type'
import { reqGetSpuList, reqGetSkuInfo, reqDeleteSku } from '@/api/product/spu'
import useCategoryStore from '@/store/modules/category'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
let scene = ref<number>(0)
//当前页码
let currentPage = ref(1)
//每页条数
let pageSize = ref(3)
//分页大小
let size = ref('default')
let background = ref(true)
let disabled = ref(false)
let total = ref<number>(0)

let records = ref<Records>([])
let spuform = ref<any>()
let skuform = ref<any>()

let skuarr = ref<SkuInfoData[]>([])
let dialogVisible = ref(false)

const delspu = (row: SpuData) => {
  reqDeleteSku(row.id as number).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getHasSpu(
        records.value.length > 1 ? currentPage.value : currentPage.value - 1,
      )
    } else {
      ElMessage.error('删除失败')
    }
  })
}

const findSku = (row: SpuData) => {
  reqGetSkuInfo(row.id as number).then((res: any) => {
    if (res.code === 200) {
      skuarr.value = res.data
      dialogVisible.value = true
    }
  })
}

const addsku = (row: SpuData) => {
  scene.value = 2
  skuform.value.initaddsku(categoryStore.c1id, categoryStore.c2id, row)
}
const handleSizeChange = () => {
  getHasSpu()
}
watch(
  () => categoryStore.c3id,
  () => {
    if (!categoryStore.c3id) {
      return
    }
    getHasSpu()
  },
)

function getHasSpu(pager = 1) {
  currentPage.value = pager
  reqGetSpuList(currentPage.value, pageSize.value, categoryStore.c3id).then(
    (res: HasSpuResponseData) => {
      if (res.code == 200) {
        records.value = res.data.records
        total.value = res.data.total
      }
    },
  )
}

const addspu = () => {
  scene.value = 1
  spuform.value.initaddspu(categoryStore.c3id)
}

const changescene = (obj: any) => {
  scene.value = obj.flag

  // 切换回列表视图时，回到第一页并重新加载数据，确保能看到新添加的记录
  if (obj.params === 'updata') {
    getHasSpu(currentPage.value)
  } else {
    getHasSpu(total.value / pageSize.value + 1)
  }
}
const updataspu = (row: SpuData) => {
  scene.value = 1
  spuform.value.initHasSpuData(row)
}

onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped lang="scss">
.box-card {
  display: flex;
  gap: 20px;
  flex-direction: column;
  border-radius: 15px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.form-box {
  border-radius: 15px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
:deep(.form-box .el-card__body) {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  button {
    border-radius: 15px;
  }

  li {
    border-radius: 15px;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  div {
    border-radius: 15px;
  }
  tr {
    border-radius: 15px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    .el-table_1_column_3 {
      font-size: 15px;
    }
  }
  .el-upload--picture-card {
    background: #ffffff;
  }
  .el-overlay {
    background: #00000063;
  }
  td {
    font-size: 20px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    button {
      font-size: 15px;
      width: 60px;
      height: 40px;
      border-radius: 15px;
      font-size: 20px;
    }
  }
  /* 确保tooltip正常显示的关键样式 */
  td:hover {
    background: var(--base-glass-bgcolor);
  }
  /* 确保tooltip的z-index高于其他元素 */
  :deep(.el-tooltip:hover) {
    color: #000;
    background: #000;
    z-index: 2050 !important;
  }
  /* 移除黑色背景以确保tooltip正常显示 */

  table {
    border-radius: 15px;
  }
  colgroup {
    border-radius: 15px;
  }
}
:deep(.el-pagination) {
  .el-input {
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
  }
  .el-input__wrapper {
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
  }
  .el-select {
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
  }
}
</style>
