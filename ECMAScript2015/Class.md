<!-- MarkdownTOC -->

- [class声明](#class%E5%A3%B0%E6%98%8E)
- [class 表达式](#class-%E8%A1%A8%E8%BE%BE%E5%BC%8F)
- [getter, setter 和 Generator 方法](#getter-setter-%E5%92%8C-generator-%E6%96%B9%E6%B3%95)
- [class 的继承](#class-%E7%9A%84%E7%BB%A7%E6%89%BF)
- [`prototype` 和 `__proto__`](#prototype-%E5%92%8C-proto)
- [多继承](#%E5%A4%9A%E7%BB%A7%E6%89%BF)
- [原生构造函数继承](#%E5%8E%9F%E7%94%9F%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E7%BB%A7%E6%89%BF)
- [静态属性](#%E9%9D%99%E6%80%81%E5%B1%9E%E6%80%A7)
- [new.target 属性](#newtarget-%E5%B1%9E%E6%80%A7)

<!-- /MarkdownTOC -->

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

- class 中默认是严格模式，即使不写`"use strict`。关于严格模式可以看：[Javascript基础(2) - 严格模式特点](https://github.com/faremax1992/repoForBlog/blob/master/Javascript/%E4%B8%A5%E6%A0%BC%E6%A8%A1%E5%BC%8F%E7%89%B9%E7%82%B9.md)
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

这里我们只重点讲继承，关于多态没有新的修改，和 ES5 中一样，在函数内判断参数即可。关于多态可以阅读[Javascript对象(1) - 对象、类与原型链](https://github.com/faremax1992/repoForBlog/blob/master/Javascript/%E5%AF%B9%E8%B1%A1%E3%80%81%E7%B1%BB%E4%B8%8E%E5%8E%9F%E5%9E%8B%E9%93%BE.md)中关于`多态重构`的部分。

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
