<!-- MarkdownTOC -->

- [Symbol基本类型](#symbol%E5%9F%BA%E6%9C%AC%E7%B1%BB%E5%9E%8B)
- [Symbol用作属性名](#symbol%E7%94%A8%E4%BD%9C%E5%B1%9E%E6%80%A7%E5%90%8D)
- [Symbol的静态方法](#symbol%E7%9A%84%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95)
- [内置的 Symbol 值](#%E5%86%85%E7%BD%AE%E7%9A%84-symbol-%E5%80%BC)

<!-- /MarkdownTOC -->

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
对于一个类而言，该属性必须返回 boolean 类型
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
[1,2].concat(a1).concat(a2);  //[1, 2, 3, 4, 5, 6]
```
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
<!-- MarkdownTOC -->

<!-- /MarkdownTOC -->

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
