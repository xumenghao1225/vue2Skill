<template>
  <el-upload
    class="upload-demo"
    action="http://localhost:3000/upload"
    multiple
    :limit="10"
    drag
    :show-file-list="false"
    :http-request="handleUpLoad"
    :before-upload="preUpLoad"
    :on-exceed="handleExceed"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FileUploader } from "@/utils/Upload";
@Component({
  name: "upLoad",
})
export default class upLoad extends Vue {
  handleExceed(files: []) {
    this.$message.warning(
      `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length} 个文件`
    );
  }

  async handleUpLoad({ file }: { file: File }) {
    const uploadHandler = new FileUploader(file);
    await uploadHandler.prepareFileForUpload();
    await uploadHandler.uploadFile();
  }

  async preUpLoad(file: File) {
    return this.handlerCheckForFile(file);
  }

  handlerCheckForFile(file: File) {
    function checkFileSize(file: File) {
      return file.size < 500 * 1024 * 1024;
    }
    const isOverLoad = checkFileSize(file);

    return isOverLoad;
  }
}
</script>

<style lang="scss" scoped>
.upload-demo {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
