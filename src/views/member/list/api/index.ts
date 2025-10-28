import { http } from "@/utils/http";
import type { Response } from "@/types/response";

// 会员统计参数
export interface MemberStatsParams {
  granularity: "daily" | "weekly" | "monthly";
  start?: string;
  end?: string;
}

// 统计项
export interface StatsItem {
  period: string;
  label: string;
  count: number;
}

// 统计汇总
export interface StatsSummary {
  total: number;
  avg: number;
  peak: {
    period: string;
    label: string;
    count: number;
  };
}

// 统计响应
export interface MemberStatsResponse {
  granularity: string;
  start: string;
  end: string;
  items: StatsItem[];
  summary: StatsSummary;
}

/**
 * 获取会员统计数据
 */
export const getMemberStats = (params: MemberStatsParams) => {
  return http.request<Response<MemberStatsResponse>>(
    "get",
    "/api/v1/admin/members/stats",
    { params }
  );
};

// 总会员数响应
export interface TotalMemberCountResponse {
  total: number;
}

/**
 * 获取总会员数
 */
export const getTotalMemberCount = () => {
  return http.request<Response<TotalMemberCountResponse>>(
    "get",
    "/api/v1/admin/members/total"
  );
};

