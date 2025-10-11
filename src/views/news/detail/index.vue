<template>
  <div>
    <!-- 页面头部 -->
    <div class="page-header mb-6">
      <el-page-header @back="goBack">
        <template #content>
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center space-x-3">
              <span class="text-lg font-medium">资讯详情</span>
              <div v-if="!loading && detail" class="flex items-center space-x-2">
                <el-tag :type="getStatusTagType(detail.status)" size="small">
                  {{ getStatusText(detail.status) }}
                </el-tag>
                <el-tag v-if="detail.isRecommended" type="warning" size="small">推荐</el-tag>
                <el-tag v-if="detail.isTop" type="danger" size="small">置顶</el-tag>
              </div>
            </div>
          </div>
        </template>
        <template #extra>
          <!-- 管理操作区 - 放在最右侧 -->
          <div v-if="!loading && detail" class="flex items-center space-x-2">
            <el-dropdown @command="handleStatusCommand">
              <el-button
                type="primary"
                size="small"
                :icon="useRenderIcon('ep:setting')"
              >
                更改状态
                <el-icon class="el-icon--right">
                  <component :is="useRenderIcon('ep:arrow-down')" />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="draft" :disabled="detail.status === 0">
                    设为草稿
                  </el-dropdown-item>
                  <el-dropdown-item command="publish" :disabled="detail.status === 1">
                    发布
                  </el-dropdown-item>
                  <el-dropdown-item command="offline" :disabled="detail.status === 2">
                    下线
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              size="small"
              :icon="useRenderIcon(detail.isRecommended ? 'ep:star-filled' : 'ep:star')"
              :style="{
                background: detail.isRecommended ? '#E6A23C' : '',
                color: detail.isRecommended ? 'white' : '',
                border: detail.isRecommended ? 'none' : ''
              }"
              @click="toggleRecommend"
            >
              {{ detail.isRecommended ? "取消推荐" : "设为推荐" }}
            </el-button>
            <el-button
              size="small"
              :icon="useRenderIcon(detail.isTop ? 'ep:top' : 'ep:bottom')"
              :style="{
                background: detail.isTop ? '#F56C6C' : '',
                color: detail.isTop ? 'white' : '',
                border: detail.isTop ? 'none' : ''
              }"
              @click="toggleTop"
            >
              {{ detail.isTop ? "取消置顶" : "设为置顶" }}
            </el-button>
          </div>
        </template>
      </el-page-header>
    </div>

    <!-- 资讯详情内容区域 -->
    <div class="pb-10">
      <!-- 加载状态 -->
      <div v-if="loading" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div class="h-64 bg-gray-200 rounded mb-6"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="text-center py-12">
          <div class="text-red-500 mb-4">
            <el-icon size="64">
              <component :is="useRenderIcon('ep:warning')" />
            </el-icon>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">加载失败</h3>
          <p class="text-gray-500 mb-4">{{ error }}</p>
          <el-button type="primary" @click="fetchNewsDetail">
            重新加载
          </el-button>
        </div>
      </div>

      <!-- 统计信息 -->
      <div v-else-if="detail" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-lg p-4">
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

          <div class="bg-gray-50 rounded-lg p-4">
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

          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-2xl font-bold text-red-600">
                  {{ detail.likeCount }}
                </div>
                <div class="text-sm text-gray-500">点赞数</div>
              </div>
              <el-icon class="text-red-500" size="32">
                <component :is="useRenderIcon('ri:thumb-up-line')" />
              </el-icon>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
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

      <!-- 资讯详情内容 -->
      <div v-if="detail" class="bg-white rounded-lg shadow-md p-6 mb-6">

        <!-- 资讯头部信息 -->
        <div class="mb-4">
          <el-tag
            class="mr-2"
            :type="getCategoryStyle(detail.categoryName).type"
            effect="plain"
          >
            {{ detail.categoryName }}
          </el-tag>
          <span class="text-sm text-gray-500">{{ formatDate(detail.publishTime || detail.createdTime) }}</span>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ detail.title }}</h1>

        <!-- 副标题 -->
        <div v-if="detail.subtitle" class="text-xl text-gray-600 mb-6">{{ detail.subtitle }}</div>

        <div class="flex items-center text-sm text-gray-500 mb-6 space-x-4">
          <span class="flex items-center">
            <el-icon class="mr-1">
              <component :is="useRenderIcon('ep:user')" />
            </el-icon>
            {{ detail.author || "未知作者" }}
          </span>
          <span v-if="detail.source" class="flex items-center">
            <el-icon class="mr-1">
              <component :is="useRenderIcon('ep:link')" />
            </el-icon>
            {{ detail.source }}
          </span>
          <span class="flex items-center">
            <el-icon class="mr-1">
              <component :is="useRenderIcon('ep:view')" />
            </el-icon>
            {{ formatNumber(detail.viewCount) }}
          </span>
          <span class="flex items-center">
            <el-icon class="mr-1">
              <component :is="useRenderIcon('ep:chat-dot-round')" />
            </el-icon>
            {{ Math.max(0, detail.commentCount || 0) }}
          </span>
        </div>

        <!-- 资讯摘要 -->
        <div v-if="detail.summary" class="text-gray-700 text-lg leading-relaxed mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
          {{ detail.summary }}
        </div>

        <!-- 资讯配图 -->
        <div v-if="coverImageUrl" class="mb-6">
          <el-image
            :src="coverImageUrl"
            :alt="detail.title"
            fit="cover"
            class="w-full h-auto rounded-lg"
            :preview-src-list="[coverImageUrl]"
            lazy
          >
            <template #error>
              <div class="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg">
                <div class="text-center text-gray-400">
                  <el-icon size="48">
                    <component :is="useRenderIcon('ep:picture')" />
                  </el-icon>
                  <p class="mt-2">图片加载失败</p>
                </div>
              </div>
            </template>
          </el-image>
        </div>

        <!-- 资讯正文内容 -->
        <div class="text-gray-700 leading-relaxed space-y-4 prose max-w-none" v-html="detail.content"></div>

        <!-- 标签 -->
        <div
          v-if="detail.tags && detail.tags.length > 0"
          class="mt-8 pt-6 border-t border-gray-100"
        >
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

      <!-- 评论区域 -->
      <div v-if="detail" class="mt-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <CommonComments
            entity-type="article"
            :entity-id="detail.id"
            :news-id="detail.id"
            @comments-loaded="onCommentsLoaded"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessage } from "element-plus";
