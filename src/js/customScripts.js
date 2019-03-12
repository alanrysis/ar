// Locations Link triger
$(function(){
	
	"use strict";
	
	
	//Initiazile ?
	
	var locationSearch = window.location.search;
		locationSearch = locationSearch.replace('?ref=','');
	
	$('.popTriger').each(function() {

		  var linkTarget = $(this);
		  var locationName = $(this).attr('id');
			
		  if(locationSearch === locationName){
			  	window.location = window.location.protocol + "//" + window.location.host + window.location.pathname + "##" + locationSearch;
			  	clickLaunch(linkTarget);
		  }
	});
	
	function clickLaunch(linkObj){ 
			setTimeout(function() {
				linkObj.click();
			},700);
	}
	
	//Auto PopUp
	function autoPop(){
	
		$('.popTriger').each(function() {

		  var linkTarget = $(this);
		  var locationName = $(this).attr('id');
		  var locationHash = window.location.hash;
			
		  locationHash = locationHash.replace('##','');
			
		  if(locationHash === locationName){
			  	clickLaunch(linkTarget);
			}
		});
	
		function clickLaunch(linkObj){
			setTimeout(function() {
				linkObj.click();
			},700);
		}
		
	}
	
	autoPop();
	
	window.onhashchange = function(){
		ga('send', 'pageview', {'page': location.pathname+location.search+location.hash});
		$('.litebox-close').click();
    	autoPop();
	};
	
	// Tracking
	$('.track').click(function(){
		
		var queryString = $(this).attr('data-tracking');
		if (history.pushState) {
			
			setTimeout(function() {
				var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString;
				window.history.pushState({path:newurl},'',newurl);
				ga('send', 'pageview', {'page': location.pathname+location.search+location.hash});
			}, 700);
			
		}
		
	});
	
});