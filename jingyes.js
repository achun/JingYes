! function(window, $) {
  "use strict";
  var jy = window.JY = window.JY || {};
  var delay = 5000;
  var win = $(window);
  var body = $(body);
  var onWinScroll = []; // {callback:function(...){},[self,skip]}
  win.on('scroll.jingyes', function() {
    for (var i = onWinScroll.length - 1; i >= 0; i--) {
      var that = onWinScroll[i];
      if (that && that.callback && !that.skip) {
        that.callback.apply(that, arguments);
      }
    };
  });

  $.support = $.support || {};
  if (!$.support.transition) {
    $.support.transition = (function() {
      var el = document.firstChild,
        transEndEventNames = {
          'WebkitTransition': 'webkitTransitionEnd',
          'MozTransition': 'transitionend',
          'OTransition': 'oTransitionEnd otransitionend',
          'transition': 'transitionend'
        };
      while (el && !el.style) el = el.nextSibling;
      if (el)
        for (name in transEndEventNames) {
          if (el.style[name] !== undefined) {
            return {
              end: transEndEventNames[name]
            };
          }
        }
      return {};
    })();
  }

  function log() {
    if (!window.console || !window.console.log) {} else {
      window.console.log.apply(window.console, arguments);
    }
  }

  function dj(jq, ns, defaultKey) {
    jq = $(jq);
    var dat = jq.data(ns || "jy") || $(jq).data("jy") || "";
    if (!dat) return;

    if (dat[0] == "{" || dat[0] == "[") {
      dat = Function("return " + dat);
      if (!$.isArray(dat)) {
        return dat[ns || ""] || dat;
      }
    }
    if (!defaultKey) return dat;

    var obj = {};
    obj[defaultKey] = dat;
    return obj;
  }

  function lastSplit(str, separator) {
    var idx = str.lastIndexOf(separator);
    if (idx == -1) return [];
    return [str.substr(0, idx), str.substr(idx + 1)];
  }
  jy.lastSplit = lastSplit;

  jy.convertImageToCanvas = function(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);

    return canvas;
  }

  jy.clearTextNode = function(node, option) {
    if (!document.body.classList) return false;
    if (!node) node = document;
    if (!node.firstChild) return false;

    option = option || false;
    var stop = false,
      S = /\S/,
      t = (new Date()).getTime()
      //option
      ,
      skipNodeNames = ['STYLE', 'SCRIPT', 'P', 'PRE', 'CODE'].concat(option.skipNodeNames) //遇到标签跳过
      ,
      skipClass = option.skipClass || 'ctnskip' //遇到class跳过
      ,
      stopClass = option.stopClass || 'ctntop'; //遇到class终止
    node.normalize();
    walk(node);
    node.normalize();
    return ((new Date()).getTime() - t) / 1000;

    function skip(node) {
      if (skipNodeNames.indexOf(node.nodeName) !== -1) return true;
      if (node.classList.contains(stopClass)) {
        return stop = true;
      }
      return node.classList.contains(skipClass);
    }

    function walk(node) {
      node = node.firstChild;
      while (!stop && node) {
        if (node.nodeType === 3 && node.nextSibling && node.previousSibling && !S.test(node.data)) {
          node.data = node.data.trim();
        }
        node.nodeType === 1 && !skip(node) && walk(node);
        node = node.nextSibling;
      }
    }
  }

  jy.accordion = function(nav_dl_dt) {
    $(nav_dl_dt).on('click.jingyes.collapse', function() {
      var dl = $(this.parentNode),
        dd = $(this).next('dd'),
        visible = dd.hasClass('open'),
        dds = dd.siblings('dt+dd'),
        fakeEnd = 'fake.transition.end',
        eventEnd = $.support.transition.end || fakeEnd;
      if (!dd.size() || !dl.hasClass('accordion') || dl.hasClass('keep') && visible) return;
      if (visible) {
        dd.removeClass('transition')
          .each(scrollHeight)
          .addClass('in transition')
          .one(eventEnd, complete)
          .height(0).trigger(fakeEnd)
      } else {
        dds.removeClass('transition')
        dd.removeClass('transition')

        dds.each(scrollHeight)
        dd.height(0)

        dds.one(eventEnd, complete)
        dd.one(eventEnd, complete)

        dds.addClass('in transition')
        dd.addClass('open in transition')

        dds.height(0).trigger(fakeEnd)
        dd.each(scrollHeight).trigger(fakeEnd)
      }

      function scrollHeight() {
        $(this).height(this.scrollHeight)[0].offsetWidth;
      }

      function complete() {
        var ths = $(this).removeClass('transition in');
        !ths.height() && ths.removeClass('open');
        ths.height('')[0].offsetWidth;
        ths.addClass('transition');
      }
    }).next('dd').addClass('transition');
  }
  jy.accordion('nav>dl>dt');


  //carousel
  jy.carousel = function(dlCarousel) {
    $(dlCarousel).each(function() {
      var dts = $(this).children('dt');
      if (dts.size() < 2) return;
      var fakeEnd = 'fake.transition.end',
        eventEnd = $.support.transition.end || fakeEnd;
      var active = dts.eq(0);
      var h = active.height(),
        w = active.width();
      var index = 0;
      var stop = 0;
      active.css({
        display: 'inline-block',
        width: w,
        height: h
      }).siblings().css({
        display: 'inline-block',
        width: 0,
        height: h
      })[0].offsetWidth;
      dts.addClass('transition');
      $(this).hover(
        function() {
          stop = 1;
        },
        function() {
          if (stop == 2) setTimeout(run, delay);
          stop = 0;
        }
      );

      function run() {
        if (stop) {
          stop = 2;
          return;
        }
        active.height(h).width(0)[0].offsetWidth;
        active = active.next();
        if (!active.size())
          active = dts.eq(0);
        active.one(eventEnd, complete).height(h).width(w)[0].offsetWidth;
      }

      function complete() {
        if (stop) stop = 2;
        setTimeout(run, delay);
      }
      setTimeout(run, Math.random() * 6777);
    });
  }
  jy.carousel('dl.carousel');

  //tabs
  jy.tabs = function(nav_header_span) {
    $(nav_header_span).click(function(e) {
      $(this).addClass("active").siblings(this.nodeName).removeClass("active");
      $(this.parentNode).siblings("div").children("div")
        .removeClass("active").eq($(this).index()).addClass("active");
      if ($(e.target).is("a")) {
        return false;
      }
    });
  }
  jy.tabs('nav>header>span');

  //toggle class of elements by pattern
  jy.toggle = function(jq, pattern) {
    pattern = pattern || dj(jq, 'toggle');
    pattern = pattern.split(',');
    if (!pattern.length) return;

    var t = [];
    for (var i = pattern.length - 1; i >= 0; i--) {
      var a = lastSplit(pattern[i], ".");
      if (a.length == 2)
        t.push(a);
      else
        log("invaild toggle rel: " + pattern[i]);
    };
    $(jq).click(function() {
      for (var i = t.length - 1; i >= 0; i--) {
        $(t[i][0]).toggleClass(t[i][1]);
      }
      return false;
    });
  }
  jy.toggle('.toggle');

  //affix-top
  jy.affix = function(jq, opt) {
    jq = $(jq).eq(0);
    opt = typeof opt == "string" ? {
      target: opt
    } : opt || {};
    var self = $.extend({
      offset: 10,
    }, dj(jq, "affix", 'target'), opt);

    var target = self.target;
    if (target) target = $(target);
    // namespace
    self.ns = "affix";
    self.callback = function() {
      var scrollTop = win.scrollTop();
      if (jq.is('.affix-top')) {
        var affixTop = 0,
          top = jq.offset().top - scrollTop;
        if (target) {
          if (target.css('position') == 'fixed')
            affixTop = target.position().top + target.outerHeight();
        }

        if (self.offset + affixTop >= top) {
          self.parentTop = jq.parent().offset().top - scrollTop;
          jq.addClass("affix").removeClass('affix-top').css({
            top: self.offset + affixTop
          });
        }
      } else {
        if (self.parentTop < jq.parent().offset().top - scrollTop) {
          jq.addClass("affix-top").removeClass('affix');
        }
      }
    }

    onWinScroll.push(self);
  }
  $(function() {
    jy.affix('.affix-top');
  })
}(window, window.jQuery);
