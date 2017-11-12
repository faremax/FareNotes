## 安装

首先你需要[点击这里](http://nodejs.cn/download/)安装 nodejs（npm）。然后执行：

建立一个目录作为项目根目录并初始化：
```shell
mkdir react-webpack
cd react-webpack/
npm init
```

安装相关组件

这里包括了本文所需要的全部组件
```shell
npm i --save-dev react react-dom react-transform-hmr webpack webpack-dev-server babel-core babel-loader babel-preset-react babel-preset-es2015 babel-plugin-react-transform css-loader style-loader less less-loader react-transform-catch-errors redbox-react --registry=https://registry.npm.taobao.org
```

下面简单说明上述组件功能

1. react: react基础组件
2. react-dom: react 操作 DOM 组件
3. react-transform-hmr: hot module reloading 为热替换依赖插件
4. webpack: webpack 基础组件
5. webpack-dev-server: webpack 服务器组件
6. babel-core: babel 核心组件
7. babel-loader: 转码工具
8. babel-preset-react: 支持 react 转码
9. babel-preset-es2015: 支持 ES6 转码
10. babel-plugin-react-transform: 实现 babel 热替换
11. css-loader: 对 css 文件进行打包
12. style-loader: 将样式添加进 DOM 中
13. less: less 语法支持
14. less-loader: 对 less 文件进行打包
15. react-transform-catch-errors: 将错误显示在浏览器中
16. redbox-react: 渲染插件，配合上一个使用显示错误

## hello world

建立如下目录结构(图中不包括 node_modules 目录，实际项目中必须保留，下同)

![这里写图片描述](http://img.blog.csdn.net/20171112100629140?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvRmFyZW1heA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

其中 webpack.config.js 内容如下
```js
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',   //开启 soursemap
  entry: path.resolve(__dirname, './src/index.js'),  //指定入口
  output: {      //设置输出路径
    path: path.resolve(__dirname, './build'),
    filename: "index.js"
  },
  module: {    //设置 babel 模块
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  },
  plugins: [    //加载插件
    new webpack.HotModuleReplacementPlugin() //热模块替换插件
  ]
};
```

其中 .babelrc 内容如下：
```json
{
  "presets": [
    "react",
    "es2015"
  ]
}
```

其中 src/index.js 内容如下：
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello World</h1>,
  document.getElementById('root')
);
```

其中 build/index.html 内容如下：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>demo</title>
</head>
<body>
  <div id="root"></div>
</body>
<script src="index.js"></script>
</html>
```

修改 package.json 中的 scripts 部分如下：
```js
"scripts": {
  "build": "webpack"
}
```

而后运行 'npm run build' 运行在本地 './build/index.html' 看到渲染的页面

## 服务器环境配置

修改或添加 webpack.config.js 中以下部分：
```js
entry: ['webpack/hot/dev-server', path.resolve(__dirname, './src/index.js')],  //指定入口
devServer: {   //配置本地服务器
  contentBase: './build',
  colors: true,
  historyApiFallback: true,
  inline: false,
  port: 4444,
  process: true
}
```

修改 package.json 中的 scripts 部分如下：
```js
"scripts": {
  "build": "webpack",
  "dev": "webpack-dev-server"
}

而后运行 'npm run dev' 运行在本地 'http://localhost:4444/' 看到渲染的页面


## 配置 css 和 less

在 ./src/ 中添加 index.less 和 font.css，分别写入以下内容测试功能

```css
/* index.less */
h1 {
  background-color: red;
}
/* font.css */
h1 {
  color: yellow;
}
```

修改 webpack.config.js 部分：

```js
module: {    //设置 babel 模块
  loaders: [{
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: "babel-loader"
  },{
    test: /\.css$/,
    loader: 'style-loader!css-loader'
  },{
    test: /\.less$/,
    loader: 'style-loader!css-loader!less-loader'
  }]
}
```

修改 src/index.js 如下：
```js
import React from 'react';
import ReactDOM from 'react-dom';
import './font.css';
import './index.less';

ReactDOM.render(
  <h1>Hello World</h1>,
  document.getElementById('root')
);
```

然后重启运行(由于修改了 webpack.config.js，不能使用热替换)页面可以看到相关样式
