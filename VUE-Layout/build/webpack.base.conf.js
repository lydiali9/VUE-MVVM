'use strict'
const path = require('path');
const webpack = require('webpack');
const utils = require('./utils');
const config = require('../config');
const VueLoaderConfig = require('./vue-loader.conf');
const CopyWebpackplugin = require('copy-webpack-plugin');
const noPackConf = require('./nopack.conf.js'); // 不需要打包的文件

console.log('==================webpack.base.conf.js====================');

// dev环境不使用hash
const isHash = process.env.NODE_ENV === 'production' ? '.[hash:7]' : '';
const isHttpStg = process['http_env'] === 'stg';

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

// eslink ...
const createLintingRule = () => ({
    // loader默认从右向左执行，从下往上执行
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre', // 强制让这个loader在下面的loader之前执行
    include: [resolve('src'), resolve('test')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})

// 在当前项目中解析目录
module.exports = {
    context: path.resolve(__dirname, '../'),
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve('src')
        }
    },
    module:{
        rules:[
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: VueLoaderConfig
            },
            {
                test: /\.html$/,
                loader: resolve('tools/loaders/swig-loader.js'),
                options: {
                    isHttpStg: isHttpStg
                },
                include: resolve('src')
            },
            {
                test: /\.js$/,
                // 当有设置时，指定的目录将用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程
                // loader: 'babel-loader?cacheDirectory',
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            },
            // {
            //     test: /apis\.js$/,
            //     loader: require('tools/loaders/codeselect-loader.js'),
            //     options: {
            //         isHttpStg: isHttpStg
            //     },
            //     include: [resolve('src/assets/libs/custom')]
            // },
            // //支持css
            // {
            //     test:/\.css$/,
            //     use:ExtractTextWebpackPlugin.extract({
            //         use:['css-loader?minimize','postcss-loader'],//这种方式引入css文件就不需要style-loader了
            //     })
            //     //use:['style-loader','css-loader']//从右往左解析
            // },
            // {
            //     test:/\.less$/,
            //     use:ExtractTextWebpackPlugin.extract({
            //         use:['css-loader?minimize','less-loader','postcss-loader'],
            //     })
            //     //use:['style-loader','css-loader','less-loader'],//
            // },
            //支持图片和相应字体
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 100,
                    name: utils.assetsPath('imgages/[name]' + isHash + '.[ext]')    // 将图片都放入 img 文件夹下，[hash:7]防缓存
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 100,
                    name: utils.assetsPath('media/[name]' + isHash + '.[ext]')    // 将图片都放入 img 文件夹下，[hash:7]防缓存
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name]' + isHash + '.[ext]')   // 将字体放入 fonts 文件夹下
                }
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({ // 定义全局的变量
            'process.env.http_env': JSON.stringify(process.env['http_env'])
        }),
        // 考虑到也许做离线包使用，所以只移动再html文件中静态引入的文件，应该先删除该文件夹再复制
        new CopyWebpackplugin(noPackConf.copyPluginArr)
    ],
    externals: noPackConf.externalsObj,
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}