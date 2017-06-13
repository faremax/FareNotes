<!-- MarkdownTOC -->

<!-- /MarkdownTOC -->

本文简单实现jQuery框架，深入理解javascript对象。
本文的对照版本是jQuery-1.2.6.js

本文注重jquery结构设计思路，并不侧重具体功能的实现以及兼容性和安全性的部分。

首先建立基本框架如下：
```
(function(window){
  "use strict";
  var jQuery = window.jQuery = window.$ = function(selector){
    //定义$函数，并把$和jQuery暴露到外面
  };

  jQuery.fn = jQuery.prototype = {
    //jQuery原型
  };

  jQuery.extend = jQuery.fn.extend = function(){
    //添加扩展方法，jQuery.extend添加静态方法，也可以实现继承，jQuery.fn.extend添加动态方法
  }
})(window);
```

进一步，实现jQuery的初始化
```
//上述框架中的部分代码
//由于$('#selector')得到的是一个jQuery对象，尝试直接返回jQuery对象
var jQuery = window.jQuery = window.$ = function(selector){
  return new jQuery();   //这里会导致一个死循环，所以不能这样直接构建jQuery对象
};
```

修正上述代码中的死循环，我们可以试图返回this，但是this明显是window，不是我们需要的jQuery，利用原型中的this返回构造函数实例化对象的特点(不理解的可以参看[javascript中this详解](http://blog.csdn.net/faremax/article/details/53235837))，我们作以下修改:
```
//上述框架中的部分代码
//由于$('#selector')得到的是一个jQuery对象，尝试直接返回jQuery对象
var jQuery = window.jQuery = window.$ = function(){
    return jQuery.fn.init();   //执行初始化
};
jQuery.fn = jQuery.prototype = {
  init: function(){
    return this;
  },
  jQuery: "1.0.0",   //jQuery版本信息
  length: 0,    //模拟数组，即这里构成一个类数组对象
  size: function(){
    return this.length;
  }
}
```

到此$()可以返回一个jQuery对象了。但是在旧浏览器中有一个bug。如果用户如下这样使用代码，那么什么都得不到：
```
var ele = $.fn.init();
```
这里直接调用了`init()`, 这样会得到init创造的对象，由于`$`是个函数，`$.fn`是函数的原型，函数原型是个空函数，所以这里得到了一个以空函数为构造函数创造的对象。为了解决这问题，采用new的方式:
```
//上述框架中的部分代码
var jQuery = window.jQuery = window.$ = function(selector){
    return new jQuery.fn.init(selector);   //执行初始化
};
jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  init: function(selector){
    var elements = document.querySelectorAll(selector);   //顺便简单的实现了选择器
    //注意querySelectorAll在老的浏览器中是不支持的，这里专注在jQuery的结构上。
    Array.prototype.push.apply(this, elements);   //构成类数组对象，引入length，并使其自增
    return this;
  },
  jQuery: "1.0.0",   //jQuery版本信息
  length: 0,    //模拟数组，即这里构成一个类数组对象
  size: function(){
    return this.length;
  }
}
jQuery.fn.init.prototype = jQuery.fn;
```
由于这里把jQuery.fn.init()作为构造函数调用，得到一个jQuery对象，所以我们把jQuery.fn作为jQuery.fn.init()的原型。

下一步实现extend方法
```
//上述框架中的部分代码
jQuery.extend = jQuery.fn.extend = function(obj, srcObj){
    var target, len = arguments.length;
    if(len === 1){   //传入一个参数时实现继承
      deep(obj, this);
      return this;
    } else {
      for(var i = 1; i < len; i++){
        target = arguments[i];
        deep(target, obj);
      }
      return obj;
    }

    function deep(oldOne, newOne){   //实现深拷贝
      for(var prop in oldOne){
        if(typeof oldOne[prop] === "object" && oldOne[prop] !== null){
            newOne[prop] = oldOne[prop].constructor === Array ? [] : {};
            deep(oldOne[prop], newOne[prop]);
        }
        else{
            newOne[prop] = oldOne[prop];
        }
      }
    }
  };
```

写了extend，我们定义几个简单的方法（2静态方法，3个动态方法）可以用来测试。
```
//添加静态方法
jQuery.extend({
  trim: function(text){
    return (text || "").replace(/^\s+|\s+$/g, "");
  },
  makeArray: function(obj){
    return Array.prototype.slice.call(obj);
  }
});

//添加动态方法
jQuery.fn.extend({
  //get方法
  get: function(num){
    return num == null ?
    jQuery.makeArray(this):
    num < 0 ? this[ num + this.length ] : this[ num ];   //索引小于零表示倒数
  },

  //each 遍历执行函数
  each: function(fun){
    for(var i = 0, len = this.length; i < len; ++i){
      if(fun(i, this[i]) === false)
        break;
    }
    return this;  //用于链式调用
  },

  //修改css属性
  css: function(key, value){
    var len = arguments.length;
    if(len === 1){     //传入1个参数返回对应值
      return this[0].style[key];
    } else if(len === 2){    //传入2个参数设置对应值
      this.each(function(index, ele){
        ele.style[key] = value;
      });
    }
    return this;  //用于链式调用
  }
});
```

到这里，jQuery的基本结构就形成了，还有一个问题需要解决，就是处理变量冲突。
当环境中以及有`jQuery`和`$`时可以选择释放`$`或时释放`jQuery`和`$`
```
(function(window){
  "use strict";
  //在框架一开始先保留外部可能存在的$或jQuery变量，以便在后来恢复
  var _$ = window.$;
  var _jQuery = window.jQuery;

  var jQuery = window.jQuery = window.$ = function(selector){};
  jQuery.fn = jQuery.prototype = {};
  jQuery.extend = jQuery.fn.extend = function(){};
})(window);
```

然后写noConflict函数
```
jQuery.extend({
  noConflict: function(deep){  //传入true时同时释放$和jQuery，否则只是释放$
    window.$ = _$;
    if(deep) window.jQuery = _jQuery;
    return jQuery;
  }
});
```

到此为止，jQuery的框架已经形成。下面是完整代码部分:

```
(function(window){
  "use strict";
  var _$ = window.$;
  var _jQuery = window.jQuery;

  //定义全局接口
  var jQuery = window.jQuery = window.$ = function(selector){
    return new jQuery.fn.init(selector);
  };

  var HTMLRegex = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;  //用于匹配html标签

  var rootjQuery;   //默认根节点的jQuery对象

  //原型
  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    // init: function(selector){
    //   var elements = document.getElementsByTagName(selector);
    //   Array.prototype.push.apply(this, elements);
    //   return this;
    // },
    init: function(selector){
      if(!selector){
        return this;
      }
      var elements = document.getElementsByTagName(selector);
      Array.prototype.push.apply(this, elements);
      return this;
    },
    jQuery: "1.0.0",
    length: 0,
    size: function(){
      return this.length;
    }
  };
  jQuery.fn.init.prototype = jQuery.fn;

  //继承
  jQuery.extend = jQuery.fn.extend = function(obj){
    var target, len = arguments.length;
    if(len === 1){   //传入一个参数时实现继承
      deep(obj, this);
      return this;
    } else {
      for(var i = 1; i < len; i++){
        target = arguments[i];
        deep(target, obj);
      }
      return obj;
    }

    function deep(oldOne, newOne){
      for(var prop in oldOne){
        if(typeof oldOne[prop] === "object" && oldOne[prop] !== null){
            newOne[prop] = oldOne[prop].constructor === Array ? [] : {};
            deep(oldOne[prop], newOne[prop]);
        }
        else{
            newOne[prop] = oldOne[prop];
        }
      }
    }
  };

  //静态函数
  jQuery.extend({
    trim: function(text){
      return (text || "").replace(/^\s+|\s+$/g, "");
    },
    noConflict: function(deep){
      window.$ = _$;
      if(deep) window.jQuery = _jQuery;
      return jQuery;
    },
    makeArray: function(obj){
      return Array.prototype.slice.call(obj);
    }
  });

  //对象方法
  jQuery.fn.extend({
    get: function(num){
      return num == null ?
      jQuery.makeArray(this):
      num < 0 ? this[ num + this.length ] : this[ num ];   //索引小于零表示倒数第n个
    },
    each: function(fun){
      for(var i = 0, len = this.length; i < len; ++i){
        if(fun(i, this[i]) === false)
          break;
      }
      return this;  //用于链式调用
    },
    css: function(key, value){
      var len = arguments.length;
      if(len === 1){
        return this[0].style[key];
      } else if(len === 2){
        this.each(function(index, ele){
          ele.style[key] = value;
        });
      }
      return this;  //用于链式调用
    }
  });
}(window));
```

上述代码源码：[github]()
