import { http } from "@/utils/http";
import type { Response, PageResponse } from "@/types/response";
import type { MemberQueryParams, MemberInfo } from "../types/types";

/**
 * 获取会员列表
 */
export const getMemberList = (
  params: MemberQueryParams
): Promise<PageResponse<MemberInfo>> => {
  return http.get<PageResponse<MemberInfo>, any>("/api/v1/admin/members", {
    params
  });
};

/**
 * 获取单个会员详情
 */
export const getMemberDetail = (
  id: number
): Promise<Response<MemberInfo>> => {
  return http.get<Response<MemberInfo>, any>(`/api/v1/admin/members/${id}`);
};

/**
 * 切换会员状态（禁用/恢复）
 */
export const toggleMemberStatus = (
  id: number
): Promise<Response<{ status: number }>> => {
  return http.request<Response<{ status: number }>>(
    "put",
    `/api/v1/admin/members/${id}/toggle-status`
  );
};

