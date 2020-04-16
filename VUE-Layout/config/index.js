'use strict'
// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var httpEnv = process.env['http_env']
var proxyConf = require(`./proxy.${httpEnv}.js`)

console.log('==============config/index.js================');

module.exports = {
    // 本地开发环境的相关配置
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    cssUrlPublicPath: '/', // 提取css文件时，处理里面的图片路径问题
    entryFile: '/index.js', // 每个目录的入口文件
    staticPath: path.resolve(__dirname, '../dist/static'), // 打包时移动项目根目录下的statis目录到dist目录下
    appComPath: path.resolve(__dirname, '../dist/app_com)'), // 打包时移动项目根目录下的statis目录到dist/app_com目录下
    // 代理配置
    proxyTable: proxyConf,
    // 以下为本地开发服务器的设置
    host: 'localhost',
    port: 8066,
    autoOpenBrowser: true,
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    useEslint: false,
    showEslintErrorsInOverlay: false,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    cssUrlPublicPath: './../../', // 提取css文件，处理里面的图片路径问题
    entryFile: '/index.js', // 每个目录的入口文件
    staticPath: path.resolve(__dirname, '../dist/static'),
    appComPath: path.resolve(__dirname, '../dist/app_com)'),
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
