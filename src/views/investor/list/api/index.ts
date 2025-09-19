import { http } from "@/utils/http";
import type { 
  InvestorQueryParams, 
  InvestorInfo, 
  InvestorForm,
  ApiResponse, 
  PaginatedResponse,
  BaseOption 
} from "../types/types";

// 模拟投资人数据
const mockInvestors: InvestorInfo[] = [
  {
    id: 1,
    userId: 101,
    reviewerId: 1,
    investmentInstitution: "深圳创新资本投资有限公司",
    position: "partner",
    regionId: 1,
    investorTypeId: 1,
    location: "北京",
    investmentAmountMin: 100,
    investmentAmountMax: 5000,
    description: "专注于人工智能和企业服务领域的早期投资",
    investmentPreference: "关注技术创新型项目，偏好有技术壁垒的B2B企业服务，投资阶段主要集中在A轮到C轮",
    institutionInfo: "创新资本成立于2015年，管理资金规模50亿元，专注于科技领域投资",
    investmentCount: 25,
    successfulExits: 8,
    activeMonths: 36,
    responseRate: 85,
    avgResponseTime: "1天内",
    bio: "拥有10年以上投资经验，专注于人工智能和企业服务领域的早中期投资。曾主导投资过多家知名企业，包括ABC科技、XYZ平台等，具有丰富的行业资源和投后管理经验。清华大学MBA毕业，曾在知名投资机构工作5年，对技术类项目有深入理解和敏锐判断力。",
    verified: true,
    status: 1,
    reviewComment: "",
    reviewTime: "2024-01-15 10:30:00",
    isFeatured: true,
    viewCount: 1250,
    createdTime: "2023-12-01 09:00:00",
    updatedTime: "2024-01-15 10:30:00",
    user: {
      id: 101,
      username: "zhang_investor",
      email: "zhang.ming@chuangxin.com",
      phone: "13800138888",
      avatar: "https://picsum.photos/seed/investor1/100/100",
      realName: "张明"
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
      id: 1,
      name: "机构投资人"
    },
    focusIndustries: [
      { id: 1, name: "人工智能" },
      { id: 2, name: "企业服务" }
    ],
    preferredStages: [
      { id: 1, name: "天使轮" },
      { id: 2, name: "A轮" }
    ],
    preferredRegions: [
      { id: 1, name: "北京" },
      { id: 2, name: "上海" }
    ]
  },
  {
    id: 2,
    userId: 102,
    reviewerId: 1,
    investmentInstitution: "远景投资",
    regionId: 2,
    investorTypeId: 1,
    location: "上海",
    investmentAmountMin: 500,
    investmentAmountMax: 10000,
    description: "专注新能源和智能制造领域的中后期投资",
    investmentPreference: "关注具有技术壁垒的制造业项目",
    institutionInfo: "远景投资专注于新能源产业链投资",
    investmentCount: 18,
    successfulExits: 5,
    activeMonths: 24,
    responseRate: 92,
    avgResponseTime: "半天内",
    bio: "15年制造业经验，8年投资经验",
    verified: true,
    status: 1,
    reviewTime: "2024-01-10 14:20:00",
    isFeatured: false,
    viewCount: 890,
    createdTime: "2023-11-15 14:30:00",
    updatedTime: "2024-01-10 14:20:00",
    user: {
      id: 102,
      username: "investor002",
      email: "li@yuanjing.com",
      phone: "139****9999",
      avatar: "https://picsum.photos/seed/investor2/100/100",
      realName: "李华"
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
      { id: 3, name: "新能源" },
      { id: 4, name: "智能制造" }
    ],
    preferredStages: [
      { id: 3, name: "B轮" },
      { id: 4, name: "C轮" }
    ]
  },
  {
    id: 3,
    userId: 103,
    investmentInstitution: "启明创投",
    regionId: 1,
    investorTypeId: 2,
    location: "北京",
    investmentAmountMin: 50,
    investmentAmountMax: 2000,
    description: "关注消费互联网和教育科技的天使投资",
    investmentPreference: "偏好有创新商业模式的消费类项目",
    institutionInfo: "启明创投成立于2006年，专注早期投资",
    investmentCount: 32,
    successfulExits: 12,
    activeMonths: 48,
    responseRate: 78,
    avgResponseTime: "2天内",
    bio: "连续创业者，现专注天使投资",
    verified: false,
    status: 2,
    isFeatured: false,
    viewCount: 456,
    createdTime: "2024-01-01 16:00:00",
    updatedTime: "2024-01-05 11:15:00",
    user: {
      id: 103,
      username: "investor003",
      email: "wang@qiming.com",
      phone: "136****7777",
      avatar: "https://picsum.photos/seed/investor3/100/100",
      realName: "王芳"
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
    ]
  },
  {
    id: 4,
    userId: 104,
    reviewerId: 1,
    investmentInstitution: "红杉中国",
    regionId: 1,
    investorTypeId: 1,
    location: "北京",
    investmentAmountMin: 1000,
    investmentAmountMax: 50000,
    description: "全球领先的风险投资基金，专注于科技、医疗健康、消费品牌等领域",
    investmentPreference: "寻找具有颠覆性创新的早期和成长期公司",
    institutionInfo: "红杉资本中国基金，管理资金超过20亿美元",
    investmentCount: 180,
    successfulExits: 45,
    activeMonths: 120,
    responseRate: 92,
    avgResponseTime: "3小时内",
    bio: "15年投资经验，成功投资了众多独角兽企业",
    verified: true,
    status: 1,
    reviewComment: "",
    reviewTime: "2024-01-10 14:20:00",
    isFeatured: true,
    viewCount: 3280,
    createdTime: "2023-08-15 11:30:00",
    updatedTime: "2024-01-10 14:20:00",
    user: {
      id: 104,
      username: "sequoia_partner",
      email: "li@sequoiacap.com",
      phone: "139****9999",
      avatar: "https://picsum.photos/seed/investor4/100/100",
      realName: "李晓霞"
    },
    reviewer: {
      id: 1,
      username: "admin",
      realName: "管理员"
    },
    investorType: {
      id: 1,
      name: "机构投资者"
    },
    focusIndustries: [
      { id: 1, name: "人工智能" },
      { id: 7, name: "医疗健康" },
      { id: 8, name: "金融科技" }
    ]
  },
  {
    id: 5,
    userId: 105,
    reviewerId: 1,
    investmentInstitution: "经纬中国",
    regionId: 2,
    investorTypeId: 1,
    location: "上海",
    investmentAmountMin: 500,
    investmentAmountMax: 20000,
    description: "专注于中国市场的早期风险投资机构",
    investmentPreference: "关注移动互联网、企业服务、新零售等赛道",
    institutionInfo: "经纬中国成立于2008年，累计投资超过500家企业",
    investmentCount: 85,
    successfulExits: 22,
    activeMonths: 96,
    responseRate: 78,
    avgResponseTime: "1天内",
    bio: "专注早期投资，陪伴创业者成长",
    verified: true,
    status: 1,
    reviewComment: "",
    reviewTime: "2024-01-08 16:45:00",
    isFeatured: false,
    viewCount: 1850,
    createdTime: "2023-09-20 10:15:00",
    updatedTime: "2024-01-08 16:45:00",
    user: {
      id: 105,
      username: "matrix_vc",
      email: "wang@matrixpartners.com.cn",
      phone: "136****7777",
      avatar: "https://picsum.photos/seed/investor5/100/100",
      realName: "王磊"
    },
    reviewer: {
      id: 1,
      username: "admin",
      realName: "管理员"
    },
    investorType: {
      id: 1,
      name: "机构投资者"
    },
    focusIndustries: [
      { id: 2, name: "企业服务" },
      { id: 5, name: "消费互联网" },
      { id: 9, name: "新零售" }
    ]
  },
  {
    id: 6,
    userId: 106,
    reviewerId: undefined,
    investmentInstitution: "",
    regionId: 3,
    investorTypeId: 2,
    location: "深圳",
    investmentAmountMin: 50,
    investmentAmountMax: 1000,
    description: "资深天使投资人，前腾讯高级产品总监",
    investmentPreference: "专注移动互联网和社交网络领域的早期项目",
    institutionInfo: "",
    investmentCount: 15,
    successfulExits: 3,
    activeMonths: 24,
    responseRate: 65,
    avgResponseTime: "2天内",
    bio: "10年互联网产品经验，投资关注用户体验和商业模式创新",
    verified: false,
    status: 2,
    reviewComment: "",
    reviewTime: "",
    isFeatured: false,
    viewCount: 420,
    createdTime: "2024-01-05 09:30:00",
    updatedTime: "2024-01-05 09:30:00",
    user: {
      id: 106,
      username: "angel_chen",
      email: "chen@example.com",
      phone: "138****6666",
      avatar: "https://picsum.photos/seed/investor6/100/100",
      realName: "陈辉"
    },
    investorType: {
      id: 2,
      name: "个人投资者"
    },
    focusIndustries: [
      { id: 5, name: "消费互联网" },
      { id: 10, name: "社交网络" }
    ]
  },
  {
    id: 7,
    userId: 107,
    reviewerId: 1,
    investmentInstitution: "真格基金",
    regionId: 1,
    investorTypeId: 1,
    location: "北京",
    investmentAmountMin: 100,
    investmentAmountMax: 8000,
    description: "中国最活跃的早期投资机构之一，专注于A轮前投资",
    investmentPreference: "关注教育、消费、金融科技、企业服务等领域",
    institutionInfo: "真格基金成立于2011年，累计投资超过800家企业",
    investmentCount: 120,
    successfulExits: 35,
    activeMonths: 84,
    responseRate: 88,
    avgResponseTime: "6小时内",
    bio: "新东方联合创始人徐小平创立，关注年轻创业者",
    verified: true,
    status: 1,
    reviewComment: "",
    reviewTime: "2024-01-12 11:10:00",
    isFeatured: true,
    viewCount: 2150,
    createdTime: "2023-07-10 14:20:00",
    updatedTime: "2024-01-12 11:10:00",
    user: {
      id: 107,
      username: "zhenfund_partner",
      email: "liu@zhenfund.com",
      phone: "137****5555",
      avatar: "https://picsum.photos/seed/investor7/100/100",
      realName: "刘佳"
    },
    reviewer: {
      id: 1,
      username: "admin",
      realName: "管理员"
    },
    investorType: {
      id: 1,
      name: "机构投资者"
    },
    focusIndustries: [
      { id: 6, name: "教育科技" },
      { id: 8, name: "金融科技" },
      { id: 2, name: "企业服务" }
    ]
  },
  {
    id: 8,
    userId: 108,
    reviewerId: 1,
    investmentInstitution: "",
    regionId: 4,
    investorTypeId: 2,
    location: "杭州",
    investmentAmountMin: 20,
    investmentAmountMax: 500,
    description: "电商行业资深从业者，阿里巴巴前高管",
    investmentPreference: "专注电商、新零售、供应链管理等领域",
    institutionInfo: "",
    investmentCount: 8,
    successfulExits: 1,
    activeMonths: 18,
    responseRate: 55,
    avgResponseTime: "3天内",
    bio: "12年电商经验，深耕零售行业数字化转型",
    verified: false,
    status: 3,
    reviewComment: "提交材料不完整，请补充投资经历证明",
    reviewTime: "2024-01-06 13:25:00",
    isFeatured: false,
    viewCount: 180,
    createdTime: "2024-01-03 16:40:00",
    updatedTime: "2024-01-06 13:25:00",
    user: {
      id: 108,
      username: "ecommerce_expert",
      email: "zhou@example.com",
      phone: "135****4444",
      avatar: "https://picsum.photos/seed/investor8/100/100",
      realName: "周强"
    },
    investorType: {
      id: 2,
      name: "个人投资者"
    },
    focusIndustries: [
      { id: 9, name: "新零售" },
      { id: 11, name: "供应链" }
    ]
  },
  {
    id: 9,
    userId: 109,
    reviewerId: 1,
    investmentInstitution: "IDG资本",
    regionId: 2,
    investorTypeId: 1,
    location: "上海",
    investmentAmountMin: 2000,
    investmentAmountMax: 80000,
    description: "亚洲领先的投资机构，专注科技、消费、医疗健康等领域",
    investmentPreference: "寻找有潜力成为行业领导者的成长期企业",
    institutionInfo: "IDG资本成立于1993年，管理资金超过60亿美元",
    investmentCount: 220,
    successfulExits: 68,
    activeMonths: 156,
    responseRate: 75,
    avgResponseTime: "2天内",
    bio: "25年投资历史，见证了中国科技行业的发展",
    verified: true,
    status: 1,
    reviewComment: "",
    reviewTime: "2024-01-09 15:30:00",
    isFeatured: false,
    viewCount: 2890,
    createdTime: "2023-06-01 08:00:00",
    updatedTime: "2024-01-09 15:30:00",
    user: {
      id: 109,
      username: "idg_capital",
      email: "yang@idgcap.com",
      phone: "132****3333",
      avatar: "https://picsum.photos/seed/investor9/100/100",
      realName: "杨峰"
    },
    reviewer: {
      id: 1,
      username: "admin",
      realName: "管理员"
    },
    investorType: {
      id: 1,
      name: "机构投资者"
    },
    focusIndustries: [
      { id: 1, name: "人工智能" },
      { id: 7, name: "医疗健康" },
      { id: 4, name: "智能制造" }
    ]
  },
  {
    id: 10,
    userId: 110,
    reviewerId: 1,
    investmentInstitution: "",
    regionId: 5,
    investorTypeId: 2,
    location: "广州",
    investmentAmountMin: 30,
    investmentAmountMax: 800,
    description: "前华为技术专家，专注硬科技投资",
    investmentPreference: "关注5G、物联网、智能硬件等技术创新项目",
    institutionInfo: "",
    investmentCount: 12,
    successfulExits: 2,
    activeMonths: 30,
    responseRate: 70,
    avgResponseTime: "1天内",
    bio: "15年通信行业经验，深度理解技术发展趋势",
    verified: true,
    status: 1,
    reviewComment: "",
    reviewTime: "2024-01-11 09:45:00",
    isFeatured: false,
    viewCount: 680,
    createdTime: "2023-11-15 12:30:00",
    updatedTime: "2024-01-11 09:45:00",
    user: {
      id: 110,
      username: "tech_investor",
      email: "wu@example.com",
      phone: "134****2222",
      avatar: "https://picsum.photos/seed/investor10/100/100",
      realName: "吴建华"
    },
    reviewer: {
      id: 1,
      username: "admin",
      realName: "管理员"
    },
    investorType: {
      id: 2,
      name: "个人投资者"
    },
    focusIndustries: [
      { id: 12, name: "5G通信" },
      { id: 13, name: "物联网" },
      { id: 4, name: "智能制造" }
    ]
  }
];

