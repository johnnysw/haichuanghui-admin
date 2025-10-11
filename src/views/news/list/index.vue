<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="标题：" prop="title">
        <el-input
          v-model="searchForm.title"
          placeholder="请输入资讯标题"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="分类：" prop="categoryId">
        <el-select
          v-model="searchForm.categoryId"
          placeholder="请选择分类"
          clearable
          class="!w-[150px]"
        >
          <el-option label="全部分类" value="" />
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
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
          <el-option label="全部状态" value="" />
          <el-option label="草稿" :value="0" />
          <el-option label="已发布" :value="1" />
          <el-option label="已下线" :value="2" />
          <el-option label="审核中" :value="3" />
          <el-option label="已拒绝" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="推荐：" prop="isRecommended">
        <el-select
          v-model="searchForm.isRecommended"
          placeholder="推荐状态"
          clearable
          class="!w-[120px]"
        >
          <el-option label="全部" value="" />
          <el-option label="推荐" :value="true" />
          <el-option label="非推荐" :value="false" />
        </el-select>
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
          title="资讯列表"
          :columns="columns"
          @refresh="handleSearch"
        >
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon('ep:plus')"
              @click="openDialog('add')"
            >
              新增资讯
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
              <template #title="{ row }">
                <div class="flex flex-col">
                  <div class="font-medium text-gray-900 mb-1">
                    {{ row.title }}
                  </div>
                  <div v-if="row.subtitle" class="text-sm text-gray-500">
                    {{ row.subtitle }}
                  </div>
                </div>
              </template>

              <template #category="{ row }">
                <el-tag
                  v-if="row.categoryName"
                  type="info"
                  effect="plain"
                  size="small"
                >
                  {{ row.categoryName }}
                </el-tag>
                <span v-else class="text-gray-400">-</span>
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

              <template #isRecommended="{ row }">
                <el-tag
                  v-if="row.isRecommended"
                  type="warning"
                  effect="plain"
                  :size="size === 'small' ? 'small' : 'default'"
                >
                  推荐
                </el-tag>
                <span v-else class="text-gray-400">-</span>
              </template>

              <template #isTop="{ row }">
                <el-tag
                  v-if="row.isTop"
                  type="danger"
                  effect="plain"
                  :size="size === 'small' ? 'small' : 'default'"
                >
                  置顶
                </el-tag>
                <span v-else class="text-gray-400">-</span>
              </template>

              <template #operation="{ row }">
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('ep:view')"
                  @click="handleViewDetail(row.id)"
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
                      <el-dropdown-item @click="handleToggleRecommend(row)">
                        {{ row.isRecommended ? "取消推荐" : "设为推荐" }}
                      </el-dropdown-item>
                      <el-dropdown-item @click="handleToggleTop(row)">
                        {{ row.isTop ? "取消置顶" : "设为置顶" }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="row.status === 0 || row.status === 2"
                        @click="handlePublish(row)"
                      >
                        发布
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="row.status === 1"
                        @click="handleOffline(row)"
                      >
                        下线
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
    <NewsDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :form-data="currentRow"
      :categories="categories"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { type PaginationProps } from "@pureadmin/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessage, ElMessageBox } from "element-plus";

import NewsDialog from "./components/NewsDialog.vue";
import {
  getNewsList,
  deleteNews,
  getCategoryList,
  toggleNewsRecommend,
  toggleNewsTop,
  updateNewsStatus
} from "./api/index";
import type { NewsItem, NewsListParams, NewsCategory } from "./types/types";

defineOptions({ name: "NewsList" });

const router = useRouter();
const formRef = ref();
const tableRef = ref();
const contentRef = ref();

// 控制侧边抽屉的显示状态
const isShow = ref(false);

// 搜索表单
const searchForm = reactive<NewsListParams>({
  title: "",
  // 选择器空值使用空字符串以满足 Element Plus 的类型校验
  // 在发请求时会转换为空值
  categoryId: undefined,
  status: undefined,
  isRecommended: undefined
});

// 表格数据
const dataList = ref<NewsItem[]>([]);
const categories = ref<NewsCategory[]>([]);
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
const currentRow = ref<NewsItem | null>(null);

// 表格列配置
const columns: TableColumnList = [
  {
    label: "ID",
    prop: "id",
    width: 80
  },
  {
    label: "标题",
    prop: "title",
    minWidth: 200,
    slot: "title"
  },
  {
    label: "分类",
    prop: "category",
    width: 120,
    slot: "category"
  },
  {
    label: "状态",
    prop: "status",
    width: 100,
    slot: "status"
  },
  {
    label: "置顶",
    prop: "isTop",
    width: 80,
    slot: "isTop"
  },
  {
    label: "推荐",
    prop: "isRecommended",
    width: 80,
    slot: "isRecommended"
  },
  {
    label: "浏览",
    prop: "viewCount",
    width: 90
  },
  {
    label: "评论",
    prop: "commentCount",
    width: 90
  },
  {
    label: "点赞",
    prop: "likeCount",
    width: 90
  },
  {
    label: "收藏",
    prop: "favoriteCount",
    width: 90
  },
  {
    label: "操作",
    fixed: "right",
    width: 200,
    slot: "operation"
  }
];

// 获取数据
const getData = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.currentPage.toString(),
      limit: pagination.pageSize.toString(),
      ...searchForm
    };

    const response = await getNewsList(params);

    if (response.code === 200 && response.data) {
      dataList.value = response.data.list;
      pagination.total = response.data.total;
    } else {
      throw new Error(response.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取资讯列表失败:", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

// 获取分类数据
const getCategories = async () => {
  try {
    const response = await getCategoryList();
    if (response.code === 200 && response.data) {
      categories.value = response.data;
    }
  } catch (error) {
    console.error("获取分类列表失败:", error);
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
    title: "",
    categoryId: undefined,
    status: undefined,
    isRecommended: undefined
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

// 查看详情
const handleViewDetail = (id: number) => {
  router.push(`/news/detail/${id}`);
};

// 打开弹窗
const openDialog = (mode: "add" | "edit" | "view", row?: NewsItem) => {
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
      "此操作将永久删除该资讯，是否继续？",
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    await deleteNews(id);
    ElMessage.success("删除成功");
    getData();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 切换推荐状态
const handleToggleRecommend = async (row: NewsItem) => {
  try {
    await toggleNewsRecommend(row.id, !row.isRecommended);
    ElMessage.success(row.isRecommended ? "取消推荐成功" : "设为推荐成功");
    getData();
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error("操作失败");
  }
};

// 切换置顶状态
const handleToggleTop = async (row: NewsItem) => {
  try {
    await toggleNewsTop(row.id, !row.isTop);
    ElMessage.success(row.isTop ? "取消置顶成功" : "设为置顶成功");
    getData();
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error("操作失败");
  }
};

// 发布
const handlePublish = async (row: NewsItem) => {
  try {
    await updateNewsStatus(row.id, 1);
    ElMessage.success("发布成功");
    getData();
  } catch (error) {
    console.error("发布失败:", error);
    ElMessage.error("发布失败");
  }
};

// 下线
const handleOffline = async (row: NewsItem) => {
  try {
    await updateNewsStatus(row.id, 2);
    ElMessage.success("下线成功");
    getData();
  } catch (error) {
    console.error("下线失败:", error);
    ElMessage.error("下线失败");
  }
};

// 工具函数
const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return "info";
    case 1:
      return "success";
    case 2:
      return "warning";
    default:
      return "info";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "草稿";
    case 1:
      return "已发布";
    case 2:
      return "已下线";
    default:
      return "未知";
  }
};

// 初始化
onMounted(() => {
  getCategories();
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
