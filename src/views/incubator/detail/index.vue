<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useIncubatorDetail } from "./composables/useIncubatorDetail";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessageBox } from "element-plus";
import ArrowLeft from "@iconify-icons/ep/arrow-left";

// 导入自定义组件
import IncubatorBasicInfo from "./components/IncubatorBasicInfo.vue";
import IncubatorDetailTabs from "./components/IncubatorDetailTabs.vue";

defineOptions({ name: "IncubatorDetail" });

const route = useRoute();
const router = useRouter();
const id = ref<number>(Number(route.params.id) || 0);
const activeTab = ref("introduction");

const {
  loading,
  actionLoading,
  detail,
  fetchDetail,
  updateStatus,
  getStatusInfo
} = useIncubatorDetail(id.value);

onMounted(() => {
  fetchDetail();
});

function goBack() {
  router.push("/incubator/list");
}

// 处理标签页切换
const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};

// 上线/下线切换
async function handleToggleOnline() {
  if (!detail.value) return;

  const isOnline = detail.value.status === 1;
  const newStatus = isOnline ? 2 : 1;
  const actionText = isOnline ? "下线" : "上线";

  const result = await ElMessageBox.confirm(
    `确定要${actionText} "${detail.value.name}" 吗？`,
    `${actionText}载体`,
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  );

  if (result === "confirm") {
    const success = await updateStatus(newStatus);
    if (success) {
      await fetchDetail();
    }
  }
}

// 禁用/解除禁用
async function handleToggleDisable() {
  if (!detail.value) return;

  const isDisabled = detail.value.status === 3;
  const newStatus = isDisabled ? 1 : 3;
  const actionText = isDisabled ? "解除禁用" : "禁用";

  const result = await ElMessageBox.confirm(
    `确定要${actionText} "${detail.value.name}" 吗？`,
    `${actionText}载体`,
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: isDisabled ? "info" : "warning"
    }
  );

  if (result === "confirm") {
    const success = await updateStatus(newStatus);
    if (success) {
      await fetchDetail();
    }
  }
}
</script>

<template>
  <div class="incubator-detail-page">
    <!-- 页面头部 -->
    <div class="page-header mb-6">
      <el-page-header @back="goBack">
        <template #content>
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <span class="text-lg font-medium">双创载体详情</span>
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
      <p class="mt-4 text-gray-500">正在加载双创载体详情...</p>
    </div>

    <!-- 加载失败 -->
    <div v-else-if="!loading && !detail" class="py-20 text-center">
      <div class="text-red-500 mb-4">
        <el-icon size="48">
          <component :is="useRenderIcon('ep:warning')" />
        </el-icon>
      </div>
      <p class="text-xl text-gray-700 mb-2">载体不存在</p>
      <p class="text-gray-500 mb-8">请检查载体ID是否正确</p>
    </div>

    <template v-else-if="detail">
      <!-- 基本信息卡片 -->
      <IncubatorBasicInfo :incubator="detail" />

      <!-- 详情标签页 -->
      <IncubatorDetailTabs
        :incubator="detail"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.incubator-detail-page {
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
