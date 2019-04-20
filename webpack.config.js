/* eslint-disable */

const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    vendor: [
      '@babel/polyfill'
    ],
    main: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?timeout=2000&path=/__webpack_hmr',
      path.join(__dirname, 'src/client/main.tsx')
    ]
  },
  output: {
    path: path.join(__dirname, 'src/assets/public/js'),
    filename: '[name].js',
    publicPath: '/js/',
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  watch: true,
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({
      workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '~': path.join(__dirname, '/src/client'),
      '@Shared': path.join(__dirname, '/src/shared'),
      'react-dom': '@hot-loader/react-dom',
    }
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          },
        },
      },
      {
        test: /\.json?$/,
        loader: 'json-loader'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
    ]
  }
};
