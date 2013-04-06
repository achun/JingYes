!function ($) {
"use strict";
$.support = $.support||{};
if( $.support.transition ) return;
$.support.transition = (function () {
  var el = document.firstChild,
    transEndEventNames = {
       'WebkitTransition' : 'webkitTransitionEnd'
      ,'MozTransition'    : 'transitionend'
      ,'OTransition'      : 'oTransitionEnd otransitionend'
      ,'transition'       : 'transitionend'
    };
  while(el && !el.style) el=el.nextSibling;
  if(el) for (name in transEndEventNames){
    if (el.style[name] !== undefined) {
      return { end : transEndEventNames[name] };
    }
  }
  return {};
})();
function convertImageToCanvas(image) {
  var canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext("2d").drawImage(image, 0, 0);

  return canvas;
}
//chrome://browser/content/orion.js

function clearTextNode(node, option) {
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
window.clearTextNode =clearTextNode;
//auto run
//accordion
$('nav>dl>dt,.nav>dl>dt').on('click.jingyes.collapse',function() {
  var dl=$(this.parentNode),
    dd=$(this).next('dd'),
    visible=dd.hasClass('open'),
    dds=dd.siblings('dt+dd'),
    fakeEnd='fake.transition.end',
    eventEnd= $.support.transition.end || fakeEnd;
  if(!dd.size() || !dl.hasClass('accordion') || dl.hasClass('keep') && visible) return;
  if(visible){
    dd.removeClass('transition')
    .each(scrollHeight)
    .addClass('in transition')
    .one(eventEnd,complete)
    .height(0).trigger(fakeEnd)
  }else{
    dds.removeClass('transition')
    dd.removeClass('transition')

    dds.each(scrollHeight)
    dd.height(0)

    dds.one(eventEnd,complete)
    dd.one(eventEnd,complete)
    
    dds.addClass('in transition')
    dd.addClass('open in transition')

    dds.height(0).trigger(fakeEnd)
    dd.each(scrollHeight).trigger(fakeEnd)
  }
  function scrollHeight(){
    $(this).height(this.scrollHeight)[0].offsetWidth;
  }
  function complete (){
    var ths=$(this).removeClass('transition in');
    !ths.height() && ths.removeClass('open');
    ths.height('')[0].offsetWidth;
    ths.addClass('transition');
  }
}).next('dd').addClass('transition');

//carousel
$('dl.carousel').each(function(){
  var dts=$(this).children('dt');
  if(dts.size()<2) return;
  var fakeEnd='fake.transition.end',
  eventEnd= $.support.transition.end || fakeEnd;
  var active=dts.eq(0);
  var h=active.height(),w=active.width();
  var index=0;
  var stop=0;
  active.css({display:'inline-block',width:w,height:h}).siblings().css({
    display:'inline-block',
    width:0,height:h
  })[0].offsetWidth;
  dts.addClass('transition');
  $(this).hover(
    function(){stop=1;},
    function(){
      if(stop==2) setTimeout(run,5000);
      stop=0;
    }
  );
  function run(){
    if(stop) {
      stop=2;
      return;
    }
    active.height(h).width(0)[0].offsetWidth;
    active = active.next();
    if(!active.size())
      active= dts.eq(0);
    active.one(eventEnd,complete).height(h).width(w)[0].offsetWidth;
  }
  function complete (){
    if(stop) stop=2;
    setTimeout(run,5000);
  }
  setTimeout(run,5000);
});

}(window.jQuery);

