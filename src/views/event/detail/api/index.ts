import type { ApiResponse } from "../../list/types/types";
import type { EventDetail, EventStats, Speaker, Sponsor, Material, Gallery } from "../types/types";

// 模拟详情数据 - 扩展到包含所有8个活动
const mockDetailData: Record<number, EventDetail> = {
  1: {
    id: 1,
    title: "2024全球创业者大会",
    description: "聚焦全球创业趋势，汇聚顶尖创业者、投资人和行业专家的年度盛会。",
    detailedIntro: `
      <h3>关于全球创业者大会</h3>
      <p>2024全球创业者大会是创业邦主办的年度顶级创业盛会，汇聚了全球最具影响力的创业者、投资人和行业专家。</p>
      <p>大会亮点：</p>
      <ul>
        <li>50+顶级创业导师现场分享</li>
        <li>100+优质项目现场路演</li>
        <li>20+行业细分论坛</li>
        <li>1000+创业精英深度交流</li>
      </ul>
      <p>这是一个不容错过的创业盛宴，期待您的参与！</p>
    `,
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
    registeredCount: 378,
    status: 0,
    isRecommended: true,
    contactPerson: "张经理",
    contactPhone: "010-88888888",
    contactEmail: "events@cyzone.cn",
    website: "https://www.cyzone.cn/event/2024",
    requirements: "创业者、投资人、企业高管、创业服务机构从业者",
    agenda: "主题演讲、圆桌论坛、项目路演、创业展览、一对一对接",
    benefits: "行业洞察、人脉拓展、投资机会、媒体曝光、资源对接",
    tags: ["创业", "投资", "论坛", "全球", "年度盛会"],
    speakers: [
      {
        id: 1,
        name: "张三",
        title: "首席执行官",
        company: "独角兽科技",
        avatar: "https://via.placeholder.com/100x100/4285f4/ffffff?text=张三",
        bio: "连续创业者，独角兽科技创始人兼CEO，专注人工智能领域创业投资。",
        topic: "AI时代的创业机遇与挑战"
      },
      {
        id: 2,
        name: "李四",
        title: "管理合伙人",
        company: "知名投资基金",
        avatar: "https://via.placeholder.com/100x100/34a853/ffffff?text=李四",
        bio: "资深投资人，管理资金规模超过100亿元，投资项目100+。",
        topic: "早期投资的趋势与策略"
      }
    ] as Speaker[],
    sponsors: [
      {
        id: 1,
        name: "科技银行",
        logo: "https://via.placeholder.com/150x80/ff6d01/ffffff?text=科技银行",
        level: "title",
        website: "https://techbank.com",
        description: "专业的科技金融服务提供商"
      },
      {
        id: 2,
        name: "创投基金",
        logo: "https://via.placeholder.com/150x80/9c27b0/ffffff?text=创投基金",
        level: "gold",
        website: "https://vcfund.com",
        description: "专注早期创业项目投资"
      }
    ] as Sponsor[],
    materials: [
      {
        id: 1,
        name: "2024创业趋势报告.pdf",
        type: "document",
        url: "/files/startup-trends-2024.pdf",
        size: 2048000,
        description: "深度分析2024年创业趋势和投资热点",
        downloadCount: 156
      },
      {
        id: 2,
        name: "投资指南手册.pdf",
        type: "document", 
        url: "/files/investment-guide.pdf",
        size: 1536000,
        description: "投资人必备的项目评估指南",
        downloadCount: 89
      }
    ] as Material[],
    gallery: [
      {
        id: 1,
        title: "大会现场",
        url: "https://via.placeholder.com/400x300/4285f4/ffffff?text=大会现场",
        thumbnail: "https://via.placeholder.com/200x150/4285f4/ffffff?text=大会现场",
        description: "2023年大会现场盛况",
        uploadTime: "2023-06-15T10:30:00Z"
      },
      {
        id: 2,
        title: "嘉宾演讲",
        url: "https://via.placeholder.com/400x300/34a853/ffffff?text=嘉宾演讲",
        thumbnail: "https://via.placeholder.com/200x150/34a853/ffffff?text=嘉宾演讲",
        description: "知名企业家主题演讲",
        uploadTime: "2023-06-15T14:20:00Z"
      }
    ] as Gallery[],
    createdTime: "2024-04-15T10:30:00Z",
    updatedTime: "2024-05-20T16:45:00Z",
    viewCount: 2847,
    favoriteCount: 156
  },
  2: {
    id: 2,
    title: "AI创业项目路演专场",
    description: "专注人工智能领域的创业项目路演活动，邀请知名AI投资机构现场点评。",
    detailedIntro: `
      <h3>关于AI创业项目路演专场</h3>
      <p>这是专门为人工智能创业项目打造的路演平台，汇聚了最具前瞻性的AI项目和最专业的投资机构。</p>
      <p>活动特色：</p>
      <ul>
        <li>12个精选AI项目现场路演</li>
        <li>10家顶级投资机构现场点评</li>
        <li>1对1投资人对接环节</li>
        <li>现场签约机会</li>
      </ul>
      <p>为AI创业者提供最直接的投资对接机会。</p>
    `,
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
    registeredCount: 178,
    status: 1,
    isRecommended: true,
    contactPerson: "李总监",
    contactPhone: "021-66666666",
    contactEmail: "roadshow@ai-vc.com",
    website: "https://ai-vc.com/roadshow/2024",
    requirements: "AI创业项目团队、投资机构代表、AI行业专家",
    agenda: "项目展示、投资人点评、一对一对接、现场签约仪式",
    benefits: "投资对接、专家指导、媒体曝光、行业交流、资源整合",
    tags: ["人工智能", "路演", "投资", "创业", "科技"],
    speakers: [
      {
        id: 3,
        name: "王五",
        title: "AI研究院院长",
        company: "清华大学",
        avatar: "https://via.placeholder.com/100x100/ff6d01/ffffff?text=王五",
        bio: "人工智能领域专家，发表论文100+篇，指导创业项目50+个。",
        topic: "AI技术发展趋势与产业应用"
      }
    ] as Speaker[],
    sponsors: [
      {
        id: 3,
        name: "AI芯片公司",
        logo: "https://via.placeholder.com/150x80/795548/ffffff?text=AI芯片",
        level: "gold",
        website: "https://aichip.com",
        description: "领先的AI芯片解决方案提供商"
      }
    ] as Sponsor[],
    materials: [] as Material[],
    gallery: [] as Gallery[],
    createdTime: "2024-04-10T14:20:00Z",
    updatedTime: "2024-05-15T09:30:00Z",
    viewCount: 1823,
    favoriteCount: 94
  },
  3: {
    id: 3,
    title: "女性创业者成长训练营",
    description: "专为女性创业者设计的成长训练营，涵盖商业模式、团队管理、融资技巧等。",
    detailedIntro: `
      <h3>关于女性创业者成长训练营</h3>
      <p>这是专门为女性创业者量身定制的系统性成长训练营，旨在帮助女性创业者提升综合能力。</p>
      <p>培训模块：</p>
      <ul>
        <li>商业模式设计与优化</li>
        <li>团队建设与管理技巧</li>
        <li>融资策略与路演技巧</li>
        <li>品牌营销与用户增长</li>
        <li>财务管理与风险控制</li>
      </ul>
      <p>导师阵容强大，均为成功女性企业家和投资人。</p>
    `,
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
    registeredCount: 72,
    status: 0,
    isRecommended: false,
    contactPerson: "王女士",
    contactPhone: "0755-88888888",
    contactEmail: "training@womenstartup.org",
    website: "https://womenstartup.org/training",
    requirements: "女性创业者、准创业者、女性高管",
    agenda: "商业计划书撰写、融资路演技巧、团队管理、案例分析、小组讨论",
    benefits: "系统培训、导师指导、同行交流、资源对接、持续支持",
    tags: ["女性创业", "培训", "成长", "管理", "融资"],
    speakers: [] as Speaker[],
    sponsors: [] as Sponsor[],
    materials: [] as Material[],
    gallery: [] as Gallery[],
    createdTime: "2024-05-01T11:15:00Z",
    updatedTime: "2024-06-18T14:20:00Z",
    viewCount: 945,
    favoriteCount: 67
  },
  4: {
    id: 4,
    title: "区块链技术与应用峰会",
    description: "探讨区块链技术在各行业的应用前景，分享最新的区块链创业机会。",
    detailedIntro: `
      <h3>关于区块链技术与应用峰会</h3>
      <p>本次峰会聚焦区块链技术的最新发展和实际应用，邀请行业领军人物分享前沿洞察。</p>
      <p>峰会内容：</p>
      <ul>
        <li>区块链技术发展趋势</li>
        <li>金融科技创新应用</li>
        <li>供应链管理解决方案</li>
        <li>数字资产投资机会</li>
      </ul>
    `,
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
    registeredCount: 295,
    status: 2,
    isRecommended: true,
    contactPerson: "陈主任",
    contactPhone: "0571-88888888",
    contactEmail: "summit@blockchain.org.cn",
    website: "https://blockchain.org.cn/summit2024",
    requirements: "区块链从业者、投资人、技术专家",
    agenda: "技术分享、应用案例、投资分析",
    benefits: "技术交流、商业合作、投资机会",
    tags: ["区块链", "技术", "峰会", "应用"],
    speakers: [] as Speaker[],
    sponsors: [] as Sponsor[],
    materials: [] as Material[],
    gallery: [] as Gallery[],
    createdTime: "2024-03-01T09:45:00Z",
    updatedTime: "2024-04-21T10:15:00Z",
    viewCount: 1567,
    favoriteCount: 89
  },
  5: {
    id: 5,
    title: "大学生创业大赛启动仪式",
    description: "第十届全国大学生创业大赛正式启动，鼓励在校大学生参与创新创业。",
    detailedIntro: `
      <h3>关于大学生创业大赛</h3>
      <p>全国大学生创业大赛是面向全国高校学生的权威创业竞赛，旨在激发大学生创新创业热情。</p>
      <p>大赛特色：</p>
      <ul>
        <li>覆盖全国2000+高校</li>
        <li>总奖金超过500万元</li>
        <li>提供创业导师指导</li>
        <li>优胜项目获得投资机会</li>
      </ul>
    `,
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
    registeredCount: 0,
    status: 0,
    isRecommended: false,
    contactPerson: "刘处长",
    contactPhone: "020-88888888",
    contactEmail: "competition@moe.edu.cn",
    website: "https://moe.edu.cn/competition2024",
    requirements: "在校大学生、高校创业导师",
    agenda: "政策解读、大赛介绍、经验分享",
    benefits: "政策了解、参赛指导、奖金支持",
    tags: ["大学生", "创业大赛", "政策", "启动"],
    speakers: [] as Speaker[],
    sponsors: [] as Sponsor[],
    materials: [] as Material[],
    gallery: [] as Gallery[],
    createdTime: "2024-07-15T15:30:00Z",
    updatedTime: "2024-08-01T09:00:00Z",
    viewCount: 678,
    favoriteCount: 34
  },
  6: {
    id: 6,
    title: "投融资对接沙龙",
    description: "为早期创业项目提供与投资人面对面交流的机会，促进投融资对接。",
    detailedIntro: `
      <h3>关于投融资对接沙龙</h3>
      <p>本次沙龙专门为早期创业项目和天使投资人搭建面对面交流的平台。</p>
      <p>活动安排：</p>
      <ul>
        <li>12个精选项目路演</li>
        <li>8位知名投资人点评</li>
        <li>1对1深度沟通</li>
        <li>现场投资意向签约</li>
      </ul>
    `,
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
    registeredCount: 60,
    status: 0,
    isRecommended: true,
    contactPerson: "赵总",
    contactPhone: "028-88888888",
    contactEmail: "salon@touziquan.com",
    website: "https://touziquan.com/salon",
    requirements: "早期创业项目、天使投资人、VC机构",
    agenda: "项目pitch、投资人点评、自由交流",
    benefits: "融资机会、专业建议、人脉拓展",
    tags: ["投融资", "沙龙", "对接", "早期项目"],
    speakers: [] as Speaker[],
    sponsors: [] as Sponsor[],
    materials: [] as Material[],
    gallery: [] as Gallery[],
    createdTime: "2024-05-10T16:20:00Z",
    updatedTime: "2024-05-25T11:40:00Z",
    viewCount: 892,
    favoriteCount: 45
  },
  7: {
    id: 7,
    title: "新零售创业交流会",
    description: "聚焦新零售领域的创业机会和挑战，分享成功案例和实战经验。",
    detailedIntro: `
      <h3>关于新零售创业交流会</h3>
      <p>本次交流会聚焦新零售行业的最新发展趋势，邀请成功企业家分享实战经验。</p>
      <p>主要议题：</p>
      <ul>
        <li>新零售模式创新</li>
        <li>线上线下融合策略</li>
        <li>供应链优化管理</li>
        <li>用户体验提升</li>
      </ul>
    `,
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
    registeredCount: 115,
    status: 2,
    isRecommended: false,
    contactPerson: "周经理",
    contactPhone: "027-88888888",
    contactEmail: "meetup@newretail.org.cn",
    website: "https://newretail.org.cn/meetup",
    requirements: "零售业从业者、电商创业者",
    agenda: "案例分享、经验交流、趋势分析",
    benefits: "行业洞察、经验学习、资源对接",
    tags: ["新零售", "沙龙", "交流", "电商"],
    speakers: [] as Speaker[],
    sponsors: [] as Sponsor[],
    materials: [] as Material[],
    gallery: [] as Gallery[],
    createdTime: "2024-03-01T13:10:00Z",
    updatedTime: "2024-03-26T08:30:00Z",
    viewCount: 567,
    favoriteCount: 28
  },
  8: {
    id: 8,
    title: "科技创业政策解读会",
    description: "详细解读最新的科技创业扶持政策，为创业者提供政策指导和申报建议。",
    detailedIntro: `
      <h3>关于科技创业政策解读会</h3>
      <p>本次解读会由科技部火炬中心主办，专门解读2024年最新的科技创业扶持政策。</p>
      <p>政策要点：</p>
      <ul>
        <li>高新技术企业认定</li>
        <li>科技型中小企业评价</li>
        <li>研发费用加计扣除</li>
        <li>创业担保贷款政策</li>
      </ul>
    `,
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
    registeredCount: 0,
    status: 0,
    isRecommended: true,
    contactPerson: "马主任",
    contactPhone: "029-88888888",
    contactEmail: "policy@most.gov.cn",
    website: "https://most.gov.cn/policy2024",
    requirements: "科技创业者、孵化器管理者",
    agenda: "政策解读、申报流程、答疑互动",
    benefits: "政策了解、申报指导、资金支持",
    tags: ["政策解读", "科技创业", "扶持", "资金"],
    speakers: [] as Speaker[],
    sponsors: [] as Sponsor[],
    materials: [] as Material[],
    gallery: [] as Gallery[],
    createdTime: "2024-07-20T10:00:00Z",
    updatedTime: "2024-08-01T14:30:00Z",
    viewCount: 423,
    favoriteCount: 19
  }
};

