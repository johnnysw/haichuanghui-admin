// 创业项目管理相关API（模拟数据）

import type { 
  ProjectItem, 
  ProjectListParams, 
  ProjectCreateForm, 
  ApiResponse, 
  PaginationResponse 
} from "../types/types";

// 模拟项目数据
const mockProjectData: ProjectItem[] = [
  {
    id: 1,
    name: "智能家居控制系统",
    description: "基于人工智能和物联网技术的智能家居控制平台，通过语音识别、手势控制等多种交互方式，实现家居设备的智能化管理。产品具有学习用户习惯、自适应调节、远程控制等功能，为用户提供便捷、舒适、节能的智能化生活体验。",
    industry: "iot",
    stage: "growth",
    founder: "张明",
    founderPhone: "13800138001",
    founderEmail: "zhangming@smarthome.com",
    teamSize: 25,
    location: "深圳市南山区",
    establishedDate: "2022-03-15",
    registeredCapital: 500,
    currentValuation: 5000,
    fundingNeeds: 2000,
    fundingStage: "a",
    businessModel: "B2C直销模式，主要通过线上平台销售智能家居产品，同时提供安装和售后服务。",
    targetMarket: "中高端家庭用户、智能家居爱好者、新装修用户群体。",
    competitiveAdvantage: "技术领先、产品易用性强、生态系统完善、用户体验优秀。",
    financialSituation: "2023年营收1200万元，毛利率45%，月活跃用户8万+。",
    riskAssessment: "市场竞争激烈，技术更新迭代快，需要持续的研发投入。",
    logo: "https://via.placeholder.com/100x100/4285f4/ffffff?text=智能家居",
    images: [
      "https://via.placeholder.com/400x300/4285f4/ffffff?text=产品展示1",
      "https://via.placeholder.com/400x300/34a853/ffffff?text=产品展示2"
    ],
    documents: ["商业计划书.pdf", "财务报表.xlsx", "技术白皮书.pdf"],
    status: 1,
    isRecommended: true,
    isFeatured: true,
    viewCount: 1256,
    favoriteCount: 89,
    createdTime: "2024-01-15 10:30:00",
    updatedTime: "2024-09-20 14:25:00"
  },
  {
    id: 2,
    name: "新能源汽车充电桩共享平台",
    description: "专注于新能源汽车充电基础设施的共享服务平台，通过整合社会闲置充电桩资源，为新能源车主提供便捷的充电服务。平台采用移动互联网技术，支持在线预约、导航定位、在线支付等功能。",
    industry: "energy",
    stage: "startup",
    founder: "李华",
    founderPhone: "13900139002",
    founderEmail: "lihua@evcharging.com",
    teamSize: 15,
    location: "上海市浦东新区",
    establishedDate: "2023-06-20",
    registeredCapital: 300,
    currentValuation: 1500,
    fundingNeeds: 800,
    fundingStage: "pre_a",
    businessModel: "平台佣金模式，向充电桩运营商收取交易佣金，向用户提供增值服务。",
    targetMarket: "新能源汽车车主、充电桩运营商、政府机构。",
    competitiveAdvantage: "资源整合能力强、用户体验好、技术壁垒高。",
    financialSituation: "2023年营收450万元，用户数量5万+，覆盖城市20个。",
    riskAssessment: "政策变化风险、运营成本高、市场推广难度大。",
    logo: "https://via.placeholder.com/100x100/34a853/ffffff?text=充电桩",
    images: [
      "https://via.placeholder.com/400x300/34a853/ffffff?text=平台界面",
      "https://via.placeholder.com/400x300/fbbc04/ffffff?text=充电场景"
    ],
    documents: ["项目方案.pdf", "市场分析.docx"],
    status: 1,
    isRecommended: false,
    isFeatured: false,
    viewCount: 876,
    favoriteCount: 42,
    createdTime: "2024-02-08 09:15:00",
    updatedTime: "2024-09-18 16:40:00"
  },
  {
    id: 3,
    name: "在线教育个性化学习平台",
    description: "基于人工智能技术的个性化在线教育平台，通过分析学习者的学习行为和能力特点，为每个学生定制专属的学习路径和内容推荐。平台涵盖K12教育、职业培训、兴趣爱好等多个领域。",
    industry: "edtech",
    stage: "growth",
    founder: "王芳",
    founderPhone: "13700137003",
    founderEmail: "wangfang@eduai.com",
    teamSize: 45,
    location: "北京市海淀区",
    establishedDate: "2021-09-10",
    registeredCapital: 800,
    currentValuation: 8000,
    fundingNeeds: 3000,
    fundingStage: "b",
    businessModel: "订阅付费模式，为用户提供月度/年度会员服务，同时销售付费课程。",
    targetMarket: "K12学生及家长、职场人士、终身学习者。",
    competitiveAdvantage: "AI算法先进、内容质量高、用户粘性强、师资力量雄厚。",
    financialSituation: "2023年营收3500万元，付费用户12万+，课程完成率85%。",
    riskAssessment: "内容版权风险、师资流失风险、技术安全风险。",
    logo: "https://via.placeholder.com/100x100/fbbc04/ffffff?text=在线教育",
    images: [
      "https://via.placeholder.com/400x300/fbbc04/ffffff?text=学习界面",
      "https://via.placeholder.com/400x300/ea4335/ffffff?text=教学场景",
      "https://via.placeholder.com/400x300/9c27b0/ffffff?text=数据分析"
    ],
    documents: ["融资计划书.pdf", "用户调研报告.pdf", "技术架构图.png"],
    status: 1,
    isRecommended: true,
    isFeatured: false,
    viewCount: 2341,
    favoriteCount: 156,
    createdTime: "2023-12-20 11:45:00",
    updatedTime: "2024-09-25 10:20:00"
  },
  {
    id: 4,
    name: "生物医药检测设备研发",
    description: "专注于生物医药检测设备的研发和生产，主要产品包括基因检测仪、蛋白质分析仪、细胞培养设备等。产品广泛应用于医院、科研院所、生物制药企业等机构。",
    industry: "biotech",
    stage: "mature",
    founder: "陈教授",
    founderPhone: "13600136004",
    founderEmail: "chenjiaoshou@biotech.com",
    teamSize: 60,
    location: "苏州市工业园区",
    establishedDate: "2019-05-30",
    registeredCapital: 1200,
    currentValuation: 15000,
    fundingNeeds: 5000,
    fundingStage: "c",
    businessModel: "设备销售+技术服务模式，提供设备销售、安装调试、培训维护等全方位服务。",
    targetMarket: "三甲医院、科研院所、生物制药企业、第三方检测机构。",
    competitiveAdvantage: "技术领先、产品质量可靠、服务体系完善、客户关系稳定。",
    financialSituation: "2023年营收8500万元，净利润1800万元，客户覆盖全国200+城市。",
    riskAssessment: "行业监管严格、研发周期长、国际竞争激烈。",
    logo: "https://via.placeholder.com/100x100/ea4335/ffffff?text=生物医药",
    images: [
      "https://via.placeholder.com/400x300/ea4335/ffffff?text=检测设备",
      "https://via.placeholder.com/400x300/4285f4/ffffff?text=实验室"
    ],
    documents: ["产品手册.pdf", "认证证书.pdf", "专利清单.xlsx"],
    status: 1,
    isRecommended: true,
    isFeatured: true,
    viewCount: 3456,
    favoriteCount: 234,
    createdTime: "2023-11-05 14:20:00",
    updatedTime: "2024-09-22 09:30:00"
  },
  {
    id: 5,
    name: "区块链供应链金融平台",
    description: "基于区块链技术的供应链金融服务平台，为中小企业提供便捷的融资服务。通过区块链技术确保交易数据的真实性和不可篡改性，降低金融机构的风险成本。",
    industry: "blockchain",
    stage: "startup",
    founder: "刘总",
    founderPhone: "13500135005",
    founderEmail: "liuzong@blockchain.com",
    teamSize: 20,
    location: "杭州市余杭区",
    establishedDate: "2023-08-15",
    registeredCapital: 400,
    currentValuation: 2000,
    fundingNeeds: 1000,
    fundingStage: "angel",
    businessModel: "交易手续费模式，向平台交易收取一定比例的手续费。",
    targetMarket: "中小企业、供应链核心企业、金融机构。",
    competitiveAdvantage: "技术创新、安全可靠、降本增效、合规性强。",
    financialSituation: "平台上线半年，累计交易额5000万元，注册企业800+家。",
    riskAssessment: "监管政策风险、技术安全风险、市场接受度待提升。",
    logo: "https://via.placeholder.com/100x100/9c27b0/ffffff?text=区块链",
    images: [
      "https://via.placeholder.com/400x300/9c27b0/ffffff?text=平台架构"
    ],
    documents: ["技术方案.pdf", "合规报告.pdf"],
    status: 2,
    isRecommended: false,
    isFeatured: false,
    viewCount: 567,
    favoriteCount: 23,
    createdTime: "2024-03-12 16:30:00",
    updatedTime: "2024-09-15 13:45:00"
  }
];

