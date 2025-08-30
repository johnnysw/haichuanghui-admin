import { ref, reactive } from "vue";
import { getCompetitionDetail } from "@/views/competition/list/api";
import type { CompetitionInfo } from "@/views/competition/list/types/types";

export function useCompetitionDetail() {
  const competitionData = ref<CompetitionInfo | null>(null);
  const loading = ref<boolean>(false);

  // 状态映射
  const statusMap: Record<number, string> = {
    0: "草稿",
    1: "报名中",
    2: "进行中",
    3: "已结束",
    4: "已取消",
    5: "审核中",
    6: "已拒绝"
  };

  // 获取大赛详情
  const fetchCompetitionDetail = async (id: number) => {
    try {
      loading.value = true;
      const result = await getCompetitionDetail(id);
      if (result.code === 200) {
        competitionData.value = result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("获取大赛详情失败:", error);
      competitionData.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    competitionData,
    loading,
    statusMap,
    fetchCompetitionDetail
  };
}