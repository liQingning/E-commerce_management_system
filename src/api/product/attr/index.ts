import request from '@/utils/request'
import type { CategoryResponse, AttrResponseData } from './type'

enum API {
  C1_URL = '/admin/product/getCategory1',
  C2_URL = '/admin/product/getCategory2/',
  C3_URL = '/admin/product/getCategory3/',
  GET_ATTR_URL = '/admin/product/attrInfoList/',
  DELETE_ATTR = '/admin/product/deleteAttr/',
  ADD_ATTR = '/admin/product/saveAttrInfo',
}

export const reqC1 = () => request.get<any, CategoryResponse>(API.C1_URL)
export const reqC2 = (category1id: number) =>
  request.get<any, CategoryResponse>(API.C2_URL + category1id)
export const reqC3 = (category2id: number) =>
  request.get<any, CategoryResponse>(API.C3_URL + category2id)

export const reqAttrList = (
  category1id: number | string,
  category2id: number | string,
  category3id: number | string,
) =>
  request.get<any, AttrResponseData>(
    API.GET_ATTR_URL + category1id + '/' + category2id + '/' + category3id,
  )

export const reqDeleteAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETE_ATTR + attrId)
export const reqAddOrUpdateAttr = (data: any) =>
  request.post<any, any>(API.ADD_ATTR, data)
