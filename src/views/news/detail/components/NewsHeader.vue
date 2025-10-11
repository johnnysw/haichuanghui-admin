<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <!-- 资讯封面图 -->
    <div class="relative">
      <el-image
        v-if="news.coverImage"
        :src="news.coverImage"
        :alt="news.title"
        class="w-full h-64 md:h-80 object-cover"
        fit="cover"
      />
      <div
        v-else
        class="w-full h-64 md:h-80 bg-gray-100 flex items-center justify-center"
      >
        <el-icon class="text-gray-400" size="48">
          <component :is="useRenderIcon('ep:picture')" />
        </el-icon>
      </div>
      <div
        v-if="news.categoryName"
        class="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm"
      >
        {{ news.categoryName }}
      </div>
    </div>

    <!-- 资讯基本信息 -->
    <div class="p-6 md:p-8">
      <div class="flex flex-col md:flex-row md:justify-between md:items-start">
        <div class="md:w-2/3">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {{ news.title }}
          </h1>

          <!-- 副标题 -->
          <h2 v-if="news.subtitle" class="text-lg text-gray-600 mb-4">
            {{ news.subtitle }}
          </h2>

          <!-- 资讯元信息 -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center text-gray-600">
              <el-icon class="w-5 h-5 text-primary mr-2">
                <component :is="useRenderIcon('ep:user')" />
              </el-icon>
              <span>作者: {{ news.author }}</span>
              <span v-if="news.source" class="ml-4"
                >来源: {{ news.source }}</span
              >
            </div>

            <div
              v-if="news.publishTime"
              class="flex items-center text-gray-600"
            >
              <el-icon class="w-5 h-5 text-primary mr-2">
                <component :is="useRenderIcon('ep:calendar')" />
              </el-icon>
              <span>发布时间: {{ formatDateTime(news.publishTime) }}</span>
            </div>

            <div class="flex items-center text-gray-600">
              <el-icon class="w-5 h-5 text-primary mr-2">
                <component :is="useRenderIcon('ep:view')" />
              </el-icon>
              <span>浏览: {{ news.viewCount }}</span>
              <span class="ml-4">评论: {{ news.commentCount }}</span>
              <span class="ml-4">点赞: {{ news.likeCount }}</span>
            </div>
          </div>

          <!-- 资讯摘要 -->
          <div v-if="news.summary" class="bg-gray-50 p-4 rounded-lg mb-4">
            <p class="text-gray-700 leading-relaxed">{{ news.summary }}</p>
          </div>

          <!-- 资讯标签 -->
          <div
            v-if="news.tags && news.tags.length > 0"
            class="flex flex-wrap gap-2 mb-6"
          >
            <span
              v-for="(tag, index) in news.tags"
              :key="tag"
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

        <!-- 右侧管理区域 -->
        <div
          v-if="isAdmin"
          class="md:w-1/3 md:border-l md:pl-8 md:ml-4 mt-6 md:mt-0"
        >
          <div class="flex flex-col items-center">
            <!-- 资讯状态 -->
            <div
              :class="[
                'px-4 py-1 rounded-full text-sm font-medium mb-6',
                getStatusClass(news.status)
              ]"
            >
              {{ getStatusText(news.status) }}
            </div>

            <!-- 推荐状态 -->
            <div v-if="news.isRecommended" class="mb-6">
              <el-tag type="warning" effect="plain" size="large">
                <el-icon class="mr-1">
                  <component :is="useRenderIcon('ep:star-filled')" />
                </el-icon>
                推荐资讯
              </el-tag>
            </div>

            <!-- 置顶状态 -->
            <div v-if="news.isTop" class="mb-6">
              <el-tag type="danger" effect="plain" size="large">
                <el-icon class="mr-1">
                  <component :is="useRenderIcon('ep:top')" />
                </el-icon>
                置顶资讯
              </el-tag>
            </div>

            <!-- 管理操作按钮 -->
            <div class="space-y-3 w-full">
              <el-button
                v-if="news.status === 2"
                type="success"
                class="w-full"
                @click="handlePublish"
              >
                <el-icon class="mr-2">
                  <component :is="useRenderIcon('ep:promotion')" />
                </el-icon>
                发布资讯
              </el-button>

              <el-button
                v-if="news.status === 1"
                type="warning"
                class="w-full"
                @click="handleOffline"
              >
                <el-icon class="mr-2">
                  <component :is="useRenderIcon('ep:video-pause')" />
                </el-icon>
                下线资讯
              </el-button>

              <el-button
                :type="news.isRecommended ? 'warning' : 'success'"
                class="w-full"
                @click="handleToggleRecommend"
              >
                <el-icon class="mr-2">
                  <component :is="useRenderIcon('ep:star')" />
                </el-icon>
                {{ news.isRecommended ? "取消推荐" : "设为推荐" }}
              </el-button>

              <el-button
                :type="news.isTop ? 'warning' : 'danger'"
                class="w-full"
                @click="handleToggleTop"
              >
                <el-icon class="mr-2">
                  <component :is="useRenderIcon('ep:top')" />
                </el-icon>
                {{ news.isTop ? "取消置顶" : "设为置顶" }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import type { NewsDetail } from "../types/types";

interface Props {
  news: NewsDetail;
  isAdmin?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false
});

const emit = defineEmits<{
  "status-change": [status: number];
  "recommend-change": [isRecommended: boolean];
  "top-change": [isTop: boolean];
}>();

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

// 获取状态样式类
const getStatusClass = (status: number) => {
  switch (status) {
    case 0:
      return "bg-gray-100 text-gray-700";
    case 1:
      return "bg-green-100 text-green-700";
    case 2:
      return "bg-yellow-100 text-yellow-700";
    case 3:
      return "bg-blue-100 text-blue-700";
    case 4:
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// 获取状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "草稿";
    case 1:
      return "已发布";
    case 2:
      return "已下线";
    default:
      return "未知";
  }
};

// 发布
const handlePublish = () => {
  emit("status-change", 1);
};

// 下线
const handleOffline = () => {
  emit("status-change", 2);
};

// 切换推荐状态
const handleToggleRecommend = () => {
  emit("recommend-change", !props.news.isRecommended);
};

// 切换置顶状态
const handleToggleTop = () => {
  emit("top-change", !props.news.isTop);
};
</script>

<style scoped lang="scss">
button:focus {
  outline: none;
}
</style>
