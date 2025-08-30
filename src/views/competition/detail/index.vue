<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCompetitionDetail } from "./composables/useCompetitionDetail";
import { useCompetitionDetailActions } from "./composables/useCompetitionDetailActions";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import { getFullImageUrl } from "@/utils/image";
import { getMaterials } from "../list/api/materials";
import type { CompetitionMaterial } from "../list/types/types";
// 引入admin端的图标组件
import { IconifyIconOffline } from "@/components/ReIcon";
// 引入需要的图标
import ArrowLeftIcon from "@iconify-icons/ep/arrow-left";
import ShareIcon from "@iconify-icons/ep/share";
import DocumentIcon from "@iconify-icons/ep/document";
import EditIcon from "@iconify-icons/ep/edit";
import HeartIcon from "@iconify-icons/ri/heart-line";
import { Document, Link, Download, Loading } from "@element-plus/icons-vue";

defineOptions({
  name: "CompetitionDetail"
});

const route = useRoute();
const router = useRouter();

// 获取大赛ID
const competitionId = ref(Number(route.params.id) || 0);

// 使用composables
const { competitionData, loading, statusMap, fetchCompetitionDetail } = useCompetitionDetail();
const { saveCompetition, reviewCompetitionAction, toggleRecommendation } = useCompetitionDetailActions();

// 添加PC端的状态变量
const relatedCompetitions = ref([]);
const isFavorited = ref(false);
const favoriteLoading = ref(false);
const isRegistered = ref(false);

// 竞赛资料相关状态
const materials = ref<CompetitionMaterial[]>([]);
const materialsLoading = ref(false);

// 标签页配置
const activeTab = ref('summary');
const tabs = [
  { key: 'summary', label: '大赛简介' },
  { key: 'description', label: '大赛主题' },
  { key: 'organizer', label: '组织机构' },
  { key: 'requirements', label: '参赛条件' },
  { key: 'schedule', label: '大赛流程' },
  { key: 'prizes', label: '政策支持' },
  { key: 'materialDescription', label: '赛事资料' },
];

// 标签页内容
const tabContent = computed(() => {
  if (!competitionData.value) return '';

  const content: Record<string, string> = {
    summary: competitionData.value.summary || '暂无大赛简介',
    description: competitionData.value.description || '暂无大赛主题',
    organizer: competitionData.value.coOrganizers || '暂无组织机构信息',
    requirements: competitionData.value.requirements || '暂无参赛条件',
    schedule: competitionData.value.schedule || '暂无大赛流程',
    prizes: competitionData.value.prizes || '暂无政策支持',
    materialDescription: competitionData.value.materialDescription || '暂无赛事资料说明',
  };

  return content[activeTab.value] || '';
});

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// 状态配置映射 - 使用PC端的样式
const statusConfig = computed(() => {
  if (!competitionData.value) return { text: '', class: '' };

  const statusClassMap: Record<number, { text: string; class: string }> = {
    0: { text: '草稿', class: 'bg-gray-100 text-gray-600' },
    1: { text: '报名中', class: 'bg-green-100 text-green-600' },
    2: { text: '进行中', class: 'bg-primary text-white' },
    3: { text: '已结束', class: 'bg-gray-100 text-gray-600' },
    4: { text: '已取消', class: 'bg-red-100 text-red-600' },
    5: { text: '审核中', class: 'bg-yellow-100 text-yellow-600' },
    6: { text: '已拒绝', class: 'bg-red-100 text-red-600' },
  };

  return statusClassMap[competitionData.value.status] || { text: '未知状态', class: 'bg-gray-100 text-gray-600' };
});

// 组件挂载时获取数据
onMounted(() => {
  if (competitionId.value) {
    fetchCompetitionDetail(competitionId.value);
    // 加载相关大赛数据
    loadRelatedCompetitions();
    // 加载竞赛资料
    loadMaterials();
  }
});

// 返回列表页
const goBack = () => {
  router.push("/competition/list");
};

// 审核大赛
const reviewCompetition = (status: number) => {
  if (!competitionData.value) return;

  if (status === 6) {
    // 拒绝时需要输入拒绝原因
    ElMessageBox.prompt("请输入拒绝原因：", "拒绝大赛", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /^.{1,200}$/,
      inputErrorMessage: "拒绝原因长度应在1-200个字符之间"
    }).then(({ value }) => {
      reviewCompetitionAction(competitionId.value, status, value);
    }).catch(() => {
      ElMessage.info("已取消拒绝");
    });
  } else {
    const action = status === 1 ? "通过" : "审核";
    ElMessageBox.confirm(`确认要${action}该大赛吗？`, "确认操作", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      const result = await reviewCompetitionAction(competitionId.value, status);
      if (result.success) {
        // 更新本地数据
        if (competitionData.value) {
          competitionData.value.status = status;
          if (status !== 1) {
            competitionData.value.reviewComment = result.data?.reviewComment || "";
            competitionData.value.reviewTime = result.data?.reviewTime || "";
          }
        }
      }
    });
  }
};

