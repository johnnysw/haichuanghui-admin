<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <!-- 活动海报 -->
    <div class="relative">
      <el-image
        v-if="event.poster"
        :src="event.poster"
        :alt="event.title"
        class="w-full h-64 md:h-80 object-cover"
        fit="cover"
      />
      <div v-else class="w-full h-64 md:h-80 bg-gray-100 flex items-center justify-center">
        <el-icon class="text-gray-400" size="48">
          <component :is="useRenderIcon('ep:picture')" />
        </el-icon>
      </div>
      <div class="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
        {{ event.type }}
      </div>
    </div>
    
    <!-- 活动基本信息 -->
    <div class="p-6 md:p-8">
      <div class="flex flex-col md:flex-row md:justify-between md:items-start">
        <div class="md:w-2/3">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{{ event.title }}</h1>
          
          <!-- 活动时间和地点 -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center text-gray-600">
              <el-icon class="w-5 h-5 text-primary mr-2">
                <component :is="useRenderIcon('ep:calendar')" />
              </el-icon>
              <span>{{ formatDateTime(event.startTime) }} - {{ formatDateTime(event.endTime) }}</span>
            </div>
            <div class="flex items-center text-gray-600">
              <el-icon class="w-5 h-5 text-primary mr-2">
                <component :is="useRenderIcon('ep:location')" />
              </el-icon>
              <span>{{ event.location }} - {{ event.address }}</span>
            </div>
            <div class="flex items-center text-gray-600">
              <el-icon class="w-5 h-5 text-primary mr-2">
                <component :is="useRenderIcon('ep:user-group')" />
              </el-icon>
              <span>已报名: {{ event.participantCount }}人{{ event.maxParticipants ? ` / 限额: ${event.maxParticipants}人` : '' }}</span>
            </div>
          </div>
          
          <!-- 活动标签 -->
          <div v-if="event.tags && event.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="(tag, index) in event.tags"
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
        <div v-if="isAdmin" class="md:w-1/3 md:border-l md:pl-8 md:ml-4 mt-6 md:mt-0">
          <div class="flex flex-col items-center">
            <!-- 活动状态 -->
            <div :class="[
              'px-4 py-1 rounded-full text-sm font-medium mb-6',
              getStatusClass(event.status)
            ]">
              {{ getStatusText(event.status) }}
            </div>
            
            <!-- 推荐状态 -->
            <div v-if="event.isRecommended" class="mb-6">
              <el-tag type="warning" effect="plain" size="large">
                <el-icon class="mr-1">
                  <component :is="useRenderIcon('ep:star-filled')" />
                </el-icon>
                推荐活动
              </el-tag>
            </div>
            
            <!-- 管理操作按钮 -->
            <div class="space-y-3 w-full">
              <el-button
                v-if="event.status === 3"
                type="success"
                class="w-full"
                @click="handleReactivate"
              >
                <el-icon class="mr-2">
                  <component :is="useRenderIcon('ep:refresh')" />
                </el-icon>
                重新激活
              </el-button>
              
              <el-button
                v-if="event.status === 0"
                type="warning"
                class="w-full"
                @click="handleCancel"
              >
                <el-icon class="mr-2">
                  <component :is="useRenderIcon('ep:video-pause')" />
                </el-icon>
                取消活动
              </el-button>
              
              <el-button
                :type="event.isRecommended ? 'warning' : 'success'"
                class="w-full"
                @click="handleToggleRecommend"
              >
                <el-icon class="mr-2">
                  <component :is="useRenderIcon('ep:star')" />
                </el-icon>
                {{ event.isRecommended ? '取消推荐' : '设为推荐' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessageBox } from "element-plus";
import type { EventDetail } from "../types/types";

interface Props {
  event: EventDetail;
  isAdmin?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false
});

const emit = defineEmits<{
  "status-change": [status: number];
  "recommend-change": [isRecommended: boolean];
}>();

// 获取状态类型
const getStatusType = (status: number) => {
  switch (status) {
    case 0: return "primary";
    case 1: return "success";
    case 2: return "info";
    case 3: return "danger";
    default: return "info";
  }
};

// 获取状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case 0: return "报名中";
    case 1: return "进行中";
    case 2: return "已结束";
    case 3: return "已取消";
    default: return "未知";
  }
};

// 获取状态样式
const getStatusClass = (status: number) => {
  switch (status) {
    case 0: return "bg-green-100 text-green-700";
    case 1: return "bg-blue-100 text-blue-700";
    case 2: return "bg-red-100 text-red-700";
    case 3: return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// 获取类型颜色
const getTypeColor = (type: string) => {
  switch (type) {
    case "创业培训": return "#1890ff";
    case "项目路演": return "#fa8c16";
    case "投融资对接": return "#52c41a";
    case "行业论坛": return "#722ed1";
    case "创业沙龙": return "#eb2f96";
    case "政策宣讲": return "#13c2c2";
    default: return "#8c8c8c";
  }
};

// 获取类型背景色
const getTypeBgColor = (type: string) => {
  switch (type) {
    case "创业培训": return "#e6f7ff";
    case "项目路演": return "#fff7e6";
    case "投融资对接": return "#f6ffed";
    case "行业论坛": return "#f9f0ff";
    case "创业沙龙": return "#fff0f6";
    case "政策宣讲": return "#e6fffb";
    default: return "#f5f5f5";
  }
};

// 取消活动
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm(
      `确认取消活动「${props.event.title}」吗？`,
      "取消活动确认",
      {
        confirmButtonText: "确认取消",
        cancelButtonText: "取消操作",
        type: "warning"
      }
    );
    
    emit("status-change", 3);
  } catch (error) {
    // 用户取消操作
  }
};

// 重新激活
const handleReactivate = async () => {
  try {
    await ElMessageBox.confirm(
      `确认重新激活活动「${props.event.title}」吗？`,
      "重新激活确认",
      {
        confirmButtonText: "确认激活",
        cancelButtonText: "取消",
        type: "success"
      }
    );
    
    emit("status-change", 0);
  } catch (error) {
    // 用户取消操作
  }
};

// 切换推荐状态
const handleToggleRecommend = async () => {
  const newRecommendStatus = !props.event.isRecommended;
  const action = newRecommendStatus ? "推荐" : "取消推荐";
  
  try {
    await ElMessageBox.confirm(
      `确认${action}活动「${props.event.title}」吗？`,
      `${action}确认`,
      {
        confirmButtonText: `确认${action}`,
        cancelButtonText: "取消",
        type: newRecommendStatus ? "success" : "warning"
      }
    );
    
    emit("recommend-change", newRecommendStatus);
  } catch (error) {
    // 用户取消操作
  }
};
</script>

<style scoped lang="scss">
</style>