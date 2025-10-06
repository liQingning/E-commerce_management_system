export interface ResponseData {
  code: number
  ok: boolean
  message: string
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
  isSale: number | string
}

export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    current: number
    size: number
    orders?: []
    pages: number
  }
}

export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
