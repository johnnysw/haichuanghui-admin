<template>
  <div class="investor-message-list">
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
            placeholder="发送人/接收人"
            clearable
            class="!w-[200px]"
            @clear="handleSearch"
          />
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
      <div class="col-span-12 w-full min-w-0">
        <PureTableBar
          class="w-full min-w-0"
          style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
          title="留言管理"
          :columns="columns"
          @refresh="getData"
        >
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              ref="tableRef"
              adaptive
              :adaptiveConfig="{ offsetBottom: 120 }"
              align-whole="center"
              :row-key="(row: any) => row.root?.originalId"
              showOverflowTooltip
              table-layout="auto"
              :loading="loading"
              :size="size"
              :data="threads"
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
              <template #expand="{ row }">
                <div class="m-4 space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="text-sm font-medium">对话详情</div>
                    <div class="text-xs text-[var(--el-text-color-secondary)]">
                      共 {{ row.replies?.length || 0 }} 条回复
                    </div>
                  </div>

                  <div class="rounded-md bg-[var(--el-fill-color-light)] p-3">
                    <div class="flex items-center justify-between">
                      <div class="text-sm text-[var(--el-text-color-regular)]">
                        <span class="font-medium text-[var(--el-text-color-primary)]">
                          {{ formatUser(row.root?.fromName, row.root?.fromRole) }}
                        </span>
                        <span class="mx-2">→</span>
                        <span class="font-medium text-[var(--el-text-color-primary)]">
                          {{ formatUser(row.root?.toName, row.root?.toRole) }}
                        </span>
                      </div>
                      <div class="text-xs text-[var(--el-text-color-secondary)]">
                        {{ formatDateTime(row.root?.createdTime) }}
                      </div>
                    </div>
                    <div class="mt-2 whitespace-pre-wrap text-sm leading-6">
                      {{ row.root?.content || '-' }}
                    </div>
                  </div>

                  <div
                    v-if="row.replies && row.replies.length > 0"
                    class="reply-list space-y-3"
                  >
                    <div
                      v-for="r in row.replies"
                      :key="r.originalId"
                      class="rounded-md border border-[var(--el-border-color-light)] bg-white p-3"
                    >
                      <div class="flex items-center justify-between">
                        <div class="text-sm text-[var(--el-text-color-regular)]">
                          <span class="font-medium text-[var(--el-text-color-primary)]">
                            {{ formatUser(r.fromName, r.fromRole) }}
                          </span>
                          <span class="mx-2">回复</span>
                          <span class="font-medium text-[var(--el-text-color-primary)]">
                            {{ formatUser(r.toName, r.toRole) }}
                          </span>
                        </div>
                        <div class="text-xs text-[var(--el-text-color-secondary)]">
                          {{ formatDateTime(r.createdTime) }}
                        </div>
                      </div>
                      <div class="mt-2 whitespace-pre-wrap text-sm leading-6">
                        {{ r.content || '-' }}
                      </div>
                    </div>
                  </div>

                  <div
                    v-else
                    class="rounded-md border border-dashed border-[var(--el-border-color-light)] p-3 text-sm text-[var(--el-text-color-secondary)]"
                  >
                    暂无回复
                  </div>
                </div>
              </template>
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
import { useMessageTable } from './composables/useMessageTable'

defineOptions({ name: 'InvestorMessageList' })

const formRef = ref()
const tableRef = ref()
const contentRef = ref()

const {
  filterForm,
  dateRange,
  loading,
  threads,
  pagination,
  columns,
  handleSearch,
  handleReset,
  handleFilterChange,
  getData,
  handleSizeChange,
  handleCurrentChange,
  formatDateTime,
  formatUser
} = useMessageTable()
</script>

<style scoped lang="scss">
.investor-message-list {
  .box-card {
    :deep(.el-card__body) {
      padding: 16px;
    }
  }

  .reply-list {
    max-height: 360px;
    overflow: auto;
  }
}
</style>
