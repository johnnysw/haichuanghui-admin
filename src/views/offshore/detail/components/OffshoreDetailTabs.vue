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
        <h2 class="text-2xl font-bold text-gray-800 mb-4">关于{{ offshore.name }}</h2>
        <div
          v-if="offshore.detailedIntro"
          class="text-gray-700 leading-relaxed mb-6 rich-text-content"
          v-html="offshore.detailedIntro"
        ></div>
        <div
          v-else-if="offshore.description"
          class="text-gray-700 leading-relaxed mb-6"
        >
          {{ offshore.description }}
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
            <div class="text-3xl font-bold text-primary mb-2">{{ offshore.companyCount || 0 }}家</div>
            <div class="text-gray-600">当前入驻企业</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">{{ offshore.graduatedCount || 0 }}家</div>
            <div class="text-gray-600">成功毕业企业</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-orange-600 mb-2">{{ offshore.successStoryCount || 0 }}个</div>
            <div class="text-gray-600">成功案例</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">88%</div>
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
                <component :is="useRenderIcon('ep:check')" />
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
                  <component :is="useRenderIcon('ep:document')" />
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
          <div v-if="offshore.address" class="flex items-center space-x-3">
            <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
              <component :is="useRenderIcon('ep:location')" />
            </el-icon>
            <span class="text-gray-700">{{ offshore.address }}</span>
          </div>
          <div v-if="offshore.contactPhone" class="flex items-center space-x-3">
            <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
              <component :is="useRenderIcon('ep:phone')" />
            </el-icon>
            <span class="text-gray-700">{{ offshore.contactPhone }}</span>
          </div>
          <div v-if="offshore.contactEmail" class="flex items-center space-x-3">
            <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
              <component :is="useRenderIcon('ep:message')" />
            </el-icon>
            <span class="text-gray-700">{{ offshore.contactEmail }}</span>
          </div>
          <div v-if="offshore.website" class="flex items-center space-x-3">
            <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
              <component :is="useRenderIcon('ep:link')" />
            </el-icon>
            <a :href="offshore.website" class="text-primary hover:underline" target="_blank">
              {{ offshore.website }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import type { OffshoreDetail } from "../types/types";

defineOptions({ name: "OffshoreDetailTabs" });

interface Props {
  offshore: OffshoreDetail;
  activeTab?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeTab: "introduction"
});

const emit = defineEmits<{
  "tab-change": [tab: string];
}>();

const currentTab = ref(props.activeTab);

// 标签页配置
const tabs = [
  { key: 'introduction', label: '详细介绍' },
  { key: 'environment', label: '环境展示' },
  { key: 'companies', label: '入驻企业' },
  { key: 'services', label: '服务内容' },
  { key: 'policies', label: '政策支持' },
  { key: 'contact', label: '联系方式' },
];

// 标签页切换
const handleTabChange = (tab: string) => {
  currentTab.value = tab;
  emit("tab-change", tab);
};

// 获取图片列表
const getImages = () => {
  if (!props.offshore.images) return [];
  
  try {
    // 如果是字符串，尝试解析为JSON（兼容旧数据）
    if (typeof props.offshore.images === 'string') {
      try {
        const parsed = JSON.parse(props.offshore.images);
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
        const urls = props.offshore.images.split(/[,，]/).filter((url) => url.trim() !== '');
        return urls.map((url: string, index: number) => ({
          name: `环境图片${index + 1}.jpg`,
          url: url.trim(),
          type: 'image/jpeg'
        }));
      }
    }

    // 如果已经是数组
    if (Array.isArray(props.offshore.images)) {
      return props.offshore.images;
    }

    return [];
  } catch (error) {
    console.warn('解析图片数据失败:', error);
    return [];
  }
};

// 获取服务内容数据
const getServices = () => {
  if (!props.offshore.services) {
    return [
      '国际市场开拓支持',
      '投融资对接平台',
      '跨境创业培训',
      '政策咨询服务',
      '技术转移服务',
      '人才招聘协助'
    ];
  }

  if (typeof props.offshore.services === 'string') {
    try {
      const parsed = JSON.parse(props.offshore.services);
      if (Array.isArray(parsed)) return parsed;
      return [props.offshore.services];
    } catch (e) {
      return props.offshore.services.split(/[,，]/).filter(item => item.trim() !== '');
    }
  }

  if (Array.isArray(props.offshore.services)) {
    return props.offshore.services;
  }

  return [];
};

// 获取政策数据
const getPolicies = () => {
  if (!props.offshore.policies) return [];

  if (typeof props.offshore.policies === 'string') {
    try {
      const parsed = JSON.parse(props.offshore.policies);
      if (Array.isArray(parsed)) {
        // 如果解析出的是对象数组，直接返回
        if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0].name) {
          return parsed;
        }
        // 如果是字符串数组，转换为政策对象
        return parsed.map((name: string, index: number) => ({
          name: name,
          url: `#policy-${index}`,
          size: 1024000,
          type: 'application/pdf'
        }));
      }
      return [];
    } catch (e) {
      // 解析失败，按逗号分割转换为政策对象
      const names = props.offshore.policies.split(/[,，]/).filter(name => name.trim() !== '');
      return names.map((name: string, index: number) => ({
        name: name.trim(),
        url: `#policy-${index}`,
        size: 1024000,
        type: 'application/pdf'
      }));
    }
  }

  if (Array.isArray(props.offshore.policies)) {
    return props.offshore.policies;
  }

  return [];
};

// 格式化文件大小
function formatFileSize(size?: number): string {
  if (!size) return '未知大小';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
</script>

<style scoped lang="scss">
:deep(.rich-text-content) {
  h1, h2, h3, h4, h5, h6 {
    margin: 1em 0 0.5em 0;
    font-weight: 600;
  }
  
  p {
    margin: 0.5em 0;
    line-height: 1.6;
  }
  
  ul, ol {
    margin: 1em 0;
    padding-left: 2em;
  }
  
  li {
    margin: 0.25em 0;
  }
}
</style>