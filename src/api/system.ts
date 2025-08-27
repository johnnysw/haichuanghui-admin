import { http } from "@/utils/http";
import type { Response, PageResponse } from "@/types/response";
import type { User, Role, Dept, Menu, Log } from "@/types/system";

// ==================== 用户管理相关接口 ====================

/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: User.QueryParams) => {
  return http.request<PageResponse<User.UserInfo>>("get", "/api/v1/admin/users", { params: data });
};

/** 系统管理-用户管理-新增用户 */
export const addUser = (data: User.FormData) => {
  // 新增用户时，不返回密码（使用 Omit）
  return http.request<Response<Omit<User.UserInfo, "password">>>("post", "/api/v1/admin/users", { data });
};

/** 系统管理-用户管理-修改用户 */
export const updateUser = (data: User.FormData) => {
  return http.request<Response<User.UserInfo>>("put", `/api/v1/admin/users/${data.id}`, { data });
};

/** 系统管理-用户管理-删除用户 */
export const deleteUser = (userId: number) => {
  return http.request<Response>("delete", `/api/v1/admin/users/${userId}`);
};

/** 系统管理-用户管理-重置密码 */
export const resetPassword = (data: { userId: number; newPassword: string }) => {
  return http.request<Response>("put", `/api/v1/admin/users/${data.userId}/password`, { data: { newPassword: data.newPassword } });
};

/** 系统管理-用户管理-上传头像 */
export const uploadAvatar = (data: { userId: number; file: File }) => {
  return http.request<Response>("put", "/api/v1/admin/user/avatar", { data }, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

/** 系统管理-用户管理-修改用户状态 */
export const updateUserStatus = (data: { userId: number; status: number }) => {
  return http.request<Response>("put", `/api/v1/admin/users/${data.userId}/status`, { data: { status: data.status } });
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Response<Role.BaseRole[]>>("get", "/api/v1/admin/roles");
};

/** 系统管理-用户管理-根据 userId，获取对应角色id列表 */
export const getRoleIds = (data: { userId: number }) => {
  return http.request<Response<number[]>>("get", `/api/v1/admin/users/${data.userId}/roles`);
};

/** 系统管理-用户管理-分配角色 */
export const assignRoles = (data: { userId: number; roleIds: number[] }) => {
  return http.request<Response>("put", `/api/v1/admin/users/${data.userId}/roles`, { data });
};

// ==================== 角色管理相关接口 ====================

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: Role.QueryParams) => {
  return http.request<PageResponse<Role.BaseRole>>("get", "/api/v1/admin/roles", { params: data });
};

/** 系统管理-角色管理-新增角色 */
export const addRole = (data: Role.FormData) => {
  return http.request<Response<Role.BaseRole>>("post", "/api/v1/admin/roles", { data });
};

/** 系统管理-角色管理-修改角色 */
export const updateRole = (data: Role.FormData) => {
  return http.request<Response<Role.BaseRole>>("put", `/api/v1/admin/roles/${data.id}`, { data });
};

/** 系统管理-角色管理-更新状态 */
export const updateRoleStatus = (data: { id: number; status: 0 | 1 }) => {
  return http.request<Response>("put", `/api/v1/admin/roles/${data.id}/status`, { data });
};

/** 系统管理-角色管理-删除角色 */
export const deleteRole = (id: number) => {
  return http.request<Response>("delete", `/api/v1/admin/roles/${id}`);
};

/** 保存角色的菜单权限 */
export const saveRoleMenus = (data: { roleId: number; menuIds: number[] }) => {
  return http.request<Response>("put", `/api/v1/admin/roles/${data.roleId}/menus`, { data });
};

/** 获取角色管理-权限-菜单权限 */
export const getRoleMenu = (data?: object) => {
  return http.request<PageResponse>("post", "/role-menu", { data });
};

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (data?: { roleId: number }) => {
  return http.request<Response>("get", `/api/v1/admin/roles/${data?.roleId}/menus`);
};

// ==================== 菜单管理相关接口 ====================

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: Menu.QueryParams) => {
  return http.request<Response<Menu.BaseMenu[]>>("get", "/api/v1/admin/menus", { params: data });
};

