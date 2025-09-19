<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <div class="p-8">
      <div class="flex flex-col md:flex-row">
        <!-- 左侧：Logo和联系信息 -->
        <div class="flex flex-col md:w-1/4 mb-6 md:mb-0">
          <img
            v-if="incubator.logo"
            :src="incubator.logo"
            :alt="incubator.name"
            class="w-full h-64 md:h-48 object-cover rounded-lg mb-4"
          />
          <div v-else class="w-full h-64 md:h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <div class="text-center text-gray-400">
              <el-icon :size="48">
                <component :is="useRenderIcon(OfficeBuilding)" />
              </el-icon>
              <p class="mt-2">暂无图片</p>
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <div v-if="incubator.address" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon(LocationFilled)" />
              </el-icon>
              <span class="text-gray-700">{{ incubator.address || '暂无地址信息' }}</span>
            </div>
            <div v-if="incubator.contactPhone" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon(Phone)" />
              </el-icon>
              <span class="text-gray-700">{{ incubator.contactPhone }}</span>
            </div>
            <div v-if="incubator.website" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon(Link)" />
              </el-icon>
              <a :href="incubator.website" class="text-primary hover:underline" target="_blank">
                官方网站
              </a>
            </div>
            <div v-if="incubator.contactEmail" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon(Message)" />
              </el-icon>
              <span class="text-gray-700">{{ incubator.contactEmail }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧：详细信息 -->
        <div class="md:w-3/4 md:pl-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ incubator.name }}</h1>
              <div class="flex items-center flex-wrap gap-2">
                <span
                  v-if="incubator.type"
                  :class="getTypeColor(incubator.type)"
                  class="px-3 py-1 rounded-full text-sm"
                >
                  {{ getTypeLabel(incubator.type) }}
                </span>
                <span
                  v-if="incubator.location"
                  class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {{ incubator.location }}
                </span>
                <span
                  v-if="incubator.isRecommended"
                  class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                >
                  推荐载体
                </span>
                <span
                  v-for="field in getServiceFields(incubator.services)"
                  :key="field"
                  class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {{ field }}
                </span>
              </div>
            </div>
          </div>

          <!-- 统计数据 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" v-loading="statsLoading">
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">
                {{ stats?.todayViews || 0 }}
              </div>
              <div class="text-gray-600 text-sm">今日浏览</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ stats?.applications || 0 }}</div>
              <div class="text-gray-600 text-sm">申请数量</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ stats?.monthlyViews || 0 }}</div>
              <div class="text-gray-600 text-sm">本月浏览</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ stats?.favorites || 0 }}</div>
              <div class="text-gray-600 text-sm">收藏数量</div>
            </div>
          </div>

          <!-- 载体信息 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">
                {{ incubator.companyCount || 0 }}+
              </div>
              <div class="text-gray-600 text-sm">入驻企业</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ incubator.graduatedCount || 0 }}+</div>
              <div class="text-gray-600 text-sm">毕业企业</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ getEstablishedYear() }}年</div>
              <div class="text-gray-600 text-sm">成立时间</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">
                {{ formatNumber(incubator.areaSize) }}㎡
              </div>
              <div class="text-gray-600 text-sm">场地面积</div>
            </div>
          </div>

          <!-- 简介 -->
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-3">简介</h2>
            <p class="text-gray-700 leading-relaxed">
              {{ incubator.description || '暂无简介信息' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import LocationFilled from "@iconify-icons/ep/location-filled";
import Phone from "@iconify-icons/ep/phone";
import Message from "@iconify-icons/ep/message";
import Link from "@iconify-icons/ep/link";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import type { IncubatorDetail, IncubatorStats } from "../types/types";

// Props
const props = defineProps<{
  incubator: IncubatorDetail;
  stats?: IncubatorStats | null;
  statsLoading?: boolean;
}>();

// 格式化数字（添加千位分隔符）
const formatNumber = (value: any) => {
  if (!value) return '0';
  return Number(value).toLocaleString();
};

// 获取服务领域
const getServiceFields = (services: any) => {
  if (!services) return [];

  if (typeof services === 'string') {
    try {
      const parsed = JSON.parse(services);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 3);
      }
      return services.split(/[,，]/).slice(0, 3);
    } catch (e) {
      return services.split(/[,，]/).slice(0, 3);
    }
  }

  if (Array.isArray(services)) {
    return services.slice(0, 3);
  }

  return [];
};

// 获取类型标签
const getTypeLabel = (type?: string) => {
  switch (type) {
    case "科技园":
      return "科技园";
    case "science-park":
      return "科技园区";
    case "创业园":
      return "创业园";
    case "孵化器":
      return "孵化器";
    case "加速器":
      return "加速器";
    default:
      return type || "双创载体";
  }
};

// 获取类型颜色
const getTypeColor = (type?: string) => {
  switch (type) {
    case "科技园":
    case "science-park":
      return 'bg-purple-100 text-purple-600';
    case "创业园":
      return 'bg-green-100 text-green-600';
    case "孵化器":
      return 'bg-blue-100 text-primary';
    case "加速器":
      return 'bg-orange-100 text-orange-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

// 获取成立年份
const getEstablishedYear = () => {
  if (props.incubator.establishedDate) {
    return new Date(props.incubator.establishedDate).getFullYear();
  }
  return '未知';
};
</script>