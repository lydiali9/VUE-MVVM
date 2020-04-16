'use strict'

// 配置需要复制的目录和排除打包的文件
// copyPluginArr和externalsObj需要对应
const utils = require('./utils');
console.log('==================utils====================');

module.exports = {
	// 需要复制的文件目录
	copyPluginArr: [

	],
	// 删除打包的文件，定义当前项目打包的文件，外部依赖的文件，要和merge-uglify.js文件一一对应
	externalsObj: {
		
	}
}