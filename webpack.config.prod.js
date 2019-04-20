'use strict';

var path = require('path');

var webpack = require('webpack');
var combineLoaders = require('webpack-combine-loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    vendor: [
      '@babel/polyfill'
    ],
    main: [
      path.join(__dirname, 'src/client/main.tsx')
    ],
  },
  output: {
    path: path.join(__dirname, 'src/public/js'),
    filename: '[name].js',
    publicPath: '/src/assets/public/'
  },
  plugins:[
    new webpack.NamedModulesPlugin(),
    new ForkTsCheckerWebpackPlugin({
      // Maximum for CircleCI Free
      workers: 2
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        'screw_ie8': true,
        'keep_fnames': true
      },
      compress: {
        'screw_ie8': true,
        warnings: false
      },
      comments: false,
      minimize: true
    }),
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '~': path.join(__dirname, '/src/client'),
      '@Shared': path.join(__dirname, '/src/shared')
    }
  },
  module: {
    loaders: [{
      test: /\.(j|t)s?(x)?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
    }, {
      test: /\.json?$/,
      loader: 'json-loader'
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: combineLoaders([{
          loader: 'css-loader'
        }])
      })
    }]
  }
};
