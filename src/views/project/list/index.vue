<template>
  <div class="main">
    <!-- 搜索表单 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="项目名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入项目名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="企业名称：" prop="companyName">
        <el-input
          v-model="searchForm.companyName"
          placeholder="请输入企业名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="行业分类：" prop="industryId">
        <el-select
          v-model="searchForm.industryId"
          placeholder="请选择行业"
          clearable
          class="!w-[140px]"
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
      <el-form-item label="地区：" prop="regionId">
        <el-select
          v-model="searchForm.regionId"
          placeholder="请选择地区"
          clearable
          class="!w-[140px]"
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
      <el-form-item label="融资阶段：" prop="fundingStageId">
        <el-select
          v-model="searchForm.fundingStageId"
          placeholder="请选择阶段"
          clearable
          class="!w-[140px]"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="option in fundingStageOptions"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          clearable
          class="!w-[120px]"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="推荐状态：" prop="isRecommended">
        <el-select
          v-model="searchForm.isRecommended"
          placeholder="请选择"
          clearable
          class="!w-[120px]"
        >
          <el-option
            v-for="option in recommendationOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button
          :icon="useRenderIcon('ri:refresh-line')"
          @click="resetForm(formRef)"
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
          title="创业项目列表"
          :columns="columns"
          @refresh="getProjectData"
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
              :data="dataList"
              :columns="dynamicColumns"
              :pagination="pagination"
              :paginationSmall="size === 'small'"
              :header-cell-style="{
                background: 'var(--el-fill-color-light)',
                color: 'var(--el-text-color-primary)'
              }"
              @selection-change="handleSelectionChange"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
            >
              <!-- 操作按钮 -->
              <template #operation="{ row }">
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

                <!-- 推荐按钮 -->
                <el-button
                  class="reset-margin"
                  link
                  :type="row.isRecommended ? 'warning' : 'info'"
                  :size="size"
                  :icon="
                    useRenderIcon(
                      row.isRecommended ? 'ep:star-filled' : 'ep:star'
                    )
                  "
                  @click="handleToggleRecommend(row)"
                >
                  {{ row.isRecommended ? "取消推荐" : "推荐" }}
                </el-button>

                <el-popconfirm
                  :title="`确认删除项目【${row.name}】吗？`"
                  @confirm="handleDelete(row)"
                >
                  <template #reference>
                    <el-button
                      class="reset-margin"
                      link
                      type="danger"
                      :size="size"
                      :icon="useRenderIcon(Delete)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
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
import { useRouter } from "vue-router";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useProjectTable } from "./composables/useProjectTable";

import View from "@iconify-icons/ep/view";
import Delete from "@iconify-icons/ep/delete";

defineOptions({ name: "ProjectList" });

const router = useRouter();
const formRef = ref();
const tableRef = ref();
const contentRef = ref();

const {
  form,
  formRef: tableFormRef,
  isShow,
  loading,
  columns,
  dataList,
  pagination,
  selectedNum,
  industryOptions,
  regionOptions,
  fundingStageOptions,
  statusOptions,
  recommendationOptions,
  onSearch,
  resetForm,
  openDetail,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleToggleRecommend,
  rowStyle,
  getProjectData
} = useProjectTable();

// 将 form 映射为 searchForm 以兼容模板
const searchForm = form;
</script>

<style lang="scss" scoped>
.search-form {
  .el-form-item {
    margin-bottom: 12px;
  }
}
</style>
