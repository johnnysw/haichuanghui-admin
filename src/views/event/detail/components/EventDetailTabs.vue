<template>
  <div class="bg-white">
    <div class="px-6 py-4">
      <el-tabs v-model="currentTab" @tab-change="handleTabChange">
        <!-- 活动介绍 -->
        <el-tab-pane label="活动介绍" name="introduction">
          <div class="space-y-6">
            <!-- 详细介绍 -->
            <div v-if="event.detailedIntro">
              <h3 class="text-lg font-semibold mb-3">详细介绍</h3>
              <div
                class="prose prose-sm max-w-none text-gray-700"
                v-html="event.detailedIntro"
              />
            </div>

            <!-- 活动亮点 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- 活动议程 -->
              <div v-if="event.agenda" class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold mb-3 flex items-center">
                  <el-icon class="mr-2 text-blue-500">
                    <component :is="useRenderIcon('ep:document')" />
                  </el-icon>
                  活动议程
                </h4>
                <p class="text-sm text-gray-600 leading-relaxed">
                  {{ event.agenda }}
                </p>
              </div>

              <!-- 参与要求 -->
              <div v-if="event.requirements" class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold mb-3 flex items-center">
                  <el-icon class="mr-2 text-green-500">
                    <component :is="useRenderIcon('ep:user')" />
                  </el-icon>
                  参与要求
                </h4>
                <p class="text-sm text-gray-600 leading-relaxed">
                  {{ event.requirements }}
                </p>
              </div>

              <!-- 活动收益 -->
              <div v-if="event.benefits" class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold mb-3 flex items-center">
                  <el-icon class="mr-2 text-orange-500">
                    <component :is="useRenderIcon('ep:trophy')" />
                  </el-icon>
                  活动收益
                </h4>
                <p class="text-sm text-gray-600 leading-relaxed">
                  {{ event.benefits }}
                </p>
              </div>
            </div>

            <!-- 活动标签 -->
            <div v-if="event.tags && event.tags.length > 0">
              <h3 class="text-lg font-semibold mb-3">活动标签</h3>
              <div class="flex flex-wrap gap-2">
                <el-tag
                  v-for="tag in event.tags"
                  :key="tag"
                  type="info"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 嘉宾介绍 -->
        <el-tab-pane
          v-if="event.speakers && event.speakers.length > 0"
          label="嘉宾介绍"
          name="speakers"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="speaker in event.speakers"
              :key="speaker.id"
              class="bg-gray-50 rounded-lg p-4 text-center"
            >
              <!-- 头像 -->
              <el-avatar
                v-if="speaker.avatar"
                :src="speaker.avatar"
                :size="80"
                class="mx-auto mb-3"
              />
              <el-avatar v-else :size="80" class="mx-auto mb-3">
                {{ speaker.name.charAt(0) }}
              </el-avatar>

              <!-- 基本信息 -->
              <h4 class="font-semibold text-lg mb-1">{{ speaker.name }}</h4>
              <p class="text-sm text-gray-600 mb-1">{{ speaker.title }}</p>
              <p class="text-sm text-blue-600 mb-3">{{ speaker.company }}</p>

              <!-- 演讲主题 -->
              <div v-if="speaker.topic" class="mb-3">
                <div class="text-xs text-gray-500 mb-1">演讲主题</div>
                <div class="text-sm font-medium">{{ speaker.topic }}</div>
              </div>

              <!-- 简介 -->
              <div v-if="speaker.bio">
                <div class="text-xs text-gray-500 mb-1">个人简介</div>
                <p class="text-xs text-gray-600 leading-relaxed">
                  {{ speaker.bio }}
                </p>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 赞助商 -->
        <el-tab-pane
          v-if="event.sponsors && event.sponsors.length > 0"
          label="赞助商"
          name="sponsors"
        >
          <!-- 按级别分组显示 -->
          <div class="space-y-8">
            <template v-for="level in sponsorLevels" :key="level.key">
              <div v-if="getSponsorsByLevel(level.key).length > 0">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                  <el-icon class="mr-2" :style="{ color: level.color }">
                    <component :is="useRenderIcon(level.icon)" />
                  </el-icon>
                  {{ level.name }}
                </h3>
                <div
                  class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                >
                  <div
                    v-for="sponsor in getSponsorsByLevel(level.key)"
                    :key="sponsor.id"
                    class="text-center"
                  >
                    <div
                      class="bg-gray-50 rounded-lg p-4 mb-2 hover:bg-gray-100 transition-colors"
                    >
                      <el-image
                        :src="sponsor.logo"
                        :alt="sponsor.name"
                        class="w-full h-16 object-contain"
                        fit="contain"
                      />
                    </div>
                    <h4 class="text-sm font-medium mb-1">{{ sponsor.name }}</h4>
                    <p v-if="sponsor.description" class="text-xs text-gray-600">
                      {{ sponsor.description }}
                    </p>
                    <el-button
                      v-if="sponsor.website"
                      link
                      type="primary"
                      size="small"
                      @click="openLink(sponsor.website)"
                    >
                      访问官网
                    </el-button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-tab-pane>

        <!-- 活动资料 -->
        <el-tab-pane
          v-if="event.materials && event.materials.length > 0"
          label="活动资料"
          name="materials"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="material in event.materials"
              :key="material.id"
              class="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start gap-3">
                <!-- 文件图标 -->
                <div class="flex-shrink-0">
                  <el-icon size="32" :color="getFileIconColor(material.type)">
                    <component
                      :is="useRenderIcon(getFileIcon(material.type))"
                    />
                  </el-icon>
                </div>

                <!-- 文件信息 -->
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-900 truncate">
                    {{ material.name }}
                  </h4>
                  <p
                    v-if="material.description"
                    class="text-sm text-gray-600 mt-1"
                  >
                    {{ material.description }}
                  </p>
                  <div
                    class="flex items-center gap-4 mt-2 text-xs text-gray-500"
                  >
                    <span v-if="material.size">{{
                      formatFileSize(material.size)
                    }}</span>
                    <span v-if="material.downloadCount"
                      >下载: {{ material.downloadCount }}次</span
                    >
                  </div>
                </div>

                <!-- 下载按钮 -->
                <div class="flex-shrink-0">
                  <el-button
                    type="primary"
                    size="small"
                    :icon="useRenderIcon('ep:download')"
                    @click="downloadFile(material)"
                  >
                    下载
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 活动图片 -->
        <el-tab-pane
          v-if="event.gallery && event.gallery.length > 0"
          label="活动图片"
          name="gallery"
        >
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            <div
              v-for="image in event.gallery"
              :key="image.id"
              class="aspect-square"
            >
              <el-image
                :src="image.thumbnail || image.url"
                :alt="image.title"
                class="w-full h-full rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                fit="cover"
                :preview-src-list="galleryImages"
                :initial-index="
                  event.gallery!.findIndex(g => g.id === image.id)
                "
                preview-teleported
              />
            </div>
          </div>
        </el-tab-pane>

        <!-- 联系信息 -->
        <el-tab-pane label="联系信息" name="contact">
          <div class="max-w-2xl">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold mb-4">联系方式</h3>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <el-icon class="text-gray-500">
                    <component :is="useRenderIcon('ep:user')" />
                  </el-icon>
                  <span class="text-gray-600">联系人：</span>
                  <span class="font-medium">{{ event.contactPerson }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <el-icon class="text-gray-500">
                    <component :is="useRenderIcon('ep:phone')" />
                  </el-icon>
                  <span class="text-gray-600">电话：</span>
                  <el-button
                    link
                    type="primary"
                    @click="callPhone(event.contactPhone)"
                  >
                    {{ event.contactPhone }}
                  </el-button>
                </div>
                <div class="flex items-center gap-3">
                  <el-icon class="text-gray-500">
                    <component :is="useRenderIcon('ep:message')" />
                  </el-icon>
                  <span class="text-gray-600">邮箱：</span>
                  <el-button
                    link
                    type="primary"
                    @click="sendEmail(event.contactEmail)"
                  >
                    {{ event.contactEmail }}
                  </el-button>
                </div>
                <div v-if="event.website" class="flex items-center gap-3">
                  <el-icon class="text-gray-500">
                    <component :is="useRenderIcon('ep:link')" />
                  </el-icon>
                  <span class="text-gray-600">官网：</span>
                  <el-button
                    link
                    type="primary"
                    @click="openLink(event.website!)"
                  >
                    {{ event.website }}
                  </el-button>
                </div>
                <div class="flex items-start gap-3">
                  <el-icon class="text-gray-500 mt-0.5">
                    <component :is="useRenderIcon('ep:location')" />
                  </el-icon>
                  <span class="text-gray-600">地址：</span>
                  <div>
                    <div class="font-medium">{{ event.location }}</div>
                    <div class="text-sm text-gray-600">{{ event.address }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessage } from "element-plus";
import type { EventDetail, Sponsor, Material } from "../types/types";

interface Props {
  event: EventDetail;
  activeTab: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "tab-change": [tab: string];
}>();

const currentTab = ref(props.activeTab);

// 赞助商级别配置
const sponsorLevels = [
  { key: "title", name: "冠名赞助商", color: "#722ed1", icon: "ep:trophy" },
  { key: "gold", name: "黄金赞助商", color: "#fa8c16", icon: "ep:medal" },
  { key: "silver", name: "白银赞助商", color: "#8c8c8c", icon: "ep:medal" },
  { key: "bronze", name: "铜牌赞助商", color: "#d4874e", icon: "ep:medal" }
];

// 图片预览列表
const galleryImages = computed(
  () => props.event.gallery?.map(g => g.url) || []
);

// 标签页切换
const handleTabChange = (tab: string) => {
  emit("tab-change", tab);
};

// 根据级别获取赞助商
const getSponsorsByLevel = (level: string): Sponsor[] => {
  return props.event.sponsors?.filter(s => s.level === level) || [];
};

// 获取文件图标
const getFileIcon = (type: string) => {
  switch (type) {
    case "document":
      return "ep:document";
    case "video":
      return "ep:video-play";
    case "image":
      return "ep:picture";
    case "link":
      return "ep:link";
    default:
      return "ep:document";
  }
};

// 获取文件图标颜色
const getFileIconColor = (type: string) => {
  switch (type) {
    case "document":
      return "#1890ff";
    case "video":
      return "#52c41a";
    case "image":
      return "#fa8c16";
    case "link":
      return "#722ed1";
    default:
      return "#8c8c8c";
  }
};

// 格式化文件大小
const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

// 下载文件
const downloadFile = (material: Material) => {
  window.open(material.url, "_blank");
  ElMessage.success(`开始下载: ${material.name}`);
};

// 打开链接
const openLink = (url: string) => {
  window.open(url, "_blank");
};

// 拨打电话
const callPhone = (phone: string) => {
  window.open(`tel:${phone}`);
};

// 发送邮件
const sendEmail = (email: string) => {
  window.open(`mailto:${email}`);
};
</script>