import { getFullImageUrl } from "@/utils/image";

import {
  getNewsDetail,
  updateNewsStatus,
  toggleNewsRecommend,
  toggleNewsTop
} from "./api/index";
import type { NewsDetail } from "./types/types";
import CommonComments from "./components/CommonComments.vue";

defineOptions({ name: "NewsDetail" });

const route = useRoute();
const router = useRouter();

// 响应式数据
const detail = ref<NewsDetail | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// 获取资讯ID
const getNewsId = (): number => {
  const id = route.params.id;
  return Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
};

// 获取完整的封面图片URL
const coverImageUrl = computed(() => {
  if (!detail.value?.coverImage) return "";
  return getFullImageUrl(detail.value.coverImage);
});

// 返回列表
const goBack = () => {
  router.push("/news/list");
};

// 获取状态文本
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: "草稿",
    1: "已发布",
    2: "已下线"
  };
  return statusMap[status] || "未知";
};

// 获取状态标签类型
const getStatusTagType = (status: number) => {
  const typeMap: Record<number, any> = {
    0: "info",
    1: "success",
    2: "danger"
  };
  return typeMap[status] || "info";
};

// 获取分类样式
const getCategoryStyle = (category: string) => {
  const styles: Record<string, { type: any }> = {
    头条: { type: "danger" },
    政策解读: { type: "primary" },
    投融资: { type: "success" },
    创业故事: { type: "warning" },
    行业观察: { type: "warning" },
    科技前沿: { type: "primary" },
    行业动态: { type: "info" }
  };
  return styles[category] || { type: "info" };
};

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
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

// 状态命令处理
const handleStatusCommand = async (command: string) => {
  if (!detail.value) return;

  const statusMap: Record<string, number> = {
    draft: 0,
    publish: 1,
    offline: 2
  };

  const status = statusMap[command];
  if (status === undefined) return;

  try {
    const response = await updateNewsStatus(detail.value.id, status);
    if (response.code === 200) {
      detail.value.status = status;
      ElMessage.success("状态更新成功");
    } else {
      throw new Error(response.message || "状态更新失败");
    }
  } catch (error: any) {
    console.error("状态更新失败:", error);
    ElMessage.error(error.message || "状态更新失败");
  }
};

// 切换推荐状态
const toggleRecommend = async () => {
  if (!detail.value) return;

  try {
    const isRecommended = !detail.value.isRecommended;
    const response = await toggleNewsRecommend(detail.value.id, isRecommended);
    if (response.code === 200) {
      detail.value.isRecommended = isRecommended;
      ElMessage.success(isRecommended ? "设为推荐成功" : "取消推荐成功");
    } else {
      throw new Error(response.message || "操作失败");
    }
  } catch (error: any) {
    console.error("切换推荐状态失败:", error);
    ElMessage.error(error.message || "操作失败");
  }
};

// 切换置顶状态
const toggleTop = async () => {
  if (!detail.value) return;

  try {
    const isTop = !detail.value.isTop;
    const response = await toggleNewsTop(detail.value.id, isTop);
    if (response.code === 200) {
      detail.value.isTop = isTop;
      ElMessage.success(isTop ? "设为置顶成功" : "取消置顶成功");
    } else {
      throw new Error(response.message || "操作失败");
    }
  } catch (error: any) {
    console.error("切换置顶状态失败:", error);
    ElMessage.error(error.message || "操作失败");
  }
};

// 评论加载完成事件处理
const onCommentsLoaded = (data: { total: number }) => {
  // 更新资讯详情中的评论数
  if (detail.value) {
    detail.value.commentCount = data.total;
  }
};

// 获取资讯详情
const fetchNewsDetail = async () => {
  const id = getNewsId();

  if (!id || isNaN(id)) {
    console.error("无效的资讯ID:", id);
    error.value = "资讯ID无效";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await getNewsDetail(id);

    if (response.code === 200 && response.data) {
      detail.value = response.data;
    } else {
      throw new Error(response.message || "获取详情失败");
    }
  } catch (err: any) {
    console.error("获取资讯详情失败:", err);
    error.value = err.message || "加载失败，请稍后重试";
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
.page-header {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.prose {
  max-width: none;
}

.prose :deep(p) {
  margin-bottom: 1rem;
}

.prose :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
}

.prose :deep(h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #374151;
}

.prose :deep(h4) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.prose :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 0.5rem;
}
</style>
