import { ElMessage, ElMessageBox } from "element-plus";
import { toggleInvestorStatus } from "../api";
import type { InvestorInfo } from "../../types/types";
import { InvestorStatus } from "../../types/types";

export function useInvestorActions(onRefresh: () => void) {
  /**
   * 切换投资人状态（禁用/恢复）
   */
  const handleToggleStatus = async (investor: InvestorInfo) => {
    const isDisabled = investor.status === InvestorStatus.DISABLED;
    const actionText = isDisabled ? "恢复" : "禁用";
    const investorName = investor.name || investor.investmentInstitution;

    try {
      await ElMessageBox.confirm(
        `确定要${actionText}投资人"${investorName}"吗？`,
        `确认${actionText}`,
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      );

      const response = await toggleInvestorStatus(investor.id);

      if (response.code === 200) {
        ElMessage.success(response.message || `${actionText}成功`);
        onRefresh();
      } else {
        ElMessage.error(response.message || `${actionText}失败`);
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error(`${actionText}投资人失败:`, error);
        ElMessage.error(`${actionText}失败`);
      }
    }
  };

  return {
    handleToggleStatus
  };
}
