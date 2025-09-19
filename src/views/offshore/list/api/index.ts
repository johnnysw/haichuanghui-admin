import type { 
  OffshoreCenter, 
  OffshoreCreateForm, 
  OffshoreListParams,
  ApiResponse, 
  PaginationResponse,
  PolicyFile,
  ImageFile
} from "../types/types";

// 模拟离岸中心列表数据
const mockOffshoreData: OffshoreCenter[] = [
  {
    id: 1,
    name: "中关村硅谷创新中心",
    location: "美国硅谷",
    type: "科技园",
    description: "专注于高科技创新和跨国合作的离岸双创中心，致力于为中国企业提供硅谷资源对接。",
    logo: "https://via.placeholder.com/300x200/4285f4/ffffff?text=硅谷中心",
    status: 1,
    isRecommended: true,
    createdTime: "2023-01-15T10:30:00Z",
    updatedTime: "2024-01-15T16:45:00Z",
    website: "https://zgc-sv.com",
    contactPhone: "+1-650-555-0123",
    contactEmail: "info@zgc-sv.com",
    address: "2855 Telegraph Ave, Berkeley, CA 94705",
    establishedDate: "2020-03-01",
    areaSize: 8000,
    companyCount: 45,
    graduatedCount: 12,
    viewCount: 1580,
    favoriteCount: 89
  },
  {
    id: 2,
    name: "中欧创新中心（柏林）",
    location: "德国柏林",
    type: "孵化器",
    description: "连接中欧创新资源，专注于智能制造、新能源和生物技术领域的跨境孵化。",
    logo: "https://via.placeholder.com/300x200/34a853/ffffff?text=柏林中心",
    status: 1,
    isRecommended: true,
    createdTime: "2023-06-20T14:15:00Z",
    updatedTime: "2024-02-10T09:20:00Z",
    website: "https://sino-euro-berlin.de",
    contactPhone: "+49-30-555-0456",
    contactEmail: "contact@sino-euro-berlin.de",
    address: "Unter den Linden 6, 10117 Berlin, Germany",
    establishedDate: "2021-08-15",
    areaSize: 6500,
    companyCount: 32,
    graduatedCount: 8,
    viewCount: 1245,
    favoriteCount: 67
  },
  {
    id: 3,
    name: "亚太创新枢纽（新加坡）",
    location: "新加坡",
    type: "加速器",
    description: "立足新加坡，辐射整个亚太地区的创新加速器，重点支持金融科技和数字经济项目。",
    logo: "https://via.placeholder.com/300x200/ff6d01/ffffff?text=新加坡枢纽",
    status: 1,
    isRecommended: false,
    createdTime: "2023-09-10T11:00:00Z",
    updatedTime: "2024-03-05T13:30:00Z",
    website: "https://apac-innovation-hub.sg",
    contactPhone: "+65-6555-0789",
    contactEmail: "hello@apac-innovation-hub.sg",
    address: "1 Marina Bay, Singapore 018989",
    establishedDate: "2022-01-20",
    areaSize: 4200,
    companyCount: 28,
    graduatedCount: 5,
    viewCount: 892,
    favoriteCount: 45
  },
  {
    id: 4,
    name: "中日韩创新联盟（东京）",
    location: "日本东京",
    type: "创业园",
    description: "专注于中日韩三国创新合作，在人工智能、机器人和新材料领域具有独特优势。",
    logo: "https://via.placeholder.com/300x200/9c27b0/ffffff?text=东京联盟",
    status: 2,
    isRecommended: false,
    createdTime: "2024-01-25T08:45:00Z",
    updatedTime: "2024-03-15T15:10:00Z",
    website: "https://cjk-innovation-tokyo.jp",
    contactPhone: "+81-3-5555-0321",
    contactEmail: "info@cjk-innovation-tokyo.jp",
    address: "1-1-1 Shibuya, Shibuya City, Tokyo 150-0002, Japan",
    establishedDate: "2023-11-01",
    areaSize: 3800,
    companyCount: 18,
    graduatedCount: 2,
    viewCount: 567,
    favoriteCount: 23
  },
  {
    id: 5,
    name: "澳中科技合作中心",
    location: "澳大利亚悉尼",
    type: "研究院",
    description: "专注于清洁能源、生物医药和农业科技的国际合作研究与产业化。",
    logo: "https://via.placeholder.com/300x200/795548/ffffff?text=悉尼中心",
    status: 1,
    isRecommended: true,
    createdTime: "2023-04-12T12:20:00Z",
    updatedTime: "2024-02-28T10:15:00Z",
    website: "https://au-cn-tech.com.au",
    contactPhone: "+61-2-5555-0654",
    contactEmail: "contact@au-cn-tech.com.au",
    address: "Level 10, 1 Martin Place, Sydney NSW 2000, Australia",
    establishedDate: "2021-05-10",
    areaSize: 5500,
    companyCount: 25,
    graduatedCount: 7,
    viewCount: 1034,
    favoriteCount: 58
  },
  {
    id: 6,
    name: "加拿大多伦多创新基地",
    location: "加拿大多伦多",
    type: "科技园",
    description: "依托多伦多大学等顶尖院校资源，专注于人工智能、量子计算和生命科学领域的创新孵化。",
    logo: "https://via.placeholder.com/300x200/607d8b/ffffff?text=多伦多基地",
    status: 1,
    isRecommended: false,
    createdTime: "2023-08-18T09:15:00Z",
    updatedTime: "2024-01-22T14:30:00Z",
    website: "https://toronto-innovation-base.ca",
    contactPhone: "+1-416-555-0789",
    contactEmail: "info@toronto-innovation-base.ca",
    address: "661 University Avenue, Toronto, ON M5G 1M1, Canada",
    establishedDate: "2022-06-01",
    areaSize: 7200,
    companyCount: 38,
    graduatedCount: 9,
    viewCount: 756,
    favoriteCount: 42
  },
  {
    id: 7,
    name: "英国伦敦金融科技中心",
    location: "英国伦敦",
    type: "加速器",
    description: "位于伦敦金融城核心区域，专注于金融科技、区块链和数字银行等前沿技术的孵化加速。",
    logo: "https://via.placeholder.com/300x200/3f51b5/ffffff?text=伦敦金科",
    status: 1,
    isRecommended: true,
    createdTime: "2023-11-05T16:20:00Z",
    updatedTime: "2024-03-18T11:45:00Z",
    website: "https://london-fintech.co.uk",
    contactPhone: "+44-20-5555-0456",
    contactEmail: "contact@london-fintech.co.uk",
    address: "25 Old Broad Street, London EC2N 1HQ, UK",
    establishedDate: "2023-03-15",
    areaSize: 4800,
    companyCount: 22,
    graduatedCount: 3,
    viewCount: 634,
    favoriteCount: 31
  },
  {
    id: 8,
    name: "法国巴黎生物医药园",
    location: "法国巴黎",
    type: "孵化器",
    description: "法国领先的生物医药创新孵化器，专注于新药研发、医疗器械和数字医疗等领域。",
    logo: "https://via.placeholder.com/300x200/e91e63/ffffff?text=巴黎医药",
    status: 0,
    isRecommended: false,
    createdTime: "2024-02-14T13:10:00Z",
    updatedTime: "2024-03-20T09:25:00Z",
    website: "https://paris-biotech.fr",
    contactPhone: "+33-1-5555-0123",
    contactEmail: "info@paris-biotech.fr",
    address: "15 Rue de Bercy, 75012 Paris, France",
    establishedDate: "2023-12-01",
    areaSize: 3200,
    companyCount: 15,
    graduatedCount: 1,
    viewCount: 289,
    favoriteCount: 18
  },
  {
    id: 9,
    name: "韩国首尔游戏创意园",
    location: "韩国首尔",
    type: "创业园",
    description: "韩国最大的游戏和数字内容创业园区，汇聚了众多游戏开发、VR/AR和数字娱乐企业。",
    logo: "https://via.placeholder.com/300x200/ff5722/ffffff?text=首尔游戏",
    status: 1,
    isRecommended: false,
    createdTime: "2023-05-30T14:45:00Z",
    updatedTime: "2024-02-15T16:20:00Z",
    website: "https://seoul-game-park.kr",
    contactPhone: "+82-2-5555-0567",
    contactEmail: "contact@seoul-game-park.kr",
    address: "396 World Cup buk-ro, Mapo-gu, Seoul 03925, South Korea",
    establishedDate: "2021-10-20",
    areaSize: 5800,
    companyCount: 41,
    graduatedCount: 11,
    viewCount: 1123,
    favoriteCount: 67
  },
  {
    id: 10,
    name: "以色列特拉维夫科技中心",
    location: "以色列特拉维夫",
    type: "科技园",
    description: "以色列顶级的高科技创新中心，专注于网络安全、军用技术转民用和农业科技等领域。",
    logo: "https://via.placeholder.com/300x200/009688/ffffff?text=特拉维夫",
    status: 2,
    isRecommended: true,
    createdTime: "2024-01-08T10:35:00Z",
    updatedTime: "2024-03-12T15:40:00Z",
    website: "https://telaviv-tech.co.il",
    contactPhone: "+972-3-555-0890",
    contactEmail: "info@telaviv-tech.co.il",
    address: "Azrieli Sarona Tower, 121 Menachem Begin Rd, Tel Aviv-Yafo, Israel",
    establishedDate: "2023-09-01",
    areaSize: 6800,
    companyCount: 29,
    graduatedCount: 4,
    viewCount: 445,
    favoriteCount: 28
  }
];

