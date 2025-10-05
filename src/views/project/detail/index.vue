<template>
  <div class="project-detail-page">
    <!-- 页面头部 -->
    <div class="page-header mb-6">
      <el-page-header @back="handleBack">
        <template #content>
          <div class="flex items-center justify-between w-full">
          <div class="flex items-center">
            <span class="text-lg font-medium">项目详情</span>
            </div>
          </div>
        </template>
        <template #extra>
          <!-- 管理操作区 - 放在最右侧 -->
          <div v-if="!loading && projectDetail" class="flex items-center space-x-3">
            <el-button
              type="primary"
              :icon="useRenderIcon('ep:check')"
              @click="handleShowReviewDialog"
            >
              审核
            </el-button>
            <el-button
              :type="projectDetail.isRecommended ? 'warning' : 'default'"
              :icon="useRenderIcon(projectDetail.isRecommended ? 'ep:star-filled' : 'ep:star')"
              @click="handleToggleRecommend"
              :loading="recommendLoading"
            >
              {{ projectDetail.isRecommended ? '取消推荐' : '推荐项目' }}
            </el-button>
          </div>
        </template>
      </el-page-header>
    </div>

    <!-- 项目详情内容 -->
    <div v-if="!loading && projectDetail" class="project-detail-content">
      <!-- 项目基本信息卡片 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-start">
          <!-- 项目Logo -->
          <div class="w-28 h-28 mr-6 flex-shrink-0">
            <el-image
              v-if="projectDetail.logo"
              :src="getFullImageUrl(projectDetail.logo)"
              :alt="projectDetail.title || projectDetail.name"
              fit="cover"
              class="w-full h-full rounded-lg"
              preview-teleported
              :preview-src-list="[getFullImageUrl(projectDetail.logo)]"
            />
            <div v-else class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-gray-400 text-sm">暂无LOGO</span>
            </div>
          </div>

          <!-- 项目基本信息 -->
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ projectDetail.title || projectDetail.name }}</h1>
                <p class="text-gray-500 mb-3">
                  企业名称：<span class="font-medium">{{ projectDetail.companyName }}</span>
                </p>
                <div class="flex flex-wrap gap-2 mb-3">
                  <el-tag type="primary">
                    {{ projectDetail.industry?.name || '未分类' }}
                  </el-tag>
                  <el-tag type="info">
                    {{ projectDetail.fundingStage?.name || '未知' }}
                  </el-tag>
                  <el-tag type="info">
                    {{ projectDetail.location }}
                  </el-tag>
                  <el-tag type="info">
                    {{ formatFoundingDate(projectDetail.foundingDate) }}
                  </el-tag>
                  <el-tag 
                    v-if="projectDetail.isRecommended"
                    type="warning"
                  >
                    推荐项目
                  </el-tag>
                </div>

                <!-- 项目标签 -->
                <div
                  v-if="projectTags.length > 0"
                  class="flex flex-wrap gap-2 mb-3"
                >
                  <span
                    v-for="tag in projectTags"
                    :key="tag.id"
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :style="{
                      backgroundColor: tag.style.background,
                      color: tag.style.text,
                      border: `1px solid ${tag.style.border}`
                    }"
                  >
                    {{ tag.name }}
                  </span>
                </div>
              </div>

              <!-- 右侧状态卡片 -->
              <div class="flex gap-3 ml-6">
                <!-- 审核状态卡片 -->
                <div class="bg-gray-50 rounded-lg p-4 text-center border border-gray-200" style="min-width: 120px;">
                  <p class="text-gray-500 text-xs mb-2">审核状态</p>
                  <el-tag 
                    :type="getStatusInfo(projectDetail.status).type"
                    size="default"
                    class="font-medium"
                  >
                    {{ getStatusInfo(projectDetail.status).text }}
                  </el-tag>
                </div>

                <!-- 浏览量卡片 -->
                <div class="bg-gray-50 rounded-lg p-4 text-center border border-gray-200" style="min-width: 120px;">
                  <p class="text-gray-500 text-xs mb-2">浏览量</p>
                  <p class="text-2xl font-bold text-gray-800">{{ projectDetail.viewCount || 0 }}</p>
              </div>
                </div>
              </div>

            <!-- 融资信息 -->
            <div class="border-t border-gray-100 pt-4 mt-4">
              <div class="grid grid-cols-4 gap-4">
                <div>
                  <p class="text-gray-500 text-sm">融资阶段</p>
                  <p class="font-medium">{{ projectDetail.fundingStage?.name || '未知' }}</p>
              </div>
                <div>
                  <p class="text-gray-500 text-sm">融资金额（万）</p>
                  <p class="font-medium">
                    {{ formatAmount(projectDetail.fundingAmount) || '暂无数据' }}
                  </p>
              </div>
                <div>
                  <p class="text-gray-500 text-sm">本轮估值（万）</p>
                  <p class="font-medium">
                    {{ formatAmount(projectDetail.valuation) || '暂无数据' }}
                  </p>
              </div>
                <div>
                  <p class="text-gray-500 text-sm">融资需求</p>
                  <div v-if="projectDetail.fundingNeeds">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click="showFundingNeedsDialog = true"
                    >
                      查看详情
                    </el-button>
              </div>
                  <p v-else class="font-medium text-gray-400">暂无数据</p>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex flex-wrap lg:flex-nowrap gap-8">
        <!-- 左侧：项目详情内容（标签页） -->
        <div class="w-full lg:w-2/3">
          <div class="bg-white rounded-lg shadow-md mb-6">
            <el-tabs v-model="activeTab" class="project-tabs">
              <!-- 项目介绍 -->
              <el-tab-pane label="项目介绍" name="introduction">
                <div class="space-y-6">
                  <!-- 项目简介 -->
                  <div>
                    <h2 class="text-xl font-bold mb-4">项目简介</h2>
                    <div class="content-styles" v-html="processContent(projectDetail.shortDescription || '')"></div>
                    <p v-if="!projectDetail.shortDescription" class="text-gray-400">暂无项目简介</p>
                  </div>

                  <!-- 项目详情 -->
                  <div>
                    <h2 class="text-xl font-bold mb-4">项目详情</h2>
                    <div class="content-styles" v-html="processContent(projectDetail.introduction || '')"></div>
                    <p v-if="!projectDetail.introduction" class="text-gray-400">暂无项目详情</p>
                  </div>
            </div>
              </el-tab-pane>

              <!-- 团队介绍 -->
              <el-tab-pane label="团队介绍" name="team">
                <h2 class="text-xl font-bold mb-4">团队介绍</h2>
                <div v-if="projectDetail.teamInfo" class="content-styles" v-html="processContent(projectDetail.teamInfo)"></div>
                <p v-else class="text-gray-500">暂无团队信息</p>
              </el-tab-pane>

              <!-- 融资历史 -->
              <el-tab-pane label="融资历史" name="funding">
                <h2 class="text-xl font-bold mb-4">融资历史</h2>
                <div v-if="projectDetail.fundingHistory" class="content-styles" v-html="processContent(projectDetail.fundingHistory)"></div>
                <p v-else class="text-gray-500">暂无融资历史信息</p>
              </el-tab-pane>

              <!-- 核心技术 -->
              <el-tab-pane label="核心技术" name="technology">
                <h2 class="text-xl font-bold mb-4">核心技术</h2>
                <div v-if="projectDetail.coreTechnology" class="content-styles" v-html="processContent(projectDetail.coreTechnology)"></div>
                <p v-else class="text-gray-500">暂无核心技术信息</p>
              </el-tab-pane>

          <!-- 商业模式 -->
              <el-tab-pane label="商业模式" name="business">
                <h2 class="text-xl font-bold mb-4">商业模式</h2>
                <div v-if="projectDetail.businessModel" class="content-styles" v-html="processContent(projectDetail.businessModel)"></div>
                <p v-else class="text-gray-500">暂无商业模式信息</p>
              </el-tab-pane>

              <!-- 市场分析 -->
              <el-tab-pane label="市场分析" name="market">
                <h2 class="text-xl font-bold mb-4">市场分析</h2>
                <div v-if="projectDetail.marketAnalysis" class="content-styles" v-html="processContent(projectDetail.marketAnalysis)"></div>
                <p v-else class="text-gray-500">暂无市场分析信息</p>
              </el-tab-pane>

          <!-- 竞争优势 -->
              <el-tab-pane label="竞争优势" name="advantage">
                <h2 class="text-xl font-bold mb-4">竞争优势</h2>
                <div v-if="projectDetail.competitiveAdvantage" class="content-styles" v-html="processContent(projectDetail.competitiveAdvantage)"></div>
                <p v-else class="text-gray-500">暂无竞争优势信息</p>
              </el-tab-pane>

              <!-- 发展规划 -->
              <el-tab-pane label="发展规划" name="plan">
                <h2 class="text-xl font-bold mb-4">发展规划</h2>
                <div v-if="projectDetail.developmentPlan" class="content-styles" v-html="processContent(projectDetail.developmentPlan)"></div>
                <p v-else class="text-gray-500">暂无发展规划信息</p>
              </el-tab-pane>
            </el-tabs>
            </div>
        </div>

        <!-- 右侧：联系方式和相关信息 -->
        <div class="w-full lg:w-1/3">
          <!-- 联系方式卡片 -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">联系方式</h2>
            <div class="space-y-3">
              <div class="flex items-center">
                <span class="w-20 text-gray-500">联系人:</span>
                <span class="font-medium">{{ projectDetail.contactPerson || '暂无数据' }}</span>
              </div>
              <div class="flex items-center">
                <span class="w-20 text-gray-500">职位:</span>
                <span class="font-medium">{{ projectDetail.contactPosition || '暂无数据' }}</span>
                </div>
              <div class="flex items-center">
                <span class="w-20 text-gray-500">手机:</span>
                <span class="font-medium">{{ projectDetail.contactPhone || '暂无数据' }}</span>
              </div>
              <div class="flex items-center">
                <span class="w-20 text-gray-500">邮箱:</span>
                <span class="font-medium">{{ projectDetail.contactEmail || '暂无数据' }}</span>
                </div>
              <div class="flex items-center">
                <span class="w-20 text-gray-500">地址:</span>
                <span class="font-medium">{{ projectDetail.address || projectDetail.location || '暂无数据' }}</span>
              </div>
            </div>
            <div v-if="projectDetail.website" class="mt-4 pt-4 border-t border-gray-100">
              <a
                :href="processWebsiteUrl(projectDetail.website)"
                target="_blank"
                class="text-primary hover:underline flex items-center"
              >
                <el-icon class="mr-1">
                  <component :is="useRenderIcon('ep:link')" />
                </el-icon>
                <span>访问官网</span>
              </a>
            </div>
          </div>

          <!-- 商业计划书 -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">商业计划书</h2>
            
            <!-- 有文件时显示 -->
            <div
              v-if="projectDetail.businessPlanFile || projectDetail.businessPlanUrl"
              class="bg-gray-50 border border-gray-200 rounded-lg p-4"
              style="display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px;"
            >
              <el-icon class="text-4xl text-red-500">
                <component :is="useRenderIcon('ep:document')" />
              </el-icon>
              <div class="flex flex-col min-w-0" style="min-width: 0; white-space: nowrap;">
                <p
                  class="font-medium text-gray-800 truncate"
                  :title="projectDetail.businessPlanFile?.originalName || '商业计划书'"
                >
                  {{ projectDetail.businessPlanFile?.originalName || '商业计划书' }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  更新于：{{ formatDate(projectDetail.businessPlanFile?.createdTime || projectDetail.updatedAt) }}
                </p>
              </div>
              <el-icon 
                class="text-3xl text-primary hover:text-blue-600 transition-colors cursor-pointer"
                @click="handleDownloadBusinessPlan"
                title="下载文件"
              >
                <component :is="useRenderIcon('ep:download')" />
              </el-icon>
            </div>
            
            <!-- 无文件时显示 -->
            <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <el-icon class="text-6xl text-gray-400 mb-2">
                <component :is="useRenderIcon('ep:document')" />
              </el-icon>
              <p class="font-medium text-gray-600">暂未提供商业计划书</p>
              <p class="text-sm text-gray-400 mt-1">项目方尚未上传相关文件</p>
            </div>
          </div>

          <!-- 产品介绍 -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">产品介绍</h2>
            
            <!-- 有文件时显示 -->
            <div
              v-if="projectDetail.presentationFile || projectDetail.presentationUrl"
              class="bg-gray-50 border border-gray-200 rounded-lg p-4"
              style="display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px;"
            >
              <el-icon class="text-4xl text-red-500">
                  <component :is="useRenderIcon('ep:document')" />
                </el-icon>
              <div class="flex flex-col min-w-0" style="min-width: 0; white-space: nowrap;">
                <p
                  class="font-medium text-gray-800 truncate"
                  :title="projectDetail.presentationFile?.originalName || '产品介绍'"
                >
                  {{ projectDetail.presentationFile?.originalName || '产品介绍' }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  更新于：{{ formatDate(projectDetail.presentationFile?.createdTime || projectDetail.updatedAt) }}
                </p>
              </div>
              <el-icon 
                class="text-3xl text-primary hover:text-blue-600 transition-colors cursor-pointer"
                @click="handleDownloadPresentation"
                title="下载文件"
              >
                <component :is="useRenderIcon('ep:download')" />
              </el-icon>
            </div>
            
            <!-- 无文件时显示 -->
            <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <el-icon class="text-6xl text-gray-400 mb-2">
                <component :is="useRenderIcon('ep:document')" />
              </el-icon>
              <p class="font-medium text-gray-600">暂未提供产品介绍</p>
              <p class="text-sm text-gray-400 mt-1">项目方尚未上传相关文件</p>
            </div>
          </div>

          <!-- 系统信息 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold mb-4">系统信息</h2>
            
            <!-- 基础信息组 -->
            <div class="pb-4 mb-4 border-b border-gray-200">
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <span class="text-gray-500 text-sm">创建时间</span>
                  <p class="font-medium text-sm">{{ formatDateTime(projectDetail.createdAt) }}</p>
                </div>
                <div>
                  <span class="text-gray-500 text-sm">更新时间</span>
                  <p class="font-medium text-sm">{{ formatDateTime(projectDetail.updatedAt) }}</p>
                </div>
              </div>
              <div v-if="projectDetail.creator">
                <span class="text-gray-500 text-sm">创建者</span>
                <p class="font-medium text-sm">{{ projectDetail.creator.nickname || projectDetail.creator.username }}</p>
              </div>
              </div>

            <!-- 审核信息组 -->
            <div v-if="projectDetail.reviewer || projectDetail.reviewTime || projectDetail.reviewComment">
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div v-if="projectDetail.reviewer">
                  <span class="text-gray-500 text-sm">审核人</span>
                  <p class="font-medium text-sm">{{ projectDetail.reviewer.nickname || projectDetail.reviewer.username }}</p>
                </div>
                <div v-if="projectDetail.reviewTime">
                  <span class="text-gray-500 text-sm">审核时间</span>
                  <p class="font-medium text-sm">{{ formatDateTime(projectDetail.reviewTime) }}</p>
                </div>
              </div>
              <div v-if="projectDetail.reviewComment">
                <span class="text-gray-500 text-sm">审核意见</span>
                <p class="font-medium text-sm">{{ projectDetail.reviewComment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-container">
      <el-empty description="项目信息加载失败" />
    </div>

    <!-- 融资需求详情弹窗 -->
    <el-dialog
      v-model="showFundingNeedsDialog"
      title="融资需求"
      width="600px"
    >
      <div class="max-h-96 overflow-y-auto">
        <div 
          v-if="projectDetail?.fundingNeeds" 
          class="content-styles prose prose-sm max-w-none"
          v-html="processContent(projectDetail.fundingNeeds)"
        ></div>
        <p v-else class="text-gray-500">暂无融资需求信息</p>
      </div>
      <template #footer>
        <el-button @click="showFundingNeedsDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="reviewDialogVisible"
      title="审核项目"
      width="500px"
    >
      <el-form
        ref="reviewFormRef"
        :model="reviewForm"
        :rules="reviewRules"
        label-width="80px"
      >
        <el-form-item label="审核状态" prop="status">
          <el-select v-model="reviewForm.status" placeholder="请选择审核状态">
            <el-option
              v-for="item in PROJECT_STATUS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="reviewComment">
          <el-input
            v-model="reviewForm.reviewComment"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReview" :loading="reviewLoading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useDateFormat } from "@vueuse/core";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getProjectDetail, reviewProject, toggleProjectRecommendation } from "./api";
import type { AdminProjectDetail, ReviewParams } from "./types/types";
import { PROJECT_STATUS_MAP, ProjectStatus, PROJECT_STATUS_OPTIONS } from "./types/types";
import { userKey } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";
import type { Auth } from "@/types/auth";
import { getTagStyle } from "@/utils/tagColor";

defineOptions({ name: "ProjectDetail" });

const router = useRouter();
const route = useRoute();

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const loading = ref(false);
const projectDetail = ref<AdminProjectDetail | null>(null);
const activeTab = ref('introduction');
const recommendLoading = ref(false);
const reviewDialogVisible = ref(false);
const reviewLoading = ref(false);
const reviewFormRef = ref<FormInstance>();
const showFundingNeedsDialog = ref(false);
const projectTags = ref<Array<{ id: number; name: string; style: ReturnType<typeof getTagStyle> }>>([]);

// 审核表单
const reviewForm = ref<ReviewParams>({
  status: "draft",
  reviewerId: 0,
  reviewComment: ""
});

// 审核表单验证规则
const reviewRules = computed<FormRules>(() => ({
  status: [{ required: true, message: "请选择审核状态", trigger: "change" }]
}));

// 获取项目详情
const fetchProjectDetail = async () => {
  const id = Number(route.params.id);
  if (!id) {
    ElMessage.error("项目ID无效");
    return;
  }

  loading.value = true;
  try {
    const result = await getProjectDetail(id);
    if (result.code === 200) {
      projectDetail.value = result.data;
      const tags = result.data.tags || [];
      projectTags.value = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        style: getTagStyle(tag.color)
      }));
    } else {
      ElMessage.error("获取项目详情失败: " + result.message);
    }
  } catch (error) {
    console.error("获取项目详情失败:", error);
    ElMessage.error("获取项目详情失败");
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const handleBack = () => {
  router.back();
};

// 获取状态信息
const getStatusInfo = (status: ProjectStatus) => {
  const statusInfo = PROJECT_STATUS_MAP[status];
  if (statusInfo) {
    return {
      text: statusInfo.text,
      type: statusInfo.type
    };
  }
  return { text: "未知", type: "info" as const };
};

// 格式化金额
const formatAmount = (amount: number | string | undefined) => {
  if (!amount) return "";
  
  // 如果是字符串，直接返回
  if (typeof amount === 'string') {
    return amount.replace(/人民币$/, '');
  }
  
  // 如果是数字，进行格式化
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}亿`;
  } else if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}万`;
  }
  return amount.toString();
};

