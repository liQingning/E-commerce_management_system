<template>
  <el-form class="spuform" label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        v-model="Spuparams.spuName"
        placeholder="请你输入spu名称"
        style="width: 300px"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select style="width: 300px" v-model="Spuparams.tmId">
        <el-option
          v-for="item in AllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请输入描述"
        v-model="Spuparams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图标">
      <el-upload
        v-model:file-list="ImageList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="beforeAvatarUpload"
        :headers="{
          Accept: 'application/json',
          token: GET_TOKEN(), // 确保这里返回有效的token
          // 注意：不要手动设置Content-Type，浏览器会自动设置multipart/form-data
        }"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性" class="spu销售属性">
      <el-select
        v-model="saleAttrIdAndValueName"
        style="width: 300px"
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
      >
        <el-option
          :value="`${item.id}:${item.name}`"
          v-for="(item, $index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-button
        @click="addsaleattr"
        :disabled="saleAttrIdAndValueName ? false : true"
        type="primary"
        size=""
        icon="plus"
      >
        添加属性
      </el-button>
      <el-table border :data="SalesAttr">
        <el-table-column
          label="序号"
          width="80px"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="saleAttrName"
          label="销售属性名称"
          width="120px"
        />
        <el-table-column label="销售属性值">
          <template #default="{ $index, row }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="index"
              closable
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.flag"
              ref="InputRef"
              v-model="inputValue"
              class="w-20"
              placeholder="请输入属性值"
              style="width: 200px"
              @keyup.enter="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            />
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
              style="font-size: 15px; width: auto"
            >
              + New Tag
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              @click="SalesAttr.splice($index, 1)"
              icon="delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 120px" @click="save">
        保存
      </el-button>
      <el-button style="width: 120px" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { GET_TOKEN } from '@/utils/token'
