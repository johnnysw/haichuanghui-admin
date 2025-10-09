import { ref, reactive, h } from "vue";
import type { IncubatorItem, IncubatorQueryParams, PageResponseData } from "../types/types";
import { getIncubatorList, deleteIncubator } from "../api";
import type { PaginationProps } from "@pureadmin/table";
import { ElMessage, ElTag, ElImage } from "element-plus";
import { getFullImageUrl } from "@/utils/image";
import { useDateFormat } from "@vueuse/core";

export function useIncubatorTable() {
  const loading = ref(false);
  const list = ref<IncubatorItem[]>([]);
  const pagination = reactive<PaginationProps>({ total: 0, pageSize: 10, currentPage: 1, background: true });

  const form = reactive<IncubatorQueryParams>({
    page: 1,
    pageSize: 10,
    name: "",
    regionId: "",
    status: "",
    isRecommended: ""
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
      cellRenderer: ({ row }) => row.centerType?.name || row.centerType?.code || "-"
    },
    {
      label: "地区",
      prop: "region",
      minWidth: 120,
      cellRenderer: ({ row }) => row.region?.name || row.location || "-"
    },
    {
      label: "推荐",
      prop: "isRecommended",
      minWidth: 100,
      align: "center",
      cellRenderer: ({ row }) =>
        h(
          ElTag,
          { type: row.isRecommended ? "success" : "info", effect: "light", size: "small" },
          () => (row.isRecommended ? "已推荐" : "未推荐")
        )
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      align: "center",
      cellRenderer: ({ row }) => {
        const map: Record<number, { label: string; color: "success" | "warning" | "danger" | "info" }> = {
          1: { label: "正常", color: "success" },
          2: { label: "已下线", color: "warning" },
          3: { label: "禁用", color: "danger" }
        };
        const info = map[row.status ?? 1] || { label: "-", color: "info" };
        return h(ElTag, { type: info.color, effect: "light", size: "small" }, () => info.label);
      }
    },
    {
      label: "面积(㎡)",
      prop: "area",
      minWidth: 120,
      align: "center",
      cellRenderer: ({ row }) => formatNumber(row.area)
    },
    {
      label: "入驻企业数",
      prop: "settledCompaniesCount",
      minWidth: 140,
      align: "center",
      cellRenderer: ({ row }) => formatNumber(row.settledCompaniesCount)
    },
    {
      label: "创建时间",
      prop: "createdTime",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        if (!row.createdTime) return "-";
        const date = new Date(row.createdTime);
        if (Number.isNaN(date.getTime())) return "-";
        return useDateFormat(date, "YYYY-MM-DD").value;
      }
    },
    { label: "操作", fixed: "right", width: 220, slot: "operation" }
  ];

  async function fetch(params?: Partial<IncubatorQueryParams>) {
    loading.value = true;
    try {
      const query = { ...form, ...(params || {}) } as IncubatorQueryParams;
      const result = await getIncubatorList(query);
      
      if (result.code === 200) {
        const responseData = result.data;
        list.value = (responseData?.list || []).map(item => ({
          ...item,
          logo: item.logo ? getFullImageUrl(item.logo) : ""
        }));
        pagination.total = responseData?.total || 0;
        pagination.pageSize = responseData?.pageSize || query.pageSize;
        pagination.currentPage = responseData?.currentPage || query.page;
      } else {
        ElMessage.error("获取孵化器列表失败: " + result.message);
      }
    } catch (error) {
      console.error("获取孵化器列表失败:", error);
      ElMessage.error("获取孵化器列表失败");
    } finally {
      loading.value = false;
    }
  }

  function formatNumber(value: unknown) {
    if (value === null || value === undefined || value === "") return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString();
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
      status: "",
      isRecommended: ""
    });
    pagination.currentPage = 1;
    fetch();
  }

  async function removeRow(row: IncubatorItem) {
    try {
      const result = await deleteIncubator(row.id);
      if (result.code === 200) {
        ElMessage.success(result.message || `已删除载体【${row.name}】`);
        fetch();
        return true;
      } else {
        ElMessage.error(result.message || "删除失败");
        return false;
      }
    } catch (error: any) {
      console.error("删除孵化器失败:", error);
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

  return { form, columns, list, loading, pagination, fetch, onSearch, resetForm, removeRow, handleSizeChange, handleCurrentChange };
}

