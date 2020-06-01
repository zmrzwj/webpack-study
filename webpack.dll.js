const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    entry: {
        // 最终打包生产[name] --> jquery
        jquery: ['jquery']
    },
    output: {
        filename: "js/[name].js",
        path: resolve(__dirname, 'dll'),
        library: '[name]_[hash]'
    },
    plugins: [
        // 使用dll，对某些库进行单独打包
        // 打包生产一个manifest.json --> 提供和jquery映射
        // new webpack.DllPlugin({
        //     name: '[name]_[hash]',
        //     path: resolve(__dirname, 'dll/manifest.json')
        // })
        // 告诉哪些包不参与打印
        new webpack.DllReferencePlugin({
            manifest: resolve(__dirname, 'dll/manifest.json')
        }),
        // 将某个文件打包输出，并在html中自动引入改资源
        new AddAssetHtmlWebpackPlugin({
            filepath: resolve(__dirname, 'dll/jquery.js')
        })
    ],
    mode: 'production'
}