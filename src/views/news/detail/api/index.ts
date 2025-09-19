import type { ApiResponse } from "../../list/types/types";
import type { NewsDetail, NewsStats } from "../types/types";

// 模拟详情数据 - 扩展到包含所有8个资讯
const mockDetailData: Record<number, NewsDetail> = {
  1: {
    id: 1,
    title: "海创荟2024年度创业大会成功举办",
    subtitle: "聚焦数字经济新趋势，助力创新创业新发展",
    author: "海创荟编辑部",
    source: "海创荟官网",
    summary: "2024年度创业大会在深圳成功举办，来自全国各地的500余名创业者、投资人和行业专家齐聚一堂，共话创新创业新趋势。",
    content: `
      <h3>关于海创荟2024年度创业大会</h3>
      <p>2024年度海创荟创业大会于3月15日在深圳国际会展中心隆重举行，本届大会以"数字经济新趋势，创新创业新发展"为主题，汇聚了来自全国各地的500余名创业者、投资人和行业专家。</p>
      
      <h4>大会亮点</h4>
      <ul>
        <li><strong>主题演讲</strong>：10位行业领袖分享数字经济发展趋势</li>
        <li><strong>项目路演</strong>：50个优质项目现场展示</li>
        <li><strong>投融资对接</strong>：超过20家投资机构参与</li>
        <li><strong>创新展览</strong>：100家科技企业展示最新成果</li>
      </ul>
      
      <h4>重要成果</h4>
      <p>大会期间共达成投资意向协议15项，总金额超过5亿元；签署战略合作协议8项；发布创新产品12个。与会专家一致认为，数字经济正成为推动创新创业的重要引擎。</p>
      
      <h4>未来展望</h4>
      <p>海创荟将继续发挥平台优势，为创业者提供更多优质资源和服务，助力更多创新项目落地开花，为经济高质量发展贡献力量。</p>
    `,
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
  2: {
    id: 2,
    title: "国家级科技企业孵化器认定结果公布",
    subtitle: "多家海创荟合作孵化器成功入选",
    author: "张小明",
    source: "科技日报",
    summary: "科技部公布2024年国家级科技企业孵化器认定结果，海创荟生态体系内多家孵化器成功入选。",
    content: `
      <h3>认定结果公布</h3>
      <p>科技部近日公布了2024年国家级科技企业孵化器认定结果，全国共有156家孵化器通过认定，其中海创荟生态体系内有8家合作孵化器成功入选，入选率达到5.1%。</p>
      
      <h4>入选机构概况</h4>
      <p>此次入选的8家孵化器分布在北京、上海、深圳、杭州等创新创业活跃城市，涵盖人工智能、生物医药、新材料、新能源等多个前沿技术领域。</p>
      
      <h4>认定标准</h4>
      <ul>
        <li>孵化场地面积不少于10000平方米</li>
        <li>在孵企业不少于50家</li>
        <li>累计毕业企业不少于25家</li>
        <li>孵化器管理团队专业化程度高</li>
      </ul>
      
      <h4>支持政策</h4>
      <p>国家级科技企业孵化器将享受多项优惠政策，包括税收减免、资金支持、人才引进等。这将进一步提升孵化器的服务能力和孵化成效。</p>
    `,
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
  3: {
    id: 3,
    title: "人工智能产业投融资报告发布",
    subtitle: "2024年一季度AI领域投资热点分析",
    author: "李投资",
    source: "投资界",
    summary: "最新发布的人工智能产业投融资报告显示，2024年一季度AI领域投资持续升温，多个细分赛道表现亮眼。",
    content: `
      <h3>投资概况</h3>
      <p>根据最新发布的《2024年Q1人工智能产业投融资报告》，一季度AI领域共发生投资事件147起，披露投资金额达368亿元，同比增长23.5%。</p>
      
      <h4>热门赛道</h4>
      <ul>
        <li><strong>大模型应用</strong>：投资事件32起，金额121亿元</li>
        <li><strong>自动驾驶</strong>：投资事件28起，金额89亿元</li>
        <li><strong>AI芯片</strong>：投资事件21起，金额67亿元</li>
        <li><strong>机器人</strong>：投资事件19起，金额45亿元</li>
      </ul>
      
      <h4>投资趋势</h4>
      <p>报告指出，当前AI投资呈现以下特点：</p>
      <ol>
        <li>投资向头部企业集中，单笔投资金额增大</li>
        <li>产业应用类项目受到更多关注</li>
        <li>技术门槛高的硬科技项目估值上升</li>
        <li>国际化布局成为重要考量因素</li>
      </ol>
      
      <h4>市场展望</h4>
      <p>专家预测，随着AI技术的不断成熟和应用场景的拓展，2024年全年AI领域投资有望突破1500亿元，继续保持高速增长态势。</p>
    `,
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
  4: {
    id: 4,
    title: "新能源汽车产业链创新发展论坛即将举办",
    subtitle: "聚焦智能网联与绿色出行新趋势",
    author: "王编辑",
    source: "汽车之家",
    summary: "新能源汽车产业链创新发展论坛将于本月底举办，届时将有众多行业专家分享最新技术趋势。",
    content: `
      <h3>论坛概况</h3>
      <p>由中国汽车工业协会主办的"新能源汽车产业链创新发展论坛"将于3月28-29日在上海举办。本次论坛以"智能网联与绿色出行"为主题，聚焦新能源汽车产业链的创新发展。</p>
      
      <h4>议程安排</h4>
      <ul>
        <li><strong>主论坛</strong>：产业发展趋势与政策解读</li>
        <li><strong>技术论坛</strong>：电池技术、智能驾驶、车联网</li>
        <li><strong>投资论坛</strong>：产业投资机遇与挑战</li>
        <li><strong>展览展示</strong>：最新技术产品现场展示</li>
      </ul>
      
      <h4>重点话题</h4>
      <ol>
        <li>固态电池技术发展与产业化前景</li>
        <li>自动驾驶技术的最新进展</li>
        <li>充电基础设施建设与运营模式</li>
        <li>新能源汽车出口市场机遇</li>
        <li>碳中和目标下的绿色出行解决方案</li>
      </ol>
      
      <h4>参会嘉宾</h4>
      <p>论坛邀请了包括院士专家、行业领军企业CEO、知名投资机构合伙人等在内的100余位重量级嘉宾，将为与会者带来最前沿的技术分享和深度的行业洞察。</p>
    `,
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
  5: {
    id: 5,
    title: "区块链技术在供应链金融中的应用实践",
    subtitle: "数字化转型助力中小企业融资",
    author: "赵技术",
    source: "金融科技周刊",
    summary: "区块链技术在供应链金融领域的应用越来越广泛，为中小企业提供了新的融资解决方案。",
    content: `
      <h3>技术背景</h3>
      <p>供应链金融作为解决中小企业融资难题的重要手段，在区块链技术的赋能下正迎来新的发展机遇。区块链的不可篡改、去中心化、透明度高等特性，为供应链金融提供了可靠的技术基础。</p>
      
      <h4>应用场景</h4>
      <ul>
        <li><strong>应收账款融资</strong>：基于区块链的应收账款确权和流转</li>
        <li><strong>预付款融资</strong>：智能合约自动化预付款管理</li>
        <li><strong>存货融资</strong>：物联网+区块链的存货监管</li>
        <li><strong>票据融资</strong>：数字化票据发行和交易</li>
      </ul>
      
      <h4>技术优势</h4>
      <ol>
        <li><strong>信息透明</strong>：所有交易信息上链，提高透明度</li>
        <li><strong>风险控制</strong>：实时监控资金流、信息流、物流</li>
        <li><strong>成本降低</strong>：减少中介环节，降低融资成本</li>
        <li><strong>效率提升</strong>：自动化处理，加快业务流程</li>
      </ol>
      
      <h4>实践案例</h4>
      <p>某大型制造企业通过区块链供应链金融平台，为其上下游200多家中小企业提供融资服务，累计放款金额超过50亿元，融资成本平均降低2个百分点。</p>
      
      <h4>发展前景</h4>
      <p>预计到2025年，基于区块链的供应链金融市场规模将达到3000亿元，为更多中小企业提供便捷、低成本的融资服务。</p>
    `,
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
  6: {
    id: 6,
    title: "创业投资税收优惠政策解读",
    subtitle: "助力天使投资和创业投资健康发展",
    author: "财政部",
    source: "财政部官网",
    summary: "财政部发布创业投资税收优惠政策解读，进一步明确相关税收优惠适用条件和申报流程。",
    content: `
      <h3>政策概述</h3>
      <p>为进一步支持创业投资发展，财政部、税务总局发布了《关于创业投资企业和天使投资个人有关税收政策的通知》，对创业投资税收优惠政策进行了详细解读。</p>
      
      <h4>主要优惠措施</h4>
      <ul>
        <li><strong>投资抵扣</strong>：投资初创科技型企业2年以上，可抵扣应纳税所得额</li>
        <li><strong>递延纳税</strong>：转让股权取得的所得可申请递延纳税</li>
        <li><strong>税率优惠</strong>：符合条件的创投企业享受20%的优惠税率</li>
        <li><strong>亏损结转</strong>：投资损失可向后结转5年</li>
      </ul>
      
      <h4>适用条件</h4>
      <ol>
        <li>投资对象必须是初创科技型企业</li>
        <li>投资期限不少于2年</li>
        <li>投资时被投资企业职工人数不超过200人</li>
        <li>被投资企业资产总额和年销售收入均不超过3000万元</li>
      </ol>
      
      <h4>申报流程</h4>
      <p>创业投资企业和天使投资个人需要在投资当年或次年进行备案，并在享受税收优惠时提交相关证明材料。具体申报流程可通过电子税务局在线办理。</p>
      
      <h4>政策意义</h4>
      <p>这些税收优惠政策将有效降低创业投资的税收负担，激发社会资本投资初创科技型企业的积极性，促进科技成果转化和产业化。</p>
    `,
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
  7: {
    id: 7,
    title: "生物医药产业园区建设加速推进",
    subtitle: "多地出台扶持政策促进产业集群发展",
    author: "健康时报",
    source: "健康时报",
    summary: "全国多地加快生物医药产业园区建设步伐，通过政策扶持和资源整合，促进产业集群化发展。",
    content: `
      <h3>发展现状</h3>
      <p>截至目前，全国已建成生物医药产业园区200余个，总投资规模超过5000亿元。这些园区集聚了超过8000家生物医药企业，从业人员达到150万人。</p>
      
      <h4>重点园区</h4>
      <ul>
        <li><strong>上海张江生物医药基地</strong>：聚集企业500余家，产值超过800亿元</li>
        <li><strong>北京中关村生命科学园</strong>：入驻企业400余家，涵盖生物制药全产业链</li>
        <li><strong>苏州生物医药产业园</strong>：形成了完整的创新药研发生产体系</li>
        <li><strong>广州国际生物岛</strong>：重点发展精准医疗和再生医学</li>
      </ul>
      
      <h4>扶持政策</h4>
      <ol>
        <li><strong>资金支持</strong>：设立专项发展基金，总规模超过1000亿元</li>
        <li><strong>税收优惠</strong>：研发费用加计扣除比例提高到200%</li>
        <li><strong>人才政策</strong>：提供住房补贴、子女教育等配套服务</li>
        <li><strong>审批便利</strong>：建立绿色通道，缩短审批时间</li>
      </ol>
      
      <h4>产业特色</h4>
      <p>各地园区结合自身优势，形成了差异化发展格局：</p>
      <ul>
        <li>长三角地区重点发展创新药和高端医疗器械</li>
        <li>京津冀地区聚焦生物制药和精准医疗</li>
        <li>粤港澳大湾区强化国际合作和成果转化</li>
        <li>成渝地区着力发展中药现代化</li>
      </ul>
      
      <h4>未来展望</h4>
      <p>预计到2025年，全国生物医药产业园区产值将突破2万亿元，成为推动健康中国建设的重要引擎。</p>
    `,
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
  8: {
    id: 8,
    title: "数字化转型助力传统制造业升级",
    subtitle: "工业互联网平台赋能智能制造",
    author: "制造业观察",
    source: "制造业观察",
    summary: "数字化转型正成为传统制造业转型升级的重要抓手，工业互联网平台发挥着越来越重要的作用。",
    content: `
      <h3>转型背景</h3>
      <p>面对全球产业竞争加剧和新技术革命的挑战，传统制造业急需通过数字化转型实现提质增效。工业互联网作为新一代信息技术与制造业深度融合的产物，正成为推动制造业高质量发展的重要引擎。</p>
      
      <h4>平台能力</h4>
      <ul>
        <li><strong>设备连接</strong>：实现设备数据的实时采集和监控</li>
        <li><strong>数据分析</strong>：通过AI算法优化生产流程</li>
        <li><strong>协同制造</strong>：打通供应链上下游信息壁垒</li>
        <li><strong>质量管控</strong>：建立全流程质量追溯体系</li>
      </ul>
      
      <h4>应用场景</h4>
      <ol>
        <li><strong>预测性维护</strong>：提前发现设备故障，降低停机损失</li>
        <li><strong>智能调度</strong>：优化生产计划，提高设备利用率</li>
        <li><strong>柔性制造</strong>：快速响应个性化需求</li>
        <li><strong>供应链协同</strong>：实现上下游信息共享</li>
      </ol>
      
      <h4>成功案例</h4>
      <p>某家电制造企业通过工业互联网平台改造，生产效率提升25%，产品不良品率降低60%，运营成本下降20%。目前该平台已复制推广到100多家同行企业。</p>
      
      <h4>发展趋势</h4>
      <ul>
        <li>平台化服务模式将更加成熟</li>
        <li>人工智能技术应用将更加深入</li>
        <li>跨行业跨领域应用将更加广泛</li>
        <li>安全保障能力将持续增强</li>
      </ul>
      
      <h4>政策支持</h4>
      <p>国家出台了一系列支持政策，包括设立工业互联网发展专项资金、开展试点示范、完善标准体系等，为制造业数字化转型提供有力支撑。</p>
    `,
    coverImage: "https://via.placeholder.com/400x240/e91e63/ffffff?text=数字化制造",
    publishTime: null, // 这是审核中的文章，还未发布
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
};

// 模拟统计数据
const mockStatsData: Record<number, NewsStats> = {
  1: {
    totalViews: 15680,
    todayViews: 234,
    weeklyViews: 1560,
    monthlyViews: 8900,
    totalComments: 128,
    totalLikes: 856,
    totalFavorites: 234,
    shareCount: 456
  },
  2: {
    totalViews: 8920,
    todayViews: 123,
    weeklyViews: 890,
    monthlyViews: 4560,
    totalComments: 45,
    totalLikes: 312,
    totalFavorites: 89,
    shareCount: 234
  },
  3: {
    totalViews: 12350,
    todayViews: 167,
    weeklyViews: 1235,
    monthlyViews: 6780,
    totalComments: 78,
    totalLikes: 445,
    totalFavorites: 156,
    shareCount: 321
  },
  4: {
    totalViews: 6780,
    todayViews: 89,
    weeklyViews: 678,
    monthlyViews: 3456,
    totalComments: 32,
    totalLikes: 198,
    totalFavorites: 67,
    shareCount: 145
  },
  5: {
    totalViews: 9560,
    todayViews: 134,
    weeklyViews: 956,
    monthlyViews: 5234,
    totalComments: 56,
    totalLikes: 278,
    totalFavorites: 123,
    shareCount: 267
  },
  6: {
    totalViews: 11200,
    todayViews: 145,
    weeklyViews: 1120,
    monthlyViews: 6123,
    totalComments: 89,
    totalLikes: 367,
    totalFavorites: 201,
    shareCount: 389
  },
  7: {
    totalViews: 7890,
    todayViews: 98,
    weeklyViews: 789,
    monthlyViews: 4123,
    totalComments: 41,
    totalLikes: 234,
    totalFavorites: 98,
    shareCount: 178
  },
  8: {
    totalViews: 0,
    todayViews: 0,
    weeklyViews: 0,
    monthlyViews: 0,
    totalComments: 0,
    totalLikes: 0,
    totalFavorites: 0,
    shareCount: 0
  }
};

// 获取资讯详情
export const getNewsDetail = (id: number): Promise<ApiResponse<NewsDetail>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const detail = mockDetailData[id];
      if (detail) {
        resolve({
          code: 200,
          success: true,
          message: "获取资讯详情成功",
          data: detail
        });
      } else {
        reject({
          code: 404,
          success: false,
          message: "资讯不存在"
        });
      }
    }, 300);
  });
};

// 获取资讯统计数据
export const getNewsStats = (id: number): Promise<ApiResponse<NewsStats>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats = mockStatsData[id] || {
        totalViews: 0,
        todayViews: 0,
        weeklyViews: 0,
        monthlyViews: 0,
        totalComments: 0,
        totalLikes: 0,
        totalFavorites: 0,
        shareCount: 0
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

// 更新资讯状态
export const updateNewsStatus = (id: number, status: number, note?: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("模拟更新资讯状态:", { id, status, note });
      
      // 在模拟数据中更新状态
      const target = mockDetailData[id];
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

// 推荐/取消推荐资讯
export const toggleNewsRecommend = (id: number, isRecommended: boolean): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("模拟切换资讯推荐状态:", { id, isRecommended });
      
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

// 置顶/取消置顶资讯
export const toggleNewsTop = (id: number, isTop: boolean): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("模拟切换资讯置顶状态:", { id, isTop });
      
      // 在模拟数据中更新置顶状态
      const target = mockDetailData[id];
      if (target) {
        target.isTop = isTop;
        target.updatedTime = new Date().toISOString();
      }
      
      resolve({
        code: 200,
        success: true,
        message: isTop ? "置顶成功" : "取消置顶成功",
        data: null
      });
    }, 500);
  });
};