// 模拟选项数据
const mockRegions: BaseOption[] = [
  { label: "全部地区", value: "" },
  { label: "北京", value: "1" },
  { label: "上海", value: "2" },
  { label: "深圳", value: "3" },
  { label: "杭州", value: "4" },
  { label: "广州", value: "5" }
];

const mockIndustries: BaseOption[] = [
  { label: "全部领域", value: "" },
  { label: "人工智能", value: "1" },
  { label: "企业服务", value: "2" },
  { label: "新能源", value: "3" },
  { label: "智能制造", value: "4" },
  { label: "消费互联网", value: "5" },
  { label: "教育科技", value: "6" },
  { label: "医疗健康", value: "7" },
  { label: "金融科技", value: "8" }
];

const mockFundingStages: BaseOption[] = [
  { label: "全部阶段", value: "" },
  { label: "种子轮", value: "1" },
  { label: "天使轮", value: "2" },
  { label: "Pre-A轮", value: "3" },
  { label: "A轮", value: "4" },
  { label: "B轮", value: "5" },
  { label: "C轮及以上", value: "6" }
];

const mockInvestorTypes: BaseOption[] = [
  { label: "全部类型", value: "" },
  { label: "机构投资人", value: "1" },
  { label: "天使投资人", value: "2" },
  { label: "个人投资者", value: "3" }
];

