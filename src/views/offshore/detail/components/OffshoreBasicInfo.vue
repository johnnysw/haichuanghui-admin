<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <div class="p-8">
      <div class="flex flex-col md:flex-row">
        <!-- 左侧：Logo和联系信息 -->
        <div class="flex flex-col md:w-1/4 mb-6 md:mb-0">
          <img
            v-if="offshore.logo"
            :src="offshore.logo"
            :alt="offshore.name"
            class="w-full h-64 md:h-48 object-cover rounded-lg mb-4"
          />
          <div v-else class="w-full h-64 md:h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <div class="text-center text-gray-400">
              <el-icon :size="48">
                <component :is="useRenderIcon('ep:office-building')" />
              </el-icon>
              <p class="mt-2">暂无图片</p>
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <div v-if="offshore.address" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon('ep:location')" />
              </el-icon>
              <span class="text-gray-700">{{ offshore.address || '暂无地址信息' }}</span>
            </div>
            <div v-if="offshore.contactPhone" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon('ep:phone')" />
              </el-icon>
              <span class="text-gray-700">{{ offshore.contactPhone }}</span>
            </div>
            <div v-if="offshore.website" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon('ep:link')" />
              </el-icon>
              <a :href="offshore.website" class="text-primary hover:underline" target="_blank">
                官方网站
              </a>
            </div>
            <div v-if="offshore.contactEmail" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon('ep:message')" />
              </el-icon>
              <span class="text-gray-700">{{ offshore.contactEmail }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧：详细信息 -->
        <div class="md:w-3/4 md:pl-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ offshore.name }}</h1>
              <div class="flex items-center flex-wrap gap-2">
                <span
                  v-if="offshore.type"
                  :class="getTypeColor(offshore.type)"
                  class="px-3 py-1 rounded-full text-sm"
                >
                  {{ offshore.type }}
                </span>
                <span
                  v-if="offshore.location"
                  class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {{ offshore.location }}
                </span>
                <span
                  v-if="offshore.isRecommended"
                  class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                >
                  推荐中心
                </span>
                <span
                  v-for="field in getServiceFields(offshore.services)"
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

          <!-- 中心信息 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">
                {{ offshore.companyCount || 0 }}+
              </div>
              <div class="text-gray-600 text-sm">入驻企业</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ offshore.graduatedCount || 0 }}+</div>
              <div class="text-gray-600 text-sm">毕业企业</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ getEstablishedYear() }}年</div>
              <div class="text-gray-600 text-sm">成立时间</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">
                {{ formatNumber(offshore.areaSize) }}㎡
              </div>
              <div class="text-gray-600 text-sm">场地面积</div>
            </div>
          </div>

          <!-- 简介 -->
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-3">简介</h2>
            <p class="text-gray-700 leading-relaxed">
              {{ offshore.description || '暂无简介信息' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import type { OffshoreDetail, OffshoreStats } from "../types/types";

defineOptions({ name: "OffshoreBasicInfo" });

interface Props {
  offshore: OffshoreDetail;
  stats?: OffshoreStats | null;
  statsLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  stats: null,
  statsLoading: false
});

// 获取类型颜色
const getTypeColor = (type?: string) => {
  switch (type) {
    case "科技园":
      return 'bg-purple-100 text-purple-600';
    case "孵化器":
      return 'bg-blue-100 text-primary';
    case "加速器":
      return 'bg-orange-100 text-orange-600';
    case "创业园":
      return 'bg-green-100 text-green-600';
    case "研究院":
      return 'bg-pink-100 text-pink-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

// 获取服务领域（取前几个作为标签显示）
const getServiceFields = (services?: string[]) => {
  if (!services || services.length === 0) return [];
  return services.slice(0, 3); // 只显示前3个服务作为标签
};

// 获取成立年份
const getEstablishedYear = () => {
  if (!props.offshore.establishedDate) return new Date().getFullYear();
  return new Date(props.offshore.establishedDate).getFullYear();
};

// 格式化数字
const formatNumber = (num?: number) => {
  if (!num) return 0;
  return num.toLocaleString();
};
</script>

<style scoped lang="scss">
// 组件样式
</style>