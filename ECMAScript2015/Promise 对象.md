<!-- MarkdownTOC -->

- [Promise 建立](#promise-%E5%BB%BA%E7%AB%8B)
- [Promise 对象方法](#promise-%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95)
- [Promise 静态方法](#promise-%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95)
- [应用举例](#%E5%BA%94%E7%94%A8%E4%B8%BE%E4%BE%8B)

<!-- /MarkdownTOC -->

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
3. 异步中模拟 sleep 函数
```js
const sleep = (time) => new Promise(function(resolve){
  setTimeout(resolve, time);
});
(async () => {
  for(var i = 0; i < 5; i++){
    await sleep(1000);
    console.log(new Date, i);
  }
  await sleep(1000);
  console.log(new Date, i);
})();
```
