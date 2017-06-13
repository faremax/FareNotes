<!-- MarkdownTOC -->

- [Set](#set)
- [WeakSet](#weakset)
- [Map](#map)
- [WeakMap](#weakmap)

<!-- /MarkdownTOC -->

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
