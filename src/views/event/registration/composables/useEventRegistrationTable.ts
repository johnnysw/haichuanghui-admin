import { reactive, ref, onMounted } from "vue";
import { getEventRegistrations } from "../api";
import type { EventRegistrationItem, EventRegistrationListResponse, EventRegistrationQuery } from "../types/types";
import type { PaginationProps } from "@pureadmin/table";
import type { TableColumnList } from "@/components/RePureTable/types";
import { message } from "@/utils/message";
import dayjs from "dayjs";

export function useEventRegistrationTable(eventId: number) {
  const loading = ref(false);
  const dataList = ref<EventRegistrationItem[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
  });

  const form = reactive<EventRegistrationQuery>({
    name: "",
    phone: "",
  });

  const columns: TableColumnList = [
    {
      label: "姓名",
      prop: "name",
      minWidth: 140,
    },
    {
      label: "手机号",
      prop: "phone",
      minWidth: 140,
    },
    {
      label: "邮箱",
      prop: "email",
      minWidth: 180,
    },
    {
      label: "公司",
      prop: "company",
      minWidth: 160,
    },
    {
      label: "职位",
      prop: "position",
      minWidth: 140,
    },
    {
      label: "备注",
      prop: "notes",
      minWidth: 200,
      showOverflowTooltip: true,
    },
    {
      label: "报名时间",
      prop: "createdTime",
      minWidth: 160,
      formatter: ({ createdTime }) =>
        createdTime ? dayjs(createdTime).format("YYYY-MM-DD HH:mm") : "--",
    },
  ];

  const fetchRegistrations = async () => {
    if (!eventId) return;
    loading.value = true;
    try {
      const params = {
        ...form,
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
      };
      const { data } = await getEventRegistrations(eventId, params);
      const payload = (data as unknown as EventRegistrationListResponse) ?? {
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
      message(error?.message || "获取报名数据失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  };

  const handleSearch = () => {
    pagination.currentPage = 1;
    fetchRegistrations();
  };

  const resetForm = (formRef: any) => {
    if (!formRef) return;
    formRef.resetFields();
    pagination.currentPage = 1;
    fetchRegistrations();
  };

  const handleSizeChange = (val: number) => {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    fetchRegistrations();
  };

  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    fetchRegistrations();
  };

  onMounted(() => {
    fetchRegistrations();
  });

  return {
    form,
    dataList,
    loading,
    columns,
    pagination,
    fetchRegistrations,
    handleSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
  };
}

