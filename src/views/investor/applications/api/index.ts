import { http } from "@/utils/http";
import type {
  ApplicationQueryParams,
  InvestorApplication,
  ApplicationDocument,
  ReviewForm,
  ApiResponse,
  PaginatedResponse
} from "../types/types";

// 模拟申请文档数据
const mockDocuments: ApplicationDocument[] = [
  {
    id: 1,
    applicationId: 1,
    type: "identity",
    fileName: "身份证正面.jpg",
    fileUrl: "https://picsum.photos/seed/id1/400/300",
    fileSize: 1024 * 500, // 500KB
    uploadTime: "2024-01-10 14:30:00",
    status: "approved",
    comment: "文件清晰，信息完整"
  },
  {
    id: 2,
    applicationId: 1,
    type: "identity",
    fileName: "身份证反面.jpg",
    fileUrl: "https://picsum.photos/seed/id2/400/300",
    fileSize: 1024 * 480,
    uploadTime: "2024-01-10 14:31:00",
    status: "approved"
  },
  {
    id: 3,
    applicationId: 1,
    type: "institution",
    fileName: "工作证明.pdf",
    fileUrl: "/files/work-certificate-1.pdf",
    fileSize: 1024 * 1024 * 2, // 2MB
    uploadTime: "2024-01-10 14:32:00",
    status: "pending"
  },
  {
    id: 4,
    applicationId: 1,
    type: "investment",
    fileName: "投资案例证明.pdf",
    fileUrl: "/files/investment-cases-1.pdf",
    fileSize: 1024 * 1024 * 3, // 3MB
    uploadTime: "2024-01-10 14:35:00",
    status: "rejected",
    comment: "投资案例不够详细，请补充更多信息"
  }
];

