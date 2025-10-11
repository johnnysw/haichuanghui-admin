import type {
  NewsCategory,
  CategoryCreateForm,
  CategoryListParams,
  ApiResponse,
  PaginationResponse
} from "../types/types";
import { http } from "@/utils/http";

// 获取分类列表
export const getCategoryList = (
  params: CategoryListParams
): Promise<ApiResponse<PaginationResponse<NewsCategory>>> => {
  return http.get("/api/v1/admin/news/categories", { params });
};

// 获取分类树（用于父级分类选择）
export const getCategoryTree = (): Promise<ApiResponse<NewsCategory[]>> => {
  return http.get("/api/v1/admin/news/categories/tree");
};

// 获取分类详情
export const getCategoryDetail = (
  id: number
): Promise<ApiResponse<NewsCategory>> => {
  return http.get(`/api/v1/admin/news/categories/${id}`);
};

// 创建分类
export const createCategory = (
  formData: CategoryCreateForm
): Promise<ApiResponse<null>> => {
  return http.post("/api/v1/admin/news/categories", { data: formData });
};

// 更新分类
export const updateCategory = (
  id: number,
  formData: Partial<CategoryCreateForm>
): Promise<ApiResponse<null>> => {
  return http.request("put", `/api/v1/admin/news/categories/${id}`, {
    data: formData
  });
};

// 删除分类
export const deleteCategory = (id: number): Promise<ApiResponse<null>> => {
  return http.request("delete", `/api/v1/admin/news/categories/${id}`);
};

// 批量删除分类
export const batchDeleteCategory = (
  ids: number[]
): Promise<ApiResponse<null>> => {
  return http.request("delete", "/api/v1/admin/news/categories", {
    data: { ids }
  });
};

// 切换启用状态
export const toggleCategoryActive = (
  id: number,
  isActive: boolean
): Promise<ApiResponse<null>> => {
  return http.request("patch", `/api/v1/admin/news/categories/${id}/active`, {
    data: { isActive }
  });
};

// 切换导航显示状态
export const toggleCategoryNavigation = (
  id: number,
  isNavigation: boolean
): Promise<ApiResponse<null>> => {
  return http.request("patch", `/api/v1/admin/news/categories/${id}/navigation`, {
    data: { isNavigation }
  });
};

// 更新分类状态
export const updateCategoryStatus = (
  id: number,
  status: number
): Promise<ApiResponse<null>> => {
  return http.request("patch", `/api/v1/admin/news/categories/${id}/status`, {
    data: { status }
  });
};
