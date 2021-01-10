var fan_animations = [];
var CorrectKey = "";
var fan_1_anime = 1;
var StartAnimation = false;
var MaxFans = 3;

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
	let key_string = "ㄅㄉㄓㄚㄞㄢㄦㄆㄊㄍㄐㄔㄗㄧㄛㄟㄣㄇㄋㄎㄑㄕㄘㄨㄜㄠㄤㄈㄌㄏㄒㄖㄙㄩㄝㄡㄥ1234567890";
	$.ajax({
		//url: "/surface_cmd?cmd=keyboard_keys&keys=" + key_string,
		url: "/surface_cmd?cmd=keyboard_keys&keys=all",
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

	setInterval(function () {

		$.ajax({
			url: "/surface_cmd?cmd=what_key",
			method: 'get',
			success: function (data) {
				console.log(data);
				if (data.key !== "") {
					CountX++;
					if (CountX>20) {
						CountX=0;
						$("#animation_view").html("");
					}
					$("#animation_view").append( "<span style='color:"+ getRandomColor() + "; font-size: "+(Math.floor(Math.random() * 50)+75)+"px;'>" + data.key.toUpperCase() + "</span> " );
					play_sound("../audio/correct-sound/switch_1.mp3");
              // play_sound("../audio/wrong-sound/wrong-answer-short-buzzer-double-01.mp3");
				}
			}
		});

	}, 100);
});
