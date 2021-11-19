const path = require("path");

// const { ESBuildMinifyPlugin } = require("esbuild-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
// const FederatedStatsPlugin = require("webpack-federated-stats-plugin");
const nodeExternals = require("webpack-node-externals");
// const { StatsWriterPlugin } = require("webpack-stats-plugin");
const packageJsonDeps = require("./package.json").dependencies;
const dotenv = require("dotenv").config();

const WEBPACK_REMOTE_URL = dotenv.WEBPACK_REMOTE_URL || "http://localhost:3001";
const WEBPACK_REMOTE_2_URL =
  dotenv.WEBPACK_REMOTE_2_URL || "http://localhost:3003";

const REMOTE_HOSTS = {
  webpackRemote: WEBPACK_REMOTE_URL,
  webpackRemote2: WEBPACK_REMOTE_2_URL,
};

const REMOTES = Object.entries(REMOTE_HOSTS)
  .map(([name, entry]) => ({
    [name]: `${entry}/static/container.js`,
  }))
  .reduce((acc, n) => ({ ...acc, ...n }), {});

/**
 * @type {webpack.Configuration}
 */
const clientConfig = {
  entry: { app: ["./src/index.jsx"] },
  output: {
    path: path.resolve("./public/build"),
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    // new StatsWriterPlugin({
    //   filename: "stats.json",
    //   stats: { all: true },
    // }),
    // new FederatedStatsPlugin({
    //   filename: "federation-stats.json",
    // }),
    new webpack.EnvironmentPlugin({
      REMOTE_HOSTS,
    }),
    new webpack.container.ModuleFederationPlugin({
      name: "webpackHost",
      filename: "remote-entry.js",
      remotes: REMOTES,
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: packageJsonDeps.react,
        },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: packageJsonDeps["react-dom"],
        },
      },
    }),
  ],
  // optimization: {
  //   minimizer: [new ESBuildMinifyPlugin({})],
  // },
};

/**
 * @type {webpack.Configuration}
 */
const serverConfig = {
  target: "node",
  entry: { app: "./src/components/app.jsx" },
  output: {
    path: path.resolve("./dist"),
    library: { type: "commonjs" },
  },
  externals: [nodeExternals()],
  externalsPresets: { node: true },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: {
          loader: "css-loader",
          options: {
            modules: {
              exportOnlyLocals: true,
            },
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      REMOTE_HOSTS,
    }),
    new webpack.container.ModuleFederationPlugin({
      name: "webpackHost",
      filename: "remote-entry.js",
      library: { type: "commonjs" },
      remotes: REMOTES,
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: packageJsonDeps.react,
        },
      },
    }),
  ],
  optimization: {
    minimize: false,
  },
};

module.exports = [clientConfig, serverConfig];
