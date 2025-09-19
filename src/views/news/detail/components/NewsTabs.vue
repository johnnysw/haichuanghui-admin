<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <!-- 标签页导航 -->
    <div class="border-b border-gray-200">
      <nav class="flex overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="handleTabClick(tab.key)"
          :class="[
            'px-6 py-4 whitespace-nowrap font-medium transition-colors',
            activeTab === tab.key
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-primary'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- 标签页内容 -->
    <div class="p-8">
      <slot :activeTab="currentTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Tab {
  key: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  defaultTab?: string;
}

interface Emits {
  (e: "tab-change", tabKey: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  defaultTab: ""
});

const emit = defineEmits<Emits>();

const activeTab = ref(props.defaultTab || props.tabs[0]?.key || "");
const currentTab = ref(activeTab.value); // Expose currentTab for slot

watch(
  () => props.defaultTab,
  newTab => {
    if (newTab) {
      activeTab.value = newTab;
      currentTab.value = newTab;
    }
  },
  { immediate: true }
);

const handleTabClick = (tabKey: string) => {
  activeTab.value = tabKey;
  currentTab.value = tabKey;
  emit("tab-change", tabKey);
};
</script>

<style scoped lang="scss">
nav button:focus {
  outline: none;
}

/* 标签页导航滚动条样式 */
nav::-webkit-scrollbar {
  height: 4px;
}

nav::-webkit-scrollbar-track {
  background: #f1f5f9;
}

nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>