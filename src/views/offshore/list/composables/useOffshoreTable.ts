import { ref, reactive, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { ElMessage, ElTag, ElImage } from "element-plus";
import { useDateFormat } from "@vueuse/core";
import { getFullImageUrl } from "@/utils/image";
import type { OffshoreCenterItem, OffshoreQueryParams } from "../types/types";
import { getOffshoreList, deleteOffshore } from "../api";

const STATUS_INFO: Record<
  number,
  { label: string; type: "success" | "warning" | "danger" | "info" }
> = {
  1: { label: "正常", type: "success" },
  2: { label: "已下线", type: "warning" },
  3: { label: "禁用", type: "danger" }
};

function formatNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString();
}

export function useOffshoreTable() {
  const loading = ref(false);
  const list = ref<OffshoreCenterItem[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const form = reactive<OffshoreQueryParams>({
    page: 1,
    pageSize: 10,
    name: "",
    regionId: "",
    centerTypeId: "",
    status: "",
    isRecommended: "",
    sortBy: "createdTime",
    sortOrder: "desc"
  });

  const columns: TableColumnList = [
    { label: "序号", type: "index", width: 70 },
    {
      label: "Logo",
      prop: "logo",
      width: 90,
      align: "center",
      cellRenderer: ({ row }) =>
        row.logo
          ? h(ElImage, {
              src: row.logo.startsWith("http") ? row.logo : `${row.logo}`,
              fit: "cover",
              style: "width:48px;height:48px;border-radius:8px;"
            })
          : h("span", { class: "text-gray-400" }, "-")
    },
    { label: "名称", prop: "name", minWidth: 160 },
    {
      label: "类型",
      prop: "centerType",
      minWidth: 120,
      cellRenderer: ({ row }) =>
        row.centerType?.name || row.centerType?.code || "-"
    },
    {
      label: "地区",
      prop: "region",
      minWidth: 120,
      cellRenderer: ({ row }) =>
        row.region?.name || row.city || row.country || "-"
    },
    {
      label: "推荐",
      prop: "isRecommended",
      minWidth: 100,
      align: "center",
      cellRenderer: ({ row }) =>
        h(
          ElTag,
          {
            type: row.isRecommended ? "warning" : "info",
            effect: "light",
            size: "small"
          },
          () => (row.isRecommended ? "已推荐" : "未推荐")
        )
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      align: "center",
      cellRenderer: ({ row }) => {
        const info = STATUS_INFO[row.status ?? 1] || {
          label: "-",
          type: "info"
        };
        return h(
          ElTag,
          { type: info.type, effect: "light", size: "small" },
          () => info.label
        );
      }
    },
    {
      label: "服务企业数",
      prop: "serviceCount",
      minWidth: 140,
      align: "center",
      cellRenderer: ({ row }) => formatNumber(row.serviceCount)
    },
    {
      label: "成功案例数",
      prop: "successCases",
      minWidth: 140,
      align: "center",
      cellRenderer: ({ row }) => formatNumber(row.successCases)
    },
    {
      label: "创建时间",
      prop: "createdTime",
      minWidth: 140,
      cellRenderer: ({ row }) => {
        if (!row.createdTime) return "-";
        const date = new Date(row.createdTime);
        if (Number.isNaN(date.getTime())) return "-";
        return useDateFormat(date, "YYYY-MM-DD").value;
      }
    },
    { label: "操作", fixed: "right", width: 220, slot: "operation" }
  ];

  async function fetch(params?: Partial<OffshoreQueryParams>) {
    loading.value = true;
    try {
      const query = { ...form, ...(params || {}) } as OffshoreQueryParams;
      const result = await getOffshoreList(query);

      if (result.code === 200) {
        const responseData = result.data;
        list.value = (responseData?.list || []).map(item => ({
          ...item,
          logo: item.logo ? getFullImageUrl(item.logo) : ""
        }));
        pagination.total = responseData?.total || 0;
        pagination.pageSize = responseData?.pageSize || query.pageSize;
        pagination.currentPage = responseData?.page || query.page;
      } else {
        ElMessage.error("获取离岸中心列表失败: " + result.message);
      }
    } catch (error) {
      console.error("获取离岸中心列表失败:", error);
      ElMessage.error("获取离岸中心列表失败");
    } finally {
      loading.value = false;
    }
  }

  function onSearch() {
    form.page = 1;
    pagination.currentPage = 1;
    fetch();
  }

  function resetForm() {
    Object.assign(form, {
      page: 1,
      pageSize: pagination.pageSize,
      name: "",
      regionId: "",
      centerTypeId: "",
      status: "",
      isRecommended: "",
      sortBy: "createdTime",
      sortOrder: "desc"
    });
    pagination.currentPage = 1;
    fetch();
  }

  async function removeRow(row: OffshoreCenterItem) {
    try {
      const result = await deleteOffshore(row.id);
      if (result.code === 200) {
        ElMessage.success(result.message || `已删除离岸中心【${row.name}】`);
        fetch();
        return true;
      } else {
        ElMessage.error(result.message || "删除失败");
        return false;
      }
    } catch (error: any) {
      console.error("删除离岸中心失败:", error);
      ElMessage.error(error?.message || "删除失败");
      return false;
    }
  }

  function handleSizeChange(size: number) {
    form.pageSize = size;
    pagination.pageSize = size;
    fetch();
  }

  function handleCurrentChange(page: number) {
    form.page = page;
    pagination.currentPage = page;
    fetch();
  }

  return {
    form,
    columns,
    list,
    loading,
    pagination,
    fetch,
    onSearch,
    resetForm,
    removeRow,
    handleSizeChange,
    handleCurrentChange
  };
}
