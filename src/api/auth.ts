/** 用户登录相关接口 */

import { http } from "@/utils/http";
import type { Response, PageResponse } from "@/types/response";
import type { Auth } from "@/types/auth";
import type { User } from "@/types/system";

/** 登录 */
export const getLogin = (data?: Auth.LoginParams) => {
  return http.request<Response<Auth.LoginResult>>("post", "/api/v1/admin/auth/login", { data });
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<Response<Auth.RefreshTokenResult>>("post", "/api/v1/admin/auth/refresh-token", { data });
};

/** 登出 */
export const logoutApi = () => {
  return http.request<Response<null>>("post", "/api/v1/admin/auth/logout");
};

/** 获取用户动态路由 */
export const getAsyncRoutes = () => {
  return http.request<Response<Auth.AsyncRoutes>>("get", "/api/v1/admin/menus/user-menus");
  // return http.request<Response<Auth.AsyncRoutes>>("get", "/get-async-routes");
};
