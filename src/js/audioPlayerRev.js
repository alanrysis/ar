/**
 * Revolution Audio Player v1.0
 * Most modern mobile compatible Audio Player with hardware accelerated transitions and Audio API interaction
 *
 * Copyright 2019 Alan Rysis
 *
 * Released on: Mai 6, 2019
 * License : All rights reserved
*/

;(function ( $, window, document, undefined ) {
	
var pluginName = 'audioPlayerRev',
        defaults = {
			loop: true,
			apiAnimateElements: false,
			trackEvents: true
        };

function audioPlayerRev(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
}

audioPlayerRev.prototype.init = function () {
		
var self = this,
opts = self.options;
//console.log(opts);
		
	//Options
	var loop = opts.loop;
	var apiAnimateElements = opts.apiAnimateElements;
	var trackEvents = opts.trackEvents;
	
	var x = $(self.element);
	var boardBackup = x.html();
	
	var music = $(self.element).find(".music");
	//console.log('music: ', music);
	
	var groups = x.find("ul");
	var currentGroup = 0;
	
	var currentIndex = 0;
	
	function createAmbientElements(){
		
		x.html('<div class="currentAudio"><div class="imgCover"><img id="cover" src="" alt=""></div><div class="infoAndControls"><div class="titleAndArtist"><h1 id="title"></h1><h2 id="artist"></h2></div><div id="playerControls"><div class="timeContainer"><div id="currentTime">0:00</div><div id="totalTime">5:32</div></div><div class="progressBarContainer"><div id="progressBar"></div></div><div class="controls"><a class="btLoop"></a><a class="btPrev"></a><a class="btPlay"></a><a class="btNext"></a><a class="btMute"></a></div></div><div class="buy"><div class="buyLinks"></div><a class="btBuy"></a></div><div class="share"><div class="shareLinks"></div><a class="btShare"></a></div></div></div><audio id="audioElement" controls style="display: none;" preload="metadata"><source id="audioElementSource" src="" type="audio/mp3"></audio><audio id="audioElement2" controls style="display: none;" preload="metadata"><source id="audioElementSource2" src="" type="audio/mp3"></audio>');
		
	}
	
	//create all elements to play
	createAmbientElements();
	
	function go(index){
		
		var currentAudioElement = $(music[index]);
		
		var currentAudio = {
			cover : $(currentAudioElement).attr('data-img-cover'),
			audioSrc : $(currentAudioElement).attr('data-audio-src'),
			title : $(currentAudioElement).attr('data-title'),
			author : $(currentAudioElement).attr('data-author'),
			buyLink : $(currentAudioElement).attr('data-buy-link'),
			shareLink : $(currentAudioElement).attr('data-share-link').split(';')
		};
		
		//inject information
		
		$('#cover').attr('src', currentAudio.cover);
		$('#audioElementSource').attr('src', currentAudio.audioSrc);
		$('#audioElementSource2').attr('src', currentAudio.audioSrc);
		$('#title').html(currentAudio.title);
		$('#artist').html(currentAudio.author);
		
		
		if(trackEvents){
			$('.buyLinks a').unbind();
		}
		$('.buyLinks').html('');
		
		if(typeof currentAudio.buyLink !== typeof undefined){
			currentAudio.buyLink = currentAudio.buyLink.split(';');
			$('.btBuy').css('display','block');
			//console.log('currentAudio.buyLink: ', currentAudio.buyLink);
			
			for(var j = 0; j < currentAudio.buyLink.length; j++){
				
				if(currentAudio.buyLink[j].indexOf('itunes') !== -1){
					$('.buyLinks').append('<a class="itunesBuy" href="' + currentAudio.buyLink[j] + '" target="_blank"></a>');
				}

				if(currentAudio.buyLink[j].indexOf('spotify') !== -1){
					$('.buyLinks').append('<a class="spotifyBuy" href="' + currentAudio.buyLink[j] + '" target="_blank"></a>');
				}

				if(currentAudio.buyLink[j].indexOf('amazon') !== -1){
					$('.buyLinks').append('<a class="amazonBuy" href="' + currentAudio.buyLink[j] + '" target="_blank"></a>');
				}
				
				if(currentAudio.buyLink[j].indexOf('google') !== -1){
					$('.buyLinks').append('<a class="googleBuy" href="' + currentAudio.buyLink[j] + '" target="_blank"></a>');
				}
			}
			
			if(trackEvents){
				$('.buyLinks a').on('click', function(){
					//trackEvents
					addTrackingTags('inter=btBuy&title=' + encodeURI($(music[currentIndex]).attr('data-title')) + '&store=' + $(this).attr('class'));
				});
			}
			
		} else {
			$('.btBuy').css('display','none');
		}
		//$('.btShare').attr('href', currentAudio.shareLink);
		//console.log('currentAudio.shareLink: ', currentAudio.shareLink);
		if(trackEvents){
			$('.shareLinks a').unbind();
		}
		$('.shareLinks').html('');
		
		for(var i = 0; i < currentAudio.shareLink.length; i++){
			//console.log(currentAudio.shareLink[i]);
			if(currentAudio.shareLink[i].indexOf('facebook') !== -1){
				$('.shareLinks').append('<a class="facebookShare" href="' + currentAudio.shareLink[i] + '" target="_blank"></a>');
			}
			
			if(currentAudio.shareLink[i].indexOf('twitter') !== -1){
				$('.shareLinks').append('<a class="twitterShare" href="' + currentAudio.shareLink[i] + '" target="_blank"></a>');
			}
			
			if(currentAudio.shareLink[i].indexOf('instagram') !== -1){
				$('.shareLinks').append('<a class="instagramShare" href="' + currentAudio.shareLink[i] + '" target="_blank"></a>');
			}
			
			if(currentAudio.shareLink[i].indexOf('whatsapp') !== -1){
				$('.shareLinks').append('<a class="whatsappShare" href="' + currentAudio.shareLink[i] + '" target="_blank"></a>');
			}
			
			if(currentAudio.shareLink[i].indexOf('messenger') !== -1){
				$('.shareLinks').append('<a class="messengerShare" href="' + currentAudio.shareLink[i] + '" target="_blank"></a>');
			}
		}
		if(trackEvents){
			$('.shareLinks a').on('click', function(){
				//trackEvents
				addTrackingTags('inter=btShare&title=' + encodeURI($(music[currentIndex]).attr('data-title')) + '&to=' + $(this).attr('class'));
			});
		}
		//console.log('currentAudio: ', currentAudio);
		
		if(trackEvents){
			addTrackingTags('state=moveTo&title=' + encodeURI($(music[currentIndex]).attr('data-title')));
		}
	}
	
	//Tracking Stuff
	function addTrackingTags(queryString){
		
		if (history.pushState) {
			
			setTimeout(function() {
				var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString;
				window.history.pushState({path:newurl},'',newurl);
				ga('send', 'pageview', {'page': location.pathname+location.search+location.hash});
			}, 700);
			
		}
		
	}
	
	var shareState = false;
	var shareDivTop = parseInt($('.share').css('top'));
	//console.log('shareDivTop: ', shareDivTop);
	
	$('.btShare').on('click', function(e){
		var injectedHeight;
		e.preventDefault();
		if(!shareState){
			$(this).parent().addClass('open');
			injectedHeight = shareDivTop - $(this).parent().height() + $(this).height();
			$(this).parent().css('top', injectedHeight + 'px');
			shareState = true;
		} else {
			$(this).parent().removeClass('open');
			$(this).parent().css('top', shareDivTop);
			shareState = false;
		}
		
		if(trackEvents){
			addTrackingTags('inter=btShare&title=' + encodeURI($(music[currentIndex]).attr('data-title')));
		}
		
	});
	
	var buyState = false;
	var buyDivTop = parseInt($('.buy').css('top'));
	//console.log('buyDivTop: ', buyDivTop);
	
	$('.btBuy').on('click', function(e){
		var injectedHeight2;
		e.preventDefault();
		if(!buyState){
			$(this).parent().addClass('open');
			injectedHeight2 = buyDivTop - $(this).parent().height() + $(this).height();
			$(this).parent().css('top', injectedHeight2 + 'px');
			buyState = true;
		} else {
			$(this).parent().removeClass('open');
			$(this).parent().css('top', buyDivTop);
			buyState = false;
		}
		
		if(trackEvents){
			addTrackingTags('inter=btBuy&title=' + encodeURI($(music[currentIndex]).attr('data-title')));
		}
		
	});
	
	var audioElement = document.getElementById('audioElement');
	audioElement.load();
	audioElement.loop = false;
	
	//audio element only for visualizer
	var audioElement2 = document.getElementById('audioElement2');
	audioElement2.load();
	audioElement2.loop = false;
	
	var audioPaused = true;
	var muted = false;
	var playingInterval;
	var progressBar = $('#progressBar');
	
	var visualizerStart = false;
	
	function pad(val) {
		  var valString = val + "";
		  if (valString.length < 2) {
			return "0" + valString;
		  } else {
			return valString;
		  }
	}
	
	audioElement.onloadedmetadata = function() {
    	//console.log('audioElement.duration: ', audioElement.duration);
		$('#totalTime').html(pad(parseInt(audioElement.duration / 60)) + ":" + pad(parseInt(audioElement.duration % 60)));
	};

	$('.btPlay').on('click', function(e){
		if(!visualizerStart){
			createAnalyser();
			visualizerStart = true;
		}
		e.stopPropagation();
		if(audioPaused){
			$(this).addClass('playing');
			audioElement.play();
			audioElement2.play();
			audioPaused = false;
			
			if(trackEvents){
				addTrackingTags('inter=Playing&title=' + encodeURI($(music[currentIndex]).attr('data-title')));
			}
			
		} else {
			$(this).removeClass('playing');
			audioElement.pause();
			audioElement2.pause();
			audioPaused = true;
			clearInterval(playingInterval);
			$('.whiteFlash').css('display','none');
			
			if(trackEvents){
				addTrackingTags('inter=Paused&title=' + encodeURI($(music[currentIndex]).attr('data-title')));
			}
			
		}

	});
	
	function updateProgressValues(){
		var currentPerc;
		
		playingInterval = setInterval(function(){
			currentPerc = Math.floor((audioElement.currentTime/audioElement.duration) * 100);
			//console.log('currentTime: ', audioElement.currentTime);
			$(progressBar).css('width', currentPerc + '%');
			$('#currentTime').html(parseInt(audioElement.currentTime / 60) + ":" + pad(parseInt(audioElement.currentTime % 60)));
		},10);
		
	}
	
	//track click event on progressbar and play
	$('.progressBarContainer').on("click", function(e){
		var offset = $(this).offset();
		var xPosition = e.pageX - offset.left;
		var perc = (xPosition / $('.progressBarContainer').width());
		//console.log(perc);
		
		audioElement.pause();
		audioElement2.pause();
		audioElement.currentTime = Math.floor(parseInt( audioElement.duration * perc ));
		audioElement2.currentTime = Math.floor(parseInt( audioElement.duration * perc ));
		if(!audioPaused){
			audioElement.play();
			audioElement2.play();
			$('.btPlay').addClass('playing');
		}
	});
	
	
	$('.btMute').on("click", function(){
		if(muted){
			$(this).removeClass('muted');
			audioElement.muted = false;
			muted = false;
		} else {
			$(this).addClass('muted');
			audioElement.muted = true;
			muted = true;
		}
	});
	
	
	//Audio loop
	if(loop){	
		$('.btLoop').addClass('enable');
	}
	
	$('.btLoop').on("click", function(){
		if(!loop){
			$(this).addClass('enable');
			loop = true;
		} else {
			$(this).removeClass('enable');
			loop = false;
		}
	});
	
	//GO!!!!
	go(currentIndex);
	
	audioElement.addEventListener("play", updateProgressValues);
	audioElement.addEventListener("ended", function(){
		if(currentIndex == (music.length-1)){
			if(loop){
				currentIndex = 0;
				go(currentIndex);
				audioElement.pause();
				audioElement.load();
				audioElement.currentTime = 0;
				audioElement.play();
				audioElement2.pause();
				audioElement2.load();
				audioElement2.currentTime = 0;
				audioElement2.play();
			} else {
				$('.btPlay').removeClass('playing');
				audioElement.pause();
				audioElement2.pause();
				audioPaused = true;
				clearInterval(playingInterval);
				$(progressBar).css('width', '100%');
				$('#currentTime').html(parseInt(audioElement.currentTime / 60) + ":" + pad(parseInt(audioElement.currentTime % 60)));
			}
			
		} else {
			currentIndex++;
			audioElement.pause();
			go(currentIndex);
			audioElement.load();
			audioElement.currentTime = 0;
			audioElement.play();
			audioElement2.pause();
			audioElement2.load();
			audioElement2.currentTime = 0;
			audioElement2.play();
			//console.log("CurrentIndex: ", currentIndex);
		}
	});
	
	$('.btPrev').on("click", function(){
		if(currentIndex == 0){
			currentIndex = music.length-1;
		} else {
			currentIndex--;
		}
		go(currentIndex);
		audioElement.pause();
		audioElement.load();
		audioElement.currentTime = 0;
		audioElement2.pause();
		audioElement2.load();
		audioElement2.currentTime = 0;
		if(!audioPaused){
			audioElement.play();
			audioElement2.play();
		}
		
	});
	
	$('.btNext').on("click", function(){
		if(currentIndex == (music.length-1)){
			currentIndex = 0;
		} else {
			currentIndex++;
		}
		go(currentIndex);
		audioElement.pause();
		audioElement.load();
		audioElement.currentTime = 0;
		audioElement2.pause();
		audioElement2.load();
		audioElement2.currentTime = 0;
		if(!audioPaused){
			audioElement.play();
			audioElement2.play();
		}
	});
	
	//audio frequency
	
	var kickingInterval;
	var isKicking = true;
	var hiHZHigh = false;
	var kickControlfreq = 0;
	
	function createAnalyser (){
	  var ctx = new AudioContext();
	  var audio = audioElement2;
	  var audioSrc = ctx.createMediaElementSource(audio);
	  var analyser = ctx.createAnalyser();
	  
	  // we have to connect the MediaElementSource with the analyser 
	  audioSrc.connect(analyser);
	  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

	  // frequencyBinCount tells you how many values you'll receive from the analyser
	  var frequencyData = new Uint8Array(analyser.frequencyBinCount);

	  // we're ready to receive some data!
	  // loop
	  function renderFrame() {
		 requestAnimationFrame(renderFrame);
		 // update data in frequencyData
		 analyser.getByteFrequencyData(frequencyData);
		 // render frame based on values in frequencyData
		 //console.log(frequencyData);
		  var kickControlDif = 0;
		 //Aminate some element on the page
		  var transformScaleValue = ((frequencyData[5] / 255) * 0.2) + 0.9;
		  var transformScaleValue2 = ((frequencyData[50] / 255) * 0.2) + 0.9;
		  $('#imgLogoAnim').css('transform', 'scale(' + transformScaleValue + ')');
		  //console.log('transformScaleValue: ', transformScaleValue);
		  if(transformScaleValue2 > 1.04){
			  $('#flashImages').css('display', 'block');
		  } else {
			  $('#flashImages').css('display', 'none');
		  }
		  
		  if(frequencyData[0] > 180){
			  kickControlfreq++;
		  } else {
			  kickControlfreq = 0;
		  }
		  
		  if(frequencyData[50] > 180){
			  hiHZHigh = true;
		  } else {
			  hiHZHigh = false;
		  }
	  }
	
	  $(window).resize(function(){
		  if($(window).width() < 800){
			  clearInterval(kickingInterval);
		  }
	  });
		
	  if(apiAnimateElements){
	  	renderFrame();
		  if($(window).width() > 800){
			  kickingInterval = setInterval(function(){
				  if(kickControlfreq > 0){
					  //if is kicking
					  //console.log("Kick!");
					  isKicking = true;
				  } else {
					  isKicking = false;
				  }

				  if(isKicking){
					  $('.whiteFlash').css('display','none');
				  } else {
					  if(hiHZHigh) {
						$('.whiteFlash').css('display','block');
					  }
				  }
			  }, 200);
		  }
	  }
	}
	//end audio frequency tracker
	
	//Go To Song Reference
	function getUrlParameter(name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
		var results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	var urlParamInit = getUrlParameter('init');
	//console.log('init: ', urlParamInit);
	if(urlParamInit !== ''){
		locateAndPlayMusic(urlParamInit);
	}
	
	function locateAndPlayMusic(urlParamInit){
		
		var dataid;
		for(var i = 0; i < music.length; i++){
			dataid = $(music[i]).attr('data-id');
			if(urlParamInit == dataid){
				go(i);
				currentIndex = i;
			}
			//console.log('dataid: ', dataid);
		}
		
	}

};
	
$.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new audioPlayerRev( this, options ));
            }
        });
    };

})( jQuery, window, document );