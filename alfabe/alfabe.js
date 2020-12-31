var CorrectKey = "";
var LessonLetters = "ABC";

var LessonProgress = 0;
var LessonInProgress = false;

var WordAudio = "";

var RandomList = [];


function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var LessonLength = parseInt(getParameterByName("length"), 10);

var WordHints = getParameterByName("hints") === "yes";

function play_sound(mp3, playerid) {
	var AudioSrc = mp3;
	console.log("try to play: " + AudioSrc);

	$("#" + playerid + "_source").attr("src", AudioSrc);

	try {
		$("#" + playerid)[0].load();//suspends and restores all audio element
	} catch (e) {
		console.log("Error playing audio (1) " + AudioSrc);
	}

	//pause/stop audio
	try {
		var promise = document.querySelector("#" + playerid).pause();

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
		var promise = document.querySelector("#" + playerid).play();

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

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function CreateLesson() {
	LessonInProgress = true;
	LessonProgress++;
	$("#ballons").hide();


	$("#progress_bar_box").css({"width": ((LessonProgress / LessonLength) * 100) + "%"});

	var CurrentLesson = RandomList[LessonProgress - 1].split("-");
	var LetterIndex = parseInt(CurrentLesson[0], 10);
	var RandomImagePos = parseInt(CurrentLesson[1], 10);
	CorrectKey = LessonLetters[LetterIndex];

	var GraphicsLetterIndex = 0;
	for (var i = 0; i < Graphics.length; i++) {
		if (Graphics[i].letter === CorrectKey) {
			GraphicsLetterIndex = i;
			break;
		}
	}


	console.log(LetterIndex + " " + GraphicsLetterIndex + " " + RandomImagePos + " " + CorrectKey);

	var wordX = Graphics[GraphicsLetterIndex].images[RandomImagePos];
	var wordY = wordX.split("-");
	var wordY = wordY[0];

	var WordIndex = Graphics[GraphicsLetterIndex].words_en.indexOf(wordY);
	var WordToShow = Graphics[GraphicsLetterIndex].words_tr[WordIndex];
	WordAudio = Graphics[GraphicsLetterIndex].audio_tr[WordIndex];

	$("#word_image").attr("src", CorrectKey + "/" + Graphics[GraphicsLetterIndex].images[RandomImagePos]);


	if (WordHints) {
		$("#word_letter").html("<span style='text-shadow: 2px 2px 2px rgba(0,0,0,0.5); color:" + getRandomColor() + "; font-size: 150px; line-height: 150px;'>" + CorrectKey + "</span>");
	}

	$("#word_spelling").html('<h1 class="ml11">\
					<span class="text-wrapper">\
					<span class="line line1"></span>\
					<span class="letters" style="text-shadow: 2px 2px 2px rgba(0,0,0,0.5); color:' + getRandomColor() + ';">' + WordToShow + '</span>\
				</span>\
				</h1>');


	// Wrap every letter in a span
	var textWrapper = document.querySelector('.ml11 .letters');
	textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");

	anime.timeline({loop: true})
		.add({
			targets: '.ml11 .line',
			scaleY: [0, 1],
			opacity: [0.5, 1],
			easing: "easeOutExpo",
			duration: 700
		})
		.add({
			targets: '.ml11 .line',
			translateX: [0, document.querySelector('.ml11 .letters').getBoundingClientRect().width + 10],
			easing: "easeOutExpo",
			duration: 700,
			delay: 100
		}).add({
		targets: '.ml11 .letter',
		opacity: [0, 1],
		easing: "easeOutExpo",
		duration: 600,
		offset: '-=775',
		delay: (el, i) => 34 * (i + 1)
	}).add({
		targets: '.ml11',
		opacity: 0,
		duration: 1000,
		easing: "easeOutExpo",
		delay: 1000
	});

	play_sound(WordAudio, "media_audio");


	var RandomLetter = "ABCDEFGHIJKLMNOPQRS";
	var RandomLetters = "";
	for (var i = 0; i < 2; i++) {
		RandomLetters += RandomLetter[Math.floor(Math.random() * 16)];
	}
//	alert(RandomLetters);
	$.ajax({
		url: "/surface_cmd?cmd=keyboard_keys&keys=" + LessonLetters + RandomLetters,
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

function CorrectAnswer() {
	LessonInProgress = false;
	play_sound("../audio/correct-sound/clap_2.mp3", "media_audio");

	// StartAnimation = true;
	// for (var i = 0; i < fan_animations.length; i++) {
	// 	fan_animations[i].is_animate = true;
	// }

	setTimeout(function () {
		play_sound("../audio/correct-sound/bravo-"+ Math.floor( (Math.random() * 10) +1 ) +".mp3","media_audio2");
	}, 400);

	if (WordHints) {
		$("#word_letter").removeClass("animate-flicker");
		$("#word_letter").addClass("animate-zoom");
	}
	$("#ballons").show();
	$("#ballons").addClass("balloons_hide");

	setTimeout(function () {

		if (LessonProgress >= LessonLength) {
			setTimeout(function () {
				top.window.location.href = '../index.html';
			}, 1500);
		}

		CreateLesson();
		if (WordHints) {
			$("#word_letter").removeClass("animate-zoom");
			$("#word_letter").addClass("animate-flicker");
		}
		$("#ballons").hide();
	}, 5000);

}

$(document).ready(function () {
	$("#ballons").hide();

	if (getParameterByName("nozoom") === "yes") {
		nozoom = true;
	}

	addEventListener("click", function () {
		if (getParameterByName("nozoom") === "yes") {
			nozoom = true;

		}
		else {
			var
				el = document.documentElement
				, rfs =
				el.requestFullScreen
				|| el.webkitRequestFullScreen
				|| el.mozRequestFullScreen
			;
			rfs.call(el);
		}
	});

	if (!WordHints) {
		$("#word_letter").hide();
	}


	if (getParameterByName("letters")) {
		LessonLetters = getParameterByName("letters");
	}

	for (var i = 0; i < LessonLength; i++) {
		var RandomLetterPos = Math.floor(Math.random() * LessonLetters.length);
		CorrectKey = LessonLetters[RandomLetterPos];
		console.log(CorrectKey + " " + LessonLetters);

		var TryAgain = true;
		l = 0;
		while (TryAgain && l < 10) {

			//find new random image
			for (var ii = 0; ii < Graphics.length; ii++) {
				if (Graphics[ii].letter === CorrectKey) {
					var RandomImagePos = Math.floor(Math.random() * Graphics[ii].images.length);
				}
			}


			TryAgain = false;
			for (var j = 0; j < i; j++) {
				if ((RandomLetterPos + "-" + RandomImagePos) === RandomList[j]) {
					TryAgain = true;
					break;
				}
			}
			l++;
		}

		RandomList[i] = (RandomLetterPos + "-" + RandomImagePos);
	}
	console.log(RandomList);

	CreateLesson();

	setInterval(function () {

		$.ajax({
			url: "/surface_cmd?cmd=what_key",
			method: 'get',
			success: function (data) {
				if (data.key !== "" && LessonInProgress) {
					console.log(data.key + " " + CorrectKey);
					if (data.key == CorrectKey.toLowerCase()) {
						CorrectAnswer();
					}
					else {
						setTimeout(function () {
							play_sound("../audio/wrong-sound/yanlis-"+ Math.floor( (Math.random() * 16) +1 ) +".mp3","media_audio2");
						}, 400);
						setTimeout(function () {
							play_sound(WordAudio, "media_audio");
						}, 3500);
					}
				}
			}
		});

	}, 100);
});
