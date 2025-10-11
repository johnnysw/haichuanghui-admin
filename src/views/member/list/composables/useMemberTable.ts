import { ref, reactive, h, onMounted } from "vue";
import { ElMessage, ElAvatar, ElTag } from "element-plus";
import { getMemberList } from "../../api";
import { useMemberFilter } from "./useMemberFilter";
import { useMemberActions } from "./useMemberActions";
import type {
  MemberInfo,
  MemberQueryParams
} from "../../types/types";
import { MEMBER_STATUS_MAP } from "../../types/types";
import type { PaginationProps } from "@pureadmin/table";

export function useMemberTable() {
  const loading = ref(false);
  const memberList = ref<MemberInfo[]>([]);
  const total = ref(0);

  // 使用筛选器
  const {
    filterForm,
    formRef,
    statusOptions,
    resetForm
  } = useMemberFilter();

  // 分页配置
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 50, 100]
  });

  // 获取会员数据
  const getMemberData = async () => {
    loading.value = true;
    try {
      const params: MemberQueryParams = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
        search: filterForm.search || undefined,
        status:
          filterForm.status !== undefined && filterForm.status !== ""
            ? filterForm.status
            : undefined
      };

      const response = await getMemberList(params);

      if (response.code === 200 && response.data) {
        memberList.value = response.data.list || [];
        total.value = response.data.total || 0;
        pagination.total = response.data.total || 0;
        pagination.currentPage = response.data.currentPage || 1;
        pagination.pageSize = response.data.pageSize || 10;
      } else {
        ElMessage.error(response.message || "获取会员列表失败");
      }
    } catch (error) {
      console.error("获取会员列表失败:", error);
      ElMessage.error("获取会员列表失败");
    } finally {
      loading.value = false;
    }
  };

  // 使用操作函数
  const { handleToggleStatus } = useMemberActions(getMemberData);

  // 搜索
  const handleSearch = () => {
    pagination.currentPage = 1;
    getMemberData();
  };

  // 重置
  const handleReset = () => {
    filterForm.search = "";
    filterForm.status = undefined;
    pagination.currentPage = 1;
    getMemberData();
  };

  // 筛选条件改变
  const handleFilterChange = () => {
    pagination.currentPage = 1;
    getMemberData();
  };

  // 分页大小改变
  const handleSizeChange = (val: number) => {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    getMemberData();
  };

  // 当前页改变
  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    getMemberData();
  };

  // 构建完整图片 URL
  const getFullImageUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/public/")) {
      return `${import.meta.env.VITE_API_BASE_URL}${url}`;
    }
    return `${import.meta.env.VITE_API_BASE_URL}/public${url.startsWith("/") ? url : `/${url}`}`;
  };

  // 表格列定义
  const columns: TableColumnList = [
    {
      type: "index",
      width: 55,
      align: "center",
      fixed: "left"
    },
    {
      label: "头像",
      prop: "avatar",
      width: 60,
      cellRenderer: ({ row }) =>
        h(ElAvatar, {
          size: 32,
          src: row?.avatar ? getFullImageUrl(row.avatar) : undefined,
          alt: row?.nickname || row?.username || "会员"
        })
    },
    {
      label: "用户名",
      prop: "username",
      minWidth: 120
    },
    {
      label: "昵称",
      prop: "nickname",
      minWidth: 120,
      cellRenderer: ({ row }) => row?.nickname || "-"
    },
    {
      label: "邮箱",
      prop: "email",
      minWidth: 180,
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => row?.email || "-"
    },
    {
      label: "手机号",
      prop: "phone",
      minWidth: 120,
      cellRenderer: ({ row }) => row?.phone || "-"
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 80,
      align: "center",
      cellRenderer: ({ row }) => {
        const statusInfo =
          MEMBER_STATUS_MAP[row?.status] ||
          ({ label: "未知", type: "info" } as any);
        return h(
          ElTag,
          {
            type: statusInfo.type,
            effect: "light",
            size: "small"
          },
          () => statusInfo.label
        );
      }
    },
    {
      label: "注册时间",
      prop: "createdTime",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        if (!row?.createdTime) return "-";
        const date = new Date(row.createdTime);
        return date
          .toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
          })
          .replace(/\//g, "-");
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  // 组件挂载时获取数据
  onMounted(() => {
    getMemberData();
  });

  return {
    filterForm,
    formRef,
    loading,
    memberList,
    total,
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
  };
}

