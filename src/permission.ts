//路由鉴权，项目当中路由能不能访问的权限设置
import { router } from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
import useUserstore from './store/modules/user'
import pinia from './store'
import setting from './setting'
let userStore = useUserstore(pinia)

//全局守卫
//全局前置守卫
router.beforeEach(async (to, from, next) => {
  document.title = `${setting.title}-${to.meta.title}` //设置网页标题

  //to将要访问的路由信息
  //from当前路由信息
  //next放行函数
  nprogress.start() //开始进度条
  let token = userStore.token
  let username = userStore.username
  if (token) {
    if (to.path == '/login') {
      //需要鉴权
      next({ path: '/' }) //重定向到登录页面
    } else {
      if (username) {
        next()
      } else {
        try {
          await userStore.userInfo()
          next({ ...to })
        } catch (err) {
          userStore.userlogout()
          next({ path: '/login', query: { redirect: to.path } }) //重定向到登录页面
        }
      }
    }
  } else {
    if (to.path == '/login') {
      //需要鉴权
      next() //放行
    } else {
      next({ path: '/login', query: { redirect: to.path } }) //重定向到登录页面
    }
  }
})
//全局后置守卫
router.afterEach((to, from) => {
  nprogress.done() //结束进度条

  //to将要访问的路由信息
  //from当前路由信息
})
