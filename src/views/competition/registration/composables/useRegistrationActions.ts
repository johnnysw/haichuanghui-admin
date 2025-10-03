import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { updateRegistrationStatus } from "../api";
import type { RegistrationListItem } from "../types/types";

function extractErrorMessage(error: any, fallback = "操作失败") {
  const apiMsg = error?.response?.data?.message;
  const msg = error?.message;
  return apiMsg || msg || fallback;
}

export function useRegistrationActions() {
  function approveRegistration(row: RegistrationListItem) {
    const targetName = row.teamName || row.contactName || `ID ${row.id}`;

    return ElMessageBox.confirm(
      `确认要通过「${targetName}」的报名申请吗？`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      }
    )
      .then(async () => {
        try {
          const result = await updateRegistrationStatus(row.id, 2);
          if (result.code === 200) {
            message("审核通过成功", { type: "success" });
            return true;
          }
          message(result.message || "审核通过失败", { type: "error" });
          return false;
        } catch (error) {
          message(extractErrorMessage(error, "审核通过失败"), { type: "error" });
          return false;
        }
      })
      .catch(() => {
        message("已取消审核", { type: "info" });
        return false;
      });
  }

  function rejectRegistration(row: RegistrationListItem) {
    const targetName = row.teamName || row.contactName || `ID ${row.id}`;

    return ElMessageBox.prompt(
      "请输入拒绝原因：",
      `拒绝「${targetName}」的报名`,
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: "拒绝原因长度应在 1-200 个字符之间",
        inputType: "textarea",
      }
    )
      .then(async ({ value }) => {
        try {
          const result = await updateRegistrationStatus(row.id, 3, value);
          if (result.code === 200) {
            message("已拒绝该报名", { type: "success" });
            return true;
          }
          message(result.message || "拒绝操作失败", { type: "error" });
          return false;
        } catch (error) {
          message(extractErrorMessage(error, "拒绝操作失败"), { type: "error" });
          return false;
        }
      })
      .catch(() => {
        message("已取消拒绝操作", { type: "info" });
        return false;
      });
  }

  return {
    approveRegistration,
    rejectRegistration,
  };
}