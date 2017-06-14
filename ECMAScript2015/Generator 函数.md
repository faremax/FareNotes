<!-- MarkdownTOC -->

- [Generator](#generator)
- [next\(\) 参数](#next-%E5%8F%82%E6%95%B0)
- [for...of](#forof)
- [throw\(\) 方法和 return\(\) 方法](#throw-%E6%96%B9%E6%B3%95%E5%92%8C-return-%E6%96%B9%E6%B3%95)
- [yield* 语句](#yield-%E8%AF%AD%E5%8F%A5)
- [Generator 函数中的 this](#generator-%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84-this)
- [Generator 函数推导](#generator-%E5%87%BD%E6%95%B0%E6%8E%A8%E5%AF%BC)
- [应用举例](#%E5%BA%94%E7%94%A8%E4%B8%BE%E4%BE%8B)

<!-- /MarkdownTOC -->

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
