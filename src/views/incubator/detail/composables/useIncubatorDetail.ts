import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import type { IncubatorDetail, IncubatorStats } from "../types/types";
import { getIncubatorDetail, getIncubatorStats, updateIncubatorStatus } from "../api";

export function useIncubatorDetail(id: number) {
  // 响应式数据
  const loading = ref(false);
  const statsLoading = ref(false);
  const actionLoading = ref(false);
  const detail = ref<IncubatorDetail | null>(null);
  const stats = ref<IncubatorStats | null>(null);

  // 获取详情
  const fetchDetail = async () => {
    if (!id) return;
    
    loading.value = true;
    try {
      const response = await getIncubatorDetail(id);
      if (response.success) {
        detail.value = response.data;
      } else {
        ElMessage.error(response.message || "获取详情失败");
      }
    } catch (error) {
      console.error("获取孵化器详情失败:", error);
      ElMessage.error("获取详情失败");
    } finally {
      loading.value = false;
    }
  };

  // 获取统计信息
  const fetchStats = async () => {
    if (!id) return;
    
    statsLoading.value = true;
    try {
      const response = await getIncubatorStats(id);
      if (response.success) {
        stats.value = response.data;
      } else {
        ElMessage.error(response.message || "获取统计信息失败");
      }
    } catch (error) {
      console.error("获取统计信息失败:", error);
      ElMessage.error("获取统计信息失败");
    } finally {
      statsLoading.value = false;
    }
  };

  // 更新状态
  const updateStatus = async (status: number, reason?: string) => {
    if (!id) return false;
    
    actionLoading.value = true;
    try {
      const response = await updateIncubatorStatus(id, status, reason);
      if (response.success) {
        ElMessage.success(response.message || "操作成功");
        // 更新本地状态
        if (detail.value) {
          detail.value.status = status;
        }
        return true;
      } else {
        ElMessage.error(response.message || "操作失败");
        return false;
      }
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
      case 0:
        return { 
          label: "已禁用",
          text: "已禁用", 
          type: "danger" as const, 
          color: "danger" 
        };
      case 1:
        return { 
          label: "正常",
          text: "正常", 
          type: "success" as const, 
          color: "success" 
        };
      case 2:
        return { 
          label: "审核中",
          text: "审核中", 
          type: "warning" as const, 
          color: "warning" 
        };
      case 3:
        return { 
          label: "已拒绝",
          text: "已拒绝", 
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

  // 获取类型标签 - 返回字符串用于直接显示
  const getTypeLabel = (type?: string) => {
    const targetType = type ?? detail.value?.type;
    switch (targetType) {
      case "科技园":
        return "科技园";
      case "science-park":
        return "科技园区";
      case "创业园":
        return "创业园";
      case "孵化器":
        return "孵化器";
      case "加速器":
        return "加速器";
      default:
        return targetType || "其他";
    }
  };

  // 获取类型标签样式信息 - 返回对象用于样式设置
  const getTypeInfo = (type?: string) => {
    const targetType = type ?? detail.value?.type;
    switch (targetType) {
      case "科技园":
        return {
          text: "科技园",
          type: "primary" as const,
          color: "#409eff"
        };
      case "science-park":
        return {
          text: "科技园区",
          type: "primary" as const,
          color: "#409eff"
        };
      case "创业园":
        return {
          text: "创业园",
          type: "success" as const,
          color: "#67c23a"
        };
      case "孵化器":
        return {
          text: "孵化器", 
          type: "warning" as const,
          color: "#e6a23c"
        };
      case "加速器":
        return {
          text: "加速器",
          type: "danger" as const,
          color: "#f56c6c"
        };
      default:
        return {
          text: targetType || "其他",
          type: "info" as const,
          color: "#909399"
        };
    }
  };

  // 计算属性
  const statusInfo = computed(() => getStatusInfo());
  const typeInfo = computed(() => getTypeInfo());

  return {
    // 响应式数据
    loading,
    statsLoading,
    actionLoading,
    detail,
    stats,
    
    // 方法
    fetchDetail,
    fetchStats,
    updateStatus,
    getStatusInfo,
    getTypeLabel,
    getTypeInfo,
    
    // 计算属性
    statusInfo,
    typeInfo
  };
}