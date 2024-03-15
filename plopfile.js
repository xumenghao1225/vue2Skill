const viewGenerator = require("./plop-templates/views/prompt");
const componentGenerator = require("./plop-templates/components/prompt");
const storeGenerator = require("./plop-templates/store/prompt.js");

module.exports = function (plop) {
  plop.setGenerator("view", viewGenerator);
  plop.setGenerator("component", componentGenerator);
  plop.setGenerator("store", storeGenerator);
};