// 获取投资人列表
export const getInvestorList = (params: InvestorQueryParams): Promise<ApiResponse<PaginatedResponse<InvestorInfo>>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockInvestors];

      // 搜索过滤
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.user?.realName?.toLowerCase().includes(searchTerm) ||
          item.investmentInstitution.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm)
        );
      }

      // 地区过滤
      if (params.region) {
        filteredData = filteredData.filter(item => item.regionId?.toString() === params.region);
      }

      // 投资人类型过滤
      if (params.type) {
        filteredData = filteredData.filter(item => item.investorTypeId?.toString() === params.type);
      }

      // 状态过滤
      if (params.status !== undefined && params.status !== "") {
        const statusNum = parseInt(params.status);
        filteredData = filteredData.filter(item => item.status === statusNum);
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
        message: "获取投资人列表成功"
      });
    }, 300);
  });
};

// 获取投资人详情
export const getInvestorDetail = (id: number): Promise<ApiResponse<InvestorInfo>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const investor = mockInvestors.find(item => item.id === id);
      if (investor) {
        resolve({
          code: 200,
          success: true,
          data: investor,
          message: "获取投资人详情成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "投资人不存在"
        });
      }
    }, 200);
  });
};

// 创建投资人
export const createInvestor = (data: InvestorForm): Promise<ApiResponse<InvestorInfo>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizeIndustries = (list?: Array<number | string> | Array<{ id: number; name: string }>) => {
        if (!list) return undefined as unknown as { id: number; name: string }[];
        if (Array.isArray(list) && list.length > 0 && typeof list[0] !== "object") {
          return (list as Array<number | string>).map((v, idx) => ({ id: Number(idx + 1), name: String(v) }));
        }
        return list as { id: number; name: string }[];
      };

      const newInvestor: InvestorInfo = {
        ...(data as any),
        id: Date.now(),
        investmentCount: 0,
        successfulExits: 0,
        activeMonths: 0,
        responseRate: 0,
        viewCount: 0,
        createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        focusIndustries: normalizeIndustries((data as any).focusIndustries),
        preferredStages: normalizeIndustries((data as any).preferredStages)
      };
      
      mockInvestors.unshift(newInvestor);
      
      resolve({
        code: 200,
        success: true,
        data: newInvestor,
        message: "创建投资人成功"
      });
    }, 500);
  });
};

