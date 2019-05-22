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
