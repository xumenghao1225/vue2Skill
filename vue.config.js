const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
// const HtmlWebpack = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const { DllConfig } = require("./script/config");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    port: 9527,
    client: {
      overlay: false,
    },
    hot: true,
    proxy: {
      "/nodeapi": {
        target: "http://localhost:3000",
        changeOrigin: true,
        pathRewrite: {
          "/nodeapi": "",
        },
      },
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
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["!dist/dll"],
      }),
      // new HtmlWebpack({
      //   filename: "index.html",
      //   templateParameters: {
      //     BASE_URL: `/`,
      //   },
      //   template: resolve("./public/index.html"),
      //   inlineSource: ".(js|css)$",
      //   inject: "body",
      // }),
      new PreloadWebpackPlugin({
        // it can improve the speed of the first screen, it is recommended to turn on preload
        rel: "preload",
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial",
        excludeHtmlNames: ["script"],
      }),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: path.join(__dirname, DllConfig.dllPath, `vue.manifest.json`), // 只需要这个映射json即可
      }),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: path.join(
          __dirname,
          DllConfig.dllPath,
          `elementUI.manifest.json`
        ), // 只需要这个映射json即可
      }),
    ],
    externals: {
      elemetUI: "element-ui",
      Vue: "vue",
    },
    module: {
      noParse: /node_modules\/(element-ui\.js)/,
      rules: [
        {
          test: /\.vue$/,
          include: path.resolve(__dirname, "../src"),
          exclude: /node_modules/,
          use: [
            "cache-loader",
            "vue-style-loader!css-loader!sass-loader",
            "vue-style-loader!css-loader!sass-loader?indentedSyntax",
            "thread-loader",
          ],
        },
        {
          test: /\.(j|t)s$/,
          include: path.resolve(__dirname, "../src"),
          exclude: /node_modules/,
          use: ["thread-loader", "cache-loader", "ts-loader"],
        },
        {
          test: /\.(jpg|png|gif|bmp|jpeg)$/,
          include: path.resolve(__dirname, "../src"),
          exclude: /node_modules/,
          use: [
            "thread-loader",
            "cache-loader",
            "url-loader?limit=50000&name=[hash:8]-[name].[ext]",
          ],
        },
        {
          test: /\.(ttf|eot|svg|woff|woff2)$/,
          include: path.resolve(__dirname, "../src"),
          exclude: /node_modules/,
          use: ["thread-loader", "cache-loader", "url-loader"],
        },
      ],
    },
  },
  chainWebpack(config) {
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete("prefetch");
    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            maxInitialRequests: 5,
            chunks: "initial", // only package third parties that are initially dependent
          },
          // elementUI: {
          //   name: "chunk-elementUI", // split elementUI into a single package
          //   priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          //   test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          // },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
          styles: {
            //样式抽离
            name: "chunk-styles",
            test: /\.(sa|sc|c)ss$/,
            chunks: "all",
            enforce: true,
          },
        },
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
  },
});
