## 知识点梳理

- webpack的相关概念和基础使用
- 搭建基本的前端开发环境
- webpack如何解析代码模块路径
- 配置loader
- 使用plugin
- 更好地使用webpack-dev-server
- 开发和生产环境的构建配置差异
- 用HMR提高开发效率
- 优化前端资源加载
  - 图片加载优化和代码压缩
  - 分离代码文件
  - 进一步控制JS大小
- 提升webpack的构建速度
- 探究webpack内部工作流程
- 创建自己的loader
- 创建自己的plugin

## webpack安装

项目内安装

```js
npm install webpack webpack-cli --save-dev
npx webpack -v // 查询版本
npm info webpack // 查看webpack的历史发布信息
npm install webpack@x.xx webpack-cli -D // 安装指定版本
```



## webpack配置文件

默认配置文件 `webpack.config.js`

不使用默认的配置文件，例如想用` webpackconfig.js`作为配置文件并执行

```js
npx webpack --config webpackconfig.js
```

修改package.json字段

```js
"scripts":{
  	"bundle": "webpack" // 这里不加npx，因为npm run执行的命令，会优先使用项目工程里的包，效果和npx类似
}
```



## webpack核心概念

### entry

指定打包入口文件

### output

打包后的文件位置

### loader

webpack默认只知道如何处理js模块，其他格式如css、图片等进行模块处理就需要用loader了
loader执行顺序：从右到左，从下到上

```js
// webpack.config.js
module: {
  rules: [
    {
      test: /\.(png|jpe?g|gif)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name]_[hash].[ext]',
          outputPath: 'images/',
        },
      },
    },
  ];
}  
```

#### file-loader

`npm install file-loader -D`
处理静态资源模块，它做的事情就是把打包入口中识别出的资源模块，移动到输出目录，并且返回一个地址名称。
使用场景：txt、svg、csv、excel、图片等

#### url-loader

- `npm install url-loader -D`
- 可以处理file-loader能够处理的所有事情，但是遇到jpg格式的模块，会把该图片转换成base64格式字符串，并打包到js里。对小体积的图片比较合适，对大图片不合适。
- 缺点：增加打包后的js的体积，用户的加载速度会变慢

#### css-loader & style-loader

- `npm sintall style-loader css-loader -D`
- 它能分析css模块之间的关系，并合成一个css
- style-loader会把css-loader生成的内容，以style挂载到页面的header部分

```js
  module: {
      rules: [
        ...
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"]
        },
        ...
      ]
    },
```

#### sass-loader

- `npm instal sass-loader node-sass -D`
- sass-loader把sass语法转换成css，依赖node-sass模块

```js
  {
     test: /\.scss$/,
     use: ["style-loader", "css-loader", "sass-loader"]
  }
```

#### stylus-loader

#### postcss-loader

- `npm install post-loader autoprefixer -D`

```js
  {
     test: /\.css$/,
     use: ["style-loader", "css-loader", "postcss-loader"]
  },
```

- 新建post.config.js

```js
  module.exports = {
    plugins: [require("autoprefixer")]
  };
```



### plugins

- plugin可以在webpack运行到某个阶段的时候，帮你做一些事情，类似于生命周期的概念
- 插件目录：https://www.webpackjs.com/plugins/

#### html-webpack-plugin

- `npm install -D html-webpack-plugin`
- 它会在打包结束后，自动生成一个html文件，并把打包生成的js模块引入到该html中

#### clean-webpack-plugin

- `npm install -D clean-webpack-plugin`
- 在打包前都会清除之前的文件，生成新的带有hash值的文件

```js
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  ...
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "html 模板",
      template: "./index.html"
    }),
		...
  ],
  ...
};
```

#### mini-css-exract-plugin

- 现在css都是放在style里，这个插件可以抽离css成独立的文件

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
  ];
}
```

#### CommonsChunkPlugin

- https://www.webpackjs.com/plugins/commons-chunk-plugin/
- 多页面打包时，可以拆出公共的模块
- 通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存到缓存中供后续使用。这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。



### sourceMap

- 源代码与打包后的代码的映射关系
- 在dev模式下默认开启，可以在配置文件中设置关闭

```js
devtool: "none"
```



### webpack-dev-server

- 提升开发效率，修改完代码之后不再需要重新打包、刷新浏览器
- 启动服务后，会发现dist目录没有了，这是因为dev-server不会把打包后的模块放在dist目录下，而是放在内存中，提升速度
- `npm install webpack-dev-server -D`

```js
// package.json
"scripts": {
  "server": "webpack-dev-server",
  ...
}

