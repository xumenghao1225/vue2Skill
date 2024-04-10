<style lang="scss" scoped></style>

<template>
  <div></div>
</template>

<script></script>
<template>
  <div ref="pdfContainer"></div>
</template>

<script>
import pdfjsLib from "pdfjs-dist";

export default {
  name: "PdfViewer",
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.renderPdf();
  },
  methods: {
    async renderPdf() {
      const pdfContainer = this.$refs.pdfContainer;

      // Load PDF document
      const loadingTask = pdfjsLib.getDocument(this.url);
      const pdf = await loadingTask.promise;

      // Render pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        pdfContainer.appendChild(canvas);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      }
    },
  },
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
