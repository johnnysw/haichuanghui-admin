<template>
  <div class="bg-white shadow-sm border-b">
    <div class="px-6 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 活动海报 -->
        <div class="flex-shrink-0">
          <el-image
            v-if="event.poster"
            :src="event.poster"
            :alt="event.title"
            class="w-32 h-32 lg:w-48 lg:h-32 rounded-lg object-cover border"
            fit="cover"
            :preview-src-list="[event.poster]"
            preview-teleported
          />
          <div
            v-else
            class="w-32 h-32 lg:w-48 lg:h-32 bg-gray-100 rounded-lg flex items-center justify-center border"
          >
            <el-icon class="text-gray-400" size="32">
              <component :is="useRenderIcon('ep:picture')" />
            </el-icon>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="flex-1 min-w-0">
          <!-- 标题和状态 -->
          <div
            class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4"
          >
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">
                {{ event.title }}
              </h1>
              <div class="flex items-center gap-3 flex-wrap">
                <el-tag :type="getStatusInfo.type" effect="plain" size="large">
                  {{ getStatusInfo.label }}
                </el-tag>

                <el-tag
                  v-if="event.isRecommended"
                  type="warning"
                  effect="plain"
                  size="large"
                >
                  <el-icon class="mr-1">
                    <component :is="useRenderIcon('ep:star-filled')" />
                  </el-icon>
                  推荐活动
                </el-tag>

                <el-tag
                  :style="{
                    color: getTypeInfo(event.type).color,
                    backgroundColor: getTypeInfo(event.type).bgColor
                  }"
                  size="large"
                >
                  {{ event.type }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 基础信息网格 -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm"
          >
            <!-- 主办方 -->
            <div class="flex items-center gap-2">
              <el-icon class="text-gray-500">
                <component :is="useRenderIcon('ep:office-building')" />
              </el-icon>
              <span class="text-gray-600">主办方：</span>
              <span class="font-medium">{{ event.organizer }}</span>
            </div>

            <!-- 活动地点 -->
            <div class="flex items-center gap-2">
              <el-icon class="text-gray-500">
                <component :is="useRenderIcon('ep:location')" />
              </el-icon>
              <span class="text-gray-600">地点：</span>
              <span class="font-medium">{{ event.location }}</span>
            </div>

            <!-- 开始时间 -->
            <div class="flex items-center gap-2">
              <el-icon class="text-gray-500">
                <component :is="useRenderIcon('ep:calendar')" />
              </el-icon>
              <span class="text-gray-600">开始：</span>
              <span class="font-medium">{{
                formatDateTime(event.startTime)
              }}</span>
            </div>

            <!-- 结束时间 -->
            <div class="flex items-center gap-2">
              <el-icon class="text-gray-500">
                <component :is="useRenderIcon('ep:calendar')" />
              </el-icon>
              <span class="text-gray-600">结束：</span>
              <span class="font-medium">{{
                formatDateTime(event.endTime)
              }}</span>
            </div>

            <!-- 参与人数 -->
            <div class="flex items-center gap-2">
              <el-icon class="text-gray-500">
                <component :is="useRenderIcon('ep:user')" />
              </el-icon>
              <span class="text-gray-600">参与：</span>
              <span class="font-medium">
                {{ event.participantCount
                }}{{
                  event.maxParticipants ? `/${event.maxParticipants}` : ""
                }}人
              </span>
            </div>

            <!-- 联系人 -->
            <div class="flex items-center gap-2">
              <el-icon class="text-gray-500">
                <component :is="useRenderIcon('ep:user')" />
              </el-icon>
              <span class="text-gray-600">联系人：</span>
              <span class="font-medium">{{ event.contactPerson }}</span>
            </div>
          </div>

          <!-- 活动描述 -->
          <div v-if="event.description" class="mt-4">
            <p class="text-gray-700 leading-relaxed">{{ event.description }}</p>
          </div>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div v-if="stats && !statsLoading" class="mt-6 pt-6 border-t">
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {{ stats.totalViews }}
            </div>
            <div class="text-xs text-gray-500">总浏览量</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ stats.registrations }}
            </div>
            <div class="text-xs text-gray-500">报名人数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">
              {{ stats.favorites }}
            </div>
            <div class="text-xs text-gray-500">收藏数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">
              {{ stats.shares }}
            </div>
            <div class="text-xs text-gray-500">分享数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">
              {{ stats.todayViews }}
            </div>
            <div class="text-xs text-gray-500">今日浏览</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-indigo-600">
              {{ stats.monthlyViews }}
            </div>
            <div class="text-xs text-gray-500">月度浏览</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">
              {{ stats.averageRating.toFixed(1) }}
            </div>
            <div class="text-xs text-gray-500">平均评分</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-cyan-600">
              {{ stats.feedbackCount }}
            </div>
            <div class="text-xs text-gray-500">反馈数</div>
          </div>
        </div>
      </div>

      <!-- 统计加载中 -->
      <div v-else-if="statsLoading" class="mt-6 pt-6 border-t">
        <div class="flex justify-center">
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import type { EventDetail, EventStats } from "../types/types";

interface Props {
  event: EventDetail;
  stats?: EventStats | null;
  statsLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  stats: null,
  statsLoading: false
});

// 获取状态信息
const getStatusInfo = computed(() => {
  switch (props.event.status) {
    case 0:
      return { label: "报名中", type: "primary" as const };
    case 1:
      return { label: "进行中", type: "success" as const };
    case 2:
      return { label: "已结束", type: "info" as const };
    case 3:
      return { label: "已取消", type: "danger" as const };
    default:
      return { label: "未知状态", type: "info" as const };
  }
});

// 获取类型信息
const getTypeInfo = (type: string) => {
  switch (type) {
    case "创业培训":
      return { color: "#1890ff", bgColor: "#e6f7ff" };
    case "项目路演":
      return { color: "#fa8c16", bgColor: "#fff7e6" };
    case "投融资对接":
      return { color: "#52c41a", bgColor: "#f6ffed" };
    case "行业论坛":
      return { color: "#722ed1", bgColor: "#f9f0ff" };
    case "创业沙龙":
      return { color: "#eb2f96", bgColor: "#fff0f6" };
    case "政策宣讲":
      return { color: "#13c2c2", bgColor: "#e6fffb" };
    default:
      return { color: "#8c8c8c", bgColor: "#f5f5f5" };
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
</script>
