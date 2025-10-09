import type {
  Event,
  EventCreateForm,
  EventListParams,
  ApiResponse,
  PaginationResponse
} from "../types/types";

// 模拟活动列表数据
const mockEventData: Event[] = [
  {
    id: 1,
    title: "2024全球创业者大会",
    description:
      "聚焦全球创业趋势，汇聚顶尖创业者、投资人和行业专家的年度盛会。",
    type: "行业论坛",
    organizer: "创业邦",
    poster: "https://via.placeholder.com/300x200/4285f4/ffffff?text=创业者大会",
    location: "北京",
    address: "北京国际会议中心",
    startTime: "2024-06-15T09:00:00Z",
    endTime: "2024-06-16T18:00:00Z",
    registrationStartTime: "2024-05-01T00:00:00Z",
    registrationEndTime: "2024-06-10T23:59:59Z",
    maxParticipants: 500,
    participantCount: 342,
    status: 0,
    isRecommended: true,
    contactPerson: "张经理",
    contactPhone: "010-88888888",
    contactEmail: "events@cyzone.cn",
    requirements: "创业者、投资人、企业高管",
    agenda: "主题演讲、圆桌论坛、项目路演",
    benefits: "行业洞察、人脉拓展、投资机会",
    tags: ["创业", "投资", "论坛", "全球"],
    createdTime: "2024-04-15T10:30:00Z",
    updatedTime: "2024-05-20T16:45:00Z"
  },
  {
    id: 2,
    title: "AI创业项目路演专场",
    description:
      "专注人工智能领域的创业项目路演活动，邀请知名AI投资机构现场点评。",
    type: "项目路演",
    organizer: "AI创投联盟",
    poster: "https://via.placeholder.com/300x200/34a853/ffffff?text=AI路演",
    location: "上海",
    address: "上海张江高科技园区创新大厦",
    startTime: "2024-05-28T14:00:00Z",
    endTime: "2024-05-28T18:00:00Z",
    registrationStartTime: "2024-04-20T00:00:00Z",
    registrationEndTime: "2024-05-25T12:00:00Z",
    maxParticipants: 200,
    participantCount: 156,
    status: 1,
    isRecommended: true,
    contactPerson: "李总监",
    contactPhone: "021-66666666",
    contactEmail: "roadshow@ai-vc.com",
    requirements: "AI创业项目团队、投资机构代表",
    agenda: "项目展示、投资人点评、一对一对接",
    benefits: "投资对接、专家指导、媒体曝光",
    tags: ["人工智能", "路演", "投资", "创业"],
    createdTime: "2024-04-10T14:20:00Z",
    updatedTime: "2024-05-15T09:30:00Z"
  },
  {
    id: 3,
    title: "女性创业者成长训练营",
    description:
      "专为女性创业者设计的成长训练营，涵盖商业模式、团队管理、融资技巧等。",
    type: "创业培训",
    organizer: "女性创业联盟",
    poster: "https://via.placeholder.com/300x200/ff6d01/ffffff?text=女性创业",
    location: "深圳",
    address: "深圳市南山区科技园",
    startTime: "2024-07-10T09:00:00Z",
    endTime: "2024-07-12T17:00:00Z",
    registrationStartTime: "2024-06-01T00:00:00Z",
    registrationEndTime: "2024-07-05T23:59:59Z",
    maxParticipants: 80,
    participantCount: 65,
    status: 0,
    isRecommended: false,
    contactPerson: "王女士",
    contactPhone: "0755-88888888",
    contactEmail: "training@womenstartup.org",
    requirements: "女性创业者、准创业者",
    agenda: "商业计划书撰写、融资路演技巧、团队管理",
    benefits: "系统培训、导师指导、同行交流",
    tags: ["女性创业", "培训", "成长", "管理"],
    createdTime: "2024-05-01T11:15:00Z",
    updatedTime: "2024-06-18T14:20:00Z"
  },
  {
    id: 4,
    title: "区块链技术与应用峰会",
    description: "探讨区块链技术在各行业的应用前景，分享最新的区块链创业机会。",
    type: "行业论坛",
    organizer: "区块链产业协会",
    poster: "https://via.placeholder.com/300x200/9c27b0/ffffff?text=区块链峰会",
    location: "杭州",
    address: "杭州国际博览中心",
    startTime: "2024-04-20T09:00:00Z",
    endTime: "2024-04-20T18:00:00Z",
    registrationStartTime: "2024-03-15T00:00:00Z",
    registrationEndTime: "2024-04-15T23:59:59Z",
    maxParticipants: 300,
    participantCount: 287,
    status: 2,
    isRecommended: true,
    contactPerson: "陈主任",
    contactPhone: "0571-88888888",
    contactEmail: "summit@blockchain.org.cn",
    requirements: "区块链从业者、投资人、技术专家",
    agenda: "技术分享、应用案例、投资分析",
    benefits: "技术交流、商业合作、投资机会",
    tags: ["区块链", "技术", "峰会", "应用"],
    createdTime: "2024-03-01T09:45:00Z",
    updatedTime: "2024-04-21T10:15:00Z"
  },
  {
    id: 5,
    title: "大学生创业大赛启动仪式",
    description:
      "第十届全国大学生创业大赛正式启动，鼓励在校大学生参与创新创业。",
    type: "政策宣讲",
    organizer: "教育部创业司",
    poster: "https://via.placeholder.com/300x200/795548/ffffff?text=创业大赛",
    location: "广州",
    address: "广州大学城体育中心",
    startTime: "2024-09-01T10:00:00Z",
    endTime: "2024-09-01T12:00:00Z",
    registrationStartTime: "2024-08-01T00:00:00Z",
    registrationEndTime: "2024-08-28T23:59:59Z",
    maxParticipants: 1000,
    participantCount: 0,
    status: 0,
    isRecommended: false,
    contactPerson: "刘处长",
    contactPhone: "020-88888888",
    contactEmail: "competition@moe.edu.cn",
    requirements: "在校大学生、高校创业导师",
    agenda: "政策解读、大赛介绍、经验分享",
    benefits: "政策了解、参赛指导、奖金支持",
    tags: ["大学生", "创业大赛", "政策", "启动"],
    createdTime: "2024-07-15T15:30:00Z",
    updatedTime: "2024-08-01T09:00:00Z"
  },
  {
    id: 6,
    title: "投融资对接沙龙",
    description: "为早期创业项目提供与投资人面对面交流的机会，促进投融资对接。",
    type: "投融资对接",
    organizer: "投资圈",
    poster: "https://via.placeholder.com/300x200/607d8b/ffffff?text=投融资沙龙",
    location: "成都",
    address: "成都高新区天府软件园",
    startTime: "2024-06-08T15:00:00Z",
    endTime: "2024-06-08T18:30:00Z",
    registrationStartTime: "2024-05-20T00:00:00Z",
    registrationEndTime: "2024-06-05T18:00:00Z",
    maxParticipants: 60,
    participantCount: 58,
    status: 0,
    isRecommended: true,
    contactPerson: "赵总",
    contactPhone: "028-88888888",
    contactEmail: "salon@touziquan.com",
    requirements: "早期创业项目、天使投资人、VC机构",
    agenda: "项目pitch、投资人点评、自由交流",
    benefits: "融资机会、专业建议、人脉拓展",
    tags: ["投融资", "沙龙", "对接", "早期项目"],
    createdTime: "2024-05-10T16:20:00Z",
    updatedTime: "2024-05-25T11:40:00Z"
  },
  {
    id: 7,
    title: "新零售创业交流会",
    description: "聚焦新零售领域的创业机会和挑战，分享成功案例和实战经验。",
    type: "创业沙龙",
    organizer: "新零售协会",
    poster: "https://via.placeholder.com/300x200/3f51b5/ffffff?text=新零售",
    location: "武汉",
    address: "武汉光谷创业街",
    startTime: "2024-03-25T19:00:00Z",
    endTime: "2024-03-25T21:30:00Z",
    registrationStartTime: "2024-03-10T00:00:00Z",
    registrationEndTime: "2024-03-23T12:00:00Z",
    maxParticipants: 120,
    participantCount: 105,
    status: 2,
    isRecommended: false,
    contactPerson: "周经理",
    contactPhone: "027-88888888",
    contactEmail: "meetup@newretail.org.cn",
    requirements: "零售业从业者、电商创业者",
    agenda: "案例分享、经验交流、趋势分析",
    benefits: "行业洞察、经验学习、资源对接",
    tags: ["新零售", "沙龙", "交流", "电商"],
    createdTime: "2024-03-01T13:10:00Z",
    updatedTime: "2024-03-26T08:30:00Z"
  },
  {
    id: 8,
    title: "科技创业政策解读会",
    description:
      "详细解读最新的科技创业扶持政策，为创业者提供政策指导和申报建议。",
    type: "政策宣讲",
    organizer: "科技部火炬中心",
    poster: "https://via.placeholder.com/300x200/e91e63/ffffff?text=政策解读",
    location: "西安",
    address: "西安高新区管委会会议厅",
    startTime: "2024-08-15T14:00:00Z",
    endTime: "2024-08-15T17:00:00Z",
    registrationStartTime: "2024-07-20T00:00:00Z",
    registrationEndTime: "2024-08-12T18:00:00Z",
    maxParticipants: 200,
    participantCount: 0,
    status: 0,
    isRecommended: true,
    contactPerson: "马主任",
    contactPhone: "029-88888888",
    contactEmail: "policy@most.gov.cn",
    requirements: "科技创业者、孵化器管理者",
    agenda: "政策解读、申报流程、答疑互动",
    benefits: "政策了解、申报指导、资金支持",
    tags: ["政策解读", "科技创业", "扶持", "资金"],
    createdTime: "2024-07-20T10:00:00Z",
    updatedTime: "2024-08-01T14:30:00Z"
  }
];

