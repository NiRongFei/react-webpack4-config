const os = require('os')
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HappyPack = require('happypack')

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      pages: path.resolve(__dirname, '../src/pages'),
      router: path.resolve(__dirname, '../src/router')
    }
  },
  module: {
    rules: [
      {
        // Webpack并发
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'happypack/loader?id=happyBabel'
          }
        ]
      },
      {
        // CSS处理
        test: /\.(sc|sa|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'postcss-loader', 'sass-loader', 'css-loader']
      },
      {
        // 图片处理
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: {
          loader: 'url-loader',
          options: {
            outputPath: 'images/',
            limit: 10 * 1024
          }
        }
      },
      {
        // 字体处理
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 5000,
              publicPath: 'fonts/',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({ $: 'jquery' }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html', // 生成的文件名
      template: path.resolve(__dirname, '..', 'src/template.html'), // 指定模板路径
      minify: {
        collapseWhitespace: true // 去除空白符
      }
    }),
    // 分割CSS代码
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // Webpack并发执行任务
    new HappyPack({
      // 标识待处理文件
      id: 'happyBabel',
      loaders: [
        {
          loader: 'babel-loader?cacheDirectory=true'
        }
      ],
      // 共享进程池以防资源占用过多
      threadPool: happyThreadPool,
      // 输出日志
      verbose: true
    })
  ],
  performance: false
}
