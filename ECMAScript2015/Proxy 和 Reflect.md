
<!-- MarkdownTOC -->

- [Proxy 对象](#proxy-%E5%AF%B9%E8%B1%A1)
- [Reflect 对象](#reflect-%E5%AF%B9%E8%B1%A1)

<!-- /MarkdownTOC -->

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
