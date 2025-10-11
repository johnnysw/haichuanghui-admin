<!-- 评论列表组件 -->
<template>
  <div class="common-comments">
    <h3 class="text-lg font-semibold mb-4">用户评论</h3>

    <!-- 评论列表 -->
    <div v-loading="loading">
      <div v-if="comments.length === 0" class="text-center py-8 text-gray-500">
        暂无评论
      </div>

      <div v-else class="space-y-4">
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :depth="0"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import CommentItem from "./CommentItem.vue";
import { commentAPI } from "../api/comment";
import { deleteNewsComment } from "../api/index";
import type { Comment } from "../types/types";

// Props
interface Props {
  entityType: "project" | "article";
  entityId: number;
  newsId: number; // 资讯ID（用于管理员删除评论）
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "comments-loaded": [{ total: number }];
}>();

// 响应式数据
const comments = ref<Comment[]>([]);
const loading = ref(false);

// 方法
const loadComments = async () => {
  if (!props.entityId) return;

  loading.value = true;
  try {
    const response = await commentAPI.getComments(
      props.entityType,
      props.entityId
    );

    if (response.code === 200 && response.data) {
      comments.value = response.data.list || [];
      emit("comments-loaded", { total: response.data.total || comments.value.length });
    } else {
      comments.value = [];
      emit("comments-loaded", { total: 0 });
    }
  } catch (error) {
    console.error("加载评论失败:", error);
    ElMessage.error("加载评论失败");
    comments.value = [];
    emit("comments-loaded", { total: 0 });
  } finally {
    loading.value = false;
  }
};

// 管理员删除评论（级联删除子评论）
const handleDelete = async (commentId: number) => {
  try {
    const response = await deleteNewsComment(props.newsId, commentId);

    if (response.code === 200) {
      const deletedCount = response.data?.deletedCount || 1;
      ElMessage.success(`成功删除 ${deletedCount} 条评论`);
      await loadComments();
    } else {
      ElMessage.error(response.message || "删除失败");
    }
  } catch (error: any) {
    console.error("删除评论失败:", error);
    ElMessage.error(error.message || "删除评论失败");
  }
};

// 生命周期
onMounted(() => {
  loadComments();
});

// 暴露方法给父组件
defineExpose({
  loadComments
});
</script>

<style scoped lang="scss">
.common-comments {
  background: #fff;
  border-radius: 4px;
  padding: 1.5rem;
}
</style>