/** 系统管理-菜单管理-新增菜单 */
export const addMenu = (data: Menu.FormData) => {
  return http.request<Response<Menu.BaseMenu>>("post", "/api/v1/admin/menus", { data });
};

/** 系统管理-菜单管理-修改菜单 */
export const updateMenu = (data: Menu.FormData) => {
  return http.request<Response<Menu.BaseMenu>>("put", `/api/v1/admin/menus/${data.id}`, { data });
};

/** 系统管理-菜单管理-删除菜单 */
export const deleteMenu = (id: number) => {
  return http.request<Response>("delete", `/api/v1/admin/menus/${id}`);
};

// ==================== 部门管理相关接口 ====================

/** 获取系统管理-部门管理列表 */
export const getDeptList = (data?: Dept.QueryParams) => {
  return http.request<Response<Dept.BaseDept[]>>("get", "/api/v1/admin/depts", { params: data });
};

/** 系统管理-部门管理-新增部门 */
export const addDept = (data: Dept.FormData) => {
  return http.request<Response>("post", "/api/v1/admin/depts", { data });
};

/** 系统管理-部门管理-修改部门 */
export const updateDept = (data: Dept.FormData) => {
  return http.request<Response>("put", `/api/v1/admin/depts/${data.id}`, { data });
};

/** 系统管理-部门管理-删除部门 */
export const deleteDept = (id: number) => {
  return http.request<Response>("delete", `/api/v1/admin/depts/${id}`);
};

// ==================== 系统监控相关接口 ====================

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (data?: Log.OnlineUser) => {
  return http.request<PageResponse<Log.LoginLog>>("post", "/online-logs", { data });
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (data?: Log.LoginLog) => {
  return http.request<PageResponse<Log.LoginLog>>("post", "/login-logs", { data });
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (data?: Log.OperationLog) => {
  return http.request<PageResponse<Log.OperationLog>>("post", "/operation-logs", { data });
};

/** 获取系统监控-系统日志列表 */
export const getSystemLogsList = (data?: Log.SystemLog) => {
  return http.request<PageResponse<Log.SystemLog>>("get", "/api/v1/admin/system/logs", { params: data });
};

/** 获取系统监控-系统日志-根据 id 查日志详情 */
export const getSystemLogsDetail = (data?: { id: number }) => {
  return http.request<PageResponse<Log.SystemLog>>("get", `/api/v1/admin/system/logs/${data?.id}`);
};

// ==================== 字典管理相关接口 ====================

/** 字典管理-左侧树 */
export const getDictTree = () => {
  return http.request<PageResponse>("get", "/dict-tree");
};

/** 字典管理-根据字典 dictId 查字典详情 */
export const getDictDetail = (data?: object) => {
  return http.request<PageResponse>("post", "/dict-detail", { data });
};

// ==================== 租户管理相关接口 ====================

/** 获取租户管理-租户列表 */
export const getTenantList = (data?: object) => {
  return http.request<PageResponse>("post", "/tenant-list", { data });
};

/** 获取租户管理-租户套餐列表 */
export const getTenantPackage = (data?: object) => {
  return http.request<PageResponse>("post", "/tenant-package", { data });
};

/** 获取租户套餐-权限-菜单权限 */
export const getTenantPackageMenu = (data?: object) => {
  return http.request<PageResponse>("post", "/tenant-package-menu", { data });
};

/** 获取租户套餐-权限-菜单权限-根据角色 id 查对应菜单 */
export const getTenantPackageMenuIds = (data?: object) => {
  return http.request<PageResponse>("post", "/tenant-package-menu-ids", { data });
};

/** 获取租户套餐列表（用于下拉选择） */
export const getTenantPackageSimple = () => {
  return http.request<PageResponse>("get", "/tenant-package-simple");
};