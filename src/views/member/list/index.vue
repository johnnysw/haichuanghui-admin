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
              <el-tag size="small" type="info">{{ statsGranularity === 'daily' ? '每日' : statsGranularity === 'weekly' ? '每周' : '每月' }}</el-tag>
            </div>
          </template>

          <div class="stats-controls mb-4">
            <div class="flex items-center gap-4 flex-wrap">
              <!-- 粒度选择 -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">统计粒度:</span>
                <el-radio-group v-model="statsGranularity" size="default" @change="onGranularityChange">
                  <el-radio-button label="daily">每日</el-radio-button>
                  <el-radio-button label="weekly">每周</el-radio-button>
                  <el-radio-button label="monthly">每月</el-radio-button>
                </el-radio-group>
              </div>

              <!-- 日期范围选择 -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">日期范围:</span>
                <el-date-picker
                  v-model="statsDateRange"
                  :type="statsDatePickerType"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :shortcuts="statsShortcuts"
                  format="YYYY-MM-DD"
                  class="!w-[260px]"
                />
              </div>

              <!-- 查询按钮 -->
              <el-button type="primary" :loading="statsLoading" @click="fetchMemberStats">
                查询统计
              </el-button>
            </div>
          </div>

          <!-- 统计卡片 -->
          <div class="stats-summary">
            <div class="stat-item">
              <div class="stat-icon" style="background: #409eff20">
                <IconifyIconOffline :icon="User" style="color: #409eff" />
              </div>
              <div class="stat-content">
                <div class="stat-label">总新增会员</div>
                <div class="stat-value">{{ statsSummary.total.toLocaleString() }}</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon" style="background: #67c23a20">
                <IconifyIconOffline :icon="DataAnalysis" style="color: #67c23a" />
              </div>
              <div class="stat-content">
                <div class="stat-label">单期平均</div>
                <div class="stat-value">{{ statsSummary.avg.toLocaleString() }}</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon" style="background: #f56c6c20">
                <IconifyIconOffline :icon="Trophy" style="color: #f56c6c" />
              </div>
              <div class="stat-content">
                <div class="stat-label">峰值期</div>
                <div class="stat-value">{{ statsSummary.peak.count.toLocaleString() }}</div>
                <div class="stat-extra">{{ statsSummary.peak.label || statsSummary.peak.period }}</div>
              </div>
            </div>
          </div>

          <!-- 数据展示 -->
          <div v-if="statsSeries.length > 0" class="stats-display mt-4">
            <el-table
              :data="statsSeries"
              style="width: 100%"
              max-height="400"
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
import MemberDrawer from "./components/MemberDrawer.vue";
import View from "@iconify-icons/ep/view";
import User from "@iconify-icons/ep/user";
import DataAnalysis from "@iconify-icons/ep/data-analysis";
import Trophy from "@iconify-icons/ep/trophy";

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
  summary: statsSummary,
  datePickerType: statsDatePickerType,
  shortcuts: statsShortcuts,
  onGranularityChange,
  fetchMemberStats
} = useMemberStats();

// 折叠面板控制（默认展开）
const statsCollapseActive = ref(["stats"]);

// 打开详情
const openDetail = (row) => {
  openDrawer(row.id);
};

// 页面加载时获取统计数据
onMounted(() => {
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

    .stats-controls {
      .flex {
        align-items: center;
      }
    }

    .stats-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 16px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: var(--el-fill-color-lighter);
        border-radius: 8px;

        .stat-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 24px;
        }

        .stat-content {
          flex: 1;

          .stat-label {
            font-size: 13px;
            color: var(--el-text-color-secondary);
            margin-bottom: 4px;
          }

          .stat-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }

          .stat-extra {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin-top: 2px;
          }
        }
      }
    }

    .stats-display {
      border-top: 1px solid var(--el-border-color-lighter);
      padding-top: 16px;
    }
  }
}
</style>

