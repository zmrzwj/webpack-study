const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

process.env.NODE_ENV = 'development'

module.exports = {
    entry: ['./src/index.js', './src/index.html'],
    output: {
        filename: "js/index.[contenthash:10].js",
        path: resolve(__dirname, 'build')
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
                loader: 'babel-loader',
                exclude: /node_modules/,
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
    devtool: "source-map"
}