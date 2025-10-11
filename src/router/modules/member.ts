const Layout = () => import("@/layout/index.vue");

export default {
  path: "/member",
  name: "Member",
  component: Layout,
  redirect: "/member/list",
  meta: {
    icon: "ep:user",
    title: "会员管理",
    rank: 10
  },
  children: [
    {
      path: "/member/list",
      name: "MemberList",
      component: () => import("@/views/member/list/index.vue"),
      meta: {
        title: "会员列表",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;

