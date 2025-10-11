<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";

defineOptions({
  name: "Welcome"
});

const router = useRouter();

// 获取当前用户信息
const userStore = useUserStoreHook();
const username = computed(() => userStore.username || "管理员");

// 根据时间显示不同的问候语
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  if (hour < 22) return "晚上好";
  return "夜深了";
});

// 获取当前日期
const currentDate = computed(() => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  };
  return date.toLocaleDateString("zh-CN", options);
});

// 功能卡片数据
const features = [
  {
    icon: "fa-solid:trophy",
    title: "创业大赛",
    desc: "管理创业大赛信息和报名",
    color: "#409EFF",
    gradient: "from-blue-400 to-blue-600",
    path: "/competition/list"
  },
  {
    icon: "fa-solid:briefcase",
    title: "创业项目",
    desc: "展示和管理创业项目",
    color: "#67C23A",
    gradient: "from-green-400 to-green-600",
    path: "/project/list"
  },
  {
    icon: "fa-solid:coins",
    title: "投资人",
    desc: "管理投资人信息",
    color: "#F56C6C",
    gradient: "from-red-400 to-pink-600",
    path: "/investor/list"
  },
  {
    icon: "fa-solid:building",
    title: "双创载体",
    desc: "管理孵化器资源",
    color: "#9C27B0",
    gradient: "from-purple-400 to-purple-600",
    path: "/incubator/list"
  },
  {
    icon: "fa-solid:city",
    title: "双创中心",
    desc: "管理离岸创新中心",
    color: "#00BCD4",
    gradient: "from-cyan-400 to-teal-500",
    path: "/offshore/list"
  },
  {
    icon: "fa-solid:calendar-check",
    title: "创业活动",
    desc: "管理创业活动和报名",
    color: "#FF9800",
    gradient: "from-orange-400 to-orange-600",
    path: "/event/list"
  },
  {
    icon: "fa-solid:newspaper",
    title: "资讯管理",
    desc: "管理新闻资讯内容",
    color: "#E91E63",
    gradient: "from-pink-400 to-pink-600",
    path: "/news/list"
  },
  {
    icon: "fa-solid:users",
    title: "用户管理",
    desc: "管理平台用户信息",
    color: "#E6A23C",
    gradient: "from-yellow-400 to-orange-500",
    path: "/member/list"
  }
];

// 跳转到指定页面
const handleNavigate = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="welcome-container">
    <!-- 主欢迎区域 -->
    <div
      v-motion
      :initial="{ opacity: 0, y: -50 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="welcome-header"
    >
      <div class="greeting-section">
        <div class="icon-decoration">
          <IconifyIconOnline
            icon="fa-solid:sun"
            width="60"
            class="sun-icon"
          />
        </div>
        <h1 class="greeting-text">
          {{ greeting }}，{{ username }}！
        </h1>
        <p class="welcome-subtitle">
          欢迎使用海创荟管理后台系统
        </p>
        <p class="current-date">
          <IconifyIconOnline icon="fa-solid:calendar" width="16" class="mr-1" />
          {{ currentDate }}
        </p>
      </div>
    </div>

    <!-- 装饰性波浪 -->
    <div class="wave-decoration">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        class="wave-svg"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          class="wave-path"
        />
      </svg>
    </div>

    <!-- 功能卡片区域 -->
    <div class="features-section">
      <el-row :gutter="20">
        <el-col
          v-for="(item, index) in features"
        :key="index"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <div
        v-motion
            :initial="{ opacity: 0, y: 50 }"
        :enter="{
          opacity: 1,
          y: 0,
              transition: { delay: 100 * (index + 1), duration: 500 }
            }"
            class="feature-card"
            @click="handleNavigate(item.path)"
          >
            <div class="feature-icon-wrapper" :style="{ background: item.color }">
              <IconifyIconOnline
                :icon="item.icon"
                width="32"
                height="32"
              />
            </div>
            <h3 class="feature-title">{{ item.title }}</h3>
            <p class="feature-desc">{{ item.desc }}</p>
            <div class="feature-arrow">
              <IconifyIconOnline
                icon="fa-solid:arrow-right"
                width="16"
                height="16"
                class="arrow-icon"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 底部信息卡片 -->
    <div
        v-motion
      :initial="{ opacity: 0, scale: 0.9 }"
      :enter="{ opacity: 1, scale: 1, transition: { delay: 800, duration: 500 } }"
      class="info-section"
    >
      <el-card shadow="hover" class="info-card">
        <div class="info-content">
          <div class="info-item">
            <IconifyIconOnline
              icon="fa-solid:location-dot"
              width="24"
              height="24"
              color="#409EFF"
              class="info-icon"
            />
            <div>
              <div class="info-label">海创荟</div>
              <div class="info-value">海外创新创业生态圈平台</div>
            </div>
          </div>
          <div class="info-divider" />
          <div class="info-item">
            <IconifyIconOnline
              icon="fa-solid:link"
              width="24"
              height="24"
              color="#67C23A"
              class="info-icon"
            />
            <div>
              <div class="info-label">使命</div>
              <div class="info-value">连接全球创新资源</div>
          </div>
          </div>
          <div class="info-divider" />
          <div class="info-item">
            <IconifyIconOnline
              icon="fa-solid:bullseye"
              width="24"
              height="24"
              color="#E6A23C"
              class="info-icon"
            />
            <div>
              <div class="info-label">愿景</div>
              <div class="info-value">助力创业梦想成真</div>
            </div>
          </div>
          </div>
        </el-card>
          </div>

    <!-- 装饰性浮动元素 -->
    <div class="floating-decorations">
      <div class="float-circle circle-1" />
      <div class="float-circle circle-2" />
      <div class="float-circle circle-3" />
          </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome-container {
  position: relative;
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
  overflow: hidden;
}

