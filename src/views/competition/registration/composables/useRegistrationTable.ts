import dayjs from "dayjs";
import { getCompetitionRegistrations } from "../api";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, h } from "vue";
import { message } from "@/utils/message";
import {
  REGISTRATION_STATUS_MAP,
  type RegistrationListItem,
  type RegistrationQueryParams,
  type RegistrationSummary
} from "../types/types";

const SUMMARY_DEFAULT: RegistrationSummary = {
  pending: 0,
  approved: 0,
  rejected: 0,
  cancelled: 0
};

export function useRegistrationTable() {
  const dataList = ref<RegistrationListItem[]>([]);
  const summary = ref<RegistrationSummary>({ ...SUMMARY_DEFAULT });
  const loading = ref(false);
  const isShow = ref(false);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "项目名称",
      prop: "projectName",
      minWidth: 200,
      cellRenderer: ({ row }) =>
        h("div", { class: "flex flex-col" }, [
          h("span", {}, row.projectName || row.companyName || "--"),
          h(
            "span",
            { class: "text-[12px] text-text_color_secondary" },
            row.projectStage || ""
          )
        ])
    },
    {
      label: "联系人",
      prop: "contactName",
      minWidth: 160,
      cellRenderer: ({ row }) =>
        h("div", { class: "flex flex-col" }, [
          h("span", {}, row.contactName || "--"),
          h(
            "span",
            { class: "text-[12px] text-text_color_secondary" },
            row.contactPhone || "--"
          )
        ])
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 110,
      cellRenderer: ({ row, props }) => {
        const meta =
          REGISTRATION_STATUS_MAP[
            row.status as keyof typeof REGISTRATION_STATUS_MAP
          ];
        return h(
          "el-tag",
          {
            type: meta?.type || "info",
            size: props.size === "small" ? "small" : "default"
          },
          meta?.text || "--"
        );
      }
    },
    {
      label: "报名时间",
      prop: "createdTime",
      minWidth: 160,
      formatter: ({ createdTime }) =>
        createdTime ? dayjs(createdTime).format("YYYY-MM-DD HH:mm") : "--"
    },
    {
      label: "审核信息",
      prop: "reviewTime",
      minWidth: 180,
      cellRenderer: ({ row }) =>
        h("div", { class: "flex flex-col" }, [
          h(
            "span",
            {},
            row.reviewer?.name ? `审核人：${row.reviewer.name}` : "审核人：--"
          ),
          h(
            "span",
            { class: "text-[12px] text-text_color_secondary" },
            row.reviewTime
              ? dayjs(row.reviewTime).format("YYYY-MM-DD HH:mm")
              : "未审核"
          )
        ])
    },
    {
      label: "操作",
      fixed: "right",
      width: 220,
      slot: "operation"
    }
  ];

  async function fetchData(
    competitionId: number,
    params: RegistrationQueryParams
  ) {
    loading.value = true;
    try {
      const { data } = await getCompetitionRegistrations(competitionId, params);
      const payload = data; // 直接使用 data，因为 API 已经返回了正确的类型

      if (!payload) {
        dataList.value = [];
        summary.value = { ...SUMMARY_DEFAULT };
        pagination.total = 0;
        return;
      }

      dataList.value = payload.list || [];
      pagination.total = payload.total ?? 0;
      pagination.pageSize = payload.pageSize ?? pagination.pageSize;
      pagination.currentPage = payload.pageNum ?? pagination.currentPage;
      summary.value = payload.summary ?? { ...SUMMARY_DEFAULT };
    } catch (error: any) {
      const errMsg = error?.message || "获取报名数据失败";
      message(errMsg, { type: "error" });
    } finally {
      loading.value = false;
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
    summary,
    loading,
    isShow,
    pagination,
    columns,
    fetchData,
    handleSizeChange,
    handleCurrentChange
  };
}
