import type { PageParams } from "./page";

/** 系统管理相关类型 */

/** 通用状态枚举 */
export const statusOptions = [0, 1] as const;
export type Status = typeof statusOptions[number];

/** 用户相关类型 */
export namespace User {
  /** 用户基础信息 */
  export interface UserInfo {
    /** 主键ID */
    id: number;
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 昵称 */
    nickname: string;
    /** 头像 */
    avatar?: string;
    /** 手机号 */
    phone: string;
    /** 邮箱 */
    email?: string;
    /** 微信号 */
    wechat?: string;
    /** 状态 */
    status: Status;
    /** 备注 */
    remark?: string;
    /** 部门信息 */
    deptId: number;
  }

  /** 查询参数 */
  export interface QueryParams extends PageParams {
    id?: number;
    username?: string;
    status?: Status;
    phone?: string;
    deptId?: string | number; // 修改为可选的string或number类型
  }

  /** 表单相关类型 */
  export interface FormData {
    id?: number; // 新增时不需要
    title?: string;
    username: string;
    nickname: string;
    password?: string; // 修改时不需要
    phone: string;
    email?: string;
    wechat?: string;
    deptId: number;
    status?: Status; // 修改时不需要
    remark?: string;
    higherDeptOptions?: Record<string, unknown>[]; // 上级部门选项
  }
}

/** 部门相关类型 */
export namespace Dept {
  /** 部门基础信息 */
  export interface BaseDept {
    id: number;           // 部门ID
    parentId: number;     // 父部门ID
    name: string;         // 部门名称
    sort: number;         // 显示顺序
    principalId: number;  // 负责人ID
    status: Status;       // 部门状态（0：禁用，1：启用）
    type: number;         // 类型（1：公司，2：分公司，3：部门）
    remark: string;       // 备注信息
  }

  /** 查询参数 */
  export interface QueryParams {
    name?: string;
    status?: Status;
  }

  /** 表单相关类型 */
  export interface FormData extends Omit<BaseDept, 'id'> {
    id?: number;
    higherDeptOptions: Record<string, unknown>[];
  }

  export interface FormProps {
    formInline: FormData;
  }
}

/** 日志类型枚举 */
export const logTypeOptions = ['login', 'operation', 'system'] as const;
export type LogType = typeof logTypeOptions[number];

/** 日志相关类型 */
export namespace Log {
  /** 日志基础信息 */
  export interface BaseLog {
    id: number;
    type: LogType;
    title: string;
    content: string;
    username: string;
    ip: string;
    userAgent: string;
  }

  /** 登录日志 */
  export interface LoginLog extends BaseLog {
    status: boolean;
    msg: string;
  }

  /** 操作日志 */
  export interface OperationLog extends BaseLog {
    method: string;
    params: string;
    result: string;
    time: number;
  }

  /** 系统日志 */
  export interface SystemLog extends BaseLog {
    level: string;
    trace: string;
  }

  /** 在线用户 */
  export interface OnlineUser extends BaseLog {
    username: string;
  }
}

/** 角色相关类型 */
export namespace Role {
  /** 角色基础信息 */
  export interface BaseRole {
    id: number;
    name: string;
    code: string;
    status: Status;
    remark?: string;
  }

  /** 查询参数 */
  export interface QueryParams extends PageParams {
    name?: string;
    code?: string;
    status?: Status;
  }

  /** 角色表单数据 */
  export interface FormData extends Omit<BaseRole, 'id'> {
    id?: number;
    username?: string;
    nickname?: string;
    roleOptions?: BaseRole[];
    ids?: number[];
  }

  export interface FormProps {
    formInline: FormData;
  }
}

/** 菜单相关类型 */
export namespace Menu {
  /** 菜单类型枚举 */
  export const menuTypeOptions = [0, 1, 2, 3] as const;
  export type MenuType = typeof menuTypeOptions[number];

  /** 菜单基础信息 */
  export interface BaseMenu {
    /** 菜单ID */
    id: number;
    /** 父级菜单ID */
    parentId: number;
    /** 菜单名称 */
    title: string;
    /** 路由名称 */
    name: string;
    /** 路由路径 */
    path: string;
    /** 组件路径 */
    component: string;
    /** 菜单类型(0菜单、1iframe、2外链、3按钮) */
    menuType: MenuType;
    /** 菜单图标 */
    icon: string;
    /** 菜单右侧图标 */
    extraIcon: string;
    /** 排序号 */
    rank?: number;
    /** 权限标识 */
    auths: string;
    /** iframe链接 */
    frameSrc: string;
    /** 是否加载动画 */
    frameLoading: boolean;
    /** 是否缓存 */
    keepAlive: boolean;
    /** 是否隐藏标签 */
    hiddenTag: boolean;
    /** 是否固定标签 */
    fixedTag: boolean;
    /** 是否显示 */
    showLink: boolean;
    /** 是否显示父级菜单 */
    showParent: boolean;
    /** 重定向路径 */
    redirect: string;
    /** 进场动画 */
    enterTransition: string;
    /** 离场动画 */
    leaveTransition: string;
    /** 激活路径 */
    activePath: string;
    /** 子菜单 */
    children?: BaseMenu[];
  }

  /** 查询参数 */
  export interface QueryParams {
    /** 菜单名称 */
    title?: string;
  }

  /** 表单数据 */
  export interface FormData extends Omit<BaseMenu, 'id' | 'children'> {
    id?: number;
    /** 上级菜单选项 */
    higherMenuOptions: BaseMenu[];
  }

  export interface FormProps {
    formInline: FormData;
  }
}



