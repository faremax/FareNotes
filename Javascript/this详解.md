<!-- MarkdownTOC -->

- [普通函数中的this](#%E6%99%AE%E9%80%9A%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84this)
- [构造函数中的this](#%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84this)
- [对象方法中的闭包](#%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95%E4%B8%AD%E7%9A%84%E9%97%AD%E5%8C%85)
- [原型中的this](#%E5%8E%9F%E5%9E%8B%E4%B8%AD%E7%9A%84this)
- [bind call和apply方法](#bind-call%E5%92%8Capply%E6%96%B9%E6%B3%95)
	- [bind方法](#bind%E6%96%B9%E6%B3%95)
	- [call方法 和 apply方法](#call%E6%96%B9%E6%B3%95-%E5%92%8C-apply%E6%96%B9%E6%B3%95)
	- [实例](#%E5%AE%9E%E4%BE%8B)
- [箭头函数中的this](#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84this)

<!-- /MarkdownTOC -->

不论是面向对象，还是基于对象的语言，都会有this，我更喜欢叫他this指针，如果你不理解指针，认为它是个引用也无妨。
这一片文章就是整理一下在各个情况下的this到底引用的是谁。一次来明白this的用法，下面将是一段段的代码，每段代码后面可能有简短的说明，就是这样简单粗暴。

说明一下，这篇文章是基于浏览器的，不是原生js，区别在于浏览器全局中的this是Window，而原生js中是global。其次，博主使用的控制台输出，如果你使用`document.write`方法或`alert`输出this，由于这两个方法会调用对象的toString方法，你会得到[object Window]或[object Object]。

注意：本文中对**一般函数**和**普通函数**的措辞，这个只是博主个人的说法，由于上下文(context)的解释并不是很容易懂，博主自定义了这2个说法，帮助理解。

###普通函数中的this
```javasctipt
function f(){
  console.log(this); //Window
}
```
**在js中，凡是没有定义在对象、构造函数或prototype中的函数，其中的this都是全局对象Window。下文把这样的函数称为一般函数**

```javasctipt
var a = [1,2,3,4,5];
var b = a.map(function(x){
  console.log(this);  //Window
  return x * 2;
});
```
同理上面这个函数也没有定义在对象、构造函数或者prototype里，所以得到的依然是Window。
注意：Array.prototype.map是定义在数组原型中的，但是给map传进去的参数函数就是一个一般函数

###构造函数中的this
```javasctipt
function Person(n, a, g){
  this.name = n;
  this.age = a;
  this.gender = g;
  console.log(this);
}
//作为构造函数使用
var o = new Person("Lily", 18, "F"); //this为当前对象 Person {name: "Lily", age: 18, gender: "F"}
//作为普通函数使用
Person("Lily", 18, "F"); //Window
```
第10行代码**将函数作为非构造函数使用方式（new方式）调用，本文把这样调用的函数称为普通函数**
上面代码说明一下几点：
1. 用new创建对象的时候调用了构造函数。
2. 构造函数和普通函数的区别在于调用方式，而不是定义方式，如果按第10行的方式调用，他就是个普通函数，由于普通函数中的this是于Window，所以上面函数在第10行调用后创建了3个全局变量。
3. new关键字改变了函数内this的指向，使其指向刚创建的对象。

```javasctipt
function Person(n, a, g){
  this.name = n;
  this.age = a;
  this.gender = g;
  this.speak = function (){   //这里只是说明this，实际应该在prototype上定义对象方法
    console.log(this);
  };
}
//作为构造函数使用
var o = new Person("Lily", 18, "F");
o.speak();  //Person {name: "Lily", age: 18, gender: "F"}
//作为普通函数使用
Person("Lily", 18, "F");
speak(); //Window
```
1. 对象方法中的this同样指向当前对象
2. 第14行之所以可以调用speak(),是因为第13行执行后在全局创建了speak函数，印证了之前的说法。
多说一句，为什么11行得到的是$Person{...}$，而不是$Object{...}$。其实这里显示的本来就应该是构造函数的名字，如果你通过$var o = {};$创建的对象，相当于$o = new Object();$，这时显示的才是$Object{...}$
```javasctipt
function Person(n, a, g){
  this.name = n;
  this.age = a;
  this.gender = g;
}
Person.prototype.speak = function (){   //这里只是说明this，实际应该在prototype上定义对象方法
  console.log(this);
};
//作为构造函数使用
var o = new Person("Lily", 18, "F");
o.speak();  //this为当前对象 Person {name: "Lily", age: 18, gender: "F"}
//作为普通函数使用
Person("Lily", 18, "F");
speak(); //ReferenceError: speak is not defined
```
由此可见prototype中的方法和构造函数中直接定义方法中this是一样的。
最后一行出现错误，这个不难理解，这里不多说了。
如果构造函数有返回值呢？
```javascript
function Person(n, a){
  this.name = n;
  this.age = a;
  return {
    name: "Lucy",
  };
}
var p1 = new Person("Bob", 10);
console.log(p1.name); //"Lucy"
console.log(p1.age);  //undefined
```
很明显，这是对象p1中的this指向返回值对象
当然，构造函数还可以返回函数：
```
function Fun(x){
  console.log(this);
  return function(){
    this.x = x;
    this.get = function(){
      alert(this.x);
    }
  }
}
var o1 = new Fun(2);   //Fun {}
var o2 = Fun(2);    //window
console.log(o1 == o2);   //false, 这里的o1,o2形式是一样的，由于构成闭包结构，所以应用不同
```
但如果构造函数返回了一个基本类型：
```
function Fun(n){
  this.name = n;
  return 2;
}
var o;
console.log(o = new Fun("Bob"));   // {name: "Bob"}
```
此时得到的对象和返回值无关。

到此我们就明白了，构造函数的返回值如果是基本数据类型，那返回值和得到的对象无关；否则，得到的对象就是返回值的引用并构成闭包。

区分一下面这个具体问题：
```html
<html>
<body>
  <button onclick="click()">Click Here</button>
  <button id="btn">Click Here</button>
<body>
<script>
  function click(){
    console.log(this); //window
  }

  var btn = document.getElementById("btn");
  btn.onclick = function(){
    console.log(this);
  };
</script>
</html>
```
第一个按钮得到Window，而第二个得到input元素！为什么!
再想想，click函数定义在全局，不在对象上。而`btn.onclick = function(){}`中的函数明显是在btn对象上定义的。

###对象方法中的闭包

说闭包前先理解一个简单的：
```javasctipt
var o = {
  name: "Lily",
  age: 18,
  gender: "F",
  speak: function (){
    function fun(){
      console.log(this);
    }
    fun();
  }
};
o.speak();  //Window
```
什么，这里是Window了？对！我们仔细想想，这个fun函数是对象的方法吗？显然不是，它是个一般函数。它仅仅是在另一个函数中的一个函数，显然符合上文描述的：“凡是没有定义在对象、构造函数或prototype中的函数，其中的this都是Window”
如果想在内部函数访问这个对象，也很好解决：
```javasctipt
var o = {
  name: "Lily",
  age: 18,
  gender: "F",
  speak: function (){
    var _this = this; //首选_this，有的资料上会用self。
    function fun(_this){
      console.log(_this);
    }
    fun();
  }
};
o.speak();  //Object {name: "Lily", age: 18, gender: "F"}
```
下面做个闭包，为了说明this的值，这里不定义太多变量，如果对闭包和作用域有疑惑可以参看博主的另一篇文章：[作用域链与闭包](http://blog.csdn.net/faremax/article/details/53201809)
```javasctipt
var o = {
  name: "Lily",
  age: 18,
  gender: "F",
  speak: function (){
    return function(){
      console.log(this);
    }
  }
};
o.speak()();  //Window
```
这个难理解吗？返回的函数依然是个定义在别的函数里面的一般函数。如果想让返回的函数可以继续访问该对象，依然使用上面的$var _this = this$解决。不过这里引出了一个新的问题：
```javasctipt
var o = {
  name: "Lily",
  age: 18,
  gender: "F",
  speak: function (){
    console.log(this);
  }
};
var fun = o.speak;
fun(); //Window
```
什么？这里还是Window！o.speak明显是一个对象方法啊！那么问题来了？第10行调用的是谁？是fun函数。那么fun函数怎么定义的？对，fun的定义决定它是一个一般函数。那怎么解决？这个不用解决，没人会试图在对象外获取对象方法，即便是有需要也应该获取对象方法内的闭包。当然，如果你要强行解决它，那就用bind方法吧。

###原型中的this
什么?原型方法中的this? 看看下面代码就明白了，这个理解起来不会很难
```javascript
function F(){
  return F.prototype.init();
}
F.prototype = {
  init: function(){
    return this;
  },
  test: "test"
}
var f = F();
console.log(f); //F{test:test}
```
可见，原型中方法里的this.就是一个该构造函数的实例化对象。jQuery中使用的就是这个构造方法。

###bind call和apply方法

**这3个方法用来改变调用函数内的this值**

####bind方法
将对象绑定到函数，返回内部this值为绑定对象的函数。
如果我们不能修改库中对象的方法，我们就不能用$var \_this = this;$的方法改变this值，那么我们换个角度考虑上面的问题：

```javasctipt
var o = {
  name: "Lily",
  age: 18,
  gender: "F",
  speak: function (){
    return function(){
      console.log(this);
    }
  }
};
o.speak()();  //Window
```
最后一行中，o.speak()执行完后得到一个函数，这是个临时函数，定义在全局作用域，如果我们把这个临时函数绑定到o对象上，再继续调用这个函数不就可以了么：
```javasctipt
var o = {
  name: "Lily",
  age: 18,
  gender: "F",
  speak: function (){
    return function(){
      console.log(this);
    }
  }
};
o.speak().bind(o)();  //Object {name: "Lily", age: 18, gender: "F"}
```
bind不只可以传入一个参数，后面的多个参数可以作为返回函数的绑定参数，如下：
```
function add(a, b){
  console.log(a+b);
  return a+b;
}

var add2 = add.bind(null, 2); //参数顺序保持一致,第一参为null,不改变this值（但这里会改变，因为add2在全局中定义）
add2(4); //6
```
可如果是构造函数呢？记住一点，**函数作为构造函数调用时，bind的第一参数无效**，注意，仅仅是第一参数无效。
```
function Person(pname, page){
  this.name = pname;
  this.age = page;
}
var Person2 = Person.bind({name:"hello",city:"Beijing"}, "world");
var p = new Person2(12);
console.log(p);//Person{name:"world", age:12}
```
####call方法 和 apply方法
这里举几个和上文不一样的例子
```
function Animal(){
    this.name = "Animal";
}
Animal.prototype.showName = function(){
    alert(this.name);
};

function Cat(){
    this.name = "cat";
}
var cat = new Cat();
```
这里Cat没有showName方法，怎么实现输出名字呢？
有c++和java经验的人会认为猫属于动物，所以Cat应该继承Animal，所以我们可以这样修改：
```
function Animal(){
    this.name = "Animal";
}
Animal.prototype.showName = function(){
    alert(this.name);
};

function Cat(){
    this.name = "cat";
}
Cat.prototype = Animal.prototype;
var cat = new Cat();
cat.showName(); //Cat
```
或者：
```
function Animal(){
    this.name = "Animal";
}
Animal.prototype.showName = function(){
    alert(this.name);
};

function Cat(){
  Animal.call(this, "cat");  //继承
}
var cat = new Cat();
cat.showName(); //Cat
```
有c++和java经验就会知道，在做一个大型项目之前都是要做UML设计的，用例图、活动图、类图、状态图等等十几种图，对于没有一定经验的开发者做这个简直就是噩梦，而js把各种类或模块独立出来，需要的时候用call、bind、apply把多个类联系起来，这样的做法即简化了设计，又简化了维护。
所以js里面很少有上面的写法，怎么写看下面：
```
function Animal(){
    this.name = "Animal";
}
Animal.prototype.showName = function(){
    alert(this.name);
}

function Cat(){
    this.name = "Cat";
}
var cat = new Cat();
Animal.prototype.showName.call(cat);   //cat
Animal.prototype.showName.apply(cat);   //cat
```
对，不过感觉那里怪怪的，call和apply一样？他们功能上一样，只是接受的参数不同，简单写就是下面这样：

```
func.call(func1,var1,var2,var3,...);
func.apply(func1,[var1,var2,var3,...]);
```
它们的第一个参数都是指定调用该函数的对象，如果为空就是全局对象。后面的时传入该函数的参数，区别在于**使用call时参数逐一传入，而使用apply时参数构成一个数组或类数组对象传入**。

####实例

例子1：
```
//求下列数组元素的最大值
var numbers = [5, 6, 9, 3, 7];
var maxValue = Math.max(numbers);
alert(maxValue);  //NaN
maxValue = Math.max.apply(null, numbers);
alert(maxValue);  //9

//否则你只能这么写：
var max = +Infinity;
for (var i = 0, len = numbers.length; i < len; i++) {
  if (numbers[i] > max)
    max = numbers[i];
}
```
例子2
```
//自定义typeof函数（注意，系统自带的typeof是运算符，不是函数）
function typeOf(o){
  return Object.prototype.toString.call(o).slice(8,-1);
}
//自定义typeOf函数测试
console.log(typeOf (2.1));  //Number
console.log(typeOf (undefined));  //Undefined
console.log(typeOf ({}));  //Object
console.log(typeOf ("hello"));  //String
console.log(typeOf (false));  //Boolean
console.log(typeOf (typeOf));  //Function
console.log(typeOf (null));  //Null
console.log(typeOf ([]));  //Array
console.log(typeOf (new Date));  //Date
console.log(typeOf (/\d/));  //RegExp
console.log(typeOf (document.  getElementsByTagName('body')[0]));  //HTMLBodyElement

//系统typeof运算符测试
console.log(typeof (2.1));  //number
console.log(typeof (undefined));  //Undefined
console.log(typeof ({}));  //object
console.log(typeof ("hello"));  //string
console.log(typeof (false));  //boolean
console.log(typeof (typeOf));  //function
console.log(typeof (null));  //object
console.log(typeof ([]));  //object
console.log(typeof (new Date));  //object
console.log(typeof (/\d/));  //object
console.log(typeof (document.  getElementsByTagName('body')[0]));  //object

//明显比系统自己的实用多了
```
例子3
```
//把类数组对象转为数组（类数组对象就是属性key为0,1,2,...,还具有一个key为length的可以像数组一样动态改变的值的对象）
function(){
  return Array.prototype.slice.call(arguments);
}
```
例子4
```
//用js访问元素伪类
function getRuleSelector(selector){

  return Array.prototype.filter.call(getCssList(), function(x){
    return pure(x.selectorText) === pure(selector);
  });

  function pure(selector){
    selector.replace(/::/g, ":");   //把双冒号替换为单冒号
  }

  function getCssList(){
    return Array.prototype.concat.apply([], Array.prototype.map.call(document.styleSheets, function(x){
      return Array.prototype.slice.call(x.cssRules);
    }));
  }
}
```
例子5
```
//为每个DOM元素注册事件
Array.prototype.forEach.call(document.querySelectAll('input[type=button]'), function(ele){
  ele.addEventLister("click", fun, false);
});
```
例子6
```
//自定义forEach函数遍历Dom元素列表（类数组对象）
var forEach = Function.prototype.call.bind(Array.prototype.forEach);

DOMElementList = document.getElementByTagName("li");
forEach(DOMElementList, function (el) {
  el.addEventListener('click', handle);   //handle定义省略
});
```

###箭头函数中的this

之所以最后说箭头函数，一方面因为这是ES6中的内容，更重要的时因为箭头函数中的this永远不能被call, bind和apply改变，也就是说箭头函数中的this可不改变，仅仅与其定义的位置有关。

箭头函数的最大特点是：**它不改变this的作用域(上下文环境)，但是依然构成局部作用域**，我们之前遇到过闭包内this值被改变的问题，我们用重新定义局部变量的方式解决了这个问题。如果有了箭头函数，解决这个问题就简单多了

这是上面出现过的一段代码:
```
var o = {
  name: "Lily",
  age: 18,
  gender: "F",
  speak: function (){
    function fun(){
      console.log(this);
    }
    fun();
  }
};
o.speak();  //window
```
看看用箭头函数函数怎优雅的解决这个问题
```
var o = {
  name: "Lily",
  age: 18,
  gender: "F",
  speak: function (){
    (() => {console.log(this);})(); //一个立即执行的箭头函数
  }
};
o.speak();  //Object {name: "Lily", age: 18, gender: "F"}
```
或者这样也可以：
```
  var o = {
  name: "Lily",
  age: 18,
  gender: "F",
  speak: function (){
    return () => {console.log(this);}; //返回一个箭头函数
  }
};
o.speak()();  //Object {name: "Lily", age: 18, gender: "F"}
```
