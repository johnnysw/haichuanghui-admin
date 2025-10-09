import { ref, reactive, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import type {
  ApplicationDetailState,
  InvestorApplication,
  ReviewHistory,
  ApplicationDocument
} from "../types/types";
import {
  getApplicationDetail,
  getReviewHistory,
  previewDocument,
  downloadDocument
} from "../api";

export function useApplicationDetail() {
  const route = useRoute();
  const applicationId = computed(() => Number(route.params.id));

  // 详情页面状态
  const state = reactive<ApplicationDetailState>({
    loading: false,
    application: null,
    notFound: false
  });

  // 审核历史数据
  const reviewHistory = ref<ReviewHistory[]>([]);
  const historyLoading = ref(false);

  // 文档预览状态
  const previewState = reactive({
    visible: false,
    loading: false,
    document: null as ApplicationDocument | null,
    previewUrl: ""
  });

  // 获取申请详情
  const fetchApplicationDetail = async () => {
    if (!applicationId.value || isNaN(applicationId.value)) {
      state.notFound = true;
      return;
    }

    state.loading = true;
    try {
      const response = await getApplicationDetail(applicationId.value);
      if (response.success && response.data) {
        state.application = response.data;
        state.notFound = false;
      } else {
        state.notFound = true;
      }
    } catch (error) {
      console.error("获取申请详情失败:", error);
      state.notFound = true;
    } finally {
      state.loading = false;
    }
  };

  // 获取审核历史
  const fetchReviewHistory = async () => {
    if (!applicationId.value || isNaN(applicationId.value)) return;

    historyLoading.value = true;
    try {
      const response = await getReviewHistory(applicationId.value);
      if (response.success) {
        reviewHistory.value = response.data;
      }
    } catch (error) {
      console.error("获取审核历史失败:", error);
    } finally {
      historyLoading.value = false;
    }
  };

  // 预览文档
  const handlePreviewDocument = async (document: ApplicationDocument) => {
    previewState.document = document;
    previewState.visible = true;
    previewState.loading = true;
    previewState.previewUrl = "";

    try {
      const response = await previewDocument(document.id);
      if (response.success) {
        previewState.previewUrl = response.data.previewUrl;
      }
    } catch (error) {
      console.error("预览文档失败:", error);
    } finally {
      previewState.loading = false;
    }
  };

  // 下载文档
  const handleDownloadDocument = async (doc: ApplicationDocument) => {
    try {
      const response = await downloadDocument(doc.id);
      if (response.success) {
        // 创建下载链接
        const link = window.document.createElement("a");
        link.href = response.data.downloadUrl;
        link.download = doc.fileName;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      }
    } catch (error) {
      console.error("下载文档失败:", error);
    }
  };

  // 关闭预览
  const closePreview = () => {
    previewState.visible = false;
    previewState.document = null;
    previewState.previewUrl = "";
  };

  // 获取文档大小显示
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 获取文档状态颜色
  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "info";
    }
  };

  // 获取文档状态文本
  const getDocumentStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "已通过";
      case "rejected":
        return "已拒绝";
      case "pending":
        return "待审核";
      default:
        return "未知";
    }
  };

  // 刷新所有数据
  const refreshData = async () => {
    await Promise.all([fetchApplicationDetail(), fetchReviewHistory()]);
  };

  // 初始化数据
  onMounted(() => {
    refreshData();
  });

  return {
    applicationId: applicationId.value,
    state,
    reviewHistory,
    historyLoading,
    previewState,
    fetchApplicationDetail,
    fetchReviewHistory,
    handlePreviewDocument,
    handleDownloadDocument,
    closePreview,
    formatFileSize,
    getDocumentStatusColor,
    getDocumentStatusText,
    refreshData
  };
}
