const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  output: {
    filename: "dev.bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "TODO App - Development build",
      filename: "dev.html",
      template: "src/index.html",
    }),
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
  ],
});
