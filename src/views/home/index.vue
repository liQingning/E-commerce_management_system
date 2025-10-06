<template>
  <el-card class="box-card">
    <el-card class="table-box">
      <img :src="userStore.avator" alt="" />
      <div class="text">
        <div>HI,{{ gettime() }}好{{ userStore.username }}</div>
        <div>硅谷甄选运营平台</div>
      </div>
    </el-card>
    <template #footer>home page</template>
  </el-card>
</template>

<script lang="ts" setup>
import useUserstore from '@/store/modules/user'
import { gettime } from '@/utils/time'
let userStore = useUserstore()
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
  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
.text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  div:nth-child(1) {
    margin: 30px 50px;
    font-size: 45px;
  }
  div:nth-child(2) {
    margin: 30px 50px;
    font-size: 25px;
    color: #8a8a8a;
    font-style: italic;
  }
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
    color: #252525;
    font-style: 25px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
  }

  td {
    height: 60px;
    color: #252525;
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
</style>