// 格式化时间 - 使用 VueUse 统一转换为中国本地时间
const formatDateTime = (dateTime?: string | null) => {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return dateTime;
  return useDateFormat(date, "YYYY-MM-DD HH:mm:ss").value;
};

// 格式化成立日期
const formatFoundingDate = (dateString?: string | null) => {
  if (!dateString) return "未知";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "未知";
  return `${useDateFormat(date, "YYYY").value}年成立`;
};

// 处理官网链接
const processWebsiteUrl = (website: string) => {
  if (!website) return '';
  if (website.startsWith('http://') || website.startsWith('https://')) {
    return website;
  }
  return `https://${website}`;
};

const buildApiUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) {
    return normalizedPath;
  }
  return `${API_BASE_URL}${normalizedPath}`;
};

const normalizeFileUrl = (url?: string | null) => {
  if (!url) return '';
  return buildApiUrl(url);
};

const formatDate = (value?: string | null) => {
  if (!value) return "未知";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return useDateFormat(date, "YYYY-MM-DD").value;
};

// 获取完整图片URL
const getFullImageUrl = (path: string | null) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizedPath = `/public${path.startsWith('/') ? '' : '/'}${path}`;
  return buildApiUrl(normalizedPath);
};

// 处理内容（简单的换行处理）
const processContent = (content: string) => {
  if (!content) return '';
  return content.replace(/\n/g, '<br>');
};

