import { ref } from "vue";
import { getEventDetail } from "../api";
import type { EventInfo } from "../../list/types/types";
import { message } from "@/utils/message";

const eventDetail = ref<EventInfo | null>(null);
const loading = ref(false);

export function useEventDetail() {
  const fetchEventDetail = async (id: number) => {
    if (!id) {
      message("缺少有效的活动 ID", { type: "error" });
      return;
    }

    loading.value = true;
    try {
      const res = await getEventDetail(id);
      if (res.code === 200) {
        eventDetail.value = res.data || null;
      } else {
        message(res.message || "获取活动详情失败", { type: "error" });
      }
    } catch (error: any) {
      message(error?.message || "获取活动详情失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  };

  return {
    eventDetail,
    loading,
    fetchEventDetail,
  };
}

