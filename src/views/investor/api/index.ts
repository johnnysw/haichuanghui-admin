// 投资人管理相关API（模拟数据）

import type { 
  InvestorItem, 
  InvestorListParams, 
  InvestorCreateForm, 
  ApiResponse, 
  PaginationResponse 
} from "../types/types";

// 模拟投资人数据
const mockInvestorData: InvestorItem[] = [
  {
    id: 1,
    name: "张伟",
    avatar: "https://via.placeholder.com/100x100/4285f4/ffffff?text=张伟",
    institution: "红杉资本中国",
    position: "投资总监",
    location: "北京市海淀区",
    investmentRange: "500万-5000万",
    focusIndustries: ["ai", "bigdata", "cloud"],
    preferredStages: ["angel", "pre_a", "a"],
    phone: "13800138001",
    email: "zhangwei@sequoiacap.com",
    bio: "专注于人工智能、大数据等技术领域投资，拥有10年投资经验，曾成功投资多个独角兽企业。",
    description: "张伟先生是红杉资本中国基金的投资总监，主要负责人工智能、大数据、云计算等技术领域的投资。在加入红杉之前，他曾在腾讯战略投资部工作5年，参与了多个重要项目的投资决策。张伟先生拥有清华大学计算机科学学士学位和斯坦福大学MBA学位。",
    investmentCount: 25,
    successfulExits: 8,
    verified: true,
    status: 1,
    isRecommended: true,
    isFeatured: true,
    createdTime: "2023-01-15 10:30:00",
    updatedTime: "2024-09-20 14:25:00"
  },
  {
    id: 2,
    name: "李华",
    avatar: "https://via.placeholder.com/100x100/34a853/ffffff?text=李华",
    institution: "经纬中国",
    position: "合伙人",
    location: "上海市浦东新区",
    investmentRange: "1000万-1亿",
    focusIndustries: ["fintech", "ecommerce", "consumer"],
    preferredStages: ["a", "b", "c"],
    phone: "13900139002",
    email: "lihua@matrixpartners.com.cn",
    bio: "专注于金融科技、电商、消费升级领域投资，具有丰富的行业经验和资源。",
    description: "李华女士是经纬中国的合伙人，专注于金融科技、电商、消费升级等领域的投资。她在经纬中国工作8年，主导投资了多个知名企业。李华女士曾在麦肯锡咨询公司工作，拥有丰富的商业分析和战略规划经验。她持有北京大学经济学学士学位和哈佛商学院MBA学位。",
    investmentCount: 32,
    successfulExits: 12,
    verified: true,
    status: 1,
    isRecommended: true,
    isFeatured: false,
    createdTime: "2023-02-20 09:15:00",
    updatedTime: "2024-09-18 16:40:00"
  },
  {
    id: 3,
    name: "王强",
    avatar: "https://via.placeholder.com/100x100/fbbc04/ffffff?text=王强",
    institution: "真格基金",
    position: "投资经理",
    location: "北京市朝阳区",
    investmentRange: "100万-1000万",
    focusIndustries: ["edtech", "enterprise", "biotech"],
    preferredStages: ["seed", "angel", "pre_a"],
    phone: "13700137003",
    email: "wangqiang@zhenfund.com",
    bio: "关注教育科技、企业服务、生物医药等领域的早期项目投资。",
    description: "王强先生是真格基金的投资经理，主要关注教育科技、企业服务、生物医药等领域的早期项目。他具有深厚的技术背景，能够准确判断技术项目的商业价值。王强先生毕业于中科院计算所，拥有计算机博士学位，曾在多家技术公司担任研发负责人。",
    investmentCount: 18,
    successfulExits: 5,
    verified: true,
    status: 1,
    isRecommended: false,
    isFeatured: false,
    createdTime: "2023-03-10 14:20:00",
    updatedTime: "2024-09-22 11:30:00"
  },
  {
    id: 4,
    name: "陈敏",
    avatar: "https://via.placeholder.com/100x100/ea4335/ffffff?text=陈敏",
    institution: "启明创投",
    position: "主管合伙人",
    location: "深圳市南山区",
    investmentRange: "2000万-2亿",
    focusIndustries: ["biotech", "energy", "materials"],
    preferredStages: ["b", "c", "later"],
    phone: "13600136004",
    email: "chenmin@qimingvc.com",
    bio: "专注于生物医药、新能源、新材料等硬科技领域投资，拥有深厚的产业背景。",
    description: "陈敏女士是启明创投的主管合伙人，专注于生物医药、新能源、新材料等硬科技领域的投资。她拥有15年的投资经验，曾成功投资多个行业领军企业。陈敏女士具有生物医学工程博士学位，曾在跨国制药公司担任研发总监，对生物医药行业有深刻理解。",
    investmentCount: 28,
    successfulExits: 10,
    verified: true,
    status: 1,
    isRecommended: true,
    isFeatured: true,
    createdTime: "2023-04-05 11:45:00",
    updatedTime: "2024-09-25 09:20:00"
  },
  {
    id: 5,
    name: "刘刚",
    avatar: "https://via.placeholder.com/100x100/9c27b0/ffffff?text=刘刚",
    institution: "IDG资本",
    position: "副总裁",
    location: "广州市天河区",
    investmentRange: "300万-3000万",
    focusIndustries: ["manufacturing", "iot", "enterprise"],
    preferredStages: ["angel", "a", "b"],
    phone: "13500135005",
    email: "liugang@idgcapital.com",
    bio: "专注于智能制造、物联网、企业服务等领域投资，具有产业运营经验。",
    description: "刘刚先生是IDG资本的副总裁，专注于智能制造、物联网、企业服务等领域的投资。他具有丰富的产业运营经验，曾在制造业企业担任高管职位。刘刚先生能够为被投企业提供战略指导和资源整合支持。他拥有华南理工大学工程学士学位和中欧商学院EMBA学位。",
    investmentCount: 22,
    successfulExits: 6,
    verified: false,
    status: 2,
    isRecommended: false,
    isFeatured: false,
    createdTime: "2023-05-12 16:30:00",
    updatedTime: "2024-09-15 13:45:00"
  }
];

