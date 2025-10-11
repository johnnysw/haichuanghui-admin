<script setup lang="ts">
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import CarouselForm from "./components/CarouselForm.vue";
import { useCarousel } from "./composables/useCarousel";

defineOptions({
  name: "SystemCarousel"
});

const formRef = ref();
const tableRef = ref();

const {
  // 表单相关
  formVisible,
  formLoading,
  formModel,
  rules,
  dialogTitle,
  imagePreview,
  uploading,
  // 列表相关
  tableData,
  tableLoading,
  total,
  query,
  columns,
  pagination,
  // 方法
  handleSearch,
  handleReset,
  handlePageChange,
  handleSizeChange,
  handleAdd,
  handleEdit,
  handleDelete,
  handleStatusChange,
  handleUploadImage,
  handleRemoveImage,
  handleClose,
  handleSubmit,
  resetSearchForm,
} = useCarousel();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="query"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="标题：" prop="title">
        <el-input
          v-model="query.title"
          placeholder="请输入标题"
          clearable
          class="!w-[180px]"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="query.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="tableLoading"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetSearchForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="轮播图管理"
      :columns="columns"
      @refresh="handleSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="handleAdd"
        >
          新增轮播图
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="tableLoading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="tableData"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handlePageChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="handleEdit(row)"
            >
              修改
            </el-button>
            <el-popconfirm
              :title="`是否确认删除轮播图「${row.title}」?`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
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

    <!-- 表单弹窗 -->
    <CarouselForm
      v-model:visible="formVisible"
      :title="dialogTitle"
      :form-model="formModel"
      :rules="rules"
      :loading="formLoading"
      :uploading="uploading"
      :image-preview="imagePreview"
      @submit="handleSubmit"
      @close="handleClose"
      @upload="handleUploadImage"
      @remove="handleRemoveImage"
    />
  </div>
</template>

<style scoped lang="scss">
.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
