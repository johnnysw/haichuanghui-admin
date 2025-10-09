import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import type { ProjectInfo } from "../types/types";
import { useRouter } from "vue-router";
import { deleteProject } from "../api";

export function useProjectActions(onRefresh?: () => void) {
  const router = useRouter();

  function openDetail(row: ProjectInfo) {
    router.push(`/project/detail/${row.id}`);
  }

  function handleDelete(row: ProjectInfo) {
    ElMessageBox.confirm(
      `确认要删除项目名为"${row.name}"的这条数据吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true
      }
    )
      .then(async () => {
        const result = await deleteProject(row.id);
        if (result.code === 200) {
          message("删除成功", { type: "success" });
          onRefresh?.(); // 刷新数据
        } else {
          message("删除失败: " + result.message, { type: "error" });
        }
      })
      .catch(() => {
        message("已取消删除", { type: "info" });
      });
  }

  return {
    openDetail,
    handleDelete
  };
}