// 更新投资人
export const updateInvestor = (id: number, data: Partial<InvestorForm>): Promise<ApiResponse<InvestorInfo>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInvestors.findIndex(item => item.id === id);
      if (index !== -1) {
        const normalizeIndustries = (list?: Array<number | string> | Array<{ id: number; name: string }>) => {
          if (!list) return undefined as unknown as { id: number; name: string }[];
          if (Array.isArray(list) && list.length > 0 && typeof list[0] !== "object") {
            return (list as Array<number | string>).map((v, idx) => ({ id: Number(idx + 1), name: String(v) }));
          }
          return list as { id: number; name: string }[];
        };

        mockInvestors[index] = {
          ...mockInvestors[index],
          ...(data as any),
          focusIndustries: normalizeIndustries((data as any).focusIndustries) || mockInvestors[index].focusIndustries,
          preferredStages: normalizeIndustries((data as any).preferredStages) || mockInvestors[index].preferredStages,
          updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        
        resolve({
          code: 200,
          success: true,
          data: mockInvestors[index],
          message: "更新投资人成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "投资人不存在"
        });
      }
    }, 500);
  });
};

// 删除投资人
export const deleteInvestor = (id: number): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInvestors.findIndex(item => item.id === id);
      if (index !== -1) {
        mockInvestors.splice(index, 1);
        resolve({
          code: 200,
          success: true,
          data: null,
          message: "删除投资人成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "投资人不存在"
        });
      }
    }, 300);
  });
};

