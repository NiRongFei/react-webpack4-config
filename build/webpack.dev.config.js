const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.base.config.js')

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-soure-map',
  entry: ['react-hot-loader/patch'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
    chunkFilename: '[name].js'
  },
  plugins: [
    // 开启热更新
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        VUEP_BASE_URL: '/'
      }
    })
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, '../dist'),
    host: 'localhost',
    port: 3000,
    historyApiFallback: true, // 404跳转index.html
    proxy: {
      // 代理后台接口地址
      '/api': 'http://localhost:3000'
    }
  }
})
