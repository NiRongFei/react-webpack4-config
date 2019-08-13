const path = require('path')
const webpack = require('webpack')

const src = path.resolve(process.cwd(), 'src')
const evn = process.env.NODE_ENV == 'production' ? 'production' : 'development'

module.exports = {
  mode: 'production',
  entry: {
    jquery: ['jquery']
  },
  output: {
    path: path.resolve(__dirname, '..', 'dll'),
    filename: '[name].dll.js',
    library: '[name]_[hash]',
    libraryTarget: 'this'
  },
  plugins: [
    new webpack.DllPlugin({
      // 指定打包入口文件
      context: process.cwd(),
      // 指定文件输出路径
      path: path.resolve(__dirname, '..', 'dll/[name]-manifest.json'),
      // 指定打包文件名
      name: '[name]_[hash]'
    })
  ]
}
