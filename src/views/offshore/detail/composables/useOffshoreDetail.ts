import { ref, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getOffshoreDetail, updateOffshoreStatus } from "../api";
import type {
  OffshoreCenterDetail,
  OffshoreStats,
  StatusInfo,
  TypeInfo
} from "../types/types";
import { getFullImageUrl } from "@/utils/image";

const STATUS_MAP: Record<number, StatusInfo> = {
  1: { label: "正常运营", type: "success" },
  2: { label: "已下线", type: "warning" },
  3: { label: "已禁用", type: "danger" }
};

export function useOffshoreDetail() {
  const loading = ref(false);
  const actionLoading = ref(false);
  const detail = ref<OffshoreCenterDetail | null>(null);
  const stats = ref<OffshoreStats | null>(null);

  const fetchDetail = async (id: number) => {
    loading.value = true;
    try {
      const response = await getOffshoreDetail(id);
      if (response.code === 200 && response.data) {
        const data = response.data;
        if (data.logo) {
          data.logo = getFullImageUrl(data.logo);
        }
        detail.value = data;
        stats.value = {
          todayViews: 0,
          monthlyViews: 0,
          applications: 0,
          favorites: data.favorites ?? 0,
          totalViews: data.totalViews ?? data.viewCount ?? 0
        };
      } else {
        ElMessage.error(response.message || "获取详情失败");
        detail.value = null;
        stats.value = null;
      }
    } catch (error: any) {
      console.error("获取离岸中心详情失败:", error);
      ElMessage.error(error?.message || "获取详情失败");
      detail.value = null;
      stats.value = null;
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (id: number, status: number, reason?: string) => {
    actionLoading.value = true;
    try {
      const response = await updateOffshoreStatus(id, status, reason);
      if (response.code === 200) {
        ElMessage.success(response.message || "状态更新成功");
        if (detail.value) {
          detail.value.status = status;
        }
        return true;
      }
      ElMessage.error(response.message || "状态更新失败");
      return false;
    } catch (error: any) {
      console.error("状态更新失败:", error);
      ElMessage.error(error?.message || "状态更新失败");
      return false;
    } finally {
      actionLoading.value = false;
    }
  };

  const handleToggleOnline = async () => {
    if (!detail.value) return;
    const isOnline = detail.value.status === 1;
    const newStatus = isOnline ? 2 : 1;
    const actionText = isOnline ? "下线" : "上线";
    try {
      await ElMessageBox.confirm(
        `确定要${actionText} "${detail.value.name}" 吗？`,
        `${actionText}离岸中心`,
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );
      const success = await updateStatus(detail.value.id, newStatus);
      if (success) {
        await fetchDetail(detail.value.id);
      }
    } catch {
      // 用户取消
    }
  };

  const handleToggleDisable = async () => {
    if (!detail.value) return;
    const isDisabled = detail.value.status === 3;
    const newStatus = isDisabled ? 1 : 3;
    const actionText = isDisabled ? "解除禁用" : "禁用";
    try {
      await ElMessageBox.confirm(
        `确定要${actionText} "${detail.value.name}" 吗？`,
        `${actionText}离岸中心`,
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: isDisabled ? "info" : "warning"
        }
      );
      const success = await updateStatus(detail.value.id, newStatus);
      if (success) {
        await fetchDetail(detail.value.id);
      }
    } catch {
      // 用户取消
    }
  };

  const getStatusInfo = computed<StatusInfo>(() => {
    if (!detail.value) return { label: "未知", type: "info" };
    return (
      STATUS_MAP[detail.value.status ?? 1] || { label: "未知", type: "info" }
    );
  });

  const getTypeLabel = (centerType?: { name?: string; code?: string }) => {
    if (!centerType) return "未知类型";
    return centerType.name || centerType.code || "未知类型";
  };

  const getTypeInfo = (centerType?: { name?: string; code?: string }) => {
    const typeLabel = getTypeLabel(centerType);
    return {
      label: typeLabel,
      color: centerType?.color || "#2563eb",
      bgColor: centerType?.color ? `${centerType.color}20` : "#eff6ff"
    } as TypeInfo;
  };

  return {
    loading,
    actionLoading,
    detail,
    stats,
    fetchDetail,
    updateStatus,
    handleToggleOnline,
    handleToggleDisable,
    getStatusInfo,
    getTypeLabel,
    getTypeInfo
  };
}
