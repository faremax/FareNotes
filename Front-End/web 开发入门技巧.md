<!-- MarkdownTOC -->

- [css部分](#css%E9%83%A8%E5%88%86)
  - [为不同链接添加不同样式](#%E4%B8%BA%E4%B8%8D%E5%90%8C%E9%93%BE%E6%8E%A5%E6%B7%BB%E5%8A%A0%E4%B8%8D%E5%90%8C%E6%A0%B7%E5%BC%8F)
  - [跨浏览器灰度图](#%E8%B7%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E7%81%B0%E5%BA%A6%E5%9B%BE)
  - [动画背景](#%E5%8A%A8%E7%94%BB%E8%83%8C%E6%99%AF)
  - [清除浮动](#%E6%B8%85%E9%99%A4%E6%B5%AE%E5%8A%A8)
  - [表格宽度自适应](#%E8%A1%A8%E6%A0%BC%E5%AE%BD%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94)
  - [任意阴影](#%E4%BB%BB%E6%84%8F%E9%98%B4%E5%BD%B1)
  - [文本宽度自适应](#%E6%96%87%E6%9C%AC%E5%AE%BD%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94)
  - [模糊文本](#%E6%A8%A1%E7%B3%8A%E6%96%87%E6%9C%AC)
  - [网页加载动画](#%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E5%8A%A8%E7%94%BB)
  - [窗口漂浮物](#%E7%AA%97%E5%8F%A3%E6%BC%82%E6%B5%AE%E7%89%A9)
  - [解决 input:text 自动填充变黄的问题](#%E8%A7%A3%E5%86%B3-inputtext-%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%8F%98%E9%BB%84%E7%9A%84%E9%97%AE%E9%A2%98)
- [jQuery部分](#jquery%E9%83%A8%E5%88%86)
  - [返回头部](#%E8%BF%94%E5%9B%9E%E5%A4%B4%E9%83%A8)
  - [预加载图片](#%E9%A2%84%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87)
  - [自动替换加载失败的图片](#%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%E5%8A%A0%E8%BD%BD%E5%A4%B1%E8%B4%A5%E7%9A%84%E5%9B%BE%E7%89%87)
  - [切换元素的各种样式](#%E5%88%87%E6%8D%A2%E5%85%83%E7%B4%A0%E7%9A%84%E5%90%84%E7%A7%8D%E6%A0%B7%E5%BC%8F)
  - [禁用/启用提交按钮](#%E7%A6%81%E7%94%A8%E5%90%AF%E7%94%A8%E6%8F%90%E4%BA%A4%E6%8C%89%E9%92%AE)
  - [组织默认事件](#%E7%BB%84%E7%BB%87%E9%BB%98%E8%AE%A4%E4%BA%8B%E4%BB%B6)
  - [切换动画](#%E5%88%87%E6%8D%A2%E5%8A%A8%E7%94%BB)
  - [简单的手风琴样式](#%E7%AE%80%E5%8D%95%E7%9A%84%E6%89%8B%E9%A3%8E%E7%90%B4%E6%A0%B7%E5%BC%8F)
  - [调整多个 div 一样高](#%E8%B0%83%E6%95%B4%E5%A4%9A%E4%B8%AA-div-%E4%B8%80%E6%A0%B7%E9%AB%98)
  - [同链接不同样式](#%E5%90%8C%E9%93%BE%E6%8E%A5%E4%B8%8D%E5%90%8C%E6%A0%B7%E5%BC%8F)
  - [通过内容查找元素](#%E9%80%9A%E8%BF%87%E5%86%85%E5%AE%B9%E6%9F%A5%E6%89%BE%E5%85%83%E7%B4%A0)
  - [当其他元素获得焦点时触发](#%E5%BD%93%E5%85%B6%E4%BB%96%E5%85%83%E7%B4%A0%E8%8E%B7%E5%BE%97%E7%84%A6%E7%82%B9%E6%97%B6%E8%A7%A6%E5%8F%91)
  - [显示 Ajax 错误信息](#%E6%98%BE%E7%A4%BA-ajax-%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF)
  - [禁用右键菜单](#%E7%A6%81%E7%94%A8%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95)
  - [模拟 placeholder 属性](#%E6%A8%A1%E6%8B%9F-placeholder-%E5%B1%9E%E6%80%A7)
  - [判断元素是否存在](#%E5%88%A4%E6%96%AD%E5%85%83%E7%B4%A0%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8)
  - [放大  标签面积](#%E6%94%BE%E5%A4%A7--%E6%A0%87%E7%AD%BE%E9%9D%A2%E7%A7%AF)
  - [根据浏览器大小选择不同的类](#%E6%A0%B9%E6%8D%AE%E6%B5%8F%E8%A7%88%E5%99%A8%E5%A4%A7%E5%B0%8F%E9%80%89%E6%8B%A9%E4%B8%8D%E5%90%8C%E7%9A%84%E7%B1%BB)
  - [自定义伪类选择器](#%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BC%AA%E7%B1%BB%E9%80%89%E6%8B%A9%E5%99%A8)
  - [禁用 jQuery 所以动画](#%E7%A6%81%E7%94%A8-jquery-%E6%89%80%E4%BB%A5%E5%8A%A8%E7%94%BB)
  - [判断鼠标左右键](#%E5%88%A4%E6%96%AD%E9%BC%A0%E6%A0%87%E5%B7%A6%E5%8F%B3%E9%94%AE)
  - [回车提交表单](#%E5%9B%9E%E8%BD%A6%E6%8F%90%E4%BA%A4%E8%A1%A8%E5%8D%95)
  - [配置 Ajax 的全局参数](#%E9%85%8D%E7%BD%AE-ajax-%E7%9A%84%E5%85%A8%E5%B1%80%E5%8F%82%E6%95%B0)
  - [用 siblings\(\) 选择兄弟元素](#%E7%94%A8-siblings-%E9%80%89%E6%8B%A9%E5%85%84%E5%BC%9F%E5%85%83%E7%B4%A0)
  - [用 Firebug 输出日志](#%E7%94%A8-firebug-%E8%BE%93%E5%87%BA%E6%97%A5%E5%BF%97)
  - [CSS 钩子](#css-%E9%92%A9%E5%AD%90)
  - [限制 textarea 的文字数量](#%E9%99%90%E5%88%B6-textarea-%E7%9A%84%E6%96%87%E5%AD%97%E6%95%B0%E9%87%8F)
  - [删除字符串中的 HTML 标签](#%E5%88%A0%E9%99%A4%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%AD%E7%9A%84-html-%E6%A0%87%E7%AD%BE)
  - [使用 proxy\(\) 函数代理](#%E4%BD%BF%E7%94%A8-proxy-%E5%87%BD%E6%95%B0%E4%BB%A3%E7%90%86)
  - [禁用前进后退按钮](#%E7%A6%81%E7%94%A8%E5%89%8D%E8%BF%9B%E5%90%8E%E9%80%80%E6%8C%89%E9%92%AE)
- [javascript 部分](#javascript-%E9%83%A8%E5%88%86)
  - [类数组对象转化为数组](#%E7%B1%BB%E6%95%B0%E7%BB%84%E5%AF%B9%E8%B1%A1%E8%BD%AC%E5%8C%96%E4%B8%BA%E6%95%B0%E7%BB%84)
  - [判断 浏览器 js 版本\(鸭式辩型\)](#%E5%88%A4%E6%96%AD-%E6%B5%8F%E8%A7%88%E5%99%A8-js-%E7%89%88%E6%9C%AC%E9%B8%AD%E5%BC%8F%E8%BE%A9%E5%9E%8B)
  - [获取 url 中参数](#%E8%8E%B7%E5%8F%96-url-%E4%B8%AD%E5%8F%82%E6%95%B0)
  - [利用 documentFragment 避免多次刷新 DOM](#%E5%88%A9%E7%94%A8-documentfragment-%E9%81%BF%E5%85%8D%E5%A4%9A%E6%AC%A1%E5%88%B7%E6%96%B0-dom)

<!-- /MarkdownTOC -->

# css部分
### 为不同链接添加不同样式
```
a[href^="http"]{
padding-right: 20px;
background: url(external.gif) no-repeat center right;
}
/* email */
a[href^="mailto:"]{
padding-right: 20px;
background: url(email.png) no-repeat center right;
}
/* pdf */
a[href$=".pdf"]{
padding-right: 20px;
background: url(pdf.png) no-repeat center right;
}
```

### 跨浏览器灰度图
```
<svg xmlns="http://www.w3.org/2000/svg">
<filter id="grayscale">
  <feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"></feColorMatrix>
</filter>
</svg>
<style>
img{
  filter: url(filters.svg#grayscale); /* Firefox 3.5+ */
  filter: gray; /* IE6-9 */
  -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
}
</style>
```

### 动画背景
```
button{
background-image: linear-gradient(#5187c4, #1c2f45);
background-size: auto 200%;
background-position: 0 100%;
transition: background-position 0.5s;
}
button:hover {
background-position: 0 0;
}
```
###清除浮动
```css
/*方法1*/
.clear-fix{
  clear: both;
  display: block;
  height: 0;
  overflow: hidden;
}
/*IE*/
.clear{
  overflow: auto; zoom: 1; (IE6)
}
/*方法2*/
&:after{
  content: "";
  display: block;
  height: 0;
  overflow: hidden;
  clear: both;
}
/*方法3*/
/*将浮动元素用一个不浮动的 div 包裹起来*/
```

### 表格宽度自适应
```
td {
white-space: nowrap;
}
```

### 任意阴影
```
.box-shadow {
background-color: #FF8020;
width: 160px;
height: 90px;
margin-top: -45px;
margin-left: -80px;
position: absolute;
top: 50%;
left: 50%;
}
.box-shadow:after {
content: "";
width: 150px;
height: 1px;
margin-top: 88px;
margin-left: -75px;
display: block;
position: absolute;
left: 50%;
z-index: -1;
-webkit-box-shadow: 0px 0px 8px 2px #000000;
-moz-box-shadow: 0px 0px 8px 2px #000000;
box-shadow: 0px 0px 8px 2px #000000;
}
```

### 文本宽度自适应
```
pre {
white-space: pre-line;
word-wrap: break-word;
}
```

### 模糊文本
```
.blurry-text {
color: transparent;
text-shadow: 0 0 5px rgba(0,0,0,0.5);
}
```


### 网页加载动画
```
loading:after {
overflow: hidden;
display: inline-block;
vertical-align: bottom;
animation: ellipsis 2s infinite;
content: "\2026";
}
@keyframes ellipsis {
from {
  width: 2px;
}
to {
  width: 15px;
}
}
```

### 窗口漂浮物

```
<marquee direction="down" width="250" height="200" behavior="alternate" style="border:solid">
<marquee behavior="alternate">
  This text will fly
</marquee>
</marquee>
```

### 解决 input:text 自动填充变黄的问题
```
input:-webkit-autofill{
-webkit-box-shadow: 0 0 0px 10000px white inset !important;
box-shadow: 0 0 0px 10000px white inset !important;
}
```


# jQuery部分

### 返回头部
```
$('a.top').click(function (e) {
  e.preventDefault();
  $(body).animate({scrollTop: 0}, 800);
});
```

### 预加载图片
```
$.preloadImages = function () {
  for (var i = 0; i < arguments.length; i++) {
    $('<img>').attr('src', arguments[i]);
  }
};
$.preloadImages('img/hover-on.png', 'img/hover-off.png');
```

### 自动替换加载失败的图片
```
$('img').on('error', function () {
  $(this).prop('src', 'img/broken.png');
});
```

### 切换元素的各种样式
```
$('.btn').hover(function () {
  $(this).addClass('hover');
}, function () {
  $(this).removeClass('hover');
});
```
### 禁用/启用提交按钮
```
$('input[type="submit"]').prop('disabled', true);
$('input[type="submit"]').prop('disabled', false);
```

### 组织默认事件
```
$('a.no-link').click(function (e) {
e.preventDefault();
});
```

### 切换动画
```
//淡入淡出
$('.btn').click(function () {
  $('.element').fadeToggle('slow');
});
//滑入滑出
$('.btn').click(function () {
$('.element').slideToggle('slow');
});
```

###简单的手风琴样式
```
$('#accordion').find('.content').hide();  //关闭全部标签
$('#accordion').find('.accordion-header').click(function () {
  var next = $(this).next();
  next.slideToggle('fast');
  $('.content').not(next).slideUp('fast');
  return false;
});
```

### 调整多个 div 一样高
```
var $columns = $('.column');
var height = 0;
$columns.each(function () {
  if ($(this).height() > height) {
    height = $(this).height();
  }
});
$columns.height(height);
```

### 同链接不同样式
```
$('a[href^="http"]').attr('target', '_blank');
$('a[href^="//"]').attr('target', '_blank');
$('a[href^="' + window.location.origin + '"]').attr('target', '_self');  //cannot work in IE10
$("a[href$=pdf]").addClass('pdf');
$("a[href$=doc]").addClass('doc');
$("a[href$=xls]").addClass('xls');
```

### 通过内容查找元素
```
var search = $('#search').val();
$('div:not(:contains("' + search + '"))').hide();
```

### 当其他元素获得焦点时触发
```
$(document).on('visibilitychange', function (e) {
  if (e.target.visibilityState === "visible") {
    console.log('Tab is now in view!');
  } else if (e.target.visibilityState === "hidden") {
    console.log('Tab is now hidden!');
  }
});
```

### 显示 Ajax 错误信息
```
$(document).ajaxError(function (e, xhr, settings, error) {
  console.log(error);
});
```

### 禁用右键菜单
```
$(document).ready(function(){
  $(document).bind("contextmenu", function(e){
     e.preventDefault();
  })
})
```

### 模拟 placeholder 属性
```
$(document).ready(function(){
  var $input_text = $("input[type=text]");
  $input_text.val("Enter your words here...");

  var originalValue = input.val();
  input.focus(function(){
    if($.trim(input.val()) == originalValue){
      input.val("");
    }
  }).blur(funtion(){
    if($.trim(input.val()) == ""){
      input.val(originalValue);
    }
  });
});
```

### 判断元素是否存在
```
$(document).ready(function(){
  if($('#id').length){
    //do sth.
  }
});
```

### 放大 <a> 标签面积
```
$("div").click(function(){
  window.loaction = $(this).find("a").attr("href");
  return false;
});
```

### 根据浏览器大小选择不同的类
```
$(document).ready(function(){
  $(window).resize(function(){
    if($(window).width() > 1200){
      $('body').addClass('large');
    } else {
      $('body').removeClass('large')
    }
  });
});
```

### 自定义伪类选择器
```
$.extend($.expr[':'], {
  moreThan500px:function(a){
    return $(a).width > 500;
  }
}); //create a pseudo selector ':moreThan500px'
```

### 禁用 jQuery 所以动画
```
$.fx.off = true;
```

### 判断鼠标左右键
```
$("#id").mousedown(function(e){
  switch(e.witch){
    case 1: //left click
      break;
    case 2: //middle click
      break;
    case 3: //right click
      break;
    default: break;
  }
});
```

### 回车提交表单
```
$("input").keyup(function(e){
  if(e.witch == 13 || e.keyCode == 13){
    $("#submit").trigger('click');
  }
});
```

### 配置 Ajax 的全局参数
```
$("#load").ajaxStart(function(){
  showLoading();
  disableButton();
}).ajaxComplete(function() {
  hideLoading();
  enableButton();
});
```

### 用 siblings() 选择兄弟元素
```
$("#nav li").click(function(){
  $(this).addClass("active").sibling().removeClass('active');
});
```

### 用 Firebug 输出日志
```
jQuery.log = jQuery.fn.log = function(msg){
  if(console){
    console.log("%s, %o", msg, this);
  }
  return $(this);  //链式调用
}
```

### CSS 钩子
```
$.cssHooks['borderRadius'] = {
  get: function(ele, computed, extra){
    //Read the value of -moz-border-radius, -webkit-border-radius, -o-border-radius, -ms-border-radius or border-radius depanding on browser.
  }
  set: function(ele, value){
    //Set all the property above.
  }
};
```

### 限制 textarea 的文字数量
```
jQuery.fn.maxLength = function(max){
  this.each(function(){
    var type = this.tagName.toLowerCase();
    var inputType = this.type ? this.type.toLowerCase() : null;
    if(type == "input" && inputType == "text" || inputType == "password"){
      this.maxLength = max;  //use normal length
    } else if(type == "textarea"){
      this.onkeypress = function(e){
        var ob = e || window.event;
        var keyCode = ob.keyCode;
        var hasSelection - document.selection ? document.selection.createRange().text.length > 0 : this.selectionStart != this.selectionEnd;
        return !(this.value.length >= max && (keyCode > 50 || keyCode == 32 || keyCode == 0 || keyCode == 13) && !ob.ctrlKey && !ob.altKey && !ob.shiftKey && !hasSelection);
      };
      this.onkeyup = function(){
        if(this.value.length > max){
          this.value = this.value.substring(0, max);
        }
      };
    }
  });
};
```

### 删除字符串中的 HTML 标签
```
$.fn.stripHTML = function(){
  var regexp = /<("[^"]*"|'[^']'|[^'">])*/gi;
  this.each(function(){
    $(this).html($(this).html().replace(regexp, ""));
  });
  return $(this);
}
```

### 使用 proxy() 函数代理
```
$("panel").fadeIn(function(){
  $("panel button").click(function(){
    $(this).fadeOut(); //'this' is button, not panel
  });
  $("panel button").click($.proxy(function(){
    $(this).fadeOut(); //'this' is panel, not button
  }, this));
});
```
### 禁用前进后退按钮
```
$(document).ready(function(){
  window.history.forward(1);
  window.history.forward(-1);
})
```
# javascript 部分

### 类数组对象转化为数组
```
function trans(obj){
  return [].slice.call(obj);
}

//以下是 ES6 方法
function trans(obj){
  return Array.from(obj);
}
```
### 判断 浏览器 js 版本(鸭式辩型)

```
//js版本检测
  var JS_ver = [];
(Number.prototype.toFixed)?JS_ver.push("1.5"):false;
([].indexOf && [].forEach)?JS_ver.push("1.6"):false;
((function(){try {[a,b] = [0,1];return true;}catch(ex) {return false;}})())?JS_ver.push("1.7"):false;
([].reduce && [].reduceRight && JSON)?JS_ver.push("1.8"):false;
("".trimLeft)?JS_ver.push("1.8.1"):false;
JS_ver.supports = function()
{
　　if (arguments[0])
　　　　return (!!~this.join().indexOf(arguments[0] +",") +",");
　　else
　　　　return (this[this.length-1]);
}
console.log("Javascript version supported in this browser: "+ JS_ver.supports());
```

### 获取 url 中参数
```
function getURIData(url){
  var para = url.slice(url.indexOf('?') + 1);
  var reg = /&?(\w*)=([%\w]*)/g;
  var temp, data = {};
  while(temp = reg.exec(para)){
    data[temp[1]] = window.decodeURIComponent(temp[2]);
  }
  return data;
}
```

### 利用 documentFragment 避免多次刷新 DOM
```
(function createList() {
　　var lis = ["first item", "second item", "third item",
　　"fourth item", "fith item"];
　　var Frag = document.createDocumentFragment();
　　while (lis.length) {
　　　　var li = document.createElement("li");
　　　  li.appendChild(document.createTextNode(lis.shift()));
　　　　Frag.appendChild(li);
　　}
　　document.getElementById('myUL').appendChild(Frag);
})();
```
