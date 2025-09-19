import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";
import { getProjectDetail } from "../api";
import type { ProjectInfo } from "../types/types";

export function useProjectDetail() {
  const route = useRoute();
  const projectId = Number(route.params.id);
  
  const projectInfo = ref<ProjectInfo | null>(null);
  const loading = ref(true);

  // 获取项目详情
  const fetchProjectDetail = async () => {
    if (!projectId) {
      message("项目ID无效", { type: "error" });
      return;
    }

    loading.value = true;
    try {
      const result = await getProjectDetail(projectId);
      if (result.code === 200) {
        projectInfo.value = result.data;
      } else {
        message("获取项目详情失败: " + result.message, { type: "error" });
      }
    } catch (error) {
      console.error("获取项目详情失败:", error);
      message("获取项目详情失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchProjectDetail();
  });

  return {
    projectId,
    projectInfo,
    loading,
    fetchProjectDetail
  };
}