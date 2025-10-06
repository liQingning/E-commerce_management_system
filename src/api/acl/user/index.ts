import request from '@/utils/request'
import type {
  rolevalue,
  addupdaterole,
  AllRoleResponseDate,
  DoAssignRole,
} from './type'

enum API {
  GETROLE_URL = '/admin/acl/user/',
  ADDUSER_URL = '/admin/acl/user/save',
  UPDATE_URL = '/admin/acl/user/update',
  ASSIGN_URL = '/admin/acl/user/toAssign/',
  DOASSIGN_URL = '/admin/acl/user/doAssignRole',
  DELETE_URL = '/admin/acl/user/remove/',
  BATCHDELETE_URL = '/admin/acl/user/batchRemove',
}

export const reqRoleList = (page: number, limit: number) =>
  request.get<any, rolevalue>(API.GETROLE_URL + `${page}/${limit}`)

export const reqRole = (page: number, limit: number, username: string) =>
  request.get<any, rolevalue>(
    API.GETROLE_URL + `${page}/${limit}?username=${username}`,
  )

export const reqAddOrUpdateRole = (data: addupdaterole) => {
  if (data.id) return request.put(API.UPDATE_URL, data)
  else return request.post(API.ADDUSER_URL, data)
}

export const reqAssignRole = (adminId: number) =>
  request.get<any, AllRoleResponseDate>(API.ASSIGN_URL + adminId)

export const reqDoAssignRole = (data: DoAssignRole) =>
  request.post(API.DOASSIGN_URL, data)

export const reqDeleteRole = (id: number | string) =>
  request.delete<any, any>(API.DELETE_URL + id)

export const reqBatchDeleteRole = (ids: number[]) =>
  request.delete(API.BATCHDELETE_URL, { data: ids })
