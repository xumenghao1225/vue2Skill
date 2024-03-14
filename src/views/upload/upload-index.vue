<template>
  <el-upload
    class="upload-demo"
    action="http://localhost:3000/upload"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    multiple
    :limit="10"
    :http-request="handleUpLoad"
    :before-upload="preUpLoad"
    :on-exceed="handleExceed"
    :file-list="fileList"
  >
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">
      只能上传jpg/png文件，且不超过500kb
    </div>
  </el-upload>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UpLoadHandle } from "@/utils/Upload";
interface fileList {
  name: string;
  url: string;
}
@Component({
  name: "upLoad",
})
export default class upLoad extends Vue {
  fileList: fileList[] = [];

  handleRemove(file: File, fileList: fileList[]) {
    console.log(file, fileList);
  }
  handlePreview(file: File) {
    console.log(file);
  }
  handleExceed(files: [], fileList: fileList[]) {
    this.$message.warning(
      `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
        files.length + fileList.length
      } 个文件`
    );
  }
  beforeRemove(file: File, fileList: fileList[]) {
    console.log(file);
    console.log(fileList);
    return this.$confirm(`确定移除 ${file.name}？`);
  }

  handleUpLoad() {
    console.log("handleUpLoad");
  }

  async preUpLoad(file: File) {
    const fileChunks = await UpLoadHandle.splitFileChunk(file);
    let pool: Promise<Response>[] = []; //Concurrent pool
    let max = 5; //Maximum concurrency
    console.log(fileChunks);
    for (let i = 0; i < fileChunks.length; i++) {
      let item = fileChunks[i];
      let formData = new FormData();
      formData.append("filename", file.name);
      formData.append("hash", item.hash);
      formData.append("fileHash", item.fileHash);
      formData.append("chunk", item.chunk);

      // 上传分片
      let task = fetch("http://localhost:3000/upload", {
        method: "post",
        body: formData,
      });
      task.then(() => {
        // 从并发池中移除已经完成的请求
        let index = pool.findIndex((t) => t === task);
        pool.splice(index);
      });

      // 把请求放入并发池中，如果已经达到最大并发量
      pool.push(task);
      if (pool.length === max) {
        //All requests are requested complete
        await Promise.race(pool);
      }
    }
    Promise.all(pool).then(() => {
      const params = JSON.stringify({
        filename: file.name,
        filehash: fileChunks[0].fileHash,
      });
      fetch(`http://localhost:3000/merge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: params,
      });
    });
  }
}
</script>

<style lang="scss" scoped></style>
