<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
<style>
.el-submenu > .el-submenu__title.el-submenu__title:hover {
  background-color: #0094ff;
}
</style>

<template>
  <div class="layout-container">
    <Head></Head>
    <Main></Main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Header, Main } from "./components";
@Component({
  name: "layout",
  components: {
    Head: Header,
    Main,
  },
})
export default class Layout extends Vue {}
</script>
