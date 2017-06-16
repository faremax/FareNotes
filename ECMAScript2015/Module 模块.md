<!-- MarkdownTOC -->

- [认识模块](#%E8%AE%A4%E8%AF%86%E6%A8%A1%E5%9D%97)
- [export 和 import](#export-%E5%92%8C-import)
- [模块整体加载](#%E6%A8%A1%E5%9D%97%E6%95%B4%E4%BD%93%E5%8A%A0%E8%BD%BD)
- [export default](#export-default)
- [模块的继承](#%E6%A8%A1%E5%9D%97%E7%9A%84%E7%BB%A7%E6%89%BF)
- [ES6 模块加载的实质](#es6-%E6%A8%A1%E5%9D%97%E5%8A%A0%E8%BD%BD%E7%9A%84%E5%AE%9E%E8%B4%A8)
- [循环加载](#%E5%BE%AA%E7%8E%AF%E5%8A%A0%E8%BD%BD)

<!-- /MarkdownTOC -->

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
- 模块默认工作在严格模式，即使没有指定"use strict", 关于严格模式可以看：[Javascript基础(2) - 严格模式特点](https://github.com/faremax1992/repoForBlog/blob/master/Javascript/%E4%B8%A5%E6%A0%BC%E6%A8%A1%E5%BC%8F%E7%89%B9%E7%82%B9.md)
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

不知道你们只不知道循环引用，在 [js 垃圾回收机制](https://github.com/faremax1992/repoForBlog/blob/master/Javascript/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86%E4%B8%8E%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6.md)中提到过：如果 A 对象的一个属性值是 B 对象，而 B 对象的一个属性值是 A 对象，就会形成循环引用，无法释放他们的内存。而模块中也会出现循环加载的情况：如果 A 模块的执行依赖 B 模块，而 B 模块的执行依赖 A 模块，就形成了一个循环加载，结果程序不能工作，或者死机。然而，这样的关系很难避免，因为开发者众多，谁都会在开发自己的模块时使用别人的几个模块，久而久之，就行互联网一样，这样的依赖也织成了一个网。

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
