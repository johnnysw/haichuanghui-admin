/** 用户登录相关类型 */
import type { User } from "@/types/system";
import type { RouteRecordRaw } from "vue-router";

export namespace Auth {
  /** 登录请求参数 */
  export interface LoginParams {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  }

  /** 登录响应结果 */
  export interface LoginResult {
    /** 管理员ID */
    id: number;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 头像 */
    avatar: string;
    /** 角色列表 */
    roles: string[];
    /** 权限列表 */
    permissions: string[];
    /** 访问令牌 */
    accessToken: string;
    /** 刷新令牌 */
    refreshToken: string;
    /** 过期时间(时间戳) */
    expires: number;
  }

  /** Token刷新响应结果 */
  export interface RefreshTokenResult {
    /** 访问令牌 */
    accessToken: string;
    /** 刷新令牌 */
    refreshToken: string;
    /** 过期时间(时间戳) */
    expires: number;
  }

  /** 用户信息 */
  export interface MyInfo {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 邮箱 */
    email: string;
    /** 手机号 */
    phone: string;
    /** 描述 */
    remark: string;
  }

  /** 动态路由 */
  export type AsyncRoutes = RouteRecordRaw[];

  /** 安全日志记录 */
  // export interface SecurityLog {
  //   /** 日志ID */
  //   id: number;
  //   /** 用户名 */
  //   username: string;
  //   /** 登录IP */
  //   ip: string;
  //   /** 登录地址 */
  //   address: string;
  //   /** 操作系统 */
  //   system: string;
  //   /** 浏览器 */
  //   browser: string;
  //   /** 状态(1:成功,0:失败) */
  //   status: number;
  //   /** 行为描述 */
  //   behavior: string;
  //   /** 登录时间 */
  //   loginTime: Date;
  // }
}