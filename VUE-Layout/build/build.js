'use strict'
require('./check-versions')();
process.env.NODE_ENV = 'production';
// 在部署环境 必须对process.env.NODE_ENV设置，否则在node执行的文件中找不到该对象属性，DefinePlugin中在配置的JS文件中找不到
console.log('==================build====================' + JSON.stringify(process.env['http_env']));

var fs = require('fs');
var path = require('path');
var ora = require('ora');
var rm = require('rimraf');
var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');
var config = require('../config');
var webpackConfig = require('./webpack.prod.conf');

// 获取需要打包的目录
const modulesDirPath = path.resolve(__dirname, '../src/modules');
const moduleNameArr = fs.readdirSync(modulesDirPath);
let needPackModuleArr;
let needPackModuleArrLen;

// 如果为all表示src目录下所有目录都需要打包
// 部署环境应该同时构建所有的目录，以免有些文件修改了没有部署
needPackModuleArr = moduleNameArr.filter(curModule => {
  let curModulePath = modulesDirPath + '/' + curModule
  return fs.statSync(curModulePath).isDirectory();
});
needPackModuleArrLen = needPackModuleArr.length;

// 不存在需要打包的目录时，停止打包
if(!needPackModuleArrLen) {
  console.log(chalk.red("需要打包的目录为空停止打包"));
  process.exit(1);
}

var spinner = ora(chalk.cyan('building for production...'));
spinner.start();

// 模块对应的打包配置对象组成的数组
let webpackConfigObj = {};
for (var i = 0; i < needPackModuleArrLen; i++) {
  let moduleName = needPackModuleArr[i];
  let opts = {
    dirName: moduleName
  }
  webpackConfigObj[moduleName] = webpackConfig(opts);
}

// 删除整个dist目录之后再打包，以免有文件泄漏
rm(path.join(config.build.assetsRoot), err => {
  if(!err) {
    startBuild();
  }

  // 优化项，再打包之前，优先运行dll打包不变的第三方，判断打包成功再进行startBuild
})

const startBuild = function() {
  let webpackModuleNameArr = Object.keys(webpackConfigObj);
  let webpackConfigArr = Object.values(webpackConfigObj);

  console.log(chalk.cyan(` \n总共打包${webpackConfigArr.length}目录...\n`));
  console.log(chalk.cyan(` \n正在打包的目录是${webpackModuleNameArr}...\n`));

  webpack(webpackConfigArr, (err, stats) => {
    if (err) throw err
    spinner.stop()

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log('000000000000000000000000' + stats);
    if(stats.hasErrors()) {
      console.log(chalk.cyan(' Build failed with errors'));
      process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
}