// 资讯分类接口（继承自list的定义并扩展）
export interface NewsCategory {
  id: number;
  name: string;
  code: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  parentId?: number;
  parentName?: string; // 父级分类名称
  level: number;
  path?: string;
  isActive: boolean;
  isNavigation: boolean;
  articleCount: number;
  status: number; // 0-禁用, 1-启用
  reviewComment?: string;
  reviewTime?: string;
  children?: NewsCategory[];
  createdTime: string;
  updatedTime: string;
}

// 分类创建表单接口
export interface CategoryCreateForm {
  name: string;
  description?: string;
  displayOrder: number;
  parentId?: number;
  isActive: boolean;
}

// 分类查询参数接口
export interface CategoryListParams {
  page?: string;
  limit?: string;
  name?: string;
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

// 分类统计接口
export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  navigationCategories: number;
  pendingCategories: number;
  topLevelCategories: number;
  averageArticleCount: number;
  mostPopularCategory: {
    name: string;
    articleCount: number;
  };
  leastPopularCategory: {
    name: string;
    articleCount: number;
  };
}

// 分类树节点接口
export interface CategoryTreeNode extends NewsCategory {
  children?: CategoryTreeNode[];
}

// 图标选项接口
export interface IconOption {
  value: string;
  label: string;
  icon: string;
}

// 分类操作日志接口
export interface CategoryOperationLog {
  id: number;
  categoryId: number;
  operatorId: number;
  operatorName: string;
  action:
    | "create"
    | "update"
    | "delete"
    | "approve"
    | "reject"
    | "enable"
    | "disable";
  description: string;
  operationTime: string;
  ipAddress?: string;
}
