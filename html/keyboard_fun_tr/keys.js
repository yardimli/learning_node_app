var fan_animations = [];
var CorrectKey = "";
var fan_1_anime = 1;
var StartAnimation = false;
var MaxFans = 3;
var WordToPlay = "";
var WordFound = false;

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function play_sound(mp3) {
	var AudioSrc = mp3;

	$("#media_audio_source").attr("src", AudioSrc);

	try {
		$("#media_audio")[0].load();//suspends and restores all audio element
	} catch (e) {
		console.log("Error playing audio (1) " + AudioSrc);
	}

	//pause/stop audio
	try {
		var promise = document.querySelector("#media_audio").pause();

		if (promise !== undefined) {
			promise.then(function (_) {
				console.log("audio paused!");

			}).catch(function (error) {
				console.log("pause was prevented!");
				console.log(error);
			});
		}
	} catch (e) {
		console.log("Error pausing media (6) ");
	}


	//play
	try {
		var promise = document.querySelector("#media_audio").play();

		if (promise !== undefined) {
			promise.then(function (_) {
				console.log(" autoplay started!");
			}).catch(function (error) {
				console.log(" autoplay was prevented!");
				console.log(error);
			});
		}
	} catch (e) {
		console.log("Error playing media (5) " + player);
	}

}


function CreateLesson() {
	let key_string = "ABCÇDEFGĞHİIJKLNNOÖPQRSŞTUÜVWXYZ1234567890";

	key_string = "1234567890";
	for (var ii = 0; ii < AlfaWords.length; ii++) {
		if (key_string.indexOf(AlfaWords[ii].word[0])===-1) {
			key_string += AlfaWords[ii].word[0];
		}
	}

	$.ajax({
		url: "/surface_cmd?cmd=keyboard_keys&keys=" + key_string,
		method: 'get',
		success: function (data) {
			if (data.key !== "") {
				if (data.key === "3") {
					for (var i = 0; i < fan_animations.length; i++) {
						fan_animations[i].is_animate = true;
					}
				}
			}
		}
	});

}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

$(document).ready(function () {

	addEventListener("click", function() {
		var
			el = document.documentElement
			, rfs =
			el.requestFullScreen
			|| el.webkitRequestFullScreen
			|| el.mozRequestFullScreen
		;
		rfs.call(el);
	});



	if (getParameterByName("max_fans")) {
//		MaxFans = getParameterByName("max_fans");
	}

	CreateLesson();
	let CountX=0;

	let LetterString = "";

	setInterval(function () {

		$.ajax({
			url: "/surface_cmd?cmd=what_key",
			method: 'get',
			success: function (data) {
//				console.log(data);
				if (data.key !== "") {
					CountX++;
					if (CountX>20) {
						CountX=0;
						$("#animation_view").html("");
					}
					LetterString += data.key.toUpperCase();

					var LettersAvailable = "";
					for (var ii = 0; ii < AlfaWords.length; ii++) {
						if (AlfaWords[ii].word.indexOf(LetterString)===0) {
							console.log(AlfaWords[ii].word);
							if (AlfaWords[ii].word.length>LetterString.length && LettersAvailable.indexOf(AlfaWords[ii].word[LetterString.length])===-1) {
								LettersAvailable += AlfaWords[ii].word[LetterString.length];
							}
						}
					}

					WordFound = false;
					for (var ii = 0; ii < AlfaWords.length; ii++) {
						if (AlfaWords[ii].word === LetterString) {
							WordToPlay = "../audio/tr_words/" + AlfaWords[ii].audio_video + ".mp3"
							LetterString = "";

							var LettersAvailable = "";
							for (var ii = 0; ii < AlfaWords.length; ii++) {
								if (LettersAvailable.indexOf(AlfaWords[ii].word[0])===-1) {
									LettersAvailable += AlfaWords[ii].word[0];
								}
							}

							WordFound = true;
							break;
						}
					}

					console.log(LettersAvailable);

					$.ajax({
						url: "/surface_cmd?cmd=keyboard_keys&keys=" + LettersAvailable,
						method: 'get',
						success: function (data) {
							if (data.key !== "") {
								if (data.key === "3") {
									for (var i = 0; i < fan_animations.length; i++) {
										fan_animations[i].is_animate = true;
									}
								}
							}
						}
					});

					if (WordFound) {
						setTimeout(function () {
							$("#animation_view").append( "<span style='color:black; font-size: 100px;'> </span> " );
							play_sound(WordToPlay, "media_video");
						},250);
					}

					$("#animation_view").append( "<span style='color:black; font-size: 100px;'>" + data.key.toUpperCase() + "</span> " );
					play_sound("../audio/correct-sound/switch_1.mp3");
              // play_sound("../audio/wrong-sound/wrong-answer-short-buzzer-double-01.mp3");
				}
			}
		});

	}, 100);
});
