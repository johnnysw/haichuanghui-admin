import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { updateRegistrationStatus } from "../api";
import type { RegistrationItem } from "../types/types";

export function useRegistrationActions() {
  // 审核通过
  function approveRegistration(row: RegistrationItem) {
    ElMessageBox.confirm(
      `确认要通过用户${row.user?.username}的报名申请吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true
      }
    )
      .then(async () => {
        try {
          const result = await updateRegistrationStatus(row.id, 1);
          if (result.code === 200) {
            message("审核通过成功", { type: "success" });
            return true;
          } else {
            message("审核通过失败: " + result.message, { type: "error" });
            return false;
          }
        } catch (error) {
          message("审核通过失败: " + error.message, { type: "error" });
          return false;
        }
      })
      .catch(() => {
        message("已取消审核", { type: "info" });
        return false;
      });
  }

  // 拒绝报名
  function rejectRegistration(row: RegistrationItem) {
    ElMessageBox.prompt(
      `请输入拒绝原因：`,
      "拒绝报名",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: "拒绝原因长度应在1-200个字符之间"
      }
    )
      .then(async ({ value }) => {
        try {
          const result = await updateRegistrationStatus(row.id, 2, value);
          if (result.code === 200) {
            message("拒绝成功", { type: "success" });
            return true;
          } else {
            message("拒绝失败: " + result.message, { type: "error" });
            return false;
          }
        } catch (error) {
          message("拒绝失败: " + error.message, { type: "error" });
          return false;
        }
      })
      .catch(() => {
        message("已取消拒绝", { type: "info" });
        return false;
      });
  }

  return {
    approveRegistration,
    rejectRegistration
  };
}