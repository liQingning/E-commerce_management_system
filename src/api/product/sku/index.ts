import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from './type'

enum API {
  SKU_URL = '/admin/product/list/',
  ONSALEE_URL = '/admin/product/onSale/',
  CANCLESALE_URL = '/admin/product/cancelSale/',
  DELETE_URL = '/admin/product/deleteSku/',
}

export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

export const reqOnSale = (id: number) =>
  request.get<any, any>(API.ONSALEE_URL + `${id}`)

export const reqCancelSale = (id: number) =>
  request.get<any, any>(API.CANCLESALE_URL + `${id}`)
export const reqDeleteSku = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + `${id}`)
