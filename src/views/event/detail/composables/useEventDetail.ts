import { ref, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getEventDetail,
  getEventStats,
  updateEventStatus,
  toggleEventRecommend
} from "../api/index";
import type {
  EventDetail,
  EventStats,
  StatusInfo,
  TypeInfo
} from "../types/types";

export function useEventDetail() {
  const loading = ref(false);
  const statsLoading = ref(false);
  const actionLoading = ref(false);
  const detail = ref<EventDetail | null>(null);
  const stats = ref<EventStats | null>(null);

  // 获取详情
  const fetchDetail = async (id: number) => {
    loading.value = true;
    try {
      console.log("正在获取活动详情, ID:", id);
      const response = await getEventDetail(id);
      console.log("获取详情成功:", response);
      detail.value = response.data;
    } catch (error) {
      console.error("获取活动详情失败:", error);
      ElMessage.error(`获取详情失败: ${error.message || "数据不存在"}`);
      detail.value = null;
    } finally {
      loading.value = false;
    }
  };

  // 获取统计数据
  const fetchStats = async (id: number) => {
    statsLoading.value = true;
    try {
      const response = await getEventStats(id);
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
      await updateEventStatus(id, status, note);
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

  // 取消活动
  const handleCancel = async () => {
    if (!detail.value) return;

    try {
      const { value: note } = await ElMessageBox.prompt(
        `请输入取消原因：`,
        `取消活动 - ${detail.value.title}`,
        {
          confirmButtonText: "确认取消",
          cancelButtonText: "取消操作",
          inputType: "textarea",
          inputPlaceholder: "请输入取消原因",
          inputValidator: value => {
            if (!value || value.trim().length === 0) {
              return "请输入取消原因";
            }
            return true;
          }
        }
      );

      await updateStatus(detail.value.id, 3, note);
    } catch (error) {
      // 用户取消操作
    }
  };

  // 重新激活活动
  const handleReactivate = async () => {
    if (!detail.value) return;

    try {
      await ElMessageBox.confirm(
        `确认重新激活活动「${detail.value.title}」吗？`,
        "重新激活确认",
        {
          confirmButtonText: "确认激活",
          cancelButtonText: "取消",
          type: "success"
        }
      );

      await updateStatus(detail.value.id, 0);
    } catch (error) {
      // 用户取消操作
    }
  };

  // 切换推荐状态
  const handleToggleRecommend = async () => {
    if (!detail.value) return;

    const newRecommendStatus = !detail.value.isRecommended;
    const action = newRecommendStatus ? "推荐" : "取消推荐";

    try {
      await ElMessageBox.confirm(
        `确认${action}活动「${detail.value.title}」吗？`,
        `${action}确认`,
        {
          confirmButtonText: `确认${action}`,
          cancelButtonText: "取消",
          type: newRecommendStatus ? "success" : "warning"
        }
      );

      actionLoading.value = true;
      await toggleEventRecommend(detail.value.id, newRecommendStatus);
      ElMessage.success(`${action}成功`);

      // 重新获取详情
      await fetchDetail(detail.value.id);
    } catch (error) {
      console.error(`${action}失败:`, error);
      ElMessage.error(`${action}失败`);
    } finally {
      actionLoading.value = false;
    }
  };

  // 获取状态信息
  const getStatusInfo = computed((): StatusInfo => {
    if (!detail.value) return { label: "未知", type: "info" };

    switch (detail.value.status) {
      case 0:
        return { label: "报名中", type: "primary" };
      case 1:
        return { label: "进行中", type: "success" };
      case 2:
        return { label: "已结束", type: "info" };
      case 3:
        return { label: "已取消", type: "danger" };
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
      case "创业培训":
        return {
          label: type,
          color: "#1890ff",
          bgColor: "#e6f7ff"
        };
      case "项目路演":
        return {
          label: type,
          color: "#fa8c16",
          bgColor: "#fff7e6"
        };
      case "投融资对接":
        return {
          label: type,
          color: "#52c41a",
          bgColor: "#f6ffed"
        };
      case "行业论坛":
        return {
          label: type,
          color: "#722ed1",
          bgColor: "#f9f0ff"
        };
      case "创业沙龙":
        return {
          label: type,
          color: "#eb2f96",
          bgColor: "#fff0f6"
        };
      case "政策宣讲":
        return {
          label: type,
          color: "#13c2c2",
          bgColor: "#e6fffb"
        };
      default:
        return {
          label: type || "未知类型",
          color: "#8c8c8c",
          bgColor: "#f5f5f5"
        };
    }
  };

  // 计算进度百分比
  const getProgressPercentage = computed((): number => {
    if (!detail.value) return 0;

    const now = new Date().getTime();
    const startTime = new Date(detail.value.startTime).getTime();
    const endTime = new Date(detail.value.endTime).getTime();

    if (now < startTime) return 0;
    if (now > endTime) return 100;

    return Math.round(((now - startTime) / (endTime - startTime)) * 100);
  });

  // 计算报名进度
  const getRegistrationProgress = computed((): number => {
    if (!detail.value || !detail.value.maxParticipants) return 0;
    return Math.round(
      (detail.value.participantCount / detail.value.maxParticipants) * 100
    );
  });

  return {
    loading,
    statsLoading,
    actionLoading,
    detail,
    stats,
    fetchDetail,
    fetchStats,
    updateStatus,
    handleCancel,
    handleReactivate,
    handleToggleRecommend,
    getStatusInfo,
    getTypeLabel,
    getTypeInfo,
    getProgressPercentage,
    getRegistrationProgress
  };
}
