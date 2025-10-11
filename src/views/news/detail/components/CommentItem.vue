<!-- 评论项组件 -->
<template>
  <div class="comment-item" :class="{ 'nested-comment': depth > 0 }">
    <div class="flex gap-3 relative">
      <!-- 用户头像 -->
      <el-avatar :size="depth === 0 ? 40 : 32" class="flex-shrink-0">
        <template v-if="userAvatar">
          <img :src="userAvatar" :alt="displayName" />
        </template>
        <template v-else>
          <span>{{ avatarInitial }}</span>
        </template>
      </el-avatar>

      <!-- 评论内容区 -->
      <div class="flex-1 min-w-0">
        <!-- 用户信息 -->
        <div class="flex items-center flex-wrap gap-2 mb-2">
          <span class="font-medium text-gray-900">{{ displayName }}</span>
          <el-tag v-if="comment.user?.role" size="small" type="info">
            {{ getRoleText(comment.user.role) }}
          </el-tag>
          <span v-if="comment.replyToUser" class="text-xs text-blue-600">
            回复 @{{ getDisplayName(comment.replyToUser) }}
          </span>
          <span class="text-xs text-gray-500">
            {{ formatDate(comment.createdTime) }}
          </span>
        </div>

        <!-- 评论内容 -->
        <div class="text-gray-700 mb-2 break-words">
          {{ comment.content }}
        </div>
      </div>

      <!-- 删除按钮在右上角 -->
      <div class="absolute top-0 right-0">
        <el-button
          link
          type="danger"
          size="small"
          @click="handleDelete"
        >
          <el-icon><component :is="useRenderIcon('ep:delete')" /></el-icon>
          删除
        </el-button>
      </div>
    </div>

    <!-- 嵌套回复 -->
    <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 ml-11 space-y-3">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :depth="Math.min(depth + 1, maxDepth)"
        @delete="(commentId) => $emit('delete', commentId)"
      />
    </div>
  </div>

  <!-- 删除确认对话框 -->
  <el-dialog
    v-model="deleteDialogVisible"
    title="确认删除"
    width="400px"
  >
    <p>确定要删除这条评论吗？此操作无法撤销。</p>
    <template #footer>
      <el-button @click="deleteDialogVisible = false">取消</el-button>
      <el-button type="danger" @click="confirmDelete">删除</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import type { Comment, User } from "../types/types";

// Props
interface Props {
  comment: Comment;
  depth: number;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  delete: [commentId: number];
}>();

// 响应式数据
const deleteDialogVisible = ref(false);
const maxDepth = 6;

// 计算属性
const displayName = computed(() => {
  return getDisplayName(props.comment.user);
});

const userAvatar = computed(() => {
  // 从 user.profile.avatarUrl 获取头像
  return props.comment.user?.profile?.avatarUrl || null;
});

const avatarInitial = computed(() => {
  const name = displayName.value;
  return name.charAt(0).toUpperCase();
});

// 方法
const getDisplayName = (user?: User): string => {
  if (!user) return "匿名用户";
  return user.nickname || user.username || "匿名用户";
};

const getRoleText = (role: number): string => {
  const roleMap: Record<number, string> = {
    1: "普通用户",
    2: "创业者",
    3: "投资人",
    4: "专家"
  };
  return roleMap[role] || "用户";
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "未知时间";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;

  return date.toLocaleDateString("zh-CN");
};

const handleDelete = () => {
  deleteDialogVisible.value = true;
};

const confirmDelete = () => {
  emit("delete", props.comment.id);
  deleteDialogVisible.value = false;
};
</script>

<style scoped lang="scss">
.comment-item {
  padding: 1rem;
  background: #fff;
  border-radius: 4px;
}

.nested-comment {
  margin-left: 2rem;
  margin-top: 0.75rem;
  border-left: 2px solid var(--el-border-color-lighter);
  padding-left: 1rem;
  background: #fafafa;
}
</style>

