import request from '@/utils/request'
import type {
  HasSpuResponseData,
  AllTradeMark,
  SpuImgList,
  SaleAttrResponseData,
  AllSaleAttrResponseData,
  SkuData,
  SkuInfoData,
} from '@/api/product/spu/type'
enum API {
  GET_SPU_URL = '/admin/product/',
  //获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //获取某个spu的图片列表
  IMAGE_URL = '/admin/product/spuImageList/',
  //获取某个spu的销售属性
  SALES_ATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取整个项目的销售属性
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  //新增
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  //更新
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  //追加新的sku信息
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //获取某个spu下全部售卖的商品信息
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //删除spu
  DELETESPU_URL = '/admin/product/deleteSpu/',
}

export const reqDeleteSpu = (spuId: number | string) => {
  return request.delete<any, any>(API.DELETESPU_URL + spuId)
}

export const reqGetSpuList = (
  page: number,
  pageSize: number,
  category3id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.GET_SPU_URL + `${page}/${pageSize}?category3Id=${category3id}`,
  )

export const reqAllTrademark = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)

export const reqGetSpuImageList = (spuId: number | string) =>
  request.get<any, SpuImgList>(API.IMAGE_URL + spuId)

export const reqGetSPuSaleAttr = (spuId: number | string) =>
  request.get<any, SaleAttrResponseData>(API.SALES_ATTR_URL + spuId)

export const reqGetAllSaleAttr = () =>
  request.get<any, AllSaleAttrResponseData>(API.ALLSALEATTR_URL)

//data即为新增的spu或者已有的spu对象
export const reqAddOrUpdataSpu = (data: any) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

export const reqGetSkuInfo = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)

export const reqDeleteSku = (spuId: number | string) =>
  request.delete<any, any>(API.DELETESPU_URL + spuId)
