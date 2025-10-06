export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface permission {
  ID?: number | string
  children?: children
  code: string
  createTime: string
  id?: number | string
  level: number | string
  name: string
  pid: number | string
  select: boolean
  status: string
  toCode: string
  type: number | string
  updateTime: string
}

export type children = permission[]

export interface PermissionResponseData extends ResponseData {
  data: permission[]
}

export interface Menuparams {
  code: string
  type?: number | string
  level: number | string
  name: string
  pid: number | string
  id?: number | string
}
