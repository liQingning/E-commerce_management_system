import request from '@/utils/request'
import type {
  loginFromData,
  loginResponseData,
  userInfoResponseData,
} from './type'
//定义请求的api接口地址
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USER_INFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

//登录接口
export const reqlogin = (data: loginFromData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息接口
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USER_INFO_URL)

//退出登录接口
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