// 模拟统计数据
const mockStatsData: Record<number, EventStats> = {
  1: {
    totalViews: 2847,
    todayViews: 45,
    monthlyViews: 678,
    registrations: 378,
    completedRegistrations: 342,
    favorites: 156,
    shares: 89,
    averageRating: 4.6,
    feedbackCount: 67
  },
  2: {
    totalViews: 1823,
    todayViews: 32,
    monthlyViews: 456,
    registrations: 178,
    completedRegistrations: 156,
    favorites: 94,
    shares: 52,
    averageRating: 4.4,
    feedbackCount: 34
  },
  3: {
    totalViews: 945,
    todayViews: 18,
    monthlyViews: 234,
    registrations: 72,
    completedRegistrations: 65,
    favorites: 67,
    shares: 23,
    averageRating: 4.7,
    feedbackCount: 28
  },
  4: {
    totalViews: 1567,
    todayViews: 25,
    monthlyViews: 389,
    registrations: 295,
    completedRegistrations: 287,
    favorites: 89,
    shares: 43,
    averageRating: 4.5,
    feedbackCount: 52
  },
  5: {
    totalViews: 678,
    todayViews: 12,
    monthlyViews: 156,
    registrations: 0,
    completedRegistrations: 0,
    favorites: 34,
    shares: 18,
    averageRating: 0,
    feedbackCount: 0
  },
  6: {
    totalViews: 892,
    todayViews: 15,
    monthlyViews: 223,
    registrations: 60,
    completedRegistrations: 58,
    favorites: 45,
    shares: 22,
    averageRating: 4.3,
    feedbackCount: 18
  },
  7: {
    totalViews: 567,
    todayViews: 8,
    monthlyViews: 134,
    registrations: 115,
    completedRegistrations: 105,
    favorites: 28,
    shares: 14,
    averageRating: 4.2,
    feedbackCount: 31
  },
  8: {
    totalViews: 423,
    todayViews: 6,
    monthlyViews: 98,
    registrations: 0,
    completedRegistrations: 0,
    favorites: 19,
    shares: 9,
    averageRating: 0,
    feedbackCount: 0
  }
};