// 模拟申请数据
const mockApplications: InvestorApplication[] = [
  {
    id: 1,
    userId: 201,
    investmentInstitution: "深圳创新投资基金",
    regionId: 3,
    investorTypeId: 1,
    location: "深圳",
    investmentAmountMin: 200,
    investmentAmountMax: 3000,
    description: "专注于早期科技创新项目投资",
    investmentPreference: "关注人工智能、物联网、新材料等前沿技术领域",
    institutionInfo: "深圳创新投资基金成立于2018年，管理资金规模20亿元",
    bio: "8年投资经验，曾在知名VC机构担任投资总监",
    status: 2, // 待审核
    reviewerId: undefined,
    submittedTime: "2024-01-10 14:30:00",
    updatedTime: "2024-01-10 14:30:00",
    user: {
      id: 201,
      username: "investor_zhang",
      email: "zhang@innovation.com",
      phone: "138****1234",
      avatar: "https://picsum.photos/seed/applicant1/100/100",
      realName: "张投资"
    },
    region: {
      id: 3,
      name: "深圳"
    },
    investorType: {
      id: 1,
      name: "机构投资人"
    },
    focusIndustries: [
      { id: 1, name: "人工智能" },
      { id: 8, name: "物联网" },
      { id: 3, name: "新材料" }
    ],
    preferredStages: [
      { id: 2, name: "天使轮" },
      { id: 4, name: "A轮" }
    ],
    documents: mockDocuments.filter(doc => doc.applicationId === 1)
  },
  {
    id: 2,
    userId: 202,
    investmentInstitution: "北京天使投资联盟",
    regionId: 1,
    investorTypeId: 2,
    location: "北京",
    investmentAmountMin: 50,
    investmentAmountMax: 1000,
    description: "专注天使轮投资，偏好消费和教育领域",
    investmentPreference: "关注有创新商业模式的消费类和教育科技项目",
    bio: "连续创业者，现专注天使投资",
    status: 1, // 已通过
    reviewerId: 1,
    reviewComment: "资质符合要求，审核通过",
    reviewTime: "2024-01-08 16:45:00",
    submittedTime: "2024-01-05 10:20:00",
    updatedTime: "2024-01-08 16:45:00",
    user: {
      id: 202,
      username: "angel_li",
      email: "li@angel.com",
      phone: "139****5678",
      avatar: "https://picsum.photos/seed/applicant2/100/100",
      realName: "李天使"
    },
    reviewer: {
      id: 1,
      username: "admin",
      realName: "管理员"
    },
    region: {
      id: 1,
      name: "北京"
    },
    investorType: {
      id: 2,
      name: "天使投资人"
    },
    focusIndustries: [
      { id: 5, name: "消费互联网" },
      { id: 6, name: "教育科技" }
    ],
    documents: []
  },
  {
    id: 3,
    userId: 203,
    investmentInstitution: "上海科技创投",
    regionId: 2,
    investorTypeId: 1,
    location: "上海",
    investmentAmountMin: 500,
    investmentAmountMax: 8000,
    description: "专注中后期科技项目投资",
    status: 3, // 已拒绝
    reviewerId: 2,
    reviewComment: "投资经验证明不足，机构背景需要进一步核实",
    reviewTime: "2024-01-12 11:30:00",
    submittedTime: "2024-01-08 09:15:00",
    updatedTime: "2024-01-12 11:30:00",
    user: {
      id: 203,
      username: "tech_wang",
      email: "wang@techvc.com",
      phone: "136****9999",
      avatar: "https://picsum.photos/seed/applicant3/100/100",
      realName: "王科技"
    },
    reviewer: {
      id: 2,
      username: "reviewer1",
      realName: "审核员1"
    },
    region: {
      id: 2,
      name: "上海"
    },
    investorType: {
      id: 1,
      name: "机构投资人"
    },
    documents: []
  },
  {
    id: 4,
    userId: 204,
    investmentInstitution: "上海创业投资公司",
    regionId: 2,
    investorTypeId: 1,
    location: "上海",
    investmentAmountMin: 500,
    investmentAmountMax: 10000,
    description: "专注中后期项目投资，关注成长性企业",
    investmentPreference: "重点关注B2B企业服务、医疗健康、新零售等领域",
    institutionInfo: "上海创业投资公司成立于2012年，累计投资80余家企业",
    bio: "12年投资银行经验，专业的投后管理能力",
    status: 2, // 待审核
    reviewerId: undefined,
    submittedTime: "2024-01-12 11:20:00",
    updatedTime: "2024-01-12 11:20:00",
    user: {
      id: 204,
      username: "vc_partner_li",
      email: "li@shvc.com",
      phone: "136****5678",
      avatar: "https://picsum.photos/seed/applicant4/100/100",
      realName: "李合伙人"
    },
    region: {
      id: 2,
      name: "上海"
    },
    investorType: {
      id: 1,
      name: "机构投资人"
    },
    focusIndustries: [
      { id: 2, name: "企业服务" },
      { id: 7, name: "医疗健康" },
      { id: 9, name: "新零售" }
    ],
    preferredStages: [
      { id: 5, name: "B轮" },
      { id: 6, name: "C轮" }
    ],
    documents: []
  },
  {
    id: 5,
    userId: 205,
    investmentInstitution: "",
    regionId: 4,
    investorTypeId: 2,
    location: "杭州",
    investmentAmountMin: 10,
    investmentAmountMax: 200,
    description: "个人天使投资者，前阿里巴巴技术专家",
    investmentPreference: "专注电商、金融科技、企业SaaS等领域的早期项目",
    bio: "10年阿里工作经验，深度理解互联网商业模式",
    status: 3, // 已拒绝
    reviewerId: 1,
    reviewComment: "投资经历证明材料不足，建议补充更多投资案例",
    reviewTime: "2024-01-11 15:30:00",
    submittedTime: "2024-01-09 09:15:00",
    updatedTime: "2024-01-11 15:30:00",
    user: {
      id: 205,
      username: "angel_wu",
      email: "wu@alibaba-inc.com",
      phone: "137****9876",
      avatar: "https://picsum.photos/seed/applicant5/100/100",
      realName: "吴天使"
    },
    region: {
      id: 4,
      name: "杭州"
    },
    investorType: {
      id: 2,
      name: "个人投资者"
    },
    focusIndustries: [
      { id: 9, name: "新零售" },
      { id: 8, name: "金融科技" },
      { id: 2, name: "企业服务" }
    ],
    preferredStages: [
      { id: 1, name: "种子轮" },
      { id: 2, name: "天使轮" }
    ],
    documents: []
  },
  {
    id: 6,
    userId: 206,
    investmentInstitution: "深圳科技创投",
    regionId: 3,
    investorTypeId: 1,
    location: "深圳",
    investmentAmountMin: 300,
    investmentAmountMax: 5000,
    description: "专注硬科技投资的专业机构",
    investmentPreference: "重点投资半导体、新能源、智能制造等硬科技领域",
    institutionInfo:
      "深圳科技创投专注硬科技投资15年，投资项目估值累计超过500亿",
    bio: "清华大学博士，15年硬科技投资经验",
    status: 1, // 已通过
    reviewerId: 1,
    reviewComment: "专业背景优秀，投资经验丰富，审核通过",
    reviewTime: "2024-01-10 10:45:00",
    submittedTime: "2024-01-08 14:30:00",
    updatedTime: "2024-01-10 10:45:00",
    user: {
      id: 206,
      username: "hardtech_investor",
      email: "chen@sztechvc.com",
      phone: "135****4321",
      avatar: "https://picsum.photos/seed/applicant6/100/100",
      realName: "陈博士"
    },
    region: {
      id: 3,
      name: "深圳"
    },
    investorType: {
      id: 1,
      name: "机构投资人"
    },
    focusIndustries: [
      { id: 10, name: "半导体" },
      { id: 3, name: "新能源" },
      { id: 4, name: "智能制造" }
    ],
    preferredStages: [
      { id: 4, name: "A轮" },
      { id: 5, name: "B轮" }
    ],
    documents: []
  },
  {
    id: 7,
    userId: 207,
    investmentInstitution: "广州文创基金",
    regionId: 5,
    investorTypeId: 1,
    location: "广州",
    investmentAmountMin: 100,
    investmentAmountMax: 2000,
    description: "专注文化创意产业投资",
    investmentPreference: "重点关注影视娱乐、游戏动漫、文化旅游等文创领域",
    institutionInfo: "广州文创基金由政府引导设立，专注文创产业投资",
    bio: "文创行业资深从业者，对文化产业有深刻理解",
    status: 2, // 待审核
    reviewerId: undefined,
    submittedTime: "2024-01-13 16:00:00",
    updatedTime: "2024-01-13 16:00:00",
    user: {
      id: 207,
      username: "culture_fund",
      email: "huang@gzculture.com",
      phone: "134****8765",
      avatar: "https://picsum.photos/seed/applicant7/100/100",
      realName: "黄文创"
    },
    region: {
      id: 5,
      name: "广州"
    },
    investorType: {
      id: 1,
      name: "机构投资人"
    },
    focusIndustries: [
      { id: 11, name: "影视娱乐" },
      { id: 12, name: "游戏动漫" },
      { id: 13, name: "文化旅游" }
    ],
    preferredStages: [
      { id: 2, name: "天使轮" },
      { id: 4, name: "A轮" }
    ],
    documents: []
  },
  {
    id: 8,
    userId: 208,
    investmentInstitution: "",
    regionId: 1,
    investorTypeId: 2,
    location: "北京",
    investmentAmountMin: 50,
    investmentAmountMax: 1500,
    description: "前字节跳动产品总监，现专注移动互联网投资",
    investmentPreference: "关注短视频、社交、工具类移动应用的早期投资机会",
    bio: "8年移动互联网产品经验，对用户需求有敏锐洞察",
    status: 2, // 待审核
    reviewerId: undefined,
    submittedTime: "2024-01-14 10:30:00",
    updatedTime: "2024-01-14 10:30:00",
    user: {
      id: 208,
      username: "mobile_expert",
      email: "liu@bytedance.com",
      phone: "138****2468",
      avatar: "https://picsum.photos/seed/applicant8/100/100",
      realName: "刘产品"
    },
    region: {
      id: 1,
      name: "北京"
    },
    investorType: {
      id: 2,
      name: "个人投资者"
    },
    focusIndustries: [
      { id: 14, name: "短视频" },
      { id: 10, name: "社交网络" },
      { id: 15, name: "移动应用" }
    ],
    preferredStages: [
      { id: 1, name: "种子轮" },
      { id: 2, name: "天使轮" }
    ],
    documents: []
  }
];

