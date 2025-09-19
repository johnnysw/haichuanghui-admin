import type {
  ProjectQueryParams,
  ProjectForm,
  ProjectInfo,
  ProjectListResponse,
  ApiResponse,
  BaseOption
} from "../types/types";

// Mock数据
const mockIndustries: BaseOption[] = [
  { id: 1, name: "人工智能" },
  { id: 2, name: "区块链" },
  { id: 3, name: "生物科技" },
  { id: 4, name: "新能源" },
  { id: 5, name: "电子商务" },
  { id: 6, name: "金融科技" },
  { id: 7, name: "教育科技" },
  { id: 8, name: "医疗健康" },
  { id: 9, name: "智能制造" },
  { id: 10, name: "文化娱乐" }
];

const mockRegions: BaseOption[] = [
  { id: 1, name: "北京" },
  { id: 2, name: "上海" },
  { id: 3, name: "深圳" },
  { id: 4, name: "广州" },
  { id: 5, name: "杭州" },
  { id: 6, name: "成都" },
  { id: 7, name: "南京" },
  { id: 8, name: "武汉" },
  { id: 9, name: "西安" },
  { id: 10, name: "苏州" }
];

const mockFundingStages: BaseOption[] = [
  { id: 1, name: "天使轮" },
  { id: 2, name: "Pre-A轮" },
  { id: 3, name: "A轮" },
  { id: 4, name: "B轮" },
  { id: 5, name: "C轮" },
  { id: 6, name: "D轮及以后" },
  { id: 7, name: "战略投资" },
  { id: 8, name: "IPO前" },
  { id: 9, name: "已上市" },
  { id: 10, name: "种子轮" }
];

