import { ref, reactive, computed } from "vue";
import { getMemberStats, type MemberStatsParams, type StatsItem, type StatsSummary } from "../api/index";
import { message } from "@/utils/message";

export function useMemberStats() {
  // 粒度
  const granularity = ref<"daily" | "weekly" | "monthly">("daily");

  // 日期范围
  const dateRange = ref<[Date, Date] | null>(null);

  // 加载状态
  const loading = ref(false);

  // 数据系列
  const series = ref<StatsItem[]>([]);

  // 汇总信息
  const summary = reactive<StatsSummary>({
    total: 0,
    avg: 0,
    peak: {
      period: "",
      label: "",
      count: 0
    }
  });

  // 计算默认日期范围
  const getDefaultDateRange = (gran: "daily" | "weekly" | "monthly"): [Date, Date] => {
    const end = new Date();
    const start = new Date();

    if (gran === "daily") {
      start.setDate(start.getDate() - 29); // 最近30天
    } else if (gran === "weekly") {
      start.setDate(start.getDate() - 11 * 7); // 最近12周
    } else if (gran === "monthly") {
      start.setMonth(start.getMonth() - 11); // 最近12个月
    }

    return [start, end];
  };

  // 初始化日期范围
  if (!dateRange.value) {
    dateRange.value = getDefaultDateRange(granularity.value);
  }

  // 格式化日期为 YYYY-MM-DD
  const formatDate = (date: Date | string): string => {
    // 如果已经是字符串格式，直接返回
    if (typeof date === "string") {
      return date;
    }
    // 否则格式化 Date 对象
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 切换粒度时更新日期范围
  const onGranularityChange = (gran: "daily" | "weekly" | "monthly") => {
    granularity.value = gran;
    dateRange.value = getDefaultDateRange(gran);
    fetchMemberStats();
  };

  // 获取统计数据
  const fetchMemberStats = async () => {
    if (!dateRange.value) {
      message("请选择日期范围", { type: "warning" });
      return;
    }

    loading.value = true;

    try {
      const [startDate, endDate] = dateRange.value;
      const params: MemberStatsParams = {
        granularity: granularity.value,
        start: formatDate(startDate),
        end: formatDate(endDate)
      };

      const result = await getMemberStats(params);

      if (result.code === 200) {
        series.value = result.data.items;

        // 更新汇总信息
        summary.total = result.data.summary.total;
        summary.avg = result.data.summary.avg;
        summary.peak = result.data.summary.peak;
      } else {
        message(result.message || "获取统计数据失败", { type: "error" });
      }
    } catch (error) {
      console.error("获取会员统计数据失败:", error);
      message("获取统计数据失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  };

  // 日期选择器类型
  const datePickerType = computed(() => {
    if (granularity.value === "monthly") {
      return "monthrange";
    }
    return "daterange";
  });

  // 日期选择器快捷选项
  const shortcuts = computed(() => {
    const now = new Date();

    if (granularity.value === "daily") {
      return [
        {
          text: "最近7天",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 6);
            return [start, end];
          }
        },
        {
          text: "最近30天",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 29);
            return [start, end];
          }
        },
        {
          text: "最近90天",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 89);
            return [start, end];
          }
        }
      ];
    } else if (granularity.value === "weekly") {
      return [
        {
          text: "最近4周",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 3 * 7);
            return [start, end];
          }
        },
        {
          text: "最近12周",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 11 * 7);
            return [start, end];
          }
        },
        {
          text: "最近26周",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 25 * 7);
            return [start, end];
          }
        }
      ];
    } else {
      return [
        {
          text: "最近3个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 2);
            return [start, end];
          }
        },
        {
          text: "最近6个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 5);
            return [start, end];
          }
        },
        {
          text: "最近12个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 11);
            return [start, end];
          }
        }
      ];
    }
  });

  return {
    granularity,
    dateRange,
    loading,
    series,
    summary,
    datePickerType,
    shortcuts,
    onGranularityChange,
    fetchMemberStats
  };
}

