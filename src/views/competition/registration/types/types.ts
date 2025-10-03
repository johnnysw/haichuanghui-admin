export interface RegistrationQueryParams {
  pageNum?: number | string;
  pageSize?: number | string;
  status?: number | string;
  teamName?: string;
  contactName?: string;
  contactPhone?: string;
  startTime?: string;
  endTime?: string;
}

export interface ReviewerSummary {
  id: number;
  name: string;
}

export interface RegistrationListItem {
  id: number;
  competitionId: number;
  teamName?: string;
  companyName?: string;
  projectName?: string;
  contactName: string;
  contactPhone: string;
  status: number;
  createdTime: string;
  reviewTime?: string;
  reviewer?: ReviewerSummary | null;
}

export interface RegistrationSummary {
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
}

export interface AccountSummary {
  id: number;
  username: string;
  email?: string | null;
  phone?: string | null;
}

export interface IndustrySummary {
  id: number;
  name: string;
}

export interface ProjectSummary {
  id: number;
  name: string;
  companyName?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  description?: string | null;
  industryId?: number | null;
  location?: string | null;
  regionId?: number | null;
  fundingStageId?: number | null;
  fundingAmount?: string | null;
  valuation?: string | null;
  fundingNeeds?: string | null;
  industry?: IndustrySummary | null;
  introduction?: string | null;
  coreTechnology?: string | null;
  businessModel?: string | null;
  teamInfo?: string | null;
  fundingHistory?: string | null;
  developmentPlan?: string | null;
  marketAnalysis?: string | null;
  competitiveAdvantage?: string | null;
  foundingDate?: string | null;
  contactPerson?: string | null;
  contactPosition?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  website?: string | null;
  address?: string | null;
  businessPlanUrl?: string | null;
  status?: string | number | null;
  viewCount?: number | null;
  likeCount?: number | null;
  createdTime?: string | null;
  updatedTime?: string | null;
  fundingStage?: { id: number; name: string } | null;
  region?: { id: number; name: string } | null;
  businessPlanFile?: { id: string; name?: string | null; url?: string | null } | null;
  presentationFile?: { id: string; name?: string | null; url?: string | null } | null;
  logoFile?: { id: string; name?: string | null; url?: string | null } | null;
  businessPlanFile?: { id: string; name?: string | null; url?: string | null } | null;
  presentationFile?: { id: string; name?: string | null; url?: string | null } | null;
}

export interface CompetitionSummary {
  id: number;
  title: string;
}

export interface AttachmentItem {
  id: string;
  type: "businessPlanFile" | "businessPlanUrl" | "demoFile";
  name: string;
  downloadUrl: string | null;
}

export interface RegistrationReviewHistoryItem {
  status: number;
  reviewTime: string;
  reviewer?: ReviewerSummary | null;
  comment?: string | null;
}

export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  experience?: string;
  skills?: string[];
}

export interface RegistrationDetail {
  id: number;
  competitionId: number;
  competition?: CompetitionSummary | null;
  teamName?: string;
  companyName?: string;
  projectName?: string;
  projectDescription?: string | null;
  teamSize?: string | null;
  startupExperience?: string | null;
  contactName: string;
  contactPhone: string;
  contactEmail?: string | null;
  position?: string | null;
  industryName?: string | null;
  status: number;
  reviewComment?: string | null;
  reviewTime?: string | null;
  createdTime: string;
  updatedTime: string;
  reviewer?: ReviewerSummary | null;
  account?: AccountSummary | null;
  industry?: IndustrySummary | null;
  project?: ProjectSummary | null;
  attachments: AttachmentItem[];
  reviewHistory: RegistrationReviewHistoryItem[];
  teamMembers?: TeamMember[];
  businessPlanUrl?: string | null;
}

export type RegistrationItem = RegistrationDetail;

export interface RegistrationListResponse {
  list: RegistrationListItem[];
  total: number;
  pageNum: number;
  pageSize: number;
  summary: RegistrationSummary;
}

export const REGISTRATION_STATUS_MAP = {
  1: { text: "待审核", type: "warning" },
  2: { text: "已通过", type: "success" },
  3: { text: "已拒绝", type: "danger" },
  4: { text: "已取消", type: "info" },
} as const;