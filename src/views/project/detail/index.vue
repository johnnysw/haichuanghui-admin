<template>
  <div class="project-detail-page">
    <!-- 页面头部 -->
    <div class="page-header mb-6">
      <el-page-header @back="handleBack">
        <template #content>
          <div class="flex items-center">
            <el-icon class="mr-2">
              <component :is="useRenderIcon('ep:briefcase')" />
            </el-icon>
            <span class="text-lg font-medium">项目详情</span>
          </div>
        </template>
      </el-page-header>
    </div>

    <!-- 项目详情内容 -->
    <div v-if="!loading && projectDetail" class="project-detail-content">
      <!-- 基本信息卡片 -->
      <el-card class="mb-6" shadow="never">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-800">{{ projectDetail.name }}</h2>
            <div class="flex items-center space-x-2">
              <el-tag 
                :type="getStatusInfo(projectDetail.status).type" 
                size="large"
              >
                {{ getStatusInfo(projectDetail.status).label }}
              </el-tag>
              <el-tag 
                v-if="projectDetail.isRecommended"
                type="warning" 
                size="large"
              >
                推荐项目
              </el-tag>
              <el-tag 
                v-if="projectDetail.isFeatured"
                type="danger" 
                size="large"
              >
                精选项目
              </el-tag>
            </div>
          </div>
        </template>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- 项目LOGO -->
          <div class="lg:col-span-1">
            <el-image
              v-if="projectDetail.logo"
              :src="projectDetail.logo"
              :alt="projectDetail.name"
              fit="cover"
              class="w-full h-48 rounded-lg border"
              preview-teleported
              :preview-src-list="[projectDetail.logo]"
            />
            <div v-else class="w-full h-48 bg-gray-100 rounded-lg border flex items-center justify-center">
              <span class="text-gray-400">暂无LOGO</span>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="lg:col-span-3">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="info-item">
                <label class="info-label">行业分类</label>
                <div class="info-value">
                  <el-tag :type="getIndustryTagType(projectDetail.industry)">
                    {{ getIndustryLabel(projectDetail.industry) }}
                  </el-tag>
                </div>
              </div>

              <div class="info-item">
                <label class="info-label">项目阶段</label>
                <div class="info-value">
                  <el-tag :type="getStageTagType(projectDetail.stage)">
                    {{ getStageLabel(projectDetail.stage) }}
                  </el-tag>
                </div>
              </div>

              <div class="info-item">
                <label class="info-label">融资轮次</label>
                <div class="info-value">
                  <el-tag :type="getFundingStageTagType(projectDetail.fundingStage)">
                    {{ getFundingStageLabel(projectDetail.fundingStage) }}
                  </el-tag>
                </div>
              </div>

              <div class="info-item">
                <label class="info-label">项目地区</label>
                <div class="info-value">{{ projectDetail.location }}</div>
              </div>

              <div class="info-item">
                <label class="info-label">成立日期</label>
                <div class="info-value">{{ projectDetail.establishedDate }}</div>
              </div>

              <div class="info-item">
                <label class="info-label">团队规模</label>
                <div class="info-value">{{ projectDetail.teamSize }}人</div>
              </div>

              <div class="info-item">
                <label class="info-label">注册资金</label>
                <div class="info-value">{{ formatAmount(projectDetail.registeredCapital) }}</div>
              </div>

              <div class="info-item">
                <label class="info-label">当前估值</label>
                <div class="info-value text-blue-600 font-medium">{{ formatAmount(projectDetail.currentValuation) }}</div>
              </div>

              <div class="info-item">
                <label class="info-label">融资需求</label>
                <div class="info-value text-green-600 font-medium">{{ formatAmount(projectDetail.fundingNeeds) }}</div>
              </div>

              <div class="info-item">
                <label class="info-label">浏览量</label>
                <div class="info-value">{{ projectDetail.viewCount }}</div>
              </div>

              <div class="info-item">
                <label class="info-label">收藏量</label>
                <div class="info-value">{{ projectDetail.favoriteCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 项目描述 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">项目描述</h3>
            </template>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                {{ projectDetail.description }}
              </p>
            </div>
          </el-card>

          <!-- 商业模式 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">商业模式</h3>
            </template>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                {{ projectDetail.businessModel }}
              </p>
            </div>
          </el-card>

          <!-- 目标市场 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">目标市场</h3>
            </template>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                {{ projectDetail.targetMarket }}
              </p>
            </div>
          </el-card>

          <!-- 竞争优势 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">竞争优势</h3>
            </template>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                {{ projectDetail.competitiveAdvantage }}
              </p>
            </div>
          </el-card>

          <!-- 财务状况 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">财务状况</h3>
            </template>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                {{ projectDetail.financialSituation }}
              </p>
            </div>
          </el-card>

          <!-- 风险评估 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">风险评估</h3>
            </template>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                {{ projectDetail.riskAssessment }}
              </p>
            </div>
          </el-card>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 创始人信息 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">创始人信息</h3>
            </template>

            <div class="space-y-3">
              <div class="info-item">
                <label class="info-label">创始人</label>
                <div class="info-value font-medium">{{ projectDetail.founder }}</div>
              </div>

              <div class="info-item">
                <label class="info-label">联系电话</label>
                <div class="info-value">
                  <a :href="`tel:${projectDetail.founderPhone}`" class="text-blue-600 hover:text-blue-800">
                    {{ projectDetail.founderPhone }}
                  </a>
                </div>
              </div>

              <div class="info-item">
                <label class="info-label">联系邮箱</label>
                <div class="info-value">
                  <a :href="`mailto:${projectDetail.founderEmail}`" class="text-blue-600 hover:text-blue-800">
                    {{ projectDetail.founderEmail }}
                  </a>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 项目图片 -->
          <el-card v-if="projectDetail.images.length > 0" shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">项目图片</h3>
            </template>

            <div class="grid grid-cols-1 gap-3">
              <div
                v-for="(image, index) in projectDetail.images"
                :key="index"
                class="relative"
              >
                <el-image
                  :src="image"
                  :alt="`项目图片${index + 1}`"
                  fit="cover"
                  class="w-full h-32 rounded border"
                  preview-teleported
                  :preview-src-list="projectDetail.images"
                  :initial-index="index"
                />
              </div>
            </div>
          </el-card>

          <!-- 相关文档 -->
          <el-card v-if="projectDetail.documents.length > 0" shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">相关文档</h3>
            </template>

            <div class="space-y-2">
              <div
                v-for="(doc, index) in projectDetail.documents"
                :key="index"
                class="flex items-center space-x-2 p-2 bg-gray-50 rounded"
              >
                <el-icon class="text-blue-600">
                  <component :is="useRenderIcon('ep:document')" />
                </el-icon>
                <span class="text-sm text-gray-700 flex-1">{{ doc }}</span>
                <el-button
                  type="primary"
                  size="small"
                  link
                >
                  下载
                </el-button>
              </div>
            </div>
          </el-card>

          <!-- 系统信息 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">系统信息</h3>
            </template>

            <div class="space-y-3">
              <div class="info-item">
                <label class="info-label">创建时间</label>
                <div class="info-value text-sm">{{ formatDateTime(projectDetail.createdTime) }}</div>
              </div>

              <div class="info-item">
                <label class="info-label">更新时间</label>
                <div class="info-value text-sm">{{ formatDateTime(projectDetail.updatedTime) }}</div>
              </div>
            </div>
          </el-card>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getProjectDetail } from "../api";
import { 
  INDUSTRY_OPTIONS, 
  STAGE_OPTIONS, 
  FUNDING_STAGE_OPTIONS 
} from "../types/types";
import type { ProjectItem } from "../types/types";

defineOptions({ name: "ProjectDetail" });

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const projectDetail = ref<ProjectItem | null>(null);

// 获取项目详情
const fetchProjectDetail = async () => {
  const id = Number(route.params.id);
  if (!id) {
    ElMessage.error("项目ID无效");
    return;
  }

  loading.value = true;
  try {
    const { data } = await getProjectDetail(id);
    projectDetail.value = data;
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

// 获取行业标签
const getIndustryLabel = (industry: string) => {
  const option = INDUSTRY_OPTIONS.find(item => item.value === industry);
  return option ? option.label : industry;
};

// 获取阶段标签
const getStageLabel = (stage: string) => {
  const option = STAGE_OPTIONS.find(item => item.value === stage);
  return option ? option.label : stage;
};

// 获取融资轮次标签
const getFundingStageLabel = (fundingStage: string) => {
  const option = FUNDING_STAGE_OPTIONS.find(item => item.value === fundingStage);
  return option ? option.label : fundingStage;
};

// 获取状态信息
const getStatusInfo = (status: number) => {
  const statusMap = {
    0: { label: "禁用", color: "danger", type: "danger" },
    1: { label: "正常", color: "success", type: "success" },
    2: { label: "审核中", color: "warning", type: "warning" },
    3: { label: "已拒绝", color: "danger", type: "danger" }
  };
  return statusMap[status] || { label: "未知", color: "info", type: "info" };
};

// 获取行业标签类型
const getIndustryTagType = (industry: string) => {
  const typeMap = {
    ai: "primary",
    bigdata: "success",
    cloud: "info",
    iot: "warning",
    blockchain: "danger",
    energy: "success",
    biotech: "primary",
    materials: "info",
    manufacturing: "warning",
    ecommerce: "",
    fintech: "primary",
    edtech: "success",
    media: "warning",
    social: "info",
    gaming: "danger",
    enterprise: "primary",
    consumer: "success",
    other: "info"
  };
  return typeMap[industry] || "info";
};

// 获取阶段标签类型
const getStageTagType = (stage: string) => {
  const typeMap = {
    idea: "info",
    startup: "primary",
    growth: "success",
    mature: "warning"
  };
  return typeMap[stage] || "info";
};

// 获取融资轮次标签类型
const getFundingStageTagType = (fundingStage: string) => {
  const typeMap = {
    seed: "info",
    angel: "primary",
    pre_a: "primary",
    a: "success",
    b: "success", 
    c: "warning",
    later: "warning",
    ipo: "danger",
    none: "info"
  };
  return typeMap[fundingStage] || "info";
};

// 格式化金额
const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}亿`;
  } else {
    return `${amount}万`;
  }
};

// 格式化时间
const formatDateTime = (dateTime: string) => {
  return dateTime.replace(/:\d{2}$/, ""); // 移除秒数
};

onMounted(() => {
  fetchProjectDetail();
});
</script>

<style lang="scss" scoped>
.project-detail-page {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.page-header {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.project-detail-content {
  .el-card {
    border-radius: 8px;
    border: 1px solid #e4e7ed;
  }

  .info-item {
    .info-label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #606266;
      margin-bottom: 6px;
    }

    .info-value {
      font-size: 14px;
      color: #303133;
      line-height: 1.5;
    }
  }
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.prose {
  p {
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>