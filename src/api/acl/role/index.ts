import request from '@/utils/request'
import type {
  addrole,
  rolevalue,
  updaterole,
  Allpermissionvalue,
  updatepermisson,
} from './type'

enum API {
  GETROLE_URL = '/admin/acl/role/',
  ADDROLE_URL = '/admin/acl/role/save',
  UPDATEROLE_URL = '/admin/acl/role/update',
  DELETEROLE_URL = '/admin/acl/role/remove/',
  GETPERMISSION_URL = '/admin/acl/permission',
  GETPERMISSIONBYROLEID_URL = '/admin/acl/permission/toAssign/',
  DOASSINGPERMISSION_URL = '/admin/acl/permission/doAssign',
  UPDATEPERMISSION_URL = '/admin/acl/permission/update',
}

export const reqgetrole = (page: number, limit: number, rolename: string) =>
  request.get<any, rolevalue>(
    API.GETROLE_URL + `${page}/${limit}?roleName=${rolename}`,
  )
export const reqgetroleList = (page: number, limit: number) =>
  request.get<any, rolevalue>(API.GETROLE_URL + `${page}/${limit}`)

export const reqaddrole = (data: addrole) =>
  request.post<any, any>(API.ADDROLE_URL, data)

export const reqUpdaterole = (data: updaterole) =>
  request.put<any, any>(API.UPDATEROLE_URL, data)

export const reqAllpermission = () =>
  request.get<any, Allpermissionvalue>(API.GETPERMISSION_URL)

export const reqgetpermissionByRoleId = (roleid: number | string) =>
  request.get<any, Allpermissionvalue>(
    API.GETPERMISSIONBYROLEID_URL + `${roleid}`,
  )

export const reqUpdatepermission = (data: updatepermisson) =>
  request.post<any, any>(API.UPDATEPERMISSION_URL, data)

export const reqDoAssignPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.DOASSINGPERMISSION_URL +
      `?roleId=${roleId}&permissionId=${permissionId}`,
  )

export const reqDeleteRole = (id: number | string) =>
  request.delete<any, any>(API.DELETEROLE_URL + id)
