const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: ["@babel/polyfill", "./main.js"],
  output: {
    filename: "js/[hash:8][name].js",
    path: path.resolve(__dirname, "/dist"),
  },
  devServer: {
    port: 2131,
    open: true,
    contentBase: path.resolve(__dirname, "dist"),
    compress: true,
    index: "index.html",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/transform-runtime"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.relative(__dirname, "index.html"),
    }),
  ],
  devtool: "cheap-module-eval-source-map",
};
