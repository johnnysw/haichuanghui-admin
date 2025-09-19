import type { 
  NewsItem, 
  NewsCreateForm, 
  NewsListParams,
  NewsCategory,
  ApiResponse, 
  PaginationResponse
} from "../types/types";

// 模拟资讯列表数据
const mockNewsData: NewsItem[] = [
  {
    id: 1,
    title: "海创荟2024年度创业大会成功举办",
    subtitle: "聚焦数字经济新趋势，助力创新创业新发展",
    author: "海创荟编辑部",
    source: "海创荟官网",
    summary: "2024年度创业大会在深圳成功举办，来自全国各地的500余名创业者、投资人和行业专家齐聚一堂，共话创新创业新趋势。",
    content: "<p>2024年度海创荟创业大会于近日在深圳国际会展中心成功举办...</p>",
    coverImage: "https://via.placeholder.com/400x240/4285f4/ffffff?text=创业大会",
    publishTime: "2024-03-15T09:00:00Z",
    status: 1,
    reviewComment: null,
    reviewTime: "2024-03-14T16:30:00Z",
    isRecommended: true,
    isTop: true,
    viewCount: 15680,
    commentCount: 128,
    likeCount: 856,
    favoriteCount: 234,
    seoTitle: "海创荟2024年度创业大会 - 数字经济创新趋势",
    seoKeywords: "海创荟,创业大会,数字经济,创新创业",
    seoDescription: "海创荟2024年度创业大会聚焦数字经济新趋势，500余名行业精英共话创新发展",
    categoryId: 1,
    categoryName: "重大活动",
    tags: ["创业大会", "数字经济", "创新创业", "深圳"],
    createdTime: "2024-03-10T14:20:00Z",
    updatedTime: "2024-03-15T09:15:00Z"
  },
  {
    id: 2,
    title: "国家级科技企业孵化器认定结果公布",
    subtitle: "多家海创荟合作孵化器成功入选",
    author: "张小明",
    source: "科技日报",
    summary: "科技部公布2024年国家级科技企业孵化器认定结果，海创荟生态体系内多家孵化器成功入选。",
    coverImage: "https://via.placeholder.com/400x240/34a853/ffffff?text=孵化器认定",
    publishTime: "2024-03-12T10:30:00Z",
    status: 1,
    reviewComment: null,
    reviewTime: "2024-03-11T18:45:00Z",
    isRecommended: true,
    isTop: false,
    viewCount: 8920,
    commentCount: 45,
    likeCount: 312,
    favoriteCount: 89,
    seoTitle: "2024年国家级科技企业孵化器认定结果",
    seoKeywords: "科技企业孵化器,认定结果,科技部,海创荟",
    seoDescription: "科技部公布2024年国家级科技企业孵化器认定结果，多家合作机构成功入选",
    categoryId: 2,
    categoryName: "政策动态",
    tags: ["孵化器", "认定", "科技部", "政策"],
    createdTime: "2024-03-11T16:30:00Z",
    updatedTime: "2024-03-12T10:45:00Z"
  },
  {
    id: 3,
    title: "人工智能产业投融资报告发布",
    subtitle: "2024年一季度AI领域投资热点分析",
    author: "李投资",
    source: "投资界",
    summary: "最新发布的人工智能产业投融资报告显示，2024年一季度AI领域投资持续升温，多个细分赛道表现亮眼。",
    coverImage: "https://via.placeholder.com/400x240/ff6d01/ffffff?text=AI投融资",
    publishTime: "2024-03-10T14:15:00Z",
    status: 1,
    reviewComment: null,
    reviewTime: "2024-03-10T09:20:00Z",
    isRecommended: false,
    isTop: false,
    viewCount: 12350,
    commentCount: 78,
    likeCount: 445,
    favoriteCount: 156,
    seoTitle: "2024年Q1人工智能产业投融资报告",
    seoKeywords: "人工智能,投融资,报告,AI投资,风险投资",
    seoDescription: "深度分析2024年一季度人工智能产业投融资趋势，解读AI投资热点",
    categoryId: 3,
    categoryName: "行业报告",
    tags: ["人工智能", "投融资", "报告", "AI"],
    createdTime: "2024-03-09T11:45:00Z",
    updatedTime: "2024-03-10T14:30:00Z"
  },
  {
    id: 4,
    title: "新能源汽车产业链创新发展论坛即将举办",
    subtitle: "聚焦智能网联与绿色出行新趋势",
    author: "王编辑",
    source: "汽车之家",
    summary: "新能源汽车产业链创新发展论坛将于本月底举办，届时将有众多行业专家分享最新技术趋势。",
    coverImage: "https://via.placeholder.com/400x240/9c27b0/ffffff?text=新能源汽车",
    publishTime: "2024-03-08T16:20:00Z",
    status: 1,
    reviewComment: null,
    reviewTime: "2024-03-08T11:10:00Z",
    isRecommended: false,
    isTop: false,
    viewCount: 6780,
    commentCount: 32,
    likeCount: 198,
    favoriteCount: 67,
    categoryId: 4,
    categoryName: "行业动态",
    tags: ["新能源汽车", "产业链", "论坛", "智能网联"],
    createdTime: "2024-03-07T15:30:00Z",
    updatedTime: "2024-03-08T16:35:00Z"
  },
  {
    id: 5,
    title: "区块链技术在供应链金融中的应用实践",
    subtitle: "数字化转型助力中小企业融资",
    author: "赵技术",
    source: "金融科技周刊",
    summary: "区块链技术在供应链金融领域的应用越来越广泛，为中小企业提供了新的融资解决方案。",
    coverImage: "https://via.placeholder.com/400x240/795548/ffffff?text=区块链金融",
    publishTime: "2024-03-06T11:45:00Z",
    status: 1,
    reviewComment: null,
    reviewTime: "2024-03-05T17:20:00Z",
    isRecommended: true,
    isTop: false,
    viewCount: 9560,
    commentCount: 56,
    likeCount: 278,
    favoriteCount: 123,
    categoryId: 5,
    categoryName: "技术前沿",
    tags: ["区块链", "供应链金融", "中小企业", "融资"],
    createdTime: "2024-03-05T14:15:00Z",
    updatedTime: "2024-03-06T12:00:00Z"
  },
  {
    id: 6,
    title: "创业投资税收优惠政策解读",
    subtitle: "助力天使投资和创业投资健康发展",
    author: "财政部",
    source: "财政部官网",
    summary: "财政部发布创业投资税收优惠政策解读，进一步明确相关税收优惠适用条件和申报流程。",
    coverImage: "https://via.placeholder.com/400x240/607d8b/ffffff?text=税收政策",
    publishTime: "2024-03-05T09:30:00Z",
    status: 1,
    reviewComment: null,
    reviewTime: "2024-03-04T16:50:00Z",
    isRecommended: false,
    isTop: false,
    viewCount: 11200,
    commentCount: 89,
    likeCount: 367,
    favoriteCount: 201,
    categoryId: 2,
    categoryName: "政策动态",
    tags: ["税收优惠", "创业投资", "天使投资", "政策解读"],
    createdTime: "2024-03-04T13:40:00Z",
    updatedTime: "2024-03-05T09:45:00Z"
  },
  {
    id: 7,
    title: "生物医药产业园区建设加速推进",
    subtitle: "多地出台扶持政策促进产业集群发展",
    author: "健康时报",
    source: "健康时报",
    summary: "全国多地加快生物医药产业园区建设步伐，通过政策扶持和资源整合，促进产业集群化发展。",
    coverImage: "https://via.placeholder.com/400x240/3f51b5/ffffff?text=生物医药",
    publishTime: "2024-03-03T15:10:00Z",
    status: 1,
    reviewComment: null,
    reviewTime: "2024-03-03T10:25:00Z",
    isRecommended: false,
    isTop: false,
    viewCount: 7890,
    commentCount: 41,
    likeCount: 234,
    favoriteCount: 98,
    categoryId: 4,
    categoryName: "行业动态",
    tags: ["生物医药", "产业园区", "扶持政策", "集群发展"],
    createdTime: "2024-03-02T16:20:00Z",
    updatedTime: "2024-03-03T15:25:00Z"
  },
  {
    id: 8,
    title: "数字化转型助力传统制造业升级",
    subtitle: "工业互联网平台赋能智能制造",
    author: "制造业观察",
    source: "制造业观察",
    summary: "数字化转型正成为传统制造业转型升级的重要抓手，工业互联网平台发挥着越来越重要的作用。",
    coverImage: "https://via.placeholder.com/400x240/e91e63/ffffff?text=数字化制造",
    publishTime: "2024-03-01T13:20:00Z",
    status: 3,
    reviewComment: null,
    reviewTime: null,
    isRecommended: false,
    isTop: false,
    viewCount: 0,
    commentCount: 0,
    likeCount: 0,
    favoriteCount: 0,
    categoryId: 5,
    categoryName: "技术前沿",
    tags: ["数字化转型", "制造业", "工业互联网", "智能制造"],
    createdTime: "2024-02-29T10:15:00Z",
    updatedTime: "2024-03-01T13:35:00Z"
  }
];

