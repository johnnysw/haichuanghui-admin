// 重新导出列表页面的API函数
export * from "../../list/api";

import type { InvestmentCase, ReviewRecord, ApiResponse } from "../types/types";

// 模拟投资案例数据
const mockInvestmentCases: InvestmentCase[] = [
  {
    id: 1,
    investorId: 1,
    projectName: "智能语音助手",
    companyName: "科技创新公司A",
    industry: "人工智能",
    stage: "A轮",
    amount: 500,
    investmentDate: "2022-03-15",
    status: "进行中",
    description: "专注于智能语音识别和自然语言处理技术",
    logo: "https://picsum.photos/seed/case1/100/100",
    website: "https://example.com"
  },
  {
    id: 2,
    investorId: 1,
    projectName: "企业数字化平台",
    companyName: "数字化解决方案B",
    industry: "企业服务",
    stage: "B轮",
    amount: 1200,
    investmentDate: "2021-11-20",
    status: "已退出",
    description: "为中小企业提供一站式数字化转型解决方案",
    logo: "https://picsum.photos/seed/case2/100/100"
  },
  {
    id: 3,
    investorId: 1,
    projectName: "智慧医疗系统",
    companyName: "医疗科技C",
    industry: "医疗健康",
    stage: "天使轮",
    amount: 200,
    investmentDate: "2023-01-10",
    status: "进行中",
    description: "基于AI的医疗诊断和治疗辅助系统",
    logo: "https://picsum.photos/seed/case3/100/100"
  }
];

// 模拟审核记录数据
const mockReviewRecords: ReviewRecord[] = [
  {
    id: 1,
    investorId: 1,
    reviewerId: 1,
    status: 1,
    comment: "资质符合要求，投资经验丰富，审核通过",
    reviewTime: "2024-01-15 10:30:00",
    reviewer: {
      id: 1,
      username: "admin",
      realName: "管理员"
    }
  },
  {
    id: 2,
    investorId: 1,
    reviewerId: 2,
    status: 2,
    comment: "初步审核通过，等待最终确认",
    reviewTime: "2024-01-12 16:20:00",
    reviewer: {
      id: 2,
      username: "reviewer1",
      realName: "审核员1"
    }
  }
];

// 获取投资案例列表
export const getInvestmentCases = (investorId: number): Promise<ApiResponse<InvestmentCase[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cases = mockInvestmentCases.filter(item => item.investorId === investorId);
      resolve({
        code: 200,
        success: true,
        data: cases,
        message: "获取投资案例成功"
      });
    }, 200);
  });
};

// 获取审核记录
export const getReviewRecords = (investorId: number): Promise<ApiResponse<ReviewRecord[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const records = mockReviewRecords.filter(item => item.investorId === investorId);
      resolve({
        code: 200,
        success: true,
        data: records,
        message: "获取审核记录成功"
      });
    }, 200);
  });
};

// 添加投资案例
export const addInvestmentCase = (data: Omit<InvestmentCase, "id">): Promise<ApiResponse<InvestmentCase>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCase: InvestmentCase = {
        ...data,
        id: Date.now()
      };
      
      mockInvestmentCases.push(newCase);
      
      resolve({
        code: 200,
        success: true,
        data: newCase,
        message: "添加投资案例成功"
      });
    }, 300);
  });
};

// 更新投资案例
export const updateInvestmentCase = (id: number, data: Partial<InvestmentCase>): Promise<ApiResponse<InvestmentCase>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInvestmentCases.findIndex(item => item.id === id);
      if (index !== -1) {
        mockInvestmentCases[index] = { ...mockInvestmentCases[index], ...data };
        resolve({
          code: 200,
          success: true,
          data: mockInvestmentCases[index],
          message: "更新投资案例成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "投资案例不存在"
        });
      }
    }, 300);
  });
};

// 删除投资案例
export const deleteInvestmentCase = (id: number): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInvestmentCases.findIndex(item => item.id === id);
      if (index !== -1) {
        mockInvestmentCases.splice(index, 1);
        resolve({
          code: 200,
          success: true,
          data: null,
          message: "删除投资案例成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "投资案例不存在"
        });
      }
    }, 300);
  });
};