<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useIncubatorDetail } from "./composables/useIncubatorDetail";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessage, ElMessageBox } from "element-plus";
import ArrowLeft from "@iconify-icons/ep/arrow-left";
import Check from "@iconify-icons/ep/check";
import Close from "@iconify-icons/ep/close";
import Lock from "@iconify-icons/ep/lock";

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
  statsLoading,
  actionLoading,
  detail,
  stats,
  fetchDetail,
  fetchStats,
  updateStatus,
  getStatusInfo,
  getTypeLabel
} = useIncubatorDetail(id.value);

onMounted(() => {
  fetchDetail();
  fetchStats();
});

function goBack() {
  router.push("/incubator/list");
}

// 处理标签页切换
const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};

// 审核通过
async function handleApprove() {
  if (!detail.value) return;
  
  const result = await ElMessageBox.confirm(
    `确定要通过 "${detail.value.name}" 的审核吗？`,
    "审核通过",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  );

  if (result === "confirm") {
    const success = await updateStatus(1);
    if (success) {
      await fetchDetail();
    }
  }
}

// 审核拒绝
async function handleReject() {
  if (!detail.value) return;
  
  const { value: reason } = await ElMessageBox.prompt(
    "请输入拒绝原因:",
    "审核拒绝",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputValidator: (value) => {
        if (!value) {
          return "请输入拒绝原因";
        }
        return true;
      }
    }
  );

  if (reason) {
    const success = await updateStatus(3, reason);
    if (success) {
      await fetchDetail();
    }
  }
}

// 启用/禁用切换
async function handleToggleStatus() {
  if (!detail.value) return;
  
  const newStatus = detail.value.status === 0 ? 1 : 0;
  const actionText = newStatus === 1 ? "启用" : "禁用";
  
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
</script>

<template>
  <div>
    <!-- 面包屑导航 -->
    <div class="bg-white shadow-sm border-b px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <el-button @click="goBack" :icon="useRenderIcon(ArrowLeft)" link>
            返回列表
          </el-button>
          <div class="text-sm text-gray-500">双创载体详情</div>
        </div>
        
        <!-- 管理操作按钮 -->
        <div v-if="detail" class="flex gap-3">
          <!-- 审核操作 -->
          <el-button
            v-if="detail.status === 2"
            type="success"
            :icon="useRenderIcon(Check)"
            :loading="actionLoading"
            @click="handleApprove"
          >
            审核通过
          </el-button>
          
          <el-button
            v-if="detail.status === 2"
            type="danger"
            :icon="useRenderIcon(Close)"
            :loading="actionLoading"
            @click="handleReject"
          >
            审核拒绝
          </el-button>
          
          <!-- 启用/禁用 -->
          <el-button
            v-if="detail.status !== 2"
            :type="detail.status === 0 ? 'success' : 'warning'"
            :icon="useRenderIcon(Lock)"
            :loading="actionLoading"
            @click="handleToggleStatus"
          >
            {{ detail.status === 0 ? '启用' : '禁用' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="py-20 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
      <IncubatorBasicInfo :incubator="detail" :stats="stats" :stats-loading="statsLoading" />

      <!-- 详情标签页 -->
      <IncubatorDetailTabs
        :incubator="detail"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />
    </template>
  </div>
</template>

<style scoped>
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