// 模拟分类数据
const mockCategoryData: NewsCategory[] = [
  {
    id: 1,
    name: "重大活动",
    code: "major_events",
    description: "重要活动和会议资讯",
    icon: "ri:calendar-event-line",
    displayOrder: 1,
    level: 1,
    path: "1",
    isActive: true,
    isNavigation: true,
    articleCount: 15,
    status: 1,
    createdTime: "2024-01-01T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  },
  {
    id: 2,
    name: "政策动态",
    code: "policy_news",
    description: "政府政策和法规动态",
    icon: "ri:government-line",
    displayOrder: 2,
    level: 1,
    path: "2",
    isActive: true,
    isNavigation: true,
    articleCount: 28,
    status: 1,
    createdTime: "2024-01-01T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  },
  {
    id: 3,
    name: "行业报告",
    code: "industry_reports",
    description: "行业研究报告和数据分析",
    icon: "ri:bar-chart-line",
    displayOrder: 3,
    level: 1,
    path: "3",
    isActive: true,
    isNavigation: true,
    articleCount: 42,
    status: 1,
    createdTime: "2024-01-01T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  },
  {
    id: 4,
    name: "行业动态",
    code: "industry_news",
    description: "各行业最新动态和趋势",
    icon: "ri:line-chart-line",
    displayOrder: 4,
    level: 1,
    path: "4",
    isActive: true,
    isNavigation: true,
    articleCount: 56,
    status: 1,
    createdTime: "2024-01-01T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  },
  {
    id: 5,
    name: "技术前沿",
    code: "tech_frontier",
    description: "前沿技术和创新应用",
    icon: "ri:rocket-line",
    displayOrder: 5,
    level: 1,
    path: "5",
    isActive: true,
    isNavigation: true,
    articleCount: 33,
    status: 1,
    createdTime: "2024-01-01T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  }
];

// 获取资讯列表
export const getNewsList = (params: NewsListParams): Promise<ApiResponse<PaginationResponse<NewsItem>>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredData = [...mockNewsData];
      
      // 标题搜索
      if (params.title) {
        const title = params.title.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.title.toLowerCase().includes(title)
        );
      }
      
      // 作者筛选
      if (params.author) {
        const author = params.author.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.author.toLowerCase().includes(author)
        );
      }
      
      // 分类筛选
      if (params.categoryId) {
        filteredData = filteredData.filter(item => item.categoryId === params.categoryId);
      }
      
      // 状态筛选
      if (params.status !== undefined) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }
      
      // 推荐筛选
      if (params.isRecommended !== undefined) {
        filteredData = filteredData.filter(item => item.isRecommended === params.isRecommended);
      }
      
      // 置顶筛选
      if (params.isTop !== undefined) {
        filteredData = filteredData.filter(item => item.isTop === params.isTop);
      }
      
      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.title.toLowerCase().includes(keyword) ||
          item.summary?.toLowerCase().includes(keyword) ||
          item.author.toLowerCase().includes(keyword) ||
          item.tags?.some(tag => tag.toLowerCase().includes(keyword))
        );
      }
      
      // 排序
      const sortBy = params.sortBy || 'publishTime';
      const sortOrder = params.sortOrder || 'desc';
      filteredData.sort((a, b) => {
        let aValue = a[sortBy as keyof NewsItem];
        let bValue = b[sortBy as keyof NewsItem];
        
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
        message: "获取资讯列表成功",
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

// 创建资讯
export const createNews = (formData: NewsCreateForm): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟创建资讯:", formData);
      resolve({
        code: 200,
        success: true,
        message: "资讯创建成功",
        data: null
      });
    }, 1000);
  });
};

