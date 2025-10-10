import dayjs from "dayjs";
import { h, reactive, ref, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { useRouter } from "vue-router";
import type { PaginationProps } from "@pureadmin/table";
import { getEventList, deleteEvent } from "../api";
import type { EventForm, EventInfo, EventListResponse } from "../types/types";

const STATUS_MAP: Record<number, { text: string; type: string }> = {
  0: { text: "草稿", type: "info" },
  1: { text: "报名中", type: "primary" },
  2: { text: "进行中", type: "success" },
  3: { text: "已结束", type: "warning" },
  4: { text: "已取消", type: "danger" },
};

export function useEventTable() {
  const router = useRouter();
  const form = reactive({
    title: "",
    eventTypeId: "",
    regionId: "",
    status: "",
  });

  const dataList = ref<EventInfo[]>([]);
  const loading = ref(false);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
  });

  const columns = [
    {
      label: "活动标题",
      prop: "title",
      minWidth: 180,
    },
    {
      label: "活动类型",
      prop: "eventType.name",
      minWidth: 120,
    },
    {
      label: "地区",
      prop: "region.name",
      minWidth: 120,
    },
    {
      label: "主办方",
      prop: "organizer",
      minWidth: 140,
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 110,
      cellRenderer: ({ row, props }: any) => (
        <el-tag
          type={
            row.status === 0
              ? "info"
              : row.status === 1
                ? "primary"
                : row.status === 2
                  ? "success"
                  : row.status === 3
                    ? "warning"
                    : "danger"
          }
          size={props.size === "small" ? "small" : "default"}
        >
          {STATUS_MAP[row.status]?.text ?? "未知"}
        </el-tag>
      )
    },
    {
      label: "报名人数",
      prop: "registrationCount",
      minWidth: 120,
      cellRenderer: ({ row }: any) => (
        <div class="flex items-center">
          <span>{row.registrationCount ?? 0}</span>
          {row.isFull && (
            <el-tag type="warning" size="small" class="ml-2">
              已满
            </el-tag>
          )}
        </div>
      ),
    },
    {
      label: "浏览量",
      prop: "viewCount",
      minWidth: 100,
    },
    {
      label: "创建日期",
      prop: "createdTime",
      minWidth: 120,
      formatter: ({ createdTime }) =>
        createdTime ? dayjs(createdTime).format("YYYY-MM-DD") : "--",
    },
    {
      label: "操作",
      fixed: "right" as const,
      width: 220,
      slot: "operation",
    },
  ] as any;

  const fetchTableData = async () => {
    loading.value = true;
    try {
      const params = {
        ...form,
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
      };
      const { data } = await getEventList(params);
      const payload = (data as unknown as EventListResponse) ?? {
        list: [],
        total: 0,
        pageSize: pagination.pageSize,
        currentPage: pagination.currentPage,
      };
      dataList.value = payload.list || [];
      pagination.total = payload.total ?? 0;
      pagination.pageSize = payload.pageSize ?? pagination.pageSize;
      pagination.currentPage = payload.currentPage ?? pagination.currentPage;
    } catch (error: any) {
      message(`获取活动列表失败：${error?.message ?? "未知错误"}`, {
        type: "error",
      });
    } finally {
      loading.value = false;
    }
  };

  const handleSearch = () => {
    pagination.currentPage = 1;
    fetchTableData();
  };

  const resetForm = (formRef: any) => {
    if (!formRef) return;
    formRef.resetFields();
    pagination.currentPage = 1;
    fetchTableData();
  };

  const handleSizeChange = (val: number) => {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    fetchTableData();
  };

  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    fetchTableData();
  };

  const openDetail = (row: EventInfo) => {
    router.push(`/event/detail/${row.id}`);
  };

  const openRegistration = (row: EventInfo) => {
    router.push(`/event/registration/${row.id}`);
  };

  const handleDelete = async (row: EventInfo) => {
    try {
      await ElMessageBox.confirm(
        `确认要删除活动“${row.title}”吗？`,
        "删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      );

      const res = await deleteEvent(row.id);
      if (res.code === 200) {
        message("删除活动成功", { type: "success" });
        fetchTableData();
      } else {
        message(res.message || "删除失败", { type: "error" });
      }
    } catch (error: any) {
      if (error !== "cancel") {
        message(error?.message || "删除失败", { type: "error" });
      }
    }
  };

  onMounted(() => {
    fetchTableData();
  });

  return {
    form,
    dataList,
    loading,
    columns,
    pagination,
    fetchTableData,
    handleSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    handleDelete,
    openDetail,
    openRegistration,
  };
}

