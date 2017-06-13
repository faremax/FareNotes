<!-- MarkdownTOC -->

- [基本概念](#%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
- [同源策略](#%E5%90%8C%E6%BA%90%E7%AD%96%E7%95%A5)
- [Ajax](#ajax)
- [Ajax常见问题](#ajax%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
  - [缓存问题](#%E7%BC%93%E5%AD%98%E9%97%AE%E9%A2%98)
  - [中文乱码问题](#%E4%B8%AD%E6%96%87%E4%B9%B1%E7%A0%81%E9%97%AE%E9%A2%98)
  - [兼容性问题](#%E5%85%BC%E5%AE%B9%E6%80%A7%E9%97%AE%E9%A2%98)
- [GET和POST方式对比](#get%E5%92%8Cpost%E6%96%B9%E5%BC%8F%E5%AF%B9%E6%AF%94)
- [跨域数据访问](#%E8%B7%A8%E5%9F%9F%E6%95%B0%E6%8D%AE%E8%AE%BF%E9%97%AE)
  - [JSONP](#jsonp)
- [其他 Ajax 参数及方法](#%E5%85%B6%E4%BB%96-ajax-%E5%8F%82%E6%95%B0%E5%8F%8A%E6%96%B9%E6%B3%95)
- [jQuery 中的 Ajax 方法](#jquery-%E4%B8%AD%E7%9A%84-ajax-%E6%96%B9%E6%B3%95)
  - [ajax 静态方法](#ajax-%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95)
  - [ajax 动态方法](#ajax-%E5%8A%A8%E6%80%81%E6%96%B9%E6%B3%95)
  - [其他相关方法](#%E5%85%B6%E4%BB%96%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95)
- [简单封装 Ajax 相关方法](#%E7%AE%80%E5%8D%95%E5%B0%81%E8%A3%85-ajax-%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95)

<!-- /MarkdownTOC -->

## 基本概念

Ajax 全称是异步的 JavaScript 和 XML 。 通过在后台与服务器进行少量数据交换，AJAX 可以使网页实现异步更新。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。传统的网页（不使用 AJAX）如果需要更新内容，必须重载整个网页页面。

Ajax 具有以下优点和缺点：

- 优点

1. 无需刷新页面，用户体验好；
2. 异步与服务器通信，不影响主进程，响应更迅速；
3. 可以把部分服务器的工作放在客户端的浏览器完成，减轻服务器压力，减少冗余请求和响应；
4. Ajax 是前端开发的标准化技术，无需插件支持，跨平台性能好；

- 缺点

1. Ajax 请求不修改浏览器历史记录，因此不支持前进后退功能；
2. Ajax 暴露了过多和服务器交互的细节；
3. 破坏了程序的异常机制，容易调试；
4. 不利于搜索引擎抓取信息；

## 同源策略

同源策略是Netscape提出的一个著名的安全策略，它是指同一个“源头”的数据可以自由访问，但不同源的数据相互之间都不能访问。我们试想一下以下几种情况：
1. 我们打开了一个天猫并且登录了自己的账号，这时我们再打开一个天猫的商品，我们不需要再进行一次登录就可以直接购买商品，因为这两个网页是同源的，可以共享登录相关的 cookie 或 localStorage 数据；
2. 如果你正在用支付宝或者网银，同时打开了一个不知名的网页，如果这个网页可以访问你支付宝或者网银页面的信息，就会产生严重的安全的问题。显然浏览器不允许这样的事情发生；
3. 想必你也有过同时登陆好几个 qq 账号的情况，如果同时打开各自的 qq 空间浏览器会有一个小号模式，也就是另外再打开一个窗口专门用来打开第二个 qq 账号的空间。

很明显，第1个和第3个例子中，不同的天猫商店和 qq 空间属于同源，可以共享登录信息。qq 为了区别不同的 qq 的登录信息，重新打开了一个窗口，因为浏览器的不同窗口是不能共享信息的。而第2个例子中的支付宝、网银、不知名网站之间是非同源的，所以彼此之间无法访问信息，如果你执意想请求数据，会提示异常：

```
No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
```

那么什么是同源的请求呢？同源请求要求被请求资源页面和发出请求页面满足3个相同：

> 协议相同
> 域名相同
> 端口相同

简单理解一下：

```
/*以下两个数据非同源，因为协议不同*/
http://www.abc123.com.cn/item/a.js
https://www.abc123.com.cn/item/a.js

/*以下两个数据非同源，因为域名不同*/
http://www.abc123.com.cn/item/a.js
http://www.abc123.com/item/a.js

/*以下两个数据非同源，因为主机名不同*/
http://www.abc123.com.cn/item/a.js
http://item.abc123.com.cn/item/a.js

/*以下两个数据非同源，因为协议不同*/
http://www.abc123.com.cn/item/a.js
http://www.abc123.com.cn:8080/item/a.js

/* 以下两个数据非同源，域名和 ip 视为不同源
 * 这里应注意，ip和域名替换一样不是同源的
 * 假设www.abc123.com.cn解析后的 ip 是 195.155.200.134
 */
http://www.abc123.com.cn/
http://195.155.200.134/

/*以下两个数据同源*/                               /* 这个是同源的*/
http://www.abc123.com.cn/source/a.html
http://www.abc123.com.cn/item/b.js
```

## Ajax

Ajax在编写时一共4个步骤：

1. 创建 xhr 对象
2. 设置传输地址
3. 设置回调函数
4. 发送数据

常见的发送方式有 GET 和 POST，除此之外还有 HEAD, DELETE, TRACE, PUT, CONNECT, OPTIONS和 PATCH等，这里只举例前两个 GET 和 POST。

例如根据姓名查询一个人的信息并写在div#output中

```
//GET 方法
function search(name, fun){
  var xhr = new XMLHttpRequest();
  var url = "search.php?name=" + window.encodeURIComponent(name) + "&t=" + Math.random();
  xhr.open("GET", url);
  xhr.send();
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
        var data = JSON.parse(xhr.responseText);   //获取了 JSON 字符串
        fun(data);
    }
  }
}
function show(data){
    this.innerHTML = "姓名：" + data.name + "<br />性别：" + data.gender + "<br />年龄：" + data.age + "<br />地址：" + data.address + "<br />电话：" + data.tel;
}
var output = document.getElementById("output");
search("李华", show.bind(output));

//服务器端 search.php
<?php
 $name = $_GET[name];
 //模拟数据查询结果
 echo '{"name":"' . $name .'","age":18,"gender":"男","tel":"13211112222","address":"北京市海淀区xxxxxxxx"}';
?>
```


```
//POST方法
function search(name, fun){
  var xhr = new XMLHttpRequest();
  var url = "search.php";
  var para = "name=" + window.encodeURIComponent(name) + "&t=" + Math.random();
  xhr.open("POST", url);
  //POST方式下，必须把 Content-Type 设置为application/x-www-form-urlencoded
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      console.log(xhr.responseText);
        var data = JSON.parse(xhr.responseText);   //获取了 JSON 字符串
        fun(data);
    }
  }
  xhr.send(para);
}
function show(data){
    this.innerHTML = "姓名：" + data.name + "<br />性别：" + data.gender + "<br />年龄：" + data.age + "<br />地址：" + data.address + "<br />电话：" + data.tel;
}
var output = document.getElementById("output");
search("李华", show.bind(output));


//服务器端 search.php
<?php
 $name = $_POST[name];
 //模拟数据查询结果
 echo '{"name":"' . $name .'","age":18,"gender":"男","tel":"13211112222","address":"北京市海淀区xxxxxxxx';
?>
```

上述代码的 jQuery 写法：

```
//GET 方式
function search(name, fun){
  var url = "search.php?name=" + window.encodeURIComponent(name) + "&t=" + Math.random();
  $.get(url, fun);
}
function show(data){
  data = JSON.parse(data);
    this.innerHTML = "姓名：" + data.name + "<br />性别：" + data.gender + "<br />年龄：" + data.age + "<br />地址：" + data.address + "<br />电话：" + data.tel;
}
var output = document.getElementById("output");
search("李华", show.bind(output));
```

```
//POST 方式
function search(name, fun){
  var url = "search.php";
  var obj = {};
  obj.name = name;
  obj.t = Math.random();
  $.post(url, obj, fun);
}
function show(data){
  data = JSON.parse(data);
    this.innerHTML = "姓名：" + data.name + "<br />性别：" + data.gender + "<br />年龄：" + data.age + "<br />地址：" + data.address + "<br />电话：" + data.tel;
}
var output = document.getElementById("output");
search("李华", show.bind(output));

```

## Ajax常见问题

### 缓存问题

细心一些可以发现，上面发送请求的数据中加入了一个随机数 t。因为有时服务器更新的了数据后，我们再一次执行 Ajax 请求不能显示新的结果，这是由于 js 为了加速，页面会使用缓存保持当前调用的相同链接。我们加了一个随机数以后，每次请求不同，浏览器就不会使用缓存数据了。

### 中文乱码问题

返回的中文数据乱码是因为 js 页面和action页面中使用了不同的编码方式导致的。可以有以下2中方式解决(浏览器 html 文件是 urf-8 编码的):
1. 对请求数据字段进行2次 encodeURI 编码，服务器获取数据后做一次 UTF-8 转码
2. 对请求数据字段进行1次 encodeURI 编码，服务器获取数据后做一次 ISO-8859-1 转换 和一次 UTF-8 转码
<small>tips: 考虑到兼容性，第1个方法更好</small>

### 兼容性问题

之前的代码并没有按兼容性的格式书写，不过 Ajax 的兼容也不难，主要表现在 XMLHTTPRequest对象获取环节:

```
var xhr;
if(XMLHttpRequest){
  xhr = new XMLHttpRequest();    //chrome, safari, opera, firefox
} else if(ActionXObject){
  try{
    xhr = new ActionXObject("Msxml2.XMLHTTP");   //IE 中 Msxml 插件
  }catch(e){
    xhr = new ActionXObject("Microsoft.XMLHTTP");   //IE
  }
}
```


## GET和POST方式对比

--- | GET | POST
--- | --- | ---
后退/刷新 | 无害 | 数据会重新提交
书签 | 可藏为书签 | 无法藏为书签
缓存 | 可以缓存 | 不可以缓存
MIME类型 | application/x-www-from-urlencode | application/x-www-from-urlencode或 multipart/form-data (二进制为多重编码
历史记录 | 参数保留在历史记录中 | 参数不会留在历史记录
数据长度 | URL最长2048个字符(2kB) | 无限
数据类型 | ASCII字符 | 无限
安全性 | 差 | 较
可见性 | 数据可见 | 数据不可见

## 跨域数据访问

### JSONP

这里需要强调的是，jsonp不属于Ajax的部分，它只是吧url放入script标签中实现的数据传输，主要优点是不受同源策略限制。由于一般库也会把它和Ajax封装在一起，所以这里放在一起讨论。下面是一个jsonp的例子（实现功能：输入手机号码查询归属地和运营商）：

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>兼容问题</title>

</head>
<body>
<form>
    <input type="text" name="tel" id="tel" />
    <input type="button" value="search" id="search"/>
    <br/>
</form>
<div id="output"></div>
</body>

<script>
    function jsonpCallback(data) {
        document.getElementById('output').innerHTML = data.province + " " + data.catName;
    }
    document.getElementById('search').onclick = function(){
        var num = document.getElementById('tel').value;
        if(/^1[34578]\d{9}$/.test(num)){
            var url = "http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=" + num + "t=" + Math.random() + "&callback=jsonpCallback";
            var JSONP=document.createElement("script");
            JSONP.type="text/javascript";
            JSONP.src= url;
            document.getElementsByTagName("head")[0].appendChild(JSONP);
        } else {
            alert("您输入的手机号有误")
        }
    };
</script>
</html>
```

上述代码的全部js部分可以用jQuery实现，如下：
```
function jsonpCallback(data) {
    $('#output').text(data.province + " " + data.catName);
}
$('#search').click(function(){
    var num = $('#tel').val();
    if(/^1[34578]\d{9}$/.test(num)){
        var url = "http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=" + num" + "t=" + Math.random();
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'JSONP',  // 处理Ajax跨域问题(本质已不是Ajax)
            success: function(data){
                $('#output').text(data.province + " " + data.catName);
            }
        });
    } else {
        alert("您输入的手机号有误")
    }
});
```


## 其他 Ajax 参数及方法

- javascript
```
//属性
xhr.responseText;   //从服务器返回的字符串数据
xhr.responseXML;   //从服务器返回的 XML 数据
xhr.status;    //服务器相应状态
xhr.readyState;    //0: 请求未初始化; 1: 已建立连接; 2: 请求已接收; 3: 请求处理中; 4: 响应已就绪
xhr.timeout;    //指定多少毫秒后超时，长整型
xhr.upload;    //获取上传进度
xhr.withCredentials;    //是否可以跨源，boolean 型，默认 false
//方法
xhr.getResponseHeader('connection');   //获取指定头信息
xhr.getAllResponseHeaders();   //获全部定头信息
xhr.open("METHOD", url, isAsyn);   //open方法有3个参数，最后一个参数是 Boolean 型，表示是否异步，默认为 true
xhr.abort();   //终止请求，置xhr.readyState为0，但不触发onreadystatechange
xhr.overrideMimeType()   //强制重写 http 头的 MIME 类型
//事件
XMLHttpRequestEventTarget.onreadystatechange   //在xhr.readyState属性改变时触发
XMLHttpRequestEventTarget.ontimeout   //在响应超时时触发
XMLHttpRequestEventTarget.onabort   //当请求失败时调用该方法
XMLHttpRequestEventTarget.onerror   //当请求发生错误时调用该方法
XMLHttpRequestEventTarget.onload   //当一个HTTP请求正确加载出内容后返回时调用。
XMLHttpRequestEventTarget.onloadstart   //当一个HTTP请求开始加载数据时调用。
XMLHttpRequestEventTarget.onloadend   //当内容加载完成，不管失败与否，都会调用该方法
XMLHttpRequestEventTarget.onprogress   //间歇调用该方法用来获取请求过程中的信息。
```
注：关于 xhr.status 可能的返回值，详见 [http状态码](http://blog.csdn.net/faremax/article/details/53703808)

## jQuery 中的 Ajax 方法

### ajax 静态方法
```
$.ajax({options})    //发起一个 ajax 请求
options 常用以下属性设置：url, method("GET"/"POST"), crossDomain, accepts(可接受的类型), dataType, cache, contentType(编码格式), success, error等
$.ajaxSetup({options});    //options同上，设置 ajax 默认参数，不建议使用
$.post(url, data, success, datatype);    //发起一个 POST 请求 data为传递参数(可选), success(reponseText, statusText, xhr)  为成功时的回调函数(可选), datatype(xml/html/script/json/jsonp/text,可选)
$.get(url, data, success, datatype);    //发起一个 GET 请求, 参数同上
$.getScript(url, data, success)    //以 GET 请求获取一个 JS 文件并执行，参数含义同上
$.getJSON(url, data, success)    //以 GET 请求获取一个 JSON 字符串，参数含义同上
```

### ajax 动态方法
```
$().ajaxComplete(function(){});    //注册Ajax请求完成时要调用的处理程序
$().ajaxError(function(){});    //注册要在Ajax请求完成时遇到错误而调用的处理程序
$().ajaxSend(function(){});    //附加要在发送Ajax请求之前执行的函数
$().ajaxStart(function(){});    //注册在第一个Ajax请求开始时要调用的处理程序
$().ajaxStop(function(){});    //注册要在所有Ajax请求完成后调用的处理程序
$().ajaxSuccess(function(){});    //附加要在Ajax请求成功完成时执行的函数
$().load(url, data, callback);    //返回某 url 的数据，data为传递参数(可选), callback(reponseText, statusText, xhr) 回调函数(可选)
```

### 其他相关方法
```
$.param(obj);    //将对象转化为一个 url 参数列表
$(form).serialize();    //表单数据序列化为 url 参数列表
$(form).serializeArray();    //同上，但返回 JSON 串
```

## 简单封装 Ajax 相关方法

简单模仿 jQuery 中 `$.ajax()` 方法
```
(function(){
  // Ajax 选项
  var options = {
    type: "GET",   //提交方式
    url: "",    //路径
    params: {},   //请求参数
    dataType: "text",   //内容类型
    success: function(){},   //回调函数
    error: function(){}
  };

  //获取 XMLHTTPRequest 对象
  var createRequest = function(){
    var xmlhttp;
    if(xmlhttp.XMLHttpRequest){
      xmlhttp = new XMLHttpRequest();
    }
    else{
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if(xmlhttp.overrideMimeType){
      xmlhttp.overrideMimeType('text/xml');  //修改 MIME 类型
    }
    return xmlhttp;
  },

  // 设定 Ajax 选项
  var setOptions = function(newOptions){
    for(var prop in newOptions){
      if(newOptions.hasOwnProperty(prop)){
        this.option[prop] = newOptions[prop];
      }
    }
  },

  //格式化参数列表
  var formatParameters = function(){
    var paramsArr = [];
    var params = this.options.params;
    for(var prop in params){
      if(params.hasOwnProperty(prop)){
        paramsArr.push(prop + "=" + encodeURIComponent(params[prop]));
      }
    }
    return paramsArr.join('&');
  },

  //预处理并调用相应函数
  var readystatechange = function(xmlhttp){
    var returnValue;
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
      switch(this.options.dataType){
        case 'xml':
          returnValue = xmlhttp.responseXML;
          break;
        case 'json':
          returnVaue = xmlhttp.responseText;
          if(returnValue){
            returnValue = eval("(" + returnValue + ")");
          }
          break;
        default:
          returnVaue = xmlhttp.responseText;
          break;
      }
      if(returnValue){
        this.options.success(returnValue);
      }
      else{
        this.options.success();
      }
    } else{
      this.options.error();
    }
  },

  //发送请求，也就是$.ajax()函数
  var request = function(options){
    // var ajaxObj = this;

    var xmlhttp = this.createRequest();
    this.setOptions(options);
    xmlhttp.onreadystatechange = this.readystatechange.bind(null, xmlhttp);

    var formatParams = this.formatParameters();
    var type = this.options.type;
    var url = this.options.url;

    if("GET" === type.toUpperCase()){
      url += "?" + formatParameters;
    }
      xmlhttp.open(type, url, true);

    if("GET" === type.toUpperCase()){
      xmlhttp.send();
    } else if("POST" === type.toUpperCase()){
      xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xmlhttp.send(formatParameters);
    }
  }

  window.$.ajax = request;  //暴露方法到闭包外面去
})();
```
