'use strict'
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

console.log('================webpack.dev.conf.js==============');

var devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap,
            usePostCSS: true
        })
    },
    entry: utils.getEntryConfig('./src/modules/*/index.js'),
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].js'), // dev环境不需要hash
        chunkFilename: utils.assetsPath('js/[name].js'),
        publicPath: config.dev.assetsPublicPath
    },
    // cheap-module-eval-ource-map is faster for development
    devtool: config.dev.devtool,
    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                {
                    from: /.*/, 
                    to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
                }
            ]
        },
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay ? { warnings: true, errors: true } : false, // 监控有错误时，页面和控制台都会报错
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: false, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll
        }
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file name in console on update
        new webpack.NoEmitOnErrorsPlugin(), // 屏蔽错误 有错误时 不中断开发服务
        
        // copy custom static assets
        new CopyWebpackPlugin([ // 单独拷贝目录
            {
                from: path.resolve(__dirname, '../static'),
                to: config.dev.appComPath,
                ignore: ['.*']
            }
        ])
    ]
})

const pageConfig = utils.getEntryConfig('./src/modules/*/index.html');

for(let moduleName in pageConfig) {
    let conf = {
        filename: moduleName + '/index.html',
        template: pageConfig[moduleName],
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
    }

    if(!!moduleName && !!devWebpackConfig.entry[moduleName]) {
        conf.chunks= [moduleName]
    }

    devWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = devWebpackConfig.devServer.port;
    portfinder.getPort((err, port) => {
        if(err) {
            reject(err)
        } else {
            process.env.PORT = port;
            devWebpackConfig.devServer.port = port;

            // add FriendlyErrorsPlugin 没有起作用
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    message: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}/moduleName/index.html`]
                },
                onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined
            }))
            resolve(devWebpackConfig)
        }
    })
})



