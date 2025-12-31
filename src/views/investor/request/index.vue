<template>
  <div class="investor-request-list">
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
            placeholder="发送人/投资人姓名"
            clearable
            class="!w-[200px]"
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

        <el-form-item label="提交日期：" prop="dateRange">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="!w-[240px]"
            @change="handleFilterChange"
          />
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
          title="投资人请求列表"
          :columns="columns"
          @refresh="getRequestData"
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
              :data="requestList"
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
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PureTableBar } from '@/components/RePureTableBar'
import { useRequestTable } from './composables/useRequestTable'

defineOptions({ name: 'InvestorRequestList' })

const formRef = ref()
const tableRef = ref()
const contentRef = ref()

const {
  filterForm,
  dateRange,
  loading,
  requestList,
  statusOptions,
  columns,
  pagination,
  isShow,
  handleSearch,
  handleReset,
  handleFilterChange,
  getRequestData,
  handleSizeChange,
  handleCurrentChange,
  downloadBP,
  handleStatusToggle
} = useRequestTable()
</script>

<style scoped lang="scss">
.investor-request-list {
  .box-card {
    :deep(.el-card__body) {
      padding: 16px;
    }
  }
}
</style>
