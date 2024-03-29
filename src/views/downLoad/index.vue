<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "DownLoad",
})
export default class DownLoad extends Vue {
  fileList = [{}];
  download(filename: string) {
    fetch(
      `http://localhost:3000/download?filename=${encodeURIComponent(filename)}`
    )
      .then((response) => {
        // Check if response is successful
        if (!response.ok) {
          throw new Error("File download failed");
        }
        // Convert response to blob
        return response.blob();
      })
      .then((blob) => {
        // Create object URL from blob
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const a = document.createElement("a");
        // Set link's href to the object URL
        a.href = url;
        // Set link's download attribute to the desired filename
        a.download = filename; // You can specify the filename here
        // Append link to body
        document.body.appendChild(a);
        // Click the link to initiate download
        a.click();
        // Remove the link from the DOM
        document.body.removeChild(a);
        // Revoke the object URL to free up memory
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        // Handle error here
      });
  }

  getFiles() {
    fetch("http://localhost:3000/files")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.fileList = data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>

<template>
  <div class="download-container-wrapper">
    <el-button @click="download('chromedriver-win64.zip')"
      >chromedriver-win64.zip</el-button
    >
    <el-button @click="getFiles">getFiles</el-button>
  </div>
</template>