// 切换推荐状态
const toggleRecommend = () => {
  if (!competitionData.value) return;

  const newRecommended = !competitionData.value.isRecommended;
  const action = newRecommended ? "推荐" : "取消推荐";

  ElMessageBox.confirm(`确认要${action}该大赛吗？`, "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    const result = await toggleRecommendation(competitionId.value, newRecommended);
    if (result.success) {
      // 更新本地数据
      if (competitionData.value) {
        competitionData.value.isRecommended = newRecommended;
      }
    }
  });
};

// 切换标签页
const switchTab = (tabKey: string) => {
  activeTab.value = tabKey;
};

// 添加PC端的功能函数（仅为保持一致性，不具备实际功能）
const handleFavorite = () => {
  // 管理端不需要收藏功能，仅为保持UI一致性
  console.log('管理端不支持收藏功能');
};

const handleShare = () => {
  // 管理端不需要分享功能，仅为保持UI一致性
  console.log('管理端不支持分享功能');
};

// 加载相关大赛数据（可选实现）
const loadRelatedCompetitions = async () => {
  try {
    // 这里可以调用API获取相关大赛，暂时使用空数组
    relatedCompetitions.value = [];
  } catch (error) {
    console.error('加载相关大赛失败:', error);
    relatedCompetitions.value = [];
  }
};

// 加载竞赛资料列表
const loadMaterials = async () => {
  if (!competitionId.value) return;
  
  try {
    materialsLoading.value = true;
    const result = await getMaterials({ competitionId: competitionId.value });
    if (result.code === 200) {
      materials.value = result.data.list;
    }
  } catch (error) {
    console.error('加载资料列表失败:', error);
    materials.value = [];
  } finally {
    materialsLoading.value = false;
  }
};

// 处理主办方logo加载错误
const handleLogoError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.style.display = 'none';
  }
};

