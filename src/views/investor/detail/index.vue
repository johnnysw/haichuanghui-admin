<template>
  <div class="investor-detail-page">
    <!-- 页面头部 -->
    <div class="page-header mb-6">
      <el-page-header @back="handleBack">
        <template #content>
          <div class="flex items-center">
            <el-icon class="mr-2">
              <component :is="useRenderIcon('ep:user')" />
            </el-icon>
            <span class="text-lg font-medium">投资人详情</span>
    </div>
        </template>
      </el-page-header>
    </div>

    <!-- 投资人详情内容 -->
    <div v-if="!loading && investorDetail" class="investor-detail-content">
      <!-- 基本信息卡片 -->
      <el-card class="mb-6" shadow="never">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-800">{{ investorDetail.name }}</h2>
            <div class="flex items-center space-x-2">
              <el-tag 
                :type="getStatusInfo(investorDetail.status).type" 
                size="large"
              >
                {{ getStatusInfo(investorDetail.status).label }}
              </el-tag>
              <el-tag 
                v-if="investorDetail.verified"
                type="success" 
                size="large"
              >
                已认证
              </el-tag>
              <el-tag 
                v-if="investorDetail.isRecommended"
                type="warning" 
                size="large"
              >
                推荐投资人
              </el-tag>
              <el-tag 
                v-if="investorDetail.isFeatured"
                type="danger"
                size="large"
              >
                精选投资人
              </el-tag>
            </div>
            </div>
          </template>
          
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- 投资人头像 -->
          <div class="lg:col-span-1">
            <div class="flex flex-col items-center">
              <el-image
                v-if="investorDetail.avatar"
                :src="investorDetail.avatar"
                :alt="investorDetail.name"
                fit="cover"
                class="w-32 h-32 rounded-full border-4 border-gray-200"
                preview-teleported
                :preview-src-list="[investorDetail.avatar]"
              />
              <div v-else class="w-32 h-32 bg-gray-100 rounded-full border-4 border-gray-200 flex items-center justify-center">
                <span class="text-gray-400">无头像</span>
              </div>
              <h3 class="mt-4 text-lg font-semibold text-gray-800">{{ investorDetail.name }}</h3>
              <p class="text-sm text-gray-600">{{ investorDetail.position }}</p>
            </div>
                </div>

          <!-- 基本信息 -->
          <div class="lg:col-span-3">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="info-item">
                <label class="info-label">投资机构</label>
                <div class="info-value font-medium">{{ investorDetail.institution }}</div>
                </div>

                <div class="info-item">
                <label class="info-label">职位</label>
                <div class="info-value">{{ investorDetail.position }}</div>
              </div>
              
                <div class="info-item">
                <label class="info-label">地区</label>
                <div class="info-value">{{ investorDetail.location }}</div>
                </div>

                <div class="info-item">
                <label class="info-label">投资范围</label>
                <div class="info-value text-green-600 font-medium">{{ investorDetail.investmentRange }}</div>
              </div>
              
                <div class="info-item">
                <label class="info-label">投资项目</label>
                <div class="info-value">{{ investorDetail.investmentCount }}个</div>
              </div>

                <div class="info-item">
                <label class="info-label">成功退出</label>
                <div class="info-value text-blue-600 font-medium">{{ investorDetail.successfulExits }}个</div>
              </div>

                <div class="info-item">
                <label class="info-label">联系电话</label>
                <div class="info-value">
                  <a :href="`tel:${investorDetail.phone}`" class="text-blue-600 hover:text-blue-800">
                    {{ investorDetail.phone }}
                  </a>
                </div>
              </div>

                <div class="info-item">
                <label class="info-label">邮箱地址</label>
                <div class="info-value">
                  <a :href="`mailto:${investorDetail.email}`" class="text-blue-600 hover:text-blue-800">
                    {{ investorDetail.email }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 个人简介 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">个人简介</h3>
            </template>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                {{ investorDetail.bio }}
              </p>
            </div>
          </el-card>

          <!-- 详细描述 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">详细背景</h3>
            </template>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                {{ investorDetail.description }}
              </p>
          </div>
        </el-card>
      </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 关注行业 -->
        <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">关注行业</h3>
            </template>

            <div class="space-y-2">
                    <el-tag
                v-for="industry in investorDetail.focusIndustries"
                :key="industry"
                :type="getIndustryTagType(industry)"
                class="mr-2 mb-2"
              >
                {{ getIndustryLabel(industry) }}
                    </el-tag>
                  </div>
          </el-card>

          <!-- 偏好阶段 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">偏好阶段</h3>
            </template>

            <div class="space-y-2">
                    <el-tag
                v-for="stage in investorDetail.preferredStages"
                :key="stage"
                :type="getStageTagType(stage)"
                class="mr-2 mb-2"
              >
                {{ getStageLabel(stage) }}
                    </el-tag>
                  </div>
          </el-card>

          <!-- 投资统计 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">投资统计</h3>
            </template>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span class="text-blue-700 font-medium">投资项目数</span>
                <span class="text-blue-600 text-xl font-bold">{{ investorDetail.investmentCount }}</span>
                  </div>
              <div class="flex items-center justify-between p-3 bg-green-50 rounded">
                <span class="text-green-700 font-medium">成功退出数</span>
                <span class="text-green-600 text-xl font-bold">{{ investorDetail.successfulExits }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-purple-50 rounded">
                <span class="text-purple-700 font-medium">成功率</span>
                <span class="text-purple-600 text-xl font-bold">
                  {{ investorDetail.investmentCount > 0 ? Math.round((investorDetail.successfulExits / investorDetail.investmentCount) * 100) : 0 }}%
                </span>
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
                <div class="info-value text-sm">{{ formatDateTime(investorDetail.createdTime) }}</div>
                </div>

              <div class="info-item">
                <label class="info-label">更新时间</label>
                <div class="info-value text-sm">{{ formatDateTime(investorDetail.updatedTime) }}</div>
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
      <el-empty description="投资人信息加载失败" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getInvestorDetail } from "../api";
import { FOCUS_INDUSTRIES, PREFERRED_STAGES } from "../types/types";
import type { InvestorItem } from "../types/types";

defineOptions({ name: "InvestorDetail" });

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const investorDetail = ref<InvestorItem | null>(null);

// 获取投资人详情
const fetchInvestorDetail = async () => {
  const id = Number(route.params.id);
  if (!id) {
    ElMessage.error("投资人ID无效");
    return;
  }

  loading.value = true;
  try {
    const { data } = await getInvestorDetail(id);
    investorDetail.value = data;
  } catch (error) {
    console.error("获取投资人详情失败:", error);
    ElMessage.error("获取投资人详情失败");
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
  const option = FOCUS_INDUSTRIES.find(item => item.value === industry);
  return option ? option.label : industry;
};

// 获取阶段标签
const getStageLabel = (stage: string) => {
  const option = PREFERRED_STAGES.find(item => item.value === stage);
  return option ? option.label : stage;
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
    consumer: "success",
    enterprise: "primary",
    other: "info"
  };
  return typeMap[industry] || "info";
};

// 获取阶段标签类型
const getStageTagType = (stage: string) => {
  const typeMap = {
    seed: "info",
    angel: "primary",
    pre_a: "primary",
    a: "success",
    b: "success", 
    c: "warning",
    later: "warning",
    ipo: "danger"
  };
  return typeMap[stage] || "info";
};

// 格式化时间
const formatDateTime = (dateTime: string) => {
  return dateTime.replace(/:\d{2}$/, ""); // 移除秒数
};

onMounted(() => {
  fetchInvestorDetail();
});
</script>

<style lang="scss" scoped>
.investor-detail-page {
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

.investor-detail-content {
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