/**
 * 评论 API
 */

import { http } from "@/utils/http";
import type { ApiResponse, Comment, CommentListResponse } from "../types/types";

/**
 * 评论 API 类
 */
class CommentAPI {
  /**
   * 获取评论列表
   */
  getComments(
    entityType: "project" | "article",
    entityId: number,
    page = 1,
    limit = 100
  ): Promise<ApiResponse<CommentListResponse>> {
    return http.get(`/api/v1/comments/${entityType}/${entityId}`, {
      params: { page, limit }
    });
  }

  /**
   * 创建评论
   */
  createComment(
    entityType: "project" | "article",
    entityId: number,
    content: string,
    parentId?: number
  ): Promise<ApiResponse<Comment>> {
    return http.post(`/api/v1/comments/${entityType}/${entityId}`, {
      data: { content, parentId }
    });
  }

  /**
   * 删除评论
   */
  deleteComment(
    entityType: "project" | "article",
    entityId: number,
    commentId: number
  ): Promise<ApiResponse<void>> {
    return http.request("delete", `/api/v1/comments/${entityType}/${entityId}/${commentId}`);
  }

  /**
   * 点赞评论
   */
  likeComment(
    commentId: number,
    entityType: "project" | "article",
    entityId: number
  ): Promise<ApiResponse<{ isLiked: boolean; likeCount: number; action: string }>> {
    return http.post(`/api/v1/comment-likes/${commentId}/toggle`, {
      data: { entityType, entityId }
    });
  }

  /**
   * 批量获取评论数
   */
  batchGetCommentCounts(
    entityType: "project" | "article",
    entityIds: number[]
  ): Promise<ApiResponse<Record<number, number>>> {
    return http.post("/api/v1/comments/batch-count", {
      data: { entityType, entityIds }
    });
  }
}

export const commentAPI = new CommentAPI();

