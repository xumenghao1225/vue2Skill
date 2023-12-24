import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
type withRequiredProperties<Type, key extends keyof Type> = Type &
  Required<Pick<Type, key>>;
type requiredRouteConfig = withRequiredProperties<RouteConfig, "name">;
Vue.use(VueRouter);
const Layout = () => import("../components/Layout/layoutPage.vue");
const routes: Array<requiredRouteConfig> = [
  {
    path: "/login",
    name: "login",
    meta: { requiresAuth: false },
    component: () => import("@/views/login/login-index.vue"),
  },
  {
    path: "/401",
    name: "401",
    meta: { requiresAuth: false },
    component: () => import("@/views/401.vue"),
  },
  {
    path: "/404",
    name: "404",
    meta: { requiresAuth: false },
    component: () => import("@/views/404.vue"),
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/about",
        name: "about",
        meta: { requiresAuth: true },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
      },
      {
        path: "/pageOne",
        name: "pageOne",
        meta: { title: "调出户表", requiresAuth: true },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "@/views/pageOne.vue"),
      },
    ],
  },
  {
    path: "*",
    name: "*",
    redirect: "/404",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