// 获取离岸中心列表
export const getOffshoreList = (params: OffshoreListParams): Promise<ApiResponse<PaginationResponse<OffshoreCenter>>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredData = [...mockOffshoreData];
      
      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.name.toLowerCase().includes(keyword) ||
          item.location.toLowerCase().includes(keyword) ||
          item.description?.toLowerCase().includes(keyword)
        );
      }
      
      // 地区筛选
      if (params.location) {
        filteredData = filteredData.filter(item => item.location.includes(params.location!));
      }
      
      // 类型筛选
      if (params.type) {
        filteredData = filteredData.filter(item => item.type === params.type);
      }
      
      // 状态筛选
      if (params.status !== undefined) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }
      
      // 推荐筛选
      if (params.isRecommended !== undefined) {
        filteredData = filteredData.filter(item => item.isRecommended === params.isRecommended);
      }
      
      // 排序
      const sortBy = params.sortBy || 'createdTime';
      const sortOrder = params.sortOrder || 'desc';
      filteredData.sort((a, b) => {
        let aValue = a[sortBy as keyof OffshoreCenter];
        let bValue = b[sortBy as keyof OffshoreCenter];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        }
        return 0;
      });
      
      // 分页
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredData.slice(start, end);
      
      resolve({
        code: 200,
        success: true,
        message: "获取离岸中心列表成功",
        data: {
          list,
          total: filteredData.length,
          page,
          pageSize
        }
      });
    }, 300);
  });
};

