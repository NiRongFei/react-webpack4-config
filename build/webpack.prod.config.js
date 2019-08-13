const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.base.config.js')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
  },
  // 配置代码分割
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        jquery: {
          name: 'jquery',
          priority: 10,
          test: /[\\/]node_modules[\\/]jquery[\\/]/
        },
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        },
        default: {
          priority: -20,
          minChunks: 2,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    // 清除无效CSS代码
    new PurifyCSS({
      paths: glob.sync([
        path.resolve(__dirname, '..', 'src/*.html'),
        path.resolve(__dirname, '..', 'src/*.js'),
        path.resolve(__dirname, '..', 'src/**/*.jsx')
      ])
    }),
    // 配置PWA
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    // 配置插件打包后注入到index.html
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll/jquery.dll.js')
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '..', 'dll/jquery-manifest.json')
    })
  ]
})