const mockProjects: ProjectInfo[] = [
  {
    id: 1,
    name: "智能医疗诊断平台",
    companyName: "智慧医疗科技有限公司",
    shortDescription: "基于AI技术的智能医疗诊断平台，提供精准的疾病预测和诊断服务",
    fullDescription: "我们的智能医疗诊断平台采用最新的深度学习技术，通过分析医学影像、病历数据和生理指标，为医生提供准确的诊断建议。平台已在多家三甲医院试点应用，诊断准确率达到95%以上。",
    description: "基于AI技术的智能医疗诊断平台",
    industryId: 8,
    regionId: 1,
    location: "北京市海淀区中关村",
    fundingStageId: 3,
    fundingAmount: "5000万元",
    valuation: "2亿元",
    fundingNeeds: "用于技术研发、市场推广和团队扩建",
    introduction: "智慧医疗科技致力于用AI技术革新医疗诊断行业",
    coreTechnology: "深度学习算法、医学影像识别、自然语言处理",
    businessModel: "SaaS服务模式，向医院收取软件使用费和技术服务费",
    teamInfo: "核心团队由清华大学、协和医院等顶尖院校和医疗机构的专家组成",
    fundingHistory: "2022年获得1000万元天使轮投资，2023年获得3000万元A轮投资",
    developmentPlan: "计划在未来3年内覆盖全国500家医院，成为行业领先的医疗AI公司",
    marketAnalysis: "中国医疗AI市场规模预计将在2025年达到1000亿元",
    competitiveAdvantage: "拥有自主研发的核心算法和丰富的医疗数据资源",
    foundingDate: "2021-03-15",
    creatorId: 1,
    reviewerId: null,
    status: 1, // 已发布
    isRecommended: true,
    logoUrl: "/uploads/logos/medical-ai-logo.png",
    images: ["/uploads/projects/medical-ai-1.jpg", "/uploads/projects/medical-ai-2.jpg"],
    businessPlanUrl: "/uploads/business-plans/medical-ai-bp.pdf",
    contactEmail: "contact@smartmedical.com",
    contactPhone: "400-123-4567",
    websiteUrl: "https://www.smartmedical.com",
    socialMedia: "@智慧医疗科技",
    viewCount: 2580,
    likeCount: 156,
    favoriteCount: 89,
    reviewComment: null,
    reviewTime: null,
    createdTime: "2024-01-15T08:30:00Z",
    updatedTime: "2024-01-20T10:15:00Z",
    industry: { id: 8, name: "医疗健康" },
    region: { id: 1, name: "北京" },
    fundingStage: { id: 3, name: "A轮" },
    creator: { id: 1, username: "zhangsan", nickname: "张三" }
  },
  {
    id: 2,
    name: "绿色能源储存系统",
    companyName: "新能源储存技术公司",
    shortDescription: "革命性的锂电池储能技术，为清洁能源提供高效存储解决方案",
    fullDescription: "我们开发了新一代锂电池储能系统，具有更高的能量密度、更长的使用寿命和更安全的性能。该系统可广泛应用于风能、太阳能等可再生能源的储存。",
    description: "革命性的锂电池储能技术",
    industryId: 4,
    regionId: 2,
    location: "上海市浦东新区张江高科",
    fundingStageId: 2,
    fundingAmount: "3000万元",
    valuation: "1.2亿元",
    fundingNeeds: "用于生产线建设和技术优化",
    introduction: "新能源储存技术公司专注于清洁能源储存解决方案",
    coreTechnology: "高密度锂电池技术、智能能源管理系统",
    businessModel: "B2B销售模式，向电力公司和新能源企业提供储能设备",
    teamInfo: "团队成员来自特斯拉、比亚迪等知名新能源公司",
    fundingHistory: "2023年获得1500万元种子轮投资",
    developmentPlan: "计划建设年产能10GWh的生产基地",
    marketAnalysis: "全球储能市场预计2025年将达到1200亿美元",
    competitiveAdvantage: "拥有多项核心技术专利，成本控制能力强",
    foundingDate: "2022-08-20",
    creatorId: 2,
    reviewerId: 1,
    status: 2, // 审核中
    isRecommended: false,
    logoUrl: "/uploads/logos/energy-storage-logo.png",
    images: ["/uploads/projects/energy-storage-1.jpg"],
    businessPlanUrl: "/uploads/business-plans/energy-storage-bp.pdf",
    contactEmail: "info@greenenergy.com",
    contactPhone: "400-987-6543",
    websiteUrl: "https://www.greenenergy.com",
    socialMedia: "@绿色储能科技",
    viewCount: 1240,
    likeCount: 78,
    favoriteCount: 45,
    reviewComment: null,
    reviewTime: null,
    createdTime: "2024-01-10T14:20:00Z",
    updatedTime: "2024-01-18T16:45:00Z",
    industry: { id: 4, name: "新能源" },
    region: { id: 2, name: "上海" },
    fundingStage: { id: 2, name: "Pre-A轮" },
    creator: { id: 2, username: "lisi", nickname: "李四" }
  },
  {
    id: 3,
    name: "智能教育助手",
    companyName: "未来教育科技有限公司",
    shortDescription: "AI驱动的个性化学习平台，为学生提供定制化的教育内容和学习路径",
    fullDescription: "智能教育助手通过分析学生的学习行为和知识掌握情况，为每个学生制定个性化的学习计划。平台涵盖K12全学科内容，已服务超过100万学生。",
    description: "AI驱动的个性化学习平台",
    industryId: 7,
    regionId: 3,
    location: "深圳市南山区科技园",
    fundingStageId: 4,
    fundingAmount: "8000万元",
    valuation: "4亿元",
    fundingNeeds: "用于内容扩充、技术升级和海外市场拓展",
    introduction: "未来教育科技致力于用AI技术改变传统教育模式",
    coreTechnology: "机器学习算法、知识图谱、自适应学习系统",
    businessModel: "订阅制收费模式，面向学生和家长提供付费服务",
    teamInfo: "创始团队来自腾讯、好未来等知名科技和教育公司",
    fundingHistory: "A轮3000万元，B轮5000万元",
    developmentPlan: "计划进入东南亚市场，用户规模扩展到500万",
    marketAnalysis: "在线教育市场规模预计2025年达到8000亿元",
    competitiveAdvantage: "拥有海量优质教育内容和先进的AI技术",
    foundingDate: "2020-06-10",
    creatorId: 3,
    reviewerId: null,
    status: 1, // 已发布
    isRecommended: true,
    logoUrl: "/uploads/logos/edu-ai-logo.png",
    images: ["/uploads/projects/edu-ai-1.jpg", "/uploads/projects/edu-ai-2.jpg", "/uploads/projects/edu-ai-3.jpg"],
    businessPlanUrl: "/uploads/business-plans/edu-ai-bp.pdf",
    contactEmail: "hello@futuredu.com",
    contactPhone: "400-555-0123",
    websiteUrl: "https://www.futuredu.com",
    socialMedia: "@未来教育科技",
    viewCount: 4560,
    likeCount: 298,
    favoriteCount: 167,
    reviewComment: null,
    reviewTime: null,
    createdTime: "2023-12-05T09:15:00Z",
    updatedTime: "2024-01-22T11:30:00Z",
    industry: { id: 7, name: "教育科技" },
    region: { id: 3, name: "深圳" },
    fundingStage: { id: 4, name: "B轮" },
    creator: { id: 3, username: "wangwu", nickname: "王五" }
  },
  {
    id: 4,
    name: "区块链供应链管理",
    companyName: "链通科技有限公司",
    shortDescription: "基于区块链技术的供应链透明化管理平台，提供全链条溯源和信任机制",
    fullDescription: "我们的平台利用区块链技术的不可篡改特性，为供应链各环节提供透明、可信的信息记录和验证服务，已在食品、药品、奢侈品等行业得到应用。",
    description: "基于区块链技术的供应链管理平台",
    industryId: 2,
    regionId: 5,
    location: "杭州市西湖区文三路",
    fundingStageId: 1,
    fundingAmount: "1500万元",
    valuation: "6000万元",
    fundingNeeds: "用于技术研发和市场推广",
    introduction: "链通科技专注于区块链技术在供应链领域的应用",
    coreTechnology: "联盟链技术、智能合约、数字身份认证",
    businessModel: "SaaS服务费+交易手续费的混合模式",
    teamInfo: "核心团队具有丰富的区块链和供应链管理经验",
    fundingHistory: "2023年获得500万元种子轮投资",
    developmentPlan: "计划覆盖更多行业，成为供应链区块链领域的标杆企业",
    marketAnalysis: "区块链供应链管理市场预计年复合增长率超过80%",
    competitiveAdvantage: "技术成熟度高，已有多个成功案例",
    foundingDate: "2022-11-08",
    creatorId: 4,
    reviewerId: 2,
    status: 3, // 已拒绝
    isRecommended: false,
    logoUrl: "/uploads/logos/blockchain-supply-logo.png",
    images: ["/uploads/projects/blockchain-supply-1.jpg"],
    businessPlanUrl: "/uploads/business-plans/blockchain-supply-bp.pdf",
    contactEmail: "contact@chaintech.com",
    contactPhone: "400-666-8888",
    websiteUrl: "https://www.chaintech.com",
    socialMedia: "@链通科技",
    viewCount: 890,
    likeCount: 32,
    favoriteCount: 18,
    reviewComment: "商业模式需要进一步完善，技术方案存在一些问题",
    reviewTime: "2024-01-25T15:20:00Z",
    createdTime: "2024-01-08T13:45:00Z",
    updatedTime: "2024-01-25T15:20:00Z",
    industry: { id: 2, name: "区块链" },
    region: { id: 5, name: "杭州" },
    fundingStage: { id: 1, name: "天使轮" },
    creator: { id: 4, username: "zhaoliu", nickname: "赵六" }
  },
  {
    id: 5,
    name: "智能制造机器人",
    companyName: "精工智能制造有限公司",
    shortDescription: "专业的工业机器人解决方案提供商，专注于智能制造领域的自动化升级",
    fullDescription: "我们开发了一系列适用于不同制造场景的智能机器人，包括焊接机器人、装配机器人、检测机器人等，帮助传统制造业实现智能化转型。",
    description: "专业的工业机器人解决方案",
    industryId: 9,
    regionId: 4,
    location: "广州市黄埔区科学城",
    fundingStageId: 3,
    fundingAmount: "6000万元",
    valuation: "3亿元",
    fundingNeeds: "用于产品研发、生产扩建和市场开拓",
    introduction: "精工智能制造专注于工业4.0时代的智能制造解决方案",
    coreTechnology: "机器视觉、运动控制、人机协作技术",
    businessModel: "设备销售+技术服务+运营维护的综合模式",
    teamInfo: "团队成员来自华为、大疆、富士康等知名制造企业",
    fundingHistory: "天使轮1000万元，A轮4000万元",
    developmentPlan: "计划建设华南地区最大的智能制造机器人生产基地",
    marketAnalysis: "中国工业机器人市场年复合增长率超过20%",
    competitiveAdvantage: "产品性价比高，本土化服务能力强",
    foundingDate: "2021-09-15",
    creatorId: 5,
    reviewerId: null,
    status: 1, // 已发布
    isRecommended: false,
    logoUrl: "/uploads/logos/smart-manufacturing-logo.png",
    images: ["/uploads/projects/smart-manufacturing-1.jpg", "/uploads/projects/smart-manufacturing-2.jpg"],
    businessPlanUrl: "/uploads/business-plans/smart-manufacturing-bp.pdf",
    contactEmail: "sales@smartrobot.com",
    contactPhone: "400-777-9999",
    websiteUrl: "https://www.smartrobot.com",
    socialMedia: "@精工智能制造",
    viewCount: 1680,
    likeCount: 95,
    favoriteCount: 52,
    reviewComment: null,
    reviewTime: null,
    createdTime: "2023-11-20T10:30:00Z",
    updatedTime: "2024-01-12T14:15:00Z",
    industry: { id: 9, name: "智能制造" },
    region: { id: 4, name: "广州" },
    fundingStage: { id: 3, name: "A轮" },
    creator: { id: 5, username: "sunqi", nickname: "孙七" }
  }
];

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取项目列表
export const getProjectList = async (params: ProjectQueryParams): Promise<ApiResponse<ProjectListResponse>> => {
  await delay(500); // 模拟网络延迟
  
  let filteredProjects = [...mockProjects];
  
  // 根据参数过滤
  if (params.name) {
    filteredProjects = filteredProjects.filter(project => 
      project.name.includes(params.name!)
    );
  }
  
  if (params.companyName) {
    filteredProjects = filteredProjects.filter(project => 
      project.companyName.includes(params.companyName!)
    );
  }
  
  if (params.industryId) {
    filteredProjects = filteredProjects.filter(project => 
      project.industryId.toString() === params.industryId
    );
  }
  
  if (params.regionId) {
    filteredProjects = filteredProjects.filter(project => 
      project.regionId.toString() === params.regionId
    );
  }
  
  if (params.fundingStageId) {
    filteredProjects = filteredProjects.filter(project => 
      project.fundingStageId.toString() === params.fundingStageId
    );
  }
  
  if (params.status !== undefined && params.status !== "") {
    filteredProjects = filteredProjects.filter(project => 
      project.status.toString() === params.status
    );
  }
  
  if (params.isRecommended !== undefined && params.isRecommended !== "") {
    const isRecommended = params.isRecommended === "true";
    filteredProjects = filteredProjects.filter(project => 
      project.isRecommended === isRecommended
    );
  }
  
  // 分页
  const pageNum = params.pageNum || 1;
  const pageSize = params.pageSize || 10;
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
  
  return {
    code: 200,
    message: "success",
    data: {
      list: paginatedProjects,
      total: filteredProjects.length,
      pageSize: pageSize,
      currentPage: pageNum
    }
  };
};

