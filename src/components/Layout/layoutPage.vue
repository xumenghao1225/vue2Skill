<style scoped lang="scss">
@mixin bg-color($color: #304156) {
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
        color: #fff;
        &:hover {
          @include bg-color(#263445);
          color: #f5f5f5;
        }
        &.is-active {
          background-color: #263445;
        }
        i {
          color: #f5f5f5;
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
        :default-active="currentRoute"
        class="Menu-demo"
        mode="vertical"
        width="200px"
        router
        active-text-color="#fFF"
        active-color="#f5e729"
      >
        <template v-for="item in MenuList">
          <Menu-item :key="item.path" :index="item.path">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.title }}</span>
          </Menu-item>
        </template>
        <!-- <Submenu index="2">
                  el-icon-menu
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

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Menu, MenuItem, Aside, Main } from "element-ui";
import router from "@/router";
@Component({
  name: "layout",
  components: {
    elMenu: Menu,
    MenuItem,
    Aside,
    Main,
  },
})
export default class Layout extends Vue {
  activeIndex = "/dashboard";

  get MenuList() {
    const Menu = router
      .getRoutes()
      .filter((item) => item.meta.isMenu)
      .flatMap(({ meta, path, name }) => {
        return {
          path,
          name,
          title: meta.title,
        };
      });
    return Menu;
  }

  get currentRoute() {
    return this.$route.path;
  }
}
</script>
