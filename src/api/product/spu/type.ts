//服务器全部接口返回数据类型
export interface ResponseData {
  code: number
  data?: any //数据
  message: string
  ok: boolean
}
//spu数据类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number | string
  tmId: number | string
  spuSaleAttrList: null | SpuSaleAttr[]
  spuImageList: null | SpuImg[]
}
//数组：元素都是已有SPU数据类型
export type Records = SpuData[]
//定义获取已有的spu接口返回的数据类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
//品牌数据
export interface TrademarkData {
  id: number
  tmName: string
  logoUrl: string
}

export interface AllTradeMark extends ResponseData {
  data: TrademarkData[]
}

//商品图片类型
export interface SpuImg {
  id?: number
  imgName?: string
  imgUrl?: string
  spuId?: number
  name?: string
  url?: string
}
//已有的spu的照片墙数据的类型
export interface SpuImgList extends ResponseData {
  data: SpuImg[]
}

export interface SpuSaleAttrValue {
  id?: number
  ID?: number
  spuId?: number
  baseSaleAttrId?: number
  saleAttrValueName: string
  createTime?: string
  updateTime?: string
}

export type spuSaleAttrValueList = SpuSaleAttrValue[]

export interface SpuSaleAttr {
  id?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: spuSaleAttrValueList
  spuId?: number
  flag?: boolean
}

export interface SaleAttrResponseData extends ResponseData {
  data: SpuSaleAttr[]
}

export interface AllSaleAttrvalue {
  id: number
  ID: number
  createTime: string
  updateTime: string
  name: string
}
export interface AllSaleAttrResponseData extends ResponseData {
  data: AllSaleAttrvalue[]
}

export interface Attr {
  attrId: number | string
  valueId: number | string
}
export interface SaleAttr {
  saleAttrId: number | string
  saleAttrValueId: number | string
}
export interface SkuData {
  id?: number
  spuId: number | string
  price: number | string
  skuName: string
  skuDesc: string
  weight: number | string
  tmId: number | string
  category3Id: number | string
  skuDefaultImg: string
  skuSaleAttrValueList?: SaleAttr[]
  skuAttrValueList?: Attr[]
}

export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
