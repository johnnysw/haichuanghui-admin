import { ref, reactive, computed, onMounted, h } from "vue";
import type {
  FormInstance,
  FormRules,
  UploadRequestOptions
} from "element-plus";
import { ElMessageBox, ElSwitch, ElImage } from "element-plus";
import { message } from "@/utils/message";
import { getFullImageUrl } from "@/utils/image";
import { uploadImage } from "@/api/upload";
import type { Response } from "@/types/response";
import type { FileUploadResult } from "@/api/upload";
import type { PaginationProps } from "@pureadmin/table";
import {
  getBannerList,
  getBannerDetail,
  createBanner,
  updateBanner,
  deleteBanner,
  updateBannerStatus
} from "../api";
import {
  defaultBannerForm,
  type Banner,
  type BannerForm,
  type BannerQuery
} from "../types/types";

/**
 * 轮播图管理逻辑
 */
export const useCarousel = () => {
  // 表单相关
  const formVisible = ref(false);
  const formLoading = ref(false);
  const formModel = reactive<BannerForm>({ ...defaultBannerForm });
  const editingId = ref<number | null>(null);
  const uploading = ref(false);

  // 列表相关
  const tableData = ref<Banner[]>([]);
  const tableLoading = ref(false);
  const total = ref(0);
  const query = reactive<BannerQuery>({
    page: 1,
    limit: 10,
    title: '',
    status: '',
  });

  // 表格列配置
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left"
    },
    {
      label: "ID",
      prop: "id",
      minWidth: 80
    },
    {
      label: "缩略图",
      prop: "image",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        const url = getFullImageUrl(row.image);
        return h(ElImage, {
          src: url,
          previewSrcList: [url],
          fit: "cover",
          style: { width: "80px", height: "60px" },
          previewTeleported: true
        });
      }
    },
    {
      label: "标题",
      prop: "title",
      minWidth: 200
    },
    {
      label: "链接",
      prop: "url",
      minWidth: 200,
      cellRenderer: ({ row }) => row.url || "-"
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        return h(ElSwitch, {
          modelValue: row.status,
          activeValue: 1,
          inactiveValue: 0,
          onChange: (value: number) => handleStatusChange(row, value)
        });
      }
    },
    {
      label: "排序",
      prop: "sortOrder",
      minWidth: 100
    },
    {
      label: "更新时间",
      prop: "updatedTime",
      minWidth: 180,
      formatter: ({ updatedTime }) => {
        if (!updatedTime) return "-";
        const date = new Date(updatedTime);
        return date.toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 150,
      slot: "operation"
    }
  ];

  // 分页配置
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 弹窗标题
  const dialogTitle = computed(() => {
    return editingId.value ? '编辑轮播图' : '新增轮播图';
  });

  // 图片预览
  const imagePreview = computed(() => {
    return formModel.image ? getFullImageUrl(formModel.image) : '';
  });

  // 表单验证规则
  const rules: FormRules = {
    title: [
      { required: true, message: '请输入标题', trigger: 'blur' },
      { max: 100, message: '标题长度不能超过100个字符', trigger: 'blur' },
    ],
    image: [
      { required: true, message: '请上传图片', trigger: 'change' },
    ],
    url: [
      { max: 255, message: '链接长度不能超过255个字符', trigger: 'blur' },
    ],
    sortOrder: [
      { required: true, message: '请输入排序', trigger: 'blur' },
      { type: 'number', message: '排序必须是数字', trigger: 'blur' },
    ],
  };

  /**
   * 加载列表数据
   */
  const loadList = async () => {
    tableLoading.value = true;
    try {
      const res = await getBannerList(query);
      if (res.code === 200) {
        tableData.value = res.data.list;
        total.value = res.data.total;
        // 同步分页配置
        pagination.total = res.data.total;
        pagination.currentPage = query.page;
        pagination.pageSize = query.limit;
      } else {
        message(res.message || '获取列表失败', { type: 'error' });
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || error?.message || '获取列表失败';
      message(errorMsg, { type: 'error' });
    } finally {
      tableLoading.value = false;
    }
  };

  /**
   * 搜索
   */
  const handleSearch = () => {
    query.page = 1;
    loadList();
  };

  /**
   * 重置搜索
   */
  const handleReset = () => {
    query.title = '';
    query.status = '';
    query.page = 1;
    query.limit = 10;
    loadList();
  };

  /**
   * 重置搜索表单
   */
  const resetSearchForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    handleReset();
  };

  /**
   * 分页页码变化
   */
  const handlePageChange = (page: number) => {
    query.page = page;
    loadList();
  };

  /**
   * 分页大小变化
   */
  const handleSizeChange = (size: number) => {
    query.limit = size;
    query.page = 1;
    loadList();
  };

  /**
   * 新增
   */
  const handleAdd = () => {
    editingId.value = null;
    Object.assign(formModel, defaultBannerForm);
    formVisible.value = true;
  };

  /**
   * 编辑
   */
  const handleEdit = async (row: Banner) => {
    editingId.value = row.id;
    Object.assign(formModel, {
      title: row.title,
      image: row.image,
      url: row.url || '',
      description: row.description || '',
      sortOrder: row.sortOrder,
      status: row.status,
    });
    formVisible.value = true;
  };

  /**
   * 删除
   */
  const handleDelete = async (row: Banner) => {
    try {
      const res = await deleteBanner(row.id);
      if (res.code === 200) {
        message(res.message || '删除成功', { type: 'success' });
        loadList();
      } else {
        message(res.message || '删除失败', { type: 'error' });
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || error?.message || '删除失败';
      message(errorMsg, { type: 'error' });
    }
  };

  /**
   * 状态切换
   */
  const handleStatusChange = async (row: Banner, newStatus: number) => {
    const oldStatus = row.status; // 保存当前的旧值
    const statusText = newStatus === 1 ? '启用' : '禁用';

    // 先乐观更新 UI
    row.status = newStatus;

    try {
      const res = await updateBannerStatus(row.id, newStatus);
      if (res.code === 200) {
        message(`${statusText}成功`, { type: 'success' });
      } else {
        // 失败时恢复原状态
        row.status = oldStatus;
        message(res.message || `${statusText}失败`, { type: 'error' });
      }
    } catch (error: any) {
      // 失败时恢复原状态
      row.status = oldStatus;
      const errorMsg =
        error?.response?.data?.message || error?.message || `${statusText}失败`;
      message(errorMsg, { type: 'error' });
    }
  };

  /**
   * 上传图片
   */
  const handleUploadImage = async (options: UploadRequestOptions) => {
    const file = options.file as File;
    uploading.value = true;

    try {
      const res: Response<FileUploadResult> = await uploadImage(file, "banner");
      if (res.code === 200 && res.data?.url) {
        formModel.image = res.data.url;
        message(res.message || '上传成功', { type: 'success' });
        options.onSuccess?.(res);
      } else {
        const errMsg = res.message || '上传失败';
        message(errMsg, { type: 'error' });
        options.onError?.(new Error(errMsg) as any);
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || error?.message || '上传失败';
      message(errorMsg, { type: 'error' });
      options.onError?.(new Error(errorMsg) as any);
    } finally {
      uploading.value = false;
    }
  };

  /**
   * 移除图片
   */
  const handleRemoveImage = () => {
    formModel.image = '';
  };

  /**
   * 关闭对话框
   */
  const handleClose = () => {
    formVisible.value = false;
    Object.assign(formModel, defaultBannerForm);
    editingId.value = null;
  };

  /**
   * 提交表单（表单验证在CarouselForm组件内部完成）
   */
  const handleSubmit = async () => {
    formLoading.value = true;
    try {
      const data: BannerForm = {
        title: formModel.title.trim(),
        image: formModel.image,
        url: formModel.url.trim(),
        description: formModel.description.trim(),
        sortOrder: formModel.sortOrder,
        status: formModel.status,
      };

      let res;
      if (editingId.value) {
        res = await updateBanner(editingId.value, data);
      } else {
        res = await createBanner(data);
      }

      if (res.code === 200) {
        message(res.message || '操作成功', { type: 'success' });
        handleClose();
        loadList();
      } else {
        message(res.message || '操作失败', { type: 'error' });
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || error?.message || '操作失败';
      message(errorMsg, { type: 'error' });
    } finally {
      formLoading.value = false;
    }
  };

  // 初始化
  onMounted(() => {
    loadList();
  });

  return {
    // 表单相关
    formVisible,
    formLoading,
    formModel,
    rules,
    dialogTitle,
    imagePreview,
    uploading,
    // 列表相关
    tableData,
    tableLoading,
    total,
    query,
    columns,
    pagination,
    // 方法
    loadList,
    handleSearch,
    handleReset,
    resetSearchForm,
    handlePageChange,
    handleSizeChange,
    handleAdd,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleUploadImage,
    handleRemoveImage,
    handleClose,
    handleSubmit,
  };
};
