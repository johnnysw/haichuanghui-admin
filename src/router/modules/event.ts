import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/event",
  name: "EventManagement", 
  component: Layout,
  redirect: "/event/list",
  meta: {
    icon: "ri:calendar-event-line",
    title: "创业活动",
    rank: 6,
    roles: ["super-admin"],
    activePath: "/event",
    frameLoading: true,
    keepAlive: false,
    hiddenTag: false,
    fixedTag: false,
    showLink: true,
    showParent: false
  },
  children: [
    {
      path: "/event/list",
      name: "EventList",
      component: () => import("@/views/event/list/index.vue"),
      meta: {
        title: "活动列表",
        icon: null,
        rank: 61,
        roles: ["super-admin"],
        activePath: "/event/list",
        frameLoading: true,
        keepAlive: false,
        hiddenTag: false,
        fixedTag: false,
        showLink: true,
        showParent: true
      }
    },
    {
      path: "/event/detail/:id",
      name: "EventDetail",
      component: () => import("@/views/event/detail/index.vue"),
      meta: {
        title: "活动详情",
        icon: null,
        rank: 611,
        roles: ["super-admin"],
        activePath: "/event/list",
        frameLoading: true,
        keepAlive: false,
        hiddenTag: false,
        fixedTag: false,
        showLink: false,
        showParent: false
      }
    }
  ]
} satisfies RouteConfigsTable;