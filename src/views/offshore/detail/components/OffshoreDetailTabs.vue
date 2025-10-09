<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <el-tabs
      v-model="currentTab"
      class="offshore-tabs"
      stretch
      @tab-change="handleTabChange"
    >
      <el-tab-pane label="中心介绍" name="introduction">
        <div class="p-8">
          <div
            v-if="offshore.introduction"
            class="text-gray-700 leading-relaxed rich-text-content"
            v-html="richHtml(offshore.introduction)"
          />
          <div v-else class="text-center py-10 text-gray-500">
            暂无中心介绍信息
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="环境展示" name="environment">
        <div class="p-8">
          <div
            v-if="offshore.environment"
            class="text-gray-700 leading-relaxed rich-text-content"
            v-html="richHtml(offshore.environment)"
          />
          <div v-else class="text-center py-10 text-gray-500">
            暂无环境展示信息
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="成功案例" name="success">
        <div class="p-8">
          <div
            v-if="offshore.successCasesDetail"
            class="text-gray-700 leading-relaxed rich-text-content"
            v-html="richHtml(offshore.successCasesDetail)"
          />
          <div v-else class="text-center py-10 text-gray-500">
            暂无成功案例信息
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="国际化服务" name="international">
        <div class="p-8">
          <div
            v-if="offshore.internationalServices"
            class="text-gray-700 leading-relaxed rich-text-content"
            v-html="richHtml(offshore.internationalServices)"
          />
          <div v-else class="text-center py-10 text-gray-500">
            暂无国际化服务信息
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="资源优势" name="resources">
        <div class="p-8">
          <div
            v-if="offshore.resourceAdvantages"
            class="text-gray-700 leading-relaxed rich-text-content"
            v-html="richHtml(offshore.resourceAdvantages)"
          />
          <div v-else class="text-center py-10 text-gray-500">
            暂无资源优势信息
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="联系方式" name="contact">
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 联系人信息卡片 -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-4">
                联系人信息
              </h3>
              <div class="space-y-3">
                <div v-if="offshore.contactPerson" class="flex items-start">
                  <span class="text-gray-600 w-28 flex-shrink-0">联系人：</span>
                  <span class="text-gray-800">{{ offshore.contactPerson }}</span>
                </div>
                <div v-if="offshore.contactPhone" class="flex items-start">
                  <span class="text-gray-600 w-28 flex-shrink-0"
                    >联系电话：</span
                  >
                  <span class="text-gray-800">{{ offshore.contactPhone }}</span>
                </div>
                <div v-if="offshore.contactEmail" class="flex items-start">
                  <span class="text-gray-600 w-28 flex-shrink-0"
                    >电子邮箱：</span
                  >
                  <span class="text-gray-800">{{ offshore.contactEmail }}</span>
                </div>
              </div>
            </div>

            <!-- 中心信息卡片 -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-4">
                中心信息
              </h3>
              <div class="space-y-3">
                <div v-if="offshore.address" class="flex items-start">
                  <span class="text-gray-600 w-28 flex-shrink-0"
                    >详细地址：</span
                  >
                  <span class="text-gray-800">{{ offshore.address }}</span>
                </div>
                <div v-if="offshore.website" class="flex items-start">
                  <span class="text-gray-600 w-28 flex-shrink-0"
                    >官方网站：</span
                  >
                  <a
                    :href="offshore.website"
                    class="text-primary hover:underline break-all"
                    target="_blank"
                  >
                    {{ offshore.website }}
                  </a>
                </div>
                <div
                  v-if="offshore.country || offshore.city"
                  class="flex items-start"
                >
                  <span class="text-gray-600 w-28 flex-shrink-0"
                    >所在区域：</span
                  >
                  <span class="text-gray-800">{{
                    [offshore.country, offshore.city].filter(Boolean).join(" · ")
                  }}</span>
                </div>
                <div v-if="offshore.establishedYear" class="flex items-start">
                  <span class="text-gray-600 w-28 flex-shrink-0"
                    >成立年份：</span
                  >
                  <span class="text-gray-800">{{
                    offshore.establishedYear
                  }}</span>
                </div>
                <div v-if="offshore.area" class="flex items-start">
                  <span class="text-gray-600 w-28 flex-shrink-0"
                    >中心面积：</span
                  >
                  <span class="text-gray-800">{{ offshore.area }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { OffshoreCenterDetail } from "../types/types";

defineOptions({ name: "OffshoreDetailTabs" });

const props = withDefaults(
  defineProps<{
    offshore: OffshoreCenterDetail;
    activeTab?: string;
  }>(),
  {
    activeTab: "introduction"
  }
);

const emit = defineEmits<{
  "tab-change": [tab: string];
}>();

const currentTab = ref(props.activeTab);

watch(
  () => props.activeTab,
  value => {
    currentTab.value = value;
  }
);

const handleTabChange = (tab: string) => {
  currentTab.value = tab;
  emit("tab-change", tab);
};

// 富文本处理函数
function richHtml(value?: string) {
  if (!value) return "";
  // 如果已经包含 HTML 标签，直接返回
  if (/<[a-z][\s\S]*>/i.test(value)) {
    return value;
  }
  // 否则将换行符转换为 <br />
  return value.replace(/\n/g, "<br />");
}
</script>

<style scoped lang="scss">
.offshore-tabs {
  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    padding: 0 32px;
    font-size: 15px;
  }
}

.rich-text-content {
  color: #374151;
  line-height: 1.75;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    margin: 1.5em 0 0.75em;
    font-weight: 600;
    color: #1f2937;
  }

  :deep(h1) {
    font-size: 1.875em;
  }

  :deep(h2) {
    font-size: 1.5em;
  }

  :deep(h3) {
    font-size: 1.25em;
  }

  :deep(p) {
    margin: 0.75em 0;
  }

  :deep(ul),
  :deep(ol) {
    margin: 1em 0;
    padding-left: 1.5em;
  }

  :deep(li) {
    margin: 0.5em 0;
  }

  :deep(img) {
    max-width: 100%;
    border-radius: 8px;
    margin: 1em 0;
  }

  :deep(blockquote) {
    border-left: 4px solid #e5e7eb;
    padding-left: 1em;
    margin: 1em 0;
    color: #6b7280;
  }

  :deep(code) {
    background: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.875em;
  }

  :deep(pre) {
    background: #1f2937;
    color: #f9fafb;
    padding: 1em;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1em 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
  }

  :deep(th),
  :deep(td) {
    border: 1px solid #e5e7eb;
    padding: 0.5em 1em;
    text-align: left;
  }

  :deep(th) {
    background: #f9fafb;
    font-weight: 600;
  }
}
</style>
