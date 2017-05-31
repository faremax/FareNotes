ECMAScript 6 基础教程

> 之前接触过ES6, 但是简单使用不能让人获得足够的成长, 这里结合阮一峰老师的《ES6标准入门》(第二版), 和自己写代码遇到的坑和感想。继续谈谈ES6, 丰富理解。

> 访问 [Ecma TC39](https://github.com/tc39) 可以查看 ECMAScript 最新的活动和进展。

> 本文中以下功能即使在 Babel 中也还不能使用: 数组推导, 函数参数的尾逗号, 二进制数组视图的 isView 方法, 对象的扩展运算符, Generator 函数推导, module 关键字得到模块全部接口

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

# ECMAScript6 基础篇

## let、const和块级作用域

块级作用于对于强类型语言经验的人应该非常好理解, 一言以蔽之：ES5对变量作用于分隔使用了函数(词法作用域), 而ES6使用花括号(块作用域)。
对于词法作用域在 [javascript函数、作用域链与闭包](http://blog.csdn.net/faremax/article/details/53201809) 中有详细的解释。对于let 和 const声明的变量在花括号的分割下同样会形成作用于链(内部访问外部的, 但外部不能访问内部)。但是花括号对于没有声明直接定义以及用 var 声明的变量没有影响, 这些变量依然遵守词法作用域规则。

对于let 和 const 最大的好处就是避免了可能的运行时错误, 不过也有直观的好处：

- 用块(Blocks)替换立即执行函数(IIFEs)
- 定义循环变量不会外泄
- 循环定义函数可以不用闭包了
- 可以放心的在 if 等条件中定义函数

```js
//用块(Blocks)替换立即执行函数(IIFEs)
//ES5
(function () {
  var food = 'Meow Mix';
}());
console.log(food); // Reference Error

//ES6
{
  let food = 'Meow Mix';
}
console.log(food); // Reference Error
```

```js
var a = [];
for(let i = 0; i < 10; i++){
  a[i] = function(){
    console.log(i);
  }
}
a[6]();       //这里输出6, 在var定义i的for循环中输出 10
console.log(i);    //ReferenceError
```

```js
function b(){console.log("outside");}
function f(){
  if(false){
    function b(){console.log("inside");}
  }
  b();
}
f();   // ES5 中报错："TypeError:b is not a function" 而 ES6 中输出"outside"
```
由此例可以看出 function 定义函数不具有块级作用域。

但我们需要注意的一下几点：

- let 和 const 声明的变量不在 window 的属性中
```js
var a = 10;
let b = 20;
const c = 30;

console.log(window.a);    //10
console.log(window.b);    //undedined
console.log(window.c);    //undedined
```

- let 和 const 声明的变量没有声明提前, 所以在作用域内存在暂时性死区
```js
var temp = 20;
(function area(){
  console.log(temp);  //undefined
  var temp = 30;      //声明提前
}());
if(true){
  console.log(temp);  //ReferenceError   但是 babel 会得到 undefined
  let temp = 20;
}
```
```js
//一个隐蔽的死区
function bar(x = y, y = 2){
  console.log(x, y);
}
bar();    //报错, 因为定义 x 的时候, y 还没有定义 (babel 中不报错，得到 undefined 2)
function par(x = 2, y = x){
  console.log(x, y);
}
par();    //22
```

- let 和 const 声明变量在当前作用域(不包括作用域链)上不能重复。const声明的变量必须初始化, 且不能修改:
```js
let a = 10;
var b = 20;
const c = 30;

let a = 4;    //报错
const b = 3;  //报错
c = 20;   //报错, c是只读的
```

- 不可以连续定义变量
```js
let a=b=3;     //报错 b 未定义
const c=d=2;   //报错 d 未定义
```

- 技巧：ES6 中, 在块作用于外调用内部函数
```js
var f;
{
  f = function(){
    console.log("inside");
  }
}
f();
```

- const 声明的基本变量不可改变, 但复杂变量可以改变其内容
const 这个特性和底层的 c++ 一致, 在 c++ 中 const 相当于常指针 `int * const p`, 也就是其指向的数据所在内存区域可读可写, 但是指针的值初始后就不能改。
```js
const a = 10;
const b = {
  num: 20
};
b.num = 30;
console.log(b.num);   //30
a = 20;         //TypeError
b = {
  num: 90
};              //TypeError
```
如果想让非基本变量内部也不可改变, 需要使用 `Object.freeze()` 方法。可以参考：[javascript对象、类与原型链](http://blog.csdn.net/faremax/article/details/53525721)

- 跨模块常量
对于跨模块的常量, 可以这样写：
```js
// const.js module
export const A = 1;
export const B = 2;

// test.js 文件
import * as constants from './const';
console.log(constants.A);   //1
console.log(constants.B);   //2
//or
import {A, B} from './const';
console.log(A);   //1
console.log(B);   //2

```
## 解构赋值

解构赋值简单来说就是 对应位置(数组)或对应键名(对象)的变量匹配过程。如果匹配失败, 对于一般变量匹配不到结果就是 undefined, 对于具有展开运算符(...)的变量结果就是空数组。

### 数组的解构赋值

```js
var [a, b, c] = [1, 2, 3];   //a=1, b=2, c=3
var [, , c] = [1, 2, 3];   //c=3
var [x, , y] = [1, 2, 3];  //x=1, y=3
var [head, ...tail] = [1, 2, 3, 4];   //head = 1, tail = [2, 3, 4];
var [x, y, ...z] = [1];   //x=1, y=undefined, z=[];
var [a, [b, c], d] = [1, [2, 3], 4];   //a=1.b=2, c=3, d=4
var [a, [b], d] = [1, [2, 3], 4];   //a=1.b=2, d=4
```
数组的解构赋值可以具有默认值, 在 ES6中对于目标数据使用严格相等(===)比较是否为空(undedined)。如果默认值是表达式, 那么对于该表达式采用惰性求值, 即只有在对应位置为空(undedined)时才执行该表达式。
```js
var [a=1, b] = [];   //a=1, b=undefined
var [a=1, b] = [2, 3];  //a=2, b=3
var [a=1, b] = [undefined, 3];   //a=1.b=3
var [a=1, b] = [null, 3];  //a=null, b=3
var [a=1, b] = [NaN, 3];  //a=NaN, b=3

function f(){
  console.log("done");
  return 2;
}
var [a=f()] = [1];    //a=1
var [a=f()] = [];    //a=2, 输出 "done"
```

解构赋值的右侧表达式在必要的隐式转换后如果不具有 iterator 则遍历失败, 关于 iterator, 具体看《ECMAScript6提高篇》的iterator部分。这里可以先记住, 左边是数组结构的解构赋值, 右侧可以是数组, 字符串, 集合, Generator 函数, map等。
```js
//字符串
var [a, b, c, d] = "123";   //a='1', b='2', c='3', d=undefined

//集合
var [a, b, c] = new Set(['1', '2', '3']);  //a='1', b='2', c='3'

//Generator
function* fib(){
  let a = 1;
  let b = 1;
  while(1){
    yield a;
    [a, b] = [b, a + b];      //使用结构赋值实现叠加并交换变量
  }
}
var [a, b, c, d, e, f] = fib();  //a=1, b=1, c=2, d=3, e=5, f=8

//map
var map = new Map();
map.set('a', 1);
map.set('b', 2);
var [a, b] = map;  //a=['a', 1], b=['b', 2]
```

### 对象的解构赋值
对象的解构赋值与变量位置次序无关, 只取决于键名是否严格相等(===)。如果匹配失败, 结果就是 undefined
```js
var {a, b, f} = {b:2, a:3, d:4};  //a=3, b=2, f=undefined
var node = {
  loc: {
    start:{
      x:1,
      y:2
    }
  }
};
var {loc: {start: {x:line}}} = node;  //line=1
```

可以在复制时对属性重命名, 但此时原名只用于匹配参数, 不生成变量：
```js
var {name:alias} = {name:'Bob'};  //alias='Bob'
console.log(name);   //"global"
console.log(alias);   //"Bob"
```

对象解构同样可以指定默认值, 默认值生效(或表达式被行)的条件是对应属性值严格等于(===) undefined
```js
var {a:3, b} = {b:2}; //a=3, b=2
var {a:3, b} = {a:null, b:2}; //a=null, b=2
```

解构嵌套对象父属性不存在会报错：
```js
var {foo:{bar}} = {ba: 2};   //报错
```

解构对象如果和声明分开, 独立成为一行要加圆括号, 就想用 eval 解析 JSON 字符串的时候一样。因为系统会把一行开头花括号默认作为块级作用域的开始, 而不是对象的开始。
```js
var a, b;
({a, b} = {a:2, b:10});   //a=2, b=10
{a, b} = {a:2, b:10};   //报错

//以下表达式无意义, 但没有错
({}=[1, 2]);
({}="abc");
({}=[]);
```
<small>注意, 除了这样的情况, 不要滥用圆括号</small>

右侧变量通过隐式类型转换可以转为对象的情况下也可以结构赋值：
```js
var {toString: s} = 123;  //s=Number.prototype.toString
```

技巧： 解构的用处很多, 包括交换变量, 简化传参(可带默认值),
```js
//参数传递
function f([x, y, z=4]){
  return [x+1, y+2, z+3];
}
var [a, b, c] = f([1, 2]);  //a=2, b=4, c=7
[[1, 2], [3, 4]].map(([a, b]) => a + b);   //返回 [3, 7]
```
```js
//交换变量
var a=2, b=4;
[a, b] = [b, a];  //a=4, b=2
```
## 字符串类型扩展

### unicode

javascript 本可以表示 unicode, ES5 可以直接表示 utf-16 的字符集, 但如果需要表示 utf-32 的字符集就多有不便, 需要使用2个 utf-16 的编码。ES6就这个问题进行了改进, 且与原表示符是等价的(理论上是这样的, 但 js 不能保证都识别正确)：
```js
//ES5
"\uD842\uDFB7"  //"𠮷"

//ES6
"\u{20BB7}"   //"𠮷"

"\uD842\uDFB7" === "\u{20BB7}";   //true
"\u01d1" === "\u004f\u030C";       //理论上是一致的, 但 js 返回了 false

//使用 normalize 统一编码来解决这个问题
"\u01d1".normalize() === "\u004f\u030C".normalize();     //true
```
遗憾的是, `normalize()` 方法只能表示2个 utf-16 字符的合成, 要是3个或以上就只能自己用正则表达式解决了。

至此, 一个字符有了6中表示方法:
```js
//以下结果都是 true
"\x7A" === "z";
"\u{7A}" === "z";
"\u007A" === "z";
"\172" === "z";
"\z" === "z";
```

javascript内部用 utf-16 格式存储字符, 这样仓促的引入 utf-32 的码点会引起许多错误, 所以 ES6 在 `String.prototype` 上添加了 `CodePointAt()` 方法替换 `charCodeAt()`, 用静态方法 `String.fromCodePoint()` 替换了 `String.fromCharCode()`, 以解决因编码差异导致的计算错误。

但是, 我们依然要注意到一下错误：
```js
var a="𠮷a";

console.log(a.length);       //3
console.log(a.charAt(0));    //"\uD842"
console.log(a.split(''));    //["\uD842", "\uDFB7", a]

//这些显然不是我们想要的, 我们需要替换使用
console.log(a.codePointLength());       //下面我们可以自己简单写一个 codePointLength() 方法
console.log(a.at(0));    //"𠮷", ES7 方法, babel中有
console.log(a.toArray());    //下面我们可以自己简单写一个 toArray() 方法
```

为此, 遍历字符串中的每个字符, 请使用 for...of
```js
var a="𠮷a";
for(let alpha of a){
  console.log(alpha);    //依次输出: 𠮷, a
}
```

除此之外, ES6 还提供了一些其他的简单方法, 这里简单带过：
```js
//动态方法
s.includes(str, n);   //s从下标 n 的字符起是否包含 str 字符串, 返回 Boolean, n 默认为 0
s.startsWith(str, n); //s从下标 n 的字符起是否以 str 开头, 返回 Boolean, n 默认为 0
s.endWith(str, n); //s的前 n 个字符是否以 str 结尾, 返回 Boolean, n 默认为字符串长度
s.repeat(n);   //返回将 s 重复 n 次的新字符串, 如果 n 是小数, 会向下取整；如果 n 是 infinity 或小于等于-1 会报错；如果 n 大于-1且小于等于零, 返回空字符串；如果 n 为 NaN, 返回空字符串；其余传输参数遵循隐式类型转换。
s.padStart(minLen, str);  //对于小于 minLen 长度的字符串, 在 s 前用 str 重复补充为 len 长度, 返回该新字符串, 否则返回原字符串。str默认为空格
s.padEnd(minLen, str);  //对于小于 minLen 长度的字符串, 在 s 后用 str 重复补充为 len 长度, 返回该新字符串, 否则返回原字符串。str默认为空格
```

自定义函数计算字符串长度和大小, 以及转化为数组：
```js
//计算字符串长度, 方法1
String.prototype.codePointLength = function(){
  var result = this.match(/[\s\S]/gu);
  return result ? result.length : 0;
};
//计算字符串长度, 方法2
String.prototype.codePointLength2 = function(){
  return [...this].length;
};

//计算字符大小
String.prototype.size = function(){
  var size = 0;
  for(let alpha of this){
    if(alpha.codePointAt(0) > 0xFFFF){
      size+=4;
    } else {
      size+=2;
    }
  }
  return size;
};

var a="𠮷a";
console.log(a.codePointLength());    //2
console.log(a.codePointLength2());    //2
console.log(a.size());   //6

//字符串拆分为数组,方法1
String.prototype.toArray = function(nil){
  if(nil === undefined){
    return Array.from(this);
  }
  if(nil.constructor === RegExp || nil.constructor === String){
    var reg = new RegExp(nil, "u");
    return this.split(reg);
  }
}
//字符串拆分为数组,方法2
String.prototype.toArray2 = function(nil){
  if(nil === undefined){
    return [...this];
  }
  if(nil.constructor === RegExp || nil.constructor === String){
    var reg = new RegExp(nil, "u");
    return this.split(reg);
  }
}

var a="𠮷ds𠮷asaf𠮷saf";
console.log(a.toArray());   //["𠮷", "d", "s", "𠮷", "a", "s", "a", "f", "𠮷", "s", "a", "f"]
console.log(a.toArray('a'));   //["𠮷ds𠮷", "s", "f𠮷s", "f"]
console.log(a.toArray('𠮷'));   //["", "ds", "asaf", "saf"]
console.log(a.toArray2());   //["𠮷", "d", "s", "𠮷", "a", "s", "a", "f", "𠮷", "s", "a", "f"]
console.log(a.toArray2('a'));   //["𠮷ds𠮷", "s", "f𠮷s", "f"]
console.log(a.toArray2('𠮷'));   //["", "ds", "asaf", "saf"]
```

###模板字符串

ES5 中, 我们写一个多行字符很不方便:
```js
//我们这样写动态字符串
var multiStr = "I am " + name;    //假定 name 已定义
//这样写多行字符串
var multiStr = "first line\nsecond line\nthird line";
//在或者这样
var tempArr = ["first line", "second line", "third line"];   //多用于生成动态字符串。此外《编写高质量代码:改善JavaScript程序的188个建议》中指出, 这个方法写静态字符串一样比加号(+)性能更好
var multiStr = tempArr.join("\n");
```

在 ES6 中利用反引号(`` `...` ``)和EL表达式(`${...}`), 我们可以这样：
```js
//我们这样写动态字符串
var multiStr = `I am ${name}`;    //假定 name 已定义
//这样写多行字符串
var multiStr = `
first line
second line
third line
`;
```
注意: 反引号中的所有空格和缩进都会被保留下来

EL表达式中可以放入任何表达式进行运算：
```js
var x=2, y=3;
console.log(`x+y=${x+y}`);    //x+y=5

function plus(a, b){
  return a+b;
}
console.log(`x+y=${plus(x, y)}`);    //x+y=5
```

引用模板字符串本身：
```js
//方法1
let str = 'return ' + '`Hello ${name}`';
let fun = new Function('name', str);
fun('Jack');

//方法2
let str2 = '(name) => `Hello ${name}`';
let fun2 = eval(str2);
fun2('Jack');
```

###标签模板

标签模板是用来处理字符串的函数, 但是调用方式和以往大不相同, 是直接将模板字符串跟在函数名后面, 该函数的结构如下：
```js
function funName(strings, ...values){
   //...
}
```
其中, 以EL表达式作为分界, 前后和表达式之间的字符串部分, 会从左到右依次放入 `strings` 参数中；每一个 EL 表达式会从左到右依次放入 `values` 参数中：
```js
function tag(strings, ...values){
  console.log(strings[0]);
  console.log(strings[1]);
  console.log(strings[2]);
  console.log(values[0]);
  console.log(values[1]);
  return 'OK';
}
//当然, 也可以这样写(关于展开运算符, 这里不做深入讨论, 具体在 ES6 的函数部分展开)
function tag(strings, value0, value1){
  console.log(strings[0]);
  console.log(strings[1]);
  console.log(strings[2]);
  console.log(value0);
  console.log(value1);
  return 'OK';
}
```

下面是完整的调用：
```js
var a = 5;
var b = 10;

function tag(strings, ...values){
  console.log(strings[0]);      //"Hello "
  console.log(strings[1]);      //" world "
  console.log(strings[2]);      //"!"
  console.log(values[0]);       //15
  console.log(values[1]);       //50
  return 'OK';
}

console.log(tag`Hello ${a+b} world ${a*b}!`);     //"OK"
```

当然, 标签模板的正经用法如下：
```js
var a = 5;
var b = 10;

function tag(strings, ...values){
  var result = [], i = 0;
  while(i < strings.length){
    result.push(strings[i]);
    if(values[i]){
      result.push(values[i]);
    }
    i++;
  }
  return result.join('');
}

console.log(tag`Hello ${ a + b } world ${ a * b}!`);   //Hello 15 world 50!
```

当然, 如果将上方 tag 函数中的 `<`, `>`, `&` 都替换掉, 并忽略 `values` 中的内容, 可以用来过滤用户输入数据, 防止恶意代码注入。

值得一提的是, tag的第一个参数 strings 还有一个 raw 属性, 也是一个数组, 内容分别对应 strings 数组的值的原生字符。比如 strings 中 `strings[0]=“a\nb"`, 则 `strings.raw[0]="a\\nb"`。除此之外, ES6 还添加了 `String.raw()` 方法, 用于解析模板字符串, 但返回值的字符串是原生字符, 其内部基本如下：
```js
String.raw = function(strings, ...values){
  var output = "";
  for(var index = 0; index < values.length; index++){
    output += strings.raw[index] + value[index];
  }
  output += string.raw[index];
  retrun output;
};
```

## 数值类型扩展

- 支持二进制和八进制
二进制用 `0b` 或 `0B` 开头, 八进制用 `0o` 或 `0O` 开头：
```js
Number('0b1101');   //13
Number('0o107');    //71
```

- 新加 `Number.isFinite()` 方法判断一个数字是否有限, `Number.isNaN()` 方法判断一个变量是否 NaN。值得注意的是, 如果将非数值传入这两个函数, 一律返回 false。

- 将原有的 `window.parseInt()` 和 `window.parseFloat()` 移植到了 `Number.parseInt()` 和 `Number.parseFloat()`, 行为保持不变。
```js
Number.parseInt === window.parseInt;     //true
Number.parseFloat === window.parseFloat;     //true
```

- 引入 `Number.isInteger()` 判断一个数字是不是整数, 注意到, `3.0` 也是个整数。如果将非数值传入函数, 一律返回 false。

- `Number.EPSILON`, 一个极小的量, 用来解决浮点数计算的误差
```js
if(0.1 + 0.2 === 0.3){
  console.log("true");
} else {
  console.log("false")
}
//以上if语句将输出 false

if(0.1 + 0.2 - 0.3 < Number.EPSILON){
  console.log("true");
} else {
  console.log("false")
}
//以上if语句将输出 true

//其实我们可以封装一下：
Object.defineProperty(Number, "isEqual", {
  value: function isEqual(a, b){
    return Math.abs(a - b) < Number.EPSILON;
  },
  writable: true,
  configurable: true,
  enumerable: false
});

Number.isEqual(0.1 + 0.2, 0.3);    //true
```

- `Number.MAX_SAFE_INTEGER`, `Number.MIN_SAFE_INTEGER` 和 `Number.isSafeInteger()`
js 所能表示的整数介于$-2^{53}$~$2^{53}$之间, 超过的数就会有误差, 所以：
```js
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1;   //true
Number.MIN_SAFE_INTEGER === -Math.pow(2, 53) + 1;    //true
```
我们使用`Number.isSafeInteger()`判断一个数是否在这个范围内, 返回 Boolean 值。如果传入非数字或非整数, 一律返回 false。这里同样注意：`3.0`是个整数。

- Math对象扩展
对于数学运算, 这里不再一一展开了, 以下列举了 ES6 新增的17个数学函数
1. `Math.trunc();` 直接舍去一个数的小数部分。对于无法转换为数值的参数, 返回 NaN
2. `Math.sign();` 符合函数。传入正数返回1, 负数返回-1, 0返回0, -0返回-0, 其他值返回 NaN
3. `Math.cbrt();` 返回一个数的立方根。对于无法转换为数值的参数, 返回 NaN
4. `Math.clz32();` 返回一个数的32位无符号二进制的前导零个数。对于小数, 只考虑器整数部分, 对于无法转换为数值的参数, 返回 32
5. `Math.imul();` 返回2个数有符号32位乘积的十进制, 相当于`(a*b)|0`, 通常和乘法计算一致, 但可防止结果溢出
6. `Math.fround();` 返回一个数的单精度浮点形式。对于无法转换为数值的参数, 返回 NaN
7. `Math.hypot();` 返回所以函数平方和的平方根(欧氏距离)。只要有1个无法转换为数值的参数, 返回 NaN
8. `Math.expm1();` 即$e^x-1$
9. `Math.log1p();` 即$ln(x+1)$, 参数小于0或不能转换为大于零的数, 返回 NaN
10. `Math.log10();` 即$log_{10}{x}$, 参数小于0或不能转换为大于零的数, 返回 NaN
11. `Math.log2();` 即$log_{2}{x}$, 参数小于0或不能转换为大于零的数, 返回 NaN
12. `Math.sinh();` 返回参数的双曲正弦值
13. `Math.cosh();` 返回参数的双曲余弦值
14. `Math.tanh();` 返回参数的双曲正切值
15. `Math.asinh();` 返回参数的反双曲正弦值
16. `Math.acosh();` 返回参数的反双曲余弦值
17. `Math.atanh();` 返回参数的反双曲正切值

- 指数运算符
ES7 提出指数运算符(**),已可以实现
```
2 ** 3 = 8;   //相当于 Math.pow(2, 3)

//支持赋值运算
let a = 2;
a **= 3;
console.log(a);    //8
```

# ECMAScript6 提高篇

## 数组的扩展

- `Array,from()`
将类数组对象和可遍历对象转化为真正的数组。
```js
var arrayLike = {
  '0' : 'a',
  '1' : 'b',
  '2' : 'c',
  'length': 3
}

var arr;
//ES5
arr = [].slice.call(arrayLike);    //arr=['a', 'b', 'c']

//ES6
arr = Array.from(arrayLike);    //arr=['a', 'b', 'c']
```
和它类似的是扩展运算符，一样可以实现该功能(要求对象具有遍历器接口)：
```js
function(){
  var arg = [...arguments];   //转化 arguments 为数组
}
```
Array.from() 接受第二参数(函数)，用来映射结果，相当于 map, 并且可以用第三个参数绑定 this:
```js
Array.from(obj, func, context);
//等价于
Array.from(obj).map(func, context);
```
技巧，用 Array.from() 指定函数运行次数：
```js
var i = 0;
Array.from({length:3}, ()=>i++);   //[0,1,2]
```

- `Array.of()`
将多个值组成数组：
```js
Array.of(2,3,5);   //[2,3,5]
Array.of(2);   //[2]
Array.of();   //[]
Array.of(undefined);   //[undefined]
```

- `Array.prototype.copyWithin()`
函数参数是 `Array.prototype.copyWithin(target, start=0, end=this.length)`, 对当前数组，从截取下标为 start 到 end 的值，从target 位置开始覆盖 `this` 中的值。如果 start 或 end 为负数则倒数。
```js
[1,2,3,4,5].copyWithin(0,3,4);   //[4,2,3,4,5]

[1,2,3,4,5].copyWithin(0,-2,-1);   //[4,2,3,4,5]

[].copyWithin.call({length:5,3:1},0,3);   //{0:1,3:1,length:5}

var i32a = new Int32Array([1,2,3,4,5]);
i32a.copyWithin(0,2);   //[3,4,5,4,5]
```

- `Array.prototype.find()`, `Array.prototype.findIndex()`
这两个函数的参数都是回调函数。遍历数组，找到符合条件(回调函数返回为true)的第一个值，find()返回其值，`findIndex()`返回其下标。如果没找到符合条件的值`find()`返回undefined，`findIndex()`返回-1。
```js
[1,2,-3,4].find((item) => item < 0);   //-3
[1,2,-3,4].findIndex((item) => item < 0);   //2

[NaN].findIndex(y => y !== y);   //0
[NaN].indexOf(NaN);   //-1, indexOf 找不到 NaN
```
这两个函数还接受第二参数，用来绑定回调函数中的 this

- `Array.prototype.fill()`
完整形式：`Array.prototype.fill(value, start=0, end=this.length)`，对数组 start 到 end 直接部分填充 value，覆盖原有值。
```js
[1,2,3,4,5].fill('a',2,4);    //[1,2,'a','a',5];
var arr = new Array(5).fill(0);   //arr = [0,0,0,0,0];
```

- `Array.prototype.entries()`,`Array.prototype.keys()`,`Array.prototype.values()`
这三个方法，用来遍历数组，返回一个遍历器，供 `for...of` 使用，其中 `keys()`是对键的遍历，`values()` 是对值的遍历，`entires()`是对键值对的遍历。babel 已实现
```js
var a = ['a','b','c'];

for(let item of a.values()){
  console.log(item);     //依次输出 'a', 'b', 'c'
}

for(let key of a.keys()){
  console.log(key);     //依次输出 0, 1, 2
}
for(let pair of a.entries()){
  console.log(pair);     //依次输出 [0,'a'],[1,'b'],[2,'c']
}
```
当然也可以用遍历器的 next() 方法遍历
```js
var a = ['a','b','c'];
var values = a.values();
console.log(values.next().value);   //'a'
console.log(values.next().value);   //'b'
console.log(values.next().value);   //'c'
```

- `Array.prototype.includes()`
这是个 ES7 的方法，判断数组中是否含有某个值，含有则返回 true，否则返回 false。可以用第二个参数指定查找起始点(小于0倒数)。
```js
//该方法同样可以找到 NaN，而 indexOf 不行
[1,2,NaN].includes(NaN);   //true
[1,2,3,4,5].includes(2, 3);  //false
```

- 数组的空位
我们比较以下两个数组：
```js
var empty = new Array(3);  //[,,,]
var unempty = new Array(3).fill(undefined);   //[undefined,undefined,undefined]

console.log(0 in empty);     //false
console.log(0 in unempty);   //true
```
很明显，一个完全空的数组是没有东西的，而填充了`undefined`的数组并不是空的。
结合 ES5, 发现不同函数方法对空位处理方式是不一样的：
-- `forEach()`, `filter()`, `every()`, `some()` 会忽略空值
-- `map()`, `copyWithin()` 会保留空值，但不做处理
-- `join()`, `toString()`, 会把空值处理为空字符串
-- `fill()` 不区分空值与非空值
-- `Array.from()`, 扩展运算符(...), `for...of`, `entires()`, `keys()`,`values()`, `find()`, `findIndex()` 会视空值为 `undefined`
如果你记不住这些，或者为了程序的健壮性，可维护性，尽量避免在数组中出现空值。
举个实例，理解一下这个问题：
> 新建一个长为200的数组，并初始化每个位置的值等于其索引
```js
//错误方法
var arr = new Array(200).map(function(item, index){
  return index;
});
console.log(arr);    //[undefined × 200]
```
```js
//正确做法
var arr = new Array(200).join().split(',').map(function(item, index){
  return index;
});
console.log(arr);    //[1,2,3,...,200]
```

- 数组推导
这是一个 ES7 的功能，暂时还没能实现。我们可以先看一下它如何推导的：
```js
var a1 = [1,2,3,4];
var a2 = [for( i of a1) i * 2];   //a2=[2,4,6,8]
```
不难看出，数组 a2 通过 `for...of` 直接从 a1 生成。但是它的功能不仅仅这么简单，还可以有 if 条件：
```js
var a1 = [1,2,3,4];
var a3 = [for( i of a1) if(i > 2) i * 2];   //a3=[6,8]
```
这样，我们可以简单的用数组推导模拟 `map()`,`filter()` 方法了。比如上面2个例子等价于：
```js
var a1 = [1,2,3,4];
var a2 = a1.map( (i) => i * 2 );
var a3 = a1.filter( (i) => i > 2 ).map( (i) => i * 2 );
```
当然我们还可以用多个 `for...of` 构成循环嵌套：
```js
var a = ['x1','x2'];
var b = ['y1','y2'];

[for(i of a) for(j of b), console.log(i+','+j)];
//输出
//['x1','y1']
//['x1','y2']
//['x2','y1']
//['x2','y2']
```
数组推导由 `[]` 构建了一个作用域，其内部新建的变量，等同于用 let 关键字声明的变量。除此之外，字符串也可以被视为数组，所以同样可以使用数组推导：
```js
[for(c of 'abcde'). c+'.'].join('');  //"a.2.3.4.5."
```

## 二进制数组

这个部分如果没有C语言和计算机基础会比较难理解，如果实在理解不了可以收藏它，日后再看。

二进制数组其实很早就有了，不过为了 WebGL 中，数据可以高效和显卡交换数据。分为3类：
- ArrayBuffer：代表内存中的一段二进制数据；
- TypedArray：读写简单的二进制数据，如 Uint8Array, Int16Array, Float32Array 等9类；
- DataView：读写复杂的二进制数据，如 Uint8, Int16, Float32 等8类；

数据类型 | 字节长度 | 含义 | 对应 C 语言类型 | TypedArray 类型 | DataView 类型
--- | --- | --- | --- | --- | ---
Int8 | 1 | 8位有符号整数 | char | Int8Array | Int8
Uint8 | 1 | 8位无符号整数 | unsigned char | Uint8Array | Uint8
Uint8C | 1 | 8位无符号整数(自动过滤溢出) | unsigned char | Uint8ClampedArray | 不支持
Int16 | 2 | 16位有符号整数 | short | Int16Array | Int16
Uint16 | 2 | 16位无符号整数 | unsigned short | Uint16Array | Uint16
Int32 | 4 | 32位有符号整数 | int | Int32Array | Int32
Uint32 | 4 | 32位无符号整数 | unsigned int | Uint32Array | Uint32
Float32 | 4 | 32位浮点数 | float | Float32Array | Float32
Float64 | 8 | 64位浮点数 | double | Float64Array | Float64

### ArrayBuffer

ArrayBuffer 代表内存中的一段二进制数据，我们没法直接操作，需要利用视图(TypedArray,DataView)按一定格式解读二进制数据。但我们依然可以构造一段内存来存放二进制数据:
```js
var buf = new ArrayBuffer(32);  //分配32个字节的内存存放数据, 默认全0
var dataview = new DataView(buf);   //将这段内存转为视图
dataview.getUint8(0);   //得到第一个8字节的值(无符号)，0
```

 这里需要强调的是，分配内存空间不要太大！毕竟你的内存是有限的。
 其次，无论使用什么视图，其实例化的内存如果共享，所有的写入操作会修改每一个视图，因为内存共用的：
 ```js
var buf = new ArrayBuffer(32);
var view16 = new Int16Array(buf);
var viewu8 = new Uint8Array(buf);

console.log(viewu8[0]);   //0
view16[0]=-1;
console.log(viewu8[0]);   //255
 ```
 这里之所以得到255，是因为内存共用导致的，但为何不是-1？Int16Array 是有符号类型的，这样二进制的最高位用作符号位，负数记为1:`1000 0000 0000 0001`,之后的数字用移码存储，得到-1的二进制为：`1111 1111 1111 1111`, 之后利用Uint8Array读取无符号的前8位，得到`1111 1111`这个计算为十进制为 $2^8-1=255$。具体关于数制转换和反码补码这里不再展开，否则就跑偏了。

ArrayBuffer 对象也有几个方法和属性:
- byteLength: 得到内存区域的字节长度
```js
const N = 32;
var buf = new ArrayBuffer(N);
if(buf.byteLength === N){
  //分配成功
} else {
  //分配失败
}
```

- slice(start=0, end=this.byteLength): 分配新内存，并把先有内存 start 到 end 部分复制过去，返回这段新内存区域
```js
var buf = new ArrayBuffer(32);
var newBuf = buf.slice(0,3);
```

- isView(view): 判断传入的 view 是否当前 buffer 的视图，是则返回 true, 否则 false。该方法暂无法使用。
```js
var buf1 = new ArrayBuffer(32);
var buf2 = new ArrayBuffer(32);
var buf1View = new Int8Array(buf1);
var buf2View = new Int8Array(buf2);

buf1.isView(buf1View);   //true
buf1.isView(buf2View);   //false
```

### TypedArray

具有一个构造函数 DataView(), 接受一个ArrayBuffer参数,视图化该段内存；或接受一个数组参数，实例化该数组为二进制内容。得到的值是一个数组，可以直接使用`[]`访问每个位置的内容，有`length`属性。其构造函数有9个：

数据类型 | 字节长度 | 含义 | 对应 C 语言类型 | TypedArray 类型构造函数
--- | --- | --- | --- | ---
Int8 | 1 | 8位有符号整数 | char | Int8Array()
Uint8 | 1 | 8位无符号整数 | unsigned char | Uint8Array()
Uint8C | 1 | 8位无符号整数(自动过滤溢出) | unsigned char | Uint8ClampedArray()
Int16 | 2 | 16位有符号整数 | short | Int16Array()
Uint16 | 2 | 16位无符号整数 | unsigned short | Uint16Array()
Int32 | 4 | 32位有符号整数 | int | Int32Array()
Uint32 | 4 | 32位无符号整数 | unsigned int | Uint32Array()
Float32 | 4 | 32位浮点数 | float | Float32Array()
Float64 | 8 | 64位浮点数 | double | Float64Array()

以上9个会对内存进行不同位数的格式化，以得到对应类型值的数组。这个数组不同于普通数组，它不支持稀疏数组，默认值为0，而且同一个数组只能存放同一个类型的变量。

以上每个构造函数都对应如下形式的参数：
```js
(buffer, start=0, len=buffer.byteLength-start*8)
```
可以指定序列化其中 start到 end部分的二进制数据。注意这里指定的范围必须和数组类型所匹配，不能出现类似`new Int32Array(buffer,2,2)`的情况。如果你觉得这个不符合你的需求，可以使用 DataView。

如果你觉得上面的写法复杂，可以不写 new ArrayBuffer，直接使用 TypedArray，但注意参数的意义不一样：
```js
var f64a = new Float64Array(4);    //分配32个字节，并作为double类型使用。 32 = 64 / 8 * 4
```

TypedArray的构造函数还接受另一个TypedArray作为参数，开辟新内存复制其值并改变类型，对原视图和buffer 不构成影响，也不共用内存。
TypeArray的构造函数还接受另一个Array作为参数，开辟新内存复制其值，对原数组不构成影响，也不共用内存。

当然利用一下方法，可以把 TypedArray 转换为普通数组：
```js
var arr = [].slice.call(typedArray);
```

TypedArray具有除了`concat()`以外的全部数组方法，当然，它也具有 iterator，可以用 for...of 遍历。
以下是 TypedArray 特有的属性和方法：

- buffer属性：返回该视图对于的二进制内存区域
- BYTES_PER_ELEMENT属性：是个常数，表示数组中每个值的字节大小，不同视图的返回值与上方表格一致
- byteLength: 返回该视图对于的内存大小，只读
- byteOffset: 返回该视图从对应 buffer 的哪个字节开始，只读
- set(arr_or_typeArray, start=0): 在内存层面，从arr_or_typeArray 的 start 下标开始复制数组到当然 typeArray
- subarray(start=0,end=this.length),截取 start到 end部分子数组,但是和原数组共用内存
- from(): 接受一个可遍历参数，转为该视图实例
- of(): 将参数列表转为该视图实例

小技巧，转换字符串和 ArrayBuffer
```js
//该方法仅限转换 utf-16 的字符串
function ab2str(buf){
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str){
  var len = str.length;
  var view = new Uint16Array(len);
  for(let i = 0; i < len; i++){
    view[i] = str.charCodeAt(i);
  }
  return view.buffer;
}
var str = "Hello world";
var buf = str2ab(str);
var view = new Uint16Array(buf);
for(var i = 0; i < view.length; i++){
  console.log(String.fromCharCode(view[i]));   //一次输出"Hello world"的每个字母
}
console.log(ab2str(buf));    //"Hello world"
```

> 这里扩展一些编码知识，我们知道计算机里面存储的是二进制，并且存储的最小单位是字节。但是不同的系统存储方式不同，分为高位优先和低位优先。比如 20170101 这个数字，其十六进制表示为 0x0133C575, 在低位优先的系统中存储方式为 `0x75 0xC5 0x33 0x01`, 而在高位优先的系统中存储方式为 `0x01 0x33 0xC5 0x75`。由于大多数计算机采用低位优先的方式，所以 ES6 采用是也是低位优先的方式，但遇到高位优先的数据时，就不能简单的直接那来使用，具体使用会在 DataView 中介绍，这里说明一种判断低位优先(little endian)还是高位优先(big endian)的方法:

还有需要注意的是数据溢出，这个也是需要数制方面基础比较好理解，这里不过多展开了。举一个例子：
Uint8 只能表示8位无符号整数，最大是`1111 1111`, 也就是十进制的 0~255；Int8因为有了符号位，只能表示十进制-128~127，如果给它的值不在这个范围内就会发生溢出，得到一个你意想不到但情理之中的值
```js
var view1 = new Uint8Array(2);
view1[0] = 256;   //256 二进制是 1 0000 0000 由于数据只能容纳8个值，进位1就丢了
view1[1] = -1;    //之前说过-1 二进制(补码)为 1111 1111(全1), 作为无符号数8个1就是255

console.log(view1[0]);   //0
console.log(view1[1]);   //255

var view2 = new Int8Array(2);
view2[0] = 128;   //由于符号位溢出，系统自动用32位计算这个数1 000 0000 0000 0000 0000 0000 1000 0000，取符号位和最后8位得到-128
view2[1] = -128;  //由于符号位溢出，系统自动用32位计算这个数0 111 1111 1111 1111 1111 1111 0111 1111，取符号位和最后8位得到127
console.log(view2[0]);   //-128
console.log(view2[1]);   //127
```

为了防止这样的情况，js 有一个 Unit8ClampedArray, 使整数方向的溢出值为255，0方向的易楚志为0。注意这是个无符号的类型；
```js
var view = new Uint8ClampedArray(2);
view[0] = 256;
view[1] = -1;

console.log(view[0]);   //255
console.log(view[1]);   //0
```

### 复合视图

划分一块 buffer 使用得到 C 语言中的结构体
```js
var buf = new ArrayBuffer(24);
var name = new Uint8Array(buf, 0, 16);
var gender = new Uint8Array(buf, 16, 1);
var age = new Uint16Array(buf, 18, 1);
var score = new Float32Array(buf,20,1);
```
相当于以下 C语言代码
```cpp
struct Person{
  char name[16];
  char gender;
  int age;
  float score;
}
```

共用一块 buffer 使用得到 C 语言中的联合体
```js
var buf = new ArrayBuffer(8);
var num = new Uint16Array(buf);
var dotNum = new Float64Array(buf);
```
相当于以下 C语言代码
```cpp
union Example{
  int num[4];
  double dotNum;
}

```

### DataView

具有一个构造函数 DataView(), 接受一个ArrayBuffer参数,视图化该段内存。毕竟当一段内存有多种数据时，复合视图也不是那么方便，这时适合使用 DataView 视图。其次 DataView 可以自定义高位优先和低位优先，这样可以读取的数据就更多了。
DataView构造函数形式如下,这一点和 TypedArray 一致：
```js
(buffer, start=0, len=buffer.byteLength-start*8)
```

它具有以下方法格式化读取 buffer 中的信息：

- getInt8(start, isLittleEndian): 从 start 字节处读取 1 个字节，返回一个8位有符号整数, 第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- getUint8(start, isLittleEndian): 从 start 字节处读取 1 个字节，返回一个8位无符号整数, 第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- getInt16(start, isLittleEndian): 从 start 字节处读取 2 个字节，返回一个16位有符号整数, 第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- getUint16(start, isLittleEndian): 从 start 字节处读取 2 个字节，返回一个16位无符号整数, 第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- getInt32(start, isLittleEndian): 从 start 字节处读取 4 个字节，返回一个32位有符号整数, 第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- getUint32(start, isLittleEndian): 从 start 字节处读取 4 个字节，返回一个32位无符号整数, 第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- getFloat32(start, isLittleEndian): 从 start 字节处读取 4 个字节，返回一个32位浮点数, 第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- getFloat64(start, isLittleEndian): 从 start 字节处读取 8 个字节，返回一个64位浮点数, 第二参默认为 false 表示使用高位优先，为 true 表示低位优先；


它具有以下方法格式化写入 buffer 中的信息：

- setInt8(start,value,isLittleEndian): 在 start位置写入 1 个字节的8位有符号整数value；第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- setUint8(start,value,isLittleEndian): 在 start位置写入 1 个字节的8位无符号整数value；第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- setInt16(start,value,isLittleEndian): 在 start位置写入 2 个字节的16位有符号整数value；第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- setUint16(start,value,isLittleEndian): 在 start位置写入 2 个字节的16位无符号整数value；第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- setInt32(start,value,isLittleEndian): 在 start位置写入 4 个字节的32位有符号整数value；第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- setUint32(start,value,isLittleEndian): 在 start位置写入 4 个字节的32位无符号整数value；第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- setFloat32(start,value,isLittleEndian): 在 start位置写入 4 个字节的32位浮点数value；第二参默认为 false 表示使用高位优先，为 true 表示低位优先；
- setFloat64(start,value,isLittleEndian): 在 start位置写入 8 个字节的64位浮点数value；第二参默认为 false 表示使用高位优先，为 true 表示低位优先；

它具有以下属性和方法：

- buffer属性：返回该视图对于的二进制内存区域
- byteLength: 返回该视图对于的内存大小，只读
- byteOffset: 返回该视图从对应 buffer 的哪个字节开始，只读

如果你不知道计算机使用的是高位优先还是低位优先，也可以自行判断：
```js
//方法1
const BIG_ENDIAN = Symbol('BIG_ENDIAN');
const LITTLE_ENDIAN = Symbol('LITTLE_ENDIAN');
function getPlatformEndianness(){
  let arr32 =  Uint32Array.of(0x12345678);
  let arr8 = new Uint8Array(arr32.buffer);
  switch((arr8[0]*0x1000000)+(arr8[1]*0x10000)+(arr8[2]*0x100)+arr8[3]){
    case 0x12345678: return BIG_ENDIAN;
    case 0x78563412: return LITTLE_ENDIAN;
    default: throw new Error("unknow Endianness");
  }
}

//方法2
window.isLittleEndian = (function(){
  var buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
}());
```

## 正则表达式扩展

- 构造函数支持传入正则得到拷贝，同时可以用第二参修改修饰符
```js
var reg = /^abc/ig;
var newReg_ig = new RegExp(reg);      //newReg_ig = /^abc/ig;
var newReg_g = new RegExp(reg,'g');      //newReg_g = /^abc/g;
```

- 引入新的修饰符
ES5中的修饰符有3个, 加上 ES6 的修饰符，一共5个：

修饰符 | 描述 | 描述
--- | --- | ---
m | multiline | 多行模式
i | ignore case | 忽略大小写模式
g | global match | 全局匹配模式
u | unicode | unicode模式
y | sticky | 粘连模式

unicode 模式
为了兼容 4 自己 unicode, 我们需要在一下情况使用该模式
```js
//情况1：
/^\uD83D/.test("\uD83D\uDC2A");   //true, 很明显这个是不对的, 因为 \uD83D\uDC2A 是一个字，不能拆开
/^\uD83D/u.test("\uD83D\uDC2A");   //false

//情况2
var s = "𠮷";
/^.$/.test(s);     //false, 通配符 . 不能匹配32位unicode
/^.$/u.test(s);     //true

//情况3
var s = "𠮷a";
/\u{63}/.test(s);     //false, 不能使用{}形式的 unicode，被电脑认为 u 出现63次
/\u{63}/u.test(s);     //false, 即使用了 u 也一样
//为了避免这种误解，合理使用 u 修饰符

//情况3
var s = "𠮷";
/^\S$/.test(s);     //false, \S 无法监测到32位 unicode
/^\S$/u.test(s);     //true
```

当然这个里面还是有坑的，比如下面这个：
```js
var k1 = "\u004B";
var k2 = "\u212A";

/[a-z]/i.test(k1);     //true
/[a-z]/iu.test(k1);     //true
/[a-z]/i.test(k2);     //false
/[a-z]/iu.test(k2);     //true
```
第三个输出居然是 false？根本没有32位 unicode 呀，干嘛用u修饰？ 其实 `"\u004B"` 和 `"\u212A"` 都是 `K`(前一个是真 K，后一个是假的），博主也不知道为啥会这样！

y 修饰符

和全局修饰符(g)类似，执行全局匹配，但 g 只有剩余位置存在匹配即可，y 则必须中上次匹配的下一个字母开始。
```js
var s = 'aaa_aa_a';
var r1 = /a+/g;
var r2 = /a+/y;

r1.exec(s);  //["aaa"], 剩余字符是 '_aa_a'
r2.exec(s);  //["aaa"], 剩余字符是 '_aa_a'

r1.exec(s);  //["aa"], 限定起始点，得到 aa， 剩余字符是 '_a'
r2.exec(s);  //null, 必须从剩余字符的第一个就匹配到，相当于 /^a+/g, 由于匹配不到返回 null，同时将 lastIndex 置 0

r1.exec(s);  //["a"], 剩余字符是 ''
r2.exec(s);  //["aaa"], 剩余字符是 '_aa_a'
```
y修饰符就是为了让起始位置匹配 ^ 在全局有效才设计使用的。

与此同时，es6 中的 `RegExp.prototype` 也加入了一些新的属性:
```js
var reg = /^abc/uy;
reg.sticky;   //true, 判断reg是否是粘连模式
reg.unicode;  //true, 判断reg是否是unicode模式
reg.flags;    //'uy', 得到其全部修饰符构成的字符串
reg.source;   //'^abc' 得到正则表达式字符串
var str="^abc."
RegExp.escape(str);  //\^abc\. 得到正则表达式的字符串转译写法
```

## 函数的扩展

### 参数默认值

ES5中设置默认值非常不方便，我们这样写：
```js
function fun(a){
  a = a || 2;
  console.log(a);
}
fun();   //2
fun(0);  //2
fun(1);  //1
```
以上写法，如果传入了参数,但这个参数对应值的布尔型是 false，就不起作用了。当然你也可以判断 `arguments.length` 是否为0来避免这个问题，但每个函数这样写就太啰嗦了，尤其参数比较多的时候。在 ES6 中我们可以直接写在参数表中，如果实际调用传递了参数，就用这个传过来的参数，否则用默认参数。像这样：
```js
function fun(a=2){
  console.log(a);
}
fun();   //2
fun(0);  //0
fun(1);  //1
```
其实函数默认参数这一点最强大的地方在于可以和解构赋值结合使用：
```js
//参数传递
function f([x,y,z=4]){
  return [x+1,y+2,z+3];
}
var [a,b,c] = f([1,2]);  //a=2,b=4,c=7
[[1,2],[3,4]].map(([a,b]) => a + b);   //返回 [3,7]
```
通过上面这个例子不难发现，不仅可以用解构的方法设置初始值，还可以进行参数传递。当然，这里也可以是对象形式的解构赋值。如果传入的参数无法解构，就会报错：
```js
function fun1({a=1, b=5, c='A'}){
  console.log(c + (a + b));
}
fun1({});   //'A6'
fun1();     //TypeError,因为无法解构
//但这样设计函数对使用函数的码农很不友好
//所以，技巧：
function fun2({a=1, b=5, c='A'}={}){
  console.log(c + (a + b));
}
fun2();     //'A6'
```
注意，其实还有一种方法，但不如这个好，我们比较如下：
```js
//fun1 比 fun2 好，不会产生以外的 undefined
function fun1({a=1, b=5, c='A'}={}){
  console.log(c + (a + b));
}
function fun2({a, b, c}={a:1, b:5, c:'A'}){
  console.log(c + (a + b));
}
//传了参数，但没传全部参数就会出问题
fun1({a:8});     //'A13'
fun2({a:8});     //NaN
```

不过这里强烈建议，将具有默认值的参数排在参数列表的后面。否则调用时依然需要传参：
```js
function f1(a=1, b){
  console.log(a + b);
}
function f2(a, b=1){
  console.log(a + b);
}
f2(2);   //3
f1(,2);  //报错
f1(undefined, 2);  //3, 注意这里不能用 null 触发默认值
```

- 函数的 length 属性
这个属性ES6 之前就是存在的，记得length表示预计传入的形参个数，也就是没有默认值的形参个数:
```js
(function(a){}).length;   //1
(function(a = 5){}).length;   //0
(function(a,b,c=5){}).length;   //2
(function(...args){}).length;   //0，rest参数也不计入 length
```

## rest 参数

rest 参数形式为 `...变量名`，它会将对应的全部实际传递的变量放入数组中, 可以用它来替代 arguments：
```js
function f(...val){
  console.log(val.join());
}
f(1,2);      //[1,2]
f(1,2,3,4);  //[1,2,3,4]

function g(a, ...val){
  console.log(val.join());
}
g(1,2);      //[2]
g(1,2,3,4);  //[2,3,4]
```
否则这个函数 g 你的这样定义函数，比较麻烦：
```js
function g(a){
  console.log([].slice.call(arguments,1).join());
}
```

这里需要注意2点：
- rest参数必须是函数的最后一个参数，它的后面不能再定义参数，否则会报错。
- rest参数不计入函数的 length 属性中

### 扩展运算符

扩展运算符类似 rest运算符的逆运算，用 `...` 表示, 放在一个(类)数组前，将该数组展开成独立的元素序列：
```js
console.log(1,...[2,3,4],5);  //输出1，2，3，4，5
```

扩展运算符的用处很多：
- 可以用于快速改变类数组对象为数组对象,也是用于其他可遍历对象：
```js
[...document.querySelectorAll('li')];   //[<li>,<li>,<li>];
```

- 结合 rest 参数使函数事半功倍：
```js
function push(arr, ...val){
  return arr.push(...val);      //调用函数时，将数组变为序列
}
```

- 替代 apply 写法
```js
var arr = [1,2,3];
var max = Math.max(...arr);   //3

var arr2 = [4,5,6];
arr.push(...arr2);     //[1,2,3,4,5,6]

new Date(...[2013,1,1]);   //ri Feb 01 2013 00:00:00 GMT+0800 (CST)
```

- 连接,合并数组
```js
var more = [4,5];
var arr = [1,2,3, ...more];    //[1,2,3,4,5]

var a1 = [1,2];
var a2 = [3,4];
var a3 = [5,6];
var a = [...a1, ...a2, ...a3];     //[1,2,3,4,5,6]
```

- 解构赋值
```js
var a = [1,2,3,4,5];
var [a1, ...more] = a;      //a1 = 1, more = [2,3,4,5]
//注意，扩展运算符必须放在解构赋值的结尾，否则报错
```

- 字符串拆分
```js
var str = "hello";
var alpha = [...str];    //alpha = ['h','e','l','l','o']

[...'x\uD83D\uDE80y'].length;   //3,  正确处理32位 unicode 字符

```

### name 属性

name 属性返回函数的名字，对于匿名函数返回空字符串。不过对于表达式法定义的函数，ES5 和 ES6有差别：
```js
var fun = function(){}
fun.name;     //ES5: "", ES6:  "fun"

(function(){}).name;   //""
```

对于有2个名字的函数，返回后者,ES5 和 ES6没有差别:
```js
var fun  = function baz(){}
fun.name;        //baz
```

对于 Function 构造函数得到的函数，返回 `anonymous`：
```js
new Function("fun").name;    //"anonymous"
new Function().name;    //"anonymous"
(new Function).name;    //"anonymous"
```

对于 bind 返回的函数，加上 `bound ` 前缀
```js
function f(){}
f.bind({}).name;   //"bound f"

(function(){}).bind({}).name;    //"bound "

(new Function).bind({}).name;    //"bound anonymous"
```

### 箭头函数

箭头函数的形式如下：
```js
var fun = (参数列表) => {函数体};
```
如果只有一个参数(且不指定默认值)，参数列表的圆括号可以省略；(如果没有参数，圆括号不能省略)
如果只有一个 return 语句，那么函数体的花括号也可以省略，同时省略 return 关键字。
```js
var fun = value => value + 1;
//等同于
var fun = function(value){
  return value + 1;
}
```
```js
var fun = () => 5;
//等同于
var fun = function(){
  return 5;
}
```
如果箭头函数的参数或返回值有对象，应该用 `()` 括起来：
```js
var fun = n => ({name: n});
var fun = ({num1=1,num2=3}={}) => num1 + num2;
```

看完之前的部分,箭头函数应该不陌生了：
```js
var warp = (...val) => val;
var arr1 = warp(2,1,3);              //[2,1,3]
var arr2 = arr1.map(x => x * x);     //[4,1,9]
arr2.sort((a, b) => a - b);          //[1,4,9]
```

使用箭头函数应注意以下几点：
- 不可以将函数当做构造函数调用，即不能使用 new 命令；
- 不可以在箭头函数中使用 yield 返回值，所以不能用过 Generator 函数；
- 函数体内不存在 arguments 参数；
- 函数体内部不构成独立的作用域，内部的 this 和定义时候的上下文一致;但可以通过 call, apply, bind 改变函数中的 this。关于作用域，集中在ES6函数扩展的最后讨论。

举几个箭头函数的实例：
实例1：实现功能如: `insert(2).into([1,3]).after(1)`或`insert(2).into([1,3]).before(3)`这样的函数：
```js
var insert = value => ({
  into: arr => ({
    before: val => {
      arr.splice(arr.indexOf(val), 0, value);
      return arr;
    },
    after: val => {
      arr.splice(arr.indexOf(val) + 1, 0, value);
      return arr;
    }
  })
});
console.log(insert(2).into([1,3]).after(1));
console.log(insert(2).into([1,3]).before(3));
```

实例2: 构建一个管道(前一个函数的输出是后一个函数的输入):
```js
var pipe = (...funcs) => (init_val) => funcs.reduce((a,b) => b(a), init_val);

//实现 2 的 (3+2) 次方
var plus = a => a + 2;
pipe(plus, Math.pow.bind(null,2))(3);         //32
```

实例3: 实现 𝜆 演算
```js
//fix = 𝜆f.(𝜆x.f(𝜆v.x(x)(v)))(𝜆x.f(𝜆v.x(x)(v)))
var fix = f => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)));
```

### 函数绑定

ES7 中提出了函数绑定运算，在 Babel 中已经实现。免去我们使用 call, bind, apply 的各种不方便, 形式如下:
```cpp
objName::funcName
```
以下几组语句两两等同
```js
var newFunc = obj::func;
//相当于
var newFunc = func.bind(obj);

var result = obj::func(...arguments);
//相当于
var result = func.apply(obj, arguments);
```

如果 `::` 左边的对象原本就是右边方法中的 this, 左边可以省略
```js
var fun = obj::obj.func;
//相当于
var fun = ::obj.func;
//相当于
var fun = obj.func.bind(obj);
```

`::` 运算返回的还是对象，可以进行链式调用：
```js
$('.my-class')::find('p')::text("new text");
//相当于
$('.my-class').find('p').text("new text");
```

### 尾调用优化

尾调用是函数式编程的概念，指在函数最后调用另一个函数。
```js
//是尾调用
function a(){
  return g();
}
function b(p){
  if(p>0){
    return m();
  }
  return n();
}
function c(){
  return c();
}

//以下不是尾调用
function d(){
  var b1 = g();
  return b1;
}
function e(){
  g();
}
function f(){
  return g() + 1;
}
```

尾调用的一个显著特点就是，我们可以将函数尾部调用的函数放在该函数外面(后面)，而不改变程序实现结果。这样可以减少函数调用栈的开销。
这样的优化在 ES6 的严格模式中被强制实现了，我们需要做的仅仅是在使用时候利用好这个优化特性，比如下面这个阶乘函数：
```js
function factorial(n){
  if(n <= 1) return 1;
  return n * factorial(n - 1);
}
factorial(5);     //120
```
这个函数计算 n 的阶乘, 就要在内存保留 n 个函数调用记录，空间复杂度 O(n), 如果 n 很大可能会溢出。所以进行优化如下：
```js
"use strict";
function factorial(n, result = 1){
  if(n <= 1) return result;
  return factorial(n - 1, n * result);
}
factorial(5);     //120
```
当然也可以使用柯里化：
```js
var factorial = (function factor(result, n){
  if(n <= 1) return result;
  return factor(n * result, n - 1);
}).bind(null,1);
factorial(5);     //120
```

### 函数的尾逗号

这个仅仅是一个提案：为了更好地进行版本控制，在函数参数尾部加一个逗号，表示该函数日后会被修改，便于版本控制器跟踪。目前并未实现。

### 作用域

这里仅仅讨论 ES6 中的变量作用域。除了 let 和 const 定义的的变量具有块级作用域以外，`var` 和 `function` 依旧遵守词法作用域, 词法作用域可以参考博主的另一篇文章[javascript函数、作用域链与闭包](http://blog.csdn.net/faremax/article/details/53201809)

首先看一个例子：
```js
var x = 1;
function f(x, y=x){
  console.log(y);
}
f(2);    //2
```
这个例子输出了2，因为 y 在初始化的时候，函数内部的 x 已经定义并完成赋值了，所以，`y = x` 中的 `x` 已经是函数的局部变量 x 了，而不是全局的 x。当然，如果局部 x 变量在 y 声明之后声明就没问题了。
```js
var x = 1;
function f(y=x){
  let x = 2
  console.log(y);
}
f();    //1
```

那如果函数的默认参数是函数呢？烧脑的要来了：
```js
var foo = "outer";
function f(x){
  return foo;
}
function fun(foo, func = f){
  console.log(func());
}
fun("inner");   //"outer"
```
如果基础好，那就根本谈不上不烧脑。因为，函数中的作用域取决于函数定义的地方，函数中的 this 取决于函数调用的方式。（敲黑板）
但如果这样写，就是 inner 了, 因为func默认函数定义的时候 fun内的 foo 已经存在了。
```js
var foo = "outer";
function fun(foo, func = function(x){
  return foo;
}){
  console.log(func());
}
fun("inner");   //"inner"
```

技巧：利用默认值保证必需的参数被传入，而减少对参数存在性的验证：
```js
function throwErr(){
  throw new Error("Missing Parameter");
}
function fun(necessary = throwErr()){
  //...如果参数necessary没有收到就使用参数，从而执行函数抛出错误
}

//当然也可以这样表示一个参数是可选的
function fun(optional = undefined){
  //...
}
```

箭头函数的作用域和定义时的上下文一致，但可以通过调用方式改变：
```js
window && (window.name = "global") || (global.name = "global");
var o = {
  name: 'obj-o',
  foo: function (){
    setTimeout(() => {console.log(this.name);}, 500);
  }
}

var p = {
  name: 'obj-p',
  foo: function (){
    setTimeout(function(){console.log(this.name);}, 1000);
  }
}

o.foo();    //"obj-o"
p.foo();    //"global"

var temp = {
  name: 'obj-temp'
}

o.foo.bind(temp)();     //"obj-temp"
o.foo.call(temp);     //"obj-temp"
o.foo.apply(temp);     //"obj-temp"

p.foo.bind(temp)();     //"global"
p.foo.call(temp);     //"global"
p.foo.apply(temp);     //"global"
```

## 对象的扩展

- 允许使用已有对象赋值定义对象字面量，并且只写变量名即可
```js
var name = "Bob";
var getName = function(){console.log(this.name);};

var person = {name, getName};
//相当于
//var person = {
//name: "Bob",
//getName: function(){console.log(this.name);}
//}
person.getName();   //"Bob"
```

- 可以像定义存取器那样定义方法
```js
var o = {
  _age: 10,
  _score: 60,
  age(num){
    if(num > 0) {
      this._age = num;
      return this;
    }
    return this._age;
  },
  get score(){
    return this._score;
  }
};

console.log(o.age());    //10
o.age(15);
console.log(o.age());    //15
console.log(o.score);    //60
o.score = 100;           //TypeError
```
注意，以下代码是等同的：
```js
var obj = {
  class () {}       //并不会因为 class 是关键字而解析错误
};
//等价于
var obj = {
  'class': function() {}
};
```
如果一个方法是 Generator 函数，需要在前面加 `*`:
```js
var obj = {
  time: 1,
  *gen(){
    yield "hello " + time;
    time++;
  }
}
```

- 属性名表达式
js 本来可以这样 `obj['k'+'ey']` 访问一个对象属性，现在也可以这样定义属性了：
```js
var key1 = "name";
var key2 = "age";

var o = {
  [key1]: "Bob",
  [key2]: 18,
  ['first' + key1]: "Ellen"
};
o.name;    //"Bob"
o.age;     //18
o.firstname;   //"Ellen"
```
注意：该方法不能和上一小节使用已有标识符定义对象字面量的方法混合使用，否则会报错；
```js
//错误用法
var foo = 'bar';
var bar = 'abc';
var baz = {[foo]};  //报错
```

- 方法的 name 属性
函数有 name 属性，方法也就有 name 属性。一般方法 name 返回函数名(不包括对象名)，对于存取器方法，没有 name 属性：
```js
var o = {
  _age: 10,
  _score: 60,
  _name: "Bob",
  _firstname: "Ellen",
  set age(num){
    if(num > 0) {
      this._age = num;
      return this;
    }
  },
  get age(){
    return this._age;
  },
  get score(){
    return this._score;
  },
  name(n){
    if(!n) return this._name + ' ' + this._firstname;
    this._name = n;
    return this;
  },
  set firstname(n){
    if(n) this._firstname = n;
    return this;
  }
};
console.log(o.name.name);      //"name"
console.log(o.age.name);       //undefined
console.log(o.score.name);     //undefined
console.log(o.firstname);      //undefined，所以 set 函数更不会有 name 属性
```
如果对象的方法是个 symbol，name 属性为空字符串 `""` ：
```js
var sym1 = new Symbol("description of sym1");
var sym2 = new Symbol();
var o = {
  [sym1](){},
  [sym2](){},
};
o[sym1].name;    //""
o[sym2].name;    //""
```

- 静态方法
1. Object.is(a,b): 比较a,b两个值是否严格相等，相当于 `===`, 但有一点不一样：
```js
-0 === +0;     //true
NaN === NaN;   //false

Object.is(-0, +0);     //false
Object.is(NaN, NaN);   //true
```
2. Object.assign(target, source1,source2,...): 将每个 source 对象自身的可枚举属性复制到 target 对象上，不包括原型链上的属性和不可枚举属性。只有有一个参数不是对象，就会抛出 TypeError 错误。遇到同名属性，排在后面的会覆盖前面的：
```js
var target = {a:1,b:2};
var source1 = {a:3,c:3};
var source2 = {a:2,d:0};
Object.assign(target, source1, source2);
console.log(target);      //{a: 2, b: 2, c: 3, d: 0}
```
对于属性名是 symbol 的可枚举属性也会被复制：
```js
Object.assign({a:'b'}, {[Symbol('c')]:'d'});    //{a: "b", Symbol(c): "d"}
```
对于同名属性存在嵌套对象，外层会被直接替换：
```js
Object.assign({a:{b:'c',d:'e'}}, {a:{b:'hello'}});     //{a:{b:'hello'}}
```
可以用 Object.assign处理数组，但会视其为对象：
```js
Object.assign([1,2,3], [4,5]);     //[4, 5, 3]
```
技巧：为对象添加属性方法
```js
Object.assign(String.prototype, {
  newProperty: "value",
  newFunction: function(){}
})
```
技巧：克隆对象
```js
Object.assign({}，origin);
```
技巧：为对象添加属性方法
```js
Object.assign(target, ...source);
```
技巧：为对象添加属性方法
```js
const DEFAULT_OPTION = {   //默认值
  a: 1,
  b: 2
};
function processContent(newOption){
  return Object.assign({}, DEFAULT_OPTION, newOption);
}
//设置属性应该是基本类型，否则会因为深拷贝出问题
```

### 对象属性的可枚举性与遍历

以下6个操作会忽略不可枚举的属性

- for...in循环
- Object.keys()
- JSON.stringify()
- Object.assign()
- Reflect.enumerate()
- 扩展运算符 `...`

以下4个方法不忽略不可枚举属性

- Object.getOwnPropertyNames()
- Object.getOwnPropertySymbols()
- Reflect.ownKeys()

以上9个方法中，只有2个会操作包含继承到的属性

- for...in循环
- Reflect.enumerate()

以上9个方法中，只有1个方法可以获得 Symbol 属性

- Object.getOwnPropertySymbols()

除此之外需要强调的是 ES6 中，所有 class 的原型方法都是不可枚举的：
```js
Object.getOwnPropertyDescriptor(class{foo(){}}.prototype, foo).enumerable;  //false
```

ES6 起，有了7中遍历属性的方法：

- for...in: 循环遍历对象自身和继承到的可枚举属性，不包括 Symbol 属性
- Object.keys(obj): 返回包含自身可枚举属性的属性名数组，不包含 Symbol 属性
- Object.getOwnPropertyNames(obj): 同上，但包括不可枚举属性
- Object.getOwnPropertySymbols(obj): 返回自身所有 Symbol 属性名的数组，包括不可枚举属性
- Reflect.ownKey(obj): 返回自身所有属性名数组，包括不可枚举属性和 Symbol 属性名
- Reflect.enumerate(): 返回一个 Iterator, 用来遍历对象自身及继承到的可枚举属性，不包括 Symbol 属性；和 for...in 一样
- for...of: 只能遍历具有 Iterator 接口的对象，具体作用范围由 iterator 决定，遍历没有 iterator 的对象会报错

以上方法除了 for...of 以外，遍历顺序为：

- 首先遍历所有属性名为数字的属性，按数字大小排序；
- 其次遍历所有属性名为字符串的属性，按属性生成时间排序；
- 最后遍历所有属性名为 Symbol 的属性，按属性生成时间排序；

### 对象的__proto__属性

这是个很老很老的属性，在大家想期待下，ES6终于把它写进去了，嗯？...是写进附录了。这个属性用来读写当前的对象的原型对象`obj.constructor.prototype`

从本质上来讲，`__proto__` 是定义在`Object.prototype` 上的一个存取器函数：
```js
function isObject(a){
  return Object(a) === a;
}
Object.defineProperty(Object.prototype, '__proto__', {
  get(){
    let _thisObj = Object(this);
    return Object.getPrototypeOf(_thisObj);
  },
  set(proto){
    if(this == null) throw new TypeError();
    if(!isObject(this) || !isObject(proto)) return undefined;
    let status = Object.setPrototypeOf(this, proto);
    if(! status) throw new TypeError();
  }
});
```

但是，还是不建议使用这个东西，毕竟看它这名字就是个内部属性，因为它有了不加，但不保证所以终端都能用，所以ES6推荐用下面这两个属性：
```js
Object.setPrototypeOf(obj, newProto);   //写
Object.getPrototypeOf(obj);   //读
```
简单举一个例子：
```js
function Rectangle(){}
var rec = new Rectangle();
Object.getPrototypeOf(rec) === Rectangle.prototype;    //true
Object.setPrototypeOf(rec, Object.prototype);
Object.getPrototypeOf(rec) === Rectangle.prototype;    //false
```

当然如果你把一个对象的原型设置成了 null, 也是可以的，只是，它不具备任何你听说过的方法了：
```js
var o = Object.setPrototypeOf({}, null);
//等价于 var o = {'__proto__': null};
Object.getPrototypeOf(o);                //null
o.toString();                    //TypeError: o.toString is not a function
```

### 对象的扩展运算符

这是 ES7 的一个提案, babel可以使用器部分功能使用。

- rest参数
用法和数组中很类似，这里不再过多赘述，直接看几个例子吧：
```js
var {x,y,...z}  = {x: 1, y: 2, a: 3, d: 4}; //x=1, y=2, z={a: 3, d: 4}
```
值得强调的是， 对象的rest参数形式执行的是浅拷贝，赋值得到的是原对象的引用：
```js
let obj = {a: {b: 1}};
let {...x} = obj;
obj.a.b = 2;
console.log(x.a.b);    //2
```
此外 rest 不会复制不可枚举属性和继承自原型的属性：
```js
var p = {a: 0};
var o = {b: 2};
var o = Object.defineProperty(o, "foo", {
  value: 2,
  configurable: true,
  enumerable: false,
  writable: true
});
Object.setPrototypeOf(o, p);
var u = { ...p };
console.log(u);    //{b:2}
```

- 扩展运算符
复制参数对象所有可遍历属性到当前对象中:
```js
var o1 = {a: 1, b: 2};
var n = { ...o1 };    //n={a: 1, b: 2};
//相当于
var n = Object.assign({}, o1);
```
可以用扩展运算符合并多个对象, 排后的属性会覆盖之前的属性：
```js
var source0 = {a:1,b:2};
var source1 = {a:3,c:3};
var source2 = {a:2,d:0};
Object.assign(target, source1, source2);
var target = {...source0, ...source1, ...source2};
console.log(target);      //{a: 2, b: 2, c: 3, d: 0}
```
注意一点：如果扩展运算符的参数对象有 get 方法，该方法会被执行：
```js
var a = {o:1,p:2,m:4};
var withoutError = {
  ...a,
  get x(){
    throw new Error();
  }
};           //不报错
var withError = {
  ...a,
  ...{get x(){
    throw new Error();
  }}
};           //报错
```
如果扩展对象是 null 或 undefined，会被忽略，不报错
```js
var o = { ...null,  ...undefined};    //不报错
console.log(o);    //{}
```

## Symbol

### Symbol基本类型
Symbol 是一种解决命名冲突的工具。试想我们以前定义一个对象方法的时候总是要检查是否已存在同名变量：
```js
if(String && String.prototype && String.prototype.getCodeWith){
  String.prototype.getCodeWith = function(){};
}
```
可是这样写，即便已存在同名方法，但他们实现的功能不一定一样，而且函数的接口也不一定适合自己。这样我们就不得不再给自己的函数起个其他的名字，可以万一又存在呢？

于是引入了 Symol，用来产生一个全局唯一的标识符，你可以放心的使用它。
它接受一个字符串参数，作为该标识符的描述:
```js
var sym = Symbol("Discription");
var temp = Symbol("Discription");
console.log(sym);             //Symbol(Discription)
console.log(sym.valueOf());   //Symbol(Discription)
console.log(sym.toString());  //"Symbol(Discription)""
console.log(sym == temp);     //false
```

描述符是用来帮助开发人员区别不同是 symbol，不具备其他意义, 所以 symbol 值只有`toString()`和`valueOf()` 方法。
Symbol 作为一个基本类型存在于 js 中。这样，js 就有了6个基本类型: `null`, `undefined`, `Boolean`, `Number`, `String`, `Symbol` 和1个复杂类型: `Object`
使用 Symbol 需要注意以下几点:
- Symbol 和 null, undefined 一样不具有构造函数，不能用 new 调用。
- Symbol 值不能转为数字，所以不能参与任何算术，逻辑运算
- Symbol 虽然有 toString() 但 toString 得到的不是字符串，所以不能用于字符串链接，不能用于模板字符串
- Symbol 可以转换为 Boolean, 用在条件语句中，但所有 Symbol 都是逻辑 true
- Symbol 作为属性名时，该属性是公开的，不是私有的

### Symbol用作属性名

这个应该不陌生了,和普通标识符用法类似，只是不能使用`.`访问和定义，必须使用`[]`：
```js
var sym = Symbol("abc");
var fun = Symbol("getSym");

var a = {};
a[sym] = 1;

var b = {
  [sym]: 1,
  [fun](){
    console.log(this[sym]);
  }
};

var c = Object.defineProperty({}, sym, {value: 1});

a[sym];   //1
b[sym];   //1
c[sym];   //1
b[fun]();  //1
```

当然也可以定义一些常量，就像英语中 Symbol 代表一种象征，一个符号：
```js
var log = {
  DEBUG: Symbol('debug'),
  ERROR: Symbol('error'),
  WARNING: Symbol('warning'),
}
```
需要注意，Symbol 属性只有`Object.getOwnPropertySymbols(obj)` 和 `Reflect.ownKey(obj)` 可以遍历到：
- Object.getOwnPropertySymbols(obj): 返回自身所有 Symbol 属性名的数组，包括不可枚举属性
- Reflect.ownKey(obj): 返回自身所有属性名数组，包括不可枚举属性和 Symbol 属性名
```js
var sym = Symbol("pro");
var o = {
  a: 1,
  b: 2,
  [sym]: 3
}
Object.getOwnPropertySymbols(o);     //[Symbol(pro)]
Reflect.ownKeys(o);                  //["a", "b", Symbol(pro)]
```
我们可以利用这个方法，构造一些非私有的内部变量：
```js
var size = Symbol('size');
class Collection{
  constructor(){
    this[size] = 0;
  }
  add(num){
    this[this[size]] = item;
    this[size]++;
  }
  static sizeOf(instance){
    return instance[size];
  }
}
var x = new Collection();
console.log(Collection.sizeOf(x));     //0
x.add("foo");
console.log(Collection.sizeOf(x));     //1

console.log(Object.keys(x));     //['0']
console.log(Object.getOwnPropertyNames(x));   //['0']
console.log(Object.getOwnPropertySymbols(x));   //[Symbol(size)]
```

### Symbol的静态方法

- Symbol.for("string"): 登记并重用一个 symbol 值
```js
Symbol.for("aa") === Symbol.for("aa");    //true
Symbol("aa") === Symbol("aa");            //false
```

- Symbol.keyFor(symbol): 返回一个已登记的 Symbol 描述, 未登记的 Symbol 返回 undefined
```js
var s1 = Symbol.for("aa");
var s2 = Symbol("aa");
Symbol.keyFor(s1);    //"aa"
Symbol.keyFor(s2);    //undefined
```
注意 Symbol 的登记是全局的：
```js
iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);
iframe.contentWindow.Symbol.for("aa") === Symbol.for("aa");    //true
```

### 内置的 Symbol 值

ES6 提供了12个内置的 Symbol 值，这12个值，都是对象的，且都不可枚举、不可配置、不可修改。因为它们具有其特殊意义：

1. Symbol.hasInstance: 指向一个内部方法。判断对象是否某个构造函数的实例，instanceof 运算符会调用它
2. Symbol.isConcatSpreadable: 是一个数组对象属性。如果为 false 该属性在 concat 过程不会被展开。数组对象该属性默认值为 true, 类数组对象该属性默认值为 false
```js
var arr = [3,4];
[1,2].concat(arr);   //[1,2,3,4]
arr[Symbol.isConcatSpreadable] = false;
[1,2].concat(arr);   //[1,2,[3,4]]
```
<!--对于一个类而言，该属性必须返回 boolean 类型
```js
class A1 extends Array{
  [Symbol.isConcatSpreadable](){
    return true;
  }
}
class A2 extends Array{
  [Symbol.isConcatSpreadable](){
    return false;
  }
}
let a1 = new A1();
a1[0] = 3;
a1[1] = 4;
let a2 = new A2();
a2[0] = 5;
a2[1] = 6;
[1,2].concat(a1).concat(a2);  //
```
-->
3. Symbol.species: 指向一个方法。将对象作为构造函数调用时，系统内部会调用这个方法。即，当 this.constructor[Symbol.species]存在时，以此为构造函数构建对象。
4. Symbol.match: 指向一个函数。当执行 `str.match(obj)` 的时候, 如果 obj 存在该属性，调用该方法并返回该方法的返回值
```js
String.prototype.match(searchValue);
//相当于
SearchValue[Symbol.match](this);
//实例
class myMatch{
  constructor(str){
    this.content = str;
  }
  [Symbol.match](str){
    return this.content.indexOf(str);
  }
}
'e'.match(new myMatch("Hello"));    //1
```

5. Symbol.replace: 指向一个函数。和上一个方法类似的，当执行 `str.replace(obj,replaceValue)` 的时候, 如果 obj 存在该属性，调用该方法并返回该方法的返回值
```js
String.prototype.replace(searchValue, replaceValue);
//相当于
SearchValue[Symbol.replace](this, replaceValue);
```
6. Symbol.search: 指向一个函数。和上一个方法类似的，当执行 `str.search(obj)` 的时候, 如果 obj 存在该属性，调用该方法并返回该方法的返回值
```js
String.prototype.search(searchValue);
//相当于
SearchValue[Symbol.search](this);
```
7. Symbol.split: 指向一个函数。和上一个方法类似的，当执行 `str.split(obj,limit)` 的时候, 如果 obj 存在该属性，调用该方法并返回该方法的返回值
```js
String.prototype.split(seperator,limit);
//相当于
seperator[Symbol.split](this,limit);
```
8. Symbol.iterator: 指向默认的遍历器方法。对象在 for...of 中默认调用该方法。
```js
class Collector{
  constructor(...vals){
    this.nums = vals;
  }
  *[Symbol.iterator](){
    let i = this.nums.length;
    while(i){
      i--;
      yield this.nums[i];
    }
  }
}
var collector = new Collector(1,2,3,4,5);
for(let value of collector){
  console.log(value);        //依次输出 5 4 3 2 1
}
```
9. Symbol.toPrimitive: 指向一个方法。对象被转为原始类型值时会调用该方法。该方法介绍一个字符串参数，可选参数：

- "number": 此时转换成数值，应返回数值类型
- "string": 此时转换成字符串，应返回字符串类型
- "default": 此时转换成数值或字符串，应返回数值或字符串类型

```js
var obj = {
  [Symbol.toPrimitive](hint){
    switch(hint){
      case 'number': return 1234;
      case 'string': return 'hello';
      case 'default': return 'default';
      default: throw new Error();
    }
  }
};
console.log(obj.toString());     //[object Object]
console.log(obj.valueOf());      //{
console.log(2 * obj);            //2468
console.log(2 + obj);            //2default
console.log(obj === "hello");    //false
console.log(String(obj));        //hello
```
10. Symbol.unscopables: 该读取器指向一个对象。指定了在使用 with语句 时，那些属性被 with 环境排除(无法访问)
```js
//例1
console.log(Array.prototype[Symbol.unscopables]);    //输出如下,数组对象在 with 中不能访问这些属性方法
//{
//copyWithin: true,
//entries: true,
//fill: true,
//find: true,
//findIndex: true,
//includes: true,
//keys: true
//}
```
```js
//例2
//没有 unscopables 时
class MyClass{
  foo(){return 1}
}
var foo = () => 2;
with(MyClass.prototype){
  foo();    //1
}

//有 unscopable 时
var foo = () => 2;
class MyClass{
  foo(){return 1;}
  get [Symbol.unscopables](){
    return {foo:true};
  }
}
with(MyClass.prototype){
  foo();    //2
}
```
11. Symbol.toStringTag: 指向一个方法。该方法指向函数名是对象 toString 返回值 `[object Array]` 中 `Array` 部分。
```js
var b = {
  [Symbol.toStringTag]:"Hello"
};
console.log(b.toString());    //"[object Hello]"
```
ES6 新增的 Symbol.toStringTag 如下：

- JSON["Symbol.toStringTag"]: 'JSON'
- Math["Symbol.toStringTag"]: 'Math'
- Module对象 M["Symbol.toStringTag"]: 'Module'
- ArrayBuffer.prototype["Symbol.toStringTag"]: 'ArrayBuffer'
- DataView.prototype["Symbol.toStringTag"]: 'DataView'
- Map.prototype["Symbol.toStringTag"]: 'Map'
- Promise.prototype["Symbol.toStringTag"]: 'Promise'
- Set.prototype["Symbol.toStringTag"]: 'Set'
- %TypedArray%.prototype["Symbol.toStringTag"]: 'Uint8Array'等9种
- WeakMap.prototype["Symbol.toStringTag"]: 'WeakMap'
- WeakSet.prototype["Symbol.toStringTag"]: 'WeakSet'
- %MapIteratorPrototype%["Symbol.toStringTag"]: 'Map Iterator'
- %SetIteratorPrototype%["Symbol.toStringTag"]: 'Set Iterator'
- %StringIteratorPrototype%["Symbol.toStringTag"]: 'String Iterator'
- Symbol.prototype["Symbol.toStringTag"]: 'Symbol'
- Generator.prototype["Symbol.toStringTag"]: 'Generator'
- GeneratorFunction.prototype["Symbol.toStringTag"]: 'GeneratorFunction'

## Reflect 对象

Reflect 对象有一下作用：
1. 将 Object对象的一些明显属于语言层面的方法部署在 Reflect 上
2. 修改某些 Object 对象的方法使其更合理。比如 `Object.defineProperty` 遇到无法定义属性时会抛出错误，而 `Reflect.defineProperty` 会返回 false
3. 把所以 object 的操作都替换成函数行为，比如用 `Reflect.has(obj,name)` 替换 `name in obj`
4. 保证只要是 Proxy 有的方法就一定可以在 Reflect 上找到相同的方法，这样可以在实现 proxy 时方便的完成默认行为。换言之，无论 proxy 怎么修改默认行为，你总可以在 Reflect 上找到真正默认的行为

代理在添加额外的功能时，利用 Reflect 保证了原始功能的实现。举个例子：
```js
var loggedObj = new Proxy({}, {
  get(target,propKey){
    console.log(`getting ${target}.${propKey}`);  //当然你最好把操作记录到一个 log 中
    return Reflect.get(target,propKey);
  }
});
```

Reflect有以下方法：

- Reflect.getOwnPropertyDescriptor(target, propKey)
等同于 `ObjectgetOwnPropertyDescriptor(target, propKey)`
- Reflect.defineProperty(target,propKey,desc)
等同于 `Object.defineProperty(target,propKey,desc)`
- Reflect.getOwnPropertyNames(target)
等同于 `Object.getOwnPropertyNames(target)`
- Reflect.getPrototypeOf(target)
等同于 `Object.getPrototypeOf(target)`
- Reflect.setPrototypeOf(target, proto)
等同于 `Object.setPrototypeOf(target, proto)`
- Reflect.deleteProperty(target, propKey)
等同于 `delete target.propKey`
- Reflect.enumerate(target)
等同于 `for ... in target`
- Reflect.freeze(target)
等同于 `Object.freeze(target)`
- Reflect.seal(target)
等同于 `Object.seal(target)`
- Reflect.preventExtensions(target)
等同于 `Object.preventExtensions(target)`
- Reflect.isFrozen(target)
等同于 `Object.isFrozen(target)`
- Reflect.isSealed(target)
等同于 `Object.isSealed(target)`
- Reflect.isExtensible(target)
等同于 `Object.isExtensible(target)`
- Reflect.has(target, propKey)
等同于 `propkey in object`
- Reflect.hasOwn(target, propKey)
等同于 `target.hasOwnProperty(propKey)`
- Reflect.ownKeys(target)
遍历得到target自身所有属性，包括不可枚举属性，不包括 Symbol 属性
- Reflect.get(target,propKey, receiver = target)
如果 propKey 是个读取器，则读取器中的 this 绑定到 receiver
```js
var per = {
  bar: function(){console.log("per-bar")}
}
var obj = {
  get foo(){ this.bar(); },
  bar: function (){console.log("obj-bar")}
};
Reflect.get(obj, "foo", per);    //"per-bar"
```
- Reflect.set(target,propKey, value, receiver = target)
如果 propKey 是个读取器，则读取器中的 this 绑定到 receiver
- Reflect.apply(target, thisArg, args)
等同于 `Function.prototype.apply.call(target, thisArg, args)` 即 `thisArg.target(args)`
- Reflect.construct(target,args)
等同于 `new target(...args)`

注意以上方法中，`Reflect.set()`, `Reflect.defineProperty()`, `Reflect.freeze()`, `Reflect.seal()`, `Reflect.preventExtensions()` 在成功时返回 true, 失败时返回 false。对应的 Object 方法失败时会抛出错误。

## Proxy 对象

Proxy 用来修改某些默认操作，等同于在语言层面做出修改。所以属于一种元编程(meta programming), 即对编程语言进行编程。字面理解为Proxy代理了某些默认的操作。
其使用格式如下：
```js
var proxy = new Proxy(target, handler);
```
target是被代理的目标对象，handler也是个对象，用来定制拦截行为，内部定义每个被代理的行为。
注意：

- 如果希望这个代理有效，需要在 proxy 对象上调用属性方法，而不是在 target 上调用
- 如果指定 handler 为空对象，那么得到对象和原对象一样
- 得到的 proxy 是 target 的引用，如果没有代理，在 proxy 上的修改和在 target 上的修改等同

看一个简单的实例
```js
var proxy = new Proxy({},{
  get: function(target, key){
    return 35;
  }
});
console.log(proxy.time);    //35
console.log(proxy.name);    //35
console.log(proxy.title);    //35
//被代理的对象无论输入什么属性都返回35
```

实际上，proxy 对象也可以被继承：
```js
var proxy = new Proxy({},{
  get: function(target, key){
    return 35;
  }
});
var obj = Object.create(proxy);
obj.time = 20;
console.log(obj.time);    //20
console.log(obj.name);    //35
```

感受一下它的威力：
```js
var obj = new Proxy({}, {
  get: function(target, key, receiver){
    console.log(`getting ${key} ...`);
    return Reflect.get(target, key, receiver);
  },
  set: function(target, key, value, receiver){
    console.log(`setting ${key} ...`);
    return Reflect.set(target, key, value, receiver);
  }
});

obj.count = 1;            //setting count ...
++obj.count;              //getting count ...
                          //setting count ...
console.log(obj.count);   //getting count ...
                          //2
```
可以看出来，handler对象中 get 方法表示属性的访问请求，set 方法表示属性的写入请求。
当然不仅仅 get 和 set， 我们可以定义以下拦截函数：

- get(target, propKey, receiver = target)
拦截对象的读取属性。当 target 对象设置了 propKey 属性的 get 函数时，receiver 绑定 get 函数的 this。返回值任意
- set(target, propKey, value, receiver = target)
拦截对象的写入属性。返回一个布尔值
- has(target, propKey)
拦截 propKey in proxy 操作符，返回一个布尔值
- deleteProperty(target, propKey)
拦截 delete proxy[propKey] 操作符，返回一个布尔值
- enumerate(target)
拦截 for(let i in proxy) 遍历器，返回一个遍历器
- hasOwn(target, propKey)
拦截 proxy.hasOwnProperty('foo')，返回一个布尔值
- ownKeys(target)
拦截 Object.getOwnPropertyNames(proxy), Object.getOwnPropertySymbols(proxy), Object.keys(proxy)，返回一个数组。该方法返回对象所有自身属性，包括不可遍历属性，不包括 Symble属性，但是`Object.keys(proxy)`不应该包括不可遍历属性
- getOwnPropertyDescriptor(target, propKey)
拦截 Object.getOwnPropertyDescriptor(proxy, propKey)，返回其属性描述符
- defineProperty(target, propKey, propDesc)
拦截 Object.defineProperty(proxy, propKey, propDesc), Object.defineProperties(proxy, propDesc)，返回一个布尔值
- preventExtensions(target)
拦截 Object.preventExtensions(proxy)，返回一个布尔值
- getPrototypeOf(target)
拦截 Object.getPrototypeOf(proxy)，返回一个对象
- isExtensible(target)
拦截 Object.isExtensible(proxy)，返回一个布尔值
- setPrototypeOf(target, proto)
拦截 Object.setPrototypeOf(proxy, proto)，返回一个布尔值
- apply(target, object, args)
拦截对 proxy 实例的函数操作，包括 proxy(...args),proxy.call(object, ...args),proxy.apply(object, args)
- construct(target, args, proxy)
拦截用 new 调用 proxy 函数的操作，construct()返回的不是对象会报错

以下列举一些 Proxy 的实例

访问对象不存在的属性报错
```js
var obj = new Proxy({}, {
  get: function(target, key){
    if(key in target){
      return Reflect.get(target, key);
    } else {
      throw new ReferenceError(`"${key}" is not in object`);
    }
  }
});
obj.look = "picture";
console.log(obj.look);     //"picture"
console.log(obj.sleep);    //ReferenceError: "sleep" is not in object
```

数组索引为负时返回倒数位置的值
```js
var origin = [10,20];
var arr = new Proxy(origin, {
  get(target, key){
    let index = parseInt(key);
    if(index < 0){
      index = target.length + index;
      if(index < 0) return undefined;
    }
    return Reflect.get(target, index);
  }
});
console.log(arr[0]);     //10
console.log(arr[1]);     //20
console.log(arr[2]);     //undefined
console.log(arr[-1]);    //20
console.log(arr[-4]);    //undefined
```

保护对象内以 "_" 开头的属性为私有属性:
```js
var o = {
  "_name": "Bob",
  "age": 13,
  "_fun": function(){
    console.log("_fun is called");
  }
};
var obj = new Proxy(o, {
  get(target, key){
    if(key.charAt(0) === '_'){
      return undefined;
    }
    return Reflect.get(target, key);
  },
  set(target, key, value){
    if(key.charAt(0) === '_'){
      throw new Error('Cannot define a property begin with "_"');
    }
    return  Reflect.set(target, key, value);
  },
  has(target,key){
    if(key.charAt(0) === '_'){
      return false;
    }
    return Reflect.has(target, key);
  },
  deleteProperty(target,key){
    if(key.charAt(0) === '_'){
      return false;
    } else {
      Reflect.deleteProperty(..arguments);
    }
  },
  apply(target,ctx,args){
    if(target.name.charAt(0) === '_'){
      throw new TypeError(`${target.name} is not defined`);
    } else {
      Reflect apply(...arguments);
    }
  },
  defineProperty(target,key,desc){
    if(key.charAt(0) === '_'){
      return new Error(`cannot define property begin with "_"`);
    } else {
      Reflect.defineProperty(..arguments);
    }
  },
  setPrototypeOf(target,proto){
    throw new TypeError(`Cannot change the proto of ${target}`);
  },
  construct(target,ctx,args){
    if(target.name.charAt(0) === '_'){
      throw new TypeError(`${target.name} is not defined`);
    } else {
      Reflect construct(...arguments);
    }
  }
});

console.log(obj.age);    //13
obj.age = 20;
console.log(obj.age);    //20
console.log(obj._name);  //undefined
obj._hobby = "Coding";   //Error: Cannot define a property begin with "_"
_name in key             //false
delete obj._name;
Object.defineProperty(obj,"_hobby",{
  value: "Coding"
});
Object.defineProperties(obj,{
  '_hobby': {
    value: "Coding"
  }
});
obj._fun();
var a = new obj._fun();
obj.__proto__ = {};     //Cannot define a property begin with "_"
Object.setPrototypeOf(obj,{})    //Cannot change the proto of obj
```

当然不是所有 proxy 代理都不可取消，下面方法设置的代理是可以通过定义代理时返回的revoke函数取消：
```js
var a = {
  name:"Bob"
};
var {proxy, revoke} = Proxy.revocable(a, {
  get(target,key){
    return undefined;
  }
});
proxy.name;   //undefined;
revoke();
proxy.name;   //TypeError: Cannot perform 'get' on a proxy that has been revoked
```

## Set 与 Map

### Set

Set 是一种集合结构，特征和数学中的一致，具有以下特征：

- 同一个集合中不能有相同元素
- set 可以存放不同类型的数据

但使用过程中请注意以下几点：

- 存入 set 的数据不会进行类型转换，即'5'和 5 是不一样的
- 内部采用严格相等比较元素，但-0等于+0，NaN也等于NaN

定义聚合和定义其他数据结构一样，其构造函数接受一个数组,集合或类数组对象初始化：
```js
var set1 = new Set();
var set2 = new Set([1,2,3,3,4,4,5]);
console.log(set1);   //Set(0) {}
console.log(set2);   //Set(5) {1, 2, 3, 4, 5}
```

Set结构具有以下属性和方法，由于和数组方法基本一致，不细细列举

- size属性: 当前集合的元素数量，相当于数组熟悉的length
- constructor属性: Set()

- add()方法: 相当于数组的push()方法，但只能接受一个参数
- delete()方法: 删除集合中的一个值
- has()方法: 判断数组的中是否含有某个值
- clear()方法: 清空当前数组
- keys()方法: 返回键名的遍历器，和数组keys()方法一样
- values()方法: 返回值的遍历器，和数组values()方法一样
- entires()方法: 返回键值对的遍历器，和数组entires()方法一样
- forEach()方法: 使用回调函数遍历集合成员，和数组forEach()方法一样
- map()方法: 相当于数组的map()方法
- filter()方法: 相当于数组的filter()方法

Set的默认遍历器遍历的是值：
```js
Set.prototype[Symbol.iterator] === Set.prototype.values;   //true
```

集合运算：

- 并集
```js
var a = new Set([1,2,3]);
var b = new Set([2,4,5]);
var union = new Set([...a, ...b]);    //[1,2,3,4,5]
```
- 交集
```js
var a = new Set([1,2,3]);
var b = new Set([2,4,5]);
var intersect = new Set([...a].filter(item => b.has(item)));  //[2]
```
- 差集
```js
var a = new Set([1,2,3]);
var b = new Set([2,4,5]);
var diffsect = new Set([...a].filter(item => !b.has(item)));  //[1,3]
```
### WeakSet

WeakSet 和 Set类似，但是具有以下区别:

- WeakSet 的元素只能是对象，不能是别的类型
- WeakSet 的元素无法被引用，其元素不具有别的引用时，GC 会立刻释放对象的内存资源，因此 WeakSet 不能被遍历。

定义WeakSet和定义其他数据结构一样，其构造函数接受一个数组,集合或类数组对象初始化：
```js
var set1 = new WeakSet();
var set2 = new WeakSet([[1,2],[3,3],[4,4,5]]);
console.log(set1);   //WeakSet(0) {}
console.log(set2);   //WeakSet {(2) [1, 2], (2) [3, 3], (3) [4, 4, 5]}
```

WeakSet 没有 size 属性，有如下3个方法：

- add()方法: 相当于数组的push()方法，但只能接受一个参数
- delete()方法: 删除集合中的一个值
- has()方法: 判断数组的中是否含有某个值
- clear()方法: 清空当前数组
- keys()方法: 返回键名的遍历器，和数组keys()方法一样，用于 for...of 循环
- values()方法: 返回值的遍历器，和数组values()方法一样，用于 for...of 循环
- entires()方法: 返回键值对的遍历器，和数组entires()方法一样，用于 for...of 循环
- forEach()方法: 使用回调函数遍历集合成员，和数组forEach()方法一样
- map()方法: 相当于数组的map()方法
- filter()方法: 相当于数组的filter()方法

WeakSet 不能遍历，它的作用是临时存储DOM节点，这样不必担心内存泄漏：
```js
//例
const foos = new WeakSet();
class Foo{
  constructor(){
    foos.add(this);
  }
  method(){
    if(!foos.has(this)){
      throw new TypeError(`"foo.prototype.method" is only called by object of Foo`);
    }
    console.log(`"Foo.prototype.method" has been called`);
  }
}
var obj = new Foo();
obj.method();          //Foo.prototype.method" has been called
obj.method.call({});   //typeError: "foo.prototype.method" is only called by object of Foo
```

### Map

js 中的对象是键值对的集合，但是键只能是字符串其实并不方便。Map结构本质和对象一样，只是键名可以使用各种类型的值。如果这么理解，那么Map就是一种值-值对而不是键-值对，这一点类似hash结构：
```js
var o = {name: "Bob"};
var map = new Map();
map.set(o, "hello");
console.log(map.get(o));   //"hello"
```

构造 Map 结构的构造函数接受数组，对象等类型作为构造函数的参数：
```js
var map = new Map([["name","Bob"], ["age", 12]]);
map.get("name");    //"Bob"
map.get("age");     //12
```

map具有如下属性和方法：

- size 属性: 返回 map 中元素的数量，类似数组的 length

- set(key, value)方法: 向map中添加值-值对
- get(key)方法: 读取map中的值
- delete(key, value)方法: 删除map中的值-值对
- has(key)方法: 判断某个键名是否存在
- clear()方法: 清空当前 map 中所以数据
- keys()方法: 返回键名的遍历器，和数组keys()方法类似，用于 for...of 循环
- values()方法: 返回值的遍历器，和数组values()方法类似，用于 for...of 循环
- entires()方法: 返回值-值对的遍历器，和数组entires()方法类似，用于 for...of 循环
- forEach()方法: 使用回调函数遍历集合成员，和数组forEach()方法类似

```js
var o = {name: "Bob"};
var map = new Map();
map.set(o, "hello");
console.log(map.get(o));   //"hello"
map.set(o, "world");       //重复定义，覆盖之前的定义
console.log(map.get(o));   //"world"
console.log(map.get({name: "Bob"}));   //undefined, 不同的对象引用不认为是同一个对象
map.delete(o);             //删除对象属性 o
console.log(map.get(o));   //undefined
```

从上方的例子不难发现，不同的对象属性对于 map 来说就是不同的，不管内部的内容是否一致。这和对象的 === 比较是一样的道理，带来的好处是我们不用担心和会 map 原有属性重名，而直接向 map 添加对象属性即可。

注意 undefined，NaN和 null 也可以作为 map 的键名
```js
var map = new Map();
map.set(undefined, 1);
map.set(null, 2);
map.set(NaN, 3);
console.log(map.get(undefined));        //1
console.log(map.get(null));        //2
console.log(map.get(NaN));        //3
```

但使用过程中请注意以下几点：

- 存入 map 的数据不会进行类型转换，即'5'和 5 是不一样的, {} 和 {}也是不一样的。
- 内部采用严格相等比较元素，但-0等于+0，NaN也等于NaN。

map 的默认遍历器是 entries()
```js
Map.prototype[Symbol.iterator] === Map.prototype.entries;   //true
```

另外这里需要格外强调的是：

- Set中的 has 方法是判断**键值**是否存在的，如 ` Set.prototype.has(value)`, `WeakSet.prototype.has(value)`
- Map中的 has 方法是判断**键名**是否存在的，如 ` Map.prototype.has(key)`, `WeakMap.prototype.has(key)`, `Reflect.has(target, propertyKey)`

Map解构转换技巧：

- Map 转 Array
```js
var map = new Map([[1,'one'], [2, 'two'], [3, 'three']]);
var keyArr = [...map.keys()];          //[1,2,3]
var valueArr = [...map.values()];      //['one','two','three']
var entriesArr = [...map.entries()];   //[[1,'one'], [2, 'two'], [3, 'three']]
var arr = [...map];                    //[[1,'one'], [2, 'two'], [3, 'three']]
```
- Map 转 Object(为防止不必要的错误，直接丢弃不是字符串为键的属性)
```js
function map2arr(map){
  var o = {};
  for(let [key, value] of map.entries()){
    if(typeof key === 'string'){
      o[key] = value;
    }
  }
  return o;
}
var map = new Map([[1,'one'], [2, 'two'], ['three', 3], ['four', 4]]);
map2arr(map);    //Object {three: 3, four: 4}
```
- Map 转 JSON
```js
var map = new Map([[1,'one'], [2, 'two'], ['three', 3], ['four', 4]]);
JSON.stringify([...map]);    //"[[1,"one"],[2,"two"],["three",3],["four",4]]"
```

### WeakMap

WeakMap 和 map 类似，不过它只接受对象作为键名，null除外。试想，如果对象 o 是一个 map的属性，如果该对象被释放了，那这个 map 属性会导致内存溢出。解决这个问题就是使用 WeakMap：
```js
var o = {name: "Bob"};
var map = new WeakMap();
map.set(o, 12);
console.log(map.get(o));    //12
o = null;
console.log(map.get(o));    //undefined
```

WeakMap的对象属性名，不计入 GC，所以当对象不存在的时候，这个 weakmap 中相应的键值对就被删除了。值得一提的是，代码对于 map 可以得到一样的输出。那是因为最后一行相当于`console.log(map.get(null))`, 我们没有定义 null 对应的值，所以得到 undefined, 其实内存泄露的隐患依然存在：
```js
var o = {name: "Bob"};
var map = new Map();
map.set(o, 12);
console.log(map.get(o));    //12
o = null;
console.log(map.size);      //1
```

WeakMap 和 WeakSet 类似，由于不计入 GC 回收机制，所以不支持遍历操作，也不支持被清空，所以 WeakMap 只有以下 4 个方法，没有 size 属性：

- set(key, value)方法: 向weakMap中添加值-值对
- get(key)方法: 读取map中的值
- delete(key, value)方法: 删除weakMap中的值-值对
- has(key)方法: 判断某个键名是否存在

## iterator

### for...of

`for...of` 可以遍历具有 iterator 的对象，具体有一下几种形式：
```js
for(let [key, value] of obj){
  //得到键值对
}
for(let [key] of obj){
  //得到键名
}
for(let [, value] of obj){
  //得到值
}
```

## 数组的扩展

- `Array, from()`
将类数组对象和可遍历对象转化为真正的数组。
```js
var arrayLike = {
  '0' : 'a',
  '1' : 'b',
  '2' : 'c',
  'length': 3
}

var arr;
//ES5
arr = [].slice.call(arrayLike);    //arr=['a', 'b', 'c']

//ES6
arr = Array.from(arrayLike);    //arr=['a', 'b', 'c']
```
和它类似的是扩展运算符, 一样可以实现该功能(要求对象具有遍历器接口):
```js
function(){
  var arg = [...arguments];   //转化 arguments 为数组
}
```
Array.from() 接受第二参数(函数), 用来映射结果, 相当于 map, 并且可以用第三个参数绑定 this:
```js
Array.from(obj, func, context);
//等价于
Array.from(obj).map(func, context);
```
技巧, 用 Array.from() 指定函数运行次数:
```js
var i = 0;
Array.from({length: 3}, ()=>i++);   //[0, 1, 2]
```

建议：使用Array.from方法，将类似数组的对象转为数组。

- `Array.of()`
将多个值组成数组:
```js
Array.of(2, 3, 5);   //[2, 3, 5]
Array.of(2);   //[2]
Array.of();   //[]
Array.of(undefined);   //[undefined]
```

- `Array.prototype.copyWithin()`
函数参数是 `Array.prototype.copyWithin(target, start=0, end=this.length)`, 对当前数组, 从截取下标为 start 到 end 的值, 从target 位置开始覆盖 `this` 中的值。如果 start 或 end 为负数则倒数。
```js
[1, 2, 3, 4, 5].copyWithin(0, 3, 4);   //[4, 2, 3, 4, 5]

[1, 2, 3, 4, 5].copyWithin(0, -2, -1);   //[4, 2, 3, 4, 5]

[].copyWithin.call({length: 5, 3: 1}, 0, 3);   //{0: 1, 3: 1, length: 5}

var i32a = new Int32Array([1, 2, 3, 4, 5]);
i32a.copyWithin(0, 2);   //[3, 4, 5, 4, 5]
```

- `Array.prototype.find()`, `Array.prototype.findIndex()`
这两个函数的参数都是回调函数。遍历数组, 找到符合条件(回调函数返回为true)的第一个值, find()返回其值, `findIndex()`返回其下标。如果没找到符合条件的值`find()`返回undefined, `findIndex()`返回-1。
```js
[1, 2, -3, 4].find((item) => item < 0);   //-3
[1, 2, -3, 4].findIndex((item) => item < 0);   //2

[NaN].findIndex(y => y !== y);   //0
[NaN].indexOf(NaN);   //-1, indexOf 找不到 NaN
```
这两个函数还接受第二参数, 用来绑定回调函数中的 this

- `Array.prototype.fill()`
完整形式: `Array.prototype.fill(value, start=0, end=this.length)`, 对数组 start 到 end 直接部分填充 value, 覆盖原有值。
```js
[1, 2, 3, 4, 5].fill('a', 2, 4);    //[1, 2, 'a', 'a', 5];
var arr = new Array(5).fill(0);   //arr = [0, 0, 0, 0, 0];
```

- `Array.prototype.entries()`, `Array.prototype.keys()`, `Array.prototype.values()`
这三个方法, 用来遍历数组, 返回一个遍历器, 供 `for...of` 使用, 其中 `keys()`是对键的遍历, `values()` 是对值的遍历, `entires()`是对键值对的遍历。babel 已实现
```js
var a = ['a', 'b', 'c'];

for(let item of a.values()){
  console.log(item);     //依次输出 'a', 'b', 'c'
}

for(let key of a.keys()){
  console.log(key);     //依次输出 0, 1, 2
}
for(let pair of a.entries()){
  console.log(pair);     //依次输出 [0, 'a'], [1, 'b'], [2, 'c']
}
```
当然也可以用遍历器的 next() 方法遍历
```js
var a = ['a', 'b', 'c'];
var values = a.values();
console.log(values.next().value);   //'a'
console.log(values.next().value);   //'b'
console.log(values.next().value);   //'c'
```

- `Array.prototype.includes()`
这是个 ES7 的方法, 判断数组中是否含有某个值, 含有则返回 true, 否则返回 false。可以用第二个参数指定查找起始点(小于0倒数)。
```js
//该方法同样可以找到 NaN, 而 indexOf 不行
[1, 2, NaN].includes(NaN);   //true
[1, 2, 3, 4, 5].includes(2, 3);  //false
```

- 数组的空位
我们比较以下两个数组:
```js
var empty = new Array(3);  //[, , , ]
var unempty = new Array(3).fill(undefined);   //[undefined, undefined, undefined]

console.log(0 in empty);     //false
console.log(0 in unempty);   //true
```

结合手册内容如下就很好理解这个问题：
> “Array elements may be elided at the beginning, middle or end of the element list. Whenever a comma in the element list is not preceded by
an AssignmentExpression (i.e., a comma at the beginning or after another comma), the missing array element contributes to the length of the
Array and increases the index of subsequent elements. Elided array elements are not defined. If an element is elided at the end of an array,
that element does not contribute to the length of the Array.”
<small>摘自<a href="http://www.ecma-international.org/ecma-262/6.0/" target="_blank">ECMAScript® 2015 Language Specification</a></small>

翻译如下。
>"数组成员可以省略。只要逗号前面没有任何表达式，数组的length属性就会加1，并且相应增加其后成员的位置索引。被省略的成员不会被定
义。如果被省略的成员是数组最后一个成员，则不会导致数组length属性增加。”

很明显, 一个完全空的数组是没有东西的, 而填充了`undefined`的数组并不是空的。
结合 ES5, 发现不同函数方法对空位处理方式是不一样的:
-- `forEach()`, `filter()`, `every()`, `some()` 会忽略空值
-- `map()`, `copyWithin()` 会保留空值, 但不做处理
-- `join()`, `toString()`, 会把空值处理为空字符串
-- `fill()` 不区分空值与非空值
-- `Array.from()`, 扩展运算符(...), `for...of`, `entires()`, `keys()`, `values()`, `find()`, `findIndex()` 会视空值为 `undefined`
如果你记不住这些, 或者为了程序的健壮性, 可维护性, 尽量避免在数组中出现空值。
举个实例, 理解一下这个问题:
> 新建一个长为200的数组, 并初始化每个位置的值等于其索引
```js
//错误方法
var arr = new Array(200).map(function(item, index){
  return index;
});
console.log(arr);    //[undefined × 200]
```
```js
//正确做法
var arr = new Array(200).join().split(', ').map(function(item, index){
  return index;
});
console.log(arr);    //[1, 2, 3, ..., 200]
```

- 数组推导
这是一个 ES7 的功能, 暂时还没能实现。我们可以先看一下它如何推导的:
```js
var a1 = [1, 2, 3, 4];
var a2 = [for( i of a1) i * 2];   //a2=[2, 4, 6, 8]
```
不难看出, 数组 a2 通过 `for...of` 直接从 a1 生成。但是它的功能不仅仅这么简单, 还可以有 if 条件:
```js
var a1 = [1, 2, 3, 4];
var a3 = [for( i of a1) if(i > 2) i * 2];   //a3=[6, 8]
```
这样, 我们可以简单的用数组推导模拟 `map()`, `filter()` 方法了。比如上面2个例子等价于:
```js
var a1 = [1, 2, 3, 4];
var a2 = a1.map( (i) => i * 2 );
var a3 = a1.filter( (i) => i > 2 ).map( (i) => i * 2 );
```
当然我们还可以用多个 `for...of` 构成循环嵌套:
```js
var a = ['x1', 'x2'];
var b = ['y1', 'y2'];

[for(i of a) for(j of b), console.log(i+', '+j)];
//输出
//['x1', 'y1']
//['x1', 'y2']
//['x2', 'y1']
//['x2', 'y2']
```
数组推导由 `[]` 构建了一个作用域, 其内部新建的变量, 等同于用 let 关键字声明的变量。除此之外, 字符串也可以被视为数组, 所以同样可以使用数组推导:
```js
[for(c of 'abcde'). c+'.'].join('');  //"a.2.3.4.5."
```

## 二进制数组

这个部分如果没有C语言和计算机基础会比较难理解, 如果实在理解不了可以收藏它, 日后再看。

二进制数组其实很早就有了, 不过为了 WebGL 中, 数据可以高效和显卡交换数据。分为3类:
- ArrayBuffer: 代表内存中的一段二进制数据;
- TypedArray: 读写简单的二进制数据, 如 Uint8Array, Int16Array, Float32Array 等9类;
- DataView: 读写复杂的二进制数据, 如 Uint8, Int16, Float32 等8类;

数据类型 | 字节长度 | 含义 | 对应 C 语言类型 | TypedArray 类型 | DataView 类型
--- | --- | --- | --- | --- | ---
Int8 | 1 | 8位有符号整数 | char | Int8Array | Int8
Uint8 | 1 | 8位无符号整数 | unsigned char | Uint8Array | Uint8
Uint8C | 1 | 8位无符号整数(自动过滤溢出) | unsigned char | Uint8ClampedArray | 不支持
Int16 | 2 | 16位有符号整数 | short | Int16Array | Int16
Uint16 | 2 | 16位无符号整数 | unsigned short | Uint16Array | Uint16
Int32 | 4 | 32位有符号整数 | int | Int32Array | Int32
Uint32 | 4 | 32位无符号整数 | unsigned int | Uint32Array | Uint32
Float32 | 4 | 32位浮点数 | float | Float32Array | Float32
Float64 | 8 | 64位浮点数 | double | Float64Array | Float64

### ArrayBuffer

ArrayBuffer 代表内存中的一段二进制数据, 我们没法直接操作, 需要利用视图(TypedArray, DataView)按一定格式解读二进制数据。但我们依然可以构造一段内存来存放二进制数据:
```js
var buf = new ArrayBuffer(32);  //分配32个字节的内存存放数据, 默认全0
var dataview = new DataView(buf);   //将这段内存转为视图
dataview.getUint8(0);   //得到第一个8字节的值(无符号), 0
```

 这里需要强调的是, 分配内存空间不要太大！毕竟你的内存是有限的。
 其次, 无论使用什么视图, 其实例化的内存如果共享, 所有的写入操作会修改每一个视图, 因为内存共用的:
 ```js
var buf = new ArrayBuffer(32);
var view16 = new Int16Array(buf);
var viewu8 = new Uint8Array(buf);

console.log(viewu8[0]);   //0
view16[0]=-1;
console.log(viewu8[0]);   //255
 ```
 这里之所以得到255, 是因为内存共用导致的, 但为何不是-1？Int16Array 是有符号类型的, 这样二进制的最高位用作符号位, 负数记为1: `1000 0000 0000 0001`, 之后的数字用移码存储, 得到-1的二进制为: `1111 1111 1111 1111`, 之后利用Uint8Array读取无符号的前8位, 得到`1111 1111`这个计算为十进制为 $2^8-1=255$。具体关于数制转换和反码补码这里不再展开, 否则就跑偏了。

ArrayBuffer 对象也有几个方法和属性:
- byteLength: 得到内存区域的字节长度
```js
const N = 32;
var buf = new ArrayBuffer(N);
if(buf.byteLength === N){
  //分配成功
} else {
  //分配失败
}
```

- slice(start=0, end=this.byteLength): 分配新内存, 并把先有内存 start 到 end 部分复制过去, 返回这段新内存区域
```js
var buf = new ArrayBuffer(32);
var newBuf = buf.slice(0, 3);
```

- isView(view): 判断传入的 view 是否当前 buffer 的视图, 是则返回 true, 否则 false。该方法暂无法使用。
```js
var buf1 = new ArrayBuffer(32);
var buf2 = new ArrayBuffer(32);
var buf1View = new Int8Array(buf1);
var buf2View = new Int8Array(buf2);

buf1.isView(buf1View);   //true
buf1.isView(buf2View);   //false
```

### TypedArray

具有一个构造函数 DataView(), 接受一个ArrayBuffer参数, 视图化该段内存; 或接受一个数组参数, 实例化该数组为二进制内容。得到的值是一个数组, 可以直接使用`[]`访问每个位置的内容, 有`length`属性。其构造函数有9个:

数据类型 | 字节长度 | 含义 | 对应 C 语言类型 | TypedArray 类型构造函数
--- | --- | --- | --- | ---
Int8 | 1 | 8位有符号整数 | char | Int8Array()
Uint8 | 1 | 8位无符号整数 | unsigned char | Uint8Array()
Uint8C | 1 | 8位无符号整数(自动过滤溢出) | unsigned char | Uint8ClampedArray()
Int16 | 2 | 16位有符号整数 | short | Int16Array()
Uint16 | 2 | 16位无符号整数 | unsigned short | Uint16Array()
Int32 | 4 | 32位有符号整数 | int | Int32Array()
Uint32 | 4 | 32位无符号整数 | unsigned int | Uint32Array()
Float32 | 4 | 32位浮点数 | float | Float32Array()
Float64 | 8 | 64位浮点数 | double | Float64Array()

以上9个会对内存进行不同位数的格式化, 以得到对应类型值的数组。这个数组不同于普通数组, 它不支持稀疏数组, 默认值为0, 而且同一个数组只能存放同一个类型的变量。

以上每个构造函数都对应如下形式的参数:
```js
(buffer, start=0, len=buffer.byteLength-start*8)
```
可以指定序列化其中 start到 end部分的二进制数据。注意这里指定的范围必须和数组类型所匹配, 不能出现类似`new Int32Array(buffer, 2, 2)`的情况。如果你觉得这个不符合你的需求, 可以使用 DataView。

如果你觉得上面的写法复杂, 可以不写 new ArrayBuffer, 直接使用 TypedArray, 但注意参数的意义不一样:
```js
var f64a = new Float64Array(4);    //分配32个字节, 并作为double类型使用。 32 = 64 / 8 * 4
```

TypedArray的构造函数还接受另一个TypedArray作为参数, 开辟新内存复制其值并改变类型, 对原视图和buffer 不构成影响, 也不共用内存。
TypeArray的构造函数还接受另一个Array作为参数, 开辟新内存复制其值, 对原数组不构成影响, 也不共用内存。

当然利用一下方法, 可以把 TypedArray 转换为普通数组:
```js
var arr = [].slice.call(typedArray);
```

TypedArray具有除了`concat()`以外的全部数组方法, 当然, 它也具有 iterator, 可以用 for...of 遍历。
以下是 TypedArray 特有的属性和方法:

- buffer属性: 返回该视图对于的二进制内存区域
- BYTES_PER_ELEMENT属性: 是个常数, 表示数组中每个值的字节大小, 不同视图的返回值与上方表格一致
- byteLength: 返回该视图对于的内存大小, 只读
- byteOffset: 返回该视图从对应 buffer 的哪个字节开始, 只读
- set(arr_or_typeArray, start=0): 在内存层面, 从arr_or_typeArray 的 start 下标开始复制数组到当然 typeArray
- subarray(start=0, end=this.length), 截取 start到 end部分子数组, 但是和原数组共用内存
- from(): 接受一个可遍历参数, 转为该视图实例
- of(): 将参数列表转为该视图实例

小技巧, 转换字符串和 ArrayBuffer
```js
//该方法仅限转换 utf-16 的字符串
function ab2str(buf){
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str){
  var len = str.length;
  var view = new Uint16Array(len);
  for(let i = 0; i < len; i++){
    view[i] = str.charCodeAt(i);
  }
  return view.buffer;
}
var str = "Hello world";
var buf = str2ab(str);
var view = new Uint16Array(buf);
for(var i = 0; i < view.length; i++){
  console.log(String.fromCharCode(view[i]));   //一次输出"Hello world"的每个字母
}
console.log(ab2str(buf));    //"Hello world"
```

> 这里扩展一些编码知识, 我们知道计算机里面存储的是二进制, 并且存储的最小单位是字节。但是不同的系统存储方式不同, 分为高位优先和低位优先。比如 20170101 这个数字, 其十六进制表示为 0x0133C575, 在低位优先的系统中存储方式为 `0x75 0xC5 0x33 0x01`, 而在高位优先的系统中存储方式为 `0x01 0x33 0xC5 0x75`。由于大多数计算机采用低位优先的方式, 所以 ES6 采用是也是低位优先的方式, 但遇到高位优先的数据时, 就不能简单的直接那来使用, 具体使用会在 DataView 中介绍, 这里说明一种判断低位优先(little endian)还是高位优先(big endian)的方法:

还有需要注意的是数据溢出, 这个也是需要数制方面基础比较好理解, 这里不过多展开了。举一个例子:
Uint8 只能表示8位无符号整数, 最大是`1111 1111`, 也就是十进制的 0~255; Int8因为有了符号位, 只能表示十进制-128~127, 如果给它的值不在这个范围内就会发生溢出, 得到一个你意想不到但情理之中的值
```js
var view1 = new Uint8Array(2);
view1[0] = 256;   //256 二进制是 1 0000 0000 由于数据只能容纳8个值, 进位1就丢了
view1[1] = -1;    //之前说过-1 二进制(补码)为 1111 1111(全1), 作为无符号数8个1就是255

console.log(view1[0]);   //0
console.log(view1[1]);   //255

var view2 = new Int8Array(2);
view2[0] = 128;   //由于符号位溢出, 系统自动用32位计算这个数1 000 0000 0000 0000 0000 0000 1000 0000, 取符号位和最后8位得到-128
view2[1] = -128;  //由于符号位溢出, 系统自动用32位计算这个数0 111 1111 1111 1111 1111 1111 0111 1111, 取符号位和最后8位得到127
console.log(view2[0]);   //-128
console.log(view2[1]);   //127
```

为了防止这样的情况, js 有一个 Unit8ClampedArray, 使整数方向的溢出值为255, 0方向的易楚志为0。注意这是个无符号的类型;
```js
var view = new Uint8ClampedArray(2);
view[0] = 256;
view[1] = -1;

console.log(view[0]);   //255
console.log(view[1]);   //0
```

### 复合视图

划分一块 buffer 使用得到 C 语言中的结构体
```js
var buf = new ArrayBuffer(24);
var name = new Uint8Array(buf, 0, 16);
var gender = new Uint8Array(buf, 16, 1);
var age = new Uint16Array(buf, 18, 1);
var score = new Float32Array(buf, 20, 1);
```
相当于以下 C语言代码
```cpp
struct Person{
  char name[16];
  char gender;
  int age;
  float score;
}
```

共用一块 buffer 使用得到 C 语言中的联合体
```js
var buf = new ArrayBuffer(8);
var num = new Uint16Array(buf);
var dotNum = new Float64Array(buf);
```
相当于以下 C语言代码
```cpp
union Example{
  int num[4];
  double dotNum;
}

```

### DataView

具有一个构造函数 DataView(), 接受一个ArrayBuffer参数, 视图化该段内存。毕竟当一段内存有多种数据时, 复合视图也不是那么方便, 这时适合使用 DataView 视图。其次 DataView 可以自定义高位优先和低位优先, 这样可以读取的数据就更多了。
DataView构造函数形式如下, 这一点和 TypedArray 一致:
```js
(buffer, start=0, len=buffer.byteLength-start*8)
```

它具有以下方法格式化读取 buffer 中的信息:

- getInt8(start, isLittleEndian): 从 start 字节处读取 1 个字节, 返回一个8位有符号整数, 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- getUint8(start, isLittleEndian): 从 start 字节处读取 1 个字节, 返回一个8位无符号整数, 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- getInt16(start, isLittleEndian): 从 start 字节处读取 2 个字节, 返回一个16位有符号整数, 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- getUint16(start, isLittleEndian): 从 start 字节处读取 2 个字节, 返回一个16位无符号整数, 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- getInt32(start, isLittleEndian): 从 start 字节处读取 4 个字节, 返回一个32位有符号整数, 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- getUint32(start, isLittleEndian): 从 start 字节处读取 4 个字节, 返回一个32位无符号整数, 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- getFloat32(start, isLittleEndian): 从 start 字节处读取 4 个字节, 返回一个32位浮点数, 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- getFloat64(start, isLittleEndian): 从 start 字节处读取 8 个字节, 返回一个64位浮点数, 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;


它具有以下方法格式化写入 buffer 中的信息:

- setInt8(start, value, isLittleEndian): 在 start位置写入 1 个字节的8位有符号整数value; 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- setUint8(start, value, isLittleEndian): 在 start位置写入 1 个字节的8位无符号整数value; 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- setInt16(start, value, isLittleEndian): 在 start位置写入 2 个字节的16位有符号整数value; 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- setUint16(start, value, isLittleEndian): 在 start位置写入 2 个字节的16位无符号整数value; 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- setInt32(start, value, isLittleEndian): 在 start位置写入 4 个字节的32位有符号整数value; 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- setUint32(start, value, isLittleEndian): 在 start位置写入 4 个字节的32位无符号整数value; 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- setFloat32(start, value, isLittleEndian): 在 start位置写入 4 个字节的32位浮点数value; 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;
- setFloat64(start, value, isLittleEndian): 在 start位置写入 8 个字节的64位浮点数value; 第二参默认为 false 表示使用高位优先, 为 true 表示低位优先;

它具有以下属性和方法:

- buffer属性: 返回该视图对于的二进制内存区域
- byteLength: 返回该视图对于的内存大小, 只读
- byteOffset: 返回该视图从对应 buffer 的哪个字节开始, 只读

如果你不知道计算机使用的是高位优先还是低位优先, 也可以自行判断:
```js
//方法1
const BIG_ENDIAN = Symbol('BIG_ENDIAN');
const LITTLE_ENDIAN = Symbol('LITTLE_ENDIAN');
function getPlatformEndianness(){
  let arr32 =  Uint32Array.of(0x12345678);
  let arr8 = new Uint8Array(arr32.buffer);
  switch((arr8[0]*0x1000000)+(arr8[1]*0x10000)+(arr8[2]*0x100)+arr8[3]){
    case 0x12345678: return BIG_ENDIAN;
    case 0x78563412: return LITTLE_ENDIAN;
    default: throw new Error("unknow Endianness");
  }
}

//方法2
window.isLittleEndian = (function(){
  var buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
}());
```

## 正则表达式扩展

- 构造函数支持传入正则得到拷贝, 同时可以用第二参修改修饰符
```js
var reg = /^abc/ig;
var newReg_ig = new RegExp(reg);      //newReg_ig = /^abc/ig;
var newReg_g = new RegExp(reg, 'g');      //newReg_g = /^abc/g;
```

- 引入新的修饰符
ES5中的修饰符有3个, 加上 ES6 的修饰符, 一共5个:

修饰符 | 描述 | 描述
--- | --- | ---
m | multiline | 多行模式
i | ignore case | 忽略大小写模式
g | global match | 全局匹配模式
u | unicode | unicode模式
y | sticky | 粘连模式

unicode 模式
为了兼容 4 自己 unicode, 我们需要在一下情况使用该模式
```js
//情况1:
/^\uD83D/.test("\uD83D\uDC2A");   //true, 很明显这个是不对的, 因为 \uD83D\uDC2A 是一个字, 不能拆开
/^\uD83D/u.test("\uD83D\uDC2A");   //false

//情况2
var s = "𠮷";
/^.$/.test(s);     //false, 通配符 . 不能匹配32位unicode
/^.$/u.test(s);     //true

//情况3
var s = "𠮷a";
/\u{63}/.test(s);     //false, 不能使用{}形式的 unicode, 被电脑认为 u 出现63次
/\u{63}/u.test(s);     //false, 即使用了 u 也一样
//为了避免这种误解, 合理使用 u 修饰符

//情况3
var s = "𠮷";
/^\S$/.test(s);     //false, \S 无法监测到32位 unicode
/^\S$/u.test(s);     //true
```

当然这个里面还是有坑的, 比如下面这个:
```js
var k1 = "\u004B";
var k2 = "\u212A";

/[a-z]/i.test(k1);     //true
/[a-z]/iu.test(k1);     //true
/[a-z]/i.test(k2);     //false
/[a-z]/iu.test(k2);     //true
```
第三个输出居然是 false？根本没有32位 unicode 呀, 干嘛用u修饰？ 其实 `"\u004B"` 和 `"\u212A"` 都是 `K`(前一个是真 K, 后一个是假的), 博主也不知道为啥会这样！

y 修饰符

和全局修饰符(g)类似, 执行全局匹配, 但 g 只有剩余位置存在匹配即可, y 则必须中上次匹配的下一个字母开始。
```js
var s = 'aaa_aa_a';
var r1 = /a+/g;
var r2 = /a+/y;

r1.exec(s);  //["aaa"], 剩余字符是 '_aa_a'
r2.exec(s);  //["aaa"], 剩余字符是 '_aa_a'

r1.exec(s);  //["aa"], 限定起始点, 得到 aa, 剩余字符是 '_a'
r2.exec(s);  //null, 必须从剩余字符的第一个就匹配到, 相当于 /^a+/g, 由于匹配不到返回 null, 同时将 lastIndex 置 0

r1.exec(s);  //["a"], 剩余字符是 ''
r2.exec(s);  //["aaa"], 剩余字符是 '_aa_a'
```
y修饰符就是为了让起始位置匹配 ^ 在全局有效才设计使用的。

与此同时, es6 中的 `RegExp.prototype` 也加入了一些新的属性:
```js
var reg = /^abc/uy;
reg.sticky;   //true, 判断reg是否是粘连模式
reg.unicode;  //true, 判断reg是否是unicode模式
reg.flags;    //'uy', 得到其全部修饰符构成的字符串
reg.source;   //'^abc' 得到正则表达式字符串
var str="^abc."
RegExp.escape(str);  //\^abc\. 得到正则表达式的字符串转译写法
```

## 函数的扩展

### 参数默认值

ES5中设置默认值非常不方便, 我们这样写:
```js
function fun(a){
  a = a || 2;
  console.log(a);
}
fun();   //2
fun(0);  //2
fun(1);  //1
```
以上写法, 如果传入了参数, 但这个参数对应值的布尔型是 false, 就不起作用了。当然你也可以判断 `arguments.length` 是否为0来避免这个问题, 但每个函数这样写就太啰嗦了, 尤其参数比较多的时候。在 ES6 中我们可以直接写在参数表中, 如果实际调用传递了参数, 就用这个传过来的参数, 否则用默认参数。像这样:
```js
function fun(a=2){
  console.log(a);
}
fun();   //2
fun(0);  //0
fun(1);  //1
```
其实函数默认参数这一点最强大的地方在于可以和解构赋值结合使用:
```js
//参数传递
function f([x, y, z=4]){
  return [x+1, y+2, z+3];
}
var [a, b, c] = f([1, 2]);  //a=2, b=4, c=7
[[1, 2], [3, 4]].map(([a, b]) => a + b);   //返回 [3, 7]
```
通过上面这个例子不难发现, 不仅可以用解构的方法设置初始值, 还可以进行参数传递。当然, 这里也可以是对象形式的解构赋值。如果传入的参数无法解构, 就会报错:
```js
function fun1({a=1, b=5, c='A'}){
  console.log(c + (a + b));
}
fun1({});   //'A6'
fun1();     //TypeError, 因为无法解构
//但这样设计函数对使用函数的码农很不友好
//所以, 技巧:
function fun2({a=1, b=5, c='A'}={}){
  console.log(c + (a + b));
}
fun2();     //'A6'
```
注意, 其实还有一种方法, 但不如这个好, 我们比较如下:
```js
//fun1 比 fun2 好, 不会产生以外的 undefined
function fun1({a=1, b=5, c='A'}={}){
  console.log(c + (a + b));
}
function fun2({a, b, c}={a: 1, b: 5, c: 'A'}){
  console.log(c + (a + b));
}
//传了参数, 但没传全部参数就会出问题
fun1({a: 8});     //'A13'
fun2({a: 8});     //NaN
```

不过这里强烈建议, 将具有默认值的参数排在参数列表的后面。否则调用时依然需要传参:
```js
function f1(a=1, b){
  console.log(a + b);
}
function f2(a, b=1){
  console.log(a + b);
}
f2(2);   //3
f1(, 2);  //报错
f1(undefined, 2);  //3, 注意这里不能用 null 触发默认值
```

- 函数的 length 属性
这个属性ES6 之前就是存在的, 记得length表示预计传入的形参个数, 也就是没有默认值的形参个数:
```js
(function(a){}).length;   //1
(function(a = 5){}).length;   //0
(function(a, b, c=5){}).length;   //2
(function(...args){}).length;   //0, rest参数也不计入 length
```

## rest 参数

rest 参数形式为 `...变量名`, 它会将对应的全部实际传递的变量放入数组中, 可以用它来替代 arguments:
```js
function f(...val){
  console.log(val.join());
}
f(1, 2);      //[1, 2]
f(1, 2, 3, 4);  //[1, 2, 3, 4]

function g(a, ...val){
  console.log(val.join());
}
g(1, 2);      //[2]
g(1, 2, 3, 4);  //[2, 3, 4]
```
否则这个函数 g 你的这样定义函数, 比较麻烦:
```js
function g(a){
  console.log([].slice.call(arguments, 1).join());
}
```

这里需要注意2点:

- rest参数必须是函数的最后一个参数, 它的后面不能再定义参数, 否则会报错。
- rest参数不计入函数的 length 属性中

建议：

- 所有配置项都应该集中在一个对象，放在最后一个参数，布尔值不可以直接作为参数。这样方便调用者以任何顺序传递参数。
- 不要在函数体内使用arguments变量，使用rest运算符（...）代替。因为rest运算符显式表明你想要获取参数，而且arguments是一个类似数组的对象，而rest运算符可以提供一个真正的数组。
- 使用默认值语法设置函数参数的默认值。

### 扩展运算符

扩展运算符类似 rest运算符的逆运算, 用 `...` 表示, 放在一个(类)数组前, 将该数组展开成独立的元素序列:
```js
console.log(1, ...[2, 3, 4], 5);  //输出1, 2, 3, 4, 5
```

扩展运算符的用处很多:
- 可以用于快速改变类数组对象为数组对象, 也是用于其他可遍历对象:
```js
[...document.querySelectorAll('li')];   //[<li>, <li>, <li>];
```

- 结合 rest 参数使函数事半功倍:
```js
function push(arr, ...val){
  return arr.push(...val);      //调用函数时, 将数组变为序列
}
```

- 替代 apply 写法
```js
var arr = [1, 2, 3];
var max = Math.max(...arr);   //3

var arr2 = [4, 5, 6];
arr.push(...arr2);     //[1, 2, 3, 4, 5, 6]

new Date(...[2013, 1, 1]);   //ri Feb 01 2013 00: 00: 00 GMT+0800 (CST)
```

- 连接, 合并数组
```js
var more = [4, 5];
var arr = [1, 2, 3, ...more];    //[1, 2, 3, 4, 5]

var a1 = [1, 2];
var a2 = [3, 4];
var a3 = [5, 6];
var a = [...a1, ...a2, ...a3];     //[1, 2, 3, 4, 5, 6]
```

- 解构赋值
```js
var a = [1, 2, 3, 4, 5];
var [a1, ...more] = a;      //a1 = 1, more = [2, 3, 4, 5]
//注意, 扩展运算符必须放在解构赋值的结尾, 否则报错
```

- 字符串拆分
```js
var str = "hello";
var alpha = [...str];    //alpha = ['h', 'e', 'l', 'l', 'o']

[...'x\uD83D\uDE80y'].length;   //3, 正确处理32位 unicode 字符

```

建议：使用扩展运算符(...)拷贝数组。

### name 属性

name 属性返回函数的名字, 对于匿名函数返回空字符串。不过对于表达式法定义的函数, ES5 和 ES6有差别:
```js
var fun = function(){}
fun.name;     //ES5: "", ES6: "fun"

(function(){}).name;   //""
```

对于有2个名字的函数, 返回后者, ES5 和 ES6没有差别:
```js
var fun  = function baz(){}
fun.name;        //baz
```

对于 Function 构造函数得到的函数, 返回 `anonymous`:
```js
new Function("fun").name;    //"anonymous"
new Function().name;    //"anonymous"
(new Function).name;    //"anonymous"
```

对于 bind 返回的函数, 加上 `bound ` 前缀
```js
function f(){}
f.bind({}).name;   //"bound f"

(function(){}).bind({}).name;    //"bound "

(new Function).bind({}).name;    //"bound anonymous"
```

### 箭头函数

箭头函数的形式如下:
```js
var fun = (参数列表) => {函数体};
```
如果只有一个参数(且不指定默认值), 参数列表的圆括号可以省略; (如果没有参数, 圆括号不能省略)
如果只有一个 return 语句, 那么函数体的花括号也可以省略, 同时省略 return 关键字。
```js
var fun = value => value + 1;
//等同于
var fun = function(value){
  return value + 1;
}
```
```js
var fun = () => 5;
//等同于
var fun = function(){
  return 5;
}
```
如果箭头函数的参数或返回值有对象, 应该用 `()` 括起来:
```js
var fun = n => ({name: n});
var fun = ({num1=1, num2=3}={}) => num1 + num2;
```

看完之前的部分, 箭头函数应该不陌生了:
```js
var warp = (...val) => val;
var arr1 = warp(2, 1, 3);              //[2, 1, 3]
var arr2 = arr1.map(x => x * x);     //[4, 1, 9]
arr2.sort((a, b) => a - b);          //[1, 4, 9]
```

使用箭头函数应注意以下几点:
- 不可以将函数当做构造函数调用, 即不能使用 new 命令;
- 不可以在箭头函数中使用 yield 返回值, 所以不能用过 Generator 函数;
- 函数体内不存在 arguments 参数;
- 函数体内部不构成独立的作用域, 内部的 this 和定义时候的上下文一致; 但可以通过 call, apply, bind 改变函数中的 this。关于作用域, 集中在ES6函数扩展的最后讨论。

举几个箭头函数的实例:
实例1: 实现功能如: `insert(2).into([1, 3]).after(1)`或`insert(2).into([1, 3]).before(3)`这样的函数:
```js
var insert = value => ({
  into: arr => ({
    before: val => {
      arr.splice(arr.indexOf(val), 0, value);
      return arr;
    },
    after: val => {
      arr.splice(arr.indexOf(val) + 1, 0, value);
      return arr;
    }
  })
});
console.log(insert(2).into([1, 3]).after(1));
console.log(insert(2).into([1, 3]).before(3));
```

实例2: 构建一个管道(前一个函数的输出是后一个函数的输入):
```js
var pipe = (...funcs) => (init_val) => funcs.reduce((a, b) => b(a), init_val);

//实现 2 的 (3+2) 次方
var plus = a => a + 2;
pipe(plus, Math.pow.bind(null, 2))(3);         //32
```

实例3: 实现 𝜆 演算
```js
//fix = 𝜆f.(𝜆x.f(𝜆v.x(x)(v)))(𝜆x.f(𝜆v.x(x)(v)))
var fix = f => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)));
```

建议：箭头函数取代 Function.prototype.bind，不应再用 self / _this / that 绑定 this。其次，简单的、不会复用的函数，建议采用箭头函数。如果函数体较为复杂，行数较多，还是应该采用传统的函数写法。

这里需要强调，以下情况不能使用箭头函数：

1. 定义字面量方法
```js
let calculator = {
  array: [1, 2, 3],
  sum: () => {
    return this.array.reduce((result, item) => result + item);     //这里的 this 成了 window
  }
};
calculator.sum();    //"TypeError: Cannot read property 'reduce' of undefined"
```
2. 定义原型方法
```js
function Cat(name) {
    this.name = name;
}
Cat.prototype.sayCatName = () => {
    return this.name;           //和上一个问题一样：这里的 this 成了 window
};
let cat = new Cat('Mew');
cat.sayCatName();               //undefined
```
3. 绑定事件
```js
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
    this.innerHTML = 'Clicked button';        //这里的 this 本应该是 button, 但不幸的成了 window
});
```
4. 定义构造函数
```js
let Message = (text) => {
    this.text = text;
};
let helloMessage = new Message('Hello World!');         //TypeError: Message is not a constructor
```
5. 不要为了追求代码的简短丧失可读性
```js
let multiply = (a, b) => b === undefined ? b => a * b : a * b;    //这个太难读了，太费时间
let double = multiply(2);
double(3);      //6
multiply(2, 3); //6
```
### 函数绑定

ES7 中提出了函数绑定运算, 免去我们使用 call, bind, apply 的各种不方便, 形式如下:
```cpp
objName::funcName
```
以下几组语句两两等同
```js
var newFunc = obj::func;
//相当于
var newFunc = func.bind(obj);

var result = obj::func(...arguments);
//相当于
var result = func.apply(obj, arguments);
```

如果 `::` 左边的对象原本就是右边方法中的 this, 左边可以省略
```js
var fun = obj::obj.func;
//相当于
var fun = ::obj.func;
//相当于
var fun = obj.func.bind(obj);
```

`::` 运算返回的还是对象, 可以进行链式调用:
```js
$('.my-class')::find('p')::text("new text");
//相当于
$('.my-class').find('p').text("new text");
```

### 尾调用优化

尾调用是函数式编程的概念, 指在函数最后调用另一个函数。
```js
//是尾调用
function a(){
  return g();
}
function b(p){
  if(p>0){
    return m();
  }
  return n();
}
function c(){
  return c();
}

//以下不是尾调用
function d(){
  var b1 = g();
  return b1;
}
function e(){
  g();
}
function f(){
  return g() + 1;
}
```

尾调用的一个显著特点就是, 我们可以将函数尾部调用的函数放在该函数外面(后面), 而不改变程序实现结果。这样可以减少函数调用栈的开销。
这样的优化在 ES6 的严格模式中被强制实现了, 我们需要做的仅仅是在使用时候利用好这个优化特性, 比如下面这个阶乘函数:
```js
function factorial(n){
  if(n <= 1) return 1;
  return n * factorial(n - 1);
}
factorial(5);     //120
```
这个函数计算 n 的阶乘, 就要在内存保留 n 个函数调用记录, 空间复杂度 O(n), 如果 n 很大可能会溢出。所以进行优化如下:
```js
"use strict";
function factorial(n, result = 1){
  if(n <= 1) return result;
  return factorial(n - 1, n * result);
}
factorial(5);     //120
```
当然也可以使用柯里化:
```js
var factorial = (function factor(result, n){
  if(n <= 1) return result;
  return factor(n * result, n - 1);
}).bind(null, 1);
factorial(5);     //120
```

### 函数的尾逗号

这个仅仅是一个提案: 为了更好地进行版本控制, 在函数参数尾部加一个逗号, 表示该函数日后会被修改, 便于版本控制器跟踪。目前并未实现。

### 作用域

这里仅仅讨论 ES6 中的变量作用域。除了 let 和 const 定义的的变量具有块级作用域以外, `var` 和 `function` 依旧遵守词法作用域, 词法作用域可以参考博主的另一篇文章[javascript函数、作用域链与闭包](http: //blog.csdn.net/faremax/article/details/53201809)

首先看一个例子:
```js
var x = 1;
function f(x, y=x){
  console.log(y);
}
f(2);    //2
```
这个例子输出了2, 因为 y 在初始化的时候, 函数内部的 x 已经定义并完成赋值了, 所以, `y = x` 中的 `x` 已经是函数的局部变量 x 了, 而不是全局的 x。当然, 如果局部 x 变量在 y 声明之后声明就没问题了。
```js
var x = 1;
function f(y=x){
  let x = 2
  console.log(y);
}
f();    //1
```

那如果函数的默认参数是函数呢？烧脑的要来了:
```js
var foo = "outer";
function f(x){
  return foo;
}
function fun(foo, func = f){
  console.log(func());
}
fun("inner");   //"outer"
```
如果基础好, 那就根本谈不上不烧脑。因为, 函数中的作用域取决于函数定义的地方, 函数中的 this 取决于函数调用的方式。(敲黑板)
但如果这样写, 就是 inner 了, 因为func默认函数定义的时候 fun内的 foo 已经存在了。
```js
var foo = "outer";
function fun(foo, func = function(x){
  return foo;
}){
  console.log(func());
}
fun("inner");   //"inner"
```

技巧: 利用默认值保证必需的参数被传入, 而减少对参数存在性的验证:
```js
function throwErr(){
  throw new Error("Missing Parameter");
}
function fun(necessary = throwErr()){
  //...如果参数necessary没有收到就使用参数, 从而执行函数抛出错误
}

//当然也可以这样表示一个参数是可选的
function fun(optional = undefined){
  //...
}
```

箭头函数的作用域和定义时的上下文一致, 但可以通过调用方式改变:
```js
window && (window.name = "global") || (global.name = "global");
var o = {
  name: 'obj-o',
  foo: function (){
    setTimeout(() => {console.log(this.name); }, 500);
  }
}

var p = {
  name: 'obj-p',
  foo: function (){
    setTimeout(function(){console.log(this.name); }, 1000);
  }
}

o.foo();    //"obj-o"
p.foo();    //"global"

var temp = {
  name: 'obj-temp'
}

o.foo.bind(temp)();     //"obj-temp"
o.foo.call(temp);     //"obj-temp"
o.foo.apply(temp);     //"obj-temp"

p.foo.bind(temp)();     //"global"
p.foo.call(temp);     //"global"
p.foo.apply(temp);     //"global"
```

## 对象的扩展

- 允许使用已有对象赋值定义对象字面量, 并且只写变量名即可
```js
var name = "Bob";
var getName = function(){console.log(this.name); };

var person = {name, getName};
//相当于
//var person = {
//name: "Bob",
//getName: function(){console.log(this.name); }
//}
person.getName();   //"Bob"
```

- 可以像定义存取器那样定义方法
```js
var o = {
  _age: 10,
  _score: 60,
  age(num){
    if(num > 0) {
      this._age = num;
      return this;
    }
    return this._age;
  },
  get score(){
    return this._score;
  }
};

console.log(o.age());    //10
o.age(15);
console.log(o.age());    //15
console.log(o.score);    //60
o.score = 100;           //TypeError
```
注意, 以下代码是等同的:
```js
var obj = {
  class () {}       //并不会因为 class 是关键字而解析错误
};
//等价于
var obj = {
  'class': function() {}
};
```
如果一个方法是 Generator 函数, 需要在前面加 `*`:
```js
var obj = {
  time: 1,
  *gen(){
    yield "hello " + time;
    time++;
  }
}
```

- 属性名表达式
js 本来可以这样 `obj['k'+'ey']` 访问一个对象属性, 现在也可以这样定义属性了:
```js
var key1 = "name";
var key2 = "age";

var o = {
  [key1]: "Bob",
  [key2]: 18,
  ['first' + key1]: "Ellen"
};
o.name;    //"Bob"
o.age;     //18
o.firstname;   //"Ellen"
```
注意: 该方法不能和上一小节使用已有标识符定义对象字面量的方法混合使用, 否则会报错;
```js
//错误用法
var foo = 'bar';
var bar = 'abc';
var baz = {[foo]};  //报错
```

建议：对象的属性和方法，尽量采用简洁表达法，这样易于描述和书写。

- 方法的 name 属性
函数有 name 属性, 方法也就有 name 属性。一般方法 name 返回函数名(不包括对象名), 对于存取器方法, 没有 name 属性:
```js
var o = {
  _age: 10,
  _score: 60,
  _name: "Bob",
  _firstname: "Ellen",
  set age(num){
    if(num > 0) {
      this._age = num;
      return this;
    }
  },
  get age(){
    return this._age;
  },
  get score(){
    return this._score;
  },
  name(n){
    if(!n) return this._name + ' ' + this._firstname;
    this._name = n;
    return this;
  },
  set firstname(n){
    if(n) this._firstname = n;
    return this;
  }
};
console.log(o.name.name);      //"name"
console.log(o.age.name);       //undefined
console.log(o.score.name);     //undefined
console.log(o.firstname);      //undefined, 所以 set 函数更不会有 name 属性
```
如果对象的方法是个 symbol, name 属性为空字符串 `""` :
```js
var sym1 = new Symbol("description of sym1");
var sym2 = new Symbol();
var o = {
  [sym1](){},
  [sym2](){},
};
o[sym1].name;    //""
o[sym2].name;    //""
```

- 静态方法
1. Object.is(a, b): 比较a, b两个值是否严格相等, 相当于 `===`, 但有一点不一样:
```js
-0 === +0;     //true
NaN === NaN;   //false

Object.is(-0, +0);     //false
Object.is(NaN, NaN);   //true
```
2. Object.assign(target, source1, source2, ...): 将每个 source 对象自身的可枚举属性复制到 target 对象上, 不包括原型链上的属性和不可枚举属性。只有有一个参数不是对象, 就会抛出 TypeError 错误。遇到同名属性, 排在后面的会覆盖前面的:
```js
var target = {a: 1, b: 2};
var source1 = {a: 3, c: 3};
var source2 = {a: 2, d: 0};
Object.assign(target, source1, source2);
console.log(target);      //{a: 2, b: 2, c: 3, d: 0}
```
对于属性名是 symbol 的可枚举属性也会被复制:
```js
Object.assign({a: 'b'}, {[Symbol('c')]: 'd'});    //{a: "b", Symbol(c): "d"}
```
对于同名属性存在嵌套对象, 外层会被直接替换:
```js
Object.assign({a: {b: 'c', d: 'e'}}, {a: {b: 'hello'}});     //{a: {b: 'hello'}}
```
可以用 Object.assign处理数组, 但会视其为对象:
```js
Object.assign([1, 2, 3], [4, 5]);     //[4, 5, 3]
```
技巧: 为对象添加属性方法
```js
Object.assign(String.prototype, {
  newProperty: "value",
  newFunction: function(){}
})
```
技巧: 克隆对象
```js
Object.assign({}, origin);
```
技巧: 为对象添加属性方法
```js
Object.assign(target, ...source);
```
技巧: 为对象添加属性方法
```js
const DEFAULT_OPTION = {   //默认值
  a: 1,
  b: 2
};
function processContent(newOption){
  return Object.assign({}, DEFAULT_OPTION, newOption);
}
//设置属性应该是基本类型, 否则会因为深拷贝出问题
```

### 对象属性的可枚举性与遍历

以下6个操作会忽略不可枚举的属性

- for...in循环
- Object.keys()
- JSON.stringify()
- Object.assign()
- Reflect.enumerate()
- 扩展运算符 `...`

以下4个方法不忽略不可枚举属性

- Object.getOwnPropertyNames()
- Object.getOwnPropertySymbols()
- Reflect.ownKeys()

以上9个方法中, 只有2个会操作包含继承到的属性

- for...in循环
- Reflect.enumerate()

以上9个方法中, 只有1个方法可以获得 Symbol 属性

- Object.getOwnPropertySymbols()

除此之外需要强调的是 ES6 中, 所有 class 的原型方法都是不可枚举的:
```js
Object.getOwnPropertyDescriptor(class{foo(){}}.prototype, foo).enumerable;  //false
```

ES6 起, 有了7中遍历属性的方法:

- for...in: 循环遍历对象自身和继承到的可枚举属性, 不包括 Symbol 属性
- Object.keys(obj): 返回包含自身可枚举属性的属性名数组, 不包含 Symbol 属性
- Object.getOwnPropertyNames(obj): 同上, 但包括不可枚举属性
- Object.getOwnPropertySymbols(obj): 返回自身所有 Symbol 属性名的数组, 包括不可枚举属性
- Reflect.ownKey(obj): 返回自身所有属性名数组, 包括不可枚举属性和 Symbol 属性名
- Reflect.enumerate(): 返回一个 Iterator, 用来遍历对象自身及继承到的可枚举属性, 不包括 Symbol 属性; 和 for...in 一样
- for...of: 只能遍历具有 Iterator 接口的对象, 具体作用范围由 iterator 决定, 遍历没有 iterator 的对象会报错

以上方法除了 for...of 以外, 遍历顺序为:

- 首先遍历所有属性名为数字的属性, 按数字大小排序;
- 其次遍历所有属性名为字符串的属性, 按属性生成时间排序;
- 最后遍历所有属性名为 Symbol 的属性, 按属性生成时间排序;

### 对象的__proto__属性

这是个很老很老的属性, 在大家想期待下, ES6终于把它写进去了, 嗯？...是写进附录了。这个属性用来读写当前的对象的原型对象`obj.constructor.prototype`

从本质上来讲, `__proto__` 是定义在`Object.prototype` 上的一个存取器函数:
```js
function isObject(a){
  return Object(a) === a;
}
Object.defineProperty(Object.prototype, '__proto__', {
  get(){
    let _thisObj = Object(this);
    return Object.getPrototypeOf(_thisObj);
  },
  set(proto){
    if(this == null) throw new TypeError();
    if(!isObject(this) || !isObject(proto)) return undefined;
    let status = Object.setPrototypeOf(this, proto);
    if(! status) throw new TypeError();
  }
});
```

但是, 还是不建议使用这个东西, 毕竟看它这名字就是个内部属性, 因为它有了不加, 但不保证所以终端都能用, 所以ES6推荐用下面这两个属性:
```js
Object.setPrototypeOf(obj, newProto);   //写
Object.getPrototypeOf(obj);   //读
```
简单举一个例子:
```js
function Rectangle(){}
var rec = new Rectangle();
Object.getPrototypeOf(rec) === Rectangle.prototype;    //true
Object.setPrototypeOf(rec, Object.prototype);
Object.getPrototypeOf(rec) === Rectangle.prototype;    //false
```

当然如果你把一个对象的原型设置成了 null, 也是可以的, 只是, 它不具备任何你听说过的方法了:
```js
var o = Object.setPrototypeOf({}, null);
//等价于 var o = {'__proto__': null};
Object.getPrototypeOf(o);                //null
o.toString();                    //TypeError: o.toString is not a function
```

### 对象的扩展运算符

这是 ES7 的一个提案, babel可以使用器部分功能使用。

- rest参数
用法和数组中很类似, 这里不再过多赘述, 直接看几个例子吧:
```js
var {x, y, ...z}  = {x: 1, y: 2, a: 3, d: 4}; //x=1, y=2, z={a: 3, d: 4}
```
值得强调的是, 对象的rest参数形式执行的是浅拷贝, 赋值得到的是原对象的引用:
```js
let obj = {a: {b: 1}};
let {...x} = obj;
obj.a.b = 2;
console.log(x.a.b);    //2
```
此外 rest 不会复制不可枚举属性和继承自原型的属性:
```js
var p = {a: 0};
var o = {b: 2};
var o = Object.defineProperty(o, "foo", {
  value: 2,
  configurable: true,
  enumerable: false,
  writable: true
});
Object.setPrototypeOf(o, p);
var u = { ...p };
console.log(u);    //{b: 2}
```

- 扩展运算符
复制参数对象所有可遍历属性到当前对象中:
```js
var o1 = {a: 1, b: 2};
var n = { ...o1 };    //n={a: 1, b: 2};
//相当于
var n = Object.assign({}, o1);
```
可以用扩展运算符合并多个对象, 排后的属性会覆盖之前的属性:
```js
var source0 = {a: 1, b: 2};
var source1 = {a: 3, c: 3};
var source2 = {a: 2, d: 0};
Object.assign(target, source1, source2);
var target = {...source0, ...source1, ...source2};
console.log(target);      //{a: 2, b: 2, c: 3, d: 0}
```
注意一点: 如果扩展运算符的参数对象有 get 方法, 该方法会被执行:
```js
var a = {o: 1, p: 2, m: 4};
var withoutError = {
  ...a,
  get x(){
    throw new Error();
  }
};           //不报错
var withError = {
  ...a,
  ...{get x(){
    throw new Error();
  }}
};           //报错
```
如果扩展对象是 null 或 undefined, 会被忽略, 不报错
```js
var o = { ...null, ...undefined};    //不报错
console.log(o);    //{}
```

## Symbol

### Symbol基本类型
Symbol 是一种解决命名冲突的工具。试想我们以前定义一个对象方法的时候总是要检查是否已存在同名变量:
```js
if(String && String.prototype && String.prototype.getCodeWith){
  String.prototype.getCodeWith = function(){};
}
```
可是这样写, 即便已存在同名方法, 但他们实现的功能不一定一样, 而且函数的接口也不一定适合自己。这样我们就不得不再给自己的函数起个其他的名字, 可以万一又存在呢？

于是引入了 Symol, 用来产生一个全局唯一的标识符, 你可以放心的使用它。
它接受一个字符串参数, 作为该标识符的描述:
```js
var sym = Symbol("Discription");
var temp = Symbol("Discription");
console.log(sym);             //Symbol(Discription)
console.log(sym.valueOf());   //Symbol(Discription)
console.log(sym.toString());  //"Symbol(Discription)""
console.log(sym == temp);     //false
```

描述符是用来帮助开发人员区别不同是 symbol, 不具备其他意义, 所以 symbol 值只有`toString()`和`valueOf()` 方法。
Symbol 作为一个基本类型存在于 js 中。这样, js 就有了6个基本类型: `null`, `undefined`, `Boolean`, `Number`, `String`, `Symbol` 和1个复杂类型: `Object`
使用 Symbol 需要注意以下几点:
- Symbol 和 null, undefined 一样不具有构造函数, 不能用 new 调用。
- Symbol 值不能转为数字, 所以不能参与任何算术, 逻辑运算
- Symbol 虽然有 toString() 但 toString 得到的不是字符串, 所以不能用于字符串链接, 不能用于模板字符串
- Symbol 可以转换为 Boolean, 用在条件语句中, 但所有 Symbol 都是逻辑 true
- Symbol 作为属性名时, 该属性是公开的, 不是私有的

### Symbol用作属性名

这个应该不陌生了, 和普通标识符用法类似, 只是不能使用`.`访问和定义, 必须使用`[]`:
```js
var sym = Symbol("abc");
var fun = Symbol("getSym");

var a = {};
a[sym] = 1;

var b = {
  [sym]: 1,
  [fun](){
    console.log(this[sym]);
  }
};

var c = Object.defineProperty({}, sym, {value: 1});

a[sym];   //1
b[sym];   //1
c[sym];   //1
b[fun]();  //1
```

当然也可以定义一些常量, 就像英语中 Symbol 代表一种象征, 一个符号:
```js
var log = {
  DEBUG: Symbol('debug'),
  ERROR: Symbol('error'),
  WARNING: Symbol('warning'),
}
```
需要注意, Symbol 属性只有`Object.getOwnPropertySymbols(obj)` 和 `Reflect.ownKey(obj)` 可以遍历到:
- Object.getOwnPropertySymbols(obj): 返回自身所有 Symbol 属性名的数组, 包括不可枚举属性
- Reflect.ownKey(obj): 返回自身所有属性名数组, 包括不可枚举属性和 Symbol 属性名
```js
var sym = Symbol("pro");
var o = {
  a: 1,
  b: 2,
  [sym]: 3
}
Object.getOwnPropertySymbols(o);     //[Symbol(pro)]
Reflect.ownKeys(o);                  //["a", "b", Symbol(pro)]
```
我们可以利用这个方法, 构造一些非私有的内部变量:
```js
var size = Symbol('size');
class Collection{
  constructor(){
    this[size] = 0;
  }
  add(num){
    this[this[size]] = item;
    this[size]++;
  }
  static sizeOf(instance){
    return instance[size];
  }
}
var x = new Collection();
console.log(Collection.sizeOf(x));     //0
x.add("foo");
console.log(Collection.sizeOf(x));     //1

console.log(Object.keys(x));     //['0']
console.log(Object.getOwnPropertyNames(x));   //['0']
console.log(Object.getOwnPropertySymbols(x));   //[Symbol(size)]
```

### Symbol的静态方法

- Symbol.for("string"): 登记并重用一个 symbol 值
```js
Symbol.for("aa") === Symbol.for("aa");    //true
Symbol("aa") === Symbol("aa");            //false
```

- Symbol.keyFor(symbol): 返回一个已登记的 Symbol 描述, 未登记的 Symbol 返回 undefined
```js
var s1 = Symbol.for("aa");
var s2 = Symbol("aa");
Symbol.keyFor(s1);    //"aa"
Symbol.keyFor(s2);    //undefined
```
注意 Symbol 的登记是全局的:
```js
iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);
iframe.contentWindow.Symbol.for("aa") === Symbol.for("aa");    //true
```

### 内置的 Symbol 值

ES6 提供了12个内置的 Symbol 值, 这12个值, 都是对象的, 且都不可枚举、不可配置、不可修改。因为它们具有其特殊意义:

1. Symbol.hasInstance: 指向一个内部方法。判断对象是否某个构造函数的实例, instanceof 运算符会调用它
2. Symbol.isConcatSpreadable: 是一个数组对象属性。如果为 false 该属性在 concat 过程不会被展开。数组对象该属性默认值为 true, 类数组对象该属性默认值为 false
```js
var arr = [3, 4];
[1, 2].concat(arr);   //[1, 2, 3, 4]
arr[Symbol.isConcatSpreadable] = false;
[1, 2].concat(arr);   //[1, 2, [3, 4]]
```
<!--对于一个类而言, 该属性必须返回 boolean 类型
```js
class A1 extends Array{
  [Symbol.isConcatSpreadable](){
    return true;
  }
}
class A2 extends Array{
  [Symbol.isConcatSpreadable](){
    return false;
  }
}
let a1 = new A1();
a1[0] = 3;
a1[1] = 4;
let a2 = new A2();
a2[0] = 5;
a2[1] = 6;
[1, 2].concat(a1).concat(a2);  //
```
-->
3. Symbol.species: 指向一个方法。将对象作为构造函数调用时, 系统内部会调用这个方法。即, 当 this.constructor[Symbol.species]存在时, 以此为构造函数构建对象。
4. Symbol.match: 指向一个函数。当执行 `str.match(obj)` 的时候, 如果 obj 存在该属性, 调用该方法并返回该方法的返回值
```js
String.prototype.match(searchValue);
//相当于
SearchValue[Symbol.match](this);
//实例
class myMatch{
  constructor(str){
    this.content = str;
  }
  [Symbol.match](str){
    return this.content.indexOf(str);
  }
}
'e'.match(new myMatch("Hello"));    //1
```

5. Symbol.replace: 指向一个函数。和上一个方法类似的, 当执行 `str.replace(obj, replaceValue)` 的时候, 如果 obj 存在该属性, 调用该方法并返回该方法的返回值
```js
String.prototype.replace(searchValue, replaceValue);
//相当于
SearchValue[Symbol.replace](this, replaceValue);
```
6. Symbol.search: 指向一个函数。和上一个方法类似的, 当执行 `str.search(obj)` 的时候, 如果 obj 存在该属性, 调用该方法并返回该方法的返回值
```js
String.prototype.search(searchValue);
//相当于
SearchValue[Symbol.search](this);
```
7. Symbol.split: 指向一个函数。和上一个方法类似的, 当执行 `str.split(obj, limit)` 的时候, 如果 obj 存在该属性, 调用该方法并返回该方法的返回值
```js
String.prototype.split(seperator, limit);
//相当于
seperator[Symbol.split](this, limit);
```
8. Symbol.iterator: 指向默认的遍历器方法。对象在 for...of 中默认调用该方法。
```js
class Collector{
  constructor(...vals){
    this.nums = vals;
  }
  *[Symbol.iterator](){
    let i = this.nums.length;
    while(i){
      i--;
      yield this.nums[i];
    }
  }
}
var collector = new Collector(1, 2, 3, 4, 5);
for(let value of collector){
  console.log(value);        //依次输出 5 4 3 2 1
}
```
9. Symbol.toPrimitive: 指向一个方法。对象被转为原始类型值时会调用该方法。该方法介绍一个字符串参数, 可选参数:

- "number": 此时转换成数值, 应返回数值类型
- "string": 此时转换成字符串, 应返回字符串类型
- "default": 此时转换成数值或字符串, 应返回数值或字符串类型

```js
var obj = {
  [Symbol.toPrimitive](hint){
    switch(hint){
      case 'number': return 1234;
      case 'string': return 'hello';
      case 'default': return 'default';
      default: throw new Error();
    }
  }
};
console.log(obj.toString());     //[object Object]
console.log(obj.valueOf());      //{
console.log(2 * obj);            //2468
console.log(2 + obj);            //2default
console.log(obj === "hello");    //false
console.log(String(obj));        //hello
```
10. Symbol.unscopables: 该读取器指向一个对象。指定了在使用 with语句 时, 那些属性被 with 环境排除(无法访问)
```js
//例1
console.log(Array.prototype[Symbol.unscopables]);    //输出如下, 数组对象在 with 中不能访问这些属性方法
//{
//copyWithin: true,
//entries: true,
//fill: true,
//find: true,
//findIndex: true,
//includes: true,
//keys: true
//}
```
```js
//例2
//没有 unscopables 时
class MyClass{
  foo(){return 1}
}
var foo = () => 2;
with(MyClass.prototype){
  foo();    //1
}

//有 unscopable 时
var foo = () => 2;
class MyClass{
  foo(){return 1; }
  get [Symbol.unscopables](){
    return {foo: true};
  }
}
with(MyClass.prototype){
  foo();    //2
}
```
11. Symbol.toStringTag: 指向一个方法。该方法指向函数名是对象 toString 返回值 `[object Array]` 中 `Array` 部分。
```js
var b = {
  [Symbol.toStringTag]: "Hello"
};
console.log(b.toString());    //"[object Hello]"
```
ES6 新增的 Symbol.toStringTag 如下:

- JSON["Symbol.toStringTag"]: 'JSON'
- Math["Symbol.toStringTag"]: 'Math'
- Module对象 M["Symbol.toStringTag"]: 'Module'
- ArrayBuffer.prototype["Symbol.toStringTag"]: 'ArrayBuffer'
- DataView.prototype["Symbol.toStringTag"]: 'DataView'
- Map.prototype["Symbol.toStringTag"]: 'Map'
- Promise.prototype["Symbol.toStringTag"]: 'Promise'
- Set.prototype["Symbol.toStringTag"]: 'Set'
- %TypedArray%.prototype["Symbol.toStringTag"]: 'Uint8Array'等9种
- WeakMap.prototype["Symbol.toStringTag"]: 'WeakMap'
- WeakSet.prototype["Symbol.toStringTag"]: 'WeakSet'
- %MapIteratorPrototype%["Symbol.toStringTag"]: 'Map Iterator'
- %SetIteratorPrototype%["Symbol.toStringTag"]: 'Set Iterator'
- %StringIteratorPrototype%["Symbol.toStringTag"]: 'String Iterator'
- Symbol.prototype["Symbol.toStringTag"]: 'Symbol'
- Generator.prototype["Symbol.toStringTag"]: 'Generator'
- GeneratorFunction.prototype["Symbol.toStringTag"]: 'GeneratorFunction'

## Reflect 对象

Reflect 对象有一下作用:
1. 将 Object对象的一些明显属于语言层面的方法部署在 Reflect 上
2. 修改某些 Object 对象的方法使其更合理。比如 `Object.defineProperty` 遇到无法定义属性时会抛出错误, 而 `Reflect.defineProperty` 会返回 false
3. 把所以 object 的操作都替换成函数行为, 比如用 `Reflect.has(obj, name)` 替换 `name in obj`
4. 保证只要是 Proxy 有的方法就一定可以在 Reflect 上找到相同的方法, 这样可以在实现 proxy 时方便的完成默认行为。换言之, 无论 proxy 怎么修改默认行为, 你总可以在 Reflect 上找到真正默认的行为

代理在添加额外的功能时, 利用 Reflect 保证了原始功能的实现。举个例子:
```js
var loggedObj = new Proxy({}, {
  get(target, propKey){
    console.log(`getting ${target}.${propKey}`);  //当然你最好把操作记录到一个 log 中
    return Reflect.get(target, propKey);
  }
});
```

Reflect有以下方法:

- Reflect.getOwnPropertyDescriptor(target, propKey)
等同于 `ObjectgetOwnPropertyDescriptor(target, propKey)`
- Reflect.defineProperty(target, propKey, desc)
等同于 `Object.defineProperty(target, propKey, desc)`
- Reflect.getOwnPropertyNames(target)
等同于 `Object.getOwnPropertyNames(target)`
- Reflect.getPrototypeOf(target)
等同于 `Object.getPrototypeOf(target)`
- Reflect.setPrototypeOf(target, proto)
等同于 `Object.setPrototypeOf(target, proto)`
- Reflect.deleteProperty(target, propKey)
等同于 `delete target.propKey`
- Reflect.enumerate(target)
等同于 `for ... in target`
- Reflect.freeze(target)
等同于 `Object.freeze(target)`
- Reflect.seal(target)
等同于 `Object.seal(target)`
- Reflect.preventExtensions(target)
等同于 `Object.preventExtensions(target)`
- Reflect.isFrozen(target)
等同于 `Object.isFrozen(target)`
- Reflect.isSealed(target)
等同于 `Object.isSealed(target)`
- Reflect.isExtensible(target)
等同于 `Object.isExtensible(target)`
- Reflect.has(target, propKey)
等同于 `propkey in object`
- Reflect.hasOwn(target, propKey)
等同于 `target.hasOwnProperty(propKey)`
- Reflect.ownKeys(target)
遍历得到target自身所有属性, 包括不可枚举属性, 不包括 Symbol 属性
- Reflect.get(target, propKey, receiver = target)
如果 propKey 是个读取器, 则读取器中的 this 绑定到 receiver
```js
var per = {
  bar: function(){console.log("per-bar")}
}
var obj = {
  get foo(){ this.bar(); },
  bar: function (){console.log("obj-bar")}
};
Reflect.get(obj, "foo", per);    //"per-bar"
```
- Reflect.set(target, propKey, value, receiver = target)
如果 propKey 是个读取器, 则读取器中的 this 绑定到 receiver
- Reflect.apply(target, thisArg, args)
等同于 `Function.prototype.apply.call(target, thisArg, args)` 即 `thisArg.target(args)`
- Reflect.construct(target, args)
等同于 `new target(...args)`

注意以上方法中, `Reflect.set()`, `Reflect.defineProperty()`, `Reflect.freeze()`, `Reflect.seal()`, `Reflect.preventExtensions()` 在成功时返回 true, 失败时返回 false。对应的 Object 方法失败时会抛出错误。

## Proxy 对象

Proxy 用来修改某些默认操作, 等同于在语言层面做出修改。所以属于一种元编程(meta programming), 即对编程语言进行编程。字面理解为Proxy代理了某些默认的操作。
其使用格式如下:
```js
var proxy = new Proxy(target, handler);
```
target是被代理的目标对象, handler也是个对象, 用来定制拦截行为, 内部定义每个被代理的行为。
注意:

- 如果希望这个代理有效, 需要在 proxy 对象上调用属性方法, 而不是在 target 上调用
- 如果指定 handler 为空对象, 那么得到对象和原对象一样
- 得到的 proxy 是 target 的引用, 如果没有代理, 在 proxy 上的修改和在 target 上的修改等同

看一个简单的实例
```js
var proxy = new Proxy({}, {
  get: function(target, key){
    return 35;
  }
});
console.log(proxy.time);    //35
console.log(proxy.name);    //35
console.log(proxy.title);    //35
//被代理的对象无论输入什么属性都返回35
```

实际上, proxy 对象也可以被继承:
```js
var proxy = new Proxy({}, {
  get: function(target, key){
    return 35;
  }
});
var obj = Object.create(proxy);
obj.time = 20;
console.log(obj.time);    //20
console.log(obj.name);    //35
```

感受一下它的威力:
```js
var obj = new Proxy({}, {
  get: function(target, key, receiver){
    console.log(`getting ${key} ...`);
    return Reflect.get(target, key, receiver);
  },
  set: function(target, key, value, receiver){
    console.log(`setting ${key} ...`);
    return Reflect.set(target, key, value, receiver);
  }
});

obj.count = 1;            //setting count ...
++obj.count;              //getting count ...
                          //setting count ...
console.log(obj.count);   //getting count ...
                          //2
```
可以看出来, handler对象中 get 方法表示属性的访问请求, set 方法表示属性的写入请求。
当然不仅仅 get 和 set, 我们可以定义以下拦截函数:

- get(target, propKey, receiver = target)
拦截对象的读取属性。当 target 对象设置了 propKey 属性的 get 函数时, receiver 绑定 get 函数的 this。返回值任意
- set(target, propKey, value, receiver = target)
拦截对象的写入属性。返回一个布尔值
- has(target, propKey)
拦截 propKey in proxy 操作符, 返回一个布尔值
- deleteProperty(target, propKey)
拦截 delete proxy[propKey] 操作符, 返回一个布尔值
- enumerate(target)
拦截 for(let i in proxy) 遍历器, 返回一个遍历器
- hasOwn(target, propKey)
拦截 proxy.hasOwnProperty('foo'), 返回一个布尔值
- ownKeys(target)
拦截 Object.getOwnPropertyNames(proxy), Object.getOwnPropertySymbols(proxy), Object.keys(proxy), 返回一个数组。该方法返回对象所有自身属性, 包括不可遍历属性, 不包括 Symbol属性, 但是`Object.keys(proxy)`不应该包括不可遍历属性
- getOwnPropertyDescriptor(target, propKey)
拦截 Object.getOwnPropertyDescriptor(proxy, propKey), 返回其属性描述符
- defineProperty(target, propKey, propDesc)
拦截 Object.defineProperty(proxy, propKey, propDesc), Object.defineProperties(proxy, propDesc), 返回一个布尔值
- preventExtensions(target)
拦截 Object.preventExtensions(proxy), 返回一个布尔值
- getPrototypeOf(target)
拦截 Object.getPrototypeOf(proxy), 返回一个对象
- isExtensible(target)
拦截 Object.isExtensible(proxy), 返回一个布尔值
- setPrototypeOf(target, proto)
拦截 Object.setPrototypeOf(proxy, proto), 返回一个布尔值
- apply(target, object, args)
拦截对 proxy 实例的函数操作, 包括 proxy(...args), proxy.call(object, ...args), proxy.apply(object, args)
- construct(target, args, proxy)
拦截用 new 调用 proxy 函数的操作, construct()返回的不是对象会报错

以下列举一些 Proxy 的实例

访问对象不存在的属性报错
```js
var obj = new Proxy({}, {
  get: function(target, key){
    if(key in target){
      return Reflect.get(target, key);
    } else {
      throw new ReferenceError(`"${key}" is not in object`);
    }
  }
});
obj.look = "picture";
console.log(obj.look);     //"picture"
console.log(obj.sleep);    //ReferenceError: "sleep" is not in object
```

数组索引为负时返回倒数位置的值
```js
var origin = [10, 20];
var arr = new Proxy(origin, {
  get(target, key){
    let index = parseInt(key);
    if(index < 0){
      index = target.length + index;
      if(index < 0) return undefined;
    }
    return Reflect.get(target, index);
  }
});
console.log(arr[0]);     //10
console.log(arr[1]);     //20
console.log(arr[2]);     //undefined
console.log(arr[-1]);    //20
console.log(arr[-4]);    //undefined
```

保护对象内以 "_" 开头的属性为私有属性:
```js
var o = {
  "_name": "Bob",
  "age": 13,
  "_fun": function(){
    console.log("_fun is called");
  }
};
var obj = new Proxy(o, {
  get(target, key){
    if(key.charAt(0) === '_'){
      return undefined;
    }
    return Reflect.get(target, key);
  },
  set(target, key, value){
    if(key.charAt(0) === '_'){
      throw new Error('Cannot define a property begin with "_"');
    }
    return  Reflect.set(target, key, value);
  },
  has(target, key){
    if(key.charAt(0) === '_'){
      return false;
    }
    return Reflect.has(target, key);
  },
  deleteProperty(target, key){
    if(key.charAt(0) === '_'){
      return false;
    } else {
      Reflect.deleteProperty(..arguments);
    }
  },
  apply(target, ctx, args){
    if(target.name.charAt(0) === '_'){
      throw new TypeError(`${target.name} is not defined`);
    } else {
      Reflect apply(...arguments);
    }
  },
  defineProperty(target, key, desc){
    if(key.charAt(0) === '_'){
      return new Error(`cannot define property begin with "_"`);
    } else {
      Reflect.defineProperty(..arguments);
    }
  },
  setPrototypeOf(target, proto){
    throw new TypeError(`Cannot change the proto of ${target}`);
  },
  construct(target, ctx, args){
    if(target.name.charAt(0) === '_'){
      throw new TypeError(`${target.name} is not defined`);
    } else {
      Reflect construct(...arguments);
    }
  }
});

console.log(obj.age);    //13
obj.age = 20;
console.log(obj.age);    //20
console.log(obj._name);  //undefined
obj._hobby = "Coding";   //Error: Cannot define a property begin with "_"
_name in key             //false
delete obj._name;
Object.defineProperty(obj, "_hobby", {
  value: "Coding"
});
Object.defineProperties(obj, {
  '_hobby': {
    value: "Coding"
  }
});
obj._fun();
var a = new obj._fun();
obj.__proto__ = {};     //Cannot define a property begin with "_"
Object.setPrototypeOf(obj, {})    //Cannot change the proto of obj
```

当然不是所有 proxy 代理都不可取消, 下面方法设置的代理是可以通过定义代理时返回的revoke函数取消:
```js
var a = {
  name: "Bob"
};
var {proxy, revoke} = Proxy.revocable(a, {
  get(target, key){
    return undefined;
  }
});
proxy.name;   //undefined;
revoke();
proxy.name;   //TypeError: Cannot perform 'get' on a proxy that has been revoked
```

## Set 与 Map

### Set

Set 是一种集合结构, 特征和数学中的一致, 具有以下特征:

- 同一个集合中不能有相同元素
- set 可以存放不同类型的数据

但使用过程中请注意以下几点:

- 存入 set 的数据不会进行类型转换, 即'5'和 5 是不一样的
- 内部采用严格相等比较元素, 但-0等于+0, NaN也等于NaN

定义聚合和定义其他数据结构一样, 其构造函数接受一个数组, 集合或类数组对象初始化:
```js
var set1 = new Set();
var set2 = new Set([1, 2, 3, 3, 4, 4, 5]);
console.log(set1);   //Set(0) {}
console.log(set2);   //Set(5) {1, 2, 3, 4, 5}
```

Set结构具有以下属性和方法, 由于和数组方法基本一致, 不细细列举

- size属性: 当前集合的元素数量, 相当于数组熟悉的length
- add()方法: 相当于数组的push()方法, 但只能接受一个参数
- delete()方法: 删除集合中的一个值
- has()方法: 判断数组的中是否含有某个值
- clear()方法: 清空当前数组
- keys()方法: 返回键名的遍历器, 和数组keys()方法一样
- values()方法: 返回值的遍历器, 和数组values()方法一样
- entires()方法: 返回键值对的遍历器, 和数组entires()方法一样
- forEach()方法: 使用回调函数遍历集合成员, 和数组forEach()方法一样
- map()方法: 相当于数组的map()方法
- filter()方法: 相当于数组的filter()方法

Set的默认遍历器遍历的是值:
```js
Set.prototype[Symbol.iterator] === Set.prototype.values;   //true
```

集合运算:

- 并集
```js
var a = new Set([1, 2, 3]);
var b = new Set([2, 4, 5]);
var union = new Set([...a, ...b]);    //[1, 2, 3, 4, 5]
```
- 交集
```js
var a = new Set([1, 2, 3]);
var b = new Set([2, 4, 5]);
var intersect = new Set([...a].filter(item => b.has(item)));  //[2]
```
- 差集
```js
var a = new Set([1, 2, 3]);
var b = new Set([2, 4, 5]);
var diffsect = new Set([...a].filter(item => !b.has(item)));  //[1, 3]
```
### WeakSet

WeakSet 和 Set类似, 但是具有以下区别:

- WeakSet 的元素只能是对象, 不能是别的类型
- WeakSet 的元素无法被引用, 其元素不具有别的引用时, GC 会立刻释放对象的内存资源, 因此 WeakSet 不能被遍历。

定义WeakSet和定义其他数据结构一样, 其构造函数接受一个数组, 集合或类数组对象初始化:
```js
var set1 = new WeakSet();
var set2 = new WeakSet([[1, 2], [3, 3], [4, 4, 5]]);
console.log(set1);   //WeakSet(0) {}
console.log(set2);   //WeakSet {(2) [1, 2], (2) [3, 3], (3) [4, 4, 5]}
```

WeakSet 没有 size 属性, 有如下3个方法:

- add()方法: 相当于数组的push()方法, 但只能接受一个参数
- delete()方法: 删除集合中的一个值
- has()方法: 判断数组的中是否含有某个值
- clear()方法: 清空当前数组
- keys()方法: 返回键名的遍历器, 和数组keys()方法一样, 用于 for...of 循环
- values()方法: 返回值的遍历器, 和数组values()方法一样, 用于 for...of 循环
- entires()方法: 返回键值对的遍历器, 和数组entires()方法一样, 用于 for...of 循环
- forEach()方法: 使用回调函数遍历集合成员, 和数组forEach()方法一样
- map()方法: 相当于数组的map()方法
- filter()方法: 相当于数组的filter()方法

WeakSet 不能遍历, 它的作用是临时存储DOM节点, 这样不必担心内存泄漏:
```js
//例
const foos = new WeakSet();
class Foo{
  constructor(){
    foos.add(this);
  }
  method(){
    if(!foos.has(this)){
      throw new TypeError(`"foo.prototype.method" is only called by object of Foo`);
    }
    console.log(`"Foo.prototype.method" has been called`);
  }
}
var obj = new Foo();
obj.method();          //Foo.prototype.method" has been called
obj.method.call({});   //typeError: "foo.prototype.method" is only called by object of Foo
```

### Map

js 中的对象是键值对的集合, 但是键只能是字符串其实并不方便。Map结构本质和对象一样, 只是键名可以使用各种类型的值。如果这么理解, 那么Map就是一种值-值对而不是键-值对, 这一点类似hash结构:
```js
var o = {name: "Bob"};
var map = new Map();
map.set(o, "hello");
console.log(map.get(o));   //"hello"
```

构造 Map 结构的构造函数接受数组, 对象等类型作为构造函数的参数:
```js
var map = new Map([["name", "Bob"], ["age", 12]]);
map.get("name");    //"Bob"
map.get("age");     //12
```

map具有如下属性和方法:

- size 属性: 返回 map 中元素的数量, 类似数组的 length
- set(key, value)方法: 向map中添加值-值对
- get(key)方法: 读取map中的值
- delete(key, value)方法: 删除map中的值-值对
- has(key)方法: 判断某个键名是否存在
- clear()方法: 清空当前 map 中所以数据
- keys()方法: 返回键名的遍历器, 和数组keys()方法类似, 用于 for...of 循环
- values()方法: 返回值的遍历器, 和数组values()方法类似, 用于 for...of 循环
- entires()方法: 返回值-值对的遍历器, 和数组entires()方法类似, 用于 for...of 循环
- forEach()方法: 使用回调函数遍历集合成员, 和数组forEach()方法类似

```js
var o = {name: "Bob"};
var map = new Map();
map.set(o, "hello");
console.log(map.get(o));   //"hello"
map.set(o, "world");       //重复定义, 覆盖之前的定义
console.log(map.get(o));   //"world"
console.log(map.get({name: "Bob"}));   //undefined, 不同的对象引用不认为是同一个对象
map.delete(o);             //删除对象属性 o
console.log(map.get(o));   //undefined
```

从上方的例子不难发现, 不同的对象属性对于 map 来说就是不同的, 不管内部的内容是否一致。这和对象的 === 比较是一样的道理, 带来的好处是我们不用担心和会 map 原有属性重名, 而直接向 map 添加对象属性即可。

注意 undefined, NaN和 null 也可以作为 map 的键名
```js
var map = new Map();
map.set(undefined, 1);
map.set(null, 2);
map.set(NaN, 3);
console.log(map.get(undefined));        //1
console.log(map.get(null));        //2
console.log(map.get(NaN));        //3
```

但使用过程中请注意以下几点:

- 存入 map 的数据不会进行类型转换, 即'5'和 5 是不一样的, {} 和 {}也是不一样的。
- 内部采用严格相等比较元素, 但-0等于+0, NaN也等于NaN。

map 的默认遍历器是 entries()
```js
Map.prototype[Symbol.iterator] === Map.prototype.entries;   //true
```

另外这里需要格外强调的是:

- Set中的 has 方法是判断**键值**是否存在的, 如 ` Set.prototype.has(value)`, `WeakSet.prototype.has(value)`
- Map中的 has 方法是判断**键名**是否存在的, 如 ` Map.prototype.has(key)`, `WeakMap.prototype.has(key)`, `Reflect.has(target, propertyKey)`

Map解构转换技巧:

- Map 转 Array
```js
var map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);
var keyArr = [...map.keys()];          //[1, 2, 3]
var valueArr = [...map.values()];      //['one', 'two', 'three']
var entriesArr = [...map.entries()];   //[[1, 'one'], [2, 'two'], [3, 'three']]
var arr = [...map];                    //[[1, 'one'], [2, 'two'], [3, 'three']]
```
- Map 转 Object(为防止不必要的错误, 直接丢弃不是字符串为键的属性)
```js
function map2arr(map){
  var o = {};
  for(let [key, value] of map.entries()){
    if(typeof key === 'string'){
      o[key] = value;
    }
  }
  return o;
}
var map = new Map([[1, 'one'], [2, 'two'], ['three', 3], ['four', 4]]);
map2arr(map);    //Object {three: 3, four: 4}
```
- Map 转 JSON
```js
var map = new Map([[1, 'one'], [2, 'two'], ['three', 3], ['four', 4]]);
JSON.stringify([...map]);    //"[[1, "one"], [2, "two"], ["three", 3], ["four", 4]]"
```

建议：只有模拟现实世界的实体对象时，才使用Object。如果只是需要`key: value`的数据结构，使用Map结构。因为Map有内建的遍历机制。

### WeakMap

WeakMap 和 map 类似, 不过它只接受对象作为键名, null除外。试想, 如果对象 o 是一个 map的属性, 如果该对象被释放了, 那这个 map 属性会导致内存溢出。解决这个问题就是使用 WeakMap:
```js
var o = {name: "Bob"};
var map = new WeakMap();
map.set(o, 12);
console.log(map.get(o));    //12
o = null;
console.log(map.get(o));    //undefined
```

WeakMap的对象属性名, 不计入 GC, 所以当对象不存在的时候, 这个 weakmap 中相应的键值对就被删除了。值得一提的是, 代码对于 map 可以得到一样的输出。那是因为最后一行相当于`console.log(map.get(null))`, 我们没有定义 null 对应的值, 所以得到 undefined, 其实内存泄露的隐患依然存在:
```js
var o = {name: "Bob"};
var map = new Map();
map.set(o, 12);
console.log(map.get(o));    //12
o = null;
console.log(map.size);      //1
```

WeakMap 和 WeakSet 类似, 由于不计入 GC 回收机制, 所以不支持遍历操作, 也不支持被清空, 所以 WeakMap 只有以下 4 个方法, 没有 size 属性:

- set(key, value)方法: 向weakMap中添加值-值对
- get(key)方法: 读取map中的值
- delete(key, value)方法: 删除weakMap中的值-值对
- has(key)方法: 判断某个键名是否存在

## iterator

由于 ES6 中引入了许多数据结构, 算上原有的包括Object, Array, TypedArray, DataView, buffer, Map, WeakMap, Set, WeakSet等等, 数组需要一个东西来管理他们, 这就是遍历器(iterator)。

### for...of

遍历器调用通常使用 for...of 循环, `for...of` 可以遍历具有 iterator 的对象, ES6中默认只有数组, Set, Map, String, Generator和一些类数组对象(arguments, DOM NodeList)带有遍历器, 其他的数据结构需要自己定义遍历器。

- 数组
默认 for...of 遍历器遍历值
```js
var arr = ["red", "green", "blue"];
for(let v of arr){    //相当于 for(let i in arr.values())
  console.log(v);     //依次输出 "red", "green", "blue"
}
for(let i in arr){
  console.log(i);     //依次输出 0, 1, 2
}
for(let [key, value] of arr.entries()){
  console.log(key + ": " + value);      //依次输出 0: "red", 1: "green", 2: blue"
}
for(let key of arr.keys()){
  console.log(key);     //依次输出 0, 1, 2
}
```
不难看出 for...of 默认得到值, 而 for...in 只能得到索引。当然数组的 for...of 只返回数字索引的属性, 而 for...in 没有限制:
```js
var arr = ["red", "green", "blue"];
arr.name = "color";
for(let v of arr){
  console.log(v);     //依次输出 "red", "green", "blue"
}
for(let i in arr){
  console.log(arr[i]);     //依次输出 "red", "green", "blue", "color"
}
```

- Set
默认 for...of 遍历器遍历值
```js
var set = new Set(["red", "green", "blue"]);
for(let v of set){    //相当于 for(let i in arr.values())
  console.log(v);     //依次输出 "red", "green", "blue"
}
for(let [key, value] of set.entries()){
  console.log(key + ": " + value);      //依次输出 "red: red", "green: green", "blue: blue"
}
for(let key of set.keys()){
  console.log(key);     //依次输出 "red", "green", "blue"
}
```

- map
默认 for...of 遍历器遍历键值对
```js
var map = new Map();
map.set("red", "#ff0000");
map.set("green", "#00ff00");
map.set("blue", "#0000ff");
for(let [key, value] of map){    //相当于 for(let i in arr.entries())
  console.log(key + ": " + value);      //依次输出 "red: #ff0000", "green: #00ff00", "blue: #0000ff"
}
for(let value of map.values()){
  console.log(value);     //次输出 "#ff0000", "#00ff00", "#0000ff"
}
for(let key of map.keys()){
  console.log(key);     //次输出 "red", "green", "blue"
}
```

- 字符串
for...of可以很好的处理区分32位 Unicode 字符串
```js
var str = "Hello";
for(let v of str){
  console.log(v);     //依次输出 "H", "e", "l", "l", "o"
}
```

- 类数组对象
```js
// DOM NodeList
var lis = document.getElementById("li");
for(let li of lis){
  console.log(li.innerHTML);   //遍历每个节点
}

//arguments
function fun(){
  for(let arg of arguments){
    console.log(arg);          //遍历每个参数
  }
}
```
不是所有类数组对象都有 iterator, 如果没有, 可以先用`Array.from()`进行转换:
```js
var o = {0: "red", 1: "green", 2: "blue", length: 3};
var o_arr = Array.from(o);
for(let v of o_arr){
  console.log(v);        //依次输出 "red", "green", "blue"
}
```

> 技巧1: 添加以下代码, 使 for...of 可以遍历 jquery 对象:
```js
$.fn[Symbol.iterator] = [][Symbol.iterator];
```
> 技巧2: 利用 Generator 重新包装对象:
```js
function* entries(obj){
  for(let key of Object.keys(obj)){
    yield [key, obj[key]];
  }
}
var obj = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff"
};
for(let [key, value] of entries(obj)){
  console.log(`${key}: ${value}`);        //依次输出 "red: #ff0000", "green: #00ff00", "blue: #0000ff"
}
```

### 几种遍历方法的比较

- for 循环: 书写比较麻烦
- forEach方法: 无法终止遍历
- for...in: 仅遍历索引, 使用不便捷; 会遍历原型链上的属性, 不安全; 会遍历非数字索引的数组属性;
- for...of:

### iterator 与 [Symbol.iterator]

iterator 遍历过程是这样的:
1. 创建一个指针对象, 指向当前数据结构的起始位置。即遍历器的本质就是一个指针。
2. 调用一次指针的 next 方法, 指针指向第一数据成员。之后每次调用 next 方法都会将之后向后移动一个数据。
3. 知道遍历结束。

我们实现一个数组的遍历器试试:
```js
var arr = [1, 3, 6, 5, 2];
var it = makeIterator(arr);
console.log(it.next());       //Object {value: 1, done: false}
console.log(it.next());       //Object {value: 3, done: false}
console.log(it.next());       //Object {value: 6, done: false}
console.log(it.next());       //Object {value: 5, done: false}
console.log(it.next());       //Object {value: 2, done: false}
console.log(it.next());       //Object {value: undefined, done: true}

function makeIterator(arr){
  var nextIndex = 0;
  return {
    next: function(){
      return nextIndex < arr.length ?
        {value: arr[nextIndex++], done: false} :
        {value: undefined, done: true}
    }
  };
}
```
由这个例子我们可以看出以下几点:

- 迭代器具有 next() 方法, 用来获取下一元素
- next() 方法具有返回值, 返回一个对象, 对象 value 属性代表下一个值, done 属性表示是否遍历是否结束
- 如果一个数据结构本身不具备遍历器, 或者自带的遍历器不符合使用要求, 请按此例格式自定义一个遍历器。

其实一个 id 生成器就很类似一个遍历器:
```js
function idGen(){
  var id = 0;
  return {
    next: function(){ return id++; }
  };
}
var id = idGen();
console.log(id.next());   //0
console.log(id.next());   //1
console.log(id.next());   //2
//...
```

对于大多数数据结构, 我们不需要再像这样写遍历器函数了。因为他们已经有遍历器函数`[Symbol.iterator]`, 比如`Array.prototype[Symbol.iterator]` 是数组结构的默认遍历器。

下面定义一个不完整(仅包含add()方法)的链表结构的实例:
```js
function Node(value){
  this.value = value;
  this.next = null;
}
function LinkedList(LLName){
  this.head = new Node(LLName);
  this.tail = this.head;
}
var proto = {
  add: function(value){
    var newNode = new Node(value);
    this.tail = this.tail.next = newNode;
    return this;
  }
}
LinkedList.prototype = proto;
LinkedList.prototype.constructor = LinkedList;
LinkedList.prototype[Symbol.iterator] = function(){
  var cur = this.head;
  var curValue;
  return {
    next: function(){
      if(cur !== null){
        curValue = cur.value;
        cur = cur.next;
        return {value: curValue, done: false}
      } else {
        return {value: undefined, done: true}
      }
    }
  };
}

var ll = new LinkedList("prime");
ll.add(1).add(2).add(3).add(5).add(7).add(11);
for(let val of ll){
  console.log(val);    //依次输出 1, 2, 3, 5, 7, 11
}
```

注意, 如果遍历器函数`[Symbol.iterator]`返回的不是如上例所示结构的对象, 会报错。
当然, 如果不不喜欢用for...of(应该鲜有这样的人吧), 可以用 while 遍历:
```js
var arr = [1, 2, 3, 5, 7];
var it = arr[Symbol.iterator];
var cur = it.next();
while(!cur.done){
  console.log(cur.value);
  cur = it.next();
}
```

以下操作会在内部调用相应的 iterator:

- 数组的解构赋值
- 展开运算符
- `yield*` 后面带有一个可遍历结构
- for...of
- Array.from() 将类数组对象转换为数组
- Map(), Set(), WeakMap(), WeakSet() 等构造函数传输初始参数时
- Promise.all()
- Promise.race()

### Generator 与遍历器

iterator 使用 Generator 实现会更简单:
```js
var it = {};
it[Symbol.iterator] = function* (){
  var a = 1, b = 1;
  var n = 10;
  while(n){
    yield a;
    [a, b] = [b, a + b];
    n--;
  }
}
console.log([...it]); //1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
```
当然, 以上代码还可以这样写:
```js
var it = {
  *[Symbol.iterator](){
    var a = 1, b = 1;
    var n = 10;
    while(n){
      yield a;
      [a, b] = [b, a + b];
      n--;
    }
  }
}
console.log([...it]); //[1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
```

### 遍历器对象的其他方法

以上的遍历器对象只提到了 next() 方法, 其实遍历器还有 throw() 方法和 return() 方法:

- 如果遍历终止(break, continue, return或者出错), 会调用 return() 方法
- Generator 返回的遍历器对象具throw() 方法, 一般的遍历器用不到这个方法。具体在 Generator 中解释。

```js
function readlineSync(file){
  return {
    next(){
      if(file.isAtEndOfFile()){
        file.close();
        return {done: true};
      }
    },
    return(){
      file.close();
      return {done: true};
    }
  }
}
```
上面实现了一个读取文件内数据的函数, 当读取到文件结尾跳出循环, 但是当循环跳出后, 需要做一些事情(关闭文件), 以防内存泄露。这个和 C++ 中的析构函数十分类似, 后者是在对象删除后做一些释放内存的工作, 防止内存泄露。

## Generator 函数

### Generator

Generator 函数是 es6 中的新的异步编程解决方案，本节仅讨论 Generator 函数本身，异步编程放在后面的部分。
Generator 函数之前也提到过，描述内部封装的多个状态，类似一个状态机，当然也是很好的 iterator 生成器。Generator 函数的基本形式如下：
```js
function* gen(){
  yield status1;
  yield status2;
  //...
}
```
不难看出，Generator 函数在 function 关键字和函数名之间加了一个星号"*", 内部用 yield 返回每一个状态。

当然还有其他格式的定义：
```js
//函数表达式
var gen = function*(){
  yield status1;
  //...
};

//对象方法
var obj = {
  *gen(){
    yield status1;
    //...
  }
};
```

Generator 函数调用时，写法和普通函数一样。但函数并不执行执行时，返回内部自带 iterator，之后调用该 iterator 的 next() 方法, 函数会开始执行，函数每次执行遇到 yield 关键字返回对应状态，并跳出函数，当下一次再次调用 next() 的时候，函数会继续从上一次 yield 跳出的下一跳语句继续执行。当然 Generator 函数也可以用 return 返回状态，不过此时，函数就真的运行结束了，该遍历器就不再工作了；如果函数内部所以的 yield 都执行完了，该遍历器一样不再工作了：
```js
function* gen(){
  yield "hello";
  yield "world";
  return "ending";
}
var it = gen();
console.log(it.next());      //{value: "hello", done: false}
console.log(it.next());      //{value: "world", done: false}
console.log(it.next());      //{value: "ending", done: true}
console.log(it.next());      //{value: undefined, done: true}
```
注意:
- return 返回的值，对应的 done 属性是 true。说明 return语句结束了遍历，iterator 不再继续遍历，即便后面还有代码和 yield。
- Generator 函数可以没有 yield 返回值，此时它依然返回一个 iterator, 并且在 iterator 调用 next 方法时一次行执行完函数内全部代码，返回`{value: undefined, done: true}`。 如果有 return 语句，该返回值对应的 value 属性值为 return 表达式的值。
- 普通函数使用 yield 语句会报错
- yield 可以用作函数参数，表达式参数：
```js
function* gen(){
  console.log("hello" + (yield));    //yield 用作表达式参数必须加()
  let input = yield;
  foo(yield 'a', yield 'b');
}
```
- Generator 函数的默认遍历器`[Symbol.iterator]`是函数自己：
```js
function* gen(){}
var g = gen()
g[Symbol.iterator]() === g;    //true
```

### next() 参数

yield 语句本身具有返回值，返回值是下一次调用 next 方法是传入的值。next 方法接受一个参数，默认 undefined：
```js
function* f(){
  for(let i = 0; true; i++){
    var reset = yield i;
    if(reset) i = -1;
  }
}
var g = f();
console.log(g.next().value)          //0
console.log(g.next().value)          //1
console.log(g.next().value)          //2
console.log(g.next(true).value)      //0
```
上面 代码第3行`var reset =  yield i`等号右侧是利用 yield 返回i, 由于赋值运算时右结合的，返回 i 以后，函数暂停执行，赋值工作没有完成。之后再次调用 next 方法时，将这次传入参数作为刚才这个 yield 的返回值赋给了 reset, 因此计数器被重置。
```js
function* foo(x){
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}
var g = foo(5);
console.log(g.next());          //{value: 6, done: false}
console.log(g.next(12));        //{value: 8, done: false}
console.log(g.next(13));        //{value: 42, done: true}
```
第一次调用 next 函数不需要参数，作为 Generator 启动，如果带了参数也会被忽略。当然，如果一定想在第一次调用 next 时候就赋值，可以将 Generator 函数封装一下：
```js
//一种不完善的思路，通常不强求这样做
function wrapper(gen){
  return function(){
    let genObj = gen(...arguments);
    genObj.next();       //提前先启动一次，但如果此时带有返回值，该值就丢了！
    return genObj;
  }
}
var gen = wrapper(function*(){
  console.log(`first input: "${yield}"`);
});
var it = gen();
it.next("Bye-Bye");       //first input: "Bye-Bye"
```

### for...of

我们注意到，之前在 iterator 中，迭代器最后返回`{value: undefined, done: true}`，其中值为 undefined 和 done 为 true 是同时出现的，而遍历结果不包含 done 为 true 时对应的 value 值，所以 Generator 的 for...of 循环最好不要用 return 返回值，因为该值将不会被遍历：
```js
function* gen(){
  for(var i = 0; i < 5; i++){
    yield i;
  }
  return 5;
}
for(let v of gen()){
  console.log(v);       //依次输出 0, 1, 2, 3, 4, 没有 5
}
```

除了 for...of, Generator 还有很多简单用法。下面利用 fibonacci 数列，演示几种不同的 Generator 用法:

- 展开运算符
```js
function* fib(n = Infinity){
  var a = 1, b = 1;
  while(n){
    yield a;
    [a, b] = [b, a + b];
    n--;
  }
}
console.log([...fib(10)]); //1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
```
- 解构赋值
```js
function* fib(n = Infinity){
  var a = 1, b = 1;
  while(n){
    yield a;
    [a, b] = [b, a + b];
    n--;
  }
}
var [a, b, c, d, e, f] = fib();  //a=1, b=1, c=2, d=3, e=5, f=8
```
- 构造函数参数
```js
function* fib(n = Infinity){
  var a = 1, b = 1;
  while(n){
    yield a;
    [a, b] = [b, a + b];
    n--;
  }
}
var set = new Set(fib(n));
console.log(set);  //Set(9) [1, 2, 3, 5, 8, 13, 21, 34, 55]
```
- Array.from方法
```js
function* fib(n = Infinity){
  var a = 1, b = 1;
  var n = 10;
  while(n){
    yield a;
    [a, b] = [b, a + b];
    n--;
  }
}
var arr = Array.from(fib(10));
console.log(arr);    //[1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
```
- 遍历对象
```js
function* entries(obj){
  for(let key of Object.keys(obj)){
    yield [key, obj[key]];
  }
}
var obj = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff"
};
for(let [key, value] of entries(obj)){
  console.log(`${key}: ${value}`);        //依次输出 "red: #ff0000", "green: #00ff00", "blue: #0000ff"
}
```

### throw() 方法和 return() 方法

Generator 返回的遍历器对象具throw() 方法, 一般的遍历器用不到这个方法。该方法接受一个参数作为抛出的错误，该错误可以在 Generator 内部捕获：
```js
function* gen(){
  while(1){
    try{
      yield "OK";
    } catch(e) {
      if(e === 'a') console.log(`内部捕获: ${e}`);    //内部捕获: a
      else throw e;
    }
  }
}
var it = gen();
it.next();              //如果没有这一行启动生成器，结果仅输出：外部捕获: a
try{
  it.throw('a');
  it.throw('b');
  it.next();            //上一行错误为外部捕获，try 中的代码不在继续执行，故这一行不执行
} catch(e) {
  console.log(`外部捕获: ${e}`)    //外部捕获: b
}
```
throw参数在传递过程中和 next 参数类似，需要先调用一次 next 方法启动生成器，之后抛出的错误会在前一个 yield 的位置被捕获:
```js
function* gen(){
  yield "OK";             //错误被抛到这里，不在内部 try 语句内无法捕获
  while(1){
    try{
      yield "OK";
    } catch(e) {
      console.log(`内部捕获: ${e}`);
    }
  }
}
var it = gen();
it.next();
try{
  it.throw('a');
} catch(e) {
  console.log(`外部捕获: ${e}`)    //外部捕获: a
}
```
注意: 不要混用 throw() 方法和 throw 语句，后者无法将错误抛到生成器内部。其次，throw 会终止遍历器，不能继续工作，而 throw 不会终止遍历器：
```js
function* gen(){
  yield console.log("hello");
  yield console.log("world");
}

//throw 语句
var it1 = gen();
it1.next();           //hello
try{
  throw new Error();
} catch(e) {
  it1.next()         //world
}

//throw() 方法
var it2 = gen();
it2.next();           //hello
try{
  it2.throw();
} catch(e) {
  it2.next()         //遍历器被关闭无法执行, 静默失败
}
```

如果在遍历器内部抛出错误，遍历器中止，继续调用 next() 方法将得到`{value: undefined, done: true}`:
```js
function* gen(){
  var x = yield "ok";
  var y = yield x.toUpperCase();
  var z = yield (x + y + z);
}

//throw 语句
var it = gen();
it.next();           //"ok"
try{
  it.next();
} catch(e) {
  console.log("Error Caught");   //Error Caught
} finally {
  it.next();         //{value: undefined, done: true}
}
```

return() 方法返回指定的值，并终止迭代器:
```js
var it = (function* gen(){
  yield 1;
  yield 2;
  yield 3;
}());
console.log(it.next());           //{value: 1, done: false}
console.log(it.next());           //{value: 2, done: false}
console.log(it.return("end"));    //{value: "end", done: true}
console.log(it.next());           //{value: undefined, done: true}
```
如果不给 return() 方法提供参数，默认是 undefined
如果 Generator 中有 try...finally 语句，return 会在 finally 执行完再执行：
```js
function* numbers(){
  yield 1;
  try{
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
console.log(g.next().value);          //1
console.log(g.next().value);          //2
console.log(g.return("end").value);   //延迟到 finally 之后输出 -----
console.log(g.next().value);          //4                         |
console.log(g.next().value);          //5                         |
                                      //"end" <-------------------
console.log(g.next().value);          //undefined
```

### yield* 语句

在一个 Generator 中调用另一个 Generator 函数默认是没有效果的:
```js
function* gen(){
  yield 3;
  yield 2;
}
function* fun(){
  yield gen();
  yield 1;
}
var it = fun();
console.log(it.next().value);    //gen 函数返回的遍历器
console.log(it.next().value);    //1
console.log(it.next().value);    //undefined
```
显然第一次返回的结果不是我们想要的。需要使用 yield* 解决这个问题。yield* 将一个可遍历结构解构，并逐一返回其中的数据。
```js
function* gen(){
  yield 3;
  yield 2;
}
function* fun(){
  yield* gen();
  yield 1;
}
var it = fun();
console.log(it.next().value);    //3
console.log(it.next().value);    //2
console.log(it.next().value);    //1
```
```js
function* fun(){
  yield* [4,3,2];
  yield 1;
}
var it = fun();
console.log(it.next().value);    //4
console.log(it.next().value);    //3
console.log(it.next().value);    //2
console.log(it.next().value);    //1
```

被代理的 Generator 可以用return向代理它的 Generator 返回值：
```js
function* gen(){
  yield "Bye";
  yield* "Hi"
  return 2;
}
function* fun(){
  if((yield* gen()) === 2) yield* "ok";
  else yield "ok";
}
var it = fun();
console.log(it.next().value);    //Bye
console.log(it.next().value);    //H
console.log(it.next().value);    //i
console.log(it.next().value);    //o
console.log(it.next().value);    //k
console.log(it.next().value);    //undefined
```

举例：
1. 数组扁平化
```js
//方法1：
var arr = [1,2,[2,[3,4],2],[3,4,[3,[6]]]];
function plat(arr){
  var temp = [];
  for(let v of arr){
    if(Array.isArray(v)){
      plat(v);
    } else {
      temp.push(v);
    }
  }
  return temp;
}
console.log(plat(arr));              //[1, 2, 2, 3, 4, 2, 3, 4, 3, 6]

//方法2：
function* plat2(arr){
  for(let v of arr){
    if(Array.isArray(v)){
      yield* plat2(v);
    } else {
      yield v;
    }
  }
}
var temp = [];
for(let x of plat2(arr)){
  temp.push(x);
}
console.log(temp);                    //[1, 2, 2, 3, 4, 2, 3, 4, 3, 6]
```
2. 遍历二叉树
```js
//节点
function Node(value, left, right){
  this.value = value;
  this.left = left;
  this.right = right;
}

//二叉树
function Tree(arr){
  if(arr.length === 1){
    return new Node(arr[0], null, null);
  } else {
    return new Node(arr[1], Tree(arr[0]), Tree(arr[2]));
  }
}
var tree = Tree([[[1], 4, [5]], 2, [[[0], 6, [9]], 8, [7]]]);

//前序遍历
function* preorder(tree){
  if(tree){
    yield tree.value;
    yield* preorder(tree.left);
    yield* preorder(tree.right);
  }
}
//中序遍历
function* inorder(tree){
  if(tree){
    yield* inorder(tree.left);
    yield tree.value;
    yield* inorder(tree.right);
  }
}
//后序遍历
function* postorder(tree){
  if(tree){
    yield* postorder(tree.left);
    yield* postorder(tree.right);
    yield tree.value;
  }
}

var _pre = [], _in = [], _post = [];
for(let v of preorder(tree)){
  _pre.push(v);
}
for(let v of inorder(tree)){
  _in.push(v);
}
for(let v of postorder(tree)){
  _post.push(v);
}
console.log(_pre);     //[2, 4, 1, 5, 8, 6, 0, 9, 7]
console.log(_in);      //[1, 4, 5, 2, 0, 6, 9, 8, 7]
console.log(_post);    //[1, 5, 4, 0, 9, 6, 7, 8, 2]
```
3. Generator 实现状态机:
```js
//传统实现方法
var clock1 = function(){
  var ticking = false;
  return {
    next: function(){
      ticking = !ticking;
      if(ticking){
        return "Tick";
      }else{
        return "Tock";
      }
    }
  }
};
var ck1 = clock1();
console.log(ck1.next());      //Tick
console.log(ck1.next());      //Tock
console.log(ck1.next());      //Tick

//Generator 方法
var clock2 = function*(){
  while(1){
    yield "Tick";
    yield "Tock";
  }
};
var ck2 = clock2();
console.log(ck2.next().value);      //Tick
console.log(ck2.next().value);      //Tock
console.log(ck2.next().value);      //Tick
```
### Generator 函数中的 this

在ES6中, 规定了所有 iterator 是 Generator 函数的实例：
```js
function* gen(){}
var it = gen();
it instanceof gen;                                  //true
console.log(gen.__proto__);                         //GeneratorFunction
console.log(gen.__proto__.__proto__);               //Function
console.log(gen.constructor);                       //GeneratorFunction
console.log(gen.__proto__.constructor);             //GeneratorFunction
gen.prototype.sayHello = function(){
  console.log("hello");
}
it.sayHello();     //"hello"
```

但是 Generator 函数中的 this 并不指向生成的 iterator：
```js
function* gen(){
  this.num = 11;
  console.log(this);
}
var it = gen();
console.log(it.num);     //undefined
it.next();               //Window

var obj = {
  * fun(){
    console.log(this);
  }
}
var o_it = obj.fun();
o_it.next();              //obj
```
由上面这个例子不难看出，Generator 函数中的 this 和普通函数是一样的。不过，可不可以把 Generator 函数作为构造函数呢？显然是不行的:
```js
function* gen(){
  this.num = 11;
}
gen.prototype.say = function(){console.log("hello")}
var a = new gen();    //TypeError: gen is not a constructor
```

### Generator 函数推导

ES7 在数组推导的基础上提出了 Generator 函数推导，可惜这个功能目前还不能使用：
```js
let gen = function*(){
  for(let i = 0; i < 6; i++){
    yield i;
  }
};
let arr = [for(let n of gen()) n * n];
//相当于：
let arr = Array.from(gen()).map(n => n * n);
console.log(arr); [0,1,4,9,16,25]
```
Generator 数组推导，利用惰性求值优化系统资源利用：
```js
var bigArr = new Array(10000);
for(let i = 0; i < 10000; i++){
  bigArr.push(i);
}
//....其他代码
//使用 bigArr 之前很久就分配了内存
console.log(bigArr[100]);

var gen = function*(){
  for(let i = 0; i < 10000; i++){
    yield i;
  }
};
//....其他代码
//使用 bigArr 时才分配内存
var bigArr = [for(let n of gen()) n];
console.log(bigArr[100]);
```

### 应用举例

优化回调函数
```js
//伪代码
function* main(){
  var result = yield request("http://url.com");
  var res = JSON.parse(result);
  console.log(res.value);
}
function request(url){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      it.next(xhr.response);
    }
  }
  xhr.send();
}
var it = main();
it.next();
```
另一个例子：
```js
//伪代码
//遇到多重回调函数，传统写法：
step1(function(value1){
  step2(value1, function(value2){
    step3(value2, function(value3){
      step4(value3, function(value4){
        //do something
      });
    });
  });
});
//利用 Generator 写：
function* gen(){
  try{
    var value1 = yield step1();
    var value2 = yield step2(value1);
    var value3 = yield step3(value2);
    var value4 = yield step4(value3);
  } catch(e) {
    //Handle the error form step1 to step4
  }
}
```

## Promise 对象

### Promise 建立

Promise 对象用来传递异步操作消息，代表一个未来才会知道结果的事件，并且对不同事件提供统一的 API 以便进一步处理。Promise 具有以下特点：

- 由异步操作结果决定改状态，其他操作绝不影响该状态；
- 对象状态不受外界影响：Promise 代表的异步操作有三个状态：
1. Pending: 进行中
2. Resolved: 已完成(Fulfilled)
3. Rejected: 已失败
- 一旦状态改变，就不会再变：Promise 的状态只有2种可能：
1. 从 Pending 到 Resolved
2. 从 Pending 到 Rejected

对于同一个 promise, 当以上状态发生一个(只能发生其一)，就不会再改变了。之后任何时间你都能得到这个状态，且永不改变。
有了 Promise 就可以将层层的回调写为同步的样子，表示起来更清晰。不过需要注意以下几点：

- Promise 一旦建立就立即执行，并且无法中断或取消
- 如果没有设置回调函数，那么 Promise 中的产生的错误不会抛到外部
- Pending 状态时，我们无法知道其具体进度

Promise 的基本结构如下：
```js
var promise = new Promise(function(resolve, reject){
  if(/*异步操作成功*/){
    resolve(value);
  } else {
    reject(error);
  }
});
```
构造函数接受一个回调函数为参数，回调函数具有2个参数，也都是函数，resolve 在 Promise 状态变为 resolved 时调用，reject 在  Promise 状态变为 rejected 时调用。resolve 的接受一个参数——值或另一个 promise 对象； rejectj接受一个参数——错误。需要说明的是，这里的 resole 和 reject 函数已经由系统部署好了，我们可以不写。

promise 构建好以后我们就可以调用它的`then()`方法，`then(resolve(value){},reject(value){})`方法接受2个函数参数，resolve 在 Promise 状态变为 resolved 时调用，reject 在  Promise 状态变为 rejected 时调用。其中 reject 参数是可选的。和构造函数不同的是，then 方法的 reject 和 resolve 都使用 promise 传出的值作为其唯一的参数。

这里写一个简单的例子，理解一下：
```js
function timeout(ms){
  return new Promise((resolve, reject) => {
    console.log("promise");            //"promise"
    setTimeout(resolve, ms, 'done');
  });
}
timeout(2000).then((value) => {
  console.log(value);                  //2秒后得到 "done"
});
```

利用 Promise 异步加载图片：
```js
function loadImageAsync(url){
  return new Promise(function(resole, reject){
    var image = new Image();
    image.onload = function(){
      resolve(image);
    };
    image.onerror = function(){
      reject(new Error(`Could not load image at ${url}`));
    };
    image.src = url;
  });
}
```

利用 Promise 实现 Ajax：
```js
  var id = document.getElementById("primary");
  var getJSON = function(url){
    var promise = new Promise(function(resolve, reject){
      var client = new XMLHttpRequest();
      client.open("GET", url);
      client.onreadystatechange = handler;
      client.response = "json";
      client.setRequestHeader("Accept", "application/json");
      client.send();

      function handler(){
        if(client.readyState !== 4) return;
        if(this.status === 200){
          resolve(client.response);
        } else {
          reject(new Error(this.statusText));
        }
      }
    });
    return promise;
  }
  getJSON('info.json').then(
    json => id.innerHTML = "<pre>" + json + "</pre>",
    err => id.innerHTML = err
  );
```

如果 resolve 的参数是一个promise：
```js
var p1 = new Promise(function(resolve, reject){
  //...
});
var p2 = new Promise(function(resolve, reject){
  //...
  resolve(p1);
});
```
上面代码中 p1 的状态传给了 p2，也就是p1运行完成(状态为 resolve 或 reject)后 p2 的回调函数会立刻开始执行：
```js
var p1 = new Promise(function(resolve, reject){
  setTimeout(() => reject(new Error('failed')), 3000);
});
var p2 = new Promise(function(resolve, reject){
  setTimeout(() => resolve(p1), 1000);
});
p2.then(result => console.log(result));
p2.catch(error => console.log(error));
```
p1 建立，进入 setTimeout 异步计时器。之后 p2 建立，进入 setTimeout 异步计时器。1s 后 p2 准备执行 resolve, 但是 resolve 的参数是 p1, 此时 p1 还是 Pending 状态，所以 p2 开始等待。又过了 2s, p1 的 reject 执行，变为 rejected 状态，随即 p2 也跟着变成 rejected 状态。

### Promise 对象方法

- then() 方法
`then(resolve(value){},reject(value){})`方法接受2个函数参数，resolve 在 Promise 状态变为 resolved 时调用，reject 在  Promise 状态变为 rejected 时调用。其中 reject 参数是可选的。和构造函数不同的是，then 方法的 reject 和 resolve 都使用 promise 传出的值作为其唯一的参数。
`then()` 方法返回一个新的 Promise 实例，注意，不是之前那个。因此可以用链式调用，不断添加"回调"函数。 then 的返回值成了下一个 then 中回调函数的参数：
```js
var p = new Promise(function(resolve, reject){
  resolve("from new Promise");
}).then(function (value){
  console.log(value);     //from new Promise    其次输出这个
  return "from the first 'then'";
}).then(function(value){
  console.log(value);     //from the first 'then'    最后输出这个
  return "from the second 'then'";
});
console.log(p);           //Promise{...}    先输出这个
```
注意，如果 promise 的状态是 resolved 则执行 then参数中的第一个回调函数；如果 promise 的状态是 rejected 则执行 then参数中的第二个回调函数。这个状态是不断传递下来的，这一点和之前的例子类似。

- catch() 方法:
catch(reject) 方法是 `then(null, reject)` 的别名，在发生错误的时候执行其参数函数:
```js
new Promise(function(resolve, reject){
  resolve("resolved");
}).then(function(val){
  console.log(val);           //resolved
  throw new Error("man-made Error");
}).catch(function(err){
  console.log(err.message);   //man-made Error
});
```
错误会从最初的请求沿着回调函数，一直被传递下来。这一点和传统的错误冒泡类似，无论哪里有错误都可以被捕获到：
```js
new Promise(function(resolve, reject){
  reject(new Error("original Error"));
}).then(function(val){
  console.log(val);           //不执行
  throw new Error("man-made Error");
}).catch(function(err){
  console.log(err.message);   //original Error
});
```
当然也可以在半路截住错误：
```js
new Promise(function(resolve, reject){
  reject(new Error("original Error"));
}).then(function(val){
  console.log(val);           //不执行
  throw new Error("man-made Error");
}, function(err){
  console.log(`Uncaught Error: ${err.message}`);  //Uncaught Error: original Error
}).catch(function(err){
  console.log(err.message);   //不执行
});
```
这里需要注意以下几点：
1. reject 和 throw 一样可以抛出错误。
2. 在 Promise 状态变为 resolved 或 rejected 之后抛出的错误会被忽略。
3. 建议总是使用 catch() 方法，而不要在 then() 方法中定义 reject 函数。
4. 如果一个 promise 既没有 catch方法，也没有可以捕获到错误的 then 方法，那么这个错误就消失了。它不会到 promise 外面来。
5. try...catch... 只能捕获同步代码的错误，不能捕获异步代码的错误(这个是 ES5 就有的)。
6. catch() 方法可以继续抛出错误，就像 try...catch 中的 catch 一样可以抛出错误。
这里需要说明的是第4条：错误不会到 Promise 外面是 ES6 规范的说法。具体理解(浏览器环境)：控制台依旧会报错，但是不影响 promise 语句之后续代码执行。此外，promise 语句内的异步语句(如事件，定时器等等)抛出的错误，不属于 promise 内部，发生错误会传播出去：
```js
var p = new Promise(function(resolve, reject){
  resolve("ok");
  setTimeout(function(){throw new Error("setTimeout error")},0);
});
p.then(function(val){console.log(val);});     //ok
//Uncaught Error: setTimeout error
```
其次，就以上前两个注意事项举一例说明：
```js
new Promise(function(resolve, reject){
  resolve("resolved");
  throw "original Error";     //被忽略
}).then(function(val){
  console.log(val);           //resolved
  throw (new Error("man-made Error"));
}).catch(function(err){
  console.log(err.message);   //man-made Error
});
```
catch 方法的返回值还是一个新的 promise 对象，可以继续调用 then 等其他方法:
```js
new Promise(function(resolve, reject){
  reject(new Error("reject"));
}).catch(function(err){
  console.log("1st catch");   //被跳过
  return "continue";
}).then(function(val){
  console.log(val);           //continue
});
```
如果 catch之前没有错误，该 catch 会被跳过。这意味着，catch 不能捕获在其后面的语句中出现的错误：
```js
new Promise(function(resolve, reject){
  resolve("resolved");
}).catch(function(err){
  console.log("1st catch");   //被跳过
}).then(function(val){
  console.log(val);           //resolved
  throw (new Error());
}).catch(function(err){
  console.log("2nd catch");   //2nd catch
});
```

- finally() 方法

finally() 接受一个回调函数(无参数)为参数，和 try...catch...finally 中的 finally 类似，不论 promise 是什么状态，该回调函数都一定会运行。可以用它关闭文件，或者关闭服务器等:
```js
server.listen(0).then(function(){
  //do sth.
}).finally(server.stop);
```
finally() 内部实现如下：
```js
Promise.prototype.finally = function(callback){
  return this.then(
    value => {Promise.resolve(callback()).then(() => value)},
    error => {Promise.resolve(callback()).then(() => {throw error})}
  );
};
```


- done() 方法

done() 方法用在 promise 处理语句的末端，用来处理可能未捕获的错误，并抛向全局。如果其带有参数，可以等效为 done() 之前多了一个 then():
```js
p.done(fun1, fun2);
//相当于
p.then(fun1,fun2).done();
```
done() 内部实现如下：
```js
Promise.prototype.done = function(onResolve, onRejected){
  this.then(onResolve, onRejected).catch(function(err){
    setTimeout(() => {throw err}, 0);
  });
};
```

### Promise 静态方法

- Promise.all()
将多个 promise 对象合并成一个新的 promise 实例。其接受一个装仅有 promise 对象的可遍历结构为参数，如果不是 promise 对象，系统会调用 `Promise.resolve()` 进行类型转换。
promise.all() 方法得到的新的 promise 对象状态由构成它的所有 promise 对象决定，具体分为2种情况:
1. 当所有构成它的 promise 对象的状态都变成 resolved，这个新的对象状态才变为 resolved。此时构成它所有的 Promise 的返回值构成一个数组作为新的 promise 对象的回调函数参数；
2. 当所有构成它的 promise 对象的状态有一个变成 rejected，这个新的对象状态就变为 rejected。此时第一个被 reject 的 Promise 的返回值作为新的 promise 对象的回调函数参数；
```js
//伪代码, 由于没有正确的 url
var getJSON = function(url){
  var promise = new Promise(function(resolve, reject){
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.response = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();
    function handler(){
      if(client.readyState !== 4) return;
      if(this.status === 200){
        resolve(client.response);
      } else {
        reject(new Error(this.statusText));
      }
    }
  });
  return promise;
}
var pros = ['url1', 'url2', 'url3'].map(url => getJSON(url));
Promise.all(pros).then(function(){
  console.log("all successful");
}, function(){
  console.log("one rejected");       //one rejected, 由于没有正确的 url
});
```


- Promise.race()
将多个 promise 对象合并成一个新的 promise 实例。其接受一个装仅有 promise 对象的可遍历结构为参数，如果不是 promise 对象，系统会调用 `Promise.resolve()` 进行类型转换。
和 promise.all() 不同的是 Promise.race() 方法得到的新的 promise 对象状态由构成它的 promise 对象中最先改变状态的那一个决定。
```js
//伪代码, 由于没有正确的 url
var getJSON = function(url){
  var promise = new Promise(function(resolve, reject){
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.response = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();
    function handler(){
      if(client.readyState !== 4) return;
      if(this.status === 200){
        resolve(client.response);
      } else {
        reject(new Error(this.statusText));
      }
    }
  });
  return promise;
}
//如果5s不能获得数据就报错
var p = Promise.race([
  getJSON("url"),
  new Promise(function(resolve, reject){
    setTimeout(() => reject(new Error("Timeout")), 5000);
  })
]).then(res => console.log(res))
.catch(err => console.log(err));    //Error, 由于没有正确的 url
```

- Promise.resolve()
将现有对象转化为 promise 对象：
```js
var p = Promise.resolve($.ajax('url'));  //jQuery的 $.ajax 方法
//等同于：
var p = new Promise(function(resolve){
  resolve($.ajax('url'));
});
```
如果传入 Promise.resolve() 的对象不具有 then 方法(ie. unthenable), 则返回一个状态为 resolved 的新 promise 对象。
```js
Promise.resolve("hello").then(function(val){
  console.log(val);                             //hello
});
```
如果你仅仅想得到一个 promise 对象，那利用 resolve() 方法是最简单的：
```js
var promise = Promise.resolve();
```

- Promise.reject()
`Promise.reject(reason)`, 返回一个状态为 rejected 的 promise 实例。参数 reason 会被传递被实例的回调函数。
```js
Promise.reject(new Error("error occured")).catch(err => console.log(err.message));  //error occured
```

### 应用举例

1. 加载图片：
```js
var preloadImage = function(url){
  return new Promise(function(resolve, reject){
    var image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = url;
  });
};
```
2. 使用 Generator 管理流程，用 promise 进行异步操作
```js
function getFoo(){
  return new Promise(function(resolve){
    resolve("foo");
  });
}
function* gen(){
  try{
    var foo = yield getFoo();
    console.log(foo);
  } catch(e) {
    console.log(e);
  }
}

var it = gen();
(function go(result){
  if(result.done) return result.value;
  return result.value.then(function(value){
    return go(it.next(value));
  }, function(err){
    return go(it.throw(error));
  });
})(it.next());      //foo
```

## 异步编程

### 异步编程

程序执行分为同步和异步，如果程序每执行一步都需要等待上一步完成才能开始，此所谓同步。如果程序在执行一段代码的同时可以去执行另一段代码，等到这段代码执行完毕再吧结果交给另一段代码，此所谓异步。
比如我们需要请求一个网络资源，由于网速比较慢，同步编程就意味着用户必须等待下载处理结束才能继续操作，所以用户体验极为不好；如果采用异步，下载进行中用户继续操作，当下载结束了，告诉用户下载的数据，这样体检就提升了很多。因此异步编程十分重要。
从计算机的角度来讲，js 只有一个线程，如果没有异步编程那一定会卡死的！异步编程主要包括以下几种：

- 回调函数
- 事件监听
- 发布/订阅模型
- Promise对象
- ES6异步编程

### 回调函数 和 Promise

回调函数应该是 js 中十分基础和简单的部分，我们在定义事件，在计时器等等使用过程中都使用过：
```js
fs.readFile('/etc/passwd', function(err, data){
  if(err) throw err;
  console.log(data);
});
```
比如这里的这个文件读取，定义了一个回调函数，在读取文件成功或失败是调用，并不会立刻调用。

如同之前在 Promise 中提到的，当我想不断的读入多个文件，就会遇到回调函数嵌套，书写代码及其的不方便，我们称之为"回调地狱"。因此 ES6 中引入是了 Promise 解决这个问题。具体表现参看之前的 Promise 部分。但是 Promise 也带来了新的问题，就是代码冗余很严重，一大堆的 then 使得回调的语义不明确。

### 协程

所谓协程就是几个程序交替执行：A开始执行，执行一段时间后 B 执行，执行一段时间后再 A 继续执行，如此反复。
```js
function* asyncJob(){
  //...
  var f = yield readFile(fileA);
  //...
}
```

通过一个 Generator 函数的 yield， 可以将一个协程中断，去执行另一个协程。我们可以换一个角度理解 Generator 函数：它是协程在 ES6 中的具体体现。我们可以简单写一个异步任务的封装：
```js
var fetch = require('node-fetch');
function* gen(){
  var url = 'http://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

var g = gen();
var result = g.next();    //返回的 value 是一个 Promise 对象
result.value.then(function(data){
  return data.json;
}).then(function(data){
  g.next(data);
});
```

### Thunk 函数

在函数传参数时我们考虑这样一个问题：
```js
function fun(x){
  return x + 5;
}
var a = 10;
fun(a + 10);
```
这个函数返回25肯定没错，但是，我们传给函数 fun 的参数在编译时到底保留 `a + 10` 还是直接传入 `20`？显然前者没有事先计算，如果函数内多次使用这个参数，就会产生多次计算，影响性能；而后者事先计算了，但如果函数里不使用这个变量就白浪费了性能。采用把参数原封不动的放入一个函数(我们将这个函数称为 Thunk 函数)，用的使用调用该函数的方式。也就是上面的前一种方式传值。所以上面代码等价于：
```js
function fun(x){
  return x() + 5;
}
var a = 10;
var thunk = function(){ return a + 10};
fun(thunk);
```

**但是 js 不是这样的！**js 会把多参数函数给 Thunk 了，以减少参数：
```js
var fs = require('fs');
fs.readFile(fileName, callback);
var readFileThunk = Thunk(fileName);
readFileThunk(callback);

var Thunk = function(fileName){
  return function(callback){
    return fs.readFile(fileName,callback);
  };
};
```

这里任何具有回调函数的函数都可以写成这样的 Thunk 函数，方法如下：
```js
function Thunk(fn){
  return function(){
    var args = Array.prototype.slice.call(arguments);
    return function (callback){
      args.push(callback);
      return fn.apply(this, args);
    }
  }
}

//这样fs.readFile(fileName, callback); 写作如下形式

Thunk(fs.readFile)(fileName)(callback);
```

关于 Thunk 函数, 可以直接使用 thunkify 模块：
```js
npm install thunkify
```

使用格式和上面的`Thunk(fs.readFile)(fileName)(callback);`一致，但使用过程中需要注意，其内部加入了检查机制，只允许 callback 被回调一次！

结合 Thunk 函数和协程，我们可以实现自动流程管理。之前我们使用 Generator 时候使用 `yield` 关键字将 cpu 资源释放，执行移出 Generator 函数。可以怎么移回来呢？之前我们手动调用 Generator 返回的迭代器的 next() 方法，可这毕竟是手动的，现在我们就利用 Thunk 函数实现一个自动的：
```js
var fs = require('fs');
var thunkify = require('thunkify');
var readFile = thunkify(fs.readFile);

var gen = function*(...args){    //args 是文件路径数组
  for(var i = 0, len = args.length; i < len; i++){
    var r = yield readFile(args[i]);
    console.log(r.toString());
  }
};

(function run(fn){
  var gen = fn();
  function next(err, data){
    if(err) throw err;
    var result =  gen.next(data);
    if(result.done) return;    //递归直到所以文件读取完成
    result.value(next);    //递归执行
  }
  next();
})(gen);

//之后可以使用 run 函数继续读取其他文件操作
```

如果说 Thunk 可以有现成的库使用，那么这个自动执行的 Generator 函数也有现成的库可以使用——co模块([https://github.com/tj/co](https://github.com/tj/co))。用法与上面类似，不过 co 模块返回一个 Promise 对象。使用方式如下：
```js
var co = require('co');
var fs = require('fs');
var thunkify = require('thunkify');
var readFile = thunkify(fs.readFile);

var gen = function*(...args){    //args 是文件路径数组
  for(var i = 0, len = args.length; i < len; i++){
    var r = yield readFile(args[i]);
    console.log(r.toString());
  }
};
co(gen).then(function(){
  console.log("files loaded");
}).catch(function(err){
  console.log("load fail");
});
```
这里需要注意的是：yield 后面只能跟一个 thunk 函数或 promise 对象。上例中第8行 yield 后面的 readFile 是一个 thunk 函数，所以可以使用。
上面已经讲解了 thunk 函数实现自动流程管理，下面使用 Promise 实现一下：
```js
var fs = require('fs');
var readFile = function(fileName){
  return new Promise(function(resolve, reject){
    fs.readFile(fileName, function(error,data){
      if(error) reject(error);
      resolve(data);
    });
  });
};

var gen = function*(){
  for(var i = 0, len = args.length; i < len; i++){
    var r = yield readFile(args[i]);
    console.log(r.toString());
  }
};

(function run(gen){
  var g = gen();

  var resolve = function(data){
    var result = g.next(data);
    if(result.done) return result.value;
    result.value.then(resolve);
  }
  g.next().value.then(function(data){
    resolve(data);
  });
  resolve();
})(gen);
//之后可以使用 run 函数继续读取其他文件操作
```

# async 函数

ES7 中提出了 async 函数，但是现在已经可以用了！可这个又是什么呢？其实就是 Generator 函数的改进,我们上文写过一个这样的 Generator 函数：
```js
var gen = function*(){
  for(var i = 0, len = args.length; i < len; i++){
    var r = yield readFile(args[i]);
    console.log(r.toString());
  }
};
```
我们把它改写成 async 函数：
```js
var asyncReadFiles = async function(){    //* 替换为 async
  for(var i = 0, len = args.length; i < len; i++){
    var r = await readFile(args[i]);   //yield 替换为 await
    console.log(r.toString());
  }
};
```

async 函数对 Generator 函数做了一下改进：

- Generator 函数需要手动通过返回值的 next 方法执行，而 async 函数自带执行器，执行方式和普通函数完全一样。
```js
var result = asyncReadFiles(fileA, fileB, fileC);
```
- 语义明确，async 表示异步，await 表示后续表达式需要等待触发的异步操作结束
- co 模块中 yield 后面只能跟一个 thunk 函数或 promise 对象，而 await 后面可以是任何类型(不是 Promise 对象就同步执行)
- 返回值是一个 Promise 对象，不是 Iterator ，比 Generator 方便

我们可以实现这样的一个 async 函数:
```js
async function asyncFun(){
  //code here
}
//equal to...
function asyncFun(args){
  return fun(function*(){
    //code here...
  });
  function fun(genF){
    return new Promise(function(resolve, reject){
      var gen = genF();
      function step(nextF){
        try{
          var next = nextF();
        } catch(e) {
          return reject(e);
        }
        if(next.done){
          return resolve(next.value);
        }
        Promise.resolve(next.value).then(function(data){
          step(function(){ return gen.next(data); });
        }, function(e){
          step(function(){ return gen.throw(e); });
        });
      }
      step(function() { return gen.next(undefined); });
    });
  }
}
```

我们使用 async 函数做点简单的事情：
```js
function timeout(ms){
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function delay(nap, ...values){
  while(1){
    try{
      await timeout(nap);
    } catch(e) {
      console.log(e);
    }
    var val = values.shift();
    if(val)
      console.log(val)
    else
      break;
  }
}
delay(600,1,2,3,4);   //每隔 600ms 输出一个数
```
这里需要注意：应该把后面跟 promise对象的 await 放在一个 try 中，防止其被 rejected。当然上面的 try 语句也可以这样写：
```js
var ms = await timeout(nap).catch((e) => console.log(e));
```

对于函数参数中的回调函数不建议使用，避免出现不应该的错误
```js
//反例: 会得到错误结果
async function fun(db){
  let docs = [{},{},{}];

  docs.forEach(async function(doc){   //ReferenceError: Invalid left-hand side in assignment
    await db.post(doc);
  });
}

//改写, 但依然顺序执行
async function fun(db){
  let docs = [{},{},{}];

  for(let doc of docs){
    await db.post(doc);
  }
}

//改写, 并发执行
async function fun(db){
  let docs = [{},{},{}];
  let promises = docs.map((doc) => db.post(doc));
  let result = await Promise.all(promises)
  console.log(result);
}

//改写, 并发执行
async function fun(db){
  let docs = [{},{},{}];
  let promises = docs.map((doc) => db.post(doc));
  let result = [];
  for(let promise of promises){
    result.push(await promise);
  }
  console.log(result);
}
```

### Promise，Generator 和 async 函数比较

这里我们实现一个简单的功能，可以直观的比较一下。实现如下功能：

> 在一个 DOM 元素上绑定一系列动画，每一个动画完成才开始下一个，如果某个动画执行失败，返回最后一个执行成功的动画的返回值

- Promise 方法
```js
function chainAnimationPromise(ele, animations){
  var ret = null;  //存放上一个动画的返回值
  var p = Promise.resolve();
  for(let anim of animations){
    p = p.then(function(val){
      ret = val;
      return anim(ele);
    });
  }
  return p.catch(function(e){
    /*忽略错误*/
  }).then(function(){
    return ret;  //返回最后一个执行成功的动画的返回值
  });
}
```

- Generator 方法
```js
function chainAnimationGenerator(ele, animations){
  return fun(function*(){
    var ret = null;
    try{
      for(let anim of animations){
        ret = yield anim(ele);
      }
    } catch(e) {
      /*忽略错误*/
    }
    return ret;
  });

  function fun(genF){
    return new Promise(function(resolve, reject){
      var gen = genF();
      function step(nextF){
        try{
          var next = nextF();
        } catch(e) {
          return reject(e);
        }
        if(next.done){
          return resolve(next.value);
        }
        Promise.resolve(next.value).then(function(data){
          step(function(){ return gen.next(data); });
        }, function(e){
          step(function(){ return gen.throw(e); });
        });
      }
      step(function() { return gen.next(undefined); });
    });
  }
}
```

- async 函数方法
```js
async function chainAnimationAsync(ele, animations){
  var ret = null;
  try{
    for(let anim of animations){
      ret = await anim(elem);
    }
  } catch(e){
    /*忽略错误*/
  }
  return ret;
}
```

## Class

### class声明

class 是 ES6 模仿面向对象语言(C++, Java)提出的定义类的方法。形式类似 C++ 和 Java (各取所长), 下面例子展示了 class 是如何定义构造函数、对象属性和对象动/静态方法的：
```js
class Point{
  constructor(x, y){    //定义构造函数
    this.x = x;         //定义属性x
    this.y = y;         //定义属性y
  }                     //这里没有逗号
  toString(){           //定义动态方法，不需要 function 关键字
    return `(${this.x},${this.y})`;
  }
  static show(){        //利用 static 关键字定义静态方法
    console.log("Static function!");
  }
}

var p = new Point(1,4);
console.log(p+"");               //(1,4)
console.log(typeof Point);       //"function"
console.log(Point.prototype.constructor === Point);    //true
console.log(Point.prototype.constructor === p.constructor);    //true
Point.show();      //"Static function!"
```
相当于传统写法：
```js
function Point(x, y){
  this.x = x;
  this.y = y;
}
Point.prototype.toString = function(){
  return `(${this.x},${this.y})`;
}
Point.show = function(){
  console.log("Static function!");
}
var p = new Point(1,4);
console.log(p+"");   //(1,4)
```

这里不难看出，class 的类名就是 ES5 中的构造函数名，静态方法就定义在其上，而类的本质依然是个函数。而 class 中除了 constructor 是定义的构造函数以外，其他的方法都定义在类的 prototype 上，这都和 ES5 是一致的，这就意味着，ES5 中原有的那些方法都可以用, 包括但不限于:

- `Object.keys()`, `Object.assign()` 等等
- 而且 class 也同样支持表达式做属性名，比如 Symbol
- ES5 函数具有的属性/方法：length、name、apply、call、bind、arguments 等等

但有些细节还是有区别的，比如：
```js
class Point{
  constructor(x, y){    //定义构造函数
    this.x = x;         //定义属性x
    this.y = y;         //定义属性y
  }                     //这里没有逗号
  toString(){           //定义动态方法，不需要 function 关键字
    return `(${this.x},${this.y})`;
  }
  getX(){
    return this.x;
  }
  getY(){
    return this.y;
  }
}
var p = new Point(1,4);
var keys = Object.keys(Point.prototype);
var ownKeys = Object.getOwnPropertyNames(Point.prototype);
console.log(keys);        //[]
console.log(ownKeys);     //["constructor", "toString", "getX", "getY"]
console.log(p.hasOwnProperty("toString"));                  //fales
console.log(p.__proto__.hasOwnProperty("toString"));        //true
```
```js
//ES5
function Point(x, y){
  this.x = x;
  this.y = y;
}
Point.prototype = {
  toString(){
    return `(${this.x},${this.y})`;
  },
  getX(){
    return this.x;
  },
  getY(){
    return this.y;
  }
}
var p = new Point(1,4);
var keys = Object.keys(Point.prototype);
var ownKeys = Object.getOwnPropertyNames(Point.prototype);
console.log(keys);        //["toString", "getX", "getY"]
console.log(ownKeys);     //["toString", "getX", "getY"]
console.log(p.hasOwnProperty("toString"));                  //fales
console.log(p.__proto__.hasOwnProperty("toString"));        //true
```
这个例子说明，class 中定义的动态方法是不可枚举的，并且 constructor 也是其自有方法中的一个。

使用 class 注意一下几点：

- class 中默认是严格模式，即使不写`"use strict`。关于严格模式可以看：[Javascript基础(2) - 严格模式特点](http://blog.csdn.net/faremax/article/details/56289671)
- 同名 class 不可重复声明
- class 相当于 object 而不是 map，不具有 map 属性，也不具有默认的 Iterator。
- constructor 方法在 class 中是必须的，如果没有认为指定，系统会默认生成一个空的 constructor
- 调用 class 定义的类必须有 new 关键字，像普通函数那样调用会报错。ES5 不限制这一点。
```js
TypeError: Class constructor Point cannot be invoked without 'new'
```
- constructor 方法默认返回值为 this，可以认为修改返回其他的值，但这会导致一系列奇怪的问题：
```js
class Point{
  constructor(x,y){
    return [x, y];
  }
}
new Point() instanceof Point;    //false
```
- class 声明类不存在变量提升
```js
new Point();     //ReferenceError: Point is not defined
class Point{}
```

### class 表达式

这个和面向对象不一样了，js 中函数可以有函数声明形式和函数表达式2种方式定义，那么 class 一样有第二种2种定义方式：class 表达式
```js
var className1 = class innerName{
  //...
};
let className2 = class innerName{
  //...
};
const className3 = class innerName{
  //...
};
```
class 表达式由很多特性和 ES5 一样：

- 和函数表达式类似，这里的innerName可以省略，而且innerName只有类内部可见，实际的类名是赋值号前面的 className。
- 这样定义的类的作用域，由其所在位置和声明关键字(var, let, const)决定
- const申明的类是个常量，不能修改。
- 其变量声明存在提升，但初始化不提升
- class 表达式也不能和 class 申明重名

ES5 中有立即执行函数，类似的，这里也有立即执行类：
```js
var p = new class {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  toString(){
    return `(${this.x},${this.y})`;
  }
}(1,5);   //立即生成一个对象
console.log(p+"");    //(1,5)
```

### getter, setter 和 Generator 方法

getter 和 setter 使用方式和 ES5 一样, 这里不多说了，举个例子一看就懂：
```js
class Person{
  constructor(name, age, tel){
    this.name = name;
    this.age = age;
    this.tel = tel;
    this._self = {};
  }
  get id(){
    return this._self.id;
  }
  set id(str){
    if(this._self.id){
      throw new TypeError("Id is read-only");
    } else {
      this._self.id = str;
    }
  }
}
var p = new Person("Bob", 18, "13211223344");
console.log(p.id);                //undefined
p.id = '30010219900101009X';
console.log(p.id);                //'30010219900101009X'

var descriptor = Object.getOwnPropertyDescriptor(Person.prototype, 'id');
console.log('set' in descriptor);       //true
console.log('get' in descriptor);       //true

p.id = '110';                     //TypeError: Id is read-only
```

Generator 用法也和 ES6 Generator 部分一样：
```js
class Person{
  constructor(name, age, tel){
    this.name = name;
    this.age = age;
    this.tel = tel;
    this._self = {};
  }
  *[Symbol.iterator](){
    var keys = Object.keys(this);
    keys = keys.filter(function(item){
      if(/^_/.test(item)) return false;
      else return true;
    });
    for(let item of keys){
      yield this[item];
    }
  }
  get id(){
    return this._self.id;
  }
  set id(str){
    if(this._self.id){
      throw new TypeError("Id is read-only");
    } else {
      this._self.id = str;
    }
  }
}
var p = new Person("Bob", 18, "13211223344");
p.id = '30010219900101009X';
for(let info of p){
  console.log(info);   //依次输出: "Bob", 18, "13211223344"
}
```

### class 的继承

这里我们只重点讲继承，关于多态没有新的修改，和 ES5 中一样，在函数内判断参数即可。关于多态可以阅读[Javascript对象(1) - 对象、类与原型链](http://blog.csdn.net/faremax/article/details/53525721)中关于`多态重构`的部分。

此外，class 继承属于 ES5 中多种继承方式的共享原型，关于共享原型也在上面这篇文章中讲解过。

class 实现继承可以简单的通过 extends 关键字实现, 而使用 super 关键字调用父类方法：
```js
//定义 '有色点'' 继承自 '点'
class ColorPoint extends Point{    //这里延用了上面定义的 Point 类
  constructor(x, y, color){
    super(x, y);     //利用 super 函数调用父类的构造函数
    this.color = color;
  }
  toString(){
    return `${super.toString()},${this.color}`;     //利用 super 调用父类的动态方法
  }
}
var cp = new ColorPoint(1, 5, '#ff0000');
console.log(cp+"");      //(1,5),#ff0000
ColorPoint.show();       //"Static function!"     静态方法同样被继承了
cp instanceof ColorPoint;   //true
cp instanceof Point;   //true
```

使用 extends 继承的时候需要注意一下几点：

- super 不能单独使用，不能访问父类属性，只能方法父类方法和构造函数(super本身)
- 子类没有自己的 this，需要借助 super 调用父类构造函数后加工得到从父类得到的 this，子类构造函数必须调用 super 函数。这一点和 ES5 完全不同。
- 子类如果没有手动定义构造函数，会自动生成一个构造函数，如下：
```js
constructor(...args){
  super(...args);
}
```
- 子类中使用 this 关键字之前，必须先调用 super 构造函数
- 由于继承属于共享原型的方式，所以不要在实例对象上修改原型(`Object.setPrototypeOf`, `obj.__proto__`等)
- super 也可以用在普通是对象字面量中：
```js
var obj = {
  toString(){
    return `MyObj ${super.toString()}`;
  }
}
console.log(obj+"");    //MyObj [object Object]
```

### `prototype` 和 `__proto__`

在 class 的继承中

- 子类的 `__proto__` 指向其父类
- 子类 prototype 的 `__proto__` 指向其父类的 prototype
```js
class Point{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}
class ColorPoint extends Point{
  constructor(x, y, color){
    super(x, y);
    this.color = color;
  }
}
ColorPoint.__proto__  === Point;   //true
ColorPoint.prototype.__proto__ === Point.prototype;   //true
```
其等价的 ES5 是这样的：
```js
function Point(){
  this.x = x;
  this.y = y;
}
function ColorPoint(){
  this.x = x;
  this.y = y;
  this.color = color;
}
Object.setPrototypeOf(ColorPoint.prototype, Point.prototype);    //继承动态方法属性
Object.setPrototypeOf(ColorPoint, Point);                        //继承静态方法属性

ColorPoint.__proto__  === Point;                      //true
ColorPoint.prototype.__proto__ === Point.prototype;   //true
```

这里我们应该理解一下3种继承的 prototype 和 `__proto__`：

1. 没有继承
```js

class A{}
A.__proto__  === Function.prototype;          //true
A.prototype.__proto__ === Object.prototype;   //true
```
2. 继承自 Object
```js
class A extends Object{}
A.__proto__  === Object;                      //true
A.prototype.__proto__ === Object.prototype;   //true
```
3. 继承自 null
```js
class A extends null{}
A.__proto__  === Function.prototype;        //true
A.prototype.__proto__ === undefined;        //true
```

判断类的继承关系：
```js
class A{}
class B extends A{}
Object.getPrototypeOf(B) === A;     //true
```

子类的实例的 `__proto__` 的 `__proto__` 指向其父类实例的 `__proto__`
```js
class A{}
class B extends A{}
var a = new A();
var b = new B();
B.__proto__.__proto__ === A.__proto__;        //true
```
因此，可以通过修改子类实例的 `__proto__.__proto__` 改变父类实例的行为。建议：

- 总是用 class 取代需要 prototype 的操作。因为 class 的写法更简洁，更易于理解。
- 使用 extends 实现继承，因为这样更简单，不会有破坏 instanceof 运算的危险。

此外存取器和 Generator 函数都可以很理想的被继承：
```js
class Person{
  constructor(name, age, tel){
    this.name = name;
    this.age = age;
    this.tel = tel;
    this._self = {};
  }
  *[Symbol.iterator](){
    var keys = Object.keys(this);
    keys = keys.filter(function(item){
      if(/^_/.test(item)) return false;
      else return true;
    });
    for(let item of keys){
      yield this[item];
    }
  }
  get id(){
    return this._self.id;
  }
  set id(str){
    if(this._self.id){
      throw new TypeError("Id is read-only");
    } else {
      this._self.id = str;
    }
  }
}

class Coder extends Person{
  constructor(name, age, tel, lang){
    super(name, age, tel);
    this.lang = lang;
  }
}

var c = new Coder("Bob", 18, "13211223344", "javascript");
c.id = '30010219900101009X';
for(let info of c){
  console.log(info);   //依次输出: "Bob", 18, "13211223344", "javascript"
}
console.log(c.id);     //'30010219900101009X'
c.id = "110";          //TypeError: Id is read-only
```

### 多继承

多继承指的是一个新的类继承自已有的多个类，JavaScript 没有提供多继承的方式，所以我们使用 Mixin 模式手动实现：
```js
function mix(...mixins){
  class Mix{}
  for(let mixin of mixins){
    copyProperties(Mix, mixin);                         //继承静态方法属性
    copyProperties(Mix.prototype, mixin.prototype);     //继承动态方法属性
  }

  return Mix;

  function copyProperties(target, source){
    for(let key of Reflect.ownKeys(source)){
      if(key !== 'constructor' && key !== "prototype" && key !== "name"){
        if(Object(source[key]) === source[key]){
          target[key] = {};
          copyProperties(target[key], source[key]);       //递归实现深拷贝
        } else {
          let desc = Object.getOwnPropertyDescriptor(source, key);
          Object.defineProperty(target, key, desc);
        }
      }
    }
  }
}

//使用方法：
class MultiClass extends mix(superClass1, superClass2, /*...*/){
  //...
}
```
由于 mixin 模式使用了拷贝构造，构造出的子类的父类是 mix 函数返回的 class, 因此 prototype 和 `__proto__` 与任一 superClass 都没有直接的联系，instanceof 判断其属于 mix 函数返回类的实例，同样和任一 superClass 都没有关系。可以这么说：我们为了实现功能破坏了理论应该具有的原型链。

### 原生构造函数继承

在 ES5 中，原生构造函数是不能继承的，包括： Boolean(), Number(), Date(), String(), Object(), Error(), Function(), RegExp()等，比如我们这样实现：
```js
function SubArray(){}
Object.setPrototypeOf(SubArray.prototype, Array.prototype);    //继承动态方法
Object.setPrototypeOf(SubArray, Array);                        //继承静态方法

var arr = new SubArray();
arr.push(5);
arr[1] = 10;
console.log(arr.length);     //1  应该是2
arr.length = 0;
console.log(arr);            //[0:5,1:10]  应该为空
```
很明显这已经不是那个我们熟悉的数组了！我们可以用 class 试试：
```js
class SubArray extends Array{}
var arr = new SubArray();
arr.push(5);
arr[1] = 10;
console.log(arr.length);     //2
arr.length = 0;
console.log(arr);            //[]
```
还是熟悉的味道，对吧！这就和之前提到的继承差异有关了，子类没有自己的 this，需要借助 super 调用父类构造函数后加工得到从父类得到的 this，子类构造函数必须调用 super 函数。而 ES5 中先生成子类的 this，然后把父类的 this 中的属性方法拷贝过来，我们都知道，有的属性是不可枚举的，而有的属性是 Symbol 名的，这些属性不能很好的完成拷贝，就会导致问题，比如 Array 构造函数的内部属性 `[[DefineOwnProperty]]`。

利用这个特性，我们可以定义自己的合适的类, 比如一个新的错误类：
```js
class ExtendableError extends Error{
  constructor(message){
    super(message);
    this.stack = new Error().stack;
    this.name = this.constructor.name;
  }
}
throw new ExtendableError("test new Error");   //ExtendableError: test new Error
```

### 静态属性

为何静态属性需要单独写，而静态方法直接简单带过。因为这是个兼容性问题，目前 ES6 的静态方法用 static 关键字，但是静态属性和 ES5 一样，需要单独定义:
```js
class A{}
A.staticProperty = "staticProperty";
console.log(A.staticProperty);      //"staticProperty"
```

不过 ES7 提出可以在 class 内部实现定义，可惜目前不支持，但是还好有 babel 支持：
```js
class A{
  static staticProperty = "staticProperty";   //ES7 静态属性
  instanceProperty = 18;                      //ES7 实例属性
}
console.log(A.staticProperty);                //"staticProperty"
console.log(new A().instanceProperty);        //18
```

### new.target 属性

new 本来是个关键字，但 ES6 给它添加了属性——`target`。该属性只能在构造函数中使用，用来判断构造函数是否作为构造函数调用的, 如果构造函数被 new 调用返回构造函数本身，否则返回 undefined：
```js
function Person(){
  if(new.target){
    console.log("constructor has called");
  } else {
    console.log("function has called");
  }
}

new Person();     //"constructor has called"
Person();         //"function has called"
```
这样我们可以实现一个构造函数，只能使用 new 调用：
```js
function Person(name){
  if(new.target === Person){
    this.name = name;
  } else {
    throw new TypeError("constructor must be called by 'new'");
  }
}

new Person('Bob');     //"constructor has called"
Person();              //TypeError: constructor must be called by 'new'
Person.call({});       //TypeError: constructor must be called by 'new'
```

这里需要注意：父类构造函数中的 new.target 会在调用子类构造函数时返回子类，因此使用了该属性的类不应该被实例化，只用于继承，类似于 C++ 中的抽象类。
```js
class Person{
  constructor(name){
    if(new.target === Person){
      this.name = name;
    } else {
      throw new TypeError("constructor must be called by 'new'");
    }
  }
}
class Coder extends Person{}
new Coder('Bob');     //TypeError: constructor must be called by 'new' 这不是我们想要的
```
```js
//抽象类实现
class Person{
  constructor(name){
    if(new.target === Person){
      throw new TypeError("This class cannot be instantiated");
    }
    this.name = name;
  }
}
class Coder extends Person{}
var c = new Coder('Bob');
console.log(c.name);   //'Bob'
new Person('Bob');     //TypeError: This class cannot be instantiated
```

关于抽象类这里解释一下，要一个类不能实例化只能继承用什么用？

>在继承中产生歧义的原因有可能是继承类继承了基类多次，从而产生了多个拷贝，即不止一次的通过多个路径继承类在内存中创建了基类成员的多份拷贝。抽象类的基本原则是在内存中只有基类成员的一份拷贝。举个例子，一个类叫"动物"，另有多各类继承自动物，比如"胎生动物"、"卵生动物"，又有多个类继承自哺乳动物, 比如"人", "猫", "狗"，这个例子好像复杂了，不过很明显，被实例化的一定是一个个体，比如"人", "猫", "狗"。而"胎生动物"，不应该被实例化为一个个体，它仅仅是人类在知识领域，为了分类世间万物而抽象的一个分类。但是面向对象设计要求我们把共性放在一起以减少代码，因此就有了抽象类。所以胎生动物都会运动，都可以发出声音，这些就应该是共性放在"胎生动物"类中，而所以动物都会呼吸，会新陈代谢，这些共性就放在动物里面，这样我们就不需要在"人", "猫", "狗"这样的具体类中一遍遍的实现这些共有的方法和属性。

## 修饰器

### 修饰器

修饰器是 ES7 提出的一个提案，用来修改类的行为。目前需要 babel 才可以使用。它最大的特点是：可以在编译期运行代码！其本质也就是在编译器执行的函数。其执行格式如下：
```js
@decorator    //decorator 是修饰器名，即函数名
class A{}
//相当于
class A{}
A = decorator(A) || A;
```
修饰器函数接受3个参数，依次是目标函数、属性名(可忽略)、该属性的描述对象(可忽略)。
```js
function test(target){
  target.isTestable = true;               //利用修饰器给类添加静态属性
  target.prototype.isTestable = true;     //利用修饰器给类添加动态属性
}

@test
class A{}

console.log(A.isTestable);       //true
console.log(new A().isTestable);   //true
```

例如之前的 mixin 可以用修饰器实现一个简单的版本：
```js
function mixins(...list){
  return function(target){
    Object.assign(target.prototype, ...list);
  }
}
var Foo = {
  foo(){console.log("foo");}
};
@mixins(Foo)
class Cla{}
let obj = new Cla();
obj.foo();     //"foo"
```

修饰器不仅仅可以修饰类，还可以修饰类的属性和方法：
```js
function readonly(target, name, descriptor){
  descriptor.writable = false;
  return descriptor;
}

class Person{
  constructor(name, age, tel){
    this.name = name;
    this.id = id;
  }
  @readonly
  id(){return this.id};
}
```
当然也可以同时调用2个修饰器：
```js
function readonly(target, name, descriptor){
  descriptor.writable = false;
  return descriptor;
}
function nonenumerable(target, name, descriptor){
  descriptor.enumerable = false;
  return descriptor;
}

class Person{
  constructor(name, age, tel){
    this.name = name;
    this.id = id;
  }
  @readonly
  @nonenumerable
  id(){return this.id};
}
```

使用修饰器应该注意：虽然类本质是个函数，但修饰器不能用于函数，因为函数具有声明提升。

### core-decroators.js

这是个三方模块，使用`import {function Namelist} from 'core-decroators';`引入。它提供了几个常见的修饰器：

- @autobind
是对象中的 this 始终绑定原始对象：
```js
class Person{
  @autobind
  whoami(){
    return this;
  }
}
let person = new Person();
let getPerson = person.getPerson;

getPerson() === person;    //true
```

- @readonly
使得属性方法只读
```js
class Person{
  @readonly
  id = gen();     //gen 是一个计数器
}
var p = new Person()
p.id = 123;   //Cannot assign to read only property 'id' of [object Object]
```

- @override
检查子类方法是否正确的覆盖了父类的同名方法，如果不正确会报错
```js
class Person{
  work(){console.log("I am working");}
}
class Coder extends Person{
  @override
  work(){console.log("I am coding");}   //如果不正确会在这里报错
}
```

- @deprecate(也作: @deprecated)
在控制台显示一条 warning，表示该方法不久后将被废除，接受一个可选的参数作为警告内容, 接受第二个参数(对象)表示更多信息
```js
class Person{
  @deprecate
  facepalm(){}

  @deprecate('We stopped facepalming')
  facepalmHard(){}

  @deprecate('We stopped facepalming', {url:'http://balabala.com'})
  facepalmHarder(){}
}
```

- @suppressWarnings
抑制 deprecate 修饰器导致调用 console.warn(), 但异步代码发出的除外。
```js
class Person{
  @deprecate
  facepalm(){}

  @supressWarnings
  facepalmWithoutWarning(){
    this.facepalm();
  }
}
let p = new Person();
p.facepalm();    //控制台显示警告
p.facepalmWithoutWarning();    //没有警告
```

### 其它第三方修饰器

此外还有一些库提供一些其他功能，比如 Postal.js([Github](https://github.com/postaljs/postal.js))中的 `@publish`, 可以在函数调用时发布一个事件：
```js
import publish from "../to/decorators/publish";

class FooComponent{
  @publish("foo.some.message", "component")
  someMethod(){}

  @publish("foo.some.other", "")
  anotherMethod(){}
}
```

再比如 Trait([Github](https://github.com/CkcktailJS/traits-decorator)), 和 mixin 功能类似，提供了更强大的功能：防止同名冲突，排除混入某些方法，为混入方法起别名等
```js
import {traits} from 'traits-decorator'

class TFoo{
  foo(){console.log("foo1")}
}
class TBar{
  bar(){console.log("bar")}
  foo(){console.log("foo2")}
}

@traits(TFoo, TBar)       //会报错，因为这两个类中有同名方法
class MyClass{}

let obj = new MyClass();
//如果没有第八行的同名方法，输出如下
obj.foo();   //"foo1"
obj.bar();   //"bar"
```
但是我们可以修改上面第11行排除这个 foo，让它可以被覆盖：
```js
@traits(TFoo, TBar::excludes('foo'))
class MyClass{}
```
也可重命名同名方法：
```js
@traits(TFoo, TBar::alias(foo:'aliasFoo'))
class MyClass{}
```
当然绑定运算符可以链式调用：
```js
//假设还有个同名的 baz 方法
@traits(TFoo, TBar::excludes('foo')::alias(baz:'aliasBaz'))
class MyClass{}

//另一种写法
@traits(TFoo, TBar::as({excludes: ['foo'], alias: {baz:'aliasBaz'}}))
class MyClass{}
```

## Module

### 认识模块

JS 作为一名编程语言，一直以来没有模块的概念。严重导致大型项目开发受阻，js 文件越写越大，不方便维护。其他语言都有模块的接口，比如 Ruby 的 require，python 的 import，C++ 天生的 #include，甚至 CSS 都有 @import。在 ES6 之前，有主要的2个模块化方案：CommonJS 和 AMD。前者用于服务器，后者用于浏览器。CommonJS 这样引入模块：
```js
let {stat, exists, readFile} = require('fs');
```

AMD 和 CommonJS 引入模块方法差不多，其代表是 require.js。这里我们主要研究 ES6 提供的方法：
```js
import {stat, exists, readFile} from 'fs'
```
这个方法相比之前的方案，具有以下优点：

- 最大的优点就是编译的时候完成模块加载，称之为"编译时加载", 而 CommonJS 使用的是 "运行时加载"。明显 ES6 效率更高
- 不再需要 UMD 模块格式，未来服务器和浏览器一定都能支持这种方法
- 将来浏览器 API 可以用模块的格式提供，不需要做成全局变量或 navigator 的属性
- 不需要反复的封装和定义命名空间，直接以模块形式提供即可
- 模块默认工作在严格模式，即使没有指定"use strict", 关于严格模式可以看：[Javascript基础(2) - 严格模式特点](http://blog.csdn.net/faremax/article/details/56289671)
- 一个模块就是一个文件，有效地减少了全局变量污染

### export 和 import

模块功能主要由2个命令组成：export 和 import。export 关键字用于规定模块的对外接口，import 关键字用于输入其他模块提供的功能。这里需要知道的是，ES6 中模块导出的都会构成一个对象。

- export 导出模块的部分方法属性或类
```js
export var a = 1;
export var b = 2;
export var c = 3;
```
上面导出了3个变量，和下面的下法等价：
```js
var a = 1;
var b = 2;
var c = 3;
export {a, b, c};    //这种写法更好，在文件结尾统一导出，清晰明了
```
当然还可以导出函数和类
```js
//导出一个函数 add
export function add(x,y){
  return x + y;
}
//导出一个类
export default class Person{}
```
还可以在导出时候对参数重命名：
```js
function foo(){}
function bar(){}

export {foo, bar as bar2, bar as bar3}     //bar 被重命名为 bar2,bar3输出了2次
```

- import 导入命令可以导入其他模块通过 export 导出的部分
```js
// abc.js
var a = 1;
var b = 2;
var c = 3;
export {a, b, c}

//main.js
import {a, b, c} from './abc';      //接受的变量用大括号表示，以解构赋值的形式获取
console.log(a, b, c);
```
导入的时候也可以为变量重新取一个名字
```js
import {a as aa, b, c};
console.log(aa, b, c)
```
如果想在一个模块中先输入后输出同一个模块，import语句可以和export语句写在一起。
```js
// 正常写法
import {a, b, c} form './abc';
export {a, b, c}

// 使用简写, 可读性不好，不建议
export {a, b, c} from './abc';

//ES7 提议，在简化先输入后输出的写法。现在不能使用，也不建议使用，可读性不好
export a, b, c from './abc'
```

使用 import 和 export 需要注意一下几个方面：

- export 必须写在所在模块作用于的顶层。如果写在了内部作用于会报错
- export 输出的值是动态绑定的，绑定在其所在的模块。
```js
// foo.js
export var foo = 'foo';

setTimeout(function() {
  foo = 'foo2';
}, 500);

// main.js
import * as m from './foo';
console.log(m.foo); // foo
setTimeout(() => console.log(m.foo), 500); //foo2            500ms 后同样会被修改
```
- import 具有声明提升，而且会提升到整个文件最上面
- import 获得的变量都是只读的，修改它们会报错
- 在 export 输出内容时，如果同时输出多个变量，需要使用大括号{}，同时 import 导入多个变量也需要大括号
- import 引入模块的默认后缀是 .js, 所以写的时候可以忽略 js 文件扩展名
- import 会执行要所加载的模块。如下写法仅仅执行一个模块，不引入任何值
```js
import './foo';    //执行 foo.js 但不引入任何值
```

### 模块整体加载

当然模块可以作为整体加载，使用*关键字，并利用 as 重命名得到一个对象，所有获得的 export 的函数、值和类都是该对象的方法：
```js
// abc.js
export var a = 1;
export var b = 2;
export var c = 3;

// main.js
import * as abc from './abc';
console.log(abc.a, abc.b, abc.c);
```
上面 main.js 中的整体加载可以用 module 关键字实现：
```js
//暂时无法实现
module abc from './abc';
console.log(abc.a, abc.b, abc.c);   //1 2 3
```

注意，以上2种方式获得的接口，不包括 export default 定义的默认接口。

### export default

为了使模块的用户可以不看文档，或者少看文档，输出模块的时候利用 export default 指定默认输出的接口。使用 export defalut 输出时，不需要大括号，而 import 输入变量时，也不需要大括号(没有大括号即表示获得默认输出)
```js
// abc.js
var a = 1, b = 2, c = 3;
export {a, b};
export default c;     //等价于 export default 3;

// main.js
import {a, b} from './abc';
import num from './abc';        // 不需要大括号, 而且可以直接改名(如果必须用原名不还得看手册么?)
console.log(a, b, num)            // 1 2 3
```
本质上，export default输出的是一个叫做default的变量或方法，输入这个default变量时不需要大括号。
```js
// abc.js
var a = 20;
export {a as default};

// main.js
import a from './abc'; // 这样也是可以的
console.log(a);        // 20

// 这样也是可以的
import {default as aa} from './abc';
console.log(aa);       // 20
```

如果需要同时输入默认方法和其他变量可以这样写 import:
```js
import customNameAsDefaultExport, {otherMethod}, from './export-default';
```

这里需要注意：一个模块只能有一个默认输出，所以 export default 只能用一次

### 模块的继承

所谓模块的继承，就是一个模块 B 输出了模块 A 全部的接口，就仿佛是 B 继承了 A。利用 `export *` 实现：
```js
// circleplus.js
export * from 'circle';            //当然，这里也可以选择只继承其部分接口，甚至可以对接口改名
export var e = 2.71828182846;
export default function(x){        //重新定义了默认输出，如果不想重新定义可以：export customNameAsDefaultExport from 'circle';
  return Math.exp(x);
}

//main.js
import * from 'circleplus';        //加载全部接口
import exp from 'circleplus';      //加载默认接口
//...use module here
```
上面这个例子 circleplus 继承了 circle。值得一提的是，`export *` 不会再次输出 circle 中的默认输出(export default)。

在使用和定义模块时，希望可以做到以下几个建议：

- Module 语法是 JavaScript 模块的标准写法，坚持使用这种写法。使用 import 取代 require, 使用 export 取代module.exports
- 如果模块只有一个输出值，就使用 export default，如果模块有多个输出值，就不使用 export default
- 尽量不要 export default 与普通的 export 同时使用
- 不要在模块输入中使用通配符。因为这样可以确保你的模块之中，有一个默认输出(export default)
- 如果模块默认输出一个函数，函数名的首字母应该小写；如果模块默认输出一个对象，对象名的首字母应该大写

### ES6 模块加载的实质

ES6 模块加载的机制是值的应用，而 CommonJS 是值的拷贝。这意味着， ES6 模块内的值的变换会影响模块外对应的值，而 CommonJS 不会。 ES6 遇到 import 时不会立刻执行这个模块，只生成一个动态引用，需要用的时候再去里面找值。有点像 Unix 中的符号链接。所以说 ES6的模块是动态引用，不会缓存值。之前的这个例子就可以说明问题：
```js
// foo.js
export let counter = 3;
export function inc(){
  counter++;
}

// main.js
import {counter, inc} from './foo';
console.log(counter);    //3
inc();
console.log(counter);    //4
```
我们看一个 CommonJS 的情况
```js
// foo.js
let counter = 3;
function inc(){
  counter++;
}
module.exports = {
  counter: counter,
  inc: inc
}

// main.js
let foo = require('./foo')
let counter = foo.counter;
let inc = foo.inc;

console.log(counter);    //3
inc();
console.log(counter);    //3
```

### 循环加载

不知道你们只不知道循环引用，在 [js 垃圾回收机制](http://blog.csdn.net/faremax/article/details/58086991)中提到过：如果 A 对象的一个属性值是 B 对象，而 B 对象的一个属性值是 A 对象，就会形成循环引用，无法释放他们的内存。而模块中也会出现循环加载的情况：如果 A 模块的执行依赖 B 模块，而 B 模块的执行依赖 A 模块，就形成了一个循环加载，结果程序不能工作，或者死机。然而，这样的关系很难避免，因为开发者众多，谁都会在开发自己的模块时使用别人的几个模块，久而久之，就行互联网一样，这样的依赖也织成了一个网。

ES6 和 CommonJS 处理循环加载又不一样，从 CommonJS 开始研究

- CommonJS
CommonJS 每次执行完一个模块对应的 js 文件后在内存中就生成一个对象：
```json
{
  id: '...',           //表示属性的模块名
  exports: {...};      //模块输出的各个接口
  loaded: true,        //表示是否加载完毕
  //...内容很多，不一一列举了
}
```
之后使用这个模块，即使在写一遍 requrie，都不会再执行对应 js 文件了，会直接在这个对象中取值。
CommonJS 如果遇到循环加载，就输出已执行的部分，之后的不再执行，执行顺序以注释序号为准(从0开始)：
```js
// a.js
exports.done = false;         //1. 先输出 done
var b = require('./b.js');    //2. 进入 b.js 执行 b.js    //5. 发现 a.js 没执行完，那就重复不执行 a.js，返回已经执行的 exports
console.log(`In a.js, b.done = ${b.done}`);     //10. 第2步的 b.js 执行完了，继续执行 a.js 得到控制台输出：'In a.js, b.done = true'
exports.done = true;          //11
console.log('a.js executed');  //12. 得到控制台输出："a.js executed"

// b.js
exports.done = false;         //3. 先输出 done
var a = require('./a.js');    //4. 执行到这里发生循环加载，去 a.js 执行 a.js     //6. 只得到了 a.js 中的 done 为 false
console.log(`In b.js, a.done = ${a.done}`);       //7. 得到控制台输出："In b.js, a.done = false"
exports.done = true;     //8. 输出 done, 覆盖了第3步的输出
console.log('b.js executed');     //9. 得到控制台输出："b.js executed"

//main.js
var a = require("./a.js");    //0. 去 a.js 执行 a.js
var b = require("./b.js");    //13. b.js 已经执行过了，直接去内存中的对象取值
console.log(`In main，a.done = ${a.done}, b.done = ${b.done}`)    //得到控制台输出：'In main，a.done = true, b.done = true'
```

- ES6
由于 ES6 使用的是动态引用，遇到 import 时不会执行模块。所以和 CommonJS 有本质的区别。同样我们看个例子：
```js
// a.js
import {bar} from './b.js';
export function foo(){
  bar();
  console.log("finished")
}

// b.js
import {foo} from './a.js';
export function bar(){
  foo();
}

//main.js
import * from './a.js';
import * from './b.js';
//...
```
上面这段代码写成 CommonJS 形式是无法执行的，应为 a 输出到 b 的接口为空(null), 所以在 b 中调用 foo() 要报错的。但是 ES6 可以执行，得到控制台输出"finished"

另一个例子是这样的。执行顺序以注释序号为准(从0开始)：
```js
// even.js
import {odd} from './odd';         //2. 得到 odd.js 动态引用，但不执行
export var counter = 0;            //3. 输出 counter 的引用
export function even(n){           //4. 输出 even 函数的引用
  counter++;                       //6
  return n === 0 || odd(n - 1);    //7. n 不是 0, 去 odd.js 找 odd() 函数    //10. 执行 odd 函数，传入9
}

// odd.js
import {even} from './even';       //8. 得到 even.js 动态引用，但不执行
export function odd(n){            //9. 输出 odd 函数
  return n !== 0 && even(n - 1);   //11. 回到第2步，找到 even 函数，回来执行，传入8，直到 n 为 0 结束
}

// main.js
import * as m from './even';    //0. 得到 even.js 动态引用，但不执行
console.log(m.even(10));     //1. 去 even.js 找 even 函数。 //5. 执行函数，传入10   //最终得到控制台输出：true
console.log(m.counter);      //由于 ES6 模块传值是动态绑定的(下同)，所以得到控制台输出：6
console.log(m.even(20));     //分析同上，得到控制台输出：true
console.log(m.counter);      //得到控制台输出：17
```
上面写了11步，之后是一个循环，没有继续写。但不难看出 ES6 根本不怕循环引用，只要模块文件的动态引用在，就可以计算完成。不过，别看这个过程比 CommonJS 复杂，每次都有重新运行模块文件，而不直接读取缓存，但 ES6 的这些工作在编译期间就完成了，比 CommonJS 在运行时间处理模块要效率更高，体验更好。











