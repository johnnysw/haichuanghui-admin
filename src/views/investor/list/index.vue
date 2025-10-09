<template>
  <div class="investor-list">
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
            placeholder="姓名"
            clearable
            class="!w-[200px]"
            @clear="handleSearch"
          />
        </el-form-item>

        <el-form-item label="地区：" prop="region">
          <el-select
            v-model="filterForm.region"
            placeholder="请选择地区"
            clearable
            class="!w-[140px]"
            @change="handleFilterChange"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="option in regionOptions"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="关注行业：" prop="field">
          <el-select
            v-model="filterForm.field"
            placeholder="请选择行业"
            clearable
            class="!w-[140px]"
            @change="handleFilterChange"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="option in industryOptions"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="偏好阶段：" prop="stage">
          <el-select
            v-model="filterForm.stage"
            placeholder="请选择阶段"
            clearable
            class="!w-[120px]"
            @change="handleFilterChange"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="option in stageOptions"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
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

    <div
      ref="contentRef"
      :class="['grid', 'grid-cols-1', 'md:grid-cols-12', 'gap-2', 'w-full']"
    >
      <div
        :class="[isShow ? 'md:col-span-7 col-span-12' : 'col-span-12']"
        class="w-full min-w-0"
      >
        <!-- 表格工具栏 -->
        <PureTableBar
          class="w-full min-w-0"
          style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
          title="投资人列表"
          :columns="columns"
          @refresh="getInvestorData"
        >
          <!-- 表格主体 -->
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
              :data="investorList"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useInvestorTable } from "./composables/useInvestorTable";

import View from "@iconify-icons/ep/view";

defineOptions({ name: "InvestorList" });

const formRef = ref();
const tableRef = ref();
const contentRef = ref();

const {
  filterForm,
  loading,
  investorList,
  regionOptions,
  industryOptions,
  stageOptions,
  statusOptions,
  columns,
  pagination,
  isShow,
  handleSearch,
  handleReset,
  handleFilterChange,
  getInvestorData,
  handleSizeChange,
  handleCurrentChange,
  openDetail,
  handleToggleStatus
} = useInvestorTable();
</script>

<style scoped lang="scss">
.investor-list {
  .box-card {
    :deep(.el-card__body) {
      padding: 16px;
    }
  }
}
</style>
