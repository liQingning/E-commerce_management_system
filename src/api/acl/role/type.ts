export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface record {
  ID: number | string
  id: number | string
  createTime: string
  roleName: string
  updateTime: string
  remark: string
}

export interface rolevalue extends ResponseData {
  current: number | string
  pages: number | string
  size: number | string
  records: record[]
  total: number | string
  searchCount: boolean
}

export interface addrole {
  remark: string
  roleName: string
  role_id?: number | string
}

export interface updaterole {
  remark: string
  roleName: string
  role_id: number | string
}

export type children = permission[]

export interface permission {
  ID: number | string
  children: children
  code: string
  createTime: string
  id: number | string
  level: number | string
  name: string
  pid: number | string
  select: boolean
  status: string
  toCode: string
  type: number | string
  updateTime: string
}

export interface Allpermissionvalue extends ResponseData {
  data: permission[]
}

export interface updatepermisson {
  code: string
  id: number | string
  level: number | string
  name: string
  pid: number | string
}
