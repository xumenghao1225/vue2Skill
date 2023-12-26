const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 9527,
    client: {
      overlay: false,
    },
  },
  css: {
    sourceMap: false,
    loaderOptions: {
      scss: {
        additionalData(content, loaderContext) {
          const { resourcePath, rootContext } = loaderContext;
          const relativePath = path.relative(rootContext, resourcePath);
          if (relativePath.replace(/\\/g, "/") !== "src/style/variables.scss") {
            return `@import "~@/style/variables.scss";${content}`;
          }
          return content;
        },
      },
    },
  },
});
