// 重新导出申请相关类型
export * from "../../types/types";
import type { InvestorApplication, ApplicationDocument } from "../../types/types";

// 申请详情页面状态
export interface ApplicationDetailState {
  loading: boolean;
  application: InvestorApplication | null;
  notFound: boolean;
}

// 文档预览状态
export interface DocumentPreviewState {
  visible: boolean;
  loading: boolean;
  document: ApplicationDocument | null;
  previewUrl: string;
}

// 审核历史记录
export interface ReviewHistory {
  id: number;
  applicationId: number;
  reviewerId: number;
  status: number;
  comment: string;
  reviewTime: string;
  reviewer: {
    id: number;
    username: string;
    realName?: string;
  };
}

// 申请进度步骤
export interface ApplicationStep {
  title: string;
  description?: string;
  status: 'wait' | 'process' | 'finish' | 'error';
  timestamp?: string;
}

// 文档上传进度
export interface UploadProgress {
  documentId: number;
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}