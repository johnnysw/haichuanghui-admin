<template>
  <el-drawer
    v-model="visible"
    title="会员详情"
    direction="rtl"
    size="60%"
    :before-close="handleClose"
  >
    <template #default>
      <div v-loading="loading" class="member-detail">
        <el-scrollbar v-if="member" height="calc(100vh - 120px)">
          <!-- 基础信息 -->
          <div class="detail-section">
            <div class="section-title">基础信息</div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="头像" :span="2">
                <el-avatar
                  :src="getFullImageUrl(member.avatar)"
                  :size="80"
                >
                  {{ member.nickname?.[0] || member.username?.[0] }}
                </el-avatar>
              </el-descriptions-item>
              <el-descriptions-item label="用户名">
                {{ member.username }}
              </el-descriptions-item>
              <el-descriptions-item label="昵称">
                {{ member.nickname || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="邮箱">
                {{ member.email || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号">
                {{ member.phone || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="角色">
                <el-tag :type="getRoleType(member.role)" size="small">
                  {{ member.roleText }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="getStatusType(member.status)" size="small">
                  {{ member.statusText }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="VIP会员">
                <el-tag :type="member.isVip ? 'warning' : 'info'" size="small">
                  {{ member.isVip ? "是" : "否" }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item
                v-if="member.isVip"
                label="VIP过期时间"
              >
                {{ formatDate(member.vipExpireTime) }}
              </el-descriptions-item>
              <el-descriptions-item label="注册时间">
                {{ formatDate(member.createdTime) }}
              </el-descriptions-item>
              <el-descriptions-item label="最后登录">
                {{ formatDate(member.lastLoginTime) || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="登录IP">
                {{ member.loginIp || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="邀请码">
                {{ member.inviteCode || "-" }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 个人信息 -->
          <div class="detail-section">
            <div class="section-title">个人信息</div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="真实姓名">
                {{ member.realName || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="性别">
                {{ member.genderText || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="生日">
                {{ formatDate(member.birthday) || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="年龄">
                {{ member.age || "-" }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 地址信息 -->
          <div v-if="hasAddressInfo" class="detail-section">
            <div class="section-title">地址信息</div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="国家">
                {{ member.country || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="省份">
                {{ member.province || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="城市">
                {{ member.city || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="邮政编码">
                {{ member.postalCode || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="详细地址" :span="2">
                {{ member.address || "-" }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 职业信息 -->
          <div v-if="hasCareerInfo" class="detail-section">
            <div class="section-title">职业信息</div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="公司">
                {{ member.company || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="职位">
                {{ member.position || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="行业">
                {{ member.industry || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="专业领域">
                {{ member.field || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="教育背景" :span="2">
                <div class="multiline-text">
                  {{ member.education || "-" }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="工作经验" :span="2">
                <div class="multiline-text">
                  {{ member.workExperience || "-" }}
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 个人展示 -->
          <div v-if="hasProfileInfo" class="detail-section">
            <div class="section-title">个人展示</div>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="个人简介">
                <div class="multiline-text">
                  {{ member.bio || "-" }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="专业技能">
                <div class="multiline-text">
                  {{ member.skills || "-" }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="兴趣爱好">
                <div class="multiline-text">
                  {{ member.interests || "-" }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="个人成就">
                <div class="multiline-text">
                  {{ member.achievements || "-" }}
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 社交账号 -->
          <div v-if="hasSocialInfo" class="detail-section">
            <div class="section-title">社交账号</div>
            <el-descriptions :column="2" border>
              <el-descriptions-item v-if="member.wechat" label="微信">
                {{ member.wechat }}
              </el-descriptions-item>
              <el-descriptions-item v-if="member.linkedin" label="LinkedIn">
                <el-link :href="member.linkedin" target="_blank" type="primary">
                  {{ member.linkedin }}
                </el-link>
              </el-descriptions-item>
              <el-descriptions-item v-if="member.website" label="个人网站">
                <el-link :href="member.website" target="_blank" type="primary">
                  {{ member.website }}
                </el-link>
              </el-descriptions-item>
              <el-descriptions-item v-if="member.github" label="GitHub">
                <el-link :href="member.github" target="_blank" type="primary">
                  {{ member.github }}
                </el-link>
              </el-descriptions-item>
              <el-descriptions-item v-if="member.weibo" label="微博">
                {{ member.weibo }}
              </el-descriptions-item>
              <el-descriptions-item v-if="member.twitter" label="Twitter">
                {{ member.twitter }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-scrollbar>
      </div>
    </template>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button
          :type="member?.status === 0 ? 'success' : 'danger'"
          @click="handleToggleStatus"
        >
          {{ member?.status === 0 ? "恢复" : "禁用" }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { MemberInfo } from "../types/types";
import { MemberStatus, MemberRole } from "../types/types";

interface Props {
  visible: boolean;
  member: MemberInfo | null;
  loading?: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "toggle-status", member: MemberInfo): void;
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

// 控制显示/隐藏
const visible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value)
});

// 判断是否有地址信息
const hasAddressInfo = computed(() => {
  const m = props.member;
  return m && (m.country || m.province || m.city || m.address || m.postalCode);
});

// 判断是否有职业信息
const hasCareerInfo = computed(() => {
  const m = props.member;
  return m && (m.company || m.position || m.industry || m.field || m.education || m.workExperience);
});

// 判断是否有个人展示信息
const hasProfileInfo = computed(() => {
  const m = props.member;
  return m && (m.bio || m.skills || m.interests || m.achievements);
});

// 判断是否有社交账号信息
const hasSocialInfo = computed(() => {
  const m = props.member;
  return m && (m.wechat || m.linkedin || m.website || m.github || m.weibo || m.twitter);
});

// 获取角色类型
const getRoleType = (role: MemberRole) => {
  return role === MemberRole.INVESTOR ? "primary" : "success";
};

// 获取状态类型
const getStatusType = (status: MemberStatus) => {
  return status === MemberStatus.NORMAL ? "success" : "danger";
};

// 格式化日期
const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// 构建完整图片 URL
const getFullImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/public/")) {
    return `${import.meta.env.VITE_API_BASE_URL}${url}`;
  }
  return `${import.meta.env.VITE_API_BASE_URL}/public${url.startsWith("/") ? url : `/${url}`}`;
};

// 关闭抽屉
const handleClose = () => {
  emit("close");
};

// 切换状态
const handleToggleStatus = () => {
  if (props.member) {
    emit("toggle-status", props.member);
  }
};
</script>

<style scoped lang="scss">
.member-detail {
  padding: 0 20px;

  .detail-section {
    margin-bottom: 24px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
      padding-left: 8px;
      border-left: 3px solid #409eff;
    }
  }

  .multiline-text {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.6;
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

