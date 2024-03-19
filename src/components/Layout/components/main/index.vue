<style lang="scss" scoped>
@mixin bg-color($color: #304156) {
  background-color: $color;
}
.content-main {
  padding: 0px;
  display: flex;
  .el-aside {
    height: 100%;
    overflow: hidden;
    @include bg-color;
  }
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
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Menu, MenuItem, Aside, Main } from "element-ui";
import router from "@/router";
@Component({
  name: "mainPage",
  components: {
    elMenu: Menu,
    MenuItem,
    Aside,
    Main,
  },
})
export default class mainPage extends Vue {
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

<template>
  <Main class="content-main">
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
      </el-menu>
    </Aside>
    <!-- 主体 -->
    <Main>
      <router-view></router-view>
    </Main>
  </Main>
</template>
