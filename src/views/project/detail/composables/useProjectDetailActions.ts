import { ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { reviewProject, toggleProjectRecommendation } from "../api";
import type { ProjectInfo } from "../types/types";
import { ProjectStatus } from "../types/types";

export function useProjectDetailActions() {
  const router = useRouter();
  const actionLoading = ref(false);

  // 返回列表
  const goBack = () => {
    router.push("/project/list");
  };

  // 审核项目
  const handleReview = async (project: ProjectInfo, status: number) => {
    let reviewComment = "";

    if (status === ProjectStatus.REJECTED) {
      try {
        const { value } = await ElMessageBox.prompt(
          "请输入拒绝原因：",
          "拒绝项目",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputPattern: /^.{1,200}$/,
            inputErrorMessage: "拒绝原因长度应在1-200个字符之间"
          }
        );
        reviewComment = value;
      } catch {
        return;
      }
    }

    const action = status === ProjectStatus.PUBLISHED ? "通过" : "拒绝";

    try {
      await ElMessageBox.confirm(
        `确认要${action}项目"${project.name}"吗？`,
        "确认操作",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      actionLoading.value = true;
      const result = await reviewProject(project.id, status, reviewComment);

      if (result.code === 200) {
        project.status = status;
        if (reviewComment) {
          project.reviewComment = reviewComment;
        }
        project.reviewTime = new Date().toISOString();
        message(`${action}成功`, { type: "success" });
      } else {
        message(`${action}失败: ${result.message}`, { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        message(`${action}失败`, { type: "error" });
      }
    } finally {
      actionLoading.value = false;
    }
  };

  // 切换推荐状态
  const handleToggleRecommend = async (project: ProjectInfo) => {
    const newRecommended = !project.isRecommended;
    const action = newRecommended ? "推荐" : "取消推荐";

    try {
      await ElMessageBox.confirm(
        `确认要${action}项目"${project.name}"吗？`,
        "确认操作",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      actionLoading.value = true;
      const response = await toggleProjectRecommendation(
        project.id,
        newRecommended
      );

      if (response.code === 200) {
        project.isRecommended = newRecommended;
        message(`${action}成功`, { type: "success" });
      } else {
        message(`${action}失败: ${response.message}`, { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        message(`${action}失败`, { type: "error" });
      }
    } finally {
      actionLoading.value = false;
    }
  };

  return {
    actionLoading,
    goBack,
    handleReview,
    handleToggleRecommend
  };
}
