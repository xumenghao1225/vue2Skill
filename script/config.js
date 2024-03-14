/**
 * @description: DllPlugin配置项信息
 */
class DllConfig {
  /** 生成的dll文件存放路径 */
  static dllPath = "public/dll";
  /** 需要抽离的依赖目录 */
  static chunkEntryEnum = {
    vue: [
      "vue",
      "vuex",
      "vue-router",
      "vue-class-component",
      "vue-property-decorator",
    ],
    elementUI: ["element-ui"],
  };
}

module.exports = {
  DllConfig,
};
