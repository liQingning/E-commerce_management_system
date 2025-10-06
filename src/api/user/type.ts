//定义用户相关数据的ts类型
export interface loginFromData {
  username: string
  password: string
}

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface loginResponseData extends ResponseData {
  data: string
}

//服务器返回用户信息相关的数据类型

export interface userInfoResponseData extends ResponseData {
  data: {
    name: string
    avatar: string
    roles: Array<string> //角色数组
    buttons: Array<string> //按钮权限数组
    routes: Array<string> //路由权限数组
  }
}
