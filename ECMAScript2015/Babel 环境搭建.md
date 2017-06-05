# 环境搭建

以下内容为了不让项目产生环境依赖，没有使用全局安装的方式。你可以新建一个文件夹，在其内部执行。

## 浏览器环境

> babel 6 开始不再支持浏览器环境, 如果你使用的是 babel 6+ , 那么你需要以构建工具, 这里仅使用 babel 5

终端运行一下命令安装 babel:
```shell
npm install babel-core@5
```
mac中, 将以下路径js文件引入 html 中：
```shell
node-modules/babel-core/browser.js
```

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>Babel in Browser</title>
</head>
<body>
</body>
<script type="text/javascript" src="js/browser.js"></script>
<script type="text/babel">
  // code in ES6 here
</script>
</html>
```

## node环境

node 环境本身是支持 ES6 的, 不过它提供了把 ES6 的代码转换为 ES5 的方法：
在项目目录中执行：
```shell
# ES2015转码规则
npm install --save-dev babel-preset-2015

# react转码规则
$ npm install --save-dev babel-preset-react

# ES7不同阶段语法提案的转码规则(0 表示完全支持)
$ npm install --save-dev babel-preset-stage-0
```
然后在项目根目录下创建`.babelrc` 文件:
```json
{
    "presets": [
      "es2015",
      "react",
      "stage-0"
    ],
    "plugins": []
  }
```
这个文件很重要，添加插件都有编辑这个文件。

还可以用一个钩子关联`.ES6` `.es` `.jsx` `.js`文件
```shell
npm install --save-dev babel-register
```
方法是在入口脚步头部加入：
```js
require("babel-register");
```

当然以上方法不会对 ES6 特有的类、对象、方法进行转换, 如果需要应安装 babel-polyfill 模块：
```shell
npm install babel-polyfill --save
```
并在所有脚步头部加入：
```js
require('babel-polyfill');
//or
import 'babel-polyfill';
```

## 命令行环境
在项目目录中执行：
```shell
npm install --save-dev babel-cli
```
之后继续执行以下代码就进入 ES6 的 REPL 环境, 可以直接运行 ES6 代码：
```shell
babel-node
```
如果执行 js 文件, 可以：
```shell
babel-node ES6Node.js
```
还有一下命令把 ES6 代码转换为 ES5 代码：
```shell
# 转换为 ES5 并输出代码
babel ES6.js

# 转换 ES6.js 并输出到指定文件
babel ES6.js -o ES5.js

# 转换整个文件夹中的 ES6 代码文件到 ES5
babel -d build-dir source-dir

# 转换整个文件夹中的 ES6 代码文件到 ES5, 并生成 source.map
babel -d build-dir source-dir -s
```
此外还有 babel 的在线转码器：[https://babeljs.io/repl](https://babeljs.io/repl)

## JS 文件内

之前已经安装了 babel-core 就可以在 JS 文件内使用 babel:
```js
var babel = require('babel-core');

// 字符串转码
babel.transform('code();', options);
// => { code, map, ast }

// 文件转码（异步）
babel.transformFile('filename.js', options, function(err, result) {
  result; // => { code, map, ast }
});

// 文件转码（同步）
babel.transformFileSync('filename.js', options);
// => { code, map, ast }

// Babel AST转码
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```
之后可以直接用以下代码转码:
```js
var ES6Code = "let x = n => n + 1";
var ES5Code = require('babel-core').transform(ES6Code, {
  "presets": ["es2015"]
}).code;
```
得到如下代码：
```js
`"use strict";
var x = function x(n){
  return n + 1;
};`
```
配置对象options，可以参看官方文档[http://babeljs.io/docs/usage/options/](http://babeljs.io/docs/usage/options/)。

这里举一个使用的例子：
现在想使用 babel 的 Decorator，我们需要先安装 babel-core 和 babel-plugin-transform-decorators
```shell
npm install babel-core babel-plugin-transform-decorators
```
然后配置 `.babelrc` 文件:
```json
{
  plugins: ['transform-decorators']
}
```
此时就可以用 babel 对 Decorator 转码了。
脚本中打开的命令如下：
```shell
babel.transfrom("code", {plugins: ["transform-decorators"]})
```