// 获取项目详情
export const getProjectDetail = async (id: number): Promise<ApiResponse<ProjectInfo>> => {
  await delay(300);
  
  const project = mockProjects.find(p => p.id === id);
  if (!project) {
    return {
      code: 404,
      message: "项目不存在",
      data: null as any
    };
  }
  
  return {
    code: 200,
    message: "success",
    data: project
  };
};

// 创建项目
export const createProject = async (data: ProjectForm): Promise<ApiResponse<ProjectInfo>> => {
  await delay(800);
  
  const newProject: ProjectInfo = {
    id: mockProjects.length + 1,
    name: data.name,
    companyName: data.companyName,
    shortDescription: data.shortDescription || "",
    fullDescription: data.fullDescription || "",
    description: data.description || "",
    industryId: data.industryId || 1,
    regionId: data.regionId || 1,
    location: data.location || "",
    fundingStageId: data.fundingStageId || 1,
    fundingAmount: data.fundingAmount || "",
    valuation: data.valuation || "",
    fundingNeeds: data.fundingNeeds || "",
    introduction: data.introduction || "",
    coreTechnology: data.coreTechnology || "",
    businessModel: data.businessModel || "",
    teamInfo: data.teamInfo || "",
    fundingHistory: data.fundingHistory || "",
    developmentPlan: data.developmentPlan || "",
    marketAnalysis: data.marketAnalysis || "",
    competitiveAdvantage: data.competitiveAdvantage || "",
    foundingDate: data.foundingDate || "",
    creatorId: 1,
    reviewerId: null,
    status: data.status,
    isRecommended: data.isRecommended,
    logoUrl: data.logoUrl || "",
    images: data.images || [],
    businessPlanUrl: data.businessPlanUrl || "",
    contactEmail: data.contactEmail || "",
    contactPhone: data.contactPhone || "",
    websiteUrl: data.websiteUrl || "",
    socialMedia: data.socialMedia || "",
    viewCount: 0,
    likeCount: 0,
    favoriteCount: 0,
    reviewComment: null,
    reviewTime: null,
    createdTime: new Date().toISOString(),
    updatedTime: new Date().toISOString(),
    industry: mockIndustries.find(i => i.id === data.industryId) || mockIndustries[0],
    region: mockRegions.find(r => r.id === data.regionId) || mockRegions[0],
    fundingStage: mockFundingStages.find(f => f.id === data.fundingStageId) || mockFundingStages[0],
    creator: { id: 1, username: "admin", nickname: "管理员" }
  };
  
  mockProjects.push(newProject);
  
  return {
    code: 200,
    message: "创建成功",
    data: newProject
  };
};

