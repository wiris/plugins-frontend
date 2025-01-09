const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (config, context) => {
  return {
    entry: {
      app: path.resolve(__dirname, "./global.js"),
    },
    output: {
      path: path.resolve(__dirname, ""),
      filename: "./plugin.min.js",
      globalObject: "this",
    },
    devServer: {
      devMiddleware: {
        writeToDisk: true,
      },
      static: {
        directory: path.join(__dirname, "./"),
      },
      onListening:
        config && config.devServer ? config.devServer.onListening : "",
      hot: true,
      port: 9008,
      host: "0.0.0.0",
    },
    // Set watch to true for dev purposes.
    watch: false,
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          // These options prevent Terser from generating a LICENSE.txt file
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    mode: "none",
    module: {
      rules: [
        {
          // Rule to translate ES5 javascript files to ES6.
          test: /\.js$/,
          exclude:
            /node_modules\/(?!(@wiris\/mathtype-html-integration-devkit)\/).*/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/env"],
            },
          },
        },
        {
          test: /\.wasm$/,
          type: "asset/inline",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          type: "asset/inline",
        },
        {
          // For the modal close, minimize, maximize icons
          test: /\.svg$/,
          type: "asset/source",
        },
      ],
    },
    stats: {
      colors: true,
    },
    experiments: {
      topLevelAwait: true,
      asyncWebAssembly: true,
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        SERVICE_PROVIDER_URI: "https://www.wiris.net/demo/plugins/app",
        SERVICE_PROVIDER_SERVER: "java",
      }),
      new CleanWebpackPlugin({
        root: process.cwd(),
        verbose: true,
        dry: false,
        cleanOnceBeforeBuildPatterns: ["app.*"],
      }),
    ],
  };
};
