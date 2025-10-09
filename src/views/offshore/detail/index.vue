<template>
  <div class="offshore-detail-page">
    <!-- 页面头部 -->
    <div class="page-header mb-6">
      <el-page-header @back="goBack">
        <template #content>
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <span class="text-lg font-medium">离岸双创中心详情</span>
            </div>
          </div>
        </template>
        <template #extra>
          <!-- 管理操作区 - 放在最右侧 -->
          <div v-if="!loading && detail" class="flex items-center space-x-3">
            <el-button
              v-if="detail.status !== 3"
              :icon="useRenderIcon('ep:bottom')"
              :loading="actionLoading"
              style="background: #e8a859; color: white; border: none"
              @click="handleToggleOnline"
            >
              {{ detail.status === 1 ? "下线" : "上线" }}
            </el-button>

            <el-button
              :icon="
                useRenderIcon(
                  detail.status === 3 ? 'ep:circle-check' : 'ep:circle-close'
                )
              "
              :loading="actionLoading"
              :style="{
                background: detail.status === 3 ? '#67C23A' : '#F56C6C',
                color: 'white',
                border: 'none'
              }"
              @click="handleToggleDisable"
            >
              {{ detail.status === 3 ? "解除禁用" : "禁用" }}
            </el-button>
          </div>
        </template>
      </el-page-header>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="py-20 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
      />
      <p class="mt-4 text-gray-500">正在加载离岸中心详情...</p>
    </div>

    <!-- 加载失败 -->
    <div v-else-if="!loading && !detail" class="py-20 text-center">
      <div class="text-red-500 mb-4">
        <el-icon size="48">
          <component :is="useRenderIcon('ep:warning')" />
        </el-icon>
      </div>
      <p class="text-xl text-gray-700 mb-2">中心不存在</p>
      <p class="text-gray-500 mb-8">请检查中心ID是否正确</p>
    </div>

    <template v-else-if="detail">
      <!-- 基本信息卡片 -->
      <OffshoreBasicInfo :offshore="detail" :stats="stats" />

      <!-- 详情标签页 -->
      <OffshoreDetailTabs
        :offshore="detail"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessage } from "element-plus";

import OffshoreBasicInfo from "./components/OffshoreBasicInfo.vue";
import OffshoreDetailTabs from "./components/OffshoreDetailTabs.vue";
import { useOffshoreDetail } from "./composables/useOffshoreDetail";

defineOptions({ name: "OffshoreDetail" });

const route = useRoute();
const router = useRouter();

// 使用组合式函数
const {
  loading,
  actionLoading,
  detail,
  stats,
  fetchDetail,
  handleToggleOnline,
  handleToggleDisable
} = useOffshoreDetail();

// 当前标签页
const activeTab = ref("introduction");

// 获取离岸中心ID
const getOffshoreId = (): number | null => {
  const id = route.params.id;
  const parsed = Array.isArray(id)
    ? parseInt(id[0], 10)
    : parseInt(id as string, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

// 返回列表
const goBack = () => {
  router.push("/offshore/list");
};

// 标签页切换
const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};

// 初始化数据
const initData = async () => {
  const id = getOffshoreId();
  if (!id) {
    ElMessage.error("离岸中心ID无效");
    return;
  }
  await fetchDetail(id);
};

// 组件挂载时获取数据
onMounted(() => {
  initData();
});

// 监听路由变化
const stopWatcher = router.beforeEach((to, from, next) => {
  if (to.name === "OffshoreDetail" && to.params.id !== route.params.id) {
    const id = Array.isArray(to.params.id)
      ? parseInt(to.params.id[0], 10)
      : parseInt(to.params.id as string, 10);
    if (!Number.isNaN(id)) {
      fetchDetail(id);
    }
  }
  next();
});

// 组件卸载时清理监听器
onUnmounted(() => {
  stopWatcher();
});
</script>

<style lang="scss" scoped>
.offshore-detail-page {
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
