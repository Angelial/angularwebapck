## 初学 angular+webpack+bootstrap环境搭建

第一次接触webpack，同时也是第一次搭建webpack的环境，记录下这次搭建webpack踩过的坑，以便之后翻阅查看。
以下都是自己在搭建的过程中碰到的问题，在网上查到的资料，在此总结如下：


项目需要兼容低版本的浏览器，最低支持到IE8，选择包的版本时需要选择能够兼容IE8的版本。

包的版本号选择：

angularjs1.2：angularjs1.3及其以上不在支持IE8，在此只能选择angularjs1.2

bootstrap2.X：bootstrap3.0及其以上不在支持IE8，在此只能选择bootstrap2.X(只使用bootstrap的样式)

angular-ui-bootstrap0.12.X：能够支持angular1.2.X 和bootstrap2.x

webpack版本号3.8.1 -- 当前最新版本  截止2017-10-28

接下来就是需要对IE低浏览器做一些兼容性的处理，特别是IE8浏览器，如下：

### angular + webpack兼容IE8浏览器

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
        

执行压缩之后，会发现IE低版本浏览器又报错，知道问题出在UglifyJS压缩上，查看文档发现UglifyJS需要配置一些参数来支持IE低版本浏览器：

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


3.2 这里还涉及到一个AngularJS压缩的问题：

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
 
 使用webpack-dev-server时还需要webpack.HotModuleReplacementPlugin 热替换模块插件的配合.
  
          module: {
            plugins : [
                new webpack.HotModuleReplacementPlugin()
            ]
          }
    
执行yarn start:dev 然后在IE浏览器中打开，会发现IE10, 9，8都报错。
这个问题暂未解决，不过把webpack-dev-server的版本降低到2.6.1（其他版本没有试过）在IE10，9正常工作，IE8报Object.defineProperty的问题。

前面有说过Object.defineProperty的问题可以使用`babel-preset-es2015  babel-preset-es2015-loose`解决。
但是在这里好像是因为webpack-dev-server和HotModuleReplacementPlugin执行顺序的问题（猜的），一直得不到解决，在网上找了好多资料也没有找解决的方法。

暂时性的解决方法：开发环境中使用webpack-dev-server和HotModuleReplacementPlugin 暂不考虑IE8， 在发布环境中去除这两项兼容IE8， 
详情查看webpack.config.js(开发环境)和webpack.production.config.js（发布环境）。

5. [按需分离  require.ensure()](http://www.css88.com/doc/webpack2/guides/code-splitting-require)

> require.ensure() 是CommonJS异步引入资源的方法。通过require.ensure(), 可以在代码中定义一些需要分离的模块，这样webpack能够在这些分离模块内部，创建包含内部所有代码的独立bundle

> webpack在编译时，会静态地解析代码中的require.ensure()，同时将模块添加到一个分开的chunk当中。这个新的chunk会被webpack通过jsonp来按需加载

语法如下：

        require.ensure(dependencies:string[], callback:function(require), chunkname:string)
    
注意：
    require.ensure内部依赖于Promise。如果在旧的浏览器中使用require.ensure，
    需要添加[ES6-Promise](https://github.com/stefanpenner/es6-promise), 在入口文件头部加入：
    
            var Promise = require("es6-promise").Promise;
            
            
6. AngularJS指令的IE8兼容问题：

自定义指令如： 
        
        var app = angular.module("myApp", []);
        app.directive("myele", [function(){
                return {
                    restrict: "AE",
                    template: "<h1>自定义指令</h1>"
                };
         }]);

在IE8浏览器中直接使用`<myele></myele>`是不支持的，
AngularJS可以通过`restrict`来设置指令的调用方式

    E 作为元素名使用
    A 作为属性使用
    C 作为类名使用
    M 作为注释使用

经测试IE8中可以使用`A 作为属性使用` 也就是写成 `<div myele></div>`方式可以兼容IE8(类名和注释的使用未测试，可行性暂时不知)。

  在angular-ui-bootstrap中有些是通过自定义指令`<元素名></元素名>`的方式调用，
  这时就可以修改成`<div 属性名></div>`的方式兼容IE8
  

到此已经基本上把IE8兼容问题解决，现在可以开始愉快的开发了。

### 其他配置

1. HtmlWebpackPlugin
