import type {
  NewsItem,
  NewsCreateForm,
  NewsListParams,
  NewsCategory,
  ApiResponse,
  PaginationResponse
} from "../types/types";
import { http } from "@/utils/http";

// 获取资讯列表
export const getNewsList = (
  params: NewsListParams
): Promise<ApiResponse<PaginationResponse<NewsItem>>> => {
  return http.get("/api/v1/admin/news", { params });
};

// 获取资讯详情
export const getNewsDetail = (id: number): Promise<ApiResponse<NewsItem>> => {
  return http.get(`/api/v1/admin/news/${id}`);
};

// 创建资讯
export const createNews = (
  formData: NewsCreateForm
): Promise<ApiResponse<null>> => {
  return http.post("/api/v1/admin/news", { data: formData });
};

// 更新资讯
export const updateNews = (
  id: number,
  formData: Partial<NewsCreateForm>
): Promise<ApiResponse<null>> => {
  return http.request("put", `/api/v1/admin/news/${id}`, { data: formData });
};

// 删除资讯
export const deleteNews = (id: number): Promise<ApiResponse<null>> => {
  return http.request("delete", `/api/v1/admin/news/${id}`);
};

// 批量删除资讯
export const batchDeleteNews = (ids: number[]): Promise<ApiResponse<null>> => {
  return http.request("delete", "/api/v1/admin/news", { data: { ids } });
};

// 更新资讯状态
export const updateNewsStatus = (
  id: number,
  status: number,
  reviewComment?: string
): Promise<ApiResponse<null>> => {
  return http.request("patch", `/api/v1/admin/news/${id}/status`, {
    data: { status, reviewComment }
  });
};

// 切换推荐状态
export const toggleNewsRecommend = (
  id: number,
  isRecommended: boolean
): Promise<ApiResponse<null>> => {
  return http.request("patch", `/api/v1/admin/news/${id}/recommend`, {
    data: { isRecommended }
  });
};

// 切换置顶状态
export const toggleNewsTop = (
  id: number,
  isTop: boolean
): Promise<ApiResponse<null>> => {
  return http.request("patch", `/api/v1/admin/news/${id}/top`, {
    data: { isTop }
  });
};

// 获取分类列表
export const getCategoryList = (): Promise<ApiResponse<NewsCategory[]>> => {
  return http.get("/api/v1/admin/news/categories", {
    params: { page: 1, limit: 100 }
  }).then((res: ApiResponse<PaginationResponse<NewsCategory>>) => {
    // 将分页响应转换为数组响应
    return {
      code: res.code,
      success: res.success,
      message: res.message,
      data: res.data.list
    };
  });
};

// 获取资讯统计信息
export const getNewsStats = (): Promise<ApiResponse<{
  totalViewCount: number;
  totalCommentCount: number;
  totalLikeCount: number;
  totalFavoriteCount: number;
}>> => {
  return http.get("/api/v1/admin/news/stats");
};
