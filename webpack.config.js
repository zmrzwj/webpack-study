const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const WorkBoxPlugin = require('workbox-webpack-plugin')

const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')

process.env.NODE_ENV = 'development'

module.exports = {
    // entry入口点
    //entry:'./src/index.js' 打包形成一个chunk，输出一个bundle文件，单入口
    //entry: {index: './src/index.js', index2: './src/index2.js'},多入口,
    //entry: ['./src/index.js', './src/index2.js'] 只会形成一个chunk输出一个文件，多入口{}和[]可以同时使用
    entry: ['./src/index.js', './src/index.html'],
    output: {
        // 文件名
        filename: "js/index.[contenthash:10].js",
        // 输出文件目录
        path: resolve(__dirname, 'dll'),
        // 所有公共资源引入公共路径前缀
        publicPath: "/",
        chunkFilename: "js/[name]_chunk.js", // 非入口chunk的名称
        // libraryTarget: "window", // 变量名添加到window上
        library: '[name]_[hash]', // 整个库向外暴露的变量名
        libraryTarget: "global" // 变量名添加到node上
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
                // 排除其它资源
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
                include: reslove(__dirname, 'src'),
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
    // mode: 'development',
    mode: 'production',
    // 只在内存中打包
    // 启动devServer: webpack-dev-server(npm i webpack-dev-server -D)，运行：npx webpack-dev-server
    devServer: {
        // 运行代码的目录
        contentBase: resolve(__dirname, 'build'),
        // 监视contentBase目录下的所有文件，一旦文件变化就reload
        watchContentBase: true,
        // 开启压缩
        compress: true,
        port: 3000,
        // 自动打开浏览器
        open: true,
        // 开启HMR
        hot: true,
        // 不要显示启动服务日志
        clientLogLevel: 'none',
        // 除了一些基本启动信息以外，其它内容不显示
        quiet: true,
        // 出错，不要全屏提示
        overlay: false,
        // 服务器代理
        proxy: {
            '/api': {
                target: 'http://192.168.11.216',
                // 路径重写，将/api/xxx --> /xxx(去掉/api)
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    devtool: "source-map",
    externals: {
        jquery: 'jQuery'
    },
    // 解析模块的规则
    resolve: {
        // 解析模块路径别名, 优点简写路径，确定没有代码提示
        alias: {
            $css: resolve(__dirname, 'src/css') // import '$css/index.css'
        },
        // 配置省略文件路径的后缀，帮助省略后缀名
        extensions: ['.js', '.jsx', '.css'], // import '$css/index'相当于import '$css/index.css'
        // 告诉webpack解析模块去哪里找, 默认会一层一层往外找
        modules: [resolve(__dirname, '../../node_modules'), 'node_modules']
    }
}