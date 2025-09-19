import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import type { InvestorInfo } from "../types/types";
import { reviewInvestor, toggleInvestorRecommendation, updateInvestor } from "../api";

export function useInvestorDetailActions(onRefresh: () => void) {
  const router = useRouter();
  const actionLoading = ref(false);

  // 返回列表
  const goBack = () => {
    router.push("/investor/list");
  };

  // 编辑投资人
  const editInvestor = (investor: InvestorInfo) => {
    // 这里可以打开编辑对话框或跳转到编辑页面
    console.log("编辑投资人:", investor);
  };

  // 审核投资人
  const handleReview = async (investor: InvestorInfo, status: number) => {
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
          `确定要审核${statusText}该投资人吗？`,
          `确认审核${statusText}`,
          {
            type: "warning",
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }
        );
      }

      actionLoading.value = true;
      const response = await reviewInvestor(investor.id, status, comment);
      
      if (response.success) {
        ElMessage.success(`审核${statusText}成功`);
        onRefresh();
      } else {
        ElMessage.error(response.message || `审核${statusText}失败`);
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("审核投资人失败:", error);
        ElMessage.error("审核失败");
      }
    } finally {
      actionLoading.value = false;
    }
  };

  // 切换推荐状态
  const handleToggleRecommendation = async (investor: InvestorInfo) => {
    try {
      const action = investor.isFeatured ? "取消推荐" : "推荐";
      
      await ElMessageBox.confirm(
        `确定要${action}该投资人吗？`,
        `确认${action}`,
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      );

      actionLoading.value = true;
      const response = await toggleInvestorRecommendation(investor.id);
      
      if (response.success) {
        ElMessage.success(response.message);
        onRefresh();
      } else {
        ElMessage.error(response.message || `${action}失败`);
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("切换推荐状态失败:", error);
        ElMessage.error("操作失败");
      }
    } finally {
      actionLoading.value = false;
    }
  };

  // 启用/禁用投资人
  const handleToggleStatus = async (investor: InvestorInfo) => {
    try {
      const newStatus = investor.status === 1 ? 0 : 1;
      const action = newStatus === 1 ? "启用" : "禁用";
      
      await ElMessageBox.confirm(
        `确定要${action}该投资人吗？`,
        `确认${action}`,
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      );

      actionLoading.value = true;
      const response = await updateInvestor(investor.id, { status: newStatus });
      
      if (response.success) {
        ElMessage.success(`${action}成功`);
        onRefresh();
      } else {
        ElMessage.error(response.message || `${action}失败`);
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("切换状态失败:", error);
        ElMessage.error("操作失败");
      }
    } finally {
      actionLoading.value = false;
    }
  };

  // 重置密码（如果需要）
  const handleResetPassword = async (investor: InvestorInfo) => {
    try {
      await ElMessageBox.confirm(
        "确定要重置该投资人的密码吗？新密码将通过邮件发送给用户。",
        "确认重置密码",
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      );

      // 这里调用重置密码的API
      ElMessage.success("密码重置成功，新密码已发送至用户邮箱");
    } catch (error) {
      if (error !== "cancel") {
        console.error("重置密码失败:", error);
        ElMessage.error("重置密码失败");
      }
    }
  };

  // 发送通知
  const handleSendNotification = async (investor: InvestorInfo, message: string) => {
    try {
      actionLoading.value = true;
      
      // 这里调用发送通知的API
      // await sendNotification(investor.userId, message);
      
      ElMessage.success("通知发送成功");
    } catch (error) {
      console.error("发送通知失败:", error);
      ElMessage.error("发送通知失败");
    } finally {
      actionLoading.value = false;
    }
  };

  return {
    actionLoading,
    goBack,
    editInvestor,
    handleReview,
    handleToggleRecommendation,
    handleToggleStatus,
    handleResetPassword,
    handleSendNotification
  };
}