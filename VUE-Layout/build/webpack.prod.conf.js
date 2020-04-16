'use strict'
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const curHttpEnv = process.env['http_env'] || 'prd';

console.log('================webpack.prod.conf.js==============');

// webpack.Providelugin提供库
module.exports = function(opts = {}) {
    if(!opts.dirName) {
        console.log('   未指定打包目录 停止打包...');
        return false;
    }
    let webpackConfig = merge(baseWebpackConfig, prodConfig(opts))

    if(config.build.productionGzip) {
        const CompressionWebpackPlugin = require('compression-webpack-plugin');

        webpackConfig.plugins.push(
            new CompressionWebpackPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp(
                    '\\.(' + config.build.productionGzipExtensions.join('|') + ')$'
                ),
                threshold: 10240,
                minRatio: 0.8
            })
        )
    }

    if(config.build.bundleAnalyzerReport) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        webpackConfig.plugins.push(new BundleAnalyzerPlugin())
    }

    return webpackConfig;
}

const prodConfig = function(opts) {
    if(!opts.dirName) return false;
    return {
        module: {
            rules: utils.styleLoaders({
                sourceMap: config.build.productionSourceMap,
                extract: true,
                usePostCSS: true
            })
        },
        devtool: config.build.productionSourceMap ? config.build.devtool : false,
        entry: {
            'main': './src/modules/' + opts.dirName + config.build.entryFile
        },
        output: {
            path: config.build.assetsRoot + '/' + opts.dirName,
            filename: utils.assetsPath('js/[name].[chunkhash:7].js'),
            chunkFilename: utils.assetsPath('js/[name].[chunkhash:7].js'),
            publicPath: config.build.assetsPublicPath
        },
        plugins: [
            // http://vuejs.github.io/vue-loader/en/workflow/production.html
            new webpack.DefinePlugin({ // 定义全局变量
                'process.env': require('../config/prod.env')
            }),
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: curHttpEnv === 'prd' ? true : false // 只有部署的环境代码
                    }
                },
                sourceMap: config.build.productionSourceMap,
                parallel: true,
                cache: true
            }),
            // Compress extracted CSS. We are using this plugin so that possible
            new ExtractTextPlugin({
                filename: utils.assetsPath('css/[name].[contenthash].css'),
                allChunks: true,
                disable: false
            }),
            // duplicated CSS from different components can be deduped.
            new OptimizeCSSPlugin({
                cssProcessorOptions: config.build.productionSourceMap 
                ? { safe: true, map: { inline: false } } : { safe: true }
            }),
            new webpack.HashedModuleIdsPlugin(), // 保持module.id稳定， 长缓存优化
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'main',
                async: 'vendor',
                children: true,
                minChunks: 2
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                minChunks: Infinity
            }),
            // new ParallelUglifyPlugin({
            //     cacheDir: '.cache/',
            //     uglifyJS: {
            //         output: {
            //             comments: false
            //         },
            //         compress: {
            //             warnings: false
            //         }
            //     }
            // }),
            // extract css into its own file
            
            
            // generate dist index.html with correct asset hash for caching.
            // you can customize output by editing /index.html
            // see https://github.com/ampedandwired/html-webpack-plugin
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'src/modules/' + opts.dirName + '/index.html',
                inject: true,
                minify: {
                    removeComments: true, // 是否删除<!-- -->不删除//注释
                    collapseWhitespace: false, // 是否保留页面结构
                    removeAttributeQuotes: false // 是否移除引号
                    // more options:
                    // https://github.com/kangax/html-minifier#options-quick-reference
                },
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                chunksSortMode: 'dependency',
                chunks: ['manifest', 'vendor', 'main']
                // favicon: path.resolve(__dirname, '../src/assets/images/xxx.ico')
                // favicon: path.resolve(__dirname, '')
            }),
            // copy custom static assets
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, '../static'),
                    to: config.build.appComPath,
                    ignore: ['.*']
                }
            ]),
            // 指向将webpack.dll.conf.js打包的static/dll目录文件下
            new webpack.DllReferencePlugin({
                manifest: require('../static/dll/ui-manifest.json')
            }),
            new webpack.DllReferencePlugin({
                manifest: require('../static/dll/vendor-manifest.json')
            }),
            new webpack.DllReferencePlugin({
                manifest: require('../static/dll/echarts-manifest.json')
            })
        ]
    }
}
