import { ref } from "vue";
import { ElMessage } from "element-plus";
import { getMemberDetail } from "../../api";
import type { MemberInfo } from "../../types/types";

export function useMemberDetail() {
  const drawerVisible = ref(false);
  const currentMember = ref<MemberInfo | null>(null);
  const loading = ref(false);

  /**
   * 打开详情抽屉
   */
  const openDrawer = async (memberId: number) => {
    loading.value = true;
    try {
      const response = await getMemberDetail(memberId);
      if (response.code === 200 && response.data) {
        currentMember.value = response.data;
        drawerVisible.value = true;
      } else {
        ElMessage.error(response.message || "获取会员详情失败");
      }
    } catch (error) {
      console.error("获取会员详情失败:", error);
      ElMessage.error("获取会员详情失败");
    } finally {
      loading.value = false;
    }
  };

  /**
   * 关闭详情抽屉
   */
  const closeDrawer = () => {
    drawerVisible.value = false;
    currentMember.value = null;
  };

  return {
    drawerVisible,
    currentMember,
    loading,
    openDrawer,
    closeDrawer
  };
}

