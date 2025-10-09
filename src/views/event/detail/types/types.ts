// 活动详情接口，扩展基础活动接口
export interface EventDetail {
  id: number;
  title: string;
  description?: string;
  detailedIntro?: string; // 详细介绍，支持HTML
  type: string;
  organizer: string;
  poster?: string;
  location: string;
  address: string;
  startTime: string;
  endTime: string;
  registrationStartTime?: string;
  registrationEndTime?: string;
  maxParticipants?: number;
  participantCount: number;
  registeredCount?: number; // 已报名人数
  status: number; // 0: 报名中, 1: 进行中, 2: 已结束, 3: 已取消
  isRecommended: boolean;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  website?: string;
  requirements?: string;
  agenda?: string;
  benefits?: string;
  tags?: string[];
  speakers?: Speaker[]; // 演讲嘉宾
  sponsors?: Sponsor[]; // 赞助商
  materials?: Material[]; // 活动资料
  gallery?: Gallery[]; // 活动图片
  feedback?: Feedback[]; // 活动反馈
  createdTime: string;
  updatedTime: string;
  viewCount?: number;
  favoriteCount?: number;
}

// 演讲嘉宾接口
export interface Speaker {
  id: number;
  name: string;
  title: string;
  company: string;
  avatar?: string;
  bio?: string;
  topic?: string;
}

// 赞助商接口
export interface Sponsor {
  id: number;
  name: string;
  logo: string;
  level: "title" | "gold" | "silver" | "bronze"; // 赞助级别
  website?: string;
  description?: string;
}

// 活动资料接口
export interface Material {
  id: number;
  name: string;
  type: "document" | "video" | "image" | "link";
  url: string;
  size?: number;
  description?: string;
  downloadCount?: number;
}

// 活动图片接口
export interface Gallery {
  id: number;
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
  uploadTime: string;
}

// 活动反馈接口
export interface Feedback {
  id: number;
  participantName: string;
  rating: number; // 1-5星评分
  comment: string;
  submitTime: string;
}

// 活动统计信息接口
export interface EventStats {
  totalViews: number;
  todayViews: number;
  monthlyViews: number;
  registrations: number;
  completedRegistrations: number;
  favorites: number;
  shares: number;
  averageRating: number;
  feedbackCount: number;
}

// 状态信息接口
export interface StatusInfo {
  label: string;
  type: "success" | "info" | "warning" | "danger" | "primary";
  color?: string;
}

// 类型信息接口
export interface TypeInfo {
  label: string;
  color: string;
  bgColor: string;
}

// API响应接口
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

// 参与者信息接口
export interface Participant {
  id: number;
  name: string;
  phone: string;
  email: string;
  company?: string;
  position?: string;
  registrationTime: string;
  attendanceStatus: "registered" | "confirmed" | "attended" | "absent";
  notes?: string;
}

// 活动报名表单接口
export interface RegistrationForm {
  eventId: number;
  name: string;
  phone: string;
  email: string;
  company?: string;
  position?: string;
  requirements?: string;
}

// 活动报名统计接口
export interface RegistrationStats {
  totalRegistrations: number;
  confirmedAttendees: number;
  actualAttendees: number;
  registrationRate: number;
  attendanceRate: number;
  dailyRegistrations: { date: string; count: number }[];
}
