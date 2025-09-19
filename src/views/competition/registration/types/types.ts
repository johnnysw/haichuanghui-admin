// 赛事报名查询参数
export interface RegistrationQueryParams {
  pageNum?: number;
  pageSize?: number;
  competitionId?: string;
  teamName?: string;
  contactName?: string;
  contactPhone?: string;
  status?: string;
  registrationTime?: string[];
}

// 赛事报名项
export interface RegistrationItem {
  id: number;
  competitionId: number;
  teamName: string;
  teamDescription?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  membersCount: number;
  members: TeamMember[];
  status: number; // 0: 已取消, 1: 已报名, 2: 已通过, 3: 已拒绝
  registrationTime: string;
  reviewTime?: string;
  reviewComment?: string;
  attachments?: string[];
  user?: {
    id: number;
    username: string;
    nickname?: string;
  };
  competition?: {
    id: number;
    name: string;
    type: string;
  };
}

// 团队成员
export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  experience?: string;
  skills?: string[];
}

// 报名状态映射
export const REGISTRATION_STATUS_MAP = {
  0: { text: "已取消", type: "info" },
  1: { text: "已报名", type: "warning" },
  2: { text: "已通过", type: "success" },
  3: { text: "已拒绝", type: "danger" }
} as const;

// API响应包装
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 报名列表响应
export interface RegistrationListResponse {
  list: RegistrationItem[];
  total: number;
  pageSize: number;
  currentPage: number;
}