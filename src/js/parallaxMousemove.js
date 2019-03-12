$(function() {
	
	'use strict';
	
	$('.parallax').each(function() {
		var targetParallax = $(this);
		var movementStrength = $(this).attr('data-parallax-strength');
		var height = movementStrength / $(window).height();
		var width = movementStrength / $(window).width();
		
				$('body').mousemove(function(e){
				var pageX = e.pageX - ($(window).width() / 2);
				var pageY = e.pageY - ($(window).height() / 2);
				var newvalueX = width * pageX * - 1;
				var newvalueY = height * pageY * - 1;
				if ($(window).width() > 800){
					targetParallax.css({
						'transform' : 'translate3d('+newvalueX+'px, '+newvalueY+'px, 0px)',
						'-moz-transform' : 'translate3d('+newvalueX+'px, '+newvalueY+'px, 0px)',
						'-webkit-transform' : 'translate3d('+newvalueX+'px, '+newvalueY+'px, 0px)'
					});
				} else {
				targetParallax.css({
						'transform' : 'translate3d(0px, 0px, 0px)',
						'-moz-transform' : 'translate3d(0px, 0px, 0px)',
						'-webkit-transform' : 'translate3d(0px, 0px, 0px)'
					});	
				}
			
		});
			$(window).on('resize', function(){
				if ($(window).width() < 800){
					targetParallax.css({
						'transform' : 'translate3d(0px, 0px, 0px)',
						'-moz-transform' : 'translate3d(0px, 0px, 0px)',
						'-webkit-transform' : 'translate3d(0px, 0px, 0px)'
					});	
				}
			});
		
    });
	
});