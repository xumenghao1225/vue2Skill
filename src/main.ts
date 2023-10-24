import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "normalize.css";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/index.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
