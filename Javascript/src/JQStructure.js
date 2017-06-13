(function(window){
  "use strict";
	//保存原有全局变量
  var _$ = window.$;
  var _jQuery = window.jQuery;

  //定义全局接口
  var jQuery = window.jQuery = window.$ = function(selector){
    return new jQuery.fn.init(selector);    //返回实例化对象
  };

  var HTMLRegex = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;  //用于匹配html标签

  var rootjQuery;   //默认根节点的jQuery对象

  //原型
  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    init: function(selector){
      if(!selector){
        return this;
      }
			//简单查询，这里不实现所有选择器功能
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
      num < 0 ? this[ num + this.length ] : this[ num ];   //索引小于零表示倒数
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

