// 下载资料
const downloadMaterial = (material: CompetitionMaterial) => {
  if (material.category === 'download' && material.fileUrl) {
    // 文件下载 - 构造完整URL并新开窗口下载
    const fullUrl = getFullImageUrl(material.fileUrl);
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = material.fileName || material.title;
    link.target = '_blank';
    link.click();
  } else if (material.category === 'link' && material.linkUrl) {
    // 链接访问 - 新开窗口访问
    window.open(material.linkUrl, '_blank');
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 competition-detail-page">
    <!-- 主内容区域 - 调整padding适合admin端 -->
    <main class="pt-6 pb-10">
      <div class="container mx-auto px-4">
        <!-- 顶部操作栏 -->
        <div class="flex justify-between items-center mb-6">
          <!-- 返回按钮 -->
          <el-button @click="goBack" type="primary" link>
            <IconifyIconOffline :icon="ArrowLeftIcon" class="mr-1" />返回列表
          </el-button>

          <!-- 推荐按钮 -->
          <el-button
            :type="competitionData?.isRecommended ? 'warning' : 'success'"
            @click="toggleRecommend"
            v-if="competitionData && [1, 2, 3].includes(competitionData.status)"
            size="default"
          >
            {{ competitionData?.isRecommended ? '取消推荐' : '推荐大赛' }}
          </el-button>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center py-20" v-loading="loading">
          <div class="text-gray-500">加载中...</div>
        </div>

        <!-- 大赛详情内容 -->
        <div v-else-if="competitionData">
          <!-- 大赛基本信息 -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div class="relative">
              <!-- 使用海报图片作为背景，如果没有则使用渐变背景 -->
              <div class="w-full h-64 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center relative">
                <!-- 如果有海报图片则显示为背景 -->
                <img
                  v-if="competitionData.poster"
                  :src="getFullImageUrl(competitionData.poster)"
                  :alt="competitionData.title"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <!-- 遮罩层 -->
                <div class="absolute inset-0 bg-black bg-opacity-30"></div>
                <!-- 内容层 -->
                <div class="relative z-10 container mx-auto px-8">
                  <div class="max-w-4xl">
                    <span
                      :class="[
                        'inline-block px-3 py-1 text-sm rounded-full mb-4',
                        statusConfig.class,
                      ]"
                    >
                      {{ statusConfig.text }}
                    </span>
                    <h1 class="text-4xl font-bold text-white mb-4">{{ competitionData.title }}</h1>
                    <div class="flex items-center text-white mb-2">
                      <i class="i-ep-calendar mr-2"></i>
                      <span>报名时间：{{ dayjs(competitionData.startTime).format('YYYY-MM-DD') }} 至 {{ dayjs(competitionData.endTime).format('YYYY-MM-DD') }}</span>
                    </div>
                    <div class="flex items-center text-white">
                      <i class="i-ep-location mr-2"></i>
                      <span>举办地点：{{ competitionData.location }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <div class="flex items-center">
                  <!-- 主办方logo -->
                  <div class="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                    <img
                      v-if="competitionData.organizerLogo"
                      :src="getFullImageUrl(competitionData.organizerLogo)"
                      :alt="competitionData.organizer"
                      class="w-full h-full rounded-full object-cover"
                      @error="handleLogoError"
                    />
                    <i v-else class="i-ep-office-building text-2xl text-gray-500"></i>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-semibold">{{ competitionData.organizer }}</h3>
                    <p class="text-gray-600 text-sm">主办方</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-3">
                  <!-- 管理员专用按钮 -->
                  <el-button
                    type="primary"
                    @click="reviewCompetition(1)"
                    v-if="competitionData.status === 5"
                    size="default"
                  >
                    通过审核
                  </el-button>
                  <el-button
                    type="danger"
                    @click="reviewCompetition(6)"
                    v-if="competitionData.status === 5"
                    size="default"
                  >
                    拒绝
                  </el-button>

                  <!-- PC端样式的按钮 -->
                  <el-button
                    type="info"
                    plain
                    class="pc-style-btn register-btn"
                    size="default"
                    disabled
                  >
                    <IconifyIconOffline
                      :icon="EditIcon"
                      class="mr-2 w-4 h-4"
                    />
                    立即报名
                  </el-button>
                  <el-button
                    type="info"
                    plain
                    class="pc-style-btn favorite-btn"
                    size="default"
                    disabled
                  >
                    <IconifyIconOffline
                      :icon="HeartIcon"
                      class="mr-2 w-4 h-4"
                    />
                    收藏
                  </el-button>
                  <el-button
                    type="info"
                    plain
                    class="pc-style-btn share-btn"
                    size="default"
                    disabled
                  >
                    <IconifyIconOffline :icon="ShareIcon" class="mr-2 w-4 h-4" />分享
                  </el-button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-6">
                <div class="text-center">
                  <p class="text-gray-600 mb-1 text-sm">报名截止</p>
                  <p class="text-lg md:text-xl font-bold">{{ dayjs(competitionData.registrationDeadline).format('YYYY-MM-DD') }}</p>
                </div>
                <div class="text-center">
                  <p class="text-gray-600 mb-1 text-sm">已报名</p>
                  <p class="text-lg md:text-xl font-bold">{{ competitionData.registrationCount || 0 }}</p>
                </div>
                <div class="text-center">
                  <p class="text-gray-600 mb-1 text-sm">浏览量</p>
                  <p class="text-lg md:text-xl font-bold">{{ (competitionData.viewCount || 0).toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 大赛详细信息标签页 -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div class="border-b border-gray-200">
              <div class="flex overflow-x-auto">
                <button
                  v-for="tab in tabs"
                  :key="tab.key"
                  @click="switchTab(tab.key)"
                  :class="[
                    'px-6 py-4 text-center whitespace-nowrap font-medium bg-transparent',
                    activeTab === tab.key
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary',
                  ]"
                >
                  {{ tab.label }}
                </button>
              </div>
            </div>

            <div class="p-8">
              <!-- 资料标签页特殊处理 -->
              <div v-if="activeTab === 'materialDescription'" class="max-w-4xl">
                <!-- 富文本说明 -->
                <div v-if="tabContent" class="tab-content mb-8" v-html="tabContent"></div>
                
                <!-- 资料列表 -->
                <div class="materials-section">
                  <div class="materials-header mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">附件</h3>
                    <span class="text-sm text-gray-500" v-if="materials.length > 0">
                      共 {{ materials.length }} 个资料
                    </span>
                  </div>
                  
                  <!-- 加载状态 -->
                  <div v-if="materialsLoading" class="flex justify-center py-8">
                    <el-icon class="animate-spin text-2xl text-gray-400">
                      <loading />
                    </el-icon>
                  </div>
                  
                  <!-- 资料列表 -->
                  <div v-else-if="materials.length > 0" class="materials-grid">
                    <div 
                      v-for="material in materials" 
                      :key="material.id"
                      class="material-card"
                    >
                      <!-- 左侧：图标 -->
                      <div class="material-icon">
                        <el-icon v-if="material.category === 'download'" class="text-blue-500 text-2xl">
                          <document />
                        </el-icon>
                        <el-icon v-else class="text-green-500 text-2xl">
                          <link />
                        </el-icon>
                      </div>
                      
                      <!-- 中间：标题和大小信息 -->
                      <div class="material-info">
                        <h4 class="material-title">{{ material.title }}</h4>
                        <div class="material-meta">
                          <span v-if="material.category === 'download' && material.fileSize" class="meta-item">
                            {{ formatFileSize(material.fileSize) }}
                          </span>
                          <span v-if="material.category === 'link'" class="meta-item">
                            {{ material.linkType || '外部链接' }}
                          </span>
                          <span v-if="material.isRequired" class="meta-item badge required">
                            必读
                          </span>
                        </div>
                        <p v-if="material.description" class="material-description">
                          {{ material.description }}
                        </p>
                      </div>
                      
                      <!-- 右侧：下载按钮 -->
                      <div class="material-actions">
                        <el-button 
                          type="primary" 
                          size="small"
                          @click="downloadMaterial(material)"
                        >
                          <el-icon class="mr-1">
                            <download />
                          </el-icon>
                          {{ material.category === 'download' ? '下载' : '访问' }}
                        </el-button>
                        <span v-if="material.downloadCount" class="download-count">
                          下载 {{ material.downloadCount }} 次
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 空状态 -->
                  <div v-else class="empty-state">
                    <el-icon class="text-4xl text-gray-300 mb-2">
                      <document />
                    </el-icon>
                    <p class="text-gray-500">暂无赛事资料</p>
                  </div>
                </div>
              </div>
              
              <!-- 其他标签页 -->
              <div v-else class="max-w-4xl tab-content" v-html="tabContent"></div>
            </div>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else class="text-center py-20">
          <div class="text-gray-500 text-lg">大赛信息加载失败</div>
          <el-button @click="goBack" type="primary" class="mt-4"> 返回列表 </el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 添加line-clamp支持 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 确保primary颜色定义 - 使用PC端的颜色 */
:deep(.text-primary) {
  color: #1e40af;
}

:deep(.bg-primary) {
  background-color: #1e40af;
}

:deep(.border-primary) {
  border-color: #1e40af;
}

:deep(.hover\:bg-blue-700:hover) {
  background-color: #1d4ed8;
}

:deep(.hover\:bg-blue-50:hover) {
  background-color: #eff6ff;
}

/* 收藏按钮样式 */
.favorite-btn {
  border-color: #1e40af;
  color: #1e40af;
}
.favorite-btn:hover {
  background-color: #eff6ff;
}
.favorite-btn.favorited {
  background-color: #eff6ff; /* 浅蓝色背景 */
  color: #1e40af; /* 主题蓝色文字 */
  border-color: #1e40af; /* 主题蓝色边框 */
}

/* 标签页样式 - 移除背景颜色 */
.tab-active {
  color: #1e40af;
  border-bottom: 2px solid #1e40af;
}

/* 确保标签页按钮没有背景颜色 */
button[class*="px-6 py-4"] {
  background-color: transparent !important;
  background: none !important;
}

button[class*="px-6 py-4"]:hover {
  background-color: transparent !important;
  background: none !important;
}

button[class*="px-6 py-4"]:focus {
  background-color: transparent !important;
  background: none !important;
  outline: none;
}

/* 已报名按钮样式 */
.registered-btn {
  background-color: #f3f4f6 !important;
  color: #6b7280 !important;
  border-color: #d1d5db !important;
}

.registered-btn:hover {
  background-color: #e5e7eb !important;
  color: #4b5563 !important;
}

.registered-btn:disabled {
  background-color: #f3f4f6 !important;
  color: #6b7280 !important;
  border-color: #d1d5db !important;
  opacity: 0.8;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .p-8 {
    padding: 1rem;
  }

  .text-4xl {
    font-size: 1.75rem;
  }

  .text-3xl {
    font-size: 1.5rem;
  }

  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* 移动端按钮布局调整 */
  .flex.flex-wrap.gap-3 {
    gap: 0.5rem;
  }

  /* 移动端统计信息调整 */
  .grid.grid-cols-2.md\:grid-cols-4 {
    gap: 1rem;
  }
}

/* 确保图片加载失败时的样式 */
img[style*="display: none"] + span,
img[style*="display:none"] + span {
  display: block;
}

/* PC端样式按钮 */
.pc-style-btn {
  border-radius: 9999px !important; /* 完全圆角 */
  padding: 8px 24px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  border-width: 2px !important;
}

/* 立即报名按钮 */
.register-btn {
  background-color: #f3f4f6 !important;
  border-color: #d1d5db !important;
  color: #6b7280 !important;
}

.register-btn:hover {
  background-color: #e5e7eb !important;
  border-color: #d1d5db !important;
}

/* 收藏按钮 */
.favorite-btn {
  background-color: #f3f4f6 !important;
  border-color: #d1d5db !important;
  color: #6b7280 !important;
}

.favorite-btn:hover {
  background-color: #e5e7eb !important;
}

/* 分享按钮 */
.share-btn {
  background-color: #f3f4f6 !important;
  border-color: #d1d5db !important;
  color: #6b7280 !important;
}

.share-btn:hover {
  background-color: #e5e7eb !important;
}

/* 右上角推荐按钮样式 */
.bg-opacity-90 {
  background-color: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 确保推荐按钮在深色背景上可见 */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* 富文本内容基础样式 - 使用深度选择器 */
:deep(.tab-content) {
  line-height: 1.6 !important;
  color: #374151 !important;
}

:deep(.tab-content h1),
:deep(.tab-content h2),
:deep(.tab-content h3),
:deep(.tab-content h4),
:deep(.tab-content h5),
:deep(.tab-content h6) {
  margin: 1.5rem 0 1rem 0 !important;
  font-weight: 600 !important;
  color: #1f2937 !important;
}

:deep(.tab-content h1) { font-size: 1.875rem !important; }
:deep(.tab-content h2) { font-size: 1.5rem !important; }
:deep(.tab-content h3) { font-size: 1.25rem !important; }
:deep(.tab-content h4) { font-size: 1.125rem !important; }

:deep(.tab-content p) {
  margin: 1rem 0 !important;
  line-height: 1.7 !important;
}

:deep(.tab-content ul),
:deep(.tab-content ol) {
  margin: 1rem 0 !important;
  padding-left: 1.5rem !important;
}

:deep(.tab-content li) {
  margin: 0.5rem 0 !important;
  line-height: 1.6 !important;
}

:deep(.tab-content blockquote) {
  margin: 1.5rem 0 !important;
  padding: 1rem 1.5rem !important;
  border-left: 4px solid #3b82f6 !important;
  background-color: #f8fafc !important;
  font-style: italic !important;
  color: #64748b !important;
}

:deep(.tab-content table) {
  width: 100% !important;
  border-collapse: collapse !important;
  margin: 1.5rem 0 !important;
}

:deep(.tab-content th),
:deep(.tab-content td) {
  padding: 0.75rem !important;
  border: 1px solid #e5e7eb !important;
  text-align: left !important;
}

:deep(.tab-content th) {
  background-color: #f9fafb !important;
  font-weight: 600 !important;
  color: #374151 !important;
}

:deep(.tab-content img) {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 0.5rem !important;
  margin: 1rem 0 !important;
}

:deep(.tab-content a) {
  color: #3b82f6 !important;
  text-decoration: none !important;
}

:deep(.tab-content a:hover) {
  text-decoration: underline !important;
}

:deep(.tab-content code) {
  background-color: #f3f4f6 !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.375rem !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
  font-size: 0.875rem !important;
  color: #dc2626 !important;
}

:deep(.tab-content pre) {
  background-color: #f3f4f6 !important;
  padding: 1rem !important;
  border-radius: 0.5rem !important;
  overflow-x: auto !important;
  margin: 1.5rem 0 !important;
}

:deep(.tab-content pre code) {
  background-color: transparent !important;
  padding: 0 !important;
  color: inherit !important;
}

/* 赛事资料展示样式 */
.materials-section {
  margin-top: 2rem;
}

.materials-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.material-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.material-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.material-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.material-info {
  flex: 1;
  min-width: 0;
}

.material-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.material-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.meta-item {
  font-size: 0.75rem;
  color: #6b7280;
}

.badge {
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
}

.badge.required {
  background-color: #fef3c7;
  color: #92400e;
}

.material-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin-top: 0.5rem;
}

.material-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.download-count {
  font-size: 0.75rem;
  color: #9ca3af;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .materials-grid {
    grid-template-columns: 1fr;
  }
  
  .materials-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}


</style>
