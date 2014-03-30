! function(window,$) {
	"use strict";
	var document = window.document;
	var jy = window.JY = window.JY || {};
	function clearTextNode(jq, option) {
		if (!document.body.classList) return false;
		if (!jq) jq = [document.body];

		option = option || {};
		option.deep = option.deep || 1;
		var stop = false,
			S = /\S/,
			t = (new Date()).getTime(),
			skipNodeNames = ['STYLE', 'SCRIPT', 'P', 'PRE', 'CODE'].concat(option.skipNodeNames),
			skipClass = option.skipClass || "ctnskip",
			stopClass = option.stopClass || "ctnskip",
			node, deep;
		for (var i = jq.length - 1; i >= 0; i--) {
			node = jq[i];
			if (node === document) {
				node = document.body;
			}
			if (!node || !node.normalize) continue;
			node.normalize();
			deep = option.deep;
			stop = false;
			walk(node.firstChild);
			node.normalize();
		};
		return ((new Date()).getTime() - t) / 1000;

		function skip(node) {
			if (skipNodeNames.indexOf(node.nodeName) !== -1) return true;
			if (node.classList.contains(stopClass)) {
				return stop = true;
			}
			return node.classList.contains(skipClass);
		}

		function walk(node) {
			while (!stop && node) {
				if (node.nodeType === 3 && node.nextSibling && node.previousSibling && !S.test(node.data)) {
					node.data = node.data.trim();
				}
				if (node.nodeType === 1 && !skip(node) && deep != 0) {
					deep--;
					walk(node.firstChild);
					deep++;
				}
				node = node.nextSibling;
			}
		}
	};

	jy.clearTextNode = jy.clearTextNode || clearTextNode;
	jy.init = jy.init || JingYesInit;
	if (window && $){
		jy.init(window,$);
	}

	function log() {
		if (!arguments.length || !window.console || !window.console.log) {} else {
			window.console.log.apply(window.console, arguments);
		}
	}
	jy.log = jy.log || log;
	var inited = false
	function JingYesInit(window, $) {
		if (inited) return;
		inited = true;
		var document = window.document;
		var jy = window.JY = window.JY || {};
		var intervals = 5000; // for setTimeout
		var win = $(window);
		var body = $(body);
		var onWinScroll = []; // {callback:function(...){},[self,skip]}
		var events = {
			"*": true
		};

		jy.intervals = function(milliseconds) {
			intervals = parseInt(milliseconds) || 5000;
		}

		on(win, 'scroll.jingyes', function() {
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

		function on(jq, name, fn) {
			jq.on(name, function(e) {
				if (events["*"] && events[name] === undefined || events[name])
					fn.apply(this, arguments);
			});
		}
		jy.on = on;

		function live(jq, name, fn) {
			jq.live(name, function() {
				if (events["*"] && events[name] === undefined || events[name])
					fn.apply(this, arguments);
			});
		}
		jy.live = live;

		jy.eventIsDisable = function(name) {
			return events["*"] == false || events[name] == false;
		}

		jy.eventEnable = function(name) {
			events[name || "*"] = true;
		}

		jy.eventDisable = function(name) {
			events[name || "*"] = false;
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

		jy.accordion = function(nav_dl_dt) {
			on($(nav_dl_dt), 'click.jingyes.collapse', function() {
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
			});
			$(nav_dl_dt).next('dd').addClass('transition');
		}

		// carousel
		// 参数 delayMilliseconds 用于延迟触发事件, 使动态效果错开运行.
		jy.carousel = function(jq, delayMilliseconds) {

			var jqs = $(jq);
			var stop = false;
			var timer = -1;
			var carousel = function(delay) {
				timer = setTimeout(function() {
					jqs.trigger("carouse.jingyes");
				}, delay);
			};

			jqs.hover(
				function() {
					clearTimeout(timer);
					stop = true;
				},
				function() {
					stop = false;
					carousel(intervals);
				}
			);

			jy.clearTextNode(jqs, {
				deep: 2
			});
			// 初始化检查
			jqs.each(function() {
				var p = $(this).parent();

				var totalWidth = 0;
				var cs = $(this).children('div');
				cs.each(function() {
					totalWidth += $(this).width();
				}).eq(0).addClass("transition");

				if (p.css('overflow') != "hidden") {
					p.css({
						overflow: 'hidden',
						width: cs.eq(0).width()
					});
				}

				$(this).width(totalWidth);
			});

			jqs.on("carouse.jingyes", function() {

				if (!stop || !jy.eventIsDisable("carouse.jingyes")) {

					jqs.each(function() {
						var self = $(this);
						var cs = self.children('div');
						var first = cs.eq(0);

						if (cs.length < 2) return;
						var w = first.width();
						var left = parseInt(first.css("marginLeft")) - w;
						if (w * cs.length <= -left) {
							left = 0;
						}
						first.css("marginLeft", left);
					});
				}

				carousel(intervals);

			});
			carousel(delayMilliseconds || Math.random() * 7777);
		}

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

		//toggle class of elements by pattern
		jy.toggle = function(jq, pattern) {
			function target(jq,pattern){
				var t = [];
				pattern = pattern || dj(jq, 'toggle') || "";
				if (!pattern) return t;
				
				pattern = pattern.split(',');
				
				for (var i = pattern.length - 1; i >= 0; i--) {
					var a = lastSplit(pattern[i], ".");
					if (a.length == 2)
						t.push(a);
					else
						log("invaild toggle: " + pattern[i]);
				};
				return t;
			}

			var def = target(jq,pattern);

			$(jq).click(function() {
				var t = target(this);
				if (!t.length) t= def;
				for (var i = t.length - 1; i >= 0; i--) {
					$(t[i][0]).toggleClass(t[i][1]);
				}
				return false;
			});
		}

		//affix-top
		jy.affix = function(jq, opt) {
			jq = $(jq).eq(0);
			if (!jq.length) return;

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

				if (jq.is('.affix')) {

					if (self.parentTop < jq.parent().offset().top - scrollTop) {
						jq.addClass("affix-top").removeClass('affix');
					}

				} else {

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
				}
			}
			onWinScroll.push(self);
		}

		function onload() {
			jy.clearTextNode($('[class^="span"]').parent())
			jy.clearTextNode('nav>dl');
			jy.accordion('nav>dl>dt');
			jy.carousel('.carousel');
			jy.affix('.affix-top');
			jy.toggle('.toggle');
			jy.tabs('nav>header>span');
		}

		if (jy.dont) {
			//
		}else{
			onload();
		}
	}
}(window, window.jQuery);
