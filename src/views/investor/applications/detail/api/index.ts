// 重新导出申请相关API
export * from "../../api";

import type { ReviewHistory, ApiResponse } from "../types/types";

// 模拟审核历史数据
const mockReviewHistory: ReviewHistory[] = [
  {
    id: 1,
    applicationId: 1,
    reviewerId: 1,
    status: 2,
    comment: "申请已提交，等待审核",
    reviewTime: "2024-01-10 14:30:00",
    reviewer: {
      id: 0,
      username: "system",
      realName: "系统"
    }
  },
  {
    id: 2,
    applicationId: 1,
    reviewerId: 2,
    status: 2,
    comment: "初步审核中，需要补充投资证明材料",
    reviewTime: "2024-01-12 09:15:00",
    reviewer: {
      id: 2,
      username: "reviewer1",
      realName: "审核员1"
    }
  },
  {
    id: 3,
    applicationId: 1,
    reviewerId: 2,
    status: 2,
    comment: "已补充材料，继续审核中",
    reviewTime: "2024-01-15 16:20:00",
    reviewer: {
      id: 2,
      username: "reviewer1",
      realName: "审核员1"
    }
  }
];

// 获取审核历史
export const getReviewHistory = (
  applicationId: number
): Promise<ApiResponse<ReviewHistory[]>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const history = mockReviewHistory.filter(
        item => item.applicationId === applicationId
      );
      resolve({
        code: 200,
        success: true,
        data: history,
        message: "获取审核历史成功"
      });
    }, 200);
  });
};

// 添加审核记录
export const addReviewRecord = (
  applicationId: number,
  comment: string
): Promise<ApiResponse<ReviewHistory>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newRecord: ReviewHistory = {
        id: Date.now(),
        applicationId,
        reviewerId: 1, // 当前用户ID
        status: 2,
        comment,
        reviewTime: new Date().toISOString().slice(0, 19).replace("T", " "),
        reviewer: {
          id: 1,
          username: "admin",
          realName: "管理员"
        }
      };

      mockReviewHistory.push(newRecord);

      resolve({
        code: 200,
        success: true,
        data: newRecord,
        message: "添加审核记录成功"
      });
    }, 300);
  });
};

// 下载文档
export const downloadDocument = (
  documentId: number
): Promise<ApiResponse<{ downloadUrl: string }>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // 模拟生成下载链接
      const downloadUrl = `/api/documents/${documentId}/download?token=${Date.now()}`;

      resolve({
        code: 200,
        success: true,
        data: { downloadUrl },
        message: "获取下载链接成功"
      });
    }, 500);
  });
};

// 预览文档
export const previewDocument = (
  documentId: number
): Promise<ApiResponse<{ previewUrl: string }>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // 模拟生成预览链接
      const previewUrl = `https://picsum.photos/seed/doc${documentId}/800/600`;

      resolve({
        code: 200,
        success: true,
        data: { previewUrl },
        message: "获取预览链接成功"
      });
    }, 300);
  });
};

// 发送通知给申请人
export const sendNotificationToApplicant = (
  applicationId: number,
  message: string
): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        success: true,
        data: null,
        message: "通知发送成功"
      });
    }, 500);
  });
};

// 要求补充材料
export const requestAdditionalDocuments = (
  applicationId: number,
  requirements: string[]
): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        success: true,
        data: null,
        message: "补充材料要求已发送"
      });
    }, 500);
  });
};
