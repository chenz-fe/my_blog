我们平时使用jQuery大概是这样：

```js
let $p = $('p');
$p.css('fontSize', '40px');
```

我们生成jQuery实例对象后，就可以使用原型上的css(), html()等方法，这就体现了原型继承：由构造函数生成的实例对象，可以继承构造函数的原型对象上的属性和方法。

我们可以试着手写一个迷你的jQuery，思路大概是这样：

1-通过匿名自执行函数来存放我们的代码，将window对象作为参数传入，防止全局作用域的污染。

2-利用工厂函数，在调用jQuery或者$的时候，返回构造函数的实例对象

3-构造函数定义为jQuery.fn.init，初始化时处理dom元素，将dom元素绑定在实例对象上

4-将构造函数的prototype属性指向jQuery.fn，此时构造函数的实例便可以继承jQuery.fn里的属性和方法

5-jQuery.fn是一个对象，里面存放了所有的jQuery方法，让外部来调用

代码实现：

```js
// my-jquery.js

(function(window) {
  var jQuery = function (selector) {
    // 通过new关键字，找到构造函数
    return new jQuery.fn.init(selector);
  };

  // 初始化 jQuery.fn
  jQuery.fn = jQuery.prototype =  {
    constructor: jQuery,
    css: function(key, value) {
      let that = this;
      for (var i = 0; i < that.length; i++) {
        that[i].style[key] = value;
      }
    },
    html: function (value) {
      return this[0].innerHTML;
    },
  };

  // 定义构造函数
  var init = jQuery.fn.init = function(selector) {
    var slice = Array.prototype.slice;
    var dom = slice.call(document.querySelectorAll(selector));
    var i,
      len = dom ? dom.length : 0;
    for (i = 0; i < len; i++) {
      this[i] = dom[i];
    }
    this.length = len;
    this.selector = selector || '';
  };

  // 定义原型
  init.prototype = jQuery.fn;

  window.$ = jQuery;
})(window);
```

这里有个问题：这里为什么不直接把init.prototype赋值为一个对象，而是要通过jQuery.fn做中转呢？

```js
jQuery.fn = {...};

init.prototype = jQuery.fn;
```

这就体现了原型的扩展性，`jQuery.fn` | `$.fn` 是用来扩展插件用的，将插件扩展统一到`$.fn.xxx` 这一个接口，也是符合对修改封闭，对扩展开放的原则。

下面我们来写一个简单的jQuery插件。

```js
$.fn.getNodeName = function () {
    return this[0].nodeName;
}

// 测试
alert($box.getNodeName()); // DIV
```


小结：本篇文章总结了以下几个问题

- jQuery是如何使用原型的
- 如何实现一个小型的jQuery
- jQuery的插件扩展机制