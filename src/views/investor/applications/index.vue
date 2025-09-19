<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { deviceDetection } from "@pureadmin/utils";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getApplicationList, getApplicationStats, updateApplication, deleteApplication } from "./api/index";
import type { ApplicationQueryParams, InvestorApplication } from "./types/types";
import { ElMessage, ElMessageBox } from "element-plus";

import Refresh from "@iconify-icons/ep/refresh";
import View from "@iconify-icons/ep/view";
// Removed quick review icons; approve/reject moved to detail page operations

defineOptions({
  name: "InvestorApplications"
});

const router = useRouter();

// 表格相关
const formRef = ref();
const tableRef = ref();
const loading = ref(false);
const applicationList = ref<InvestorApplication[]>([]);

// 筛选表单
const filterForm = ref<ApplicationQueryParams>({
  page: 1,
  limit: 20,
  search: "",
  status: "",
  dateRange: null,
  reviewerId: undefined
});

// 分页信息
const pagination = ref({
  total: 0,
  pageSize: 20,
  currentPage: 1,
  background: true,
  layout: "total, sizes, prev, pager, next, jumper"
});

// 顶部统计
const stats = ref({ total: 0, pending: 0, approved: 0, rejected: 0, todaySubmitted: 0 });

// 状态选项
const statusOptions = [
  { label: "全部状态", value: "" },
  { label: "待审核", value: "2" },
  { label: "审核通过", value: "1" },
  { label: "审核拒绝", value: "3" }
];

// 表格列配置
const columns = [
  {
    label: "申请人",
    prop: "user",
    width: 180,
    formatter: (row: InvestorApplication) => row.user?.realName || row.user?.username || "未知"
  },
  {
    label: "联系方式",
    prop: "contact",
    width: 150,
    formatter: (row: InvestorApplication) => row.user?.phone || row.user?.email || "-"
  },
  {
    label: "投资机构",
    prop: "investmentInstitution",
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    label: "投资偏好",
    prop: "investmentPreference",
    width: 120,
    showOverflowTooltip: true
  },
  {
    label: "申请状态",
    prop: "status",
    width: 100,
    slot: "status"
  },
  {
    label: "申请时间",
    prop: "submittedTime",
    width: 180,
    formatter: (row: InvestorApplication) => row.submittedTime?.slice(0, 19) || "-"
  },
  {
    label: "审核人",
    prop: "reviewer",
    width: 120,
    formatter: (row: InvestorApplication) => row.reviewer?.realName || row.reviewer?.username || "-"
  },
  {
    label: "操作",
    fixed: "right",
    minWidth: 300,
    slot: "operation"
  }
];

// 获取申请列表数据
const getApplicationData = async (params?: Partial<ApplicationQueryParams>) => {
  try {
    loading.value = true;
    const queryParams = { ...filterForm.value, ...params };
    const response = await getApplicationList(queryParams);
    
    applicationList.value = response.data.list;
    pagination.value.total = response.data.total;
    pagination.value.currentPage = response.data.page;
  } catch (error) {
    console.error("获取申请列表失败:", error);
    ElMessage.error("获取申请列表失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  filterForm.value.page = 1;
  pagination.value.currentPage = 1;
  getApplicationData();
};

// 重置
const handleReset = () => {
  formRef.value?.resetFields();
  filterForm.value = {
    page: 1,
    limit: 20,
    search: "",
    status: "",
    dateRange: null,
    reviewerId: undefined
  };
  pagination.value.currentPage = 1;
  getApplicationData();
};

// 刷新
const handleRefresh = () => {
  getApplicationData();
  fetchStats();
};

// 分页处理
const handleSizeChange = (val: number) => {
  filterForm.value.limit = val;
  pagination.value.pageSize = val;
  getApplicationData();
};

const handleCurrentChange = (val: number) => {
  filterForm.value.page = val;
  pagination.value.currentPage = val;
  getApplicationData();
};

// 查看详情
const handleViewDetail = (row: InvestorApplication) => {
  router.push({
    path: `/investor/applications/detail/${row.id}`
  });
};

// 快速审核
const handleQuickReview = async (row: InvestorApplication, status: number) => {
  const action = status === 1 ? "通过" : "拒绝";
  try {
    await ElMessageBox.confirm(
      `确认要${action}这个申请吗？`,
      "确认操作",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    
    // 这里应该调用审核API
    ElMessage.success(`申请${action}成功`);
    getApplicationData();
  } catch (error) {
    console.log("取消操作");
  }
};

// 获取状态类型
const getStatusType = (status: number) => {
  const statusMap = {
    1: "success", // 审核通过
    2: "warning", // 待审核
    3: "danger"   // 审核拒绝
  };
  return statusMap[status] || "info";
};

// 获取状态文本
const getStatusText = (status: number) => {
  const statusMap = {
    1: "审核通过",
    2: "待审核", 
    3: "审核拒绝"
  };
  return statusMap[status] || "未知";
};

// 初始化数据
onMounted(() => {
  getApplicationData();
  fetchStats();
});

// 拉取统计
async function fetchStats() {
  try {
    const { data } = await getApplicationStats();
    stats.value = data as any;
  } catch {}
}

// 编辑（示例：打开详情页进行编辑）
function handleEdit(row: InvestorApplication) {
  router.push({ path: `/investor/applications/detail/${row.id}` });
}

// 删除
async function handleDelete(row: InvestorApplication) {
  try {
    await ElMessageBox.confirm(`是否确认删除申请【${row.user?.realName || row.user?.username}】？`, '提示', { type: 'warning' });
    loading.value = true;
    const res = await deleteApplication(row.id);
    if (res.success) {
      ElMessage.success('删除成功');
      getApplicationData();
      fetchStats();
    } else {
      ElMessage.error(res.message || '删除失败');
    }
  } catch {
    // cancel
  } finally {
    loading.value = false;
  }
}
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
        <el-button :icon="useRenderIcon('ri:refresh-line')" @click="handleReset">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="投资人申请列表" :columns="columns" @refresh="handleRefresh">
      <template #buttons>
        <el-space wrap>
          <el-tag type="info" effect="light">总数：{{ stats.total }}</el-tag>
          <el-tag type="warning" effect="light">待审：{{ stats.pending }}</el-tag>
          <el-tag type="success" effect="light">通过：{{ stats.approved }}</el-tag>
          <el-tag type="danger" effect="light">拒绝：{{ stats.rejected }}</el-tag>
          <el-tag type="primary" effect="light">今日：{{ stats.todaySubmitted }}</el-tag>
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
                查看详情
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
              <el-popconfirm :title="`确认删除该申请吗？`" @confirm="handleDelete(row)">
                <template #reference>
                  <el-button class="reset-margin" link type="danger" :size="size as any">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  .el-form-item {
    margin-bottom: 12px;
  }
}
</style>
