<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "DownLoad",
})
export default class DownLoad extends Vue {
  fileList = [{}];
}
</script>

<template>
  <div class="download-container-wrapper">
    <div>
      <el-table :data="fileList" style="width: 100%"></el-table>
    </div>
  </div>
</template>
