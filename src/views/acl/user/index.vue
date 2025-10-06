<template>
  <el-card class="box-card">
    <el-card class="form-box">
      <el-form class="form">
        <el-form-item label="用户名称:">
          <el-input v-model="inputname" placeholder="请输入用户名称"></el-input>
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
        v-permission="'btn.User.add'"
      >
        添加用户
      </el-button>
      <el-popconfirm title="你确定要批量删除吗?" @confirm="DeleteAll">
        <template #reference>
          <el-button
            icon="delete"
            type="danger"
            style="width: 100px"
            :disabled="multipleSelection.length ? false : true"
            v-permission="'btn.User.remove'"
          >
            批量删除
          </el-button>
        </template>
      </el-popconfirm>

      <el-table
        @selection-change="selectchange"
        border
        :data="rolelist"
        style="margin-top: 20px"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          align="center"
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="用户姓名" prop="name"></el-table-column>
        <el-table-column label="用户名称" prop="username"></el-table-column>
        <el-table-column label="用户角色" prop="roleName"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime"></el-table-column>
        <el-table-column label="操作" width="350px" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              style="width: auto"
              icon="user"
              @click="assign(row)"
              v-permission="'btn.User.assgin'"
            >
              分配角色
            </el-button>
            <el-button
              type="primary"
              style="width: auto"
              icon="edit"
              @click="updateuser(row)"
              v-permission="'btn.User.update'"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.username}吗?`"
              @confirm="Delete(row)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  style="width: auto"
                  icon="delete"
                  v-permission="'btn.User.remove'"
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
    <template #footer>user management</template>

    <el-drawer v-model="drawer">
      <template #header>
        <h2>{{ saverole.id ? '更新用户' : '添加用户' }}</h2>
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
          <el-form-item label="用户姓名:" prop="name">
            <el-input
              v-model="saverole.name"
              placeholder="请输入用户姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户名称:" prop="username">
            <el-input
              v-model="saverole.username"
              placeholder="请输入用户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码:" prop="password" v-if="!saverole.id">
            <el-input
              v-model="saverole.password"
              placeholder="请输入用户密码"
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
    </el-drawer>
    <el-drawer v-model="drawer2">
      <template #header>
        <h2>分配角色</h2>
      </template>
      <template #default>
        <el-form label-width="100px" style="width: 300px" class="drawer-form">
          <el-form-item label="用户名称:">
            <el-input v-model="saverole.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="分配角色:">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="userrole"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(role, index) in allrole"
                :key="index"
                :label="role"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
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
  reqRoleList,
  reqRole,
  reqDoAssignRole,
  reqAddOrUpdateRole,
  reqAssignRole,
  reqDeleteRole,
  reqBatchDeleteRole,
} from '@/api/acl/user'
import type { record, AllRoleResponseDate, AllRole } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import useUserstore from '@/store/modules/user'
import type { CheckboxValueType } from 'element-plus'
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
  username: '',
  name: '',
  password: '',
})

let allrole = ref<AllRole>([])
let userrole = ref<AllRole>([])

const checkAll = ref(false)
const isIndeterminate = ref(true)

const multipleSelection = ref<record[]>([])

const selectchange = (val: record[]) => {
  multipleSelection.value = val
}
const DeleteAll = () => {
  let ids: any = multipleSelection.value.map((item) => item.id as number)
  console.log(ids)
  reqBatchDeleteRole(ids).then((res: any) => {
    if (res.code !== 200) return ElMessage.error(res.message)
    ElMessage.success('删除成功')
    getHasSpu(currentPage.value)
  })
}

const Delete = (row: record) => {
  reqDeleteRole(row.id as number).then((res: any) => {
    if (res.code !== 200) return ElMessage.error(res.message)
    ElMessage.success('删除成功')
    getHasSpu(currentPage.value)
  })
}

const doAssignRole = () => {
  reqDoAssignRole({
    userId: saverole.value.id as number,
    roleIdList: userrole.value.map((item) => item.id as number),
  }).then((res: any) => {
    if (res.code !== 200) return ElMessage.error(res.message)
    ElMessage.success('分配角色成功')
    drawer2.value = false
    getHasSpu(currentPage.value)
  })
}

const handleCheckAllChange = (val: boolean) => {
  userrole.value = val ? allrole.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allrole.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allrole.value.length
}
const assign = (row: record) => {
  Object.assign(saverole.value, row)
  reqAssignRole(saverole.value.id as number).then(
    (res: AllRoleResponseDate) => {
      if (res.code !== 200) return ElMessage.error(res.message)
      userrole.value = res.data.assignRoles
      allrole.value = res.data.allRolesList.map((item) => item)
      drawer2.value = true
    },
  )
}

const rules = ref<any>({
  name: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule: any, value: any) => {
        if (value === '') {
          return new Error('请输入用户姓名')
        } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
          return new Error('用户名只能包含汉字、字母和数字')
        } else if (value.length < 3 || value.length > 10) {
          return new Error('用户名长度在3到10之间')
        }
        return true
      },
    },
  ],
  username: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule: any, value: any) => {
        if (value === '') {
          return new Error('请输入用户名称')
        } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
          return new Error('用户名只能包含汉字、字母和数字')
        } else if (value.length < 3 || value.length > 10) {
          return new Error('用户名长度在3到10之间')
        }
        return true
      },
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule: any, value: any) => {
        if (value === '') {
          return new Error('请输入用户密码')
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
          return new Error('用户名只能包含字母和数字')
        } else if (value.length < 6 || value.length > 10) {
          return new Error('用户密码长度在6到10之间')
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
    reqAddOrUpdateRole(saverole.value).then((res: any) => {
      if (res.code == 200) {
        ElMessage.success('修改成功')
        if (useUserstore().username == saverole.value.username) {
          window.location.reload()
        }
        getHasSpu(currentPage.value)
      } else {
        ElMessage.error('修改失败')
      }
    })
  } else {
    reqAddOrUpdateRole(saverole.value).then((res: any) => {
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
}

const adduser = () => {
  Object.assign(saverole.value, { name: '', password: '', username: '', id: 0 })
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
  reqRole(currentPage.value, pageSize.value, inputname.value).then(
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
  reqRoleList(currentPage.value, pageSize.value).then((res: any) => {
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
