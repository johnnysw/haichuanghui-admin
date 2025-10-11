import { ElMessage, ElMessageBox } from "element-plus";
import { toggleMemberStatus } from "../../api";
import type { MemberInfo } from "../../types/types";
import { MemberStatus } from "../../types/types";

export function useMemberActions(onRefresh: () => void) {
  /**
   * 切换会员状态（禁用/恢复）
   */
  const handleToggleStatus = async (member: MemberInfo) => {
    const isDisabled = member.status === MemberStatus.DISABLED;
    const actionText = isDisabled ? "恢复" : "禁用";
    const memberName = member.nickname || member.username;

    try {
      await ElMessageBox.confirm(
        `确定要${actionText}会员"${memberName}"吗？`,
        `确认${actionText}`,
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      );

      const response = await toggleMemberStatus(member.id);

      if (response.code === 200) {
        ElMessage.success(response.message || `${actionText}成功`);
        onRefresh();
      } else {
        ElMessage.error(response.message || `${actionText}失败`);
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error(`${actionText}会员失败:`, error);
        ElMessage.error(`${actionText}失败`);
      }
    }
  };

  return {
    handleToggleStatus
  };
}

