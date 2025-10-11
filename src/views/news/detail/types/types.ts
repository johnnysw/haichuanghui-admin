// 资讯详情接口，扩展基础资讯接口
export interface NewsDetail {
  id: number;
  title: string;
  subtitle?: string;
  author: string;
  source?: string;
  summary?: string;
  content?: string;
  coverImage?: string;
  publishTime?: string;
  status: number; // 0-草稿, 1-已发布, 2-已下线
  reviewComment?: string;
  reviewTime?: string;
  isRecommended: boolean;
  isTop: boolean;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  favoriteCount: number;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  categoryId?: number;
  categoryName?: string;
  tags?: string[];
  createdTime: string;
  updatedTime: string;
  // 扩展字段
  relatedNews?: RelatedNews[]; // 相关资讯
  comments?: NewsComment[]; // 资讯评论
  authorInfo?: AuthorInfo; // 作者信息
}

// 相关资讯接口
export interface RelatedNews {
  id: number;
  title: string;
  summary?: string;
  coverImage?: string;
  publishTime: string;
  viewCount: number;
  categoryName?: string;
}

// 资讯评论接口
export interface NewsComment {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  replyCount: number;
  replies?: NewsComment[];
  createdTime: string;
}

// 作者信息接口
export interface AuthorInfo {
  id?: number;
  name: string;
  avatar?: string;
  bio?: string;
  articleCount: number;
  totalViews: number;
  followerCount: number;
}

// 资讯统计信息接口
export interface NewsStats {
  totalViews: number;
  todayViews: number;
  weeklyViews: number;
  monthlyViews: number;
  totalComments: number;
  totalLikes: number;
  totalFavorites: number;
  shareCount: number;
}

// 状态信息接口
export interface StatusInfo {
  label: string;
  type: "success" | "info" | "warning" | "danger" | "primary";
  color?: string;
}

// API响应接口
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

// 审核记录接口
export interface ReviewRecord {
  id: number;
  reviewerId: number;
  reviewerName: string;
  action: "approve" | "reject" | "return"; // 通过、拒绝、退回
  comment?: string;
  reviewTime: string;
}

// 操作日志接口
export interface OperationLog {
  id: number;
  operatorId: number;
  operatorName: string;
  action: string;
  description: string;
  operationTime: string;
  ipAddress?: string;
}

// 内容修订历史接口
export interface ContentRevision {
  id: number;
  version: number;
  title: string;
  content: string;
  editorId: number;
  editorName: string;
  editTime: string;
  changeDescription?: string;
}

// ============ 评论相关类型定义 ============

/**
 * 用户信息接口（基于 users 表和 user_profiles 表）
 */
export interface User {
  id: number; // bigint
  username: string; // varchar(50)
  nickname?: string; // varchar(50), nullable
  email?: string; // varchar(100), nullable
  phone?: string; // varchar(20), nullable
  role: number; // int, 1-投资人, 2-创业者
  status?: number; // int, 0-禁用, 1-正常
  profile?: UserProfile; // 关联的用户资料
}

/**
 * 用户资料接口（基于 user_profiles 表）
 */
export interface UserProfile {
  id: number;
  userId: number;
  realName?: string; // varchar(50)
  gender?: number; // tinyint
  avatarUrl?: string; // varchar(255) - 用户头像
  coverImage?: string;
  city?: string;
  province?: string;
  country?: string;
  company?: string;
  position?: string;
  bio?: string; // text
  // ... 其他字段根据需要添加
}

/**
 * 评论接口（基于 article_comments/project_comments 表）
 */
export interface Comment {
  id: number; // bigint
  articleId?: number; // bigint (article_comments 表)
  projectId?: number; // bigint (project_comments 表)
  userId: number; // bigint
  parentId?: number; // bigint, nullable
  content: string; // text
  status: number; // tinyint, 0-已删除, 1-正常, 2-已屏蔽
  likeCount: number; // int
  createdTime: string; // datetime
  updatedTime: string; // datetime
  // 关联数据（由后端 service 层添加）
  user?: User; // 关联的用户信息
  replyToUser?: User; // 回复目标用户（父评论的用户）
  replies?: Comment[]; // 子评论列表
  isLiked?: boolean; // 当前用户是否点赞（由后端计算）
}

/**
 * 评论列表响应
 */
export interface CommentListResponse {
  list: Comment[];
  total: number;
}
