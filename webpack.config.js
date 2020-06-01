const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const WorkBoxPlugin = require('workbox-webpack-plugin')

const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')

process.env.NODE_ENV = 'development'

module.exports = {
    entry: ['./src/index.js', './src/index.html'],
    output: {
        filename: "js/index.[contenthash:10].js",
        path: resolve(__dirname, 'dll'),
        library: '[name]_[hash]'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins:() => {
                                require('postcss-preset-env')
                            }
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins:() => {
                                require('postcss-preset-env')
                            }
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    // 图片小于8k被处理为base64
                    limit: 8*1024,
                    esModule: false
                }
            },
            {
                test: /\.html$/,
                use: [
                    'html-withimg-loader'
                ]
            },
            {
                // 其它资源
                exclude: /.(html|js|css|less|jpg|png|jpg|gif)/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]'
                }
            },
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: /node_modules/,
                options: {
                    fix: true // 自动修复
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: 2
                        }
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        useBuiltIns: 'usage',
                                        corejs: {
                                            version: 3
                                        },
                                        targets: {
                                            chrome: '60',
                                            ie: '9'
                                        }
                                    }
                                ]
                            ],
                            cacheDirectory: true
                        }
                    }
                ]

            }
        ]
    },
    plugins: [
        // html-webpack-plugin默认会创建一个空html文件
        // 自动引入打包输出的所有资源（js/css）
        new HtmlWebpackPlugin({
            template: './src/index.html'
            // minify: {
            //     collapseWhitespace: true,
            //     removeComments: true
            // }
        }),
        new MiniCssExtractPlugin({
            filename: 'index.[contenthash:10].css'
        }),
        new WorkBoxPlugin.GenerateSW({
            clientsClaim: true, // 新的 Service Worker 被激活后使其立即获得页面控制权
            skipWaiting: true // 强制等待中的 Service Worker 被激活
        }),
        // 告诉哪些包不参与打印
        new webpack.DllReferencePlugin({
            manifest: resolve(__dirname, 'dll/manifest.json')
        }),
        // 将某个文件打包输出，并在html中自动引入改资源
        new AddAssetHtmlWebpackPlugin({
            filepath: resolve(__dirname, 'dll/js/jquery.js')
        })
        // new OptimizeCssAssetsWebpackPlugin()
    ],
    // 将node_modules中代码单独打包为一个chunk最终输出
    // 自动分析多入口chunk，有没有公共文件。若果有会单独打包为一个chunk
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    mode: 'development',
    // 只在内存中打包
    // 启动devServer: webpack-dev-server(npm i webpack-dev-server -D)，运行：npx webpack-dev-server
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        compress: true,
        port: 3000,
        open: true,
        hot: true
    },
    devtool: "source-map",
    externals: {
        jquery: 'jQuery'
    }
}