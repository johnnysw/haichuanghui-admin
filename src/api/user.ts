/** 用户登录相关接口 */

import { http } from "@/utils/http";
import type { Response, PageResponse } from "@/types/response";
import type { User } from "@/types/system";

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
  return http.request<Response<User.UserInfo>>("get", "/api/v1/admin/user/current", { data });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = (params?: { pageNum?: number, pageSize?: number }) => {
  return http.request<PageResponse>("get", "/api/v1/admin/user/user-logs", {
    params // 将参数作为 query string 传递
  });
};

/** 更新当前用户头像 */
export const updateUserAvatar = (avatarUrl: string) => {
  return http.request<Response<null>>("put", "/api/v1/admin/user/avatar", {
    data: { avatar: avatarUrl }
  });
};

/** 更新当前用户信息 */
export const updateCurrentUserInfo = (data: Partial<User.UserInfo>) => {
  // 只包含允许更新的字段
  const updateData = {
    nickname: data.nickname,
    email: data.email,
    phone: data.phone,
    remark: data.remark
  };
  return http.request<Response<User.UserInfo>>("put", "/api/v1/admin/user/current", {
    data: updateData
  });
};

/** 修改当前用户密码 */
export const changeUserPassword = (data: { oldPassword: string, newPassword: string }) => {
  return http.request<Response<null>>("put", "/api/v1/admin/user/password", {
    data // 发送旧密码和新密码
  });
};
