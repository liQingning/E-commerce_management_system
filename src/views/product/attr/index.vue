<template>
  <el-card class="box-card">
    <Category :scene="scene"></Category>
    <el-card style="margin-top: 20px" class="form-box">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3id ? false : true"
          @click="addAttr()"
          v-permission="'btn.Attr.add'"
        >
          添加属性
        </el-button>
        <el-table style="margin-top: 10px" border :data="attrList">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="150px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <!-- row,已有的属性对象 -->
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
                v-permission="'btn.Attr.update'"
              >
                编辑
              </el-button>
              <el-popconfirm
                title="你确定要删除该属性吗"
                width="200px"
                @confirm="DeleteTrademark(row.id)"
              >
                <template #reference>
                  <el-button
                    icon="Delete"
                    type="danger"
                    v-permission="'btn.Attr.remove'"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称:">
            <el-input
              placeholder="请你输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
          @click="addAtrrValue"
          v-permission="'btn.Attr.add'"
        >
          添加属性
        </el-button>
        <el-button size="default" @click="cleanattrParams()">取消</el-button>
        <el-table
          border
          style="margin: 20px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80px"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input
                v-if="row.flag"
                ref="inputRef"
                @blur="tolook(row, $index)"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="tolookClick(row)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #default="{ $index, row }">
              <el-button
                icon="Delete"
                type="danger"
                @click="
                  (_event: Event) => attrParams.attrValueList.splice($index, 1)
                "
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save()"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
          v-permission="'btn.Attr.update'"
        >
          保存
        </el-button>
        <el-button size="default" @click="cancel()">取消</el-button>
      </div>
    </el-card>
    <template #footer>property management</template>
  </el-card>
</template>

<script lang="ts" setup>
import { watch, ref, onMounted, reactive, nextTick, onBeforeUnmount } from 'vue'
import {
  reqAttrList,
  reqAddOrUpdateAttr,
  reqDeleteAttr,
} from '@/api/product/attr'
import useCategoryStore from '@/store/modules/category'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()
let attrList = ref<Attr[]>([])
let scene = ref<number>(0)
let inputRef = ref<HTMLInputElement[]>([])
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryLevel: 3,
  categoryId: '',
})

const getAttr = async () => {
  if (categoryStore.c3id) {
    let result: AttrResponseData = await reqAttrList(
      categoryStore.c1id as number | string,
      categoryStore.c2id as number | string,
      categoryStore.c3id as number | string,
    )
    attrList.value = result.data
    console.log(attrList)
  }
}
onMounted(async () => {
  getAttr()
})
watch(
  () => categoryStore.c3id,
  async (newVal) => {
    if (newVal) {
      getAttr()
    } else {
      attrList.value = []
    }
  },
)

const addAttr = () => {
  Object.assign(attrParams, {
    attrName: '',
    categoryId: categoryStore.c3id as number | string,
    categoryLevel: 3,
    attrValueList: [],
  })
  scene.value = 1
  attrParams.categoryId = categoryStore.c3id as number | string
}
const cleanattrParams = () => {
  Object.assign(attrParams, {
    attrName: '',
    categoryId: categoryStore.c3id as number | string,
    categoryLevel: 3,
    attrValueList: [],
  })
}
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 深拷贝row数据到attrParams中
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
const DeleteTrademark = (id: number) => {
  reqDeleteAttr(id).then((res) => {
    if (res.code == 200) {
      ElMessage.success('删除成功')
      getAttr()
    } else {
      ElMessage.error('删除失败')
    }
  })
}
const cancel = () => {
  scene.value = 0
}
const addAtrrValue = async () => {
  attrParams.attrValueList.push({
    flag: true,
    valueName: '',
  })
  // 等待DOM更新后设置焦点
  await nextTick()
  const inputs = document.querySelectorAll('.el-input__inner')
  if (inputs.length > 0) {
    ;(inputs[inputs.length - 1] as HTMLInputElement).focus()
  }
}
const save = async () => {
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    ElMessage.success(attrParams.id ? '修改成功' : '添加成功')
    scene.value = 0
    getAttr()
  } else {
    ElMessage.error(attrParams.id ? '修改失败' : '添加失败')
  }
}
const tolook = (row: AttrValue, $index: number) => {
  // 判断属性值是否为空
  if (row.valueName.trim() == '') {
    attrParams.attrValueList.splice($index, 1)
    ElMessage.error('属性值不能为空')
    return
  }
  // 判断属性值是否重复
  let repeat = attrParams.attrValueList.find((item: AttrValue) => {
    if (item != row) {
      return item.valueName == row.valueName
    }
  })
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage.error('属性值不能重复')
    return
  }
  // 判断属性名是否为空
  if (attrParams.attrName.trim() == '') {
    ElMessage.error('属性名称不能为空')
    return
  }
  row.flag = false
}

const tolookClick = async (row: AttrValue) => {
  row.flag = true
  // 等待DOM更新后设置焦点
  await nextTick()
  const inputs = document.querySelectorAll('.el-input__inner')
  if (inputs.length > 0) {
    ;(inputs[inputs.length - 1] as HTMLInputElement).focus()
  }
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
    width: 120px;
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
    background: #f0555500;
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

:deep(.el-tag) {
  margin: 0 5px;
  width: auto;
  height: 35px;
  font-size: 14px;
  border-radius: 15px;
}
</style>
