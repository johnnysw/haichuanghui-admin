<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="分类名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入分类名称"
          clearable
          class="!w-[180px]"
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
          @click="resetSearch"
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
          title="资讯分类"
          :columns="columns"
          @refresh="handleSearch"
        >
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon('ep:plus')"
              @click="openDialog('add')"
            >
              新增分类
            </el-button>
          </template>
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              ref="tableRef"
              align-whole="center"
              showOverflowTooltip
              table-layout="auto"
              :loading="loading"
              :size="size"
              adaptive
              :adaptiveConfig="{ offsetBottom: 108 }"
              :data="dataList"
              :columns="dynamicColumns"
              :pagination="{ ...pagination, size }"
              :header-cell-style="{
                background: 'var(--el-fill-color-light)',
                color: 'var(--el-text-color-primary)'
              }"
              @page-size-change="onPageSizeChange"
              @page-current-change="onCurrentChange"
            >
              <template #name="{ row }">
                <div class="flex flex-col">
                  <div class="font-medium text-gray-900">{{ row.name }}</div>
                  <div
                    v-if="row.description"
                    class="text-xs text-gray-500 mt-1"
                  >
                    {{ row.description }}
                  </div>
                </div>
              </template>

              <template #parentName="{ row }">
                <span v-if="row.parentName" class="text-gray-700">{{
                  row.parentName
                }}</span>
                <span v-else class="text-gray-400">顶级分类</span>
              </template>

              <template #status="{ row }">
                <el-tag
                  :type="getStatusType(row.status)"
                  effect="plain"
                  :size="size === 'small' ? 'small' : 'default'"
                >
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>

              <template #articleCount="{ row }">
                <span class="font-medium text-blue-600">{{
                  row.articleCount
                }}</span>
              </template>

              <template #operation="{ row }">
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('ep:view')"
                  @click="openDialog('view', row)"
                >
                  查看
                </el-button>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('ep:edit')"
                  @click="openDialog('edit', row)"
                >
                  编辑
                </el-button>
                <el-dropdown class="ml-2">
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon('ep:more')"
                  />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-if="row.status === 0"
                        @click="handleEnable(row)"
                      >
                        启用
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="row.status === 1"
                        @click="handleDisable(row)"
                      >
                        禁用
                      </el-dropdown-item>
                      <el-dropdown-item divided @click="handleDelete(row.id)">
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <CategoryDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :form-data="currentRow"
      :categories="dataList"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessage, ElMessageBox } from "element-plus";

import CategoryDialog from "./components/CategoryDialog.vue";
import {
  getCategoryList,
  deleteCategory,
  toggleCategoryActive,
  updateCategoryStatus
} from "./api/index";
import type { NewsCategory, CategoryListParams } from "./types/types";

defineOptions({ name: "NewsCategory" });

const formRef = ref();
const tableRef = ref();
const contentRef = ref();

// 控制侧边抽屉的显示状态
const isShow = ref(false);

// 搜索表单
const searchForm = reactive<CategoryListParams>({
  name: ""
});

// 表格数据
const dataList = ref<NewsCategory[]>([]);
const loading = ref(false);

// 分页配置
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

// 弹窗相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const currentRow = ref<NewsCategory | null>(null);

// 表格列配置
const columns: TableColumnList = [
  {
    label: "ID",
    prop: "id",
    width: 80
  },
  {
    label: "分类名称",
    prop: "name",
    minWidth: 200,
    slot: "name"
  },
  {
    label: "父级分类",
    prop: "parentName",
    width: 150,
    slot: "parentName"
  },
  {
    label: "状态",
    prop: "status",
    width: 100,
    slot: "status"
  },
  {
    label: "文章数",
    prop: "articleCount",
    width: 100,
    slot: "articleCount"
  },
  {
    label: "操作",
    fixed: "right",
    width: 220,
    slot: "operation"
  }
];

// 获取数据
const getData = async () => {
  loading.value = true;
  try {
    const params: CategoryListParams = {
      page: pagination.currentPage.toString(),
      limit: pagination.pageSize.toString(),
      ...searchForm
    };

    const response = await getCategoryList(params);

    if (response.code === 200 && response.data) {
      dataList.value = response.data.list;
      pagination.total = response.data.total;
    } else {
      throw new Error(response.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取分类列表失败:", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1;
  getData();
};

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    name: ""
  });
  handleSearch();
};

// 分页变化
const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  getData();
};

const onCurrentChange = (page: number) => {
  pagination.currentPage = page;
  getData();
};

// 打开弹窗
const openDialog = (mode: "add" | "edit" | "view", row?: NewsCategory) => {
  dialogMode.value = mode;
  currentRow.value = row || null;
  dialogVisible.value = true;
};

// 弹窗成功回调
const handleDialogSuccess = () => {
  getData();
};

// 删除单个
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      "此操作将永久删除该分类，是否继续？",
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    await deleteCategory(id);
    ElMessage.success("删除成功");
    getData();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 切换启用状态
const handleToggleActive = async (row: NewsCategory) => {
  try {
    await toggleCategoryActive(row.id, row.isActive);
    ElMessage.success(row.isActive ? "启用成功" : "禁用成功");
    getData();
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error("操作失败");
    // 回滚状态
    row.isActive = !row.isActive;
  }
};

// 启用
const handleEnable = async (row: NewsCategory) => {
  try {
    await updateCategoryStatus(row.id, 1);
    ElMessage.success("启用成功");
    getData();
  } catch (error) {
    console.error("启用失败:", error);
    ElMessage.error("启用失败");
  }
};

// 禁用
const handleDisable = async (row: NewsCategory) => {
  try {
    await updateCategoryStatus(row.id, 0);
    ElMessage.success("禁用成功");
    getData();
  } catch (error) {
    console.error("禁用失败:", error);
    ElMessage.error("禁用失败");
  }
};

// 工具函数
const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return "danger";
    case 1:
      return "success";
    default:
      return "info";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "禁用";
    case 1:
      return "启用";
    default:
      return "未知";
  }
};

// 初始化
onMounted(() => {
  getData();
});
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