// 下载商业计划书
const handleDownloadBusinessPlan = () => {
  const file = projectDetail.value?.businessPlanFile;
  
  // 如果有文件ID，使用下载接口
  if (file?.id) {
    const downloadUrl = buildApiUrl(`/api/v1/files/${file.id}/download`);
    window.open(downloadUrl, '_blank');
    return;
  }
  
  // 否则尝试使用URL
  const fileUrl = file?.url || file?.filePath || projectDetail.value?.businessPlanUrl;
  if (fileUrl) {
    window.open(normalizeFileUrl(fileUrl), '_blank');
    return;
  }
  
  ElMessage.error('文件链接无效');
};

// 下载产品介绍
const handleDownloadPresentation = () => {
  const file = projectDetail.value?.presentationFile;
  
  // 如果有文件ID，使用下载接口
  if (file?.id) {
    const downloadUrl = buildApiUrl(`/api/v1/files/${file.id}/download`);
    window.open(downloadUrl, '_blank');
    return;
  }
  
  // 否则尝试使用URL
  const fileUrl = file?.url || file?.filePath || projectDetail.value?.presentationUrl;
  if (fileUrl) {
    window.open(normalizeFileUrl(fileUrl), '_blank');
    return;
  }
  
  ElMessage.error('文件链接无效');
};

