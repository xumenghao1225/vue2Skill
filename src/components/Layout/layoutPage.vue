<style scoped lang="scss">
@mixin bg-color($color: #0094ff) {
  background-color: $color;
}
.layout-container {
  width: 100%;
  height: 100%;
  display: flex;
  .el-aside {
    height: 100%;
    overflow: hidden;
    @include bg-color;
    .el-menu {
      @include bg-color;
      border-right: none;
      .el-submenu {
        @include bg-color;
      }

      .el-menu-item {
        @include bg-color;
        &:hover {
          @include bg-color(#e6d212);
          color: #000;
        }
      }
    }
  }
}
</style>
<style>
.el-submenu > .el-submenu__title.el-submenu__title:hover {
  background-color: #0094ff;
}
</style>

<template>
  <div class="layout-container">
    <!-- 菜单 -->
    <Aside style="width: 200px">
      <el-menu
        :default-active="activeIndex"
        class="Menu-demo"
        mode="vertical"
        width="200px"
        router
        active-text-color="#fe8307"
        active-color="#f5e729"
        @select="handleSelect"
      >
        <Menu-item index="/about">处理中心</Menu-item>
        <Menu-item index="/pageOne">调出户表</Menu-item>
        <!-- <Submenu index="2">
          <template slot="title">我的工作台</template>
          <Menu-item index="2-1">选项1</Menu-item>
          <Menu-item index="2-2">选项2</Menu-item>
          <Menu-item index="2-3">选项3</Menu-item>
          <Submenu index="2-4">
            <template slot="title">选项4</template>
            <Menu-item index="2-4-1">选项1</Menu-item>
            <Menu-item index="2-4-2">选项2</Menu-item>
            <Menu-item index="2-4-3">选项3</Menu-item>
          </Submenu>
        </Submenu> -->
      </el-menu>
    </Aside>
    <!-- 主体 -->
    <Main>
      <router-view></router-view>
    </Main>
  </div>
</template>

<script>
import { Menu, MenuItem, Aside, Main, Button } from "element-ui";
import router from "@/router";
console.log(router.getRoutes());
export default {
  components: {
    elMenu: Menu,
    MenuItem,
    // Submenu,
    Aside,
    Main,
  },
  extends: {
    Button: Button,
  },
  data() {
    return {
      activeIndex: "1",
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>
