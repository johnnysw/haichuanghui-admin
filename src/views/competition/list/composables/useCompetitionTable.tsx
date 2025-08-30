import dayjs from "dayjs";
import editForm from "../components/CompetitionForm.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { getCompetitionList, getIndustryList, recommendCompetition } from "../api";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { CompetitionItem, FormItemProps } from "../types/types";
import { useRouter } from "vue-router";

export function useCompetitionList() {
  const router = useRouter();
  const form = reactive({
    title: "",
    industryId: "",
    regionId: "",
    status: ""
  });
  const formRef = ref();
  const dataList = ref<CompetitionItem[]>([]);
  const isShow = ref(false);
  const loading = ref(true);
  const industryOptions = ref<Array<{ id: number; name: string }>>([]);

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
      minWidth: 180
    },
    {
      label: "行业领域",
      prop: "industry.name",
      minWidth: 100
    },
    {
      label: "地区",
      prop: "region.name",
      minWidth: 100
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
      cellRenderer: ({ row, props }) => (
        <el-tag
          type={row.status === 0 ? "info" : 
                row.status === 1 ? "primary" : 
                row.status === 2 ? "success" : 
                row.status === 3 ? "warning" : 
                row.status === 4 ? "danger" : 
                row.status === 5 ? "" : 
                "danger"}
          size={props.size === "small" ? "small" : "default"}
        >
          {statusMap[row.status]}
        </el-tag>
      )
    },
    {
      label: "是否推荐",
      prop: "isRecommended",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-switch
          size={props.size === "small" ? "small" : "default"}
          modelValue={row.isRecommended}
          onChange={(value) => handleToggleRecommend(row, value)}
        />
      )
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
        dayjs(createdTime).format("YYYY-MM-DD")
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  // 高亮当前选中行
  function rowStyle({ row }: { row: any }) {
    return {
      cursor: "pointer"
    };
  }

  // 获取行业领域选项
  const fetchIndustryOptions = async () => {
    try {
      const result = await getIndustryList();
      if (result.code === 200) {
        industryOptions.value = result.data.map(item => ({
          id: item.id,
          name: item.name
        }));
      }
    } catch (error) {
      console.error("获取行业领域失败:", error);
    }
  };

  function handleDelete(row) {
    message(`您删除了大赛名为${row.title}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  // 处理切换推荐状态
  async function handleToggleRecommend(row: CompetitionItem, value: boolean) {
    try {
      // 调用后端API更新推荐状态
      const result = await recommendCompetition(row.id, { isRecommended: value });
      
      if (result.code === 200) {
        // 更新本地数据
        row.isRecommended = value;
        
        // 显示成功消息
        message(`已${value ? '推荐' : '取消推荐'}大赛：${row.title}`, { 
          type: "success" 
        });
      } else {
        throw new Error(result.message || '操作失败');
      }
      
    } catch (error) {
      // 如果更新失败，回滚状态
      row.isRecommended = !value;
      message(`操作失败：${error.message}`, { type: "error" });
    }
  }

  async function onSearch() {
    loading.value = true;
    const params = {
      ...toRaw(form),
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    
    try {
      const { data } = await getCompetitionList(params);
      dataList.value = data.list;
      pagination.total = data.total;
      pagination.pageSize = data.pageSize || pagination.pageSize;
      pagination.currentPage = data.currentPage || pagination.currentPage;
    } catch (error) {
      message("获取数据失败: " + error.message, { type: "error" });
    }

    setTimeout(() => {
      loading.value = false;
    }, 300);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: CompetitionItem) {
    // 这里不再使用弹窗，而是通过事件通知父组件打开抽屉
    const formData: FormItemProps = row 
      ? { ...row } 
      : {
          id: undefined,
          title: "",
          industryId: 0,
          regionId: 0,
          organizer: "",
          coOrganizers: "",
          status: 0,
          startTime: "",
          endTime: "",
          registrationDeadline: "",
          location: "",
          onlineUrl: "",
          isRecommended: false,
          poster: "",
          summary: "",
          description: "",
          requirements: "",
          prizes: "",
          judges: "",
          schedule: ""
        };
    
    // 通过事件通知父组件打开抽屉
    if (title === "新增") {
      window.dispatchEvent(new CustomEvent('openAddCompetitionDrawer', { detail: { title: "新增大赛", formData } }));
    } else {
      window.dispatchEvent(new CustomEvent('openEditCompetitionDrawer', { detail: { title: "修改大赛", formData } }));
    }
  }

  function openDetail(row) {
    console.log("查看详情", row);
    // 跳转到竞赛详情页面
    router.push(`/competition/detail/${row.id}`);
  }

  onMounted(() => {
    fetchIndustryOptions();
    onSearch();
  });

  return {
    form,
    isShow,
    loading,
    columns,
    dataList,
    pagination,
    industryOptions,
    onSearch,
    resetForm,
    openDialog,
    openDetail,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleToggleRecommend,
    rowStyle // 添加rowStyle到返回对象中
  };
}