import { computed, ref, nextTick } from 'vue'
import {
  reqAllTrademark,
  reqGetSpuImageList,
  reqGetSPuSaleAttr,
  reqGetAllSaleAttr,
  reqAddOrUpdataSpu,
} from '@/api/product/spu'
import type {
  AllSaleAttrvalue,
  SpuSaleAttr,
  SpuImg,
  SpuData,
  TrademarkData,
  AllTradeMark,
  SpuImgList,
  SaleAttrResponseData,
  AllSaleAttrResponseData,
  SpuSaleAttrValue,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
let $emit = defineEmits(['changescene'])
const cancel = () => {
  $emit('changescene', { flag: 0, params: 'updata' })
  //清除数据
  Spuparams.value = {
    category3Id: '',
    description: '',
    spuImageList: [],
    spuName: '',
    spuSaleAttrList: [],
    tmId: '',
  }
  SalesAttr.value = []
  AllTradeMark.value = []

  ImageList.value = []
}
//spu数据初始化
//全部品牌数据
let AllTradeMark = ref<TrademarkData[]>([])
//spu图片列表数据
let ImageList = ref<SpuImg[]>([])
//已有的spu销售属性数据列表
let SalesAttr = ref<SpuSaleAttr[]>([])
//全部spu销售属性数据
let AllSaleAttr = ref<AllSaleAttrvalue[]>([])

let Spuparams = ref<SpuData>({
  category3Id: '',
  description: '',
  spuImageList: [],
  spuName: '',
  spuSaleAttrList: [],
  tmId: '',
})

let dialogVisible = ref(false)
let dialogImageUrl = ref('')

let saleAttrIdAndValueName = ref<string>('')

import type { InputInstance } from 'element-plus'

const inputValue = ref('')
const InputRef = ref<InputInstance>()

const showInput = (row: any) => {
  row.flag = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const save = () => {
  Spuparams.value.spuImageList = ImageList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  Spuparams.value.spuSaleAttrList = SalesAttr.value
  console.log(Spuparams.value)
  if (Spuparams.value.spuName === '') return ElMessage.error('SPU名称不能为空')
  if (Spuparams.value.description === '')
    return ElMessage.error('SPU描述不能为空')
  if (ImageList.value.length < 1)
    return ElMessage.error('至少上传一张图片作为SPU图标')
  if (SalesAttr.value.length < 1) return ElMessage.error('至少添加一个销售属性')
  reqAddOrUpdataSpu(Spuparams.value)
    .then((res: any) => {
      ElMessage.success(Spuparams.value.id ? '更新成功' : '添加成功')
      $emit('changescene', {
        flag: 0,
        params: Spuparams.value.id ? 'updata' : 'add',
      })
    })
    .catch((err: any) => {
      ElMessage.error(Spuparams.value.id ? '更新失败' : '添加失败')
    })
}

const handleInputConfirm = (row: any) => {
  if (inputValue.value) {
    if (inputValue.value.length > 100)
      return ElMessage.error('属性值长度不能超过100')
    if (inputValue.value.trim() === '') return ElMessage.error('属性值不能为空')
    if (
      row.spuSaleAttrValueList.some(
        (item: SpuSaleAttrValue) => item.saleAttrValueName === inputValue.value,
      )
    )
      return ElMessage.error('属性值不能重复')
    let newdata: SpuSaleAttrValue = {
      saleAttrValueName: inputValue.value,
      baseSaleAttrId: row.baseSaleAttrId,
    }
    row.spuSaleAttrValueList.push(newdata)
  }
  row.flag = false
  inputValue.value = ''
}
const initHasSpuData = (spu: SpuData) => {
  Spuparams.value = spu
  //spu即为父组件传递过来的已有spu对象
  reqAllTrademark().then((res: AllTradeMark) => {
    AllTradeMark.value = res.data
  })
  reqGetSpuImageList(spu.id as number).then((res: SpuImgList) => {
    ImageList.value = res.data.map((item) => {
      return {
        name: item.imgName,
        url: item.imgUrl,
      }
    })
  })
  reqGetSPuSaleAttr(spu.id as number).then((res: SaleAttrResponseData) => {
    SalesAttr.value = res.data
  })
  reqGetAllSaleAttr().then((res: AllSaleAttrResponseData) => {
    AllSaleAttr.value = res.data
  })
}

const handlePictureCardPreview = (uploadFile: any) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
const handleRemove = (uploadFile: any) => {
  ImageList.value = ImageList.value.filter(
    (item) => item.url !== uploadFile.url,
  )
}
const beforeAvatarUpload = (file: any) => {
  if (
    file.type !== 'image/jpeg' &&
    file.type !== 'image/png' &&
    file.type !== 'image/gif'
  ) {
    ElMessage.error('图片格式必须是 JPG、PNG 或 GIF!')
    return false
  } else if (file.size / 1024 / 1024 > 4) {
    ElMessage.error('图片大小不能超过 4MB!')
    return false
  }
  return true
}

let unSelectSaleAttr = computed(() => {
  let unSelectAttr = AllSaleAttr.value.filter((item) => {
    return SalesAttr.value.every((saleItem) => {
      return item.name !== saleItem.saleAttrName
    })
  })
  return unSelectAttr
})
let addsaleattr = (item: SpuSaleAttr) => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  // 将baseSaleAttrId从字符串转换为数字类型，以满足接口要求
  SalesAttr.value.push({
    baseSaleAttrId: parseInt(baseSaleAttrId, 10),
    saleAttrName,
    spuSaleAttrValueList: [],
  })
  // 清除输入框内容
  saleAttrIdAndValueName.value = ''
}
const initaddspu = (c3id: number | string) => {
  Object.assign(Spuparams.value, {
    category3Id: '',
    description: '',
    spuImageList: [],
    spuName: '',
    spuSaleAttrList: [],
    tmId: '',
  })
  ImageList.value = []
  SalesAttr.value = []
  saleAttrIdAndValueName.value = ''
  Spuparams.value.category3Id = c3id

  reqAllTrademark().then((res: AllTradeMark) => {
    AllTradeMark.value = res.data
  })
  reqGetAllSaleAttr().then((res: AllSaleAttrResponseData) => {
    AllSaleAttr.value = res.data
  })
}
defineExpose({ initHasSpuData, initaddspu })
</script>

<style scoped lang="scss">
:deep(.el-textarea__inner) {
  border-radius: 15px;
}
.spuform {
  width: 100%;
}
.spu销售属性 {
  :deep(.el-form-item__content) {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 20px;
  }
  :deep(.el-scrollbar) {
    height: auto;
  }

  :deep(.el-tag) {
    margin: 0 5px;
    width: auto;
    height: 35px;
    font-size: 14px;
    border-radius: 5px;
  }
}
</style>
