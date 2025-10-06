<template>
  <el-card class="box-card">
    <el-card class="form-box">
      <el-form class="form">
        <el-form-item label="角色名称:">
          <el-input v-model="inputname" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="Getrole"
            :disabled="inputname == '' ? true : false"
          >
            搜索
          </el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-box">
      <el-button
        icon="plus"
        type="primary"
        style="width: 100px"
        @click="adduser"
        v-permission="'btn.Role.add'"
      >
        添加角色
      </el-button>

      <el-table
        @selection-change="selectchange"
        border
        :data="rolelist"
        style="margin-top: 20px"
      >
        <el-table-column
          align="center"
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime"></el-table-column>
        <el-table-column label="操作" width="350px" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              style="width: auto"
              icon="user"
              @click="assign(row)"
              v-permission="'btn.Role.assgin'"
            >
              分配权限
            </el-button>
            <el-button
              type="primary"
              style="width: auto"
              icon="edit"
              @click="updateuser(row)"
              v-permission="'btn.Role.update'"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.roleName}吗?`"
              @confirm="Delete(row)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  style="width: auto"
                  icon="delete"
                  v-permission="'btn.Role.remove'"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 7, 9, 11]"
        :size="size"
        :disabled="disabled"
        :background="background"
        layout=" prev, pager, next, jumper,->,total, sizes,"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="getHasSpu"
        style="margin-top: 20px"
      />
    </el-card>
    <template #footer>role management</template>

    <el-dialog v-model="drawer">
      <template #header>
        <h2>{{ saverole.id ? '更新角色' : '添加用户' }}</h2>
      </template>
      <template #default>
        <el-form
          label-width="100px"
          style="width: 300px"
          class="drawer-form"
          :model="saverole"
          :rules="rules"
          ref="ruleFormRef"
        >
          <el-form-item label="角色名称:" prop="roleName">
            <el-input
              v-model="saverole.roleName"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick" style="border-radius: 15px">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="confirmClick"
            style="border-radius: 15px"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer2">
      <template #header>
        <h2>分配菜单与按钮权限</h2>
      </template>
      <template #default>
        <el-tree
          style="max-width: 600px"
          :data="allmenu"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectArr"
          :props="defaultProps"
          ref="treeRef"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button style="border-radius: 15px" @click="cancelClick">
            取消
          </el-button>
          <el-button
            style="border-radius: 15px"
            type="primary"
            @click="doAssignRole"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import {
  reqgetrole,
  reqgetroleList,
  reqaddrole,
  reqUpdaterole,
  reqgetpermissionByRoleId,
  reqDoAssignPermission,
  reqDeleteRole,
} from '@/api/acl/role'
import type { record, Allpermissionvalue, children } from '@/api/acl/role/type'

import { ElMessage } from 'element-plus'
import useUserstore from '@/store/modules/user'

//当前页码
let currentPage = ref(1)
//每页条数
let pageSize = ref(5)
//分页大小
let size = ref('default')
let background = ref(true)
let disabled = ref(false)
let total = ref<number>(0)

let rolelist = ref<record[]>([])

let inputname = ref<string>('')

let drawer = ref(false)
let drawer2 = ref(false)
let ruleFormRef = ref<any>()

let saverole = ref<record>({
  ID: 0,
  id: 0,
  createTime: '',
  roleName: '',
  updateTime: '',
  remark: '',
})

let allmenu = ref<children>([])
let rolemenu = ref<children>([])

const checkAll = ref(false)
const isIndeterminate = ref(true)

const multipleSelection = ref<record[]>([])

const defaultProps = {
  children: 'children',
  label: 'name',
}

let selectArr = ref([])

let treeRef = ref<any>()

const selectchange = (val: record[]) => {
  multipleSelection.value = val
}

const Delete = (row: record) => {
  reqDeleteRole(row.id as number).then((res: any) => {
    if (res.code !== 200) return ElMessage.error(res.message)
    ElMessage.success('删除成功')
    getHasSpu(currentPage.value)
  })
}

const doAssignRole = () => {
  console.log(useUserstore())
  const roleId = saverole.value.id as number
  let arr = treeRef.value.getCheckedKeys() as number[]
  let arr1 = treeRef.value.getHalfCheckedKeys() as number[]
  let permissionId = arr.concat(arr1) as number[]
  reqDoAssignPermission(roleId, permissionId).then((res: any) => {
    if (res.code !== 200) return ElMessage.error(res.message)

    getHasSpu(currentPage.value)
    drawer2.value = false
    ElMessage.success('分配成功')
    if (useUserstore().roles.some((role) => role === saverole.value.roleName)) {
      window.location.reload()
    }
  })
}

const assign = (row: record) => {
  drawer2.value = true
  Object.assign(saverole.value, row)
  reqgetpermissionByRoleId(saverole.value.id as number).then(
    (res: Allpermissionvalue) => {
      if (res.code !== 200) return ElMessage.error(res.message)

      rolemenu.value = res.data
      allmenu.value = res.data
      selectArr.value = filterSelectArr(allmenu.value, [])
    },
  )
}

const filterSelectArr = (allData: any, initarr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initarr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initarr)
    }
  })
  return initarr
}

const rules = ref<any>({
  roleName: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule: any, value: any) => {
        if (value === '') {
          return new Error('请输入用户名称')
        } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
          return new Error('用户名只能包含汉字、字母和数字')
        }
        return true
      },
    },
  ],
})

onMounted(() => {
  getHasSpu()
})

const confirmClick = () => {
  ruleFormRef.value.validate((valid: boolean) => {
    if (valid) {
      confirm()
    } else {
      return false
    }
  })
}
const confirm = () => {
  if (saverole.value.id) {
    let updatepost = {
      role_id: saverole.value.ID,
      roleName: saverole.value.roleName,
      remark: saverole.value.remark,
    }

    reqUpdaterole(updatepost).then((res: any) => {
      if (res.code == 200) {
        ElMessage.success('修改成功')
        getHasSpu(currentPage.value)
      } else {
        ElMessage.error('修改失败')
      }
    })
  } else {
    reqaddrole(saverole.value).then((res: any) => {
      if (res.code == 200) {
        ElMessage.success('添加成功')
        getHasSpu(Math.ceil(total.value / pageSize.value))
      } else {
        ElMessage.error('添加失败')
      }
    })
  }
  drawer.value = false
}
const cancelClick = () => {
  drawer.value = false
  drawer2.value = false
}

const adduser = () => {
  Object.assign(saverole.value, { roleName: '', remark: '', id: 0 })
  drawer.value = true
}
const updateuser = (row: record) => {
  Object.assign(saverole.value, row)

  drawer.value = true
  nextTick(() => {
    ruleFormRef.value.clearValidate('username')
    ruleFormRef.value.clearValidate('password')
    ruleFormRef.value.clearValidate('name')
  })
}
function Getrole() {
  reqgetrole(currentPage.value, pageSize.value, inputname.value).then(
    (res: any) => {
      if (res.code == 200 && res.data.records[0] != null) {
        rolelist.value = res.data.records
        total.value = res.data.total
        ElMessage.success('查询成功')
      } else {
        ElMessage.error('查询失败')
        inputname.value = ''
        getHasSpu()
      }
    },
  )
}
function reset() {
  inputname.value = ''
  getHasSpu()
}

function getHasSpu(pager = 1) {
  currentPage.value = pager
  reqgetroleList(currentPage.value, pageSize.value).then((res: any) => {
    if (res.code == 200) {
      rolelist.value = res.data.records
      total.value = res.data.total
    }
  })
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getHasSpu(currentPage.value)
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
  width: 100%;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.table-box {
  border-radius: 15px;
  margin-top: 20px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.table-box .el-card__body) {
  height: 100%;
  border-radius: 15px;
  button {
    width: auto;
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
    background: #ffffff00;
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
:deep(.form-box .el-card__body) {
  height: 100%;
  border-radius: 15px;
  button {
    width: auto;
    border-radius: 15px;
  }
  div {
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
    margin: 0px 5px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
}

.drawer-form {
  :deep(.el-input__wrapper) {
    border-radius: 15px;
  }
}
:deep(.el-drawer) {
  header {
    margin-bottom: 0px;
  }
}
</style>
