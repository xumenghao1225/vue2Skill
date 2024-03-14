// webpack.dll.config.js 这个命名可以随意取用，和package.json dll脚本指向同一位置即可
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const { join } = require("path");
const { DllConfig } = require("./script/config");

function resolve(dir) {
  return join(__dirname, dir);
}
module.exports = {
  entry: {
    // 可以放置多个
    ...DllConfig.chunkEntryEnum,
  },
  mode: "production",
  output: {
    path: resolve(DllConfig.dllPath), // 存放动态链接库的目录
    filename: "[name].dll.js", // 动态链接库的名称，如'vendors.dll.js'
    library: "[name]_library", // 动态链接库输出的文件名
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // dll输出文件*.manifest.json *.js
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: "[name]_library", // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      path: join(__dirname, DllConfig.dllPath, "[name].manifest.json"), // 描述动态链接库文件的 manifest.json 文件输出时的文件名称(路径)
      context: DllConfig.dllPath, // 根据实际路径自己配置
      entryOnly: false, // 此乃神坑
    }),
  ],
};
