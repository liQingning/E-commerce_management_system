import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import 'virtual:svg-icons-register'
import 'normalize.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/dark-mode.scss'

import allglobalcomponents from '@/components'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import '@/styles/index.scss' //全局样式
import { router } from '@/router'
import pinia from '@/store'
import LiquidGlass from '@wxperia/liquid-glass-vue'
import './permission'
// 引入权限指令
import setupPermissionDirective from './directives/permission'

const app = createApp(App)
// 注册权限指令
setupPermissionDirective(app)
app.use(LiquidGlass)
app.use(ElementPlus, {
  locale: zhCn, //设置语言为中文
})

app.use(allglobalcomponents)
app.use(pinia)
app.use(router)
app.mount('#app')
