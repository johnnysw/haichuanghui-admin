import { ref } from "vue";
import { updateCompetition, reviewCompetition, recommendCompetition } from "../api";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import type { Competition } from "@/types/competition";

export function useCompetitionDetailActions() {
  const formRef = ref();

  // 保存大赛信息
  async function saveCompetition(id: number, data: Competition.CompetitionForm) {
    try {
      const result = await updateCompetition(id, data);
      if (result.code === 200) {
        message("保存成功", { type: "success" });
        return { success: true, data: result.data };
      } else {
        message("保存失败: " + result.message, { type: "error" });
        return { success: false, message: result.message };
      }
    } catch (error) {
      message("保存失败: " + error.message, { type: "error" });
      return { success: false, message: error.message };
    }
  }

  // 审核大赛
  async function reviewCompetitionAction(id: number, status: number, reviewComment?: string) {
    try {
      const result = await reviewCompetition(id, status, reviewComment);
      if (result.code === 200) {
        message("审核成功", { type: "success" });
        return { success: true, data: result.data };
      } else {
        message("审核失败: " + result.message, { type: "error" });
        return { success: false, message: result.message };
      }
    } catch (error) {
      message("审核失败: " + error.message, { type: "error" });
      return { success: false, message: error.message };
    }
  }

  // 推荐/取消推荐大赛
  async function toggleRecommendation(id: number, isRecommended: boolean) {
    try {
      const result = await recommendCompetition(id, isRecommended);
      if (result.code === 200) {
        const action = isRecommended ? "推荐" : "取消推荐";
        message(`${action}成功`, { type: "success" });
        return { success: true, data: result.data };
      } else {
        message(`${isRecommended ? "推荐" : "取消推荐"}失败: ` + result.message, { type: "error" });
        return { success: false, message: result.message };
      }
    } catch (error) {
      message(`${isRecommended ? "推荐" : "取消推荐"}失败: ` + error.message, { type: "error" });
      return { success: false, message: error.message };
    }
  }

  return {
    formRef,
    saveCompetition,
    reviewCompetitionAction,
    toggleRecommendation
  };
}