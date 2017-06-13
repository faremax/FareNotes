<!-- MarkdownTOC -->

<!-- /MarkdownTOC -->

作为DOM本身十分重要的2个异步执行函数，初学者感觉这个很不好理解，我简单写一写我的理解
```
setTimeout (func, millisec);
setInterval(func, millisec);
```
这两个方法在形式看起来很相似，第一个参数是异步执行的函数（用字符串表示的代码也可以，不过很少这样用），第二个参数是时间（ms）。但其实这两个函数还是有很大区别的

说的通俗一点，`setTimeout()`让电脑一定时间以后再执行一段代码，执行完了就拉倒，例如下面这段代码：

``` javascript
setTimeout("alert('5 seconds!')", 5000); //5秒后弹出提示框
```

再看看`setInterval()`，不同的在于每过一段时间会重复执行一段代码。比如在浏览器中输出一个时间，每一秒变化一下。

``` javascript
var clk = document.getElementById("clk"); //clk是一个div
setInterval(function(){
  var t = new Date();
  clk.innerHTML= t;
}, 200);
//每隔200ms显示一次时间,200ms会看着比1000ms更稳定一些
```

运行上面这个代码，如果你得到的时间不准确，那一定是你的电脑时间错了。
好了，总结一下：

``` javascript
setTimeout(func, m); //m毫秒后执行函数func，只执行一次（下文会讲怎么让它中止）
setInterval(func, m); //每隔m毫秒执行函数func，一直执行下去（下文会讲怎么让它停下来）
```

对于`setInterval()`的用途可能还比较好理解，但是对于`setTimeout()`，这里有一个问题——我们为什么要让一段代码过一段时间在执行？

这里就产生了一个很重要的概念，在本文一开始就提到过——异步！什么是异步？
举个通俗一点的例子：比如现在有烧水和擦桌子两件事，如果你一定要用热水擦桌子，那你就必须先等着水开了，才能擦桌子，这个就是同步；如果你不在乎用什么水擦桌子，那一般人都会先烧水，在烧水的同时就开始擦桌子了，这个就是异步。

对于计算机而言，这个逻辑和正常生活不一样：同时执行就是异步，先后执行就是同步！当然这是一种简单的理解，并不严谨，毕竟在计算机内部计时器脉冲、操作系统进程、网络通信中都有同步和异步的概念。

有了异步执行这个概念，那小编可以负责的说`setTimeout()`和`setInterval()`都是异步执行的。其实2015年出的ES6在异步这里下了很大的功夫，提出了`async function(){}`、`Promise`对象、`Generator`函数、Object.observe函数等很多新概念，不过这里不谈这些概念，但理解这些异步概念绝不能像这篇文章里面简单粗暴！！！

好了现在可以回答上面那个问题了，我们之所以会用到`setTimeout()`和`setInterval()`更多还是为了异步执行代码，以此提高代码的执行速度。到此这两个方法的就讲完了。。。等等！！！方法？方法会不会有返回值呀！
没错，这两个函数都有返回值，至于这个值是个什么并不重要，我们只需要知道这个值能干什么，我们给上面的那段代码添点东西：

``` javascript
var clk = document.getElementById("clk"); //clk是一个div
var time = setInterval(function(){
  var t = new Date()
  clk.innerHTML= t;
}, 200);

var btn = document.getElementById("btn"); //btn是一个按钮
btn.onclick = function(){
  clearInterval(time);
};
```

这段代码我们获得了`setInterval() `的返回值，把返回值传给了`clearInterval()`方法，这样实现了点击按钮结束的对应setInterval()的反复调用，终于它可以停下来了。

同样的方法，利用`clearTimeout()` 方法可取消由 `setTimeout()` 函数定义的异步操作，我们如法炮制得到一个取消延迟事件的按钮（当然，如果这个事件已经执行了再点这个按钮就没意义了）：
``` javascript
var alt = setTimeout("alert('5 seconds!')", 5000); //5秒后弹出提示框
var btn = document.getElementById("btn"); //btn是一个按钮
btn.onclick = function(){
  clearTimeout(alt);
};
```
如果用`setInterval`和`setTimeout`调用的函数是一个有参数的函数怎么办？
``` javascript
function f(a, b){/*...*/}
var num = 2;
setTimeout("f(num, 3)", 1000);  //第一种方法
setTimeout(function(){fun(num, 3);}, 1000);  //第二种方法
```