// 获取投资人列表
export const getInvestorList = (params: InvestorListParams): Promise<ApiResponse<PaginationResponse<InvestorItem>>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockInvestorData];

      // 应用过滤条件
      if (params.name) {
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(params.name!.toLowerCase())
        );
      }

      if (params.institution) {
        filteredData = filteredData.filter(item => 
          item.institution.toLowerCase().includes(params.institution!.toLowerCase())
        );
      }

      if (params.location) {
        filteredData = filteredData.filter(item => 
          item.location.toLowerCase().includes(params.location!.toLowerCase())
        );
      }

      if (params.focusIndustry) {
        filteredData = filteredData.filter(item => 
          item.focusIndustries.includes(params.focusIndustry!)
        );
      }

      if (params.preferredStage) {
        filteredData = filteredData.filter(item => 
          item.preferredStages.includes(params.preferredStage!)
        );
      }

      if (params.status) {
        filteredData = filteredData.filter(item => item.status.toString() === params.status);
      }

      if (params.isRecommended) {
        const isRec = params.isRecommended === "1";
        filteredData = filteredData.filter(item => item.isRecommended === isRec);
      }

      if (params.isFeatured) {
        const isFeat = params.isFeatured === "1";
        filteredData = filteredData.filter(item => item.isFeatured === isFeat);
      }

      // 分页
      const total = filteredData.length;
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      const list = filteredData.slice(start, end);

      resolve({
        code: 200,
        message: "获取成功",
        data: {
          list,
          total,
          page: params.page,
          pageSize: params.pageSize
        }
      });
    }, 300);
  });
};

// 获取投资人详情
export const getInvestorDetail = (id: number): Promise<ApiResponse<InvestorItem>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const investor = mockInvestorData.find(item => item.id === id);
      if (investor) {
        resolve({
          code: 200,
          message: "获取成功",
          data: investor
        });
      } else {
        reject({
          code: 404,
          message: "投资人不存在"
        });
      }
    }, 200);
  });
};

// 创建投资人
export const createInvestor = (data: InvestorCreateForm): Promise<ApiResponse<InvestorItem>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newInvestor: InvestorItem = {
        id: mockInvestorData.length + 1,
        ...data,
        investmentCount: 0,
        successfulExits: 0,
        createdTime: new Date().toLocaleString(),
        updatedTime: new Date().toLocaleString()
      };
      
      mockInvestorData.unshift(newInvestor);
      
      resolve({
        code: 200,
        message: "创建成功",
        data: newInvestor
      });
    }, 500);
  });
};

// 更新投资人
export const updateInvestor = (id: number, data: Partial<InvestorCreateForm>): Promise<ApiResponse<InvestorItem>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockInvestorData.findIndex(item => item.id === id);
      if (index !== -1) {
        mockInvestorData[index] = {
          ...mockInvestorData[index],
          ...data,
          updatedTime: new Date().toLocaleString()
        };
        
        resolve({
          code: 200,
          message: "更新成功",
          data: mockInvestorData[index]
        });
      } else {
        reject({
          code: 404,
          message: "投资人不存在"
        });
      }
    }, 500);
  });
};

// 删除投资人
export const deleteInvestor = (id: number): Promise<ApiResponse<null>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockInvestorData.findIndex(item => item.id === id);
      if (index !== -1) {
        mockInvestorData.splice(index, 1);
        resolve({
          code: 200,
          message: "删除成功",
          data: null
        });
      } else {
        reject({
          code: 404,
          message: "投资人不存在"
        });
      }
    }, 300);
  });
};