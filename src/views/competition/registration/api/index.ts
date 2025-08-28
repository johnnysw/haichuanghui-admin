import { http } from "@/utils/http";

// 获取竞赛报名列表
export const getCompetitionRegistrations = (competitionId: number, params: any) => {
  return http.request("get", `/api/v1/admin/competition/${competitionId}/registrations`, { params });
};

// 更新报名状态
export const updateRegistrationStatus = (id: number, status: number, rejectReason?: string) => {
  const data: any = { status };
  if (rejectReason !== undefined) {
    data.rejectReason = rejectReason;
  }
  return http.request("post", `/api/v1/admin/competition-registration/${id}/status`, { data });
};