// 更新项目
export const updateProject = async (id: number, data: ProjectForm): Promise<ApiResponse<ProjectInfo>> => {
  await delay(800);
  
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  if (projectIndex === -1) {
    return {
      code: 404,
      message: "项目不存在",
      data: null as any
    };
  }
  
  const updatedProject = {
    ...mockProjects[projectIndex],
    ...data,
    updatedTime: new Date().toISOString(),
    industry: mockIndustries.find(i => i.id === data.industryId) || mockProjects[projectIndex].industry,
    region: mockRegions.find(r => r.id === data.regionId) || mockProjects[projectIndex].region,
    fundingStage: mockFundingStages.find(f => f.id === data.fundingStageId) || mockProjects[projectIndex].fundingStage
  };
  
  mockProjects[projectIndex] = updatedProject;
  
  return {
    code: 200,
    message: "更新成功",
    data: updatedProject
  };
};

// 删除项目
export const deleteProject = async (id: number): Promise<ApiResponse<void>> => {
  await delay(500);
  
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  if (projectIndex === -1) {
    return {
      code: 404,
      message: "项目不存在",
      data: null as any
    };
  }
  
  mockProjects.splice(projectIndex, 1);
  
  return {
    code: 200,
    message: "删除成功",
    data: null as any
  };
};

