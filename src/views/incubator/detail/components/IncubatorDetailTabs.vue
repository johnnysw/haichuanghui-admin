<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <el-tabs
      v-model="currentTab"
      class="incubator-tabs"
      stretch
      @tab-change="handleTabChange"
    >
      <el-tab-pane label="详细介绍" name="introduction">
        <div class="p-8">
          <div
            v-if="incubator.detailedIntro"
            class="text-gray-700 leading-relaxed mb-6 rich-text-content"
            v-html="incubator.detailedIntro"
          />
          <div
            v-else-if="incubator.description"
            class="text-gray-700 leading-relaxed mb-6"
          >
            {{ incubator.description }}
          </div>
          <div v-else class="text-center py-10 text-gray-500">
            暂无详细介绍信息
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="环境展示" name="environment">
        <div class="p-8">
          <div
            v-if="incubator.environmentShowcase"
            class="text-gray-700 leading-relaxed rich-text-content"
            v-html="incubator.environmentShowcase"
          />
          <div v-else class="text-center py-10 text-gray-500">
            暂无环境展示信息
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="入驻企业" name="companies">
        <div class="p-8">
          <div
            v-if="incubator.residentEnterprises"
            class="text-gray-700 leading-relaxed rich-text-content"
            v-html="incubator.residentEnterprises"
          />
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-primary mb-2">
                {{ incubator.companyCount || 0 }}家
              </div>
              <div class="text-gray-600">当前入驻企业</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-green-600 mb-2">
                {{ incubator.graduatedCount || 0 }}家
              </div>
              <div class="text-gray-600">成功毕业企业</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-orange-600 mb-2">
                {{ incubator.successStoryCount || 0 }}个
              </div>
              <div class="text-gray-600">成功案例</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-purple-600 mb-2">85%</div>
              <div class="text-gray-600">企业存活率</div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="服务内容" name="services">
        <div class="p-8">
          <div
            v-if="incubator.serviceContent"
            class="text-gray-700 leading-relaxed rich-text-content"
            v-html="incubator.serviceContent"
          />
          <div v-else class="text-center py-10 text-gray-500">
            暂无服务内容信息
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="政策支持" name="policies">
        <div class="p-8">
          <div
            v-if="incubator.policySupport"
            class="text-gray-700 leading-relaxed rich-text-content"
            v-html="incubator.policySupport"
          />
          <div v-else class="text-center py-10 text-gray-500">
            暂无政策支持信息
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="联系方式" name="contact">
        <div class="p-8">
          <div class="space-y-4">
            <div v-if="incubator.address" class="flex items-center space-x-3">
              <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
                <component :is="useRenderIcon(LocationFilled)" />
              </el-icon>
              <span class="text-gray-700">{{ incubator.address }}</span>
            </div>
            <div
              v-if="incubator.contactPhone"
              class="flex items-center space-x-3"
            >
              <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
                <component :is="useRenderIcon(Phone)" />
              </el-icon>
              <span class="text-gray-700">{{ incubator.contactPhone }}</span>
            </div>
            <div
              v-if="incubator.contactEmail"
              class="flex items-center space-x-3"
            >
              <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
                <component :is="useRenderIcon(Message)" />
              </el-icon>
              <span class="text-gray-700">{{ incubator.contactEmail }}</span>
            </div>
            <div v-if="incubator.website" class="flex items-center space-x-3">
              <el-icon class="text-gray-500 w-5 h-5 flex-shrink-0">
                <component :is="useRenderIcon(Link)" />
              </el-icon>
              <a
                :href="incubator.website"
                class="text-primary hover:underline"
                target="_blank"
              >
                {{ incubator.website }}
              </a>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import LocationFilled from "@iconify-icons/ep/location-filled";
import Phone from "@iconify-icons/ep/phone";
import Message from "@iconify-icons/ep/message";
import Link from "@iconify-icons/ep/link";
import type { IncubatorDetail } from "../types/types";

// Props
const props = defineProps<{
  incubator: IncubatorDetail;
  activeTab: string;
}>();

// Emits
const emit = defineEmits<{
  "tab-change": [tab: string];
}>();

const currentTab = ref(props.activeTab);

// 监听外部activeTab变化
watch(
  () => props.activeTab,
  newTab => {
    currentTab.value = newTab;
  }
);

// 方法
const handleTabChange = (tabName: string) => {
  currentTab.value = tabName;
  emit("tab-change", tabName);
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
