<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <!-- 标签页导航 -->
    <div class="border-b border-gray-200">
      <nav class="flex overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="[
            'px-6 py-4 whitespace-nowrap',
            currentTab === tab.key
              ? 'border-b-2 border-primary text-primary font-medium'
              : 'text-gray-600 hover:text-primary',
          ]"
          @click="handleTabChange(tab.key)"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- 标签页内容 -->
    <div class="p-8">
      <!-- 详细介绍 -->
      <div v-if="currentTab === 'introduction'">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">关于{{ incubator.name }}</h2>
        <div
          v-if="incubator.detailedIntro"
          class="text-gray-700 leading-relaxed mb-6 rich-text-content"
          v-html="incubator.detailedIntro"
        ></div>
        <div
          v-else-if="incubator.description"
          class="text-gray-700 leading-relaxed mb-6"
        >
          {{ incubator.description }}
        </div>
        <div v-else class="text-center py-10 text-gray-500">暂无详细介绍信息</div>
      </div>

      <!-- 环境展示 -->
      <div v-else-if="currentTab === 'environment'">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">环境展示</h2>
        <div v-if="getImages().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(image, index) in getImages()"
            :key="index"
            class="rounded-lg overflow-hidden shadow-sm border border-gray-200"
          >
            <img
              :src="image.url"
              :alt="image.name"
              class="w-full h-64 object-cover"
            />
            <div class="p-3 bg-white">
              <p class="text-sm font-medium text-gray-800 truncate">{{ image.name }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatFileSize(image.size) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-500">暂无环境展示信息</div>
      </div>

      <!-- 入驻企业 -->
      <div v-else-if="currentTab === 'companies'">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">入驻企业</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-primary mb-2">{{ incubator.companyCount || 0 }}家</div>
            <div class="text-gray-600">当前入驻企业</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">{{ incubator.graduatedCount || 0 }}家</div>
            <div class="text-gray-600">成功毕业企业</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-orange-600 mb-2">{{ incubator.successStoryCount || 0 }}个</div>
            <div class="text-gray-600">成功案例</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">85%</div>
            <div class="text-gray-600">企业存活率</div>
          </div>
        </div>
      </div>

      <!-- 服务内容 -->
      <div v-else-if="currentTab === 'services'">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">服务内容</h2>
        <div v-if="getServices().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="(service, index) in getServices()"
            :key="index"
            class="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
          >
            <div class="text-primary">
              <el-icon :size="20">
                <component :is="useRenderIcon(Check)" />
              </el-icon>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800 mb-2">服务{{ index + 1 }}</h4>
              <p class="text-gray-600">{{ service }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-500">暂无服务内容信息</div>
      </div>

      <!-- 政策支持 -->
      <div v-else-if="currentTab === 'policies'">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">政策支持</h2>
        <div v-if="getPolicies().length > 0" class="space-y-4">
          <div
            v-for="(policy, index) in getPolicies()"
            :key="index"
            class="bg-blue-50 border border-blue-200 rounded-lg p-6"
          >
            <div class="flex items-center space-x-4">
              <div class="text-primary">
                <el-icon :size="24">
                  <component :is="useRenderIcon(Document)" />
                </el-icon>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-800 mb-1">{{ policy.name }}</h4>
                <p class="text-sm text-gray-600 mb-2">{{ formatFileSize(policy.size) }}</p>
                <a 
                  :href="policy.url" 
                  target="_blank" 
                  class="inline-flex items-center text-primary hover:text-blue-700 text-sm font-medium"
                >
                  <el-icon class="mr-1" :size="16">
                    <component :is="useRenderIcon('ep:download')" />
                  </el-icon>
                  下载文件
                </a>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-500">暂无政策支持文件</div>
      </div>

      <!-- 联系方式 -->
      <div v-else-if="currentTab === 'contact'">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">联系方式</h2>
        <div class="space-y-4">
          <div v-if="incubator.address" class="flex items-center space-x-3">
            <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
              <component :is="useRenderIcon(LocationFilled)" />
            </el-icon>
            <span class="text-gray-700">{{ incubator.address }}</span>
          </div>
          <div v-if="incubator.contactPhone" class="flex items-center space-x-3">
            <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
              <component :is="useRenderIcon(Phone)" />
            </el-icon>
            <span class="text-gray-700">{{ incubator.contactPhone }}</span>
          </div>
          <div v-if="incubator.contactEmail" class="flex items-center space-x-3">
            <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
              <component :is="useRenderIcon(Message)" />
            </el-icon>
            <span class="text-gray-700">{{ incubator.contactEmail }}</span>
          </div>
          <div v-if="incubator.website" class="flex items-center space-x-3">
            <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
              <component :is="useRenderIcon(Link)" />
            </el-icon>
            <a :href="incubator.website" class="text-primary hover:underline" target="_blank">
              {{ incubator.website }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import LocationFilled from "@iconify-icons/ep/location-filled";
import Phone from "@iconify-icons/ep/phone";
import Message from "@iconify-icons/ep/message";
import Link from "@iconify-icons/ep/link";
import Check from "@iconify-icons/ep/check";
import Document from "@iconify-icons/ep/document";
import type { IncubatorDetail } from "../types/types";

// Props
const props = defineProps<{
  incubator: IncubatorDetail;
  activeTab: string;
}>();

// Emits
const emit = defineEmits<{
  'tab-change': [tab: string];
}>();

const currentTab = ref(props.activeTab);

// 监听外部activeTab变化
watch(() => props.activeTab, (newTab) => {
  currentTab.value = newTab;
});

// 标签页配置
const tabs = [
  { key: 'introduction', label: '详细介绍' },
  { key: 'environment', label: '环境展示' },
  { key: 'companies', label: '入驻企业' },
  { key: 'services', label: '服务内容' },
  { key: 'policies', label: '政策支持' },
  { key: 'contact', label: '联系方式' },
];

// 获取图片列表
const getImages = () => {
  if (!props.incubator.images) return [];
  
  try {
    // 如果是字符串，尝试解析为JSON（兼容旧数据）
    if (typeof props.incubator.images === 'string') {
      try {
        const parsed = JSON.parse(props.incubator.images);
        if (Array.isArray(parsed)) {
          // 如果解析出的是对象数组，直接返回
          if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0].url) {
            return parsed;
          }
          // 如果是字符串数组，转换为图片对象
          return parsed.map((url: string, index: number) => ({
            name: `环境图片${index + 1}.jpg`,
            url: url,
            type: 'image/jpeg'
          }));
        }
        return [];
      } catch {
        // 解析失败，按逗号分割转换为图片对象
        const urls = props.incubator.images.split(/[,，]/).filter((url) => url.trim() !== '');
        return urls.map((url: string, index: number) => ({
          name: `环境图片${index + 1}.jpg`,
          url: url.trim(),
          type: 'image/jpeg'
        }));
      }
    }

    // 如果已经是数组
    if (Array.isArray(props.incubator.images)) {
      return props.incubator.images;
    }

    return [];
  } catch (error) {
    console.warn('解析图片数据失败:', error);
    return [];
  }
};

// 获取服务内容数据
const getServices = () => {
  if (!props.incubator.services) {
    return [
      '办公场地租赁服务',
      '投融资对接平台',
      '创业培训辅导',
      '政策咨询服务',
      '技术支持服务',
      '市场推广协助'
    ];
  }

  if (typeof props.incubator.services === 'string') {
    try {
      const parsed = JSON.parse(props.incubator.services);
      if (Array.isArray(parsed)) return parsed;
      return [props.incubator.services];
    } catch (e) {
      return props.incubator.services.split(/[,，]/).filter(item => item.trim() !== '');
    }
  }

  if (Array.isArray(props.incubator.services)) {
    return props.incubator.services;
  }

  return [];
};

// 获取政策支持数据
const getPolicies = () => {
  if (!props.incubator.policies) {
    return [
      '房租补贴：对符合条件的创业企业提供房租优惠',
      '税收优惠：享受高新技术企业所得税优惠政策',
      '人才引进：提供人才引进绿色通道和住房补贴',
      '项目扶持：对优质项目提供专项资金扶持'
    ];
  }

  if (typeof props.incubator.policies === 'string') {
    try {
      const parsed = JSON.parse(props.incubator.policies);
      if (Array.isArray(parsed)) return parsed;
      return [props.incubator.policies];
    } catch (e) {
      return props.incubator.policies.split(/[,，]/).filter(item => item.trim() !== '');
    }
  }

  if (Array.isArray(props.incubator.policies)) {
    return props.incubator.policies;
  }

  return [];
};

// 方法
const handleTabChange = (tabName: string) => {
  currentTab.value = tabName;
  emit('tab-change', tabName);
};
</script>

<style scoped>
/* 富文本内容样式 */
.rich-text-content :deep(h1) {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
}

.rich-text-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.875rem;
  color: #1f2937;
}

.rich-text-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.rich-text-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.625;
}

.rich-text-content :deep(ul),
.rich-text-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.rich-text-content :deep(li) {
  margin-bottom: 0.5rem;
}

.rich-text-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  margin: 1rem 0;
}

.rich-text-content :deep(a) {
  color: #3b82f6;
  text-decoration: none;
}

.rich-text-content :deep(a:hover) {
  text-decoration: underline;
}

/* 简洁样式 */
</style>