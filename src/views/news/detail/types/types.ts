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
  status: number; // 0-草稿, 1-已发布, 2-已下线, 3-审核中, 4-已拒绝
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
  type: 'success' | 'info' | 'warning' | 'danger' | 'primary';
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
  action: 'approve' | 'reject' | 'return'; // 通过、拒绝、退回
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