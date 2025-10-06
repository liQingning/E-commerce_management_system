<template>
  <el-card class="box-card">
    <el-card class="table-box">
      <el-table :data="PermissionArr" border style="width: 100%" row-key="id">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="code" label="权限值"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column label="操作" width="350px">
          <template #="{ row, $index }">
            <el-button
              @click="addClick(row)"
              type="primary"
              icon="user"
              :disabled="row.level == 4 ? true : false"
              v-permission="'btn.Permission.add'"
            >
              {{ row.level == 3 ? '添加功能' : '添加菜单' }}
            </el-button>
            <el-button
              @click="editClick(row)"
              type="primary"
              icon="edit"
              :disabled="row.level == 1 ? true : false"
              v-permission="'btn.Permission.update'"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.name}吗?`"
              @confirm="deleteClick(row)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  icon="delete"
                  :disabled="row.level == 1 ? true : false"
                  v-permission="'btn.Permission.remove'"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <template #footer>permission management</template>

    <el-dialog v-model="dialog">
      <template #header>
        <h2>
          {{
            MenuData.id
              ? '更新菜单'
              : MenuData.level !== 3
                ? '添加功能'
                : '添加菜单'
          }}
        </h2>
      </template>
      <template #default>
        <el-form
          label-width="100px"
          style="width: 500px"
          class="drawer-form"
          :model="MenuData"
          ref="ruleFormRef"
        >
          <el-form-item label="名称:" prop="roleName">
            <el-input
              v-model="MenuData.name"
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限值:" prop="roleName">
            <el-input
              v-model="MenuData.code"
              placeholder="请输入权限值"
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
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  reqAllPermission,
  reqAddOrUpdatePermission,
  reqDeletePermission,
} from '@/api/acl/permission'
import {
  type children,
  type PermissionResponseData,
  type permission,
  type Menuparams,
} from '@/api/acl/permission/type'
import { ElMessage } from 'element-plus'

let dialog = ref(false)
let PermissionArr = ref<children>([])
let MenuData = ref<Menuparams>({
  code: '',
  level: '',
  name: '',
  pid: '',
})

const deleteClick = (row: permission) => {
  reqDeletePermission(row.id as number).then((res) => {
    if (res.code === 200) {
      ElMessage.success('删除成功')
      GetPermission()
    } else {
      ElMessage.error(res.message)
    }
  })
}
const cancelClick = () => {
  dialog.value = false
}
const confirmClick = () => {
  reqAddOrUpdatePermission(MenuData.value).then((res) => {
    if (res.code === 200) {
      dialog.value = false
      ElMessage.success(MenuData.value.id ? '更新成功' : '添加成功')
      GetPermission()
    } else {
      ElMessage.error(res.message)
    }
  })
}
const editClick = (row: permission) => {
  dialog.value = true
  Object.assign(MenuData.value, row)
}
const addClick = (row: permission) => {
  Object.assign(MenuData.value, {
    code: '',
    level: '',
    name: '',
    pid: '',
  })
  dialog.value = true
  MenuData.value.level = (row.level as number) + 1
  MenuData.value.pid = row.id as number
}
const GetPermission = async () => {
  let result: PermissionResponseData = await reqAllPermission()
  if (result.code === 200) {
    PermissionArr.value = result.data
  }
}

onMounted(() => {
  GetPermission()
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

.table-box {
  border-radius: 15px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.table-box .el-card__body) {
  height: 100%;
  border-radius: 1px;
  display: flex;
  flex-direction: row;
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
    background: #f51b1b00;
  }
  tr {
    font-style: 25px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
  }

  td {
    height: 60px;

    font-size: 20px;
    border-radius: none;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);

    button {
      font-size: 15px;
      width: auto;
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
:deep(.el-input) {
  .el-input__wrapper {
    border-radius: 15px;
  }
}
</style>
