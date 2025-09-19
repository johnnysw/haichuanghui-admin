<template>
  <div>
    <!-- 面包屑导航 -->
    <div class="bg-white shadow-sm border-b px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <el-button @click="goBack" :icon="useRenderIcon('ep:arrow-left')" link>
            返回列表
          </el-button>
          <div class="text-sm text-gray-500">离岸双创中心详情</div>
        </div>
        
        <!-- 管理操作按钮 -->
        <div v-if="detail" class="flex gap-3">
          <!-- 审核操作 -->
          <el-button
            v-if="detail.status === 2"
            type="success"
            :icon="useRenderIcon('ep:check')"
            :loading="actionLoading"
            @click="handleApprove"
          >
            审核通过
          </el-button>
          
          <el-button
            v-if="detail.status === 2"
            type="danger"
            :icon="useRenderIcon('ep:close')"
            :loading="actionLoading"
            @click="handleReject"
          >
            审核拒绝
          </el-button>
          
          <!-- 启用/禁用 -->
          <el-button
            v-if="detail.status !== 2"
            :type="detail.status === 0 ? 'success' : 'warning'"
            :icon="useRenderIcon('ep:lock')"
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
      <OffshoreBasicInfo :offshore="detail" :stats="stats" :stats-loading="statsLoading" />

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
  statsLoading,
  actionLoading,
  detail,
  stats,
  fetchDetail,
  fetchStats,
  handleApprove,
  handleReject,
  handleToggleStatus
} = useOffshoreDetail();

// 当前标签页
const activeTab = ref("introduction");

// 获取离岸中心ID
const getOffshoreId = (): number => {
  const id = route.params.id;
  return Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
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
  console.log("当前路由参数:", route.params);
  console.log("解析得到的ID:", id);
  
  if (!id || isNaN(id)) {
    console.error("无效的离岸中心ID:", id);
    ElMessage.error("离岸中心ID无效");
    return;
  }
  
  console.log("开始获取离岸中心数据, ID:", id);
  
  // 并行获取详情和统计数据
  await Promise.all([
    fetchDetail(id),
    fetchStats(id)
  ]);
};

// 组件挂载时获取数据
onMounted(() => {
  initData();
});

// 监听路由变化
const stopWatcher = router.beforeEach((to) => {
  if (to.name === "OffshoreDetail" && to.params.id !== route.params.id) {
    initData();
  }
});

// 组件卸载时清理监听器
onUnmounted(() => {
  stopWatcher();
});
</script>

<style scoped lang="scss">
// 页面样式
</style>