// 审核项目
export const reviewProject = async (id: number, status: number, reviewComment?: string): Promise<ApiResponse<ProjectInfo>> => {
  await delay(600);
  
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  if (projectIndex === -1) {
    return {
      code: 404,
      message: "项目不存在",
      data: null as any
    };
  }
  
  mockProjects[projectIndex] = {
    ...mockProjects[projectIndex],
    status,
    reviewComment: reviewComment || null,
    reviewTime: new Date().toISOString(),
    reviewerId: 1,
    updatedTime: new Date().toISOString()
  };
  
  return {
    code: 200,
    message: "审核成功",
    data: mockProjects[projectIndex]
  };
};

// 切换推荐状态
export const toggleProjectRecommendation = async (id: number, isRecommended: boolean): Promise<ApiResponse<ProjectInfo>> => {
  await delay(400);
  
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  if (projectIndex === -1) {
    return {
      code: 404,
      message: "项目不存在",
      data: null as any
    };
  }
  
  mockProjects[projectIndex] = {
    ...mockProjects[projectIndex],
    isRecommended,
    updatedTime: new Date().toISOString()
  };
  
  return {
    code: 200,
    message: "操作成功",
    data: mockProjects[projectIndex]
  };
};

// 获取行业列表
export const getIndustryList = async (): Promise<ApiResponse<BaseOption[]>> => {
  await delay(200);
  return {
    code: 200,
    message: "success",
    data: mockIndustries
  };
};

// 获取地区列表
export const getRegionList = async (): Promise<ApiResponse<BaseOption[]>> => {
  await delay(200);
  return {
    code: 200,
    message: "success",
    data: mockRegions
  };
};

// 获取融资阶段列表
export const getFundingStageList = async (): Promise<ApiResponse<BaseOption[]>> => {
  await delay(200);
  return {
    code: 200,
    message: "success",
    data: mockFundingStages
  };
};