// 创建离岸中心
export const createOffshore = (formData: OffshoreCreateForm): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟创建离岸中心:", formData);
      resolve({
        code: 200,
        success: true,
        message: "离岸中心创建成功",
        data: null
      });
    }, 1000);
  });
};

// 更新离岸中心
export const updateOffshore = (id: number, formData: Partial<OffshoreCreateForm>): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟更新离岸中心:", id, formData);
      resolve({
        code: 200,
        success: true,
        message: "离岸中心更新成功",
        data: null
      });
    }, 1000);
  });
};

// 删除离岸中心
export const deleteOffshore = (id: number): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟删除离岸中心:", id);
      resolve({
        code: 200,
        success: true,
        message: "离岸中心删除成功",
        data: null
      });
    }, 500);
  });
};

// 更新离岸中心状态
export const updateOffshoreStatus = (id: number, status: number): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟更新离岸中心状态:", id, status);
      
      // 在模拟数据中更新状态
      const target = mockOffshoreData.find(item => item.id === id);
      if (target) {
        target.status = status;
        target.updatedTime = new Date().toISOString();
      }
      
      resolve({
        code: 200,
        success: true,
        message: "状态更新成功",
        data: null
      });
    }, 500);
  });
};

// 批量删除离岸中心
export const batchDeleteOffshore = (ids: number[]): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟批量删除离岸中心:", ids);
      resolve({
        code: 200,
        success: true,
        message: `成功删除${ids.length}个离岸中心`,
        data: null
      });
    }, 800);
  });
};

// 批量更新离岸中心状态
export const batchUpdateOffshoreStatus = (ids: number[], status: number): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟批量更新离岸中心状态:", ids, status);
      
      // 在模拟数据中批量更新状态
      ids.forEach(id => {
        const target = mockOffshoreData.find(item => item.id === id);
        if (target) {
          target.status = status;
          target.updatedTime = new Date().toISOString();
        }
      });
      
      resolve({
        code: 200,
        success: true,
        message: `成功更新${ids.length}个离岸中心的状态`,
        data: null
      });
    }, 800);
  });
};

// 推荐/取消推荐离岸中心
export const toggleOffshoreRecommend = (id: number, isRecommended: boolean): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟切换离岸中心推荐状态:", id, isRecommended);
      
      // 在模拟数据中更新推荐状态
      const target = mockOffshoreData.find(item => item.id === id);
      if (target) {
        target.isRecommended = isRecommended;
        target.updatedTime = new Date().toISOString();
      }
      
      resolve({
        code: 200,
        success: true,
        message: isRecommended ? "推荐成功" : "取消推荐成功",
        data: null
      });
    }, 500);
  });
};