// 获取申请列表
/* export const getApplicationList = (params: ApplicationQueryParams): Promise<ApiResponse<PaginatedResponse<InvestorApplication>>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockApplications];

      // 搜索过滤
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.user.realName?.toLowerCase().includes(searchTerm) ||
          item.investmentInstitution.toLowerCase().includes(searchTerm) ||
          item.user.email?.toLowerCase().includes(searchTerm) ||
          item.user.phone?.includes(searchTerm)
        );
      }

      // 状态过滤
      if (params.status && params.status !== "") {
        const statusNum = parseInt(params.status);
        filteredData = filteredData.filter(item => item.status === statusNum);
      }

      // 审核员过滤
      if (params.reviewerId) {
        filteredData = filteredData.filter(item => item.reviewerId === params.reviewerId);
      }

      // 日期范围过滤
      if (params.dateRange && params.dateRange.length === 2) {
        const [startDate, endDate] = params.dateRange;
        filteredData = filteredData.filter(item => {
          const submitDate = new Date(item.submittedTime);
          return submitDate >= new Date(startDate) && submitDate <= new Date(endDate);
        });
      }

      // 分页
      const start = (params.page - 1) * params.limit;
      const end = start + params.limit;
      const paginatedData = filteredData.slice(start, end);

      resolve({
        code: 200,
        success: true,
        data: {
          list: paginatedData,
          total: filteredData.length,
          page: params.page,
          limit: params.limit
        },
        message: "获取申请列表成功"
      });
    }, 300);
  });
}; */

