import dayjs from "dayjs";
import { getCompetitionList } from "../api";
import type { PaginationProps, TableColumnList } from "@pureadmin/table";
import { reactive, ref, onMounted, toRaw, h } from "vue";
import { message } from "@/utils/message";
import type { Competition } from "@/types/competition";

export function useCompetitionTable() {
  const dataList = ref<Competition.CompetitionInfo[]>([]);
  const loading = ref(true);
  const isShow = ref(false);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  
  const statusMap: Record<number, string> = {
    0: "草稿",
    1: "报名中",
    2: "进行中",
    3: "已结束",
    4: "已取消",
    5: "审核中",
    6: "已拒绝"
  };

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      minWidth: 80
    },
    {
      label: "大赛标题",
      prop: "title",
      minWidth: 200
    },
    {
      label: "行业领域",
      prop: "industry.name",
      minWidth: 120
    },
    {
      label: "地区",
      prop: "region.name",
      minWidth: 120
    },
    {
      label: "主办方",
      prop: "organizer",
      minWidth: 120
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => h("el-tag", {
          type: row.status === 0 ? "info" : 
                row.status === 1 ? "primary" : 
                row.status === 2 ? "success" : 
                row.status === 3 ? "warning" : 
                row.status === 4 ? "danger" : 
                row.status === 5 ? "" : 
                "danger",
          size: props.size === "small" ? "small" : "default"
        }, statusMap[row.status])
    },
    {
      label: "是否推荐",
      prop: "isRecommended",
      minWidth: 100,
      cellRenderer: ({ row, props }) => h("el-switch", {
          size: props.size === "small" ? "small" : "default",
          modelValue: row.isRecommended,
          "active-text": "是",
          "inactive-text": "否",
          disabled: true
        })
    },
    {
      label: "报名人数",
      prop: "registrationCount",
      minWidth: 100
    },
    {
      label: "浏览量",
      prop: "viewCount",
      minWidth: 100
    },
    {
      label: "创建时间",
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

  async function fetchData(params: Competition.CompetitionQueryParams) {
    loading.value = true;
    try {
      const { data } = await getCompetitionList(params);
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