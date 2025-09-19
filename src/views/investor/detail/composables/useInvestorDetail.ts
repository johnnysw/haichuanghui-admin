import { ref, reactive, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import type { InvestorInfo, InvestorDetailState, InvestmentCase, ReviewRecord } from "../types/types";
import { getInvestorDetail, getInvestmentCases, getReviewRecords } from "../api";

export function useInvestorDetail() {
  const route = useRoute();
  const investorId = computed(() => Number(route.params.id));

  // 详情页面状态
  const state = reactive<InvestorDetailState>({
    loading: false,
    investor: null,
    notFound: false
  });

  // 投资案例数据
  const investmentCases = ref<InvestmentCase[]>([]);
  const casesLoading = ref(false);

  // 审核记录数据
  const reviewRecords = ref<ReviewRecord[]>([]);
  const reviewLoading = ref(false);

  // 获取投资人详情
  const fetchInvestorDetail = async () => {
    if (!investorId.value || isNaN(investorId.value)) {
      state.notFound = true;
      return;
    }

    state.loading = true;
    try {
      const response = await getInvestorDetail(investorId.value);
      if (response.success && response.data) {
        state.investor = response.data;
        state.notFound = false;
      } else {
        state.notFound = true;
      }
    } catch (error) {
      console.error("获取投资人详情失败:", error);
      state.notFound = true;
    } finally {
      state.loading = false;
    }
  };

  // 获取投资案例
  const fetchInvestmentCases = async () => {
    if (!investorId.value || isNaN(investorId.value)) return;

    casesLoading.value = true;
    try {
      const response = await getInvestmentCases(investorId.value);
      if (response.success) {
        investmentCases.value = response.data;
      }
    } catch (error) {
      console.error("获取投资案例失败:", error);
    } finally {
      casesLoading.value = false;
    }
  };

  // 获取审核记录
  const fetchReviewRecords = async () => {
    if (!investorId.value || isNaN(investorId.value)) return;

    reviewLoading.value = true;
    try {
      const response = await getReviewRecords(investorId.value);
      if (response.success) {
        reviewRecords.value = response.data;
      }
    } catch (error) {
      console.error("获取审核记录失败:", error);
    } finally {
      reviewLoading.value = false;
    }
  };

  // 刷新所有数据
  const refreshData = async () => {
    await Promise.all([
      fetchInvestorDetail(),
      fetchInvestmentCases(),
      fetchReviewRecords()
    ]);
  };

  // 初始化数据
  onMounted(() => {
    refreshData();
  });

  return {
    investorId: investorId.value,
    state,
    investmentCases,
    casesLoading,
    reviewRecords,
    reviewLoading,
    fetchInvestorDetail,
    fetchInvestmentCases,
    fetchReviewRecords,
    refreshData
  };
}