<!-- MarkdownTOC -->

- [标识符命名规则](#%E6%A0%87%E8%AF%86%E7%AC%A6%E5%91%BD%E5%90%8D%E8%A7%84%E5%88%99)
- [基本数据类型](#%E5%9F%BA%E6%9C%AC%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)
- [复杂数据类型](#%E5%A4%8D%E6%9D%82%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)
  - [基本数据类型对应的对象](#%E5%9F%BA%E6%9C%AC%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E5%AF%B9%E5%BA%94%E7%9A%84%E5%AF%B9%E8%B1%A1)
  - [js中其他常见的对象](#js%E4%B8%AD%E5%85%B6%E4%BB%96%E5%B8%B8%E8%A7%81%E7%9A%84%E5%AF%B9%E8%B1%A1)
  - [数组和对象的访问](#%E6%95%B0%E7%BB%84%E5%92%8C%E5%AF%B9%E8%B1%A1%E7%9A%84%E8%AE%BF%E9%97%AE)
- [基本运算和运算符](#%E5%9F%BA%E6%9C%AC%E8%BF%90%E7%AE%97%E5%92%8C%E8%BF%90%E7%AE%97%E7%AC%A6)

<!-- /MarkdownTOC -->

## 标识符命名规则

对于变量名，键值对中的键名应满足如下要求：

- 开头必须是字母、下划线(`_`)或美元符号(`$`)
- 除了开头以外的字符也可以是数字
- 不可以是关键字和保留字
- 最好不要和全局变量/函数同名，会把原有变量/函数覆盖的风险

这里，关键字就是在 js 中有特殊意义的单词，而保留字是为了以后使用预留的词语。但不要求背它们，随着学习的深入，自然就都记住了。

常见的关键字有：

break、delete、function、return、typeof、case、do、if、switch、var、catch、else、in、this、void、continue、false、instanceof、throw、while、debugger、finally、new、true、const、with、let、default、for、null、try、async 等等

常见的保留字有：

class、enum、export、extends、import 、super等等

本文可能会直接用到的有：

- var: 定义一个变量
- console.log(): 在浏览器控制台或后台终端输出一个值
- alert():  在浏览器弹窗输出一个值

## 基本数据类型

Javascript 基本类型包括：数值，字符串，null，undefined 和布尔型。还有 ES6 中的 Symbol 类型，这篇博客暂时先不提 Symbol 类型。

比如：
```js
var num = 1;    //数值型
var str = 'hello world';   //字符串，双引号也可以
var flag = true;   //布尔型，取值 true 或 false
var obj = null;    //空类型
var it = undefined;   //undefined
```

这里简单解释一下需要注意问题：

1. 数值类型是不区分整型与浮点型的；
2. 数值类型默认都是以 double 浮点数形式储存的；
3. 数值类型范围在 5e-324 至1.7976931348623157e+308，即 `Number.MIN_VALUE 至 Number.MAX_VALUE；
4. js 没有字符类型，只有字符串类型；
5. null 表示正常的、意料之中的空值，而 undefined 表示以外的空值。对于只声明未赋值的变量，默认值为 undefined；
6. 数值类型有几个特殊值：
- Infinity： 正无穷
- -Infinity：负无穷
- NaN：非法数值(Not a Number)，但他还是个数值（好矛盾）

## 复杂数据类型

#### 基本数据类型对应的对象
js 中其实除了基本类型以外其他类型的本质都是对象，就算是基本类型变量，除了 undefined 和 null 以外，都有其对应的对象类型。如下：
```js
var num = new Number(2);
var str = new String('hello');
var flag = new Boolean(true);
```
这里一定要清楚，其对象类型和基本类型不是一个东西，具体的看完类型转换就一切都清楚了。

#### js中其他常见的对象

当然，下面继续说对象，js 常用的对象有：Array，Object，Date，RegExp等等。定义方法如下：
```js
var arr = new Array();   //得到一个空数组
var arr2 = new Array(5);   //得到一个长度为5的数组，初值为undefined
var arr3 = new Array('b','a','c');    //得到一个长为3，对应值为'b','a','c' 的数组
var obj = new Object();   //得到一个空对象
var now = new Date();    //得到当前时间
var reg = RegExp('^[A-Za-z][\w\d]*$');   //得到一个正则表达式
```
对于数组、正则表达式和对象还有一种字面量的定义方法，这个方法和上面是完全等价的：
```js
var arr = [];   //得到一个空数组
var arr3 = ['b','a','c'];    //得到一个长为3，对应值为'b','a','c' 的数组
var obj = {};   //得到一个空对象
var reg = /^[A-Za-z][\w\d]*$/;  //得到一个正则表达式
```

#### 数组和对象的访问

这个部分直接举例子：

- 数组：一些数据的集合，这里不要求数据必须是同样类型的
```js
var arr = [1, 2, 3, 'a'];    //定义一个数组
arr[0];     //1     访问数组的第1个元素，注意索引从0开始
arr[1];     //2     访问数组的第2个元素
arr[3];     //'a'    访问数组的第4个元素
arr[-1],  arr[4],  arr[1.3];    //undefined   访问数组越界或索引不正确都返回 undefined
```
- 对象: 键值对的集合，键值对之间由逗号分开，键和值由冒号分开
```js
var obj = {
    name: 'Bob',
    age: 18,
    gender: 'M'
};
obj.name;    //'Bob'  获取 obj 对象的姓名
obj.age;    //18  获取 obj 对象的年龄
obj.gender;    //'M'  获取 obj 对象的性别
```
注意当键名中有符号也需要加引号。

其余的对象会在以后用到的时候再仔细讲

## 基本运算和运算符

运算符就像我们数学中的加减乘除，也像数学中的计算规定的先后顺序，这里我直接给出所以运算符的运算顺序和实例，必要的解释在表格后面，没有解释到的属于比较深奥的运算符，记住它的顺序即可，功能后续再理解。

<table>
  <tr>
    <td>优先级</td>
    <td>运算符</td>
    <td>结合性</td>
    <td>举例</td>
    <td>说明</td>
  </tr>
  <tr>
    <td>19</td>
    <td>圆括号</td>
    <td>n/a</td>
    <td>( … )</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="3">18</td>
    <td>成员访问</td>
    <td>从左到右</td>
    <td>obj.name</td>
    <td> - </td>
  </tr>
  <tr>
    <td>需计算的成员访问</td>
    <td>从左到右</td>
    <td>obj["name"]</td>
    <td> - </td>
  </tr>
  <tr>
    <td>new (带参数列表)</td>
    <td>n/a</td>
    <td>new Person()</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="2">17</td>
    <td>函数调用</td>
    <td>从左到右</td>
    <td>fun(args)</td>
    <td> - </td>
  </tr>
  <tr>
    <td>new (无参数列表)</td>
    <td>从右到左</td>
    <td>new fun</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="2">16</td>
    <td>后置递增</td>
    <td>n/a</td>
    <td>a++</td>
    <td>相当于 a = a + 1;</td>
  </tr>
  <tr>
    <td>后置递减</td>
    <td>n/a</td>
    <td>a--</td>
    <td>相当于 a = a - 1;</td>
  </tr>
  <tr>
    <td rowspan="9">15</td>
    <td>逻辑非</td>
    <td>从右到左</td>
    <td>!a</td>
    <td> - </td>
  </tr>
  <tr>
    <td>按位非</td>
    <td>从右到左</td>
    <td>~a</td>
    <td> - </td>
  </tr>
  <tr>
    <td>一元加法</td>
    <td>从右到左</td>
    <td>+a</td>
    <td> - </td>
  </tr>
  <tr>
    <td>一元减法</td>
    <td>从右到左</td>
    <td>-a</td>
    <td> - </td>
  </tr>
  <tr>
    <td>前置递增</td>
    <td>从右到左</td>
    <td>++a</td>
    <td> - </td>
  </tr>
  <tr>
    <td>前置递减</td>
    <td>从右到左</td>
    <td>--a</td>
    <td> - </td>
  </tr>
  <tr>
    <td>typeof</td>
    <td>从右到左</td>
    <td>typeof 4</td>
    <td>得到值的类型 'number'</td>
  </tr>
  <tr>
    <td>void</td>
    <td>从右到左</td>
    <td>void(0)</td>
    <td>执行表达式并返回 undefined</td>
  </tr>
  <tr>
    <td>delete</td>
    <td>从右到左</td>
    <td>delete obj.age</td>
    <td>删除对象属性</td>
  </tr>
  <tr>
    <td rowspan="3">14</td>
    <td>乘法</td>
    <td>从左到右</td>
    <td>2 * 3</td>
    <td>得 6</td>
  </tr>
  <tr>
    <td>除法</td>
    <td>从左到右</td>
    <td>4 / 2</td>
    <td>得 2</td>
  </tr>
  <tr>
    <td>取模</td>
    <td>从左到右</td>
    <td>4 % 3</td>
    <td>得 1</td>
  </tr>
  <tr>
    <td rowspan="2">13</td>
    <td>加法</td>
    <td>从左到右</td>
    <td>1 + 3</td>
    <td>得 4</td>
  </tr>
  <tr>
    <td>减法</td>
    <td>从左到右</td>
    <td>2 - 3</td>
    <td>得 -1</td>
  </tr>
  <tr>
    <td rowspan="3">12</td>
    <td>按位左移</td>
    <td>从左到右</td>
    <td>32 &lt;&lt; 5</td>
    <td>得 1024</td>
  </tr>
  <tr>
    <td>按位右移</td>
    <td>从左到右</td>
    <td>32 &gt;&gt; 3</td>
    <td>得 8</td>
  </tr>
  <tr>
    <td>无符号右移</td>
    <td>从左到右</td>
    <td>-32 &gt;&gt;&gt; 2</td>
    <td>得 1073741816</td>
  </tr>
  <tr>
    <td rowspan="6">11</td>
    <td>小于</td>
    <td>从左到右</td>
    <td>-1 &lt; 2</td>
    <td>得 true</td>
  </tr>
  <tr>
    <td>小于等于</td>
    <td>从左到右</td>
    <td>-1 &lt;= 2</td>
    <td>得 true</td>
  </tr>
  <tr>
    <td>大于等于</td>
    <td>从左到右</td>
    <td>1 >= 2</td>
    <td>得 false</td>
  </tr>
  <tr>
    <td>大于</td>
    <td>从左到右</td>
    <td>1 > 2</td>
    <td>得 false</td>
  </tr>
  <tr>
    <td>in</td>
    <td>从左到右</td>
    <td>"name" in obj</td>
    <td> - </td>
  </tr>
  <tr>
    <td>instanceof</td>
    <td>从左到右</td>
    <td>li instanceof HTMLElement</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="4">10</td>
    <td>等号</td>
    <td>从左到右</td>
    <td>5 == '5'</td>
    <td>得 true</td>
  </tr>
  <tr>
    <td>非等号</td>
    <td>从左到右</td>
    <td>5 != '5'</td>
    <td>得 false</td>
  </tr>
  <tr>
    <td>全等号</td>
    <td>从左到右</td>
    <td>5 === '5'</td>
    <td>得 false</td>
  </tr>
  <tr>
    <td>非全等号</td>
    <td>从左到右</td>
    <td>5 !== '5'</td>
    <td>得 true</td>
  </tr>
  <tr>
    <td>9</td>
    <td>按位与</td>
    <td>从左到右</td>
    <td>10 &amp; 40</td>
    <td>得 8</td>
  </tr>
  <tr>
    <td>8</td>
    <td>按位异或</td>
    <td>从左到右</td>
    <td>10 ^ 40</td>
    <td>得 34</td>
  </tr>
  <tr>
    <td>7</td>
    <td>按位或</td>
    <td>从左到右</td>
    <td>10 | 40</td>
    <td>得 42</td>
  </tr>
  <tr>
    <td>6</td>
    <td>逻辑与</td>
    <td>从左到右</td>
    <td>0 &amp;&amp; 3</td>
    <td>得 0，不得 false</td>
  </tr>
  <tr>
    <td>5</td>
    <td>逻辑或</td>
    <td>从左到右</td>
    <td>0 || 3</td>
    <td>得 3，不得 true</td>
  </tr>
  <tr>
    <td>4</td>
    <td>?:</td>
    <td>从右到左</td>
    <td>3 != 0 ? 1 : 2</td>
    <td>得 1</td>
  </tr>
  <tr>
    <td rowspan="12">3</td>
    <td rowspan="12">赋值</td>
    <td>从右到左</td>
    <td>a = 2</td>
    <td> - </td>
  </tr>
  <tr>
    <td>+=</td>
    <td>a += 2</td>
    <td>相当于 a = a + 2</td>
  </tr>
  <tr>
    <td>-=</td>
    <td>a -= 2</td>
    <td>相当于 a = a - 2</td>
  </tr>
  <tr>
    <td>*=</td>
    <td>a *= 2</td>
    <td>相当于 a = a * 2</td>
  </tr>
  <tr>
    <td>/=</td>
    <td>a /= 2</td>
    <td>相当于 a = a / 2</td>
  </tr>
  <tr>
    <td>&amp;=</td>
    <td>a &amp;= 2</td>
    <td>相当于 a = a &amp; 2</td>
  </tr>
  <tr>
    <td>|=</td>
    <td>a |= 2</td>
    <td>相当于 a = a | 2</td>
  </tr>
  <tr>
    <td>^=</td>
    <td>a ^= 2</td>
    <td>相当于 a = a ^ 2</td>
  </tr>
  <tr>
    <td>%=</td>
    <td>a %= 2</td>
    <td>相当于 a = a % 2</td>
  </tr>
  <tr>
    <td>&lt;&lt;=</td>
    <td>a &lt;&lt;= 2</td>
    <td>相当于 a = a &lt;&lt; 2</td>
  </tr>
  <tr>
    <td>>>=</td>
    <td>a &gt;&gt;= 2</td>
    <td>相当于 a = a &gt;&gt; 2</td>
  </tr>
  <tr>
    <td>&gt;&gt;&gt;=</td>
    <td>a &gt;&gt;&gt;= 2</td>
    <td>相当于 a = a &gt;&gt;&gt; 2</td>
  </tr>
  <tr>
    <td rowspan="2">2</td>
    <td>yield</td>
    <td>从右到左</td>
    <td>yield returnValue;</td>
    <td> - </td>
  </tr>
  <tr>
    <td>yield*</td>
    <td>从右到左</td>
    <td>yield* returnValue;</td>
    <td> - </td>
  </tr>
  <tr>
    <td>1</td>
    <td>展开运算符</td>
    <td>n/a</td>
    <td>arr1.push(...arr2)</td>
    <td> - </td>
  </tr>
  <tr>
    <td>0</td>
    <td>逗号</td>
    <td>从左到右</td>
    <td>a=1, b=2</td>
    <td>返回最后一个表达式的值 2</td>
  </tr>
</table>

需要说明的是：

0. 优先级越高的优先计算，同优先级的从左到右依次计算；
1.  a++ 与 ++a 的区别: 前者先返回值后自加，后者先自加再返回值(a-- 与 --a 同理)；
2. 涉及到位运算的部分不是十分重要，但以后的文章会细谈；
3. == 和 === 的区别，前者比较是发生自动类型转换，后者不发生自动类型转换(!= 与 !== 同理)；
4. 对于 `exp ? val1 : val2;` 如果 exp 的结果为 true，整个表达式得 val1, 否则得 val2;
