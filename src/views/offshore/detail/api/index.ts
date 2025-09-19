import type { ApiResponse } from "../../list/types/types";
import type { OffshoreDetail, OffshoreStats, PolicyFile, ImageFile } from "../types/types";

// 模拟详情数据
const mockDetailData: Record<number, OffshoreDetail> = {
  1: {
    id: 1,
    name: "中关村硅谷创新中心",
    location: "美国硅谷",
    type: "科技园",
    description: "专注于高科技创新和跨国合作的离岸双创中心，致力于为中国企业提供硅谷资源对接。",
    detailedIntro: `
      <h3>关于中关村硅谷创新中心</h3>
      <p>中关村硅谷创新中心成立于2020年，是中关村在海外设立的首个综合性创新中心。</p>
      <p>我们致力于:</p>
      <ul>
        <li>为中国创新企业提供硅谷落地服务</li>
        <li>搭建中美科技创新合作桥梁</li>
        <li>推动全球创新资源整合</li>
        <li>促进跨国技术转移与产业化</li>
      </ul>
      <p>中心拥有一流的硬件设施和专业的服务团队，已成功孵化了多家独角兽企业。</p>
    `,
    logo: "https://via.placeholder.com/300x200/4285f4/ffffff?text=硅谷中心",
    status: 1,
    isRecommended: true,
    createdTime: "2023-01-15T10:30:00Z",
    updatedTime: "2024-01-15T16:45:00Z",
    website: "https://zgc-sv.com",
    contactPhone: "+1-650-555-0123",
    contactEmail: "info@zgc-sv.com",
    address: "2855 Telegraph Ave, Berkeley, CA 94705",
    services: ["技术转移服务", "投融资对接", "市场开拓支持", "法律咨询服务", "人才招聘服务", "知识产权保护"],
    advantages: ["硅谷核心区位", "顶级投资资源", "成熟孵化体系", "国际化团队"],
    policies: [
      { name: "硅谷创新扶持政策.pdf", url: "/files/sv-innovation-policy.pdf", size: 1024000, type: "application/pdf" },
      { name: "税收优惠实施细则.docx", url: "/files/tax-incentive.docx", size: 2048000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      { name: "中美科技合作指南.pdf", url: "/files/us-china-tech-guide.pdf", size: 1536000, type: "application/pdf" },
      { name: "知识产权保护手册.pdf", url: "/files/ip-protection.pdf", size: 1800000, type: "application/pdf" }
    ] as PolicyFile[],
    images: [
      { name: "中心外观.jpg", url: "https://via.placeholder.com/400x300/4285f4/ffffff?text=中心外观", size: 245760, type: "image/jpeg" },
      { name: "办公环境.jpg", url: "https://via.placeholder.com/400x300/34a853/ffffff?text=办公环境", size: 312400, type: "image/jpeg" },
      { name: "会议室.jpg", url: "https://via.placeholder.com/400x300/fbbc04/ffffff?text=会议室", size: 198500, type: "image/jpeg" },
      { name: "实验室.jpg", url: "https://via.placeholder.com/400x300/ea4335/ffffff?text=实验室", size: 286300, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2020-03-01",
    areaSize: 8000,
    companyCount: 45,
    graduatedCount: 12,
    successStoryCount: 8,
    viewCount: 1580,
    favoriteCount: 89
  },
  2: {
    id: 2,
    name: "中欧创新中心（柏林）",
    location: "德国柏林",
    type: "孵化器",
    description: "连接中欧创新资源，专注于智能制造、新能源和生物技术领域的跨境孵化。",
    detailedIntro: `
      <h3>关于中欧创新中心</h3>
      <p>中欧创新中心位于德国柏林，是连接中国与欧洲创新生态的重要枢纽。</p>
      <p>核心业务领域:</p>
      <ul>
        <li>智能制造技术孵化</li>
        <li>新能源项目加速</li>
        <li>生物技术研发合作</li>
        <li>欧洲市场进入支持</li>
      </ul>
      <p>中心与多家德国知名企业和研究机构建立了战略合作关系。</p>
    `,
    logo: "https://via.placeholder.com/300x200/34a853/ffffff?text=柏林中心",
    status: 1,
    isRecommended: true,
    createdTime: "2023-06-20T14:15:00Z",
    updatedTime: "2024-02-10T09:20:00Z",
    website: "https://sino-euro-berlin.de",
    contactPhone: "+49-30-555-0456",
    contactEmail: "contact@sino-euro-berlin.de",
    address: "Unter den Linden 6, 10117 Berlin, Germany",
    services: ["智能制造咨询", "新能源技术转移", "欧盟市场准入", "产业链对接", "人才交流"],
    advantages: ["欧洲门户位置", "工业4.0资源", "政策支持完善", "产学研结合"],
    policies: [
      { name: "欧盟创新扶持政策.pdf", url: "/files/eu-innovation-policy.pdf", size: 2200000, type: "application/pdf" },
      { name: "德国制造业补贴.docx", url: "/files/germany-manufacturing.docx", size: 1800000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      { name: "中欧合作框架.pdf", url: "/files/china-eu-framework.pdf", size: 1500000, type: "application/pdf" }
    ] as PolicyFile[],
    images: [
      { name: "柏林园区.jpg", url: "https://via.placeholder.com/400x300/ff6d01/ffffff?text=柏林园区", size: 428900, type: "image/jpeg" },
      { name: "研发中心.jpg", url: "https://via.placeholder.com/400x300/9c27b0/ffffff?text=研发中心", size: 356800, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2021-08-15",
    areaSize: 6500,
    companyCount: 32,
    graduatedCount: 8,
    successStoryCount: 5,
    viewCount: 1245,
    favoriteCount: 67
  },
  3: {
    id: 3,
    name: "亚太创新枢纽（新加坡）",
    location: "新加坡",
    type: "加速器",
    description: "立足新加坡，辐射整个亚太地区的创新加速器，重点支持金融科技和数字经济项目。",
    detailedIntro: `
      <h3>关于亚太创新枢纽</h3>
      <p>亚太创新枢纽位于新加坡金融中心，专注于金融科技和数字经济创新。</p>
      <p>服务优势:</p>
      <ul>
        <li>亚太地区战略位置</li>
        <li>完善的金融生态</li>
        <li>国际化监管环境</li>
        <li>多元文化融合</li>
      </ul>
    `,
    logo: "https://via.placeholder.com/300x200/ff6d01/ffffff?text=新加坡枢纽",
    status: 1,
    isRecommended: false,
    createdTime: "2023-09-10T11:00:00Z",
    updatedTime: "2024-03-05T13:30:00Z",
    website: "https://apac-innovation-hub.sg",
    contactPhone: "+65-6555-0789",
    contactEmail: "hello@apac-innovation-hub.sg",
    address: "1 Marina Bay, Singapore 018989",
    services: ["金融科技孵化", "数字经济加速", "区块链技术", "跨境支付", "监管科技"],
    advantages: ["金融中心优势", "政策创新领先", "人才荟萃", "基础设施完善"],
    policies: [
      { name: "新加坡创新政策.pdf", url: "/files/singapore-innovation.pdf", size: 1200000, type: "application/pdf" },
      { name: "金融科技监管沙盒.docx", url: "/files/fintech-sandbox.docx", size: 800000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      { name: "数字经济发展规划.pdf", url: "/files/digital-economy.pdf", size: 1600000, type: "application/pdf" }
    ] as PolicyFile[],
    images: [
      { name: "滨海湾景观.jpg", url: "https://via.placeholder.com/400x300/795548/ffffff?text=滨海湾景观", size: 289600, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2022-01-20",
    areaSize: 4200,
    companyCount: 28,
    graduatedCount: 5,
    successStoryCount: 3,
    viewCount: 892,
    favoriteCount: 45
  },
  6: {
    id: 6,
    name: "加拿大多伦多创新基地",
    location: "加拿大多伦多",
    type: "科技园",
    description: "依托多伦多大学等顶尖院校资源，专注于人工智能、量子计算和生命科学领域的创新孵化。",
    detailedIntro: `
      <h3>关于多伦多创新基地</h3>
      <p>多伦多创新基地位于加拿大多伦多市，是北美重要的科技创新中心之一。</p>
      <p>核心优势领域:</p>
      <ul>
        <li>人工智能与机器学习</li>
        <li>量子计算技术</li>
        <li>生命科学研究</li>
        <li>清洁技术创新</li>
      </ul>
    `,
    logo: "https://via.placeholder.com/300x200/607d8b/ffffff?text=多伦多基地",
    status: 1,
    isRecommended: false,
    createdTime: "2023-08-18T09:15:00Z",
    updatedTime: "2024-01-22T14:30:00Z",
    website: "https://toronto-innovation-base.ca",
    contactPhone: "+1-416-555-0789",
    contactEmail: "info@toronto-innovation-base.ca",
    address: "661 University Avenue, Toronto, ON M5G 1M1, Canada",
    services: ["AI技术孵化", "量子计算研发", "生命科学转化", "技术商业化", "国际市场拓展"],
    advantages: ["顶尖院校资源", "政府政策支持", "多元文化环境", "成熟金融体系"],
    policies: [
      { name: "加拿大创新支持政策.pdf", url: "/files/canada-innovation.pdf", size: 1800000, type: "application/pdf" },
      { name: "安大略省科技补贴.docx", url: "/files/ontario-tech.docx", size: 1200000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    ] as PolicyFile[],
    images: [
      { name: "基地全景.jpg", url: "https://via.placeholder.com/400x300/607d8b/ffffff?text=基地全景", size: 386700, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2022-06-01",
    areaSize: 7200,
    companyCount: 38,
    graduatedCount: 9,
    successStoryCount: 6,
    viewCount: 756,
    favoriteCount: 42
  },
  7: {
    id: 7,
    name: "英国伦敦金融科技中心",
    location: "英国伦敦",
    type: "加速器",
    description: "位于伦敦金融城核心区域，专注于金融科技、区块链和数字银行等前沿技术的孵化加速。",
    detailedIntro: `
      <h3>关于伦敦金融科技中心</h3>
      <p>伦敦金融科技中心位于全球金融中心的核心地带，是欧洲最重要的金融科技创新枢纽。</p>
      <p>专业领域:</p>
      <ul>
        <li>数字银行与支付</li>
        <li>区块链技术应用</li>
        <li>保险科技创新</li>
        <li>监管科技发展</li>
      </ul>
    `,
    logo: "https://via.placeholder.com/300x200/3f51b5/ffffff?text=伦敦金科",
    status: 1,
    isRecommended: true,
    createdTime: "2023-11-05T16:20:00Z",
    updatedTime: "2024-03-18T11:45:00Z",
    website: "https://london-fintech.co.uk",
    contactPhone: "+44-20-5555-0456",
    contactEmail: "contact@london-fintech.co.uk",
    address: "25 Old Broad Street, London EC2N 1HQ, UK",
    services: ["金融科技加速", "区块链孵化", "数字银行支持", "监管咨询服务", "投资者对接"],
    advantages: ["金融中心地位", "监管环境完善", "投资资源丰富", "国际化程度高"],
    policies: [
      { name: "英国金融科技战略.pdf", url: "/files/uk-fintech-strategy.pdf", size: 2100000, type: "application/pdf" },
      { name: "FCA监管沙盒指南.docx", url: "/files/fca-sandbox.docx", size: 1500000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    ] as PolicyFile[],
    images: [
      { name: "金融城景观.jpg", url: "https://via.placeholder.com/400x300/3f51b5/ffffff?text=金融城景观", size: 295800, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2023-03-15",
    areaSize: 4800,
    companyCount: 22,
    graduatedCount: 3,
    successStoryCount: 2,
    viewCount: 634,
    favoriteCount: 31
  },
  4: {
    id: 4,
    name: "中日韩创新联盟（东京）",
    location: "日本东京",
    type: "创业园",
    description: "专注于中日韩三国创新合作，在人工智能、机器人和新材料领域具有独特优势。",
    detailedIntro: `
      <h3>关于中日韩创新联盟</h3>
      <p>中日韩创新联盟位于东京，是连接东北亚三国创新资源的重要平台。</p>
      <p>核心业务方向:</p>
      <ul>
        <li>人工智能技术研发</li>
        <li>工业机器人创新</li>
        <li>新材料研究应用</li>
        <li>三国产业合作</li>
      </ul>
    `,
    logo: "https://via.placeholder.com/300x200/9c27b0/ffffff?text=东京联盟",
    status: 2,
    isRecommended: false,
    createdTime: "2024-01-25T08:45:00Z",
    updatedTime: "2024-03-15T15:10:00Z",
    website: "https://cjk-innovation-tokyo.jp",
    contactPhone: "+81-3-5555-0321",
    contactEmail: "info@cjk-innovation-tokyo.jp",
    address: "1-1-1 Shibuya, Shibuya City, Tokyo 150-0002, Japan",
    services: ["AI技术研发", "机器人创新", "新材料开发", "产业对接", "三国合作"],
    advantages: ["三国资源整合", "技术创新领先", "产业基础雄厚", "政策支持到位"],
    policies: [
      { name: "中日韩合作框架.pdf", url: "/files/cjk-framework.pdf", size: 1700000, type: "application/pdf" },
      { name: "东京创新政策.docx", url: "/files/tokyo-innovation.docx", size: 1300000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    ] as PolicyFile[],
    images: [
      { name: "联盟大楼.jpg", url: "https://via.placeholder.com/400x300/9c27b0/ffffff?text=联盟大楼", size: 324500, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2023-11-01",
    areaSize: 3800,
    companyCount: 18,
    graduatedCount: 2,
    successStoryCount: 1,
    viewCount: 567,
    favoriteCount: 23
  },
  5: {
    id: 5,
    name: "澳中科技合作中心",
    location: "澳大利亚悉尼",
    type: "研究院",
    description: "专注于清洁能源、生物医药和农业科技的国际合作研究与产业化。",
    detailedIntro: `
      <h3>关于澳中科技合作中心</h3>
      <p>澳中科技合作中心位于悉尼，是澳中两国科技合作的重要桥梁。</p>
      <p>研究重点:</p>
      <ul>
        <li>清洁能源技术</li>
        <li>生物医药研发</li>
        <li>现代农业科技</li>
        <li>海洋科学研究</li>
      </ul>
    `,
    logo: "https://via.placeholder.com/300x200/795548/ffffff?text=悉尼中心",
    status: 1,
    isRecommended: true,
    createdTime: "2023-04-12T12:20:00Z",
    updatedTime: "2024-02-28T10:15:00Z",
    website: "https://au-cn-tech.com.au",
    contactPhone: "+61-2-5555-0654",
    contactEmail: "contact@au-cn-tech.com.au",
    address: "Level 10, 1 Martin Place, Sydney NSW 2000, Australia",
    services: ["清洁能源研发", "生物医药转化", "农业科技创新", "海洋技术研究", "技术产业化"],
    advantages: ["自然资源丰富", "科研实力强", "政策环境好", "市场潜力大"],
    policies: [
      { name: "澳洲创新政策.pdf", url: "/files/australia-innovation.pdf", size: 1900000, type: "application/pdf" },
      { name: "清洁能源补贴.docx", url: "/files/clean-energy-subsidy.docx", size: 1100000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    ] as PolicyFile[],
    images: [
      { name: "中心外景.jpg", url: "https://via.placeholder.com/400x300/795548/ffffff?text=中心外景", size: 367200, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2021-05-10",
    areaSize: 5500,
    companyCount: 25,
    graduatedCount: 7,
    successStoryCount: 4,
    viewCount: 1034,
    favoriteCount: 58
  },
  8: {
    id: 8,
    name: "法国巴黎生物医药园",
    location: "法国巴黎",
    type: "孵化器",
    description: "法国领先的生物医药创新孵化器，专注于新药研发、医疗器械和数字医疗等领域。",
    detailedIntro: `
      <h3>关于巴黎生物医药园</h3>
      <p>巴黎生物医药园是法国乃至欧洲重要的生物医药创新中心。</p>
      <p>专业优势:</p>
      <ul>
        <li>新药研发平台</li>
        <li>医疗器械创新</li>
        <li>数字医疗技术</li>
        <li>临床试验服务</li>
      </ul>
    `,
    logo: "https://via.placeholder.com/300x200/e91e63/ffffff?text=巴黎医药",
    status: 0,
    isRecommended: false,
    createdTime: "2024-02-14T13:10:00Z",
    updatedTime: "2024-03-20T09:25:00Z",
    website: "https://paris-biotech.fr",
    contactPhone: "+33-1-5555-0123",
    contactEmail: "info@paris-biotech.fr",
    address: "15 Rue de Bercy, 75012 Paris, France",
    services: ["新药研发", "医疗器械", "数字医疗", "临床试验", "监管咨询"],
    advantages: ["医药传统深厚", "监管环境成熟", "人才资源丰富", "市场前景广阔"],
    policies: [
      { name: "法国生物医药政策.pdf", url: "/files/france-biotech.pdf", size: 2300000, type: "application/pdf" },
      { name: "欧盟药品监管.docx", url: "/files/eu-pharma-regulation.docx", size: 1600000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    ] as PolicyFile[],
    images: [
      { name: "实验室.jpg", url: "https://via.placeholder.com/400x300/e91e63/ffffff?text=实验室", size: 298400, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2023-12-01",
    areaSize: 3200,
    companyCount: 15,
    graduatedCount: 1,
    successStoryCount: 0,
    viewCount: 289,
    favoriteCount: 18
  },
  9: {
    id: 9,
    name: "韩国首尔游戏创意园",
    location: "韩国首尔",
    type: "创业园",
    description: "韩国最大的游戏和数字内容创业园区，汇聚了众多游戏开发、VR/AR和数字娱乐企业。",
    detailedIntro: `
      <h3>关于首尔游戏创意园</h3>
      <p>首尔游戏创意园是亚洲领先的数字内容创业园区。</p>
      <p>核心领域:</p>
      <ul>
        <li>手机游戏开发</li>
        <li>VR/AR技术</li>
        <li>数字娱乐内容</li>
        <li>电竞产业发展</li>
      </ul>
    `,
    logo: "https://via.placeholder.com/300x200/ff5722/ffffff?text=首尔游戏",
    status: 1,
    isRecommended: false,
    createdTime: "2023-05-30T14:45:00Z",
    updatedTime: "2024-02-15T16:20:00Z",
    website: "https://seoul-game-park.kr",
    contactPhone: "+82-2-5555-0567",
    contactEmail: "contact@seoul-game-park.kr",
    address: "396 World Cup buk-ro, Mapo-gu, Seoul 03925, South Korea",
    services: ["游戏开发", "VR/AR技术", "数字内容", "电竞支持", "海外发行"],
    advantages: ["游戏产业发达", "技术创新活跃", "市场接受度高", "政府支持力度大"],
    policies: [
      { name: "韩国游戏产业政策.pdf", url: "/files/korea-game-policy.pdf", size: 2000000, type: "application/pdf" },
      { name: "数字内容扶持计划.docx", url: "/files/digital-content-support.docx", size: 1400000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    ] as PolicyFile[],
    images: [
      { name: "创意空间.jpg", url: "https://via.placeholder.com/400x300/ff5722/ffffff?text=创意空间", size: 356800, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2021-10-20",
    areaSize: 5800,
    companyCount: 41,
    graduatedCount: 11,
    successStoryCount: 8,
    viewCount: 1123,
    favoriteCount: 67
  },
  10: {
    id: 10,
    name: "以色列特拉维夫科技中心",
    location: "以色列特拉维夫",
    type: "科技园",
    description: "以色列顶级的高科技创新中心，专注于网络安全、军用技术转民用和农业科技等领域。",
    detailedIntro: `
      <h3>关于特拉维夫科技中心</h3>
      <p>特拉维夫科技中心位于"中东硅谷"，是全球创新生态的重要组成部分。</p>
      <p>技术优势:</p>
      <ul>
        <li>网络安全技术</li>
        <li>军转民技术</li>
        <li>精准农业科技</li>
        <li>金融科技创新</li>
      </ul>
    `,
    logo: "https://via.placeholder.com/300x200/009688/ffffff?text=特拉维夫",
    status: 2,
    isRecommended: true,
    createdTime: "2024-01-08T10:35:00Z",
    updatedTime: "2024-03-12T15:40:00Z",
    website: "https://telaviv-tech.co.il",
    contactPhone: "+972-3-555-0890",
    contactEmail: "info@telaviv-tech.co.il",
    address: "Azrieli Sarona Tower, 121 Menachem Begin Rd, Tel Aviv-Yafo, Israel",
    services: ["网络安全", "军转民技术", "农业科技", "金融科技", "创业孵化"],
    advantages: ["技术创新强", "军事背景深", "国际化程度高", "资本活跃"],
    policies: [
      { name: "以色列创新政策.pdf", url: "/files/israel-innovation.pdf", size: 1800000, type: "application/pdf" },
      { name: "网络安全扶持.docx", url: "/files/cybersecurity-support.docx", size: 1200000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    ] as PolicyFile[],
    images: [
      { name: "科技园区.jpg", url: "https://via.placeholder.com/400x300/009688/ffffff?text=科技园区", size: 387600, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2023-09-01",
    areaSize: 6800,
    companyCount: 29,
    graduatedCount: 4,
    successStoryCount: 2,
    viewCount: 445,
    favoriteCount: 28
  }
};

// 模拟统计数据
const mockStatsData: Record<number, OffshoreStats> = {
  1: {
    todayViews: 35,
    totalViews: 1580,
    monthlyViews: 420,
    applications: 28,
    favorites: 89
  },
  2: {
    todayViews: 22,
    totalViews: 1245,
    monthlyViews: 315,
    applications: 19,
    favorites: 67
  },
  3: {
    todayViews: 18,
    totalViews: 892,
    monthlyViews: 235,
    applications: 14,
    favorites: 45
  },
  4: {
    todayViews: 12,
    totalViews: 567,
    monthlyViews: 158,
    applications: 9,
    favorites: 23
  },
  5: {
    todayViews: 28,
    totalViews: 1034,
    monthlyViews: 289,
    applications: 21,
    favorites: 58
  },
  6: {
    todayViews: 15,
    totalViews: 756,
    monthlyViews: 198,
    applications: 16,
    favorites: 42
  },
  7: {
    todayViews: 19,
    totalViews: 634,
    monthlyViews: 172,
    applications: 12,
    favorites: 31
  },
  8: {
    todayViews: 8,
    totalViews: 289,
    monthlyViews: 87,
    applications: 5,
    favorites: 18
  },
  9: {
    todayViews: 26,
    totalViews: 1123,
    monthlyViews: 301,
    applications: 23,
    favorites: 67
  },
  10: {
    todayViews: 11,
    totalViews: 445,
    monthlyViews: 124,
    applications: 8,
    favorites: 28
  }
};

// 获取离岸中心详情
export const getOffshoreDetail = (id: number): Promise<ApiResponse<OffshoreDetail>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const detail = mockDetailData[id];
      if (detail) {
        resolve({
          code: 200,
          success: true,
          message: "获取离岸中心详情成功",
          data: detail
        });
      } else {
        reject({
          code: 404,
          success: false,
          message: "离岸中心不存在"
        });
      }
    }, 300);
  });
};

// 获取离岸中心统计数据
export const getOffshoreStats = (id: number): Promise<ApiResponse<OffshoreStats>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats = mockStatsData[id] || {
        todayViews: 0,
        totalViews: 0,
        monthlyViews: 0,
        applications: 0,
        favorites: 0
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

// 更新离岸中心状态
export const updateOffshoreStatus = (id: number, status: number, note?: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("模拟更新离岸中心状态:", { id, status, note });
      resolve({
        code: 200,
        success: true,
        message: "状态更新成功",
        data: null
      });
    }, 500);
  });
};