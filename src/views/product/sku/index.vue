<template>
  <el-card class="box-card">
    <el-card class="form-box">
      <el-table
        :data="skuarr"
        border
        style="background-color: #00000000; border-radius: 15px"
      >
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="名称"
          width="250px"
          prop="skuName"
        ></el-table-column>
        <el-table-column
          label="描述"
          width="250px"
          prop="skuDesc"
        ></el-table-column>
        <el-table-column label="图片" width="250px">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" alt="" width="120px" />
          </template>
        </el-table-column>
        <el-table-column
          label="重量"
          width="250px"
          prop="weight"
        ></el-table-column>
        <el-table-column
          label="价格"
          width="250px"
          prop="price"
        ></el-table-column>
        <el-table-column label="操作" min-width="320" fixed="right">
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="edit"
              @click="updatesku"
              v-permission="'btn.Sku.update'"
            ></el-button>
            <el-popconfirm
              :title="`你确定要删除${row.skuName}吗？`"
              width="200px"
              @confirm="Delete(row)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  icon="delete"
                  v-permission="'btn.Sku.remove'"
                ></el-button>
              </template>
            </el-popconfirm>
            <el-button
              :type="row.isSale == 1 ? 'warning' : 'success'"
              size="small"
              :icon="row.isSale == 1 ? 'bottom' : 'top'"
              @click="updatesale(row)"
              v-permission="'btn.Sku.updown'"
            ></el-button>
            <el-button
              type="info"
              size="small"
              icon="InfoFilled"
              @click="infordrawer(row)"
              v-permission="'btn.Sku.detail'"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 40]"
        :size="size"
        :disabled="disabled"
        :background="background"
        layout=" prev, pager, next, jumper,->,total, sizes,"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="getHasSku"
      />
      <!-- 抽屉 -->
    </el-card>
    <el-drawer v-model="drawer" size="40%">
      <template #header>
        <h2>查看商品详情</h2>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px" prop="price">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ infor?.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ infor?.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ infor?.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 0px 5px">缺少这个接口</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 0px 5px">缺少这个接口</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="250px">
              <el-carousel-item v-for="item in 6" :key="item">
                <h3 text="2xl" justify="center">{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
    <template #footer>sku management</template>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  reqSkuList,
  reqOnSale,
  reqCancelSale,
  reqDeleteSku,
} from '@/api/product/sku'
import type { SkuResponseData, SkuData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
//当前页码
let currentPage = ref(1)
//每页条数
let pageSize = ref(5)
//分页大小
let size = ref('default')
let background = ref(true)
let disabled = ref(false)
let total = ref<number>(0)

let skuarr = ref<SkuData[]>([])

let drawer = ref(false)
let infor = ref<SkuData>()
onMounted(() => {
  getHasSku()
})

const Delete = (row: SkuData) => {
  reqDeleteSku(row.id as number).then((res) => {
    if (res.code == 200) {
      ElMessage.success('删除成功')
      getHasSku(
        skuarr.value.length > 1 ? currentPage.value : currentPage.value - 1,
      )
    } else {
      ElMessage.error('删除失败')
    }
  })
}
const infordrawer = (row: SkuData) => {
  drawer.value = true
  infor.value = row
}
const updatesku = () => {
  ElMessage.success('程序员在努力的更新中...')
}
const updatesale = (row: SkuData) => {
  if (row.isSale == 1) {
    reqCancelSale(row.id as number).then((res) => {
      if (res.code == 200) {
        row.isSale = 0
        ElMessage.success('下架成功')
        getHasSku()
      } else {
        ElMessage.error('下架失败')
      }
    })
  } else {
    reqOnSale(row.id as number).then((res) => {
      if (res.code == 200) {
        row.isSale = 1
        ElMessage.success('上架成功')
        getHasSku()
      } else {
        ElMessage.error('上架失败')
      }
    })
  }
}
const getHasSku = (pager = 1) => {
  currentPage.value = pager
  reqSkuList(currentPage.value, pageSize.value).then((res: SkuResponseData) => {
    if (res.code === 200) {
      skuarr.value = res.data.records
      total.value = res.data.total
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getHasSku(currentPage.value)
}
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
  gap: 20px;
  flex-direction: column;
  border-radius: 15px;
  button {
    border-radius: 15px;
  }

  li {
    border-radius: 10px;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  div {
    border-radius: 15px;
  }
  tr {
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    .el-table_1_column_3 {
      font-size: 15px;
    }
  }

  .el-upload--picture-card {
    background: #ffffff;
  }
  .el-table__body-wrapper {
    background: #00000000;
  }
  .el-dialog {
    background: #ffffff;
  }
  .el-overlay {
    background: #00000063;
  }
  td {
    font-size: 20px;
    border-radius: none;
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
:deep(.drawer) {
  header {
    margin: 0px 0px;
  }
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
:deep(.el-carousel__indicators) {
  width: 300px;
  li {
    border-radius: 10px;
    margin: 0px 5px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
}
:deep(.el-drawer) {
  header {
    margin-bottom: 0px;
  }
}
</style>
