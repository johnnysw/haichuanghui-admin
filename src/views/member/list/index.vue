<template>
  <div class="member-list">
    <!-- 搜索表单 -->
    <el-card class="box-card mb-4" shadow="never">
      <el-form
        ref="formRef"
        :model="filterForm"
        :inline="true"
        @submit.prevent="handleSearch"
      >
        <el-form-item label="搜索：" prop="search">
          <el-input
            v-model="filterForm.search"
            placeholder="用户名/昵称/邮箱/手机号"
            clearable
            class="!w-[240px]"
            @clear="handleSearch"
          />
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            class="!w-[120px]"
            @change="handleFilterChange"
          >
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch"> 查询 </el-button>
          <el-button @click="handleReset"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 会员统计区域 -->
    <el-card class="stats-card mb-4" shadow="never">
      <el-collapse v-model="statsCollapseActive">
        <el-collapse-item name="stats">
          <template #title>
            <div class="flex items-center gap-2">
              <span class="text-base font-semibold">会员统计</span>
            </div>
          </template>

          <!-- 第一行：总会员数卡片 + 统计控制区域 -->
          <div class="stats-header">
            <!-- 左侧：总会员数卡片 -->
            <div class="total-members-card">
              <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                <IconifyIconOffline :icon="User" style="color: #fff; font-size: 28px" />
              </div>
              <div class="stat-content">
                <div class="stat-label">总会员数</div>
                <div class="stat-value">{{ totalMembers.toLocaleString() }}</div>
              </div>
            </div>

            <!-- 右侧：统计控制区域 -->
            <div class="stats-controls">
              <!-- 粒度选择 -->
              <div class="control-group">
                <label class="control-label">统计粒度</label>
                <el-radio-group v-model="statsGranularity" size="default" @change="onGranularityChange">
                  <el-radio-button label="daily">每日</el-radio-button>
                  <el-radio-button label="weekly">每周</el-radio-button>
                  <el-radio-button label="monthly">每月</el-radio-button>
                </el-radio-group>
              </div>

              <!-- 日期范围选择 -->
              <div class="control-group">
                <label class="control-label">日期范围</label>
                <el-date-picker
                  v-model="statsDateRange"
                  :type="statsDatePickerType"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :shortcuts="statsShortcuts"
                  format="YYYY-MM-DD"
                  class="!w-full"
                />
              </div>

              <!-- 查询按钮 -->
              <div class="control-group">
                <el-button type="primary" :loading="statsLoading" @click="fetchMemberStats" class="w-full">
                  查询统计
                </el-button>
              </div>
            </div>
          </div>

          <!-- 第二行：数据展示表格 -->
          <div v-if="statsSeries.length > 0" class="stats-display">
            <el-table
              :data="statsSeries"
              style="width: 100%"
              max-height="300"
              :header-cell-style="{
                background: 'var(--el-fill-color-light)',
                color: 'var(--el-text-color-primary)'
              }"
            >
              <el-table-column prop="label" label="时间" width="150" />
              <el-table-column prop="count" label="新增会员数" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.count > 0 ? 'success' : 'info'">
                    {{ row.count }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div v-else-if="!statsLoading" class="text-center py-8 text-gray-400">
            暂无统计数据
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!-- 表格 -->
    <div class="w-full">
      <PureTableBar
        class="w-full min-w-0"
        title="会员列表"
        :columns="columns"
        @refresh="getMemberData"
      >
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            align-whole="center"
            row-key="id"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="memberList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <!-- 操作按钮 -->
            <template #operation="{ row, size }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(View)"
                @click="openDetail(row)"
              >
                查看
              </el-button>
              <el-button
                class="reset-margin"
                link
                :type="row.status === 0 ? 'success' : 'danger'"
                :size="size"
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 0 ? "恢复" : "禁用" }}
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>

    <!-- 详情抽屉 -->
    <MemberDrawer
      v-model:visible="drawerVisible"
      :member="currentMember"
      :loading="detailLoading"
      @toggle-status="handleToggleStatus"
      @close="closeDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { IconifyIconOffline } from "@/components/ReIcon";
