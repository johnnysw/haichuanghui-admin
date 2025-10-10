<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { useEventDetail } from "./composables/useEventDetail";
import { message } from "@/utils/message";
import { getFullImageUrl } from "@/utils/image";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const route = useRoute();
const router = useRouter();

const { eventDetail, loading, fetchEventDetail } = useEventDetail();
const activeTab = ref("details");

const eventId = computed(() => Number(route.params.id || 0));

onMounted(async () => {
  if (!eventId.value) {
    message("缺少有效的活动 ID", { type: "error" });
    router.back();
    return;
  }
  await fetchEventDetail(eventId.value);
});

const goBack = () => router.back();
const goRegistration = () => {
  if (!eventId.value) return;
  router.push(`/event/registration/${eventId.value}`);
};

const formatDateTime = (value?: string) => (value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-");

const posterUrl = computed(() => {
  const poster = eventDetail.value?.poster;
  return poster ? getFullImageUrl(poster) : "";
});

const statusText = computed(() => {
  const status = eventDetail.value?.status;
  const STATUS_MAP: Record<number, string> = {
    0: "草稿",
    1: "报名中",
    2: "进行中",
    3: "已结束",
    4: "已取消"
  };
  return STATUS_MAP[status ?? -1] ?? "未知";
});

const statusClass = computed(() => {
  const status = eventDetail.value?.status;
  const CLASS_MAP: Record<number, string> = {
    0: "bg-gray-100 text-gray-700",
    1: "bg-blue-100 text-blue-700",
    2: "bg-green-100 text-green-700",
    3: "bg-yellow-100 text-yellow-700",
    4: "bg-red-100 text-red-700"
  };
  return CLASS_MAP[status ?? -1] ?? "bg-gray-100 text-gray-700";
});

const priceText = computed(() => {
  const fee = eventDetail.value?.registrationFee;
  if (fee == null || Number(fee) === 0) return "免费";
  return `¥${fee}`;
});

const tabs = [
  { key: "details", label: "活动详情" },
  { key: "schedule", label: "活动日程" },
  { key: "faq", label: "常见问题" }
];

const handleTabChange = (tabName: string) => {
  activeTab.value = tabName;
};

const tags = computed(() => {
  const value = eventDetail.value?.tags;
  if (Array.isArray(value)) return value;
  const strValue = value as string;
  if (typeof strValue === "string" && strValue.trim()) {
    try {
      const parsed = JSON.parse(strValue);
      if (Array.isArray(parsed)) return parsed;
    } catch (error) {
      return strValue.split(/[\n,，]/).map(item => item.trim()).filter(Boolean);
    }
  }
  return [];
});

const highlights = computed(() => {
  const value = eventDetail.value?.highlights;
  if (Array.isArray(value)) return value;
  const strValue = value as string;
  if (typeof strValue === "string" && strValue.trim()) {
    try {
      const parsed = JSON.parse(strValue);
      if (Array.isArray(parsed)) return parsed;
    } catch (error) {
      return strValue
        .split(/\n+/)
        .map((text, index) => ({ title: `亮点 ${index + 1}`, description: text.trim() }))
        .filter(item => item.description);
    }
  }
  return [];
});
</script>

<template>
  <div class="event-detail-page">
    <!-- 页面头部 -->
    <div class="page-header mb-6">
    <el-page-header @back="goBack">
      <template #content>
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <span class="text-lg font-medium">活动详情</span>
              <el-tag v-if="eventDetail" :class="['ml-4', statusClass]" size="large">
                {{ statusText }}
              </el-tag>
            </div>
        </div>
      </template>
      <template #extra>
          <el-button
            v-if="eventDetail"
            :icon="useRenderIcon('ep:list')"
            type="primary"
            @click="goRegistration"
          >
          报名管理
        </el-button>
      </template>
    </el-page-header>
    </div>

    <!-- 主内容区域 -->
    <main class="pb-10">
      <div class="mx-auto">
        <!-- 活动基本信息 - 参照 EventHeader 布局 -->
        <div v-if="eventDetail" class="bg-white rounded-lg shadow-md overflow-hidden mb-8" v-loading="loading">
          <!-- 活动海报 -->
          <div class="relative">
            <el-image
              v-if="posterUrl"
              :src="posterUrl"
              :alt="eventDetail.title"
              fit="cover"
              class="w-full h-64 md:h-80"
            />
            <div v-else class="w-full h-64 md:h-80 bg-gray-200 flex items-center justify-center">
              <span class="text-gray-400">暂无海报</span>
            </div>
            <div class="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
              {{ eventDetail.eventType?.name || '活动' }}
            </div>
          </div>
          
          <!-- 活动基本信息 -->
          <div class="p-6 md:p-8">
            <div class="flex flex-col md:flex-row md:justify-between md:items-start">
              <div class="md:w-2/3">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{{ eventDetail.title }}</h1>
                
                <!-- 活动时间和地点 -->
                <div class="space-y-3 mb-6">
                  <div class="flex items-center text-gray-600">
                    <IconifyIconOnline icon="fa-solid:clock" width="16px" height="16px" class="text-primary mr-2" />
                    <span>{{ formatDateTime(eventDetail.startTime) }} - {{ formatDateTime(eventDetail.endTime) }}</span>
                  </div>
                  <div class="flex items-center text-gray-600">
                    <IconifyIconOnline icon="fa-solid:calendar-times" width="16px" height="16px" class="text-primary mr-2" />
                    <span>报名截止: {{ formatDateTime(eventDetail.registrationDeadline) }}</span>
                  </div>
                  <div class="flex items-center text-gray-600">
                    <IconifyIconOnline icon="fa-solid:map-marker-alt" width="16px" height="16px" class="text-primary mr-2" />
                    <span>{{ eventDetail.region?.name || '-' }} · {{ eventDetail.location || '待定' }}</span>
                  </div>
                </div>
                
                <!-- 活动标签 -->
                <div v-if="tags.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="(tag, index) in tags"
                    :key="index"
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      index === 0
                        ? 'bg-blue-100 text-primary'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    ]"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              
              <!-- 右侧信息区域 -->
              <div class="md:w-1/3 md:pl-6 md:ml-4 mt-6 md:mt-0">
                <!-- 名额上限和费用 - 显示在右上角 -->
                <div class="flex justify-end items-start gap-12 mb-4">
                  <div class="text-center">
                    <div class="text-sm text-gray-500 mb-1">名额上限</div>
                    <div class="text-3xl font-bold text-green-600">{{ eventDetail.maxParticipants ?? '--' }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-sm text-gray-500 mb-1">费用</div>
                    <div class="text-3xl font-bold text-primary">{{ priceText }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 信息卡片展示 -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- 报名人数 -->
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <div class="flex items-center justify-center">
                  <div class="text-2xl font-bold text-blue-600">{{ eventDetail.registrationCount ?? 0 }}</div>
                  <el-tag v-if="eventDetail.isFull" type="warning" size="small" class="ml-2">已满</el-tag>
                </div>
                <div class="text-sm text-gray-600 mt-1">报名人数</div>
              </div>
              
              <!-- 浏览量 -->
              <div class="bg-purple-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-purple-600">{{ eventDetail.viewCount ?? 0 }}</div>
                <div class="text-sm text-gray-600 mt-1">浏览量</div>
              </div>
              
              <!-- 活动状态 -->
              <div class="bg-gray-50 rounded-lg p-4 text-center flex flex-col items-center justify-center">
                <el-tag :class="statusClass" size="default">
                  {{ statusText }}
                </el-tag>
                <div class="text-sm text-gray-600 mt-2">状态</div>
              </div>
              
              <!-- 是否推荐 -->
              <div class="bg-gray-50 rounded-lg p-4 text-center flex flex-col items-center justify-center">
                <el-tag :type="eventDetail.isRecommended ? 'success' : 'info'" size="default">
                  {{ eventDetail.isRecommended ? '是' : '否' }}
                </el-tag>
                <div class="text-sm text-gray-600 mt-2">推荐</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 活动详情内容标签页 - 参照 EventTabs 布局 -->
        <div v-if="eventDetail" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- 左侧：标签页内容 -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-md p-6 md:p-8">
              <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <!-- 活动详情 -->
                <el-tab-pane label="活动详情" name="details">
                  <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">活动详情</h2>
                    <div v-if="eventDetail.description" class="prose max-w-none" v-html="eventDetail.description"></div>
                    <p v-else class="text-gray-500">暂无活动详情</p>
                  </div>

                  <div v-if="highlights.length" class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">活动亮点</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        v-for="(highlight, index) in highlights"
                        :key="index"
                        class="border border-gray-200 rounded-lg p-6"
                      >
                        <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ highlight.title }}</h4>
                        <p class="text-gray-600">{{ highlight.description }}</p>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                
                <!-- 活动日程 -->
                <el-tab-pane label="活动日程" name="schedule">
                  <h2 class="text-2xl font-bold text-gray-800 mb-6">活动日程</h2>
                  <div v-if="eventDetail.schedule" class="prose max-w-none" v-html="eventDetail.schedule"></div>
                  <p v-else class="text-gray-500">暂无活动日程</p>
                </el-tab-pane>
                
                <!-- 常见问题 -->
                <el-tab-pane label="常见问题" name="faq">
                  <h2 class="text-2xl font-bold text-gray-800 mb-6">常见问题</h2>
                  <div v-if="eventDetail.faq" class="prose max-w-none" v-html="eventDetail.faq"></div>
                  <p v-else class="text-gray-500">暂无常见问题</p>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>

          <!-- 右侧：信息卡片 -->
          <div class="space-y-6">
            <!-- 主办单位信息 -->
            <el-card shadow="never">
              <template #header>
                <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                  <el-icon class="mr-2">
                    <component :is="useRenderIcon('ep:office-building')" />
                  </el-icon>
                  主办单位
                </h3>
      </template>

              <div class="space-y-3">
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                  <el-icon class="text-primary mr-3" :size="20">
                    <component :is="useRenderIcon('ep:office-building')" />
                  </el-icon>
                  <div>
                    <div class="text-xs text-gray-500 font-medium">主办方</div>
                    <div class="text-gray-800 font-medium">
                      {{ eventDetail.organizer || '-' }}
                    </div>
                  </div>
                </div>

                <div v-if="eventDetail.coOrganizers" class="flex items-center p-3 bg-gray-50 rounded-lg">
                  <el-icon class="text-primary mr-3" :size="20">
                    <component :is="useRenderIcon('ep:connection')" />
                  </el-icon>
                  <div>
                    <div class="text-xs text-gray-500 font-medium">协办方</div>
                    <div class="text-gray-800 font-medium">
                      {{ eventDetail.coOrganizers }}
                    </div>
                  </div>
                </div>

                <div v-if="!eventDetail.coOrganizers" class="text-center py-4">
                  <p class="text-gray-400 text-sm">暂无协办方信息</p>
                </div>
              </div>
    </el-card>

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

              <div v-if="eventDetail.contactInfo || eventDetail.onlineUrl" class="space-y-3">
                <div v-if="eventDetail.contactInfo" class="flex items-center p-3 bg-gray-50 rounded-lg">
                  <el-icon class="text-primary mr-3" :size="20">
                    <component :is="useRenderIcon('ep:phone')" />
                  </el-icon>
                  <div>
                    <div class="text-xs text-gray-500 font-medium">联系方式</div>
                    <div class="text-gray-800 font-medium">
                      {{ eventDetail.contactInfo }}
                    </div>
                  </div>
                </div>

                <div v-if="eventDetail.onlineUrl" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <el-icon class="text-primary mr-3" :size="20">
                    <component :is="useRenderIcon('ep:link')" />
                  </el-icon>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-gray-500 font-medium">线上链接</div>
                    <a
                      :href="eventDetail.onlineUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-gray-800 font-medium hover:text-primary transition-colors truncate block"
                    >
                      {{ eventDetail.onlineUrl }}
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

            <!-- 系统信息 -->
            <el-card shadow="never">
              <template #header>
                <h3 class="text-lg font-semibold text-gray-800">系统信息</h3>
              </template>
              <div class="space-y-3">
                <!-- 创建时间和更新时间 - 一行两个 -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <label class="block text-xs text-gray-500 font-medium mb-1">创建时间</label>
                    <div class="text-gray-800 font-medium text-sm">
                      {{ formatDateTime(eventDetail.createdTime) }}
                    </div>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <label class="block text-xs text-gray-500 font-medium mb-1">更新时间</label>
                    <div class="text-gray-800 font-medium text-sm">
                      {{ formatDateTime(eventDetail.updatedTime) }}
                    </div>
                  </div>
                </div>
              </div>
    </el-card>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.event-detail-page {
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-card {
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    line-height: 1;
  }

  .stat-label {
    font-size: 14px;
    font-weight: 500;
  }
}

.info-chip-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: 12px;
  border: 1px solid #dcdfe6;
  background: #f9fafb;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.price-chip-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  background: linear-gradient(135deg, #f9fafb 0%, #f0f4ff 100%);
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(31, 106, 255, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(31, 106, 255, 0.15);
  }
}

.prose {
  max-width: none;
  line-height: 1.75;
  color: #374151;
}

.prose :deep(p) {
  margin-bottom: 1rem;
}

.prose :deep(p:last-child) {
  margin-bottom: 0;
}

.prose :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #1f2937;
}

.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
}

.prose :deep(blockquote) {
  border-left: 4px solid var(--el-color-primary);
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6b7280;
  font-style: italic;
}

.prose :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.prose :deep(pre) {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}
</style>
