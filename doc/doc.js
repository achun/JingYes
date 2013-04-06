!(function($){
	clearTextNode();
	var href = location.protocol + '//'+location.hostname+location.pathname;
	$('nav:eq(0) a').each(function(){
		if(this.href==href){
			$(this).closest('dt').addClass('active').siblings().removeClass('active');
			return false;
		}
	});

})(window.jQuery)