// 获取申请详情
/* export const getApplicationDetail = (id: number): Promise<ApiResponse<InvestorApplication>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const application = mockApplications.find(item => item.id === id);
      if (application) {
        resolve({
          code: 200,
          success: true,
          data: application,
          message: "获取申请详情成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "申请不存在"
        });
      }
    }, 200);
  });
}; */

// 审核申请
/* export const reviewApplication = (id: number, reviewData: ReviewForm): Promise<ApiResponse<InvestorApplication>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockApplications.findIndex(item => item.id === id);
      if (index !== -1) {
        mockApplications[index] = {
          ...mockApplications[index],
          status: reviewData.status,
          reviewComment: reviewData.comment,
          reviewTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          reviewerId: 1, // 当前审核员ID
          updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        // 如果有文档审核信息，更新文档状态
        if (reviewData.documentReviews) {
          reviewData.documentReviews.forEach(docReview => {
            const docIndex = mockDocuments.findIndex(doc => doc.id === docReview.documentId);
            if (docIndex !== -1) {
              mockDocuments[docIndex] = {
                ...mockDocuments[docIndex],
                status: docReview.status,
                comment: docReview.comment
              };
            }
          });
        }
        
        resolve({
          code: 200,
          success: true,
          data: mockApplications[index],
          message: "审核申请成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "申请不存在"
        });
      }
    }, 500);
  });
}; */

// 批量审核申请
/* export const batchReviewApplications = (ids: number[], reviewData: ReviewForm): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let successCount = 0;
      
      ids.forEach(id => {
        const index = mockApplications.findIndex(item => item.id === id);
        if (index !== -1) {
          mockApplications[index] = {
            ...mockApplications[index],
            status: reviewData.status,
            reviewComment: reviewData.comment,
            reviewTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            reviewerId: 1,
            updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
          };
          successCount++;
        }
      });
      
      resolve({
        code: 200,
        success: true,
        data: null,
        message: `成功审核 ${successCount} 个申请`
      });
    }, 800);
  });
}; */

