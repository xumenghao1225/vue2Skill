<style lang="scss" scoped>
.el-header {
  background: #fff;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Header } from "element-ui";
@Component({
  name: "headerPage",
  components: {
    Header,
  },
})
export default class headerPage extends Vue {
  headerTitle = "";
}
</script>

<template>
  <Header>{{ headerTitle }}</Header>
</template>
