## let, const和块级作用域

块级作用于对于强类型语言经验的人应该非常好理解, 一言以蔽之：ES5对变量作用于分隔使用了函数(词法作用域), 而ES6使用花括号(块作用域)。
对于词法作用域在 [javascript函数、作用域链与闭包](http://blog.csdn.net/faremax/article/details/53201809) 中有详细的解释。对于let 和 const声明的变量在花括号的分割下同样会形成作用于链(内部访问外部的, 但外部不能访问内部)。但是花括号对于没有声明直接定义以及用 var 声明的变量没有影响, 这些变量依然遵守词法作用域规则。

对于let 和 const 最大的好处就是避免了可能的运行时错误, 不过也有直观的好处：

- 用块(Blocks)替换立即执行函数(IIFEs)
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
- 可以放心的在 if 等条件中定义函数
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
- 定义循环变量不会外泄
- 循环定义函数可以不用闭包了
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
