import { ref, reactive, h } from "vue";
import type { IncubatorItem, IncubatorQueryParams } from "../types/types";
import { getIncubatorList, deleteIncubator } from "../api";
import type { PaginationProps, TableColumns } from "@pureadmin/table";
import { ElMessage, ElTag } from "element-plus";

export function useIncubatorTable() {
  const loading = ref(false);
  const list = ref<IncubatorItem[]>([]);
  const pagination = reactive<PaginationProps>({ total: 0, pageSize: 10, currentPage: 1, background: true });

  const form = reactive<IncubatorQueryParams>({ page: 1, limit: 10, name: "", location: "", type: "", status: "", recommended: "" });

  const columns = [
    { label: "勾选列", type: "selection" as const, width: 55, align: "left" as const },
    { label: "序号", type: "index" as const, width: 70 },
    { label: "名称", prop: "name", minWidth: 160 },
    { label: "地区", prop: "location", minWidth: 80 },
    { label: "类型", prop: "type", minWidth: 100 },
    {
      label: "推荐",
      prop: "isRecommended",
      minWidth: 80,
      align: "center" as const,
      cellRenderer: ({ row }: any) => h(ElTag, { type: row.isRecommended ? "success" : "info", effect: "light", size: "small" }, () => row.isRecommended ? "已推荐" : "-"),
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 80,
      align: "center" as const,
      cellRenderer: ({ row }: any) => {
        const map: Record<number, { label: string; color: any }> = { 0: { label: "禁用", color: "danger" }, 1: { label: "正常", color: "success" }, 2: { label: "审核中", color: "warning" }, 3: { label: "已拒绝", color: "danger" } };
        const info = map[row.status ?? 1] || { label: "-", color: "info" };
        return h(ElTag, { type: info.color, effect: "light", size: "small" }, () => info.label);
      }
    },
    { label: "浏览量", prop: "viewCount", minWidth: 80, align: "center" as const },
    { label: "创建时间", prop: "createdTime", minWidth: 140 },
    { label: "操作", fixed: "right" as const, minWidth: 300, slot: "operation" }
  ];

  async function fetch(params?: Partial<IncubatorQueryParams>) {
    loading.value = true;
    try {
      const query = { ...form, ...(params || {}) } as IncubatorQueryParams;
      const { data } = await getIncubatorList(query);
      list.value = data.list;
      pagination.total = data.total;
      pagination.currentPage = data.page;
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
    Object.assign(form, { page: 1, limit: 10, name: "", location: "", type: "", status: "", recommended: "" });
    pagination.currentPage = 1;
    fetch();
  }

  async function removeRow(row: IncubatorItem) {
    const { success } = await deleteIncubator(row.id);
    if (success) {
      fetch();
      return true;
    }
    return false;
  }

  function handleSizeChange(size: number) {
    form.limit = size;
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

