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
  username: string
  name: string
  password: string
}

export interface rolevalue extends ResponseData {
  current: number | string
  pages: number | string
  size: number | string
  records: record[]
  total: number | string
}

export interface addupdaterole {
  name: string
  password?: string
  username: string
  id?: number | string
}

export interface roleDate {
  id?: number | string
  roleName: string
  remark: string
  updateTime: string
  createTime: string
}
export type AllRole = roleDate[]
export interface AllRoleResponseDate extends ResponseData {
  data: {
    allRolesList: AllRole
    assignRoles: AllRole
  }
}
export interface DoAssignRole {
  roleIdList: number[]
  userId: number | string
}
