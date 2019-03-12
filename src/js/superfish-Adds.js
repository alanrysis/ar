// Desktop Navigation Adds
$(document).ready(function(){
		var windowWidth;
		windowWidth= $(window).width();
        $( window ).resize(function() {
            windowWidth = $(window).width();
        });
        
        var exampleOptions = {
          speed: 'fast',
		  onBeforeShow : function (){                 
                if(!this.is('.sf-menu>li>ul')){
                    var subMenuWidth = $(this).width();
                    var parentLi = $(this).parent();                    
                    var parentWidth = parentLi.width();
                    var subMenuRight = parentLi.offset().left + parentWidth + subMenuWidth;
                    if(subMenuRight > windowWidth){
                        $(this).css('left','auto');
                        $(this).css('right', parentWidth+'px');
						$('.sf-mega').css({
							'left':'0',
							'right':'auto'
						});
                    } else {
						$(this).css('left','100%');
                        $(this).css('right', 'auto');
					}
                }
            }
        };
        // initialise plugin
        var example = $('#example').superfish(exampleOptions);

        // buttons to demonstrate Superfish's public methods
        $('.destroy').on('click', function(){
          example.superfish('destroy');
        });

        $('.init').on('click', function(){
          example.superfish(exampleOptions);
        });

        $('.open').on('click', function(){
          example.children('li:first').superfish('show');
        });

        $('.close').on('click', function(){
          example.children('li:first').superfish('hide');
        });
});