// 删除申请
/* export const deleteApplication = (id: number): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockApplications.findIndex(item => item.id === id);
      if (index !== -1) {
        mockApplications.splice(index, 1);
        resolve({
          code: 200,
          success: true,
          data: null,
          message: "删除申请成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "申请不存在"
        });
      }
    }, 300);
  });
}; */

// 获取申请统计信息
/* export const getApplicationStats = (): Promise<ApiResponse<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  todaySubmitted: number;
}>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats = {
        total: mockApplications.length,
        pending: mockApplications.filter(app => app.status === 2).length,
        approved: mockApplications.filter(app => app.status === 1).length,
        rejected: mockApplications.filter(app => app.status === 3).length,
        todaySubmitted: mockApplications.filter(app => {
          const today = new Date().toISOString().slice(0, 10);
          return app.submittedTime.slice(0, 10) === today;
        }).length
      };

      resolve({
        code: 200,
        success: true,
        data: stats,
        message: "获取统计信息成功"
      });
    }, 200);
  });
}; */

// 获取申请列表
export const getApplicationList = (
  params: ApplicationQueryParams
): Promise<ApiResponse<PaginatedResponse<InvestorApplication>>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredData = [...mockApplications];

      // 搜索过滤
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredData = filteredData.filter(
          item =>
            item.user.realName?.toLowerCase().includes(searchTerm) ||
            item.investmentInstitution.toLowerCase().includes(searchTerm) ||
            item.user.email?.toLowerCase().includes(searchTerm) ||
            item.user.phone?.includes(searchTerm)
        );
      }

      // 状态过滤
      if (params.status && params.status !== "") {
        const statusNum = parseInt(params.status);
        filteredData = filteredData.filter(item => item.status === statusNum);
      }

      // 审核员过滤
      if (params.reviewerId) {
        filteredData = filteredData.filter(
          item => item.reviewerId === params.reviewerId
        );
      }

      // 日期范围过滤
      if (params.dateRange && params.dateRange.length === 2) {
        const [startDate, endDate] = params.dateRange;
        filteredData = filteredData.filter(item => {
          const submitDate = new Date(item.submittedTime);
          return (
            submitDate >= new Date(startDate) && submitDate <= new Date(endDate)
          );
        });
      }

      // 分页
      const start = (params.page - 1) * params.limit;
      const end = start + params.limit;
      const paginatedData = filteredData.slice(start, end);

      resolve({
        code: 200,
        success: true,
        data: {
          list: paginatedData,
          total: filteredData.length,
          page: params.page,
          limit: params.limit
        },
        message: "获取申请列表成功"
      });
    }, 300);
  });
};

// 获取申请详情
export const getApplicationDetail = (
  id: number
): Promise<ApiResponse<InvestorApplication>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const application = mockApplications.find(item => item.id === id);
      if (application) {
        resolve({
          code: 200,
          success: true,
          data: application,
          message: "获取申请详情成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "申请不存在"
        });
      }
    }, 200);
  });
};

// 审核申请
export const reviewApplication = (
  id: number,
  reviewData: ReviewForm
): Promise<ApiResponse<InvestorApplication>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = mockApplications.findIndex(item => item.id === id);
      if (index !== -1) {
        mockApplications[index] = {
          ...mockApplications[index],
          status: reviewData.status,
          reviewComment: reviewData.comment,
          reviewTime: new Date().toISOString().slice(0, 19).replace("T", " "),
          reviewerId: 1, // 当前审核员ID
          updatedTime: new Date().toISOString().slice(0, 19).replace("T", " ")
        };

        // 如果有文档审核信息，更新文档状态
        if (reviewData.documentReviews) {
          reviewData.documentReviews.forEach(docReview => {
            const docIndex = mockDocuments.findIndex(
              doc => doc.id === docReview.documentId
            );
            if (docIndex !== -1) {
              mockDocuments[docIndex] = {
                ...mockDocuments[docIndex],
                status: docReview.status,
                comment: docReview.comment
              };
            }
          });
        }

        resolve({
          code: 200,
          success: true,
          data: mockApplications[index],
          message: "审核申请成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "申请不存在"
        });
      }
    }, 500);
  });
};

