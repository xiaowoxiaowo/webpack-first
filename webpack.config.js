const HtmlWebpackPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const config = require('./public/config')[isDev ? 'dev' : 'build']
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()
const Happypack = require('happypack')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const webpackConfig = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-eval-source-map' : 'none', //开发环境下使用,定位到源码的行
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: '[name].[hash:6].js',
    publicPath: '/' //通常是CDN地址
  },
  devServer: {
    //contentBase: path.resolve(__dirname, './src/html'),
    open: true,
    hot: true,
    port: '3000', //默认是8080
    quiet: false, //默认不启用,是否不提示提示错误信息
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error
    overlay: false, //默认不启用, 是否全屏输出错误
    clientLogLevel: "silent", //日志等级
    compress: true, //是否启用 gzip 压缩
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        //use: ['cache-loader','babel-loader'],
        use: 'Happypack/loader?id=js',
        /*如果配置在这里
         use: {
         loader: 'babel-loader',
         options: {
         presets: ["@babel/preset-env"],
         plugins: [
         [
         "@babel/plugin-transform-runtime",
         {
         "corejs": 3
         }
         ]
         ]
         }
         },*/
        include: [path.resolve(__dirname, 'src')]
        //exclude: /node_modules/ //排除 node_modules 目录
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
              // if hmr does not work, this is a forceful method.
              reloadAll: true
            }
          }, 'css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')()
                ]
              }
            }
          }, 'less-loader'],
        //exclude: /node_modules/
        include: [path.resolve(__dirname, 'src')]
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240, //10K
              esModule: false,
              name: '[name]_[hash:6].[ext]',
              outputPath: 'assets'
            }
          }
        ],
        //exclude: /node_modules/
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },
  plugins: [
    //数组 放着所有的webpack插件
    new Happypack({
      id: 'js', //和rule中的id=js对应
      //将之前 rule 中的 loader 在此配置
      use: ['cache-loader','babel-loader'] //必须是数组
    }),
    /*new Happypack({
      id: 'css', //和rule中的id=js对应
      //将之前 rule 中的 loader 在此配置
      use: ['cache-loader',MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
    }),*/
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', //打包后的文件名
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      chunks: ['index']
      /*config: config.template,*/
      // hash: true //是否加上hash，默认是 false
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html', //打包后的文件名
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      chunks: ['login']
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns:['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/static/'),
          to: path.resolve(__dirname, 'dist', 'static'),
          flatten: false
          /*globOptions: {
           ignore: ['.*']
           }*/
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[hash:6].css'
      //个人习惯将css文件放在单独目录下
      //publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath
    }),
    new OptimizeCssPlugin(),    //压缩css文件, 如果配置在 optimization，那么还需要再配置一下 js 的压缩
    //new webpack.NamedModulesPlugin(),
    //new webpack.HotModuleReplacementPlugin()
    //new HardSourceWebpackPlugin(),
    //new BundleAnalyzerPlugin()
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {//分割代码块
      cacheGroups: {
        vendor: {
          //第三方依赖
          priority: 1, //设置优先级，首先抽离第三方模块
          name: 'vendor',
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 1 //最少引入了1次
        },
        //缓存组(一般没有这个吧)
        common: {
          //公共模块
          chunks: 'initial',
          name: 'common',
          minSize: 100, //大小超过100个字节
          minChunks: 3 //最少引入了3次
        }
      }
    }
  }
}

module.exports = smp.wrap(webpackConfig)