// 显示审核对话框
const handleShowReviewDialog = () => {
  if (!projectDetail.value) return;
  
  // 从 localStorage 获取当前管理员 ID
  const userInfo = storageLocal().getItem<Auth.LoginResult>(userKey);
  
  reviewForm.value = {
    status: projectDetail.value.status,
    reviewerId: userInfo?.id || 0,
    reviewComment: projectDetail.value.reviewComment || ""
  };
  reviewDialogVisible.value = true;
};

// 处理审核
const handleReview = async () => {
  if (!reviewFormRef.value || !projectDetail.value) return;
  
  await reviewFormRef.value.validate(async (valid) => {
    if (valid) {
      reviewLoading.value = true;
      try {
        const result = await reviewProject(projectDetail.value!.id, reviewForm.value);
        if (result.code === 200) {
          ElMessage.success("审核成功");
          projectDetail.value = result.data;
          reviewDialogVisible.value = false;
        } else {
          ElMessage.error("审核失败: " + result.message);
        }
      } catch (error) {
        console.error("审核失败:", error);
        ElMessage.error("审核失败");
      } finally {
        reviewLoading.value = false;
      }
    }
  });
};

// 切换推荐状态
const handleToggleRecommend = async () => {
  if (!projectDetail.value) return;
  
  recommendLoading.value = true;
  try {
    const result = await toggleProjectRecommendation(
      projectDetail.value.id,
      { isRecommended: !projectDetail.value.isRecommended }
    );
    if (result.code === 200) {
      ElMessage.success(projectDetail.value.isRecommended ? "已取消推荐" : "推荐成功");
      projectDetail.value = result.data;
  } else {
      ElMessage.error("操作失败: " + result.message);
    }
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error("操作失败");
  } finally {
    recommendLoading.value = false;
  }
};

