'use strict'
var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require('glob');
var packageConfig = require('../package.json');

// 获取需要打包的目录
var dirNameObj = require('../config/packdir.conf.js');

// 获取在打包文件下的目录
const assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

// 获取公共资源的路径
const assetsCommonPath = function (_path) {
  const assetsRoot = config.build.assetsRoot;
  return path.posix.join(assetsRoot, _path);
}

// 生成每一种样式文件（.css/.sass/.less...）所对应的loader（此时还没有生成loader配置项）
const cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production', // check
      sourceMap: options.sourceMap
    }
  }

  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    // 提取css到单独文件
    // 部署环境使用
    // 开发环境上使用 速度更快
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath: process.env.NODE_ENV === 'production' ? config.build.cssUrlPublicPath : config.dev.cssUrlPublicPath
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
// 生成各自样式文件的loader配置， 不包括.vue文件的loader
const styleLoaders = function (options) {
  var output = []
  var loaders = cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

// 开发环境构建时的回掉函数，用于输出错误日志
const createNotifierCallback = () => {
  const notifier = require('node-notifier');
  return (severity, errors) => {
    if(!severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();

    notifier.notifier({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logn.png')
    })    
  }
}

const getEntryConfig = (globPath) => {
  let entries = {}
  let pathDirArr, moduleName;

  glob.sync(globPath).forEach(function(entry) {
    pathDirArr = entry.split('/').splice(-3);
    moduleName = pathDirArr[pathDirArr.length - 2];
    entries[moduleName] = entry;
  })

  if(dirNameObj.type === 'specify') {
    let specifyModulesArr = dirNameObj.specifyModules || [];
    let cusEntryObj = {};

    for(var i = 0; i < specifyModulesArr.length; i++) {
      let curModuleName = specifyModulesArr[i];
      cusEntryObj[curModuleName] = entries[curModuleName]
    }

    entries = cusEntryObj;
  }
  return entries;
}

module.exports = {
  assetsPath,
  assetsCommonPath,
  cssLoaders,
  styleLoaders,
  createNotifierCallback,
  getEntryConfig
}








