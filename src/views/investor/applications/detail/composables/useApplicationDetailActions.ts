import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import type { InvestorApplication, ReviewForm } from "../types/types";
import { reviewApplication, sendNotificationToApplicant, requestAdditionalDocuments, addReviewRecord } from "../api";

export function useApplicationDetailActions(onRefresh: () => void) {
  const router = useRouter();
  const actionLoading = ref(false);

  // 返回列表
  const goBack = () => {
    router.push("/investor/applications");
  };

  // 审核申请
  const handleReview = async (application: InvestorApplication, status: number, comment?: string) => {
    try {
      const statusText = status === 1 ? "通过" : "拒绝";
      let reviewComment = comment;

      if (!reviewComment) {
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
          reviewComment = value;
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
      }

      actionLoading.value = true;
      const reviewData: ReviewForm = {
        status,
        comment: reviewComment || ""
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

  // 要求补充材料
  const handleRequestDocuments = async (application: InvestorApplication) => {
    try {
      const { value } = await ElMessageBox.prompt(
        "请输入需要补充的材料要求",
        "要求补充材料",
        {
          confirmButtonText: "发送",
          cancelButtonText: "取消",
          inputType: "textarea",
          inputPattern: /.+/,
          inputErrorMessage: "请输入补充材料要求"
        }
      );

      actionLoading.value = true;
      const requirements = [value]; // 简化处理，实际可以支持多个要求
      
      const response = await requestAdditionalDocuments(application.id, requirements);
      
      if (response.success) {
        ElMessage.success("补充材料要求已发送");
        // 添加审核记录
        await addReviewRecord(application.id, `要求补充材料：${value}`);
        onRefresh();
      } else {
        ElMessage.error(response.message || "发送失败");
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("发送补充材料要求失败:", error);
        ElMessage.error("发送失败");
      }
    } finally {
      actionLoading.value = false;
    }
  };

  // 发送通知
  const handleSendNotification = async (application: InvestorApplication) => {
    try {
      const { value } = await ElMessageBox.prompt(
        "请输入要发送的通知内容",
        "发送通知",
        {
          confirmButtonText: "发送",
          cancelButtonText: "取消",
          inputType: "textarea",
          inputPattern: /.+/,
          inputErrorMessage: "请输入通知内容"
        }
      );

      actionLoading.value = true;
      
      const response = await sendNotificationToApplicant(application.id, value);
      
      if (response.success) {
        ElMessage.success("通知发送成功");
        // 添加审核记录
        await addReviewRecord(application.id, `发送通知：${value}`);
        onRefresh();
      } else {
        ElMessage.error(response.message || "发送失败");
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("发送通知失败:", error);
        ElMessage.error("发送失败");
      }
    } finally {
      actionLoading.value = false;
    }
  };

  // 添加审核备注
  const handleAddComment = async (application: InvestorApplication) => {
    try {
      const { value } = await ElMessageBox.prompt(
        "请输入审核备注",
        "添加备注",
        {
          confirmButtonText: "添加",
          cancelButtonText: "取消",
          inputType: "textarea",
          inputPattern: /.+/,
          inputErrorMessage: "请输入备注内容"
        }
      );

      actionLoading.value = true;
      
      const response = await addReviewRecord(application.id, value);
      
      if (response.success) {
        ElMessage.success("备注添加成功");
        onRefresh();
      } else {
        ElMessage.error(response.message || "添加失败");
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("添加备注失败:", error);
        ElMessage.error("添加失败");
      }
    } finally {
      actionLoading.value = false;
    }
  };

  // 打印申请信息
  const handlePrint = () => {
    window.print();
  };

  // 导出申请信息
  const handleExport = async (application: InvestorApplication) => {
    try {
      // 这里可以调用导出API
      ElMessage.success("导出功能开发中...");
    } catch (error) {
      console.error("导出失败:", error);
      ElMessage.error("导出失败");
    }
  };

  return {
    actionLoading,
    goBack,
    handleReview,
    handleRequestDocuments,
    handleSendNotification,
    handleAddComment,
    handlePrint,
    handleExport
  };
}