这一下，`setTimeout()`和`setInterval()`已经理解了，看它们相似点其实也不少，否则怎么会容易被搞混呢？其实我们可以使用`setTimeout()`实现`setInterval()`的功能，就像下面一段代码：

``` javascript
function mySetInterval(code, ms){
  if(typeof code === "string")  //不要忘了第一个参数可以是字符串
    eval(code);
  else if(typeof code === "function")
    code();
  else throw new Error("code cannot be run");  //当第一个参数传入不是字符串或函数时报错
  setTimeout(function(){
    mySetInterval(code, ms);  //递归调用
  },ms);
}
mySetInterval("document.write('helloWorld!<br />')", 1000);//调用方法不变，第一个参数也可以是函数
```
这里值得强调的是**eval()并不是什么好东西**，它在全局运行，对字符串并不能有效检查(会让JSLint失效)，还会调用编译器降低效率，同时带来安全隐患。所以尽量不要用eval()，也不要给`setTimeout`和`setInterval`传入字符串，因为系统也是用eval实现这个功能的。
这段代码只是用这样一种方式表示`setTimeout()`和`setInterval()`的关系，便于读者理解。并不表示这样做有什么好，更不表示编译器也这么实现`setInterval()`，因为这样的递归效率不高占用资源却不少，而且它没法停止。

如果你已经掌握了上面的内容，那么下面可以更深入的理解一下异步了。

以setTimeout为例：
```javascript
//alert(1);
//setTimeout("alert(2)", 0);
//alert(3);
//alert(3);
```
上面这段代码会如何输出呢？实际输出是：`1 -> 3 -> 3 ->2`，为什么会这样，难道`setTimeout(func, 0)`不是立即执行？没错。想理解这个问题，必须简单理解浏览器是如何处理异步函数的。

一个页面在浏览器显示出来至少需要3个线程，分别是js引擎，GUI渲染，事件触发。其中事件触发是独立于其他2个执行的，而js和GUI是相互排斥的，也就是说同一个时间二者只有一个在工作。好了，这说明js引擎是单线程执行的，当第二行的`setTimeout`执行以后，js引擎把func(第一个参数)放入异步队列(浏览器再开一个线程)，然后继续向下执行，此后，当js引擎空闲下来才会把异步执行的结果插入原来js线程中。是不是这样呢，我们让代码说话：
```
    var finish = true;
    setTimeout(function(){
        finish = false;  //1s后，改变isEnd的值
    }, 0);
    while(finish);
    alert('finished');  //永远不会执行
```
上方这段代码是个死循环，就因为js引擎不能空闲下来，异步函数也就没有执行。下面这个实际问题可以很好的理解这个：
```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title></title>
</head>
<style>
</style>
<body>
  <button id='firstBtn'>first</button>
    <div id='firstHint'>click 'first' button to calculate.</div>
  <br/>
  <button id='secondBtn'>second</button>
  <div id='secondHint'>click 'second' button to calculate.</div>
</body>
<script>
  function calc(s) {
      var result = 0;
      for (var i = 0; i < 1000000000; i++) {
          result = result + i;
      }
    //debugger;
    document.querySelector(s).innerHTML = 'Done' ;
  }

  document.querySelector('#firstBtn').onclick = function () {
      document.querySelector('#firstHint').innerHTML = 'calculating....';
      calc('#firstHint');
  };

    document.querySelector('#secondBtn').onclick = function () {
      document.querySelector('#secondHint').innerHTML = 'calculating....';
      setTimeout(function(){
      calc('#secondHint');
    }, 0);
  };
</script>
</html>
```
我们用了一很大的循环模拟一个耗费时间的计算。

分析一下：第一个按钮看不到calculating。由于js引擎的事件处理也是异步的，而for循环是同步的，设置文字为calculating的语句被放在了for循环结束，因为只有此时js才有空闲处理异步队列，for结束了以后，文字被设置为calculating，继而变为Done，所以我们看不到这个过程了，在代码中`debugger`的位置停一下，这个过程就清晰的呈现了出来。

为了解决这个问题，第二个按钮引入了`setTimeout`这样，异步事件click执行，函数内第一个语句被送入队列，而后`setTimeout`里那个匿名函数被送入队列，此时js引擎有空闲，于是输出calculating，异步队列移动，继续执行calc，这样就是我们想看到的结果了。

不足之处请多指点。
