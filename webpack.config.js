var webpack = require("webpack");
var es3ifyPlugin = require('es3ify-webpack-plugin');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var path = require('path');
var buildPath = path.resolve(__dirname, "build"); //发布目录
var publicPath = ''; //资源引用统一前缀
var devtool = ''; //source-map模式
var CleanWebpackPlugin = require("clean-webpack-plugin");
var __DEV__ = process.env.NODE_ENV === 'dev'; //发布环境

var webpackDevServer = require("webpack-dev-server");

// config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");


if (!__DEV__) {
    //压缩

    publicPath = "ngwebpack/build/";
    devtool = 'source-map';
}

module.exports = {
    //入口文件配置
    entry: {
        app: ['babel-polyfill', path.resolve(__dirname, 'www/app/app.js')],
        vendor: ['angular', 'angular-ui-router', 'oclazyload'],
    },
    //文件导出的配置
    output: {
        path: buildPath,
        filename: "script/[name][hash].js",
        // publicPath: publicPath,
        chunkFilename: "chunks/[name].chunk[hash].js"
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'raw-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader:"babel-loader",
        },{
            test: /\.js$/,
            loader: "es3ify-loader"
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "angular-webpack",
            template: __dirname + '/www/template/index.html',
            filename: './index.html',
            inject: true
        }),
        new CleanWebpackPlugin(["build"]),
        new es3ifyPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name : "vendor",
            chunks: "script/vendor[hash].js"
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: buildPath,
        hot: true,
        inline: true,
        stats: 'errors-only',
        progress: true,
        port: 3200
    },
};