<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "DownLoad",
})
export default class DownLoad extends Vue {
  fileList = [{}];

  // 锁屏函数
  lockScreen() {
    window.onmousemove = () => {
      return false;
    };
  }

  // 解锁屏函数
  unlockScreen() {
    // 移除之前添加的事件监听
    window.removeEventListener(
      "keydown",
      (event) => {
        event.preventDefault();
      },
      true
    );

    window.removeEventListener(
      "mousedown",
      (event) => {
        event.preventDefault();
      },
      true
    );

    window.removeEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();
      },
      true
    );
  }

  // 调用锁屏函数

  testClick() {
    console.log("testClick");
  }
}
</script>

<template>
  <div class="download-container-wrapper">
    <div>
      <el-button type="primary" @click="lockScreen">锁屏</el-button>
      <el-button type="primary" @click="unlockScreen">解除锁屏</el-button>
      <el-button type="primary" @click="testClick">testClick</el-button>
      <el-table :data="fileList" style="width: 100%"></el-table>
    </div>
  </div>
</template>
