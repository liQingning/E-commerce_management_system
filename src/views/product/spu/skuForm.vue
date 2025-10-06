<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input v-model="skuParams.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        v-model="skuParams.price"
        placeholder="价格(元)"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input
        v-model="skuParams.weight"
        placeholder="重量(克)"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        v-model="skuParams.skuDesc"
        placeholder="SKU描述"
        type="textarea"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" class="平台属性" label-width="80px">
        <el-form-item
          v-for="item in attrList"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${value.id}`"
              v-for="value in item.attrValueList"
              :key="value.id"
              :label="value.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" class="平台属性" label-width="80px">
        <el-form-item
          v-for="item in saleList"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleAttrIdAndValueId">
            <el-option
              :value="`${item.id}:${value.id}`"
              v-for="value in item.spuSaleAttrValueList"
              :key="value.id"
              :label="value.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgList" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
          :selectable="false"
        ></el-table-column>
        <el-table-column label="图片" width="250px">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" style="width: 150px" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              style="width: auto"
              @click="handler(row)"
            >
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 120px" @click="addSku">
        保存
      </el-button>
      <el-button @click="cancel" style="width: 120px">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { SkuData } from '@/api/product/spu/type'
import {
  reqGetSpuImageList,
  reqGetSPuSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
import { reqAttrList } from '@/api/product/attr'
import { ElMessage } from 'element-plus'
let $emit = defineEmits(['changeScene'])
let attrList = ref<any>([])
let saleList = ref<any>([])
let imgList = ref<any>([])
let table = ref<any>()

// 定义SKU参数的响应式变量，用于v-model双向绑定
const skuParams = reactive<SkuData>({
  //父组件传递
  category3Id: '',
  tmId: '',
  spuId: '',
  //v-modeel收集
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  //
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
})

const addSku = () => {
  skuParams.skuAttrValueList = attrList.value.reduce((pre: any, cur: any) => {
    if (cur.attrIdAndValueId) {
      let arr = cur.attrIdAndValueId.split(':')
      pre.push({
        attrId: arr[0].toString(),
        valueId: arr[1].toString(),
      })
    }
    return pre
  }, [])
  skuParams.skuSaleAttrValueList = saleList.value.reduce(
    (pre: any, cur: any) => {
      if (cur.saleAttrIdAndValueId) {
        let arr = cur.saleAttrIdAndValueId.split(':')
        pre.push({
          saleAttrId: arr[0].toString(),
          saleAttrValueId: arr[1].toString(),
        })
      }
      return pre
    },
    [],
  )
  reqAddSku(skuParams).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '添加SKU成功',
      })
      $emit('changeScene', { flag: 0, params: 'updata' })
    } else {
      $emit('changeScene', { flag: 0, params: 'updata' })
      ElMessage({
        type: 'error',
        message: '添加SKU失败',
      })
    }
  })
  skuParams.skuName = ''
  skuParams.price = ''
  skuParams.weight = ''
  skuParams.skuDesc = ''
}

const cancel = () => {
  skuParams.skuName = ''
  skuParams.price = ''
  skuParams.weight = ''
  skuParams.skuDesc = ''
  $emit('changeScene', { flag: 0, params: 'updata' })
}

const handler = (row: any) => {
  imgList.value.forEach((element: any) => {
    table.value.toggleRowSelection(element, false)
  })
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}
const initaddsku = (c1id: number | string, c2id: number | string, spu: any) => {
  skuParams.category3Id = spu.category3Id
  skuParams.tmId = spu.tmId
  skuParams.spuId = spu.id
  reqAttrList(c1id, c2id, spu.category3Id).then((res: any) => {
    attrList.value = res.data
  })
  reqGetSPuSaleAttr(spu.id).then((res: any) => {
    saleList.value = res.data
  })
  reqGetSpuImageList(spu.id).then((res: any) => {
    imgList.value = res.data
  })
}
defineExpose({ initaddsku })
</script>

<style scoped lang="scss">
:deep(.el-form-item__content) {
}
.平台属性 {
  .el-form-item {
    width: 250px;
  }
}
:deep(.el-textarea__inner) {
  border-radius: 15px;
}
</style>
