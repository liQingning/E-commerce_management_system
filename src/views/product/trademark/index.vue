<template>
  <el-card class="box-card">
    <el-card class="box-card" style="width: 100%">
      <!-- 卡片顶部添加品怕按钮 -->
      <el-button
        icon="plus"
        style="width: 120px"
        type="primary"
        class="plusbutton"
        @click="addTrademark"
        v-permission="'btn.Trademark.add'"
      >
        添加品牌
      </el-button>
      <!-- 表格组件，用于展示平台数据 -->
      <el-table :data="tableData" border style="width: 100%; height: 100%">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        />
        <el-table-column label="品牌名称">
          <template #="{ row }">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column prop="logoUrl" label="品牌LOGO">
          <template #="{ row }">
            <img :src="row.logoUrl" alt="无图片" width="100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updataTrademark(row)"
              v-permission="'btn.Trademark.update'"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="你确定要删除该品牌吗"
              width="200px"
              @confirm="DeleteTrademark(row.id)"
            >
              <template #reference>
                <el-button
                  icon="Delete"
                  type="danger"
                  v-permission="'btn.Trademark.remove'"
                >
                  删除
                </el-button>
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
        @current-change="getHasTrademark()"
      />
    </el-card>
    <!-- 对话框组件 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      width="500"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formref"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            v-model="trademarkParams.tmName"
            autocomplete="off"
            placeholder="请您输入品牌名称"
          />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :headers="{
              Accept: 'application/json',
              token: GET_TOKEN(), // 确保这里返回有效的token
              // 注意：不要手动设置Content-Type，浏览器会自动设置multipart/form-data
            }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <template #footer>brand management</template>
  </el-card>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import {
  type TradeMark,
  type Records,
  type TradeMarkResponseData,
} from '@/api/product/trademark/type'
import type { ComponentSize } from 'element-plus'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import { GET_TOKEN } from '@/utils/token'

//当前页码
let currentPage = ref(1)
//每页条数
let pageSize = ref(3)
//分页大小
let size = ref<ComponentSize>('default')
let background = ref(true)
let disabled = ref(false)
let tableData = ref<Records>([])
let total = ref<number>(0)

const dialogFormVisible = ref<boolean>(false)

//收集的数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
let formref = ref()
const getHasTrademark = async () => {
  let result: TradeMarkResponseData = await reqHasTrademark(
    currentPage.value,
    pageSize.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    tableData.value = result.data.records
  }
}
onMounted(() => {
  getHasTrademark()
})
function handleSizeChange() {
  currentPage.value = 1
  getHasTrademark()
}
import { ElMessage, resultProps } from 'element-plus'
import type { UploadProps } from 'element-plus'
//
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  // 上传成功的响应数据
  response,
  // 上传的文件对象
  uploadFile,
) => {
  // 更新trademarkParams对象的logoUrl属性为响应数据中的data字段
  // 更新trademarkParams的logoUrl属性
  trademarkParams.logoUrl = response.data
  // 清除表单中logoUrl字段的验证状态
  formref.value.clearValidate('logoUrl')
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('图片格式必须是 JPG、PNG 或 GIF!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('图片大小不能超过 4MB!')
    return false
  }
  return true
}
const confirm = async () => {
  await formref.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    ElMessage.success(trademarkParams.id ? '修改成功' : '添加成功')
    dialogFormVisible.value = false
    getHasTrademark()
  } else {
    ElMessage.error(trademarkParams.id ? '修改失败' : '添加失败')
    dialogFormVisible.value = false
  }
}
const addTrademark = async () => {
  dialogFormVisible.value = true
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = undefined
  formref.value?.clearValidate('tmName')
  formref.value?.clearValidate('logoUrl')
}

const updataTrademark = (row: TradeMark) => {
  formref.value?.clearValidate('tmName')
  formref.value?.clearValidate('logoUrl')
  //row即为当前已有的品牌信息
  Object.assign(trademarkParams, row)
  dialogFormVisible.value = true
}
const validatorTmName = (rule: any, value: string, callback: Function) => {
  if (value.trim().length < 2 || value.trim().length > 10) {
    callback(new Error('长度在 2 到 10 个字符'))
  }
  return true
}

const rules = {
  tmName: [
    {
      required: true,
      message: '请输入品牌名称',
      trigger: 'blur',
      validator: validatorTmName,
    },
  ],
  logoUrl: [{ required: true, message: '请上传图片', trigger: 'change' }],
}
const DeleteTrademark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  console.log(result.code)
  if (result.code == 200) {
    ElMessage.success('删除成功')
    getHasTrademark()
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped lang="scss">
.box-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 15px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.box-card .el-card__body) {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
    background: #99383800;
  }
  .el-upload--picture-card {
    background: #ffffff;
  }
  .el-dialog {
    background: #ffffff;
  }
  .el-overlay {
    background: #00000063;
  }
  tr {
    font-style: 25px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
  }

  td {
    font-size: 20px;
    border-radius: none;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);

    button {
      font-size: 15px;
      width: 80px;
      height: 40px;
      border-radius: 15px;
    }
  }
  td:hover {
    background: #000;
  }
  table {
    border-radius: 15px;
  }
  colgroup {
    border-radius: 15px;
  }
}
:deep(.el-table__inner-wrapper) {
  background: #ffffff00;
  border-radius: 15px;
}
:deep(.el-table__body-wrapper) {
  background: #ffffffc8;
  border-radius: 15px;
}
:deep(.el-scrollbar) {
  border-radius: 15px;
  background: #ffffffd6;
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
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
:deep(.avatar-uploader .el-upload) {
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
:deep(.el-icon.avatar-uploader-icon:hover) {
  color: var(--el-color-primary);
}
</style>