// webpack.config.js
...
devServer: {
  contentBase: "./dist",
  open: true,
  hot: true,
  hotOnly: true
},
...
```

### 跨域 & proxy

- 主要用于开发环境接口联调，上线之后解决跨域可以用nginx转发
- 创建server.js，启动一个服务器，mock一个接口
- `npm i express axios -D`

```js
// package.json
"scripts": {
  "server": "webpack-dev-server",
  "mock": "node server.js"
},

// server.js
const express = require("express");
const app = express();
app.get("/api/info", (req, res) => {
res.json({
  name: "xbl",
  age: 18,
  msg: "hello,xbl"
});
});

app.listen("9092");
```

- 项目中安装axios

```js
import axios from 'axios';
axios.get('/api/info').then(res => {
  console.log(res);
});
```

- 修改webpack.config.js设置服务器代理

```js
devServer: {
  proxy: {
    "/api": {
       target: "http://localhost:9092"
    }
  }
},
```

### HMR 热模块替换

- hot module replacement
- 需要使用module.hot.accept来观察模块更新，从而更新
- 头部引入webpack

```js
// webpack.config.js
  
const webpack = require("webpack");
...
devServer: {
    contentBase: "./dist",
    open: true,
    hot: true,
    hotOnly: true
},
...

// 插件出添加
plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "html 模板",
      template: "./index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
],
```

### Babel处理ES6

- 官网：https://babeljs.io/

#### babel-loader 

- babel-loader是webpack与babel的通信桥梁，不会做把es6转成es5的工作，这部分需要@babel/preset-env来做

#### @babel/core

- Babel compiler core.

#### @babel/preset-env

- `npm i babel-loader @babel/core @babel/preset-env -D`
- @babel/preset-env中包含了es6转es5的转换规则

```js
const arr = [new Promise(() => {}), new Promise(() => {})];
arr.map(item => {
  console.log(item);
});
```

- 以上几步还不够，Promise没有转换过来，这就需要借助 @babel/polyfill，把es的新特性都装进来，来弥补低版本浏览器中缺失的特性

#### @babel/polyfill

- `npm install --save @babel/polyfill`

```js
// webpack.config.js
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: "babel-loader",
  options:{
     presets:["@babel/preset-env"]
  }
},

// index.js
import "@babel/polyfill"
```

- 此时会发现打包的体积大了很多，这是因为polyfill默认会把所有特性注入进来，如何做到只注入用到的特性呢？

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: "babel-loader",
  options:{
    presets:[
      ["@babel/preset-env",
        {
          targets:{
            edge:"17",
            firefox:"60",
            chrome:"67",
            safari:"11.1"
          },
          useBuildtIns:"usage"
        }
      ]
    ]
  }
},
```

- 当我们开发的是组件库，工具库这些场景的时候，polyfill就不适合了，因为polyfill注入到全局变量中，会污染全局变量，所以推荐闭包的方式：@babel/plugin-transform-runtime

#### @babel/plugin-transform-runtime

- `npm i -D @babel/plugin-transform-runtime`
- `npm i -S @babel/runtime`
- 使用方法
  - index.js中不需要再引入polyfill

```js
// import "@babel/polyfill"
```

- 修改配置文件，注释掉之前的presets，添加plugins

```js
plugins: [
  ...
[
  "@babel/plugin-transform-runtime",
  {
    "absoluteRuntime": false,
    "corejs": 2,
    "helpers": true,
    "regenerator": true,
    "useESModules": false
  }
]
...
],
```

- babelrc文件
  - 可以用.babelrc文件代替以上plugins中的配置
  - 新建.babelrc文件

```js
// .babelrc
{
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 2,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}

// webpack.config.js
{
   test: /\.js$/,
   exclude: /node_modules/,
   loader: "babel-loader"
},
```

### 配置React打包环境

#### 安装react

`npm install react react-dom --save`

#### 编写react代码

```js
// index.js
import "@babel/polyfill";

import React, { Component } from "react";
import ReactDom from "react-dom";

class App extends Component {
  render() {
    return <div>hello world</div>;
  }
}

ReactDom.render(<App />, document.getElementById("app"));
```

#### 安装插件

- 安装babel与react转换的插件
- `npm install -D @babel/preset-react`
- 新建babelrc文件

```js
{
   "presets": [["@babel/preset-env"], "@babel/preset-react"]
}
```

### 配置vue打包环境

- `npm i -D vue vue-loader vue-template-compiler`
- 使用vue-loader解析.vue文件，template-compiler解析模板

```js
{
  test: /\.vue$/,
  loader: "vue-loader"
},
...
plugins:[
  new VueLoaderPlugin()
]
```

- 这个插件是将你定义过的其他规则复制并应用到`.vue`文件里相应语言的块。例如，如果你有一条匹配规则`/\.js$/`的规则，那么它会应用到.vue文件里的`<script>`