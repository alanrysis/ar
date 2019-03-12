$(function(){
		
		var accordionMenu = $('#only-one');
		
		$('#openAccordion').click(function(){
			accordionMenu.slideToggle(700);
		});
		
		$(window).on('resize', function(){
			if ($(window).width() > 890){
				accordionMenu.slideUp(700);
			}
		});
});