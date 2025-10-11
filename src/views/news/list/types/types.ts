// 资讯基础信息接口
export interface NewsItem {
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
  categoryId?: number;
  categoryName?: string;
  createdTime: string;
  updatedTime: string;
}

// 资讯创建表单接口
export interface NewsCreateForm {
  title: string;
  subtitle?: string;
  author: string;
  source?: string;
  summary?: string;
  content: string;
  coverImage?: string;
  publishTime?: string;
  categoryId?: number;
  isRecommended: boolean;
  isTop: boolean;
  viewCount?: number;
  likeCount?: number;
  favoriteCount?: number;
}

// 资讯列表查询参数接口
export interface NewsListParams {
  page?: string;
  limit?: string;
  title?: string;
  categoryId?: number;
  status?: number;
  isRecommended?: boolean;
  isTop?: boolean;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// 资讯分类接口
export interface NewsCategory {
  id: number;
  name: string;
  code: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  parentId?: number;
  level: number;
  path?: string;
  isActive: boolean;
  isNavigation: boolean;
  articleCount: number;
  status: number; // 0-待审核, 1-已审核, 2-已拒绝
  reviewComment?: string;
  reviewTime?: string;
  children?: NewsCategory[];
  createdTime: string;
  updatedTime: string;
}

// API 响应基础接口
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

// 分页响应接口
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 状态信息接口
export interface StatusInfo {
  label: string;
  type: "success" | "info" | "warning" | "danger" | "primary";
  color?: string;
}

// 资讯统计接口
export interface NewsStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  reviewingArticles: number;
  totalViews: number;
  totalComments: number;
  totalLikes: number;
  totalFavorites: number;
  todayViews: number;
  weeklyViews: number;
  monthlyViews: number;
  recommendedArticles: number;
  topArticles: number;
}
