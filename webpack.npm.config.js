const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    index: ["@babel/polyfill", "./src/MConfigForm/index.js"],
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js",
  },
  externals: {
    react: "react", //打包时候排除react
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
  plugins: [new CleanWebpackPlugin()],
};
