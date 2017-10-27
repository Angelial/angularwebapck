####angular+webpack+bootstrap 兼容IE8浏览器

1. es6在低版本浏览器上不支持，为了能够在低版本上使用es6，就需要通过babel把es6的代码转换成es5代码：

`babel-core  babel-loader  babel-preset-env`

`babel-runtime babel-plugin-transform-runtime`
作用是使用新的API例如：Promise, Set, Map等新增对象

`babel-preset-es2015  babel-preset-es2015-loose`
这两个一起用据说可以解决ie8下报 Object.defineProperty 的问题。

产生Object.defineProperty的问题是由于babel编译后产生的在代码中使用 
`import export` 时出现, 也可以不使用ES6,使用Common.js规范

webpack.config.js配置：

        module: {
            loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }]
        }
.babelrc 配置：

        {
            "presets": [
                ["env, {"modules": false}],
                ["es2015", {"loose": true}]
            ],
            "plugins": ["tranform-runitme"],
            "comments": false,
            "env": {
                "test":{
                    "presets" : ["env", "es2015-loose"]
                 }
            }
        }


2. 缺少标识符问题

一般是使用了保留字 default， class， catch等

使用`es3ify-loader`来处理，用es3ify把代码从es5转成es3来支持IE低版本浏览器，让保留字加上引号。

webpack.config.js配置：

        module: {
            loaders: {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "es3ify-loader"
            }
        }
如果还出现缺少标识符的问题，可能因为es3ify-loader没法在node_modules中转换模块，通过`es3ify-webpack-plugin`可以解决此问题。

webpack.config.js配置：

    var es3ifyPlugin = require("es3ify-webpack-plugin");
    
        module: {
            plugins: [
                new es3ifyPlugin()
            ]
        }

3. 压缩之后出现的一些问题：

3.1 `webpack.optimize.UglifyJSPlugin`是webpack自带的一款压缩插件。

 webpack.config.js配置：

        module: {
            plugins: [
                new webpack.optimize.UglifyJSPlugin()
            ]
        }
        
    
执行压缩之后，会发现IE低版本浏览器又报错，很明显UglifyJS需要配置一些参数来支持IE低版本的浏览器：

        new webpack.optimize.UglifyJSPlugin({
            compress: {
                //是否将常量属性名转为调用表达式
                //默认是true，修改为false
                properties: false,
                //在UglifyJs删除没有用到的代码时不输出警告
                wargins: false  
            }，
            output: {
                //保留对象字面量中的引号
                quote_keys: true
            }，
            mangle: {
                //screw_ie8默认为true，把支持IE8的代码删除
                //修改成false
                screw_ie8: false
            },
            sourceMap: false
        })

到这里IE低版本浏览器在webpack里兼容基本算是结束了。


3.2 这里还涉及到一个angular压缩的问题：

        app.controller("ctrl", function($scope){
            ......
        });

以上的代码压缩之后会注入失败，这是因为压缩之后括号里的$scope被替换会影响module对依赖的识别。

解决方法是在[ ]内将依赖名以字符串的形式作为数组元素声明一遍，这样即便控制器参数中的依赖变量被替换，$injiect服务仍然能通过前面的字符串声明取得（字符串不变）:

        app.controller("ctrl", ["$scope", function($scope){
             ......
        }]);


4. webpack-dev-server 是webpack提供的一个本地开发服务器

| devserver的配置项 | 功能描述                  |
| ----------------- | :-----------------------:|
|contenttBase      |默认webpack-dev-server会为根文件夹提供本地服务器， 如果想为另外一个目录下的文件提供本地服务器， 应该在这里设置其所在目录|
|port             | 设置默认监听端口，如果省略，默认为8080|
| inline| 设置为true， 当源文件改变时会自动刷新页面|
| historyApiFallback|在开发单页应用时非常有用，她依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html|

webpack.config.js配置：

        module:{
            devServer: {
                contentBase: path.join(__dirname, "build"),
                post: 9000
            }
        }
        
 package.js 配置
 
        "scripts" : {
            "start:dev": "webpack-dev-server --open"
        }
 
  使用webpack-dev-server时还需要webpack.HotModuleReplacementPlugin插件的配合，
    
    
执行yarn start:dev 然后在IE浏览器中打开，会发现IE10, 9，8都报错。
这个问题暂未解决，不过把webpack-dev-server的版本降低到2.6.1（其他版本没有试过）在IE10，9正常工作，IE8报Object.defineProperty的问题。

前面有说过Object.defineProperty的问题可以使用`babel-preset-es2015  babel-preset-es2015-loose`解决。
但是在这里好像是因为webpack-dev-server和HotModuleReplacementPlugin执行顺序的问题（猜的），一直得不到解决，在网上找了好多资料也没有找解决的方法。

暂时性的解决方法：开发环境中使用webpack-dev-server和HotModuleReplacementPlugin 暂不考虑IE8， 在发布环境中去除这两项兼容IE8， 
详情请查看webpack.config.js(开发环境)和webpack.production.config.js（发布环境）。




                                                                                          ----未完待续            
