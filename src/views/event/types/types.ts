// 活动相关类型定义

export interface EventItem {
  id: number;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  maxParticipants: number;
  currentParticipants: number;
  organizer: string;
  contactPhone: string;
  contactEmail: string;
  category: string;
  status: number; // 0: 禁用, 1: 正常, 2: 审核中, 3: 已拒绝
  isRecommended: boolean;
  coverImage: string;
  createdTime: string;
  updatedTime: string;
}

export interface EventListParams {
  page: number;
  pageSize: number;
  title?: string;
  location?: string;
  category?: string;
  status?: string;
  isRecommended?: string;
  organizer?: string;
}

export interface EventCreateForm {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  maxParticipants: number;
  organizer: string;
  contactPhone: string;
  contactEmail: string;
  category: string;
  status: number;
  isRecommended: boolean;
  coverImage: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 活动分类选项
export const EVENT_CATEGORIES = [
  { label: "创业讲座", value: "lecture" },
  { label: "路演活动", value: "roadshow" },
  { label: "创业大赛", value: "competition" },
  { label: "培训课程", value: "training" },
  { label: "政策宣讲", value: "policy" },
  { label: "投融资对接", value: "investment" },
  { label: "行业峰会", value: "summit" },
  { label: "其他", value: "other" }
];

// 活动状态选项
export const EVENT_STATUS_OPTIONS = [
  { label: "全部", value: "" },
  { label: "正常", value: "1" },
  { label: "审核中", value: "2" },
  { label: "已拒绝", value: "3" },
  { label: "禁用", value: "0" }
];