/* 主欢迎区域 */
.welcome-header {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-bottom: 60px;
  padding: 60px 20px 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}

.greeting-section {
  max-width: 800px;
  margin: 0 auto;
}

.icon-decoration {
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.sun-icon {
  filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.3));
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.greeting-text {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 20px;
  margin-bottom: 12px;
  opacity: 0.95;
}

.current-date {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  opacity: 0.9;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

/* 波浪装饰 */
.wave-decoration {
  position: absolute;
  top: 280px;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  z-index: 1;
}

.wave-svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 80px;
}

.wave-path {
  fill: rgba(102, 126, 234, 0.1);
}

/* 功能卡片区域 */
.features-section {
  position: relative;
  z-index: 2;
  margin-bottom: 40px;
}

.feature-card {
  position: relative;
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, transparent 0%, rgba(102, 126, 234, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
    }

    .feature-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

.feature-icon-wrapper {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  color: white;

  :deep(svg) {
    color: white !important;
  }

  .feature-card:hover & {
    transform: scale(1.1) rotate(5deg);
  }
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
}

.feature-desc {
  font-size: 14px;
  color: #909399;
  line-height: 1.6;
  margin-bottom: 8px;
}

.feature-arrow {
  position: absolute;
  bottom: 15px;
  right: 15px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: #667eea;

  .arrow-icon {
    animation: arrowMove 1s ease-in-out infinite;
  }
}

@keyframes arrowMove {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

/* 底部信息卡片 */
.info-section {
  position: relative;
  z-index: 2;
}

.info-card {
  border-radius: 16px;
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 0;
  }
}

.info-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-icon {
  flex-shrink: 0;
}

.info-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.info-divider {
  width: 1px;
  height: 40px;
  background: rgba(0, 0, 0, 0.1);
}

/* 装饰性浮动元素 */
.floating-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.float-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: floatCircle 20s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: 10%;
  left: -10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  top: 50%;
  right: -5%;
  animation-delay: 5s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  bottom: 10%;
  left: 10%;
  animation-delay: 10s;
}

@keyframes floatCircle {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -20px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(20px, 20px) scale(1.05);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .greeting-text {
    font-size: 32px;
  }

  .welcome-subtitle {
    font-size: 16px;
  }

  .info-content {
    flex-direction: column;
    gap: 20px;
  }

  .info-divider {
    width: 80%;
    height: 1px;
  }

  .feature-card {
    margin-bottom: 15px;
  }
}

/* 暗色模式适配 */
html.dark {
  .feature-card {
    background: #1d1e1f;
    color: #f5f5f5;

    .feature-title {
      color: #f5f5f5;
    }
  }

  .info-content {
    background: linear-gradient(135deg, #1d1e1f 0%, #2c2d2e 100%);

    .info-value {
      color: #f5f5f5;
    }
  }
}
</style>