// 获取项目列表
export const getProjectList = (params: ProjectListParams): Promise<ApiResponse<PaginationResponse<ProjectItem>>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockProjectData];

      // 应用过滤条件
      if (params.name) {
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(params.name!.toLowerCase())
        );
      }

      if (params.industry) {
        filteredData = filteredData.filter(item => item.industry === params.industry);
      }

      if (params.stage) {
        filteredData = filteredData.filter(item => item.stage === params.stage);
      }

      if (params.fundingStage) {
        filteredData = filteredData.filter(item => item.fundingStage === params.fundingStage);
      }

      if (params.location) {
        filteredData = filteredData.filter(item => 
          item.location.toLowerCase().includes(params.location!.toLowerCase())
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

// 获取项目详情
export const getProjectDetail = (id: number): Promise<ApiResponse<ProjectItem>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const project = mockProjectData.find(item => item.id === id);
      if (project) {
        // 增加浏览量
        project.viewCount += 1;
        resolve({
          code: 200,
          message: "获取成功",
          data: project
        });
      } else {
        reject({
          code: 404,
          message: "项目不存在"
        });
      }
    }, 200);
  });
};

// 创建项目
export const createProject = (data: ProjectCreateForm): Promise<ApiResponse<ProjectItem>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProject: ProjectItem = {
        id: mockProjectData.length + 1,
        ...data,
        viewCount: 0,
        favoriteCount: 0,
        createdTime: new Date().toLocaleString(),
        updatedTime: new Date().toLocaleString()
      };
      
      mockProjectData.unshift(newProject);
      
      resolve({
        code: 200,
        message: "创建成功",
        data: newProject
      });
    }, 500);
  });
};

// 更新项目
export const updateProject = (id: number, data: Partial<ProjectCreateForm>): Promise<ApiResponse<ProjectItem>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockProjectData.findIndex(item => item.id === id);
      if (index !== -1) {
        mockProjectData[index] = {
          ...mockProjectData[index],
          ...data,
          updatedTime: new Date().toLocaleString()
        };
        
        resolve({
          code: 200,
          message: "更新成功",
          data: mockProjectData[index]
        });
      } else {
        reject({
          code: 404,
          message: "项目不存在"
        });
      }
    }, 500);
  });
};

// 删除项目
export const deleteProject = (id: number): Promise<ApiResponse<null>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockProjectData.findIndex(item => item.id === id);
      if (index !== -1) {
        mockProjectData.splice(index, 1);
        resolve({
          code: 200,
          message: "删除成功",
          data: null
        });
      } else {
        reject({
          code: 404,
          message: "项目不存在"
        });
      }
    }, 300);
  });
};