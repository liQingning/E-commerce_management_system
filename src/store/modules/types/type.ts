import type { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/attr/type'

export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avator: string
  roles: string[]
  buttons: string[]
}

export interface CategoryState {
  c1Arr: CategoryObj[]
  c1id: string | number // 分类1的ID
  c2Arr: CategoryObj[] // 分类2的数组
  c2id: string | number // 分类2的ID
  c3Arr: CategoryObj[] // 分类3的数组
  c3id: string | number // 分类3的ID
}
