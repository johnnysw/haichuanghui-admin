import { http } from "@/utils/http";
import type { Response, PageResponse } from "@/types/response";
import type { RegistrationQueryParams, RegistrationItem } from "./types/types";

// 获取竞赛报名列表
export const getCompetitionRegistrations = (competitionId: number, params: RegistrationQueryParams) => {
  return http.request<PageResponse<RegistrationItem[]>>("get", `/api/v1/admin/competition/${competitionId}/registrations`, { params });
};

// 更新报名状态
export const updateRegistrationStatus = (id: number, status: number, rejectReason?: string) => {
  const data: any = { status };
  if (rejectReason !== undefined) {
    data.rejectReason = rejectReason;
  }
  return http.request<Response<any>>("post", `/api/v1/admin/competition-registration/${id}/status`, { data });
};