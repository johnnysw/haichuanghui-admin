<script setup lang="ts">
import { getMine } from "@/api/user";
import { useRouter } from "vue-router";
import { ref, onBeforeMount, onMounted } from "vue";
import { ReText } from "@/components/ReText";
import Profile from "./components/Profile.vue";
import Preferences from "./components/Preferences.vue";
import SecurityLog from "./components/SecurityLog.vue";
import { useGlobal, deviceDetection } from "@pureadmin/utils";
import AccountManagement from "./components/AccountManagement.vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import LaySidebarTopCollapse from "@/layout/components/lay-sidebar/components/SidebarTopCollapse.vue";
import { getFullImageUrl } from "@/utils/image";

import leftLine from "@iconify-icons/ri/arrow-left-s-line";
import ProfileIcon from "@iconify-icons/ri/user-3-line";
import PreferencesIcon from "@iconify-icons/ri/settings-3-line";
import SecurityLogIcon from "@iconify-icons/ri/window-line";
import AccountManagementIcon from "@iconify-icons/ri/profile-line";

defineOptions({
  name: "AccountSettings"
});

const router = useRouter();
const isMobile = ref(deviceDetection());
const isOpen = ref(isMobile.value ? false : true);
const { $storage } = useGlobal<GlobalPropertiesApi>();
onBeforeMount(() => {
  useDataThemeChange().dataThemeChange($storage.layout?.overallStyle);
});

interface UserInfoState {
  avatar: string | null;
  username: string;
  nickname: string;
}

const userInfo = ref<UserInfoState>({
  avatar: null,
  username: "",
  nickname: ""
});

const loading = ref(false);

const panes = [
  {
    key: "profile",
    label: "个人信息",
    icon: ProfileIcon,
    component: Profile
  },
  {
    key: "preferences",
    label: "偏好设置",
    icon: PreferencesIcon,
    component: Preferences
  },
  {
    key: "securityLog",
    label: "安全日志",
    icon: SecurityLogIcon,
    component: SecurityLog
  },
  {
    key: "accountManagement",
    label: "账户管理",
    icon: AccountManagementIcon,
    component: AccountManagement
  }
];
const whichPane = ref("profile");

onMounted(async () => {
  loading.value = true;
  const res = await getMine();
  userInfo.value.username = res.data.username;
  userInfo.value.nickname = res.data.nickname;
  userInfo.value.avatar = res.data.avatar;
  loading.value = false;
});

// 处理子组件头像更新事件
const handleAvatarUpdate = (newAvatarUrl: string) => {
  userInfo.value.avatar = newAvatarUrl;
};

// 处理子组件信息更新事件
const handleInfoUpdate = (updatedInfo: { nickname: string }) => {
  if (updatedInfo.nickname !== undefined) {
    userInfo.value.nickname = updatedInfo.nickname;
  }
};
</script>

<template>
  <el-container class="h-full">
    <el-aside
      v-if="isOpen"
      class="pure-account-settings overflow-hidden px-2 dark:!bg-[var(--el-bg-color)] border-r-[1px] border-[var(--pure-border-color)]"
      :width="isMobile ? '180px' : '240px'"
    >
      <el-menu :default-active="whichPane" class="pure-account-settings-menu">
        <el-menu-item
          class="hover:!transition-all hover:!duration-200 hover:!text-base !h-[50px]"
          @click="router.go(-1)"
        >
          <div class="flex items-center">
            <IconifyIconOffline :icon="leftLine" />
            <span class="ml-2">返回</span>
          </div>
        </el-menu-item>
        <div class="flex items-center ml-8 mt-4 mb-4">
          <el-avatar :size="48" :src="getFullImageUrl(userInfo.avatar)" />
          <div class="ml-4 flex flex-col max-w-[130px]">
            <ReText class="font-bold !self-baseline">
              {{ userInfo.nickname }}
            </ReText>
            <ReText class="!self-baseline" type="info">
              {{ userInfo.username }}
            </ReText>
          </div>
        </div>
        <el-menu-item
          v-for="item in panes"
          :key="item.key"
          :index="item.key"
          @click="
            () => {
              whichPane = item.key;
              if (isMobile) {
                isOpen = !isOpen;
              }
            }
          "
        >
          <div class="flex items-center z-10">
            <el-icon><IconifyIconOffline :icon="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <LaySidebarTopCollapse
        v-if="isMobile"
        class="px-0"
        :is-active="isOpen"
        @toggleClick="isOpen = !isOpen"
      />
      <component
        :is="panes.find(item => item.key === whichPane).component"
        @avatarUpdated="handleAvatarUpdate"
        @infoUpdated="handleInfoUpdate"
        :class="[!isMobile && 'ml-[120px]']"
      />
    </el-main>
  </el-container>
</template>

<style lang="scss">
.pure-account-settings {
  background: var(--pure-theme-menu-bg) !important;
}

.pure-account-settings-menu {
  border: none;
  background-color: transparent;

  .el-menu-item {
    height: 48px !important;
    background-color: transparent !important;
    color: var(--pure-theme-menu-text);
    transition: color 0.2s;

    &:hover {
      color: var(--pure-theme-menu-title-hover) !important;
    }

    &.is-active {
      color: #fff !important;

      &:hover {
        color: #fff !important;
      }

      &::before {
        position: absolute;
        clear: both;
        margin: 4px 0;
        border-radius: 3px;
        background: var(--el-color-primary);
        content: "";

        inset: 0 8px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
body[layout] {
  .el-menu--vertical .is-active {
    color: #fff !important;
    transition: color 0.2s;

    &:hover {
      color: #fff !important;
    }
  }
}
</style>
