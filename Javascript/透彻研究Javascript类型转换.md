<!-- MarkdownTOC -->

- [typeof 运算](#typeof-%E8%BF%90%E7%AE%97)
- [强制类型转换\(手动类型转换\)](#%E5%BC%BA%E5%88%B6%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E6%89%8B%E5%8A%A8%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)
  - [利用自动类型转换简单的实现手动类型转换](#%E5%88%A9%E7%94%A8%E8%87%AA%E5%8A%A8%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E7%AE%80%E5%8D%95%E7%9A%84%E5%AE%9E%E7%8E%B0%E6%89%8B%E5%8A%A8%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)
  - [对象类型和基本类型的关系](#%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B%E5%92%8C%E5%9F%BA%E6%9C%AC%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%85%B3%E7%B3%BB)
- [隐式类型转换\(自动类型转换\)](#%E9%9A%90%E5%BC%8F%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E8%87%AA%E5%8A%A8%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)
  - [数值加法和字符串连接](#%E6%95%B0%E5%80%BC%E5%8A%A0%E6%B3%95%E5%92%8C%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%BF%9E%E6%8E%A5)
  - [null 和 undefined](#null-%E5%92%8C-undefined)
  - [关于 `==` 和 `!=`](#%E5%85%B3%E4%BA%8E--%E5%92%8C-)
  - [关于 `===` 和 `!==`](#%E5%85%B3%E4%BA%8E--%E5%92%8C--1)
  - [toLocaleString 和 toString](#tolocalestring-%E5%92%8C-tostring)
  - [Infinity](#infinity)
  - [javascript精度](#javascript%E7%B2%BE%E5%BA%A6)
  - [\[\] 和 {}](#-%E5%92%8C-)
- [ES6 中的类型转换和坑](#es6-%E4%B8%AD%E7%9A%84%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E5%92%8C%E5%9D%91)
  - [label 和 块作用域](#label-%E5%92%8C-%E5%9D%97%E4%BD%9C%E7%94%A8%E5%9F%9F)
  - [解构赋值](#%E8%A7%A3%E6%9E%84%E8%B5%8B%E5%80%BC)
  - [模板字符串和对象中的类型转换](#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%92%8C%E5%AF%B9%E8%B1%A1%E4%B8%AD%E7%9A%84%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)
  - [展开运算符](#%E5%B1%95%E5%BC%80%E8%BF%90%E7%AE%97%E7%AC%A6)
  - [try catch 语句](#try-catch-%E8%AF%AD%E5%8F%A5)
  - [class 类](#class-%E7%B1%BB)
- [还未解决的问题](#%E8%BF%98%E6%9C%AA%E8%A7%A3%E5%86%B3%E7%9A%84%E9%97%AE%E9%A2%98)
- [另一个更好的 typeOf 函数](#%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%9B%B4%E5%A5%BD%E7%9A%84-typeof-%E5%87%BD%E6%95%B0)

<!-- /MarkdownTOC -->

Javascript 中有5种基本类型(不包括 symbol)，以及对象类型，他们在不同的运算中会被系统转化为不同是类型，当然我们也可以手动转化其类型。

Javascript 类型转换中的坑极多，就连 _Douglas Crockford_ 在 《Javascript: The Good Parts》一书中也极力 '吐槽' 。下面我们来自习研究一下这个部分，希望不要把自己绕晕。

## typeof 运算

在解释各个类型之前，我们需要理解 `typeof` 运算。该运算得到对象的类型：
```js
typeof 2;          //number
typeof 'abc';      //string
typeof true;       //boolean
typeof undefined;  //undefined
typeof new Date(); //object
typeof null;       //object
typeof NaN;        //number,   NaN 即 Not a Number，表示一个非法值。
typeof [1,2,3]:    //object
typeof /^\d*$/;    //object
function fn(){}    //定义一个函数
typeof fn;         //function
```
通过上面例子我们可以很明显的看到，除了基本类型以外的类型，都是对象，但是有例外：`null` 的 typeof 值是 `'object'` 【坑1】, 函数的 typeof 值是 `'function'` ! (函数对象的构造函数是 Function，也就继承了 Function 的原型)【坑2】

而且我们不难发现，`NaN` 的类型也是 `'number'`，这个地方也是矛盾十足【坑3】

注意：本文的测试在现在最新浏览器上进行，老版本浏览器可能有所不同。比如Safari 3.X中`typeof /^\d*$/;`为`'function'`【坑4:兼容性复杂】。

不是所有对象都是返回 object，而且还有 null 捣乱，那我们如何判断一个值的类型呢？这个问题超过了本篇文章的知识范围，但我会实现一个 typeof 函数，可以更好的取代这个 typeof 运算符。为了不让读者和下文内容混了，我把它放在了文章末尾。

## 强制类型转换(手动类型转换)

对于基本类型而言，数值类、布尔类和字符串类具有其对应的对象类型，其构造函数在没有`new`关键字调用的时候是类型转换函数，使用方法如下：
```js
var num =  Number('43');          //43
typeof num;                       //number
var str = String(num);            //'43'
var flag = Boolean(num);          //true
```
具体的转换规律参看下表：

原始类型 | 目标类型(string) | 目标类型(number) | 目标类型(boolean) | 目标类型(object)
--- | --- | --- | --- | ---
undefined | "undefined" | NaN | false | throw TypeError
null | "null" | 0 | false | throw TypeError
true | "true" | 1 | - | new Boolean(true)
false | "false" | 0 | - | new Boolean(false)
"" | - | 0 | false | new String("")
"1.2" | - | 1.2 | true | new String("1.2")
"1.2a" | - | NaN | true | new String("1.2a")
"a" | - | NaN | true | new String("a")
0 | "0" | - | false | new Number(0)
-0 | "0" | - | false | new Number(-0)
NaN | "NaN" | - | false | new Number(NaN)
Infinity | "Infinity" | - | true | new Number(Infinity)
-Infinity | "-Infinity" | - | true | new Number(-Infinity)
1 | "1" | - | true | new Number(1)
{} |  toPrimitive | toPrimitive | true |  -
[] | "" | 0 | true |  -
[9] | "9" | 9 | true |  -
['a', 'b'] | "a,b" | NaN | true |  -
function | 函数源代码 | NaN | true |  -

- 注释1: 对于 toPrimitive 会在下文详细解释。
- 注释2：只有空字符串(`""`)、`null`、`undefined`、`0` 和 `NaN` 的布尔型是 `false`，其他的都是 `true`。
- 注释3：空数组、空对象转换为布尔型也是 true【坑5】。
- 注释4：`null` 和 `undefined` 转换为数字是表现不一，分别为`NaN`和`0`。【坑6】

有个东西需要单独说明：
字符串转换为数字，除了 `Number()` 还有 `parseInt()` 和 `parseFloat()` 函数。他们是有区别的：
- `parseInt()` 将输入值转化为整数；`parseFloat()` 如果输入的是小数(或具有可转换小数的字符串)转换为小数，如果输入是个整数依然返回整数【坑7】：
```js
console.log(parseFloat(" 6.2 "));     //6.2
console.log(parseFloat("10"));        //10
```
- `parseFloat()` 可以转换以“点 + 数字”可是开头的字符，其默认整数部分为`0`；`parseInt()`不行，会返回`NaN`：
```js
console.log(parseInt('.21'));        //NaN
console.log(parseFloat('.21'));      //0.21
console.log(parseFloat('.0d'));      //0
```
- `parse***()` 函数可以转换以数字开头(或开头有正负号)的所有字符串，遇到无法转换的字母或符号停止转换，返回已转换的部分。对于不能转换的字符串返回`NaN`：
```js
console.log(parseInt("10.3"));        //10
console.log(parseFloat('.d1'));       //NaN
console.log(parseFloat("10.11.33"));  //10.11
console.log(parseFloat("4.3years"));  //4.3
console.log(parseFloat("He40.3"));    //NaN
```
- `parseInt()`在没有第二个参数时默认以十进制转换数值，有第二个参数时，以第二个参数为基数转换数值，如果基数有误返回`NaN`：
```js
console.log(parseInt("13"));          //13
console.log(parseInt("11",2));        //3
console.log(parseInt("17",8));        //15
console.log(parseInt("1f",16));       //31
```
- `Number()` 参数不支持参数中有不符合数字规范的任何符号，不满足此要求返回`NaN`, 对于满足此要求的参数，返回十进制数值(整数或浮点数)
```js
console.log(Number("19"));       //19
console.log(Number("1.2f"));       //NaN
console.log(Number("-10.3"));     //-10.3
console.log(Number("10.3.3"));     //NaN
```
- `parseInt()` 和 `Number()` 也支持 '0x' 或 '0X' 引导的十六进制，但不支持 '0' 引导的八进制【坑8】：
```js
console.log(parseInt("010"));         //10
console.log(parseInt("0x20"));        //32
console.log(parseInt("-0x20"));       //-32
console.log(Number("010"));      //10
console.log(Number("0x20"));     //32
```
- 但是 Number 不支持负的十六进制【坑9】：
```js
console.log(Number("-0x20"));    //NaN
```
- `parseInt()` 和 `Number()` 都会忽略字符串首尾的空格，但`parseInt()` 不会忽略格式化字符，而`Number()` 会将格式化字符与空格一起忽略【坑10】
```js
Number("  34\n\t ");    //34
Number("  \t34 ");     //34
Number("  3\t\n4 ");    //NaN,   不和开头结尾的空格一起的格式化字符不会被忽略
parseInt("  \t34 ");     //NaN
```
- 他们对空字符串的处理也不一样【坑11】
```js
Number("   ");     //0,   空格被忽略了，所以 "    " 等价于 ""
parseInt("   ");     //NaN,   空格被忽略了，所以 "    " 等价于 ""
```
- 进制转换不局限在十六进制，js 会利用 0=9 和 A-Z 进行最高36进制的数制转换:
```js
parseInt('f*ck');     // -> NaN
parseInt('f*ck', 16); // -> 15

parseInt(null, 24) // -> 23

parseInt('Infinity', 10) // -> NaN
// ...
parseInt('Infinity', 18) // -> NaN...
parseInt('Infinity', 19) // -> 18
// ...
parseInt('Infinity', 23) // -> 18...
parseInt('Infinity', 24) // -> 151176378
// ...
parseInt('Infinity', 29) // -> 385849803
parseInt('Infinity', 30) // -> 13693557269
// ...
parseInt('Infinity', 35) // -> 1201203301724
parseInt('Infinity', 36) // -> 1461559270678...
parseInt('Infinity', 37) // -> NaN
```
- 对于 Number() 而言，不传值和传入 undefiend 是不一样的【坑12】:
```js
Number()          // -> 0
Number(undefined) // -> NaN
```


### 利用自动类型转换简单的实现手动类型转换

这个部分利用一些简单运算会自己调用相关函数，实现转换可以简化代码。需要说明的是：_Douglas Crockford_ 在 《Javascript: The Good Parts》书中推荐使用这个方法转换类型，而不是手写函数调用，因为以下方法执行效率更高。

```js
// 任意值 => 字符串
var str = "" + 2;              //"2"
// 任意值 => 数字
var num = +"2";                //2
// 任意值 => 布尔
var str = !!2;                 //"2"
// 数值取整数
var integer = ~~3.1415926;     //3，这个不涉及类型转换
// 数值取小数
var decimals = 3.1415926 % 1;  //0.14159260000000007，这个不涉及类型转换
```

### 对象类型和基本类型的关系

刚才我们解释了基本变量的类型转换，但没有举例一个基本变量和对象之间的转换关系。在研究其关系之前，我们需要知道 new 关键字可以生成一个对象，new 后面的函数成为构造函数。

```js
var str = new String(32);           //String{...}
var num = new Number('22');         //Number{...}
var flag = new Boolean('hello');    //Boolean{...}
// 这里的参数也是会发生对应类型转换的，但得到的是对象
typeof str;       //object
typeof num;       //object
typeof flag;      //object
```
js中每一个对象，都是继承自 Object 原型的(除非你手动实现一个不继承自 Object 的对象)，这里我们暂不讨论原型。对于 String(), Number() 和 Boolean() 得到的对象都具有一个名为`[[PrimitiveValue]]
`的属性，改属性是对象对应的原始值，即基本类型变量。

默认地，每个对象都有一个`toString()`方法和一个`valueOf()`方法，当需要获取对象原始值(`[[PrimitiveValue]]`)时候，调用`valueOf()`方法，需要获取字符串时调用`toString()`方法。

系统会在自动类型转换的时候调用他们，所以我们通常不需要手动调用他们。在文件引入下面这段 js 可以通过控制台清晰的看的每一次隐式调用(这是准备工作)

隐式类型转换不仅仅适用 `toString()` 和 `valueOf()`，比如基本类型转换为对象依然是使用 `new` 关键字，比如字符串转换为数字，使用 `Number()`。

## 隐式类型转换(自动类型转换)

由于 js 是个弱类型语言，所以不是所有运算都要去类型一致，Js 为了一些运算可以执行，使用了隐式类型转换。也就是说，在一些计算中，系统会悄悄的完成类型转换，比如以下情况：
```js
(3.1415926).toFixed(2);      //3.14,  由于数字是基本类型不具备方法，所以自动将其转换为对象类型
3 + '23';                    //'323'   数值和字符串类型不同，运算时将3转换为字符串
5 == '5';                    //比较双方类型不同，发生类型转换。
'a' < 'b';                     //这个更不一样，因为字符串比较实际上是比较其 ASCII 码的大小
```

### 数值加法和字符串连接

为什么 `3 + '23';` 不把字符串转成数字呢？只能说这是规定！！也可能是考虑到了字符串不一定都能转成数字，而数字一定可以转成字符串吧。其实广义来讲，只要不是两个数字相加，都会吧不是字符串的那一个(或2个)转换为字符串然后连接，所以这个部分比较简单，我们只看2个有特点的例子就好：
```
console.log({o:1} + "88");                 //[object Object]88
console.log([5,9] + "88");                 //5,988
console.log(function(e){return;} + "88");  //function(e){return;}88
```
默认的对象转换为字符串使用了 toString 方法(实际上没这么简单，详细见下文)，而 toString 对于对象而言得到 `[object 构造函数名称]` 这样的一个字符串。而数组和函数重写了对象的 toString 方法，所以数组得到用逗号链接的元素序列字符串；函数得到其源代码字符串。
不过要注意到，除了加号(+)，其他符号都是默认转换为数值型：
```js
'3' - 1  // -> 2
```

但是，不巧的是这里又有例外了：就是 null 和 undefined！！

### null 和 undefined

这里面首先需要解释的一个坑就是 null 和 undefined 相关的比较问题：
1、 null/undefined 和字符串相加是转换为字符串"null"/"undefined"，和数字相加是，null 转化为0，而 undefined 转换为 NaN(NaN 和任何数值相加得到的都是 NaN)【坑13】
```js
console.log(null + 20);         //20
console.log(undefined + 20);    //NaN
console.log(null + "20");         //null20
console.log(undefined + "20");    //undefined20
```
2、 null 和 undefined 除了和自己以及彼此以外和谁都不相等，比如下面这个例子，虽然 null 和 undefined 类型转换都是 false，但它们谁都不等于 false【坑14】
```js
console.log(false == undefined);   // false
console.log(false == null);        // false
console.log(true == undefined);    // false
console.log(true == null);         // false
console.log(null == undefined);    // true
```
虽然它们彼此是相等的，但不严格相等
```js
console.log(null === undefined);    // false
```
那么我们就有必要区分一下相等和严格相等。简单来说：

- 相等：对于类型不同的两个值而言，通过类型转换可以相等的依然返回 true。
- 严格相等：不存在类型转换，对于类型不同的两个值直接返回 false。

这样的解释，简单但不明了，因为你会遇到下面这个坑【坑15】：
```js
if('0') {
  console.log('yes');
}
```
由于之前我们总结过，只有空字符串(`""`)、`null`、`undefined`、`0` 和 `NaN` 的布尔型是 `false`，其他的都是 `true`，所以上述代码是可以输出 ‘yes’ 的。但是我们执行以下代码：
```js
console.log(false == '0');         // true
console.log(true == '0');         // false
```
到这里一脸懵逼！这简直不能更坑！没办法，想搞明白这个事还得去看[规范](http://www.ecma-international.org/ecma-262/8.0/)(7.2.13-7.2.14)：

### 关于 `==` 和 `!=`

> The comparison x == y, where x and y are values, produces __true__ or __false__. Such a comparison is performed as follows:
> - If Type(x) is the same as Type(y), then
>   - Return the result of performing Strict Equality Comparison x === y.
> - If x is __null__ and y is __undefined__, return __true__.
> - If x is __undefined__ and y is __null__, return __true__.
> - If Type(x) is Number and Type(y) is String, return the result of the comparison x == ToNumber(y).
> - If Type(x) is String and Type(y) is Number, return the result of the comparison ToNumber(x) == y.
> - If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y.
> - If Type(y) is Boolean, return the result of the comparison x == ToNumber(y).
> - If Type(x) is either String, Number, or Symbol and Type(y) is Object, return the result of the comparison x == ToPrimitive(y).
> - If Type(x) is Object and Type(y) is either String, Number, or Symbol, return the result of the comparison ToPrimitive(x) == y.
> - Return __false__.

翻译如下：

> 比较表达式 x == y (x 和 y 为值) 返回 __true__ 或 __false__，执行过程如下:
> - 如果  Type(x) 和 Type(y) 相同，则
>   - 返回 x === y 的结果;
> - 如果 x 是 __null__ 并且 y 是 __undefined__，返回 __true__;
> - 如果 x 是 __undefined__ 并且 y 是 __null__，返回 __true__;
> - 如果 Type(x) 是数值并且 Type(y) 是字符串，返回 x == ToNumber(y) 的结果;
> - 如果 Type(x) 是字符串并且 Type(y) 是数值，返回 ToNumber(x) == y 的结果;
> - 如果 Type(x) 是布尔型，返回 ToNumber(x) == y 的结果;
> - 如果 Type(y) 是布尔型，返回 x == ToNumber(y) 的结果;
> - 如果 Type(x) 是字符串、数值或 Symbol 并且 Type(y) 是对象, 返回 x == ToPrimitive(y) 的结果;
> - 如果 Type(x) 是对象并且 Type(y) 是字符串、数值或 Symbol , 返回 ToPrimitive(x) == y 的结果;
> - 返回 __false__;

关于规范中的 ToPrimitive() 用来将对象转换为 __数值__ 或 __字符串__ ，在规范7.1.1节中也有解释，简单来说：

1. ToPrimitive() 默认将类型转为 Number，但是对象可以通过`@@toPrimitive` 方法重新定义其行为。规范中只有 Date 对象和 Symbol 对象重新定义了该行为，Date 和 对象的 ToPrimitive() 默认得到 String 类型；
2. 其次，ToPrimitive() 是依赖 对象的 toString() 和 valueOf() 方法的。对象转换为数字时，先调用 `valueOf()` 后调用 `toString()`，转换为字符串时，先调用 `toString()` 后调用 `valueOf()` 方法；
3. 如果先调用的方法返回了非对象值，则后一个方法不再调用，并返回该值；如果2个方法都不是函数或是返回对象的函数，则抛出TypeError异常。
4. 详见[规范](http://www.ecma-international.org/ecma-262/8.0/)第7.1.1 节 OrdinaryToPrimitive

### 关于 `===` 和 `!==`

> The comparison x === y, where x and y are values, produces __true__ or __false__. Such a comparison is performed as follows:
> - If Type(x) is different from Type(y), return __false__.
> - If Type(x) is Number, then
>   - If x is __NaN__, return __false__.
>   - If y is __NaN__, return __false__.
>   - If x is the same Number value as y, return __true__.
>   - If x is __+0__ and y is __-0__, return __true__.
>   - If x is __-0__ and y is __+0__, return __true__.
>   - Return __false__.
> - Return SameValueNonNumber(x, y).
>> NOTE: This algorithm differs from the SameValue Algorithm in its treatment of signed zeroes and NaNs.

翻译如下：

> 比较表达式 x === y (x 和 y 为值) 返回 __true__ 或 __false__，执行过程如下:
> - 如果 Type(x) 和 Type(y) 不同, 返回 __false__;
> - 如果 Type(x) 是数值, 则
>   - 如果 x 是 __NaN__, 返回 __false__;
>   - 如果 y 是 __NaN__, 返回 __false__;
>   - 如果 x 和 y 值相等, 返回 __true__;
>   - 如果 x 是 __+0__ 并且 y 是 __-0__, 返回 __true__;
>   - 如果 x 是 __-0__ 并且 y 是 __+0__, 返回 __true__;
>   - 返回 __false__;
> - 返回 SameValueNonNumber(x, y);
>> 注意: SameValue 算法在对待 __0__ 和 __NaN__ 存在差别

感觉上面这个注意又是个坑呀，博主赶紧去继续查手册，发现这个函数的操作方法：

> The internal comparison abstract operation SameValueNonNumber(x, y), where neither x nor y are Number values, produces __true__ or __false__. Such a comparison is performed as follows:
> - Assert: Type(x) is not Number.
> - Assert: Type(x) is the same as Type(y).
> - If Type(x) is Undefined, return __true__.
> - If Type(x) is Null, return __true__.
> - If Type(x) is String, then
>   - If x and y are exactly the same sequence of code units (same length and same code units at corresponding indices), return __true__; otherwise, return __false__.
> - If Type(x) is Boolean, then
>   - If x and y are both __true__ or both __false__, return __true__; otherwise, return __false__.
> - If Type(x) is Symbol, then
> - If x and y are both the same Symbol value, return __true__; otherwise, return __false__.
> - If x and y are the same Object value, return __true__. Otherwise, return __false__.

翻译如下：

> 内部的抽象比较操作 SameValueNonNumber(x, y) (x 和 y 为值) 返回 __true__ 或 __false__，执行过程如下::
> - 断言: Type(x) 不是数值;(译注: 不符合直接抛出异常)
> - 断言: Type(x) 和 Type(y) 类型一样;(译注: 不符合直接抛出异常)
> - 如果 Type(x) 是 undefined，返回 __true__;
> - 如果 Type(x) 是 null，返回 __true__;
> - 如果 Type(x) 是字符串, 则
>   - 如果 x 和 y 是严格相同的字符序列 (相同长度并且对应下标的字符编码一致)，返回 __true__; 否则，返回 __false__;
> - 如果 Type(x) 是布尔型, 则
>   - 如果 x 和 y 都是 __true__ 或者都是 __false__，返回 __true__; 否则，返回 __false__;
> - 如果 Type(x) 是 symbol, 则
> - 如果 x 和 y 是同一个 Symbol，返回 __true__; 否则，返回 __false__;
> - 如果 x 和 y 是同一个对象，返回 __true__; 否则，返回 __false__;

一下翻译了这么多，至少不会感到晕了。js 就是这样比较两个值的，读完这些内容，是不是理解什么:
> 只要 `===` 为 __true__，`==` 一定为__true__;
> 只要 `!=` 为__false__，`!==` 一定为__false__

比如下面再看一些奇怪的东西：

- 数组、对象比较

```js
var a = [1];
var b = [2];
var c = a;
console.log(a == b);    //false, 因为不是同一个对象
console.log(a == c);    //true, 因为是同一个对象
// 所以
console.log([] == []);             //false
console.log({} == {});             //false
```

比如这样的代码：
```js
!![]       // -> true, 和 ==, ===, !=, !== 无关的类型转换不会调用内置的 toPrimitive, 这里调用 Boolean([]) 得到 true
[] == true // -> false, 这个通过转换得到的是 0 == 1, 返回 false
```
以下两个同理：
```js
!!null        // -> false
null == false // -> false
```

- 关于 toString() 和 valueOf()

```js
"J" + { toString: function() { return "S"; } };  // "JS"
2 * { valueOf: function() { return 3; } };       // 6
```
上面这个例子不深究的话，看上去似乎若合符节，一个转为字符串，调用了 toString，第二个转换为数字，调用了 valueOf。实际上并不是这么简单【坑16】：
根据之前那个表格，这里使用 toPrimitive 而再看 toPrimitive 的定义，除了 Date 和 Symbol 类型转化为字符串，其余的对象都默认转化为数字，所以这里都是先调用 valueOf ，而对象的 valueOf 默认返回对象本身(this)，这个不符合规范，因为规范要求不能返回对象，所以第一个表达式继续调用toString 得到了 'S'，而第二个 valueOf 直接返回 3，没有调用 toString。 为了说明这个逻辑，我们再看一个例子，这次我做过多解释了：
```js
var oriObj = {}
var myObj = {
    toString: function() {
        return "myObj";
    },
    valueOf: function() {
        return 17;
    }
};
"object: " + myObj;       // "object: 17"
```

- +0 和 -0 是一致的

```js
console.log(+0 === -0);            //true
console.log(+0 == -0);             //true
```

> __补充__
>
> 即便如此，我们也可以用如下方法区别 +0 和 -0
> ```js
> function isNegativeZero(num) {
>     return num === 0 && (1 / num < 0);
> }
> ```

- NaN 是唯一一个不等于自己的值【坑17】

```js
var x = NaN;
console.log(x == x);           //false
```

- 这里有一个容易记混的地方
对于 `+` 运算，字符串和数字相加是将数字转换为字符串；而 `==` 运算中是将字符串转换为数字【坑18】

```js
// 结合之前的【坑10】，就得到这么一让人想骂娘的结果
console.log(" \t\r\n " == 0);      //true
```

### toLocaleString 和 toString

toLocaleString 和 toString 方法同时存在，它定义了个性化的字符串转换功能，对于对象而言 toLocaleString 和 toString 是一样的。不过Array, Number, Date 和TypedArray(ES6中的类型，这里不讨论)都重写了 toLocaleString。比如说数值类型：
```js
console.log((1234).toLocaleString());   //1,234
console.log((1234567).toLocaleString('zh-Hans-CN-u-nu-hanidec', {useGrouping: false})); //一二三四五六七
console.log((1234567).toLocaleString('zh-Hans-CN-u-nu-hanidec', {useGrouping: true}));  //一，二三四，五六七
```
日期类型：
得到一些地域性的时间表示
```js
var date = new Date();
console.log(date.toString());           //Tue Apr 15 2014 11:50:51 GMT+0800 (中国标准时间)
console.log(date.toLocaleString());     //2014-4-15 11:50:51
console.log(date.toLocaleDateString()); //2014-4-15
console.log(date.toLocaleTimeString()); //上午11:50:51
```
数组类型的 toLocaleString 就是将数组中的数值类型和日期类型分别按 toLocaleString 转换为字符串，再形成整体字符串。

关于 toLocaleString 的定义官方也是故意没给出具体的实现细节【坑19】，这一点完全不能理解，所以这个方法用的场合也比较有限，这里不再赘述了。

### Infinity

关于 Infinity 的数学运算也比较简单，如果学过极限的话很好理解，对于不定式运算(`0 / 0`, `∞ / ∞`, `∞ - ∞`)，返回 NaN:
```js
console.log(Infinity + Infinity);   //Infinity
console.log(Infinity - Infinity);   //NaN
console.log(Infinity * Infinity);   //Infinity
console.log(Infinity / Infinity);   //NaN
console.log(0 / 0);                 //NaN
```

### javascript精度

javascript的小数精度范围是$-1.79e308至1.79e308$，同时可以认为大数在-9e15~9e15之间的计算可以认为是没有误差的，即 `MIN_SAFE_INTEGER` 和 `MAX_SAFE_INTEGER`。我们可以用`Number.MAX_VALUE`和`Number.MIN_VALUE`获得js中可表示的最大数和最小数。
```js
console.log(Number.MIN_VALUE);        //5e-324
console.log(Number.MAX_VALUE);        //1.7976931348623157e+308
console.log(Number.MAX_SAFE_INTEGER); //9007199254740991
console.log(Number.MIN_SAFE_INTEGER); //-9007199254740991
```
对于计算值超过该范围的数会被转换为 Infinity 或 0，而且这个转换不属于类型转换，而是编程语言处理了内存溢出后的结果：
```js
console.log(2e200 * 73.987e150);       //Infinity
console.log(-1e309);                   //-Infinity
console.log(4.18e-1000);               //0
```
而且数值会在浮点计数和科学技术法间自动转换，自动转换临界是`1e-6`
```js
console.log(0.000006);                 //0.000006
console.log(0.0000006);                //6e-7
```
但在精度范围边界，总会有一些问题【坑20】，姑且认为这也是个坑吧，不过这样的问题在其他编程语言中也普遍存在
```js
console.log(1e200 + 1 === 1e200);  //true
console.log(0.1 + 0.2);                //0.30000000000000004
console.log(0.3 === 0.1 + 0.2);        //false
```
在比如下面这个
```js
999999999999999  // -> 999999999999999
9999999999999999 // -> 10000000000000000

10000000000000000       // -> 10000000000000000
10000000000000000 + 1   // -> 10000000000000000
10000000000000000 + 1.1 // -> 10000000000000002
```
### [] 和 {}

有了上面的基础，这个最坑的部分来了
```js
console.log(+{});      //NaN
console.log(+[]);      //0
```
以上这两个属于转换为数值，所以其值会调用 `valueOf()`(返回了对象)，而后调用 `toString()`，前者得到 `[object Object]`，后者得到 `""`, 再调用
 `Number()` 得到结果，前者为 `NaN`，后者为 `0`。

理解了上面这个下面这个就不难了，都是转换到字符串以后进行字符串链接
```js
console.log({} + []);  //[object Object]
console.log({} + {});  //[object Object][object Object]
console.log([] + []);  //""
console.log([] + {});  //[object Object]
```
但如果像下面这样使用呢，我们如何理解？
```js
console.log({}[]);     //[]
console.log([]{});     //"SyntaxError"(语法错误)
```
首先我们需要明白这2个表达式是从左到右执行的。这个地方我们可以很简单的证明第一个表达式中的`{}`，不是对象：
```js
var obj = {};
console.log(obj[]);      //SyntaxError: Unexpected token ]
```
所以这里他是个表示代码段的括号(注意块级作用域是 ES6 提出了，在 ES5 中 `{}` 仅仅表示一个代码段，如 `if(exp){...}` 中的 `{}`) ，这里这个代码段里面什么也没有，执行完以后这个 `{}` 就没了，剩下一个数组 `[]`。第二个表达式 `[]{}` 从左到右先遇到一个数组，数组后面定义代码段或者对象都是不符合语法的。

我们再看几个赋值相关的，这里又是一个坑，居然 js 敢不限制赋值表达式的左值是标识符或 Symbol【坑21】：
```js
var [] = 1;            //"TypeError"(类型错误)
var [] = "1" ;         //(正常执行，由于字符串对象本身就是类数组对象)
var [] = {};           //"TypeError"(类型错误)
var {} = [] ;          //(正常执行，仅仅是指针指向从对象改变到了数组)
```
以上的2个错误，都是 “TypeError: undefined is not a function”，很明显，由于表达式不规范导致被js误认为是一个函数，从而报错。

如果你理解了这些，不妨研究一下下面两个表达式的值吧：
```js
(![]+[])[+[]]+(![]+[])[+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]    //'fail'
(!(~+[])+{})[--[~+""][+[]]*[~+[]] + ~~!+[]]+({}+[])[[~!+[]]*~+[]]                //'sb'
```
当然还有更奇怪的,原因还是在于数组对象重写了对象的 toString 方法【坑】：
```js
[] == ![]  //true
{} == !{}  //false
```

## ES6 中的类型转换和坑

ES6 中同样带入了许多坑，当然这些坑不一定都是类型转换导致的。

### label 和 块作用域

比如下面这段代码，看似像定义对象属性，但实际上是个块级作用域，`foo:` 是一个的标签，用来给 break 指定跳转的地方。
```js
foo: {
  console.log('first');   //first
  break foo;
  console.log('second');   //不输出
}
```
再看下面这个：

由于前面的 a-g 都是标签，而后面的逗号表达式会返回最后一个表达式的值
```js
a: b: c: d: e: f: g: 1, 2, 3, 4, 5;    // -> 5
```

### 解构赋值

比如这样定义变量，并且结构赋值
```js
let x, { x: y = 1 } = { x };    //由于 x 是 undefined 所以 y 取了默认值 1
console.log(y);                 //1
```

### 模板字符串和对象中的类型转换

对象在类似 EL 表达式中会被自动转换为字符串, 而对象的键值也会被默认转换为字符串(除了 Symbol 类型)
```js
`${{Object}}`        //'[object Object]'
{ [{}]: {} }         // -> { '[object Object]': {} }
```

### 展开运算符

由于字符串具有 iterator 就被展开了:
```js
[...[...'...']].length   //3   实际上得到的是['.', '.', '.']
```

### try catch 语句

这个不算是 es6 的问题，不过我们也看一看：

try 中的 return 和 throw 会在有 finally 语句是中的 return 或 throw 覆盖(这里的确是覆盖，而不是前一个 return 未执行，详细可以参看[规范](http://www.ecma-international.org/ecma-262/8.0/#sec-try-statement-runtime-semantics-evaluation)第13.15.8节。
```js
(() => {
  try {
    return 2;
  } finally {
    return 3;
  }
})()
```

### class 类

```js
//这个代码是不会报错的，系统会直接将 'class' 字符串作为对象的属性名
const foo = {
  class: function() {}
};


var obj = new class {
  class() {}
};
console.log(obj);   //{},  和 var obj = new class{} 一样
```

## 还未解决的问题

下面这个输入，博主一直很疑惑。把2行代码分别输入到 chrome 控制台，得到对应结果。按规范的逻辑应该输出[object Object]，而第二个暂时还不知道怎么解释
```js
console.log({} + []);  //[object Object]
{}+[];    //0
```

## 另一个更好的 typeOf 函数

```js
function typeOf(val){
  return Object.prototype.toString.call(val).slice(8, -1);  //同样可以很好的处理 null 和 undefined
}
```