// 批量审核申请
export const batchReviewApplications = (
  ids: number[],
  reviewData: ReviewForm
): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let successCount = 0;

      ids.forEach(id => {
        const index = mockApplications.findIndex(item => item.id === id);
        if (index !== -1) {
          mockApplications[index] = {
            ...mockApplications[index],
            status: reviewData.status,
            reviewComment: reviewData.comment,
            reviewTime: new Date().toISOString().slice(0, 19).replace("T", " "),
            reviewerId: 1,
            updatedTime: new Date().toISOString().slice(0, 19).replace("T", " ")
          };
          successCount++;
        }
      });

      resolve({
        code: 200,
        success: true,
        data: null,
        message: `成功审核 ${successCount} 个申请`
      });
    }, 800);
  });
};

// 删除申请
export const deleteApplication = (id: number): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = mockApplications.findIndex(item => item.id === id);
      if (index !== -1) {
        mockApplications.splice(index, 1);
        resolve({
          code: 200,
          success: true,
          data: null,
          message: "删除申请成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "申请不存在"
        });
      }
    }, 300);
  });
};

// 获取申请统计信息
export const getApplicationStats = (): Promise<
  ApiResponse<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    todaySubmitted: number;
  }>
> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const stats = {
        total: mockApplications.length,
        pending: mockApplications.filter(app => app.status === 2).length,
        approved: mockApplications.filter(app => app.status === 1).length,
        rejected: mockApplications.filter(app => app.status === 3).length,
        todaySubmitted: mockApplications.filter(app => {
          const today = new Date().toISOString().slice(0, 10);
          return app.submittedTime.slice(0, 10) === today;
        }).length
      };

      resolve({
        code: 200,
        success: true,
        data: stats,
        message: "获取统计信息成功"
      });
    }, 200);
  });
};

// 更新申请（基础信息）
export const updateApplication = (
  id: number,
  payload: Partial<InvestorApplication>
): Promise<ApiResponse<InvestorApplication>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = mockApplications.findIndex(item => item.id === id);
      if (index !== -1) {
        mockApplications[index] = {
          ...mockApplications[index],
          ...payload,
          updatedTime: new Date().toISOString().slice(0, 19).replace("T", " ")
        };
        resolve({
          code: 200,
          success: true,
          data: mockApplications[index],
          message: "更新申请成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "申请不存在"
        });
      }
    }, 300);
  });
};

// 审核员列表（模拟）
export const getReviewerList = (): Promise<
  ApiResponse<Array<{ id: number; username: string; realName?: string }>>
> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const reviewers = [
        { id: 1, username: "admin", realName: "管理员" },
        { id: 2, username: "reviewer1", realName: "审核员1" },
        { id: 3, username: "reviewer2", realName: "审核员2" }
      ];
      resolve({
        code: 200,
        success: true,
        data: reviewers,
        message: "获取审核员列表成功"
      });
    }, 150);
  });
};

// 指派审核员
export const assignReviewer = (
  id: number,
  reviewerId: number
): Promise<ApiResponse<InvestorApplication>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = mockApplications.findIndex(item => item.id === id);
      if (index !== -1) {
        const reviewerMap: Record<
          number,
          { id: number; username: string; realName?: string }
        > = {
          1: { id: 1, username: "admin", realName: "管理员" },
          2: { id: 2, username: "reviewer1", realName: "审核员1" },
          3: { id: 3, username: "reviewer2", realName: "审核员2" }
        };
        mockApplications[index] = {
          ...mockApplications[index],
          reviewerId,
          reviewer: reviewerMap[reviewerId],
          updatedTime: new Date().toISOString().slice(0, 19).replace("T", " ")
        };
        resolve({
          code: 200,
          success: true,
          data: mockApplications[index],
          message: "指派审核员成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "申请不存在"
        });
      }
    }, 200);
  });
};