onMounted(() => {
  fetchProjectDetail();
});
</script>

<style lang="scss" scoped>
.project-detail-page {
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.project-detail-content {
  :deep(.el-card) {
    border-radius: 8px;
    border: 1px solid #e4e7ed;
  }
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.content-styles {
  line-height: 1.8;
  color: #303133;
  
  :deep(p) {
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  /* 列表与缩进（对齐 PC 端）*/
  :deep(ul),
  :deep(ol) {
    margin-bottom: 12px;
    padding-left: 1.5rem; /* 列表缩进 */
  }

  :deep(ul) {
    list-style-type: disc; /* 实心圆点 */
  }

  :deep(ol) {
    list-style-type: decimal; /* 数字编号 */
  }

  :deep(li) {
    margin-bottom: 6px;
  }
}

.text-primary {
  color: #409eff;
}

.border-primary {
  border-color: #409eff;
}

/* el-tabs 样式优化 */
.project-tabs {
  :deep(.el-tabs__header) {
    margin: 0;
    background-color: #fff;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 24px;
  }

  :deep(.el-tabs__item) {
    font-size: 15px;
    font-weight: 500;
    height: 48px;
    line-height: 48px;
  }

  :deep(.el-tabs__content) {
    padding: 24px;
  }
}
</style>
