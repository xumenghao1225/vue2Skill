import VabProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "./router";
import { getAccessToken } from "@/utils/AccessToken";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require("../package.json");
const wihteList = ["login"];

VabProgress.configure({
  easing: "ease",
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});

Router.beforeEach((to, from, next) => {
  // 检查是否需要身份验证
  VabProgress.start();
  if (wihteList.includes(to.path)) {
    next();

    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (to?.meta?.requiresAuth) {
    // 检查是否有token
    if (getAccessToken() !== undefined) {
      next();
    } else {
      next({
        name: "login",
      });
    }
  } else {
    next();
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Router.afterEach((to, from) => {
  document.title = `${name} | ${to?.meta?.title}`;
  VabProgress.done();
});
