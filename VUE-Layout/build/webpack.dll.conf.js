const path = require('path');
const webpack = require('webpack');

// 一般第三方的包是不会变的，
// 但是webpack每次打包，还是回去处理第三方的包
// 我们首先对第三方的包处理，然后再打包

console.log('================webpack.dll.conf.js==============');

module.exports = {
	entry: {
		vendor: ['vue', 'vue-router', 'axios'],
		ui: ['element-ui'],
		echarts: ['echarts']
	},
	output: {
		path: path.resolve(__dirname, '../static/dll/'),
		filename: '[name].[hash].dll.js',
		library: '[name]'
	},
	plugins: [
		new webpack.DllPlugin({ // 帮助优化打包的速度
			path: path.join(__dirname, '../static/dll/', '[name]-manifest.json'),
			name: '[name]'
		}),
		new webpack.optimize.UglifyJsPlugin()
	]
}
// happypack
// JS是单线程的
// node是可以开webwork的
// 多线程利用node的webpack多线程来处理文件