// 审核投资人
export const reviewInvestor = (id: number, status: number, comment?: string): Promise<ApiResponse<InvestorInfo>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInvestors.findIndex(item => item.id === id);
      if (index !== -1) {
        mockInvestors[index] = {
          ...mockInvestors[index],
          status,
          reviewComment: comment || "",
          reviewTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          reviewerId: 1,
          verified: status === 1,
          updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        
        resolve({
          code: 200,
          success: true,
          data: mockInvestors[index],
          message: "审核投资人成功"
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "投资人不存在"
        });
      }
    }, 500);
  });
};

// 切换推荐状态
export const toggleInvestorRecommendation = (id: number): Promise<ApiResponse<InvestorInfo>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInvestors.findIndex(item => item.id === id);
      if (index !== -1) {
        mockInvestors[index] = {
          ...mockInvestors[index],
          isFeatured: !mockInvestors[index].isFeatured,
          updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        
        resolve({
          code: 200,
          success: true,
          data: mockInvestors[index],
          message: `${mockInvestors[index].isFeatured ? '推荐' : '取消推荐'}投资人成功`
        });
      } else {
        resolve({
          code: 404,
          success: false,
          data: null,
          message: "投资人不存在"
        });
      }
    }, 300);
  });
};

// 获取地区列表
export const getRegionList = (): Promise<ApiResponse<BaseOption[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        success: true,
        data: mockRegions,
        message: "获取地区列表成功"
      });
    }, 100);
  });
};

// 获取行业列表
export const getIndustryList = (): Promise<ApiResponse<BaseOption[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        success: true,
        data: mockIndustries,
        message: "获取行业列表成功"
      });
    }, 100);
  });
};

// 获取融资阶段列表
export const getFundingStageList = (): Promise<ApiResponse<BaseOption[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        success: true,
        data: mockFundingStages,
        message: "获取融资阶段列表成功"
      });
    }, 100);
  });
};

// 获取投资人类型列表
export const getInvestorTypeList = (): Promise<ApiResponse<BaseOption[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        success: true,
        data: mockInvestorTypes,
        message: "获取投资人类型列表成功"
      });
    }, 100);
  });
};