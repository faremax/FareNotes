<!-- MarkdownTOC -->

- [for...of](#forof)
- [几种遍历方法的比较](#%E5%87%A0%E7%A7%8D%E9%81%8D%E5%8E%86%E6%96%B9%E6%B3%95%E7%9A%84%E6%AF%94%E8%BE%83)
- [iterator 与](#Symbol.iterator)
- [Generator 与遍历器](#generator-%E4%B8%8E%E9%81%8D%E5%8E%86%E5%99%A8)
- [遍历器对象的其他方法](#%E9%81%8D%E5%8E%86%E5%99%A8%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%85%B6%E4%BB%96%E6%96%B9%E6%B3%95)

<!-- /MarkdownTOC -->

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
