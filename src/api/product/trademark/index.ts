import request from '@/utils/request'
import type { TradeMarkResponseData, TradeMark } from './type'
enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  //添加品牌
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  //删除品牌
  DELETETRADEMARK_URL = '/admin/product/baseTrademark/remove',
  //修改品牌
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
}

export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

export const reqDeleteTrademark = (id: number) => {
  return request.delete<any, any>(API.DELETETRADEMARK_URL + `/${id}`)
}
