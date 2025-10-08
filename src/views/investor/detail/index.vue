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
      <!-- 头部信息卡片 -->
      <el-card class="mb-6" shadow="never">
        <div class="investor-header">
          <!-- 左侧：头像和基本信息 -->
          <div class="flex items-start space-x-6">
            <!-- 头像 -->
            <div class="flex-shrink-0">
              <el-avatar
                :src="getFullImageUrl(investorDetail.avatar)"
                :size="100"
                class="border-4 border-gray-200"
              >
                {{ getAvatarText(investorDetail.name) }}
              </el-avatar>
            </div>

            <!-- 基本信息 -->
            <div class="flex-1 min-w-0">
              <!-- 姓名和状态 -->
              <div class="flex items-center mb-3">
                <h2 class="text-2xl font-bold text-gray-800 mr-4">
                  {{ investorDetail.name }}
                </h2>
                <el-tag
                  :type="getStatusInfo(investorDetail.status).type"
                  size="large"
                  class="mr-2"
                >
                  {{ getStatusInfo(investorDetail.status).label }}
                </el-tag>
                <el-tag
                  v-if="investorDetail.status === 1"
                  type="success"
                  size="large"
                  effect="plain"
                >
                  已认证
                </el-tag>
              </div>

              <!-- 职位和机构 -->
              <div class="text-base text-gray-600 mb-2">
                <span class="font-medium">{{ investorDetail.position || '未设置职位' }}</span>
                <span v-if="investorDetail.investmentInstitution" class="mx-2">·</span>
                <span class="font-medium">{{ investorDetail.investmentInstitution || '未设置机构' }}</span>
              </div>

              <!-- 地区 -->
              <div v-if="investorDetail.location" class="flex items-center text-sm text-gray-500 mb-4">
                <span>{{ investorDetail.location }}</span>
              </div>
            </div>
          </div>

          <!-- 右侧：统计卡片 -->
          <div class="grid grid-cols-5 gap-4 mt-6">
            <div class="stat-card bg-blue-50">
              <div class="stat-value text-blue-600">{{ investorDetail.investmentCount || 0 }}</div>
              <div class="stat-label text-blue-700">投资项目数</div>
            </div>
            <div class="stat-card bg-green-50">
              <div class="stat-value text-green-600">{{ investorDetail.successfulExits || 0 }}</div>
              <div class="stat-label text-green-700">成功退出</div>
            </div>
            <div class="stat-card bg-purple-50">
              <div class="stat-value text-purple-600">{{ investorDetail.activeMonths || 0 }}</div>
              <div class="stat-label text-purple-700">活跃月数</div>
            </div>
            <div class="stat-card bg-orange-50">
              <div class="stat-value text-orange-600">{{ investorDetail.responseRate || 0 }}%</div>
              <div class="stat-label text-orange-700">反馈率</div>
            </div>
            <div class="stat-card bg-teal-50">
              <div class="stat-value text-teal-600 text-base">{{ investorDetail.avgResponseTime || '暂无' }}</div>
              <div class="stat-label text-teal-700">平均反馈时间</div>
            </div>
          </div>
        </div>
      </el-card>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：详细信息 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 投资理念与简介 -->
          <el-card v-if="investorDetail.description" shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">投资理念与简介</h3>
            </template>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                {{ investorDetail.description }}
              </p>
            </div>
          </el-card>

          <!-- 投资偏好 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">投资偏好</h3>
            </template>
            
            <!-- 关注领域 - 标签形式 -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <label class="block text-sm font-medium text-gray-500 mb-3">关注领域</label>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="industry in investorDetail.focusIndustries"
                  :key="industry.id"
                  class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                >
                  {{ industry.name }}
                </span>
                <span
                  v-if="!investorDetail.focusIndustries?.length"
                  class="text-gray-400 text-sm"
                >
                  暂无数据
                </span>
              </div>
            </div>

            <!-- 主投阶段和单笔投资金额 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-500 mb-2">主投阶段</label>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="stage in investorDetail.preferredStages"
                    :key="stage.id"
                    class="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200"
                  >
                    {{ stage.name }}
                  </span>
                  <span
                    v-if="!investorDetail.preferredStages?.length"
                    class="text-gray-400 text-sm"
                  >
                    暂无数据
                  </span>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-500 mb-2">单笔投资金额</label>
                <div class="text-gray-800 font-semibold text-lg">
                  <span v-if="investorDetail.investmentRangeText || investorDetail.investmentRange">
                    {{ investorDetail.investmentRangeText || investorDetail.investmentRange }}
                  </span>
                  <span v-else class="text-gray-400">暂无数据</span>
                </div>
              </div>
            </div>

            <!-- 投资风格 -->
            <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                投资风格
              </label>
              <div class="text-gray-700 leading-relaxed text-sm">
                {{ investorDetail.investmentPreference || '暂无描述' }}
              </div>
            </div>
          </el-card>

          <!-- 投资案例 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">投资案例</h3>
            </template>
            
            <!-- 使用 v-html 渲染富文本内容 -->
            <div v-if="investorDetail.investmentCases" class="prose max-w-none" v-html="investorDetail.investmentCases"></div>
            
            <div v-else class="text-gray-500 text-sm text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              暂无投资案例信息
            </div>
          </el-card>

          <!-- 认证资料 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">认证资料</h3>
            </template>

            <div v-if="hasCertificationFiles" class="space-y-3">
              <div
                v-for="fileItem in certificationFileItems"
                :key="fileItem.label"
                class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
              >
                <div>
                  <div class="text-sm font-medium text-gray-800">{{ fileItem.label }}</div>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ fileItem.file.originalName || fileItem.file.fileName }}
                  </div>
                </div>
                <a
                  :href="getFullImageUrl(fileItem.file.filePath)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center text-primary text-sm hover:text-primary/80"
                >
                  查看
                  <el-icon class="ml-1"><component :is="useRenderIcon('ep:link')" /></el-icon>
                </a>
              </div>
            </div>

            <div v-else class="text-gray-500 text-sm text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              暂无认证材料
            </div>
          </el-card>
        </div>

        <!-- 右侧：操作和统计 -->
        <div class="space-y-6">
          <!-- 联系方式 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <el-icon class="mr-2">
                  <component :is="useRenderIcon('ep:phone')" />
                </el-icon>
                联系方式
              </h3>
            </template>

            <div v-if="hasContactInfo" class="space-y-3">
              <div v-if="investorDetail.user?.phone" class="flex items-center p-3 bg-gray-50 rounded-lg">
                <el-icon class="text-primary mr-3" :size="20">
                  <component :is="useRenderIcon('ep:phone')" />
                </el-icon>
                <div>
                  <div class="text-xs text-gray-500 font-medium">电话</div>
                  <div class="text-gray-800 font-medium">{{ investorDetail.user.phone }}</div>
                </div>
              </div>

              <div v-if="investorDetail.user?.email" class="flex items-center p-3 bg-gray-50 rounded-lg">
                <el-icon class="text-primary mr-3" :size="20">
                  <component :is="useRenderIcon('ep:message')" />
                </el-icon>
                <div>
                  <div class="text-xs text-gray-500 font-medium">邮箱</div>
                  <div class="text-gray-800 font-medium">{{ investorDetail.user.email }}</div>
                </div>
              </div>

              <div v-if="investorDetail.wechat" class="flex items-center p-3 bg-gray-50 rounded-lg">
                <el-icon class="text-primary mr-3" :size="20">
                  <component :is="useRenderIcon('ep:chat-dot-round')" />
                </el-icon>
                <div>
                  <div class="text-xs text-gray-500 font-medium">微信</div>
                  <div class="text-gray-800 font-medium">{{ investorDetail.wechat }}</div>
                </div>
              </div>

              <div v-if="investorDetail.website" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <el-icon class="text-primary mr-3" :size="20">
                  <component :is="useRenderIcon('ep:link')" />
                </el-icon>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-gray-500 font-medium">网站</div>
                  <a
                    :href="investorDetail.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-800 font-medium hover:text-primary transition-colors truncate block"
                  >
                    {{ investorDetail.website }}
                  </a>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-6">
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <el-icon class="text-gray-400" :size="24">
                  <component :is="useRenderIcon('ep:message')" />
                </el-icon>
              </div>
              <p class="text-gray-500 text-sm">暂未设置联系方式</p>
            </div>
          </el-card>

          <!-- 审核操作卡 -->
          <el-card shadow="never" class="audit-card">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">审核操作</h3>
            </template>
            <div class="space-y-4">
              <!-- 审核信息（如果存在） -->
              <div v-if="investorDetail.reviewTime || investorDetail.reviewComment" class="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">历史审核信息</h4>
                <div class="space-y-2">
                  <div v-if="investorDetail.reviewTime" class="flex items-start">
                    <label class="text-xs text-gray-500 font-medium w-20 flex-shrink-0">审核时间:</label>
                    <div class="text-sm text-gray-700">{{ formatDateTime(investorDetail.reviewTime) }}</div>
                  </div>
                  <div v-if="investorDetail.reviewer" class="flex items-start">
                    <label class="text-xs text-gray-500 font-medium w-20 flex-shrink-0">审核人:</label>
                    <div class="text-sm text-gray-700">
                      {{ investorDetail.reviewer.nickname || investorDetail.reviewer.username }}
                    </div>
                  </div>
                  <div v-if="investorDetail.reviewComment" class="flex items-start">
                    <label class="text-xs text-gray-500 font-medium w-20 flex-shrink-0">审核备注:</label>
                    <div class="text-sm text-gray-700 whitespace-pre-line flex-1">
                      {{ investorDetail.reviewComment }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 审核按钮 -->
              <div class="flex gap-3">
                <el-button
                  type="success"
                  :disabled="investorDetail.status === 1 || investorDetail.status === 0"
                  @click="openReviewDialog(1)"
                  class="flex-1"
                >
                  <el-icon class="mr-1">
                    <component :is="useRenderIcon('ep:select')" />
                  </el-icon>
                  通过
                </el-button>
                <el-button
                  type="danger"
                  :disabled="investorDetail.status === 3 || investorDetail.status === 0"
                  @click="openReviewDialog(3)"
                  class="flex-1"
                >
                  <el-icon class="mr-1">
                    <component :is="useRenderIcon('ep:close')" />
                  </el-icon>
                  拒绝
                </el-button>
              </div>

              <!-- 提示信息 -->
              <el-alert
                v-if="investorDetail.status === 0"
                type="warning"
                :closable="false"
                show-icon
              >
                该投资人已被禁用，无法审核
              </el-alert>
              <el-alert
                v-else-if="investorDetail.status === 1"
                type="success"
                :closable="false"
                show-icon
              >
                该投资人已通过审核
              </el-alert>
              <el-alert
                v-else-if="investorDetail.status === 3"
                type="error"
                :closable="false"
                show-icon
              >
                该投资人已被拒绝
              </el-alert>
            </div>
          </el-card>

          <!-- 系统信息 -->
          <el-card shadow="never">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">系统信息</h3>
            </template>
            <div class="space-y-3">
              <!-- 申请时间和更新时间 - 一行两个 -->
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gray-50 rounded-lg p-3">
                  <label class="block text-xs text-gray-500 font-medium mb-1">申请时间</label>
                  <div class="text-gray-800 font-medium text-sm">
                    {{ formatDate(investorDetail.createdTime) }}
                  </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <label class="block text-xs text-gray-500 font-medium mb-1">更新时间</label>
                  <div class="text-gray-800 font-medium text-sm">
                    {{ formatDateTime(investorDetail.updatedTime) }}
                  </div>
                </div>
              </div>

              <!-- 最后登录和登录IP - 一行两个 -->
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gray-50 rounded-lg p-3">
                  <label class="block text-xs text-gray-500 font-medium mb-1">最后登录</label>
                  <div class="text-gray-800 font-medium text-sm">
                    {{ formatDateTime(investorDetail.user?.lastLoginTime) }}
                  </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <label class="block text-xs text-gray-500 font-medium mb-1">登录IP</label>
                  <div class="text-gray-800 font-medium text-sm font-mono">
                    {{ investorDetail.user?.loginIp || '-' }}
                  </div>
                </div>
              </div>

              <!-- 浏览次数 - 独占一行 -->
              <div class="bg-gray-50 rounded-lg p-3">
                <label class="block text-xs text-gray-500 font-medium mb-1">浏览次数</label>
                <div class="text-gray-800 font-medium text-sm">{{ investorDetail.viewCount || 0 }} 次</div>
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
      <el-empty description="投资人信息加载失败">
        <el-button type="primary" @click="fetchInvestorDetail">重新加载</el-button>
      </el-empty>
    </div>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="reviewDialogVisible"
      :title="reviewForm.status === 1 ? '确认通过' : '确认拒绝'"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="space-y-4">
        <el-alert
          :type="reviewForm.status === 1 ? 'success' : 'error'"
          :closable="false"
          show-icon
        >
          <template #title>
            <span v-if="reviewForm.status === 1">
              确定要通过投资人"{{ investorDetail?.name }}"的认证申请吗？
            </span>
            <span v-else>
              确定要拒绝投资人"{{ investorDetail?.name }}"的认证申请吗？
            </span>
          </template>
        </el-alert>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            审核备注
            <span v-if="reviewForm.status === 3" class="text-red-500">*</span>
          </label>
          <el-input
            v-model="reviewForm.reviewComment"
            type="textarea"
            :rows="4"
            :placeholder="reviewForm.status === 3 ? '拒绝时必须填写备注（最多1000字）' : '请输入审核备注（可选，最多1000字）'"
            maxlength="1000"
            show-word-limit
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="reviewDialogVisible = false">取消</el-button>
          <el-button
            :type="reviewForm.status === 1 ? 'success' : 'danger'"
            :loading="reviewLoading"
            @click="confirmReview"
          >
            确认{{ reviewForm.status === 1 ? '通过' : '拒绝' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getInvestorDetail, reviewInvestor } from "../api";
import type { InvestorInfo, CertificationFiles, FileInfo } from "../types/types";

defineOptions({ name: "InvestorDetail" });

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const reviewLoading = ref(false);
const reviewDialogVisible = ref(false);
const investorDetail = ref<InvestorInfo | null>(null);

// 审核表单
const reviewForm = reactive({
  status: 1 as 1 | 3,
  reviewComment: ""
});

// 获取投资人详情
const fetchInvestorDetail = async () => {
  const id = Number(route.params.id);
  if (!id) {
    ElMessage.error("投资人ID无效");
    return;
  }

  loading.value = true;
  try {
    const response = await getInvestorDetail(id);
    if (response.code === 200 && response.data) {
      investorDetail.value = response.data;
      // 如果已有审核备注，填充到表单
      if (investorDetail.value.reviewComment) {
        reviewForm.reviewComment = investorDetail.value.reviewComment;
      }
    } else {
      ElMessage.error(response.message || "获取投资人详情失败");
    }
  } catch (error: any) {
    console.error("获取投资人详情失败:", error);
    ElMessage.error(error.message || "获取投资人详情失败");
  } finally {
    loading.value = false;
  }
};

// 打开审核对话框
const openReviewDialog = (status: 1 | 3) => {
  reviewForm.status = status;
  reviewForm.reviewComment = "";
  reviewDialogVisible.value = true;
};

// 确认审核
const confirmReview = async () => {
  if (!investorDetail.value) return;

  // 拒绝时必须填写备注
  if (reviewForm.status === 3 && !reviewForm.reviewComment.trim()) {
    ElMessage.warning("拒绝审核时必须填写备注");
    return;
  }

  const actionText = reviewForm.status === 1 ? "通过" : "拒绝";

  try {
    reviewLoading.value = true;

    const response = await reviewInvestor(investorDetail.value.id, {
      status: reviewForm.status,
      reviewComment: reviewForm.reviewComment.trim()
    });

    if (response.code === 200) {
      ElMessage.success(response.message || `${actionText}成功`);
      reviewDialogVisible.value = false;
      // 刷新详情
      await fetchInvestorDetail();
    } else {
      ElMessage.error(response.message || `${actionText}失败`);
    }
  } catch (error: any) {
    console.error(`${actionText}投资人失败:`, error);
    ElMessage.error(error.message || `${actionText}失败`);
  } finally {
    reviewLoading.value = false;
  }
};

// 返回上一页
const handleBack = () => {
  router.back();
};

// 获取完整图片 URL
const getFullImageUrl = (path?: string): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  // 后端已经返回 /public/... 格式，直接拼接
  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:7001";
  return `${baseURL}${path}`;
};

// 获取头像文字
const getAvatarText = (name?: string): string => {
  if (!name) return "?";
  // 中文取最后一个字，英文取首字母
  return /[\u4e00-\u9fa5]/.test(name) ? name.slice(-1) : name.charAt(0).toUpperCase();
};

// 获取状态信息
const getStatusInfo = (status: number) => {
  const statusMap = {
    0: { label: "禁用", type: "danger" as const },
    1: { label: "正常", type: "success" as const },
    2: { label: "审核中", type: "warning" as const },
    3: { label: "已拒绝", type: "danger" as const }
  };
  return statusMap[status] || { label: "未知", type: "info" as const };
};

// 格式化日期时间
const formatDateTime = (dateTime?: string): string => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// 格式化日期
const formatDate = (dateTime?: string): string => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

// 认证文件列表
const certificationFileItems = computed(() => {
  const files = investorDetail.value?.certificationFiles;
  if (!files) return [];

  const entries: Array<{ key: keyof CertificationFiles; label: string }> = [
    { key: "idCardFile", label: "身份证（人像面）" },
    { key: "idCardBackFile", label: "身份证（国徽面）" },
    { key: "institutionCertFile", label: "机构证明文件" },
    { key: "investmentCaseFile", label: "投资案例材料" },
    { key: "assetProofFile", label: "资产证明" },
    { key: "workProofFile", label: "从业证明" },
    { key: "resumeFile", label: "履历/简历" }
  ];

  const result: Array<{ label: string; file: FileInfo }> = [];
  entries.forEach((entry) => {
    const file = files[entry.key];
    if (file) {
      result.push({ label: entry.label, file });
    }
  });

  return result;
});

const hasCertificationFiles = computed(() => certificationFileItems.value.length > 0);

// 是否有联系方式
const hasContactInfo = computed(() => {
  const investor = investorDetail.value;
  return !!(
    investor?.user?.phone ||
    investor?.user?.email ||
    investor?.wechat ||
    investor?.website
  );
});

onMounted(() => {
  fetchInvestorDetail();
});
</script>

<style lang="scss" scoped>
.investor-detail-page {
  min-height: 100vh;
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

  .investor-header {
    .stat-card {
      padding: 16px;
      border-radius: 8px;
      text-align: center;

      .stat-value {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 13px;
        font-weight: 500;
      }
    }
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

  .audit-card {
    :deep(.el-card__body) {
      padding: 20px;
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

/* 投资案例富文本样式 */
.prose {
  color: #374151;
  line-height: 1.75;

  p {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1rem;
  }

  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  strong {
    font-weight: 600;
    color: #111827;
  }

  .investment-cases {
    padding: 0;
  }

  .case-item {
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.25rem;
    margin-bottom: 1rem;
    transition: all 0.2s;

    &:hover {
      background-color: #fff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
