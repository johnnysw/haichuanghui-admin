// 会员相关类型定义

/** 会员状态枚举 */
export enum MemberStatus {
  DISABLED = 0, // 禁用
  NORMAL = 1 // 正常
}

/** 会员角色枚举 */
export enum MemberRole {
  INVESTOR = 1, // 投资人
  ENTREPRENEUR = 2 // 创业者
}

/** 会员状态信息映射 */
export interface MemberStatusInfo {
  label: string;
  type: "success" | "danger" | "warning" | "info";
}

export const MEMBER_STATUS_MAP: Record<MemberStatus, MemberStatusInfo> = {
  [MemberStatus.DISABLED]: { label: "禁用", type: "danger" },
  [MemberStatus.NORMAL]: { label: "正常", type: "success" }
};

/** 会员角色信息映射 */
export interface MemberRoleInfo {
  label: string;
  type: "primary" | "success" | "warning" | "info";
}

export const MEMBER_ROLE_MAP: Record<MemberRole, MemberRoleInfo> = {
  [MemberRole.INVESTOR]: { label: "投资人", type: "primary" },
  [MemberRole.ENTREPRENEUR]: { label: "创业者", type: "success" }
};

/** 分页查询参数基础接口 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

/** 会员查询参数 */
export interface MemberQueryParams extends PaginationQuery {
  search?: string; // 搜索关键词（用户名/昵称/邮箱/手机号）
  status?: string | number; // 状态：0-禁用, 1-正常
}

/** 会员信息 */
export interface MemberInfo {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: MemberRole;
  roleText?: string;
  status: MemberStatus;
  statusText?: string;
  isVip?: boolean;
  vipExpireTime?: string;
  lastLoginTime?: string;
  loginIp?: string;
  createdTime: string;
  updatedTime?: string;

  // 详情页扩展字段（user_profile）
  realName?: string;
  gender?: number;
  genderText?: string;
  birthday?: string;
  age?: number;
  coverImage?: string;

  // 地址信息
  country?: string;
  province?: string;
  city?: string;
  address?: string;
  postalCode?: string;

  // 职业信息
  company?: string;
  position?: string;
  industry?: string;
  field?: string;
  workExperience?: string;
  education?: string;

  // 个人展示
  bio?: string;
  skills?: string;
  interests?: string;
  achievements?: string;

  // 社交账号
  linkedin?: string;
  wechat?: string;
  website?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  weibo?: string;

  // 设置
  visibility?: number;
  isVerified?: boolean;
  verificationDocument?: string;
  languagePreference?: string;
  timezone?: string;
  notificationSettings?: string;

  // 邀请信息
  inviteCode?: string;
  invitedBy?: number;
}

/** 会员状态选项（用于筛选下拉框） */
export const MEMBER_STATUS_OPTIONS = [
  { label: "全部状态", value: "" },
  { label: "正常", value: 1 },
  { label: "禁用", value: 0 }
];

