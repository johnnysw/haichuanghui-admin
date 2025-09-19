import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/news",
  name: "NewsManagement",
  component: Layout,
  redirect: "/news/list",
  meta: {
    icon: "ri:newspaper-line",
    title: "资讯管理",
    rank: 16,
    roles: ["super-admin"],
    activePath: "/news",
    frameLoading: true,
    keepAlive: false,
    hiddenTag: false,
    fixedTag: false,
    showLink: true,
    showParent: false
  },
  children: [
    {
      path: "/news/list",
      name: "NewsList",
      component: () => import("@/views/news/list/index.vue"),
      meta: {
        title: "资讯列表",
        icon: null,
        rank: 161,
        roles: ["super-admin"],
        activePath: "/news/list",
        frameLoading: true,
        keepAlive: false,
        hiddenTag: false,
        fixedTag: false,
        showLink: true,
        showParent: true
      }
    },
    {
      path: "/news/detail/:id",
      name: "NewsDetail",
      component: () => import("@/views/news/detail/index.vue"),
      meta: {
        title: "资讯详情",
        icon: null,
        rank: 1611,
        roles: ["super-admin"],
        activePath: "/news/list",
        frameLoading: true,
        keepAlive: false,
        hiddenTag: false,
        fixedTag: false,
        showLink: false,
        showParent: false
      }
    },
    {
      path: "/news/category",
      name: "NewsCategory",
      component: () => import("@/views/news/category/index.vue"),
      meta: {
        title: "资讯分类",
        icon: null,
        rank: 162,
        roles: ["super-admin"],
        activePath: "/news/category",
        frameLoading: true,
        keepAlive: false,
        hiddenTag: false,
        fixedTag: false,
        showLink: true,
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;