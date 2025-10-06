<template>
  <div class="login_container">
    <el-row>
      <el-col :span="24" :xs="24">
        <h1 class="title">硅谷甄选</h1>
        <div class="login_box">
          <div class="square" style="--i: 0"></div>
          <div class="square" style="--i: 1"></div>
          <div class="square" style="--i: 2"></div>
          <div class="square" style="--i: 3"></div>
          <div class="square" style="--i: 4"></div>

          <div class="from">
            <el-form :model="loginForm" :rules="rules" ref="loginforms">
              <h3>登&nbsp录</h3>
              <p>用户名</p>
              <el-form-item prop="username">
                <el-input
                  placeholder="请输入用户名"
                  v-model="loginForm.username"
                  :prefix-icon="User"
                />
              </el-form-item>
              <p>密码</p>
              <el-form-item prop="password">
                <el-input
                  placeholder="请输入密码"
                  v-model="loginForm.password"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
            </el-form>
          </div>

          <div class="login-btn" @click="login">
            <a href="#/login">登&nbsp&nbsp&nbsp录</a>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import { gettime } from '@/utils/time'

let useStore = useUserStore()
let loginForm = reactive({
  username: 'admin',
  password: '111111',
})
let $router = useRouter()
let $route = useRoute()
let loginforms = ref()

const validatorUserName = (rule: any, value: string, callback: Function) => {
  //rule:校验规则，value：表单值，callback：回调函数

  if (value.length < 3) {
    callback(new Error('用户名至少为三个字符'))
  } else if (!/^[a-zA-Z0-9_-]{3,}$/.test(value)) {
    callback(new Error('用户名格式不正确'))
  } else {
    callback()
  }
}
const validatorPassWord = (rule: any, value: string, callback: Function) => {
  //rule:校验规则，value：表单值，callback：回调函数

  if (value.length < 6) {
    callback(new Error('密码至少为六个字符'))
  } else if (!/^[A-Za-z\d!@#$%^&*_.-]{6,16}$/.test(value)) {
    callback(new Error('用户名格式不正确'))
  } else {
    callback()
  }
}
const rules = {
  //required: 是否必填，message：提示信息，trigger：触发方式（blur失焦）
  //min:最小长度，max：最大长度
  //space:是否包含空格，pattern：正则表达式验证

  username: [
    {
      validator: validatorUserName,
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: validatorPassWord,
      trigger: 'blur',
    },
  ],
}

async function login() {
  await loginforms.value.validate()

  try {
    let redirect: any = $route.query.redirect

    await useStore.setUserInfo(loginForm)

    $router.push({ path: redirect || '/' })
    //提示
    ElNotification({
      title: '登录成功',
      message: `HI,${gettime()}好`,
      type: 'success',
    })
  } catch (error) {
    ElNotification({
      message: (error as Error).message,
      type: 'error',
    })
  } finally {
    // 登录成功后，重置表单数据
    loginForm.username = ''
    loginForm.password = ''
  }
}
</script>

<style scoped lang="scss">
svg {
  color: #252525;
}
body,
html {
  overflow: hidden;
}
.login_container {
  width: 100%;
  height: 100vh;
  font-size: 30px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  /* border:1px solid red ; */
}

.from {
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  width: 350px;
  height: 330px;
  padding: 50px;
  border-radius: 17px;
  position: relative;
  .el-form {
    width: 100%;
    height: 100%;
    p {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 10px;
      color: #252525;
    }
  }
  z-index: 10;
}
:deep(.el-input__wrapper) {
  width: 100%;
  height: 30px;
  border: none;
  outline: none;
  padding: 10px 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 35px;
  background-color: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
}
:deep(.el-input__wrapper ::placeholder) {
  color: #2525259d;
}
:deep(.el-input__inner) {
  font-size: 20px;
  letter-spacing: normal;

  color: #2525259d;
}
:deep(.el-input__prefix) {
  color: #252525;
  font-size: 20px;
}
:deep(.el-input__password) {
  font-size: 20px;
}
:deep(.el-input__suffix .el-icon svg) {
  color: #252525;
}

.title {
  display: flex;
  margin-top: -100px;
  justify-content: center;
  text-align: center;
  color: #252525;
}
h3 {
  font-size: 2rem;
  color: #252525;
  margin-top: 0px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-top: 10px;
  padding-bottom: 20px;
}
h3::after {
  content: '';
  position: relative;
  width: 80px;
  height: 4px;
  left: 0;
  bottom: -10px;
  background-color: #252525;
  display: block;
}
.login-btn {
  position: absolute;
  width: 50%;
  height: 50px;
  z-index: 100;
  left: 25%;
  top: 77%;
}
.login-btn a {
  top: 0;
  left: 0;
  position: absolute;
  margin-top: 20px;
  width: 100%;
  height: 100%;
  background-color: var(--base-glass-bgcolor);
  color: #252525 !important; /* 文字颜色 */
  font-size: 23px;
  font-weight: 700;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 35px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: 0.5s;
  backdrop-filter: $base-backdrop-filter;
  z-index: 100;
}
.login-btn:hover a {
  letter-spacing: 3px;
}
.login-btn a::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.15), transparent);
  transform: skewX(45deg) translateX(0);
  transition: 0.5s;
}

.login-btn:hover a::before {
  transform: skewX(45deg) translateX(200%);
}
.login-btn::before {
  content: '';
  position: absolute;
  bottom: -53%;
  left: 50%;
  width: 50px;
  height: 10px;
  transform: translateX(-50%);
  transition: 0.5s;
  border-radius: 10px;
  transition-delay: 0ms;
  z-index: 12;
}
.login-btn:hover::before {
  bottom: 0;
  height: 50%;
  width: 80%;
  border-radius: 30px;
}
.login-btn::after {
  content: '';
  position: absolute;
  bottom: 50%;
  left: 50%;
  width: 50px;
  height: 10px;
  transform: translateX(-50%);
  transition: 0.5s;
  border-radius: 10px;
  transition-delay: 0ms;
}
.login-btn:hover::after {
  bottom: -30%;
  height: 50%;
  width: 80%;
  border-radius: 30px;
}
.login-btn::before,
.login-btn::after {
  background: #f5f5f5;
  box-shadow:
    #f5f5f5 0px 0px 5px,
    #f5f5f5 0px 0px 15px,
    #f5f5f5 0px 0px 30px,
    #f5f5f5 0px 0px 60px;
}

.from {
  position: relative;
  z-index: 20;
}
.login_box .square {
  position: absolute;

  border-radius: 10px;
  background: var(--base-glass-bgcolor);
  backdrop-filter: $base-backdrop-filter;
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10;
  animation: animate 10s linear infinite;
  animation-delay: calc(-1s * var(--i));
}
@keyframes animate {
  0%,
  100% {
    transform: translateY(-40px);
  }
  50% {
    transform: translateY(40px);
  }
}
.square:nth-child(1) {
  top: -50px;
  right: -60px;
  width: 100px;
  height: 100px;
  z-index: 10;
}
.square:nth-child(2) {
  top: 150px;
  left: -100px;
  width: 120px;
  height: 120px;
  z-index: 21;
}
.square:nth-child(3) {
  bottom: 50px;
  right: -60px;
  width: 80px;
  height: 80px;
  z-index: 22;
}
.square:nth-child(4) {
  bottom: -80px;
  left: 100px;
  width: 50px;
  height: 50px;
}
.square:nth-child(5) {
  top: -30px;
  left: 140px;
  width: 60px;
  height: 60px;
}

/* el-row{
  margin-top: 200px;
  text-align: center;
} */
</style>