// 更新资讯
export const updateNews = (id: number, formData: Partial<NewsCreateForm>): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟更新资讯:", id, formData);
      resolve({
        code: 200,
        success: true,
        message: "资讯更新成功",
        data: null
      });
    }, 1000);
  });
};

// 删除资讯
export const deleteNews = (id: number): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟删除资讯:", id);
      resolve({
        code: 200,
        success: true,
        message: "资讯删除成功",
        data: null
      });
    }, 500);
  });
};

// 批量删除资讯
export const batchDeleteNews = (ids: number[]): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟批量删除资讯:", ids);
      resolve({
        code: 200,
        success: true,
        message: "批量删除成功",
        data: null
      });
    }, 1000);
  });
};

// 更新资讯状态
export const updateNewsStatus = (id: number, status: number): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟更新资讯状态:", id, status);
      
      // 在模拟数据中更新状态
      const target = mockNewsData.find(item => item.id === id);
      if (target) {
        target.status = status;
        target.updatedTime = new Date().toISOString();
        if (status === 1) {
          target.publishTime = new Date().toISOString();
        }
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

// 切换推荐状态
export const toggleNewsRecommend = (id: number, isRecommended: boolean): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟切换资讯推荐状态:", id, isRecommended);
      
      // 在模拟数据中更新推荐状态
      const target = mockNewsData.find(item => item.id === id);
      if (target) {
        target.isRecommended = isRecommended;
        target.updatedTime = new Date().toISOString();
      }
      
      resolve({
        code: 200,
        success: true,
        message: isRecommended ? "设为推荐成功" : "取消推荐成功",
        data: null
      });
    }, 500);
  });
};

// 切换置顶状态
export const toggleNewsTop = (id: number, isTop: boolean): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟切换资讯置顶状态:", id, isTop);
      
      // 在模拟数据中更新置顶状态
      const target = mockNewsData.find(item => item.id === id);
      if (target) {
        target.isTop = isTop;
        target.updatedTime = new Date().toISOString();
      }
      
      resolve({
        code: 200,
        success: true,
        message: isTop ? "设为置顶成功" : "取消置顶成功",
        data: null
      });
    }, 500);
  });
};

// 获取分类列表
export const getCategoryList = (): Promise<ApiResponse<NewsCategory[]>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        success: true,
        message: "获取分类列表成功",
        data: mockCategoryData
      });
    }, 200);
  });
};