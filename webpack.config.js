var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin"),
    path = require('path'),
    buildPath = path.resolve(__dirname, "build"), //发布目录
    publicPath = '', //资源引用统一前缀
    devtool = '', //source-map模式
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    __DEV__ = process.env.NODE_ENV === 'dev', //发布环境
    plugins = [
        new HtmlWebpackPlugin({
            chunks: ['app', 'vendor'],
            template: __dirname + '/www/template/index.html',
            filename: './index.html'
        }),
        new HtmlWebpackPlugin({
            chunks: ['app', 'vendor'],
            template: __dirname + '/www/template/mobile.html',
            filename: './mobile.html'
        }),
    ];

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
        // vendor2: ['es5-shim', 'es5-shim/es5-sham']
    },
    //文件导出的配置
    output: {
        path: buildPath,
        filename: "script/[name].js",
        // publicPath: publicPath,
        chunkFilename: "chunks/[name].chunk.js"
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'raw-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader:"babel-loader",
                options:{
                    presets: ["env", "es2015-loose"]
                }
            }
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
        new webpack.optimize.CommonsChunkPlugin({
            name : "vendor",
            chunks: "script/vendor.js"
        })
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         properties: false,
        //         warnings: false
        //     },
        //     output: {
        //         keep_quited_props: true,
        //         beautify: true,
        //         quote_keys: true
        //     },
        //     mangle: {
        //         screw_ie8: false
        //     },
        //     sourceMap: false
        // })
    ]
};