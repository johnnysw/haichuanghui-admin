<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 主内容区域 -->
    <main class="pt-6 pb-10">
      <div class="container mx-auto px-4">
        <!-- 面包屑导航 -->
        <div class="mb-6 text-sm">
          <el-button @click="goBack" :icon="useRenderIcon('ep:arrow-left')" link>
            返回列表
          </el-button>
          <span class="mx-2 text-gray-400">/</span>
          <span class="text-gray-700">{{ detail?.title || '加载中...' }}</span>
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="py-20 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-4 text-gray-500">正在加载活动详情...</p>
        </div>

        <!-- 加载失败 -->
        <div v-else-if="!loading && !detail" class="py-20 text-center">
          <div class="text-red-500 mb-4">
            <el-icon size="48">
              <component :is="useRenderIcon('ep:warning')" />
            </el-icon>
          </div>
          <p class="text-xl text-gray-700 mb-2">活动不存在</p>
          <p class="text-gray-500 mb-8">请检查活动ID是否正确</p>
        </div>

        <template v-else-if="detail">
          <!-- 活动基本信息 -->
          <EventHeader
            v-if="detail"
            :event="detail"
            :is-admin="true"
            @status-change="handleStatusChange"
            @recommend-change="handleRecommendChange"
          />
          
          <!-- 活动详情内容标签页 -->
          <EventTabs
            v-if="detail"
            :tabs="tabs"
            :default-tab="activeTab"
            @tab-change="handleTabChange"
          >
            <template #default="{ activeTab: currentTab }">
              <!-- 活动详情 -->
              <div v-if="currentTab === 'details'">
                <div class="mb-8">
                  <h2 class="text-2xl font-bold text-gray-800 mb-4">活动简介</h2>
                  <div class="prose max-w-none">
                    <p class="text-gray-700 leading-relaxed mb-4">{{ detail.description }}</p>
                    <div v-if="detail.detailedIntro" v-html="detail.detailedIntro" class="text-gray-700"></div>
                  </div>
                </div>

                <!-- 活动信息 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div class="border border-gray-200 rounded-lg p-6">
                    <div class="text-primary text-3xl mb-4">
                      <el-icon class="w-8 h-8">
                        <component :is="useRenderIcon('ep:calendar')" />
                      </el-icon>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">活动时间</h4>
                    <p class="text-gray-600">{{ formatDateTime(detail.startTime) }}</p>
                    <p class="text-gray-600">{{ formatDateTime(detail.endTime) }}</p>
                  </div>

                  <div class="border border-gray-200 rounded-lg p-6">
                    <div class="text-primary text-3xl mb-4">
                      <el-icon class="w-8 h-8">
                        <component :is="useRenderIcon('ep:location')" />
                      </el-icon>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">活动地点</h4>
                    <p class="text-gray-600">{{ detail.location }}</p>
                    <p class="text-gray-600">{{ detail.address }}</p>
                  </div>

                  <div class="border border-gray-200 rounded-lg p-6">
                    <div class="text-primary text-3xl mb-4">
                      <el-icon class="w-8 h-8">
                        <component :is="useRenderIcon('ep:user')" />
                      </el-icon>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">参与人数</h4>
                    <p class="text-gray-600">已报名：{{ detail.participantCount }}人</p>
                    <p v-if="detail.maxParticipants" class="text-gray-600">限额：{{ detail.maxParticipants }}人</p>
                  </div>
                </div>
              </div>

              <!-- 活动议程 -->
              <div v-if="currentTab === 'agenda'">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">活动议程</h2>
                <div class="prose max-w-none">
                  <p class="text-gray-700 leading-relaxed">{{ detail.agenda || '暂无详细议程安排' }}</p>
                </div>
              </div>
              
              <!-- 嘉宾介绍 -->
              <div v-if="currentTab === 'speakers'">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">嘉宾介绍</h2>
                <div v-if="detail.speakers && detail.speakers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div
                    v-for="speaker in detail.speakers"
                    :key="speaker.id"
                    class="border border-gray-200 rounded-lg p-6 text-center"
                  >
                    <el-avatar
                      v-if="speaker.avatar"
                      :src="speaker.avatar"
                      :size="80"
                      class="mx-auto mb-4"
                    />
                    <el-avatar
                      v-else
                      :size="80"
                      class="mx-auto mb-4"
                    >
                      {{ speaker.name.charAt(0) }}
                    </el-avatar>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ speaker.name }}</h4>
                    <p class="text-sm text-gray-600 mb-1">{{ speaker.title }}</p>
                    <p class="text-sm text-blue-600 mb-3">{{ speaker.company }}</p>
                    <p v-if="speaker.bio" class="text-xs text-gray-600">{{ speaker.bio }}</p>
                    <p v-if="speaker.topic" class="text-xs text-primary mt-2">演讲主题：{{ speaker.topic }}</p>
                  </div>
                </div>
                <div v-else class="text-center text-gray-500 py-8">
                  暂无嘉宾信息
                </div>
              </div>
              
              <!-- 参与须知 -->
              <div v-if="currentTab === 'requirements'">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">参与须知</h2>
                <div class="prose max-w-none">
                  <p class="text-gray-700 leading-relaxed">{{ detail.requirements || '暂无特殊要求' }}</p>
                </div>
              </div>

              <!-- 联系信息 -->
              <div v-if="currentTab === 'contact'">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">联系信息</h2>
                <div class="max-w-2xl">
                  <div class="bg-gray-50 rounded-lg p-6">
                    <div class="space-y-4">
                      <div class="flex items-center gap-3">
                        <el-icon class="text-gray-500">
                          <component :is="useRenderIcon('ep:office-building')" />
                        </el-icon>
                        <span class="text-gray-600">主办方：</span>
                        <span class="font-medium">{{ detail.organizer }}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <el-icon class="text-gray-500">
                          <component :is="useRenderIcon('ep:user')" />
                        </el-icon>
                        <span class="text-gray-600">联系人：</span>
                        <span class="font-medium">{{ detail.contactPerson }}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <el-icon class="text-gray-500">
                          <component :is="useRenderIcon('ep:phone')" />
                        </el-icon>
                        <span class="text-gray-600">电话：</span>
                        <span class="font-medium">{{ detail.contactPhone }}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <el-icon class="text-gray-500">
                          <component :is="useRenderIcon('ep:message')" />
                        </el-icon>
                        <span class="text-gray-600">邮箱：</span>
                        <span class="font-medium">{{ detail.contactEmail }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </EventTabs>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessage } from "element-plus";

