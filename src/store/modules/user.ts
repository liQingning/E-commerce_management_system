//用户相关小仓库
import { defineStore } from 'pinia'
import { reqlogin, reqUserInfo, reqLogout } from '@/api/user'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import type {
  loginFromData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
//引入路由模块常量文件，用于初始化菜单数据
import { constantroute, asyncRoute, anyRoute } from '@/router/routes'
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
import { router } from '@/router'
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoutes: any[], Routes: string[]) {
  return asyncRoutes.filter((item: any) => {
    if (Routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, Routes)
      }
      return true
    }
  })
}

let useUserstore = defineStore('User', {
  state: (): UserState => ({
    token: GET_TOKEN() || '',
    menuRoutes: constantroute, //初始化菜单数据，暂时写死，后续改成动态获取
    username: '',
    avator: '',
    roles: [],
    buttons: [], //按钮权限数组，暂时不使用
  }),
  getters: {
    //计算属性
  },
  actions: {
    //方法集合
    async setUserInfo(newinfo: loginFromData) {
      let result: loginResponseData = await reqlogin(newinfo)

      if (result.code == 200) {
        this.token = result.data as string
        SET_TOKEN(result.data as string)
        return '登录成功'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    async userInfo() {
      let result: userInfoResponseData = await reqUserInfo()
      if (result.code == 200) {
        this.username = result.data.name
        this.avator = result.data.avatar
        this.roles = result.data.roles
        this.buttons = result.data.buttons
        let useAsyncroute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )
        this.menuRoutes = [...constantroute, ...useAsyncroute, ...anyRoute]
        ;[...useAsyncroute, ...anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })

        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    async userlogout() {
      let result: any = await reqLogout()
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avator = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
})
export default useUserstore
