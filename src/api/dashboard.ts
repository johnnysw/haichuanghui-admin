import { http } from "@/utils/http";
import type { Response } from "@/types/response";

/**
 * Dashboard 统计数据类型定义
 */

// 竞赛统计
export interface CompetitionStats {
  totalRegistrationCount: number;
  totalViewCount: number;
  totalFavoriteCount: number;
}

// 活动统计
export interface EventStats {
  totalRegistrationCount: number;
  totalViewCount: number;
  currentMonthEventCount: number;
}

// 项目统计
export interface ProjectStats {
  totalViewCount: number;
  totalFavoriteCount: number;
  totalProjectCount: number;
}

// 资讯统计
export interface NewsStats {
  totalViewCount: number;
  totalCommentCount: number;
  totalLikeCount: number;
  totalFavoriteCount: number;
}

// 会员汇总统计
export interface MemberSummary {
  totalCount: number;
  todayCount: number;
  thisWeekCount: number;
  thisMonthCount: number;
}

/**
 * 获取竞赛统计数据
 */
export const getCompetitionStats = () => {
  return http.request<Response<CompetitionStats>>(
    "get",
    "/api/v1/admin/competition/stats"
  );
};

/**
 * 获取活动统计数据
 */
export const getEventStats = () => {
  return http.request<Response<EventStats>>(
    "get",
    "/api/v1/admin/event/stats"
  );
};

/**
 * 获取项目统计数据
 */
export const getProjectStats = () => {
  return http.request<Response<ProjectStats>>(
    "get",
    "/api/v1/admin/projects/stats"
  );
};

/**
 * 获取资讯统计数据
 */
export const getNewsStats = () => {
  return http.request<Response<NewsStats>>("get", "/api/v1/admin/news/stats");
};

/**
 * 获取会员汇总统计
 */
export const getMemberSummary = () => {
  return http.request<Response<MemberSummary>>(
    "get",
    "/api/v1/admin/members/summary"
  );
};

