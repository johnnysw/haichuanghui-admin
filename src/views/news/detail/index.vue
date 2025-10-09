<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 主内容区域 -->
    <main class="pt-6 pb-10">
      <div class="container mx-auto px-4">
        <!-- 面包屑导航 -->
        <div class="mb-6 text-sm">
          <el-button
            :icon="useRenderIcon('ep:arrow-left')"
            link
            @click="goBack"
          >
            返回列表
          </el-button>
          <span class="mx-2 text-gray-400">/</span>
          <span class="text-gray-700">{{ detail?.title || "加载中..." }}</span>
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="py-20 text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          />
          <p class="mt-4 text-gray-500">正在加载资讯详情...</p>
        </div>

        <!-- 加载失败 -->
        <div v-else-if="!loading && !detail" class="py-20 text-center">
          <div class="text-red-500 mb-4">
            <el-icon size="48">
              <component :is="useRenderIcon('ep:warning')" />
            </el-icon>
          </div>
          <p class="text-xl text-gray-700 mb-2">资讯不存在</p>
          <p class="text-gray-500 mb-8">请检查资讯ID是否正确</p>
        </div>

        <template v-else-if="detail">
          <!-- 资讯基本信息 -->
          <NewsHeader
            v-if="detail"
            :news="detail"
            :is-admin="true"
            @status-change="handleStatusChange"
            @recommend-change="handleRecommendChange"
            @top-change="handleTopChange"
          />

          <!-- 资讯详情内容标签页 -->
          <NewsTabs
            v-if="detail"
            :tabs="tabs"
            :default-tab="activeTab"
            @tab-change="handleTabChange"
          >
            <template #default="{ activeTab: currentTab }">
              <!-- 资讯内容 -->
              <div v-if="currentTab === 'content'">
                <div class="mb-8">
                  <h2 class="text-2xl font-bold text-gray-800 mb-4">
                    资讯正文
                  </h2>
                  <div class="prose max-w-none">
                    <p
                      v-if="detail.summary"
                      class="text-gray-700 leading-relaxed mb-6 text-lg font-medium"
                    >
                      {{ detail.summary }}
                    </p>
                    <div
                      v-if="detail.content"
                      class="text-gray-700"
                      v-html="detail.content"
                    />
                    <div v-else class="text-gray-500 text-center py-8">
                      暂无正文内容
                    </div>
                  </div>
                </div>

                <!-- 资讯标签 -->
                <div v-if="detail.tags && detail.tags.length > 0" class="mb-8">
                  <h3 class="text-lg font-semibold mb-3">相关标签</h3>
                  <div class="flex flex-wrap gap-2">
                    <el-tag
                      v-for="tag in detail.tags"
                      :key="tag"
                      type="info"
                      effect="plain"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <!-- 基本信息 -->
              <div v-if="currentTab === 'info'">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">基本信息</h2>
                <div class="max-w-2xl">
                  <div class="bg-gray-50 rounded-lg p-6">
                    <div class="space-y-4">
                      <div class="flex items-center gap-3">
                        <el-icon class="text-gray-500">
                          <component :is="useRenderIcon('ep:user')" />
                        </el-icon>
                        <span class="text-gray-600">作者：</span>
                        <span class="font-medium">{{ detail.author }}</span>
                      </div>
                      <div v-if="detail.source" class="flex items-center gap-3">
                        <el-icon class="text-gray-500">
                          <component :is="useRenderIcon('ep:link')" />
                        </el-icon>
                        <span class="text-gray-600">来源：</span>
                        <span class="font-medium">{{ detail.source }}</span>
                      </div>
                      <div
                        v-if="detail.categoryName"
                        class="flex items-center gap-3"
                      >
                        <el-icon class="text-gray-500">
                          <component :is="useRenderIcon('ep:collection-tag')" />
                        </el-icon>
                        <span class="text-gray-600">分类：</span>
                        <el-tag type="info" effect="plain">{{
                          detail.categoryName
                        }}</el-tag>
                      </div>
                      <div class="flex items-center gap-3">
                        <el-icon class="text-gray-500">
                          <component :is="useRenderIcon('ep:calendar')" />
                        </el-icon>
                        <span class="text-gray-600">创建时间：</span>
                        <span class="font-medium">{{
                          formatDateTime(detail.createdTime)
                        }}</span>
                      </div>
                      <div
                        v-if="detail.publishTime"
                        class="flex items-center gap-3"
                      >
                        <el-icon class="text-gray-500">
                          <component :is="useRenderIcon('ep:calendar-check')" />
                        </el-icon>
                        <span class="text-gray-600">发布时间：</span>
                        <span class="font-medium">{{
                          formatDateTime(detail.publishTime)
                        }}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <el-icon class="text-gray-500">
                          <component :is="useRenderIcon('ep:refresh')" />
                        </el-icon>
                        <span class="text-gray-600">更新时间：</span>
                        <span class="font-medium">{{
                          formatDateTime(detail.updatedTime)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 统计信息 -->
              <div v-if="currentTab === 'stats'">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">统计信息</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div class="bg-white rounded-lg p-6 shadow-sm border">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-2xl font-bold text-blue-600">
                          {{ detail.viewCount }}
                        </div>
                        <div class="text-sm text-gray-500">浏览量</div>
                      </div>
                      <el-icon class="text-blue-500" size="32">
                        <component :is="useRenderIcon('ep:view')" />
                      </el-icon>
                    </div>
                  </div>

                  <div class="bg-white rounded-lg p-6 shadow-sm border">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-2xl font-bold text-green-600">
                          {{ detail.commentCount }}
                        </div>
                        <div class="text-sm text-gray-500">评论数</div>
                      </div>
                      <el-icon class="text-green-500" size="32">
                        <component :is="useRenderIcon('ep:chat-dot-round')" />
                      </el-icon>
                    </div>
                  </div>

                  <div class="bg-white rounded-lg p-6 shadow-sm border">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-2xl font-bold text-red-600">
                          {{ detail.likeCount }}
                        </div>
                        <div class="text-sm text-gray-500">点赞数</div>
                      </div>
                      <el-icon class="text-red-500" size="32">
                        <component :is="useRenderIcon('ep:thumb-up')" />
                      </el-icon>
                    </div>
                  </div>

                  <div class="bg-white rounded-lg p-6 shadow-sm border">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-2xl font-bold text-orange-600">
                          {{ detail.favoriteCount }}
                        </div>
                        <div class="text-sm text-gray-500">收藏数</div>
                      </div>
                      <el-icon class="text-orange-500" size="32">
                        <component :is="useRenderIcon('ep:star')" />
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SEO信息 -->
              <div v-if="currentTab === 'seo'">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">SEO信息</h2>
                <div class="max-w-2xl">
                  <div class="bg-gray-50 rounded-lg p-6">
                    <div class="space-y-4">
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-1"
                          >SEO标题</label
                        >
                        <div class="text-gray-900">
                          {{ detail.seoTitle || detail.title }}
                        </div>
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-1"
                          >SEO关键词</label
                        >
                        <div class="text-gray-900">
                          {{ detail.seoKeywords || "未设置" }}
                        </div>
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-1"
                          >SEO描述</label
                        >
                        <div class="text-gray-900">
                          {{
                            detail.seoDescription || detail.summary || "未设置"
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </NewsTabs>
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

import NewsHeader from "./components/NewsHeader.vue";
import NewsTabs from "./components/NewsTabs.vue";
import { getNewsDetail } from "./api/index";
import type { NewsDetail } from "./types/types";

defineOptions({ name: "NewsDetail" });

const route = useRoute();
const router = useRouter();

// 响应式数据
const detail = ref<NewsDetail | null>(null);
const loading = ref(false);
const activeTab = ref("content");

// 标签页配置
const tabs = [
  { key: "content", label: "资讯内容" },
  { key: "info", label: "基本信息" },
  { key: "stats", label: "统计信息" },
  { key: "seo", label: "SEO信息" }
];

// 获取资讯ID
const getNewsId = (): number => {
  const id = route.params.id;
  return Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
};

// 返回列表
const goBack = () => {
  router.push("/news/list");
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

// 置顶状态变更处理
const handleTopChange = (isTop: boolean) => {
  if (detail.value) {
    detail.value.isTop = isTop;
    ElMessage.success(isTop ? "设为置顶成功" : "取消置顶成功");
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

// 获取资讯详情
const fetchNewsDetail = async () => {
  const id = getNewsId();
  console.log("当前路由参数:", route.params);
  console.log("解析得到的ID:", id);

  if (!id || isNaN(id)) {
    console.error("无效的资讯ID:", id);
    ElMessage.error("资讯ID无效");
    return;
  }

  loading.value = true;
  try {
    console.log("开始获取资讯详情, ID:", id);
    const response = await getNewsDetail(id);
    console.log("获取详情成功:", response);
    detail.value = response.data;
  } catch (error: any) {
    console.error("获取资讯详情失败:", error);
    ElMessage.error(`获取详情失败: ${error.message || "数据不存在"}`);
    detail.value = null;
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchNewsDetail();
});

// 监听路由变化
const stopWatcher = router.beforeEach(to => {
  if (to.name === "NewsDetail" && to.params.id !== route.params.id) {
    fetchNewsDetail();
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