import EventHeader from "./components/EventHeader.vue";
import EventTabs from "./components/EventTabs.vue";
import { getEventDetail } from "./api/index";
import type { EventDetail } from "./types/types";

defineOptions({ name: "EventDetail" });

const route = useRoute();
const router = useRouter();

// 响应式数据
const detail = ref<EventDetail | null>(null);
const loading = ref(false);
const activeTab = ref("details");

// 标签页配置
const tabs = [
  { key: 'details', label: '活动详情' },
  { key: 'agenda', label: '活动议程' },
  { key: 'speakers', label: '嘉宾介绍' },
  { key: 'requirements', label: '参与须知' },
  { key: 'contact', label: '联系信息' }
];

// 获取活动ID
const getEventId = (): number => {
  const id = route.params.id;
  return Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
};

// 返回列表
const goBack = () => {
  router.push("/event/list");
};

// 标签页切换
const handleTabChange = (tabKey: string) => {
  activeTab.value = tabKey;
};

// 状态变更处理
const handleStatusChange = (status: number) => {
  if (detail.value) {
    detail.value.status = status;
    ElMessage.success("状态更新成功");
  }
};

// 推荐状态变更处理
const handleRecommendChange = (isRecommended: boolean) => {
  if (detail.value) {
    detail.value.isRecommended = isRecommended;
    ElMessage.success(isRecommended ? "设为推荐成功" : "取消推荐成功");
  }
};

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// 获取活动详情
const fetchEventDetail = async () => {
  const id = getEventId();
  console.log("当前路由参数:", route.params);
  console.log("解析得到的ID:", id);
  
  if (!id || isNaN(id)) {
    console.error("无效的活动ID:", id);
    ElMessage.error("活动ID无效");
    return;
  }
  
  loading.value = true;
  try {
    console.log("开始获取活动详情, ID:", id);
    const response = await getEventDetail(id);
    console.log("获取详情成功:", response);
    detail.value = response.data;
  } catch (error: any) {
    console.error("获取活动详情失败:", error);
    ElMessage.error(`获取详情失败: ${error.message || '数据不存在'}`);
    detail.value = null;
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchEventDetail();
});

// 监听路由变化
const stopWatcher = router.beforeEach((to) => {
  if (to.name === "EventDetail" && to.params.id !== route.params.id) {
    fetchEventDetail();
  }
});

// 组件卸载时清理监听器
onUnmounted(() => {
  stopWatcher();
});
</script>

<style scoped lang="scss">
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #374151;
}

.prose h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}
</style>