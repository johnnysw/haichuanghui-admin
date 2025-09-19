import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import type { InvestorInfo, InvestorForm } from "../types/types";
import { deleteInvestor, reviewInvestor, toggleInvestorRecommendation } from "../api";

export function useInvestorActions(onRefresh: () => void) {
  const router = useRouter();
  const dialogVisible = ref(false);
  const dialogTitle = ref("");
  const currentInvestor = ref<InvestorInfo | null>(null);
  const isEdit = ref(false);

  // 查看详情
  const openDetail = (investor: InvestorInfo) => {
    router.push(`/investor/detail/${investor.id}`);
  };

  // 打开编辑对话框
  const openDialog = (investor?: InvestorInfo) => {
    isEdit.value = !!investor;
    dialogTitle.value = isEdit.value ? "编辑投资人" : "添加投资人";
    currentInvestor.value = investor || null;
    dialogVisible.value = true;
  };

  // 关闭对话框
  const closeDialog = () => {
    dialogVisible.value = false;
    currentInvestor.value = null;
  };

  // 删除投资人
  const handleDelete = async (investor: InvestorInfo) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除投资人"${investor.user?.realName || investor.investmentInstitution}"吗？`,
        "确认删除",
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      );

      const response = await deleteInvestor(investor.id);
      if (response.success) {
        ElMessage.success("删除成功");
        onRefresh();
      } else {
        ElMessage.error(response.message || "删除失败");
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除投资人失败:", error);
        ElMessage.error("删除失败");
      }
    }
  };

  // 审核投资人
  const handleReview = async (investor: InvestorInfo, status: number, comment?: string) => {
    try {
      const statusText = status === 1 ? "通过" : "拒绝";
      
      if (!comment && status === 3) {
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
      }

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
    }
  };

  // 切换推荐状态
  const handleToggleRecommendation = async (investor: InvestorInfo) => {
    try {
      const action = investor.isFeatured ? "取消推荐" : "推荐";
      await ElMessageBox.confirm(
        `确定要${action}投资人"${investor.user?.realName || investor.investmentInstitution}"吗？`,
        `确认${action}`,
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      );

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
    }
  };

  // 批量审核
  const handleBatchReview = async (investors: InvestorInfo[], status: number, comment?: string) => {
    try {
      const statusText = status === 1 ? "通过" : "拒绝";
      
      await ElMessageBox.confirm(
        `确定要批量审核${statusText} ${investors.length} 个投资人吗？`,
        `批量审核${statusText}`,
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      );

      // 模拟批量审核
      const promises = investors.map(investor => reviewInvestor(investor.id, status, comment));
      await Promise.all(promises);
      
      ElMessage.success(`批量审核${statusText}成功`);
      onRefresh();
    } catch (error) {
      if (error !== "cancel") {
        console.error("批量审核失败:", error);
        ElMessage.error("批量审核失败");
      }
    }
  };

  // 批量删除
  const handleBatchDelete = async (investors: InvestorInfo[]) => {
    try {
      await ElMessageBox.confirm(
        `确定要批量删除 ${investors.length} 个投资人吗？`,
        "批量删除",
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      );

      // 模拟批量删除
      const promises = investors.map(investor => deleteInvestor(investor.id));
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

  return {
    dialogVisible,
    dialogTitle,
    currentInvestor,
    isEdit,
    openDetail,
    openDialog,
    closeDialog,
    handleDelete,
    handleReview,
    handleToggleRecommendation,
    handleBatchReview,
    handleBatchDelete
  };
}