> **写在前面**
> 本文包括浏览器调试，不包括web移动端调试。
> 本文调试均在chrome浏览器进行

<!-- MarkdownTOC -->

- [alert](#alert)
- [console](#console)
	- [基本输出](#%E5%9F%BA%E6%9C%AC%E8%BE%93%E5%87%BA)
	- [格式化输出](#%E6%A0%BC%E5%BC%8F%E5%8C%96%E8%BE%93%E5%87%BA)
	- [DOM输出](#dom%E8%BE%93%E5%87%BA)
	- [对象输出](#%E5%AF%B9%E8%B1%A1%E8%BE%93%E5%87%BA)
	- [成组输出](#%E6%88%90%E7%BB%84%E8%BE%93%E5%87%BA)
	- [函数计数和跟踪](#%E5%87%BD%E6%95%B0%E8%AE%A1%E6%95%B0%E5%92%8C%E8%B7%9F%E8%B8%AA)
	- [计时](#%E8%AE%A1%E6%97%B6)
	- [性能分析](#%E6%80%A7%E8%83%BD%E5%88%86%E6%9E%90)
- [debugger](#debugger)
- [chrome中的调试技巧](#chrome%E4%B8%AD%E7%9A%84%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7)
- [调试过程注意事项](#%E8%B0%83%E8%AF%95%E8%BF%87%E7%A8%8B%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

<!-- /MarkdownTOC -->


### alert
这个不用多说了，不言自明

### console

#### 基本输出
想必大家都在用console.log在控制台输出点东西，其实console还有其它的方法：
```javascript
console.log("打印字符串");//在控制台打印自定义字符串
console.error("我是个错误");//在控制台打印自定义错误信息
console.info("我是个信息");//在控制台打印自定义信息
console.warn("我是个警告");//在控制台打印自定义警告信息
console.debug("我是个调试");//在控制台打印自定义调试信息
cosole.clear();//清空控制台（这个下方截图中没有）
```
![console](img/20161116152838380.png)

注意上面输出的error和throw出的error不一样，前者只是输出错误信息，无法捕获，不会冒泡，更不会中止程序运行。

#### 格式化输出
除此以外，console还支持自定义样式和类似c语言的printf形式
```javascript
console.log("%s年",2016);//%s表示字符串
console.log("%d年%d月",2016,11);//%d表示整数
console.log("%f",3.1415926);//%f小数
console.log("%o",console);//%o表示对象

console.log("%c自定义样式","font-size:30px;color:#00f");
console.log("%c我是%c自定义样式","font-size:20px;color:green","font-size:10px;color:red");

```
![console](img/20161116152916007.png)
<todo>

#### DOM输出
下面几个比较简单的，就不举例子了，简单说一下：
```javascript
var ul = document.getElementsByTagName("ul");
console.dirxml(ul); //树形输出table节点，即<table>和它的innerHTML，由于document.getElementsByTagName是动态的，所以这个得到的结果肯定是动态的
```
![console](img/20161116153044445.png)

#### 对象输出
```javascript
var o = {
  name:"Lily",
  age: 18
};
console.dir(obj);//显示对象自有属性和方法
```

![console](img/20161116153304290.png)

对于多个对象的集合，你可以这样，输出更清晰：
```js
var stu = [{name:"Bob",age:13,hobby:"playing"},{name:"Lucy",age:14,hobby:"reading"},{name:"Jane",age:11,hobby:"shopping"}];
console.log(stu);
console.table(stu);
```
![这里写图片描述](img/20170613202355298.png)
#### 成组输出
```javascript
//建立一个参数组
console.group("start"); //引号里是组名，自己起
console.log("sub1");
console.log("sub1");
console.log("sub1");
console.groupEnd("end");
```
![console](img/20161116153443103.png)

#### 函数计数和跟踪
```javascript
function fib(n){ //输出前n个斐波那契数列值
  if(n == 0) return;
  console.count("调用次数");//放在函数里，每当这句代码运行输出所在函数执行次数
  console.trace();//显示函数调用轨迹(访问调用栈）
  var a = arguments[1] || 1;
  var b = arguments[2] || 1;
  console.log("fib=" + a);
  [a, b] = [b, a + b];
  fib(--n, a, b);
}
fib(6);
```
![console](img/20161116154120105.png)
<small>注：Chrome开发者工具中的Sources标签页也在Watch表达式下面显示调用栈。</small>

#### 计时
```
console.time() //计时开始
fib(100); //用上述函数计算100个斐波那契数
console.timeEnd() //计时结束并输出时长
```
![console](img/20161116154455279.png)
断言语句，这个c++调试里面也经常用到。js中，当第一个表达式或参数为true时候什么也不发生，为false时终止程序并报错
```
console.assert(true, "我错了");
console.assert(false, "我真的错了");
```
![console](img/20161116154524668.png)

#### 性能分析
```
function F(){
  var i = 0;
  function f(){
    while(i++ == 1000);
  }
  function g(){
    while(i++ == 100000);
  }
  f();
  g();
}
console.profile();
F();
console.profileEnd();
```
![console](img/20161116154926327.png)
<small>注：Chrome开发者工具中的Audits标签页也可以实现性能分析。</small>

### debugger

这个重量级的是博主最常用的，可能是c++出身，对于单步调试由衷的热爱。单步调试就是点一下，执行一句程序，并且可以查看当前作用域可见的所有变量和值。而debugger就是告诉程序在那里停下来进行单步调试，俗称断点。

![debugger](img/20161116154955796.png)


右边按钮如下：

 - Pause/Resume script execution：暂停/恢复脚本执行（程序执行到下一断点停止）。
 - Step over next function call：执行到下一步的函数调用（跳到下一行）。
 - Step into next function call：进入当前函数。
 - Step out of current function：跳出当前执行函数。
 - Deactive/Active all breakpoints：关闭/开启所有断点（不会取消）。
 - Pause on exceptions：异常情况自动断点设置。

其实右侧还有很多强大的功能
![debugger](img/20161116160208020.png)

- Watch：Watch表达式
- Call Stack: 栈中变量的调用，这里是递归调用，肯定是在内存栈部分调用。
- Scope：当前作用域变量观察。
- BreakPoints：当前断点变量观察。
- XHR BreakPoints：面向Ajax，专为异步而生的断点调试功能。
- DOM BreakPoints：主要包括下列DOM断点，注册方式见下图
1. 当节点属性发生变化时断点（Break on attributes modifications）
2. 当节点内部子节点变化时断点（Break on subtree modifications）
3. 当节点被移除时断点（Break on node removal）
![debugger](img/20161116162639845.png)
- Global Listeners：全局事件监听
- Event Listener Breakpoints：事件监听器断点，列出了所有页面及脚本事件，包括：鼠标、键盘、动画、定时器、XHR等等。

### chrome中的调试技巧
1. DOM元素的控制台书签
Chrome开发者工具和Firebug都提供了书签功能，用于显示你在元素标签页（Chrome）或HTML标签页（Firebug）中最后点击的DOM元素。如果你依次选择了A元素、B元素和C元素，那么\$0 表示C元素，\$1 表示B元素，\$2 表示A元素。（这个和正则表达式的\$符号类似，不过顺序不同）

2. 如果你想调试f函数，用debug(f)语句可以增加这种断点。
3. Sources标签页左侧面板上有一个代码片段（Snippet）子标签页，可用于保存代码片段，帮你调试代码。
4. 可以用Chrome开发者工具Sources标签页中的格式化按钮（Pretty Print Button）格式化压缩后的代码。
5. 在Network面板，选择一个资源文件，右键Copy Response可快速复制响应内容。
6. 利用媒体查询，这个主要是在Device Mode调节不同的分辨率显示。
7. 选择Elements，按 Esc > Emulation > Sensors进行传感器模拟。
8. 点击渐入效果样式图标（紫色图标），可以预览动画效果，并可对相应的贝塞尔曲线(cubic-bezier)进行调节动画效果。
9. 在Source中按住Alt键并拖动鼠标进行多列内容选择。
10. Elements面板右键执行DOM元素节点，选择Force Element State或者点击右侧Toggle Element State图标可以出发伪类。
11. Network面板中选择一张图片，在右侧图片上鼠标右键选择copy it as a Data URI,就可以获取图片的Data URL (base64编码)。
12. 通过按住Ctrl键可以添加多个编辑光标，同时对多处进行编辑。按下Ctrl + U可以撤销编辑。
13. Elements面板右侧的Style编辑器中，点击颜色十六进制编码前的小色块，会弹出一个调色板。
14. 按下Alt键并且鼠标双击选择DOM元素前面的箭头，就会展开该DOM元素下的所有字节点元素.
15. 快捷键：
- **快速定位到行：**快捷键`Ctrl+O`(Mac:`CMD+O`),输入：行号:列号 来进行定位
- **元素搜索：**快捷键`Ctrl+F`(Mac:`CMD+F`),试试在搜索栏输入ID选择符或者类选择符就可以定位到元素啦


### 调试过程注意事项
1.避免记录引用类型
当记录对象或数组时，永远记得你在记录什么。记录原始类型时，使用带断点的watch表达式。如果是异步代码，避免记录引用类型。
```javascript
var arr = [{ num: 0 }];
setInterval(function(){
console.log(arr);
arr[0].num += 1;
}, 1000);
```
![careful](img/20161116164627217.png)

这里，第一个属性中对象引用的值是不可靠的。当你第一次在开发者工具中显示这个属性时，num的值就已经确定了。之后无论你对同一个引用重新打开多少次都不会变化。

2.尽可能使用 source map。有时生产代码不能使用source map，但不管怎样，你都不应该直接对生产代码进行调试。

