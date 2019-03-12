//RIC Automatic Slideshow

;(function ( $, window, document, undefined ) {
	
var pluginName = 'audioPlayerRev',
        defaults = {
			loop: true
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
	
	var x = $(self.element);
	var boardBackup = x.html();
	
	var music = $(self.element).find(".music");
	console.log('music: ', music);
	
	var groups = x.find("ul");
	var currentGroup = 0;
	
	var currentIndex = 0;
	
	function createAmbientElements(){
		
		x.html('<div class="currentAudio"><div class="imgCover"><img id="cover" src="" alt=""></div><div class="infoAndControls"><div class="titleAndArtist"><h1 id="title"></h1><h2 id="artist"></h2></div><div id="playerControls"><div class="timeContainer"><div id="currentTime">0:00</div><div id="totalTime">5:32</div></div><div class="progressBarContainer"><div id="progressBar"></div></div><div class="controls"><a class="btLoop"></a><a class="btPrev"></a><a class="btPlay"></a><a class="btNext"></a><a class="btMute"></a></div></div><a class="btBuy" href="#" target="_blank"></a><div class="share"><div class="shareLinks"></div><a class="btShare"></a></div></div></div><audio id="audioElement" controls style="display: none;" preload="metadata"><source id="audioElementSource" src="" type="audio/mp3"></audio><audio id="audioElement2" controls style="display: none;" preload="metadata"><source id="audioElementSource2" src="" type="audio/mp3"></audio>');
		
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
		if(typeof currentAudio.buyLink !== typeof undefined){
			$('.btBuy').css('display','block');
			$('.btBuy').attr('href', currentAudio.buyLink);
		} else {
			$('.btBuy').css('display','none');
		}
		//$('.btShare').attr('href', currentAudio.shareLink);
		console.log('currentAudio.shareLink: ', currentAudio.shareLink);
		
		$('.shareLinks').html('');
		
		for(var i = 0; i < currentAudio.shareLink.length; i++){
			console.log(currentAudio.shareLink[i]);
			if(currentAudio.shareLink[i].indexOf('facebook') !== -1){
				$('.shareLinks').append('<a class="facebookShare" href="' + currentAudio.shareLink[i] + '" target="_blank"></a>');
			}
			
			if(currentAudio.shareLink[i].indexOf('twitter') !== -1){
				$('.shareLinks').append('<a class="twitterShare" href="' + currentAudio.shareLink[i] + '" target="_blank"></a>');
			}
			
			if(currentAudio.shareLink[i].indexOf('instagram') !== -1){
				$('.shareLinks').append('<a class="instagramShare" href="' + currentAudio.shareLink[i] + '" target="_blank"></a>');
			}
		}
		
		console.log('currentAudio: ', currentAudio);
	}
	
	var shareState = false;
	var shareDivTop = parseInt($('.share').css('top'));
	console.log('shareDivTop: ', shareDivTop);
	
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
    	console.log('audioElement.duration: ', audioElement.duration);
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
		} else {
			$(this).removeClass('playing');
			audioElement.pause();
			audioElement2.pause();
			audioPaused = true;
			clearInterval(playingInterval);
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
		console.log(perc);
		
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
			console.log("CurrentIndex: ", currentIndex);
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
		  
		 //Aminate some element on the page
		  var transformScaleValue = ((frequencyData[5] / 255) * 0.2) + 0.9;
		  var transformScaleValue2 = ((frequencyData[50] / 255) * 0.2) + 0.9;
		  $('#imgLogoAnim').css('transform', 'scale(' + transformScaleValue + ')');
		  //console.log('transformScaleValue: ', transformScaleValue);
		  if(transformScaleValue2 > 1.05){
			  $('#flashImages').css('display', 'block');
		  } else {
			  $('#flashImages').css('display', 'none');
		  }
	  }
	  renderFrame();
	}
	//end audio frequency tracker

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