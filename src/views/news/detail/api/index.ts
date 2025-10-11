import type { ApiResponse } from "../../list/types/types";
import type { NewsDetail, NewsStats } from "../types/types";
import { http } from "@/utils/http";

// 获取资讯详情
export const getNewsDetail = (id: number): Promise<ApiResponse<NewsDetail>> => {
  return http.get(`/api/v1/admin/news/${id}`);
};

// 获取资讯统计数据（暂时返回详情中的统计字段）
export const getNewsStats = (id: number): Promise<ApiResponse<NewsStats>> => {
  return getNewsDetail(id).then((res) => {
    const detail = res.data;
    const stats: NewsStats = {
      totalViews: detail.viewCount,
      todayViews: 0, // 暂无后端支持
      weeklyViews: 0, // 暂无后端支持
      monthlyViews: 0, // 暂无后端支持
      totalComments: detail.commentCount,
      totalLikes: detail.likeCount,
      totalFavorites: detail.favoriteCount,
      shareCount: 0 // 暂无后端支持
    };
    return {
      code: res.code,
      success: res.success,
        message: "获取统计数据成功",
        data: stats
    };
  });
};

// 更新资讯状态
export const updateNewsStatus = (
  id: number,
  status: number
): Promise<ApiResponse<null>> => {
  return http.request("patch", `/api/v1/admin/news/${id}/status`, {
    data: { status }
  });
};

// 推荐/取消推荐资讯
export const toggleNewsRecommend = (
  id: number,
  isRecommended: boolean
): Promise<ApiResponse<null>> => {
  return http.request("patch", `/api/v1/admin/news/${id}/recommend`, {
    data: { isRecommended }
  });
};

// 置顶/取消置顶资讯
export const toggleNewsTop = (
  id: number,
  isTop: boolean
): Promise<ApiResponse<null>> => {
  return http.request("patch", `/api/v1/admin/news/${id}/top`, {
    data: { isTop }
  });
};

// 删除评论（级联删除子评论）
export const deleteNewsComment = (
  newsId: number,
  commentId: number
): Promise<ApiResponse<{ deletedCount: number; commentIds: number[] }>> => {
  return http.request(
    "delete",
    `/api/v1/admin/news/${newsId}/comments/${commentId}`
  );
};
