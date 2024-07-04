const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "prod.bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "TODO App - Production build",
      filename: "prod.html",
      template: "src/index.html",
    }),
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
  ],
});
