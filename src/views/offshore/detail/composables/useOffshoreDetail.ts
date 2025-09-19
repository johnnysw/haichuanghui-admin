import { ref, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getOffshoreDetail, getOffshoreStats, updateOffshoreStatus } from "../api/index";
import type { OffshoreDetail, OffshoreStats, StatusInfo, TypeInfo } from "../types/types";

export function useOffshoreDetail() {
  const loading = ref(false);
  const statsLoading = ref(false);
  const actionLoading = ref(false);
  const detail = ref<OffshoreDetail | null>(null);
  const stats = ref<OffshoreStats | null>(null);

  // 获取详情
  const fetchDetail = async (id: number) => {
    loading.value = true;
    try {
      console.log("正在获取离岸中心详情, ID:", id);
      const response = await getOffshoreDetail(id);
      console.log("获取详情成功:", response);
      detail.value = response.data;
    } catch (error) {
      console.error("获取离岸中心详情失败:", error);
      ElMessage.error(`获取详情失败: ${error.message || '数据不存在'}`);
      detail.value = null;
    } finally {
      loading.value = false;
    }
  };

  // 获取统计数据
  const fetchStats = async (id: number) => {
    statsLoading.value = true;
    try {
      const response = await getOffshoreStats(id);
      stats.value = response.data;
    } catch (error) {
      console.error("获取统计数据失败:", error);
      stats.value = null;
    } finally {
      statsLoading.value = false;
    }
  };

  // 更新状态
  const updateStatus = async (id: number, status: number, note?: string) => {
    actionLoading.value = true;
    try {
      await updateOffshoreStatus(id, status, note);
      ElMessage.success("状态更新成功");
      // 重新获取详情
      await fetchDetail(id);
    } catch (error) {
      console.error("状态更新失败:", error);
      ElMessage.error("状态更新失败");
    } finally {
      actionLoading.value = false;
    }
  };

  // 审核通过
  const handleApprove = async () => {
    if (!detail.value) return;
    
    try {
      await ElMessageBox.confirm(
        `确认审核通过离岸中心「${detail.value.name}」吗？`,
        "审核确认",
        {
          confirmButtonText: "确认通过",
          cancelButtonText: "取消",
          type: "success"
        }
      );
      
      await updateStatus(detail.value.id, 1);
    } catch (error) {
      // 用户取消操作
    }
  };

  // 审核拒绝
  const handleReject = async () => {
    if (!detail.value) return;
    
    try {
      const { value: note } = await ElMessageBox.prompt(
        `请输入拒绝理由：`,
        `审核拒绝 - ${detail.value.name}`,
        {
          confirmButtonText: "确认拒绝",
          cancelButtonText: "取消",
          inputType: "textarea",
          inputPlaceholder: "请输入拒绝理由",
          inputValidator: (value) => {
            if (!value || value.trim().length === 0) {
              return "请输入拒绝理由";
            }
            return true;
          }
        }
      );
      
      await updateStatus(detail.value.id, 0, note);
    } catch (error) {
      // 用户取消操作
    }
  };

  // 切换启用/禁用状态
  const handleToggleStatus = async () => {
    if (!detail.value) return;
    
    const newStatus = detail.value.status === 0 ? 1 : 0;
    const action = newStatus === 1 ? "启用" : "禁用";
    
    try {
      await ElMessageBox.confirm(
        `确认${action}离岸中心「${detail.value.name}」吗？`,
        `${action}确认`,
        {
          confirmButtonText: `确认${action}`,
          cancelButtonText: "取消",
          type: newStatus === 1 ? "success" : "warning"
        }
      );
      
      await updateStatus(detail.value.id, newStatus);
    } catch (error) {
      // 用户取消操作
    }
  };

  // 获取状态信息
  const getStatusInfo = computed((): StatusInfo => {
    if (!detail.value) return { label: "未知", type: "info" };
    
    switch (detail.value.status) {
      case 0:
        return { label: "已禁用", type: "danger" };
      case 1:
        return { label: "正常运营", type: "success" };
      case 2:
        return { label: "待审核", type: "warning" };
      default:
        return { label: "未知状态", type: "info" };
    }
  });

  // 获取类型标签
  const getTypeLabel = (type?: string): string => {
    if (!type) return "未知类型";
    return type;
  };

  // 获取类型信息
  const getTypeInfo = (type?: string): TypeInfo => {
    switch (type) {
      case "科技园":
        return {
          label: type,
          color: "#722ed1",
          bgColor: "#f9f0ff"
        };
      case "孵化器":
        return {
          label: type,
          color: "#1890ff",
          bgColor: "#e6f7ff"
        };
      case "加速器":
        return {
          label: type,
          color: "#fa8c16",
          bgColor: "#fff7e6"
        };
      case "创业园":
        return {
          label: type,
          color: "#52c41a",
          bgColor: "#f6ffed"
        };
      case "研究院":
        return {
          label: type,
          color: "#eb2f96",
          bgColor: "#fff0f6"
        };
      default:
        return {
          label: type || "未知类型",
          color: "#8c8c8c",
          bgColor: "#f5f5f5"
        };
    }
  };

  return {
    loading,
    statsLoading,
    actionLoading,
    detail,
    stats,
    fetchDetail,
    fetchStats,
    updateStatus,
    handleApprove,
    handleReject,
    handleToggleStatus,
    getStatusInfo,
    getTypeLabel,
    getTypeInfo
  };
}