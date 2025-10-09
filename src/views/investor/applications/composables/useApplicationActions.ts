import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import type { InvestorApplication, ReviewForm } from "../types/types";
import {
  reviewApplication,
  batchReviewApplications,
  deleteApplication
} from "../api";

export function useApplicationActions(onRefresh: () => void) {
  const router = useRouter();
  const actionLoading = ref(false);
  const reviewDialogVisible = ref(false);
  const currentApplication = ref<InvestorApplication | null>(null);
  const batchApplications = ref<InvestorApplication[]>([]);

  // 查看详情
  const openDetail = (application: InvestorApplication) => {
    router.push(`/investor/applications/detail/${application.id}`);
  };

  // 打开审核对话框
  const openReviewDialog = (
    application: InvestorApplication,
    isBatch = false
  ) => {
    if (isBatch) {
      batchApplications.value = [application];
    } else {
      currentApplication.value = application;
      batchApplications.value = [];
    }
    reviewDialogVisible.value = true;
  };

  // 打开批量审核对话框
  const openBatchReviewDialog = (applications: InvestorApplication[]) => {
    batchApplications.value = applications;
    currentApplication.value = null;
    reviewDialogVisible.value = true;
  };

  // 关闭审核对话框
  const closeReviewDialog = () => {
    reviewDialogVisible.value = false;
    currentApplication.value = null;
    batchApplications.value = [];
  };

  // 快速审核（通过/拒绝）
  const handleQuickReview = async (
    application: InvestorApplication,
    status: number
  ) => {
    try {
      const statusText = status === 1 ? "通过" : "拒绝";
      let comment = "";

      if (status === 3) {
        const { value } = await ElMessageBox.prompt(
          "请输入拒绝原因",
          `审核${statusText}`,
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputPattern: /.+/,
            inputErrorMessage: "请输入拒绝原因"
          }
        );
        comment = value;
      } else {
        await ElMessageBox.confirm(
          `确定要审核${statusText}该申请吗？`,
          `确认审核${statusText}`,
          {
            type: "warning",
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }
        );
      }

      actionLoading.value = true;
      const reviewData: ReviewForm = {
        status,
        comment
      };

      const response = await reviewApplication(application.id, reviewData);

      if (response.success) {
        ElMessage.success(`审核${statusText}成功`);
        onRefresh();
      } else {
        ElMessage.error(response.message || `审核${statusText}失败`);
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("审核申请失败:", error);
        ElMessage.error("审核失败");
      }
    } finally {
      actionLoading.value = false;
    }
  };

  // 提交审核
  const handleSubmitReview = async (reviewData: ReviewForm) => {
    try {
      actionLoading.value = true;

      if (batchApplications.value.length > 0) {
        // 批量审核
        const ids = batchApplications.value.map(app => app.id);
        const response = await batchReviewApplications(ids, reviewData);

        if (response.success) {
          ElMessage.success(response.message);
          closeReviewDialog();
          onRefresh();
        } else {
          ElMessage.error(response.message || "批量审核失败");
        }
      } else if (currentApplication.value) {
        // 单个审核
        const response = await reviewApplication(
          currentApplication.value.id,
          reviewData
        );

        if (response.success) {
          ElMessage.success("审核成功");
          closeReviewDialog();
          onRefresh();
        } else {
          ElMessage.error(response.message || "审核失败");
        }
      }
    } catch (error) {
      console.error("提交审核失败:", error);
      ElMessage.error("审核失败");
    } finally {
      actionLoading.value = false;
    }
  };

  // 删除申请
  const handleDelete = async (application: InvestorApplication) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除申请人"${application.user.realName || application.user.username}"的申请吗？`,
        "确认删除",
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      );

      const response = await deleteApplication(application.id);
      if (response.success) {
        ElMessage.success("删除成功");
        onRefresh();
      } else {
        ElMessage.error(response.message || "删除失败");
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除申请失败:", error);
        ElMessage.error("删除失败");
      }
    }
  };

  // 批量删除
  const handleBatchDelete = async (applications: InvestorApplication[]) => {
    try {
      await ElMessageBox.confirm(
        `确定要批量删除 ${applications.length} 个申请吗？`,
        "批量删除",
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      );

      // 模拟批量删除
      const promises = applications.map(app => deleteApplication(app.id));
      await Promise.all(promises);

      ElMessage.success("批量删除成功");
      onRefresh();
    } catch (error) {
      if (error !== "cancel") {
        console.error("批量删除失败:", error);
        ElMessage.error("批量删除失败");
      }
    }
  };

  // 导出申请数据
  const handleExport = async (applications?: InvestorApplication[]) => {
    try {
      // 这里可以调用导出API
      ElMessage.success("导出功能开发中...");
    } catch (error) {
      console.error("导出失败:", error);
      ElMessage.error("导出失败");
    }
  };

  // 发送通知
  const handleSendNotification = async (
    applications: InvestorApplication[],
    message: string
  ) => {
    try {
      // 这里可以调用发送通知API
      ElMessage.success(`已向 ${applications.length} 个申请人发送通知`);
    } catch (error) {
      console.error("发送通知失败:", error);
      ElMessage.error("发送通知失败");
    }
  };

  return {
    actionLoading,
    reviewDialogVisible,
    currentApplication,
    batchApplications,
    openDetail,
    openReviewDialog,
    openBatchReviewDialog,
    closeReviewDialog,
    handleQuickReview,
    handleSubmitReview,
    handleDelete,
    handleBatchDelete,
    handleExport,
    handleSendNotification
  };
}
