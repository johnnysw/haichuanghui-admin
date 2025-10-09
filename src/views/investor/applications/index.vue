<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useApplicationTable } from "./composables/useApplicationTable";
import { useApplicationActions } from "./composables/useApplicationActions";
import type { InvestorApplication } from "./types/types";

import View from "@iconify-icons/ep/view";

defineOptions({
  name: "InvestorApplications"
});

const router = useRouter();

// 表格相关
const formRef = ref();
const tableRef = ref();
const contentRef = ref();

// 使用 composables
const {
  loading,
  isShow,
  applicationList,
  filterForm,
  pagination,
  stats,
  statusOptions,
  columns,
  getStatusType,
  getStatusText,
  handleSearch,
  handleReset,
  handleRefresh,
  handleSizeChange,
  handleCurrentChange
} = useApplicationTable();

// 使用操作 composable
const { handleDelete } = useApplicationActions(handleRefresh);

// 查看详情
const handleViewDetail = (row: InvestorApplication) => {
  router.push({
    path: `/investor/applications/detail/${row.id}`
  });
};

// 编辑
const handleEdit = (row: InvestorApplication) => {
  router.push({ path: `/investor/applications/detail/${row.id}` });
};
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="filterForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="搜索：" prop="search">
        <el-input
          v-model="filterForm.search"
          placeholder="请输入申请人姓名/机构名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="filterForm.status"
          placeholder="请选择状态"
          clearable
          class="!w-[150px]"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="申请时间：" prop="dateRange">
        <el-date-picker
          v-model="filterForm.dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[300px]"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button
          :icon="useRenderIcon('ri:refresh-line')"
          @click="handleReset(formRef)"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <div
      ref="contentRef"
      :class="['grid', 'grid-cols-1', 'md:grid-cols-12', 'gap-2', 'w-full']"
    >
      <div
        :class="[isShow ? 'md:col-span-7 col-span-12' : 'col-span-12']"
        class="w-full min-w-0"
      >
        <PureTableBar
          class="w-full min-w-0"
          style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
          title="投资人申请列表"
          :columns="columns"
          @refresh="handleRefresh"
        >
          <template #buttons>
            <el-space wrap>
              <el-tag type="info" effect="light"
                >总数：{{ stats.total }}</el-tag
              >
              <el-tag type="warning" effect="light"
                >待审：{{ stats.pending }}</el-tag
              >
              <el-tag type="success" effect="light"
                >通过：{{ stats.approved }}</el-tag
              >
              <el-tag type="danger" effect="light"
                >拒绝：{{ stats.rejected }}</el-tag
              >
              <el-tag type="primary" effect="light"
                >今日：{{ stats.todaySubmitted }}</el-tag
              >
            </el-space>
          </template>

          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              ref="tableRef"
              adaptive
              :adaptiveConfig="{ offsetBottom: 108 }"
              align-whole="center"
              table-layout="auto"
              :loading="loading"
              :size="size as any"
              :data="applicationList"
              :columns="dynamicColumns"
              :pagination="pagination"
              :paginationSmall="size === 'small' ? true : false"
              :header-cell-style="{
                background: 'var(--el-fill-color-light)',
                color: 'var(--el-text-color-primary)'
              }"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
            >
              <template #status="{ row }">
                <el-tag
                  :type="getStatusType(row.status)"
                  effect="light"
                  size="small"
                >
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>

              <template #operation="{ row }">
                <div class="flex items-center gap-2 justify-center">
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size as any"
                    :icon="useRenderIcon(View)"
                    @click="handleViewDetail(row)"
                  >
                    查看
                  </el-button>
                  <el-button
                    class="reset-margin"
                    link
                    type="warning"
                    :size="size as any"
                    @click="handleEdit(row)"
                  >
                    编辑
                  </el-button>
                  <el-popconfirm
                    :title="`确认删除该申请吗？`"
                    @confirm="handleDelete(row)"
                  >
                    <template #reference>
                      <el-button
                        class="reset-margin"
                        link
                        type="danger"
                        :size="size as any"
                        >删除</el-button
                      >
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  .el-form-item {
    margin-bottom: 12px;
  }
}

// 增加表格表头高度
:deep(.el-table__header-wrapper) {
  .el-table__header {
    th {
      height: 60px !important; // 默认约40px，增加到60px
      padding: 12px 0 !important;
    }
  }
}

// 如果需要调整表格行高度，可以添加：
:deep(.el-table__body-wrapper) {
  .el-table__body {
    tr {
      height: 50px; // 调整数据行高度
    }
  }
}
</style>
