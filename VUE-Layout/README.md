# VUE-Layout

# 手动搭建基于webpack3.0+的vue2.0+开发环境

## 什么是webpack？

Webpack的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包为一个（或多个）浏览器可识别的JavaScript文件。

## webpack是基于node的

在项目的根目录下创建webpack.config.js的文件，执行webpack命令时会默认读取这个配置文件。

```js
//webpack.config.js
module.exports = {
    entry:'',//入口文件(可配置多入口文件)
    output:{},//出口文件
    module:{},//处理相应的模块
    plugins:[],//插件模块
    devserver:{},//服务器配置模块
    mode:"development",//打包模式(development or production)
}
```

## 最简单的webpack配置

下面来看一下最简单的webpack配置

```js
//webpack.config.js
conts path = require('path');//node自带处理文件路径模块

module.exports = {
    entry:'./src/main.js',//入口文件，webpack会从这个文件来分析项目依赖
    output:{
        filename:'bundle.js',//打包后的文件的名称
        path:path.resolve('dist')//打包后输出的位置
    }
}
```