// 获取活动列表
export const getEventList = (
  params: EventListParams
): Promise<ApiResponse<PaginationResponse<Event>>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredData = [...mockEventData];

      // 活动名称搜索
      if (params.title) {
        const title = params.title.toLowerCase();
        filteredData = filteredData.filter(
          item =>
            item.title.toLowerCase().includes(title) ||
            item.description?.toLowerCase().includes(title)
        );
      }

      // 活动类型筛选
      if (params.type) {
        filteredData = filteredData.filter(item => item.type === params.type);
      }

      // 主办方筛选
      if (params.organizer) {
        const organizer = params.organizer.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.organizer.toLowerCase().includes(organizer)
        );
      }

      // 状态筛选
      if (params.status !== undefined) {
        filteredData = filteredData.filter(
          item => item.status === params.status
        );
      }

      // 推荐筛选
      if (params.isRecommended !== undefined) {
        filteredData = filteredData.filter(
          item => item.isRecommended === params.isRecommended
        );
      }

      // 地区筛选
      if (params.location) {
        filteredData = filteredData.filter(item =>
          item.location.includes(params.location!)
        );
      }

      // 排序
      const sortBy = params.sortBy || "createdTime";
      const sortOrder = params.sortOrder || "desc";
      filteredData.sort((a, b) => {
        let aValue = a[sortBy as keyof Event];
        let bValue = b[sortBy as keyof Event];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "desc"
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
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
        message: "获取活动列表成功",
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

// 创建活动
export const createEvent = (
  formData: EventCreateForm
): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟创建活动:", formData);
      resolve({
        code: 200,
        success: true,
        message: "活动创建成功",
        data: null
      });
    }, 1000);
  });
};

// 更新活动
export const updateEvent = (
  id: number,
  formData: Partial<EventCreateForm>
): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟更新活动:", id, formData);
      resolve({
        code: 200,
        success: true,
        message: "活动更新成功",
        data: null
      });
    }, 1000);
  });
};

// 删除活动
export const deleteEvent = (id: number): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟删除活动:", id);
      resolve({
        code: 200,
        success: true,
        message: "活动删除成功",
        data: null
      });
    }, 500);
  });
};

// 更新活动状态
export const updateEventStatus = (
  id: number,
  status: number
): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟更新活动状态:", id, status);

      // 在模拟数据中更新状态
      const target = mockEventData.find(item => item.id === id);
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

// 推荐/取消推荐活动
export const toggleEventRecommend = (
  id: number,
  isRecommended: boolean
): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟切换活动推荐状态:", id, isRecommended);

      // 在模拟数据中更新推荐状态
      const target = mockEventData.find(item => item.id === id);
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
