import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import type { Response } from "@/types/response";
import type { IncubatorDetail } from "../types/types";
import { getIncubatorDetail, updateIncubatorStatus } from "../api";

export function useIncubatorDetail(id: number) {
  // 响应式数据
  const loading = ref(false);
  const actionLoading = ref(false);
  const detail = ref<IncubatorDetail | null>(null);

  // 获取详情
  const fetchDetail = async () => {
    if (!id) return;
    
    loading.value = true;
    try {
      const response = await getIncubatorDetail(id);
      const { code, data, message } = response as Response<IncubatorDetail>;
      if (code === 200 && data) {
        detail.value = data;
      } else {
        ElMessage.error(message || "获取详情失败");
      }
    } catch (error) {
      console.error("获取孵化器详情失败:", error);
      ElMessage.error("获取详情失败");
    } finally {
      loading.value = false;
    }
  };

  // 更新状态
  const updateStatus = async (status: number, reason?: string) => {
    if (!id) return false;
    
    actionLoading.value = true;
    try {
      const response = await updateIncubatorStatus(id, status, reason);
      const { code, message } = response as Response<null>;
      if (code === 200) {
        ElMessage.success(message || "操作成功");
        if (detail.value) {
          detail.value.status = status;
        }
        return true;
      }

      ElMessage.error(message || "操作失败");
      return false;
    } catch (error) {
      console.error("更新状态失败:", error);
      ElMessage.error("操作失败");
      return false;
    } finally {
      actionLoading.value = false;
    }
  };

  // 获取状态信息
  const getStatusInfo = (status?: number) => {
    const targetStatus = status ?? detail.value?.status;
    switch (targetStatus) {
      case 1:
        return {
          label: "正常",
          text: "正常",
          type: "success" as const,
          color: "success"
        };
      case 2:
        return {
          label: "已下线",
          text: "已下线",
          type: "warning" as const,
          color: "warning"
        };
      case 3:
        return {
          label: "禁用",
          text: "禁用",
          type: "danger" as const,
          color: "danger"
        };
      default:
        return {
          label: "未知",
          text: "未知",
          type: "info" as const,
          color: "info"
        };
    }
  };

  // 计算属性
  const statusInfo = computed(() => getStatusInfo());

  return {
    // 响应式数据
    loading,
    actionLoading,
    detail,
    
    // 方法
    fetchDetail,
    updateStatus,
    getStatusInfo,
    
    // 计算属性
    statusInfo
  };
}