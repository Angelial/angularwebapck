var webpack = require("webpack");
var es3ifyPlugin = require('es3ify-webpack-plugin');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var path = require('path');
var buildPath = path.resolve(__dirname, "build"); //发布目录
var publicPath = ''; //资源引用统一前缀
var devtool = ''; //source-map模式
var CleanWebpackPlugin = require("clean-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool : 'source-map',
    //入口文件配置
    entry: {
        app: ['babel-polyfill', path.resolve(__dirname, 'www/app/app.js')],
        vendor: ['angular', 'angular-ui-router', 'oclazyload'],
    },
    //文件导出的配置
    output: {
        path: buildPath,
        filename: "script/[name][hash:4].js",
        // publicPath: publicPath,
        chunkFilename: "script/chunks/[name].chunk[hash:4].js"
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'raw-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader:"babel-loader"
        },{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "es3ify-loader"
        }, {
            test: /\.css$/,
            use:  ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "angular-webpack",
            template: __dirname + '/www/template/index.html',
            filename: './index.html',
            inject: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name : "vendor",
            chunks: "script/vendor[hash:4].js"
        }),
        new CleanWebpackPlugin(["build/script"]),
        new es3ifyPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("style/style.css")
    ],
    devServer: {
        contentBase: path.join(__dirname, "build"),
        port: 9000
    }
};