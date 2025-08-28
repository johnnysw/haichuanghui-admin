/** 报名管理模块类型定义 */

export interface RegistrationQueryParams {
  page?: number;
  limit?: number;
  status?: number;
}

export interface RegistrationItem {
  id: number;
  competitionId: number;
  userId: number;
  teamName?: string;
  projectName?: string;
  projectDescription?: string;
  businessPlanFile?: string;
  presentationFile?: string;
  status: number;
  rejectReason?: string;
  createdTime: string;
  updateTime: string;
  user?: {
    id: number;
    username: string;
    email: string;
    phone: string;
  };
}

export interface RegistrationListResponse {
  list: RegistrationItem[];
  total: number;
  page: number;
  limit: number;
}