import dayjs from "dayjs";
import { getCompetitionRegistrations } from "../api";
import type { PaginationProps, TableColumnList } from "@pureadmin/table";
import { reactive, ref, toRaw, h } from "vue";
import { message } from "@/utils/message";
import type { RegistrationItem, RegistrationListResponse } from "../types/types";

export function useRegistrationTable() {
  const dataList = ref<RegistrationItem[]>([]);
  const loading = ref(true);
  const isShow = ref(false);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  
  const statusMap = {
    0: "待审核",
    1: "已通过",
    2: "已拒绝"
  };

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      minWidth: 80
    },
    {
      label: "用户信息",
      prop: "user",
      minWidth: 150,
      cellRenderer: ({ row }) => h("div", {}, [
        h("div", {}, `用户名: ${row.user?.username}`),
        h("div", {}, `邮箱: ${row.user?.email}`),
        h("div", {}, `手机: ${row.user?.phone}`)
      ])
    },
    {
      label: "团队名称",
      prop: "teamName",
      minWidth: 120
    },
    {
      label: "项目名称",
      prop: "projectName",
      minWidth: 150
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => h("el-tag", {
          type: row.status === 0 ? "info" : 
               row.status === 1 ? "success" : 
               "danger",
          size: props.size === "small" ? "small" : "default"
        }, statusMap[row.status])
    },
    {
      label: "报名时间",
      prop: "createdTime",
      minWidth: 160,
      formatter: ({ createdTime }) =>
        dayjs(createdTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];

  async function fetchData(competitionId: number, params: any) {
    loading.value = true;
    try {
      const { data } = await getCompetitionRegistrations(competitionId, params);
      dataList.value = data.list;
      pagination.total = data.total;
      
      setTimeout(() => {
        loading.value = false;
      }, 300);
    } catch (error) {
      loading.value = false;
      message("获取数据失败: " + error.message, { type: "error" });
    }
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
  }

  return {
    dataList,
    loading,
    isShow,
    pagination,
    columns,
    statusMap,
    fetchData,
    handleSizeChange,
    handleCurrentChange
  };
}