import { useMemberTable } from "./composables/useMemberTable";
import { useMemberDetail } from "./composables/useMemberDetail";
import { useMemberStats } from "./composables/useMemberStats";
import { getTotalMemberCount } from "./api/index";
import MemberDrawer from "./components/MemberDrawer.vue";
import View from "@iconify-icons/ep/view";
import User from "@iconify-icons/ep/user";
import { ElMessage } from "element-plus";

defineOptions({ name: "MemberList" });

const formRef = ref();
const tableRef = ref();

// 使用表格逻辑
const {
  filterForm,
  loading,
  memberList,
  statusOptions,
  columns,
  pagination,
  handleSearch,
  handleReset,
  handleFilterChange,
  getMemberData,
  handleSizeChange,
  handleCurrentChange,
  handleToggleStatus
} = useMemberTable();

// 使用详情逻辑
const {
  drawerVisible,
  currentMember,
  loading: detailLoading,
  openDrawer,
  closeDrawer
} = useMemberDetail();

// 使用统计逻辑
const {
  granularity: statsGranularity,
  dateRange: statsDateRange,
  loading: statsLoading,
  series: statsSeries,
  datePickerType: statsDatePickerType,
  shortcuts: statsShortcuts,
  onGranularityChange,
  fetchMemberStats
} = useMemberStats();

// 总会员数
const totalMembers = ref(0);

// 获取总会员数
const fetchTotalMembers = async () => {
  try {
    const res = await getTotalMemberCount();
    if (res.code === 200) {
      totalMembers.value = res.data.total || 0;
    }
  } catch (error) {
    console.error("获取总会员数失败:", error);
    ElMessage.error("获取总会员数失败");
  }
};

// 折叠面板控制（默认展开）
const statsCollapseActive = ref(["stats"]);

// 打开详情
const openDetail = (row) => {
  openDrawer(row.id);
};

// 页面加载时获取统计数据
onMounted(() => {
  fetchTotalMembers();
  fetchMemberStats();
});
</script>

<style scoped lang="scss">
.member-list {
  .box-card {
    :deep(.el-card__body) {
      padding: 16px;
    }
  }

  .stats-card {
    :deep(.el-card__body) {
      padding: 20px;
    }

    // 移除折叠面板的边框
    :deep(.el-collapse) {
      border-top: none;
      border-bottom: none;
    }

    :deep(.el-collapse-item__header) {
      border-bottom: none;
      background: transparent;
      padding: 16px 0;
      height: auto;
      line-height: normal;
      font-size: 16px;
      font-weight: 600;

      .el-collapse-item__arrow {
        font-size: 16px;
        margin-right: 12px;
      }
    }

    :deep(.el-collapse-item__wrap) {
      border-bottom: none;
    }

    :deep(.el-collapse-item__content) {
      padding-bottom: 0;
    }

    // 第一行：总会员数卡片 + 统计控制区域
    .stats-header {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 24px;
      margin-bottom: 24px;

      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }
    }

    // 总会员数卡片
    .total-members-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      border: 1px solid rgba(102, 126, 234, 0.2);
      border-radius: 12px;

      .stat-icon {
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
        flex-shrink: 0;
      }

      .stat-content {
        flex: 1;
        min-width: 0;

        .stat-label {
          font-size: 13px;
          color: var(--el-text-color-secondary);
          margin-bottom: 6px;
          font-weight: 500;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--el-text-color-primary);
          line-height: 1.2;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }
    }

    // 统计控制区域
    .stats-controls {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      padding: 20px;
      background: var(--el-fill-color-lighter);
      border-radius: 12px;
      align-items: end;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }

      .control-group {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .control-label {
          font-size: 13px;
          color: var(--el-text-color-secondary);
          font-weight: 500;
        }
      }
    }

    // 第二行：数据展示表格
    .stats-display {
      border-top: 1px solid var(--el-border-color-lighter);
      padding-top: 16px;
    }
  }
}
</style>

