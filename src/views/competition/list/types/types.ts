// 竞赛查询参数
export interface CompetitionQueryParams {
  pageNum?: number;
  pageSize?: number;
  title?: string;
  industryId?: string;
  regionId?: string;
  status?: string;
}

// 竞赛表单数据
export interface CompetitionForm {
  id?: number;
  title: string;
  industryId: number | null;
  regionId: number | null;
  organizer: string;
  organizerLogo?: string;
  coOrganizers?: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  location: string;
  onlineUrl?: string;
  description: string;
  summary?: string;
  materialDescription?: string;
  requirements?: string;
  prizes?: string;
  judges?: string;
  schedule?: string;
  status: number;
  isRecommended: boolean;
  poster?: string;
}

// 竞赛信息
export interface CompetitionInfo {
  id: number;
  title: string;
  industryId: number;
  regionId: number;
  organizer: string;
  organizerLogo?: string;
  coOrganizers?: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  location: string;
  onlineUrl?: string;
  description: string;
  summary?: string;
  materialDescription?: string;
  requirements?: string;
  prizes?: string;
  judges?: string;
  schedule?: string;
  status: number;
  isRecommended: boolean;
  poster?: string;
  viewCount: number;
  registrationCount: number;
  reviewComment?: string;
  reviewTime?: string;
  createdTime: string;
  updateTime: string;
  industry?: {
    id: number;
    name: string;
  };
  region?: {
    id: number;
    name: string;
  };
}

export type FormItemProps = CompetitionForm;

export type CompetitionItem = CompetitionInfo;

export type CompetitionListResponse = {
  list: CompetitionItem[];
  total: number;
  pageSize: number;
  currentPage: number;
};

// 竞赛资料类型定义
export interface CompetitionMaterial {
  id?: number;
  competitionId: number;
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  category: 'download' | 'link';
  linkUrl?: string;
  linkType?: string;
  downloadCount?: number;
  isRequired: boolean;
  sortOrder: number;
  status: number;
  uploaderId?: number;
  createdTime?: string;
  updatedTime?: string;
}

// 竞赛资料创建表单
export interface CompetitionMaterialForm {
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  category: 'download' | 'link';
  linkUrl?: string;
  linkType?: string;
  isRequired?: boolean;
  sortOrder?: number;
}

// 竞赛资料查询参数
export interface CompetitionMaterialQueryParams {
  competitionId: number;
  category?: 'download' | 'link';
  status?: number;
}

// 竞赛资料列表响应
export interface CompetitionMaterialListResponse {
  list: CompetitionMaterial[];
  total: number;
}