// 获取活动详情
export const getEventDetail = (id: number): Promise<ApiResponse<EventDetail>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const detail = mockDetailData[id];
      if (detail) {
        resolve({
          code: 200,
          success: true,
          message: "获取活动详情成功",
          data: detail
        });
      } else {
        reject({
          code: 404,
          success: false,
          message: "活动不存在"
        });
      }
    }, 300);
  });
};

// 获取活动统计数据
export const getEventStats = (id: number): Promise<ApiResponse<EventStats>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats = mockStatsData[id] || {
        totalViews: 0,
        todayViews: 0,
        monthlyViews: 0,
        registrations: 0,
        completedRegistrations: 0,
        favorites: 0,
        shares: 0,
        averageRating: 0,
        feedbackCount: 0
      };
      
      resolve({
        code: 200,
        success: true,
        message: "获取统计数据成功",
        data: stats
      });
    }, 200);
  });
};

// 更新活动状态
export const updateEventStatus = (id: number, status: number, note?: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("模拟更新活动状态:", { id, status, note });
      
      // 在模拟数据中更新状态
      const target = mockDetailData[id];
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
export const toggleEventRecommend = (id: number, isRecommended: boolean): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("模拟切换活动推荐状态:", { id, isRecommended });
      
      // 在模拟数据中更新推荐状态
      const target = mockDetailData[id];
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