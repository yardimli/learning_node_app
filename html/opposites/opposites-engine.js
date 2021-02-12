var LessonProgress = 0;
var BuildLessonCorrectKey;
var CurrentWordCardArrayPos = 0;
var PictureHintTimeout;

var LowerCaseCard = true;

var GuessPictureSpellingLesson = false;
var GuessPictureSpellingCorrect = false;
var GuessPictureCount = 0;
var GuessPictureCorrectWordAudio = "";
var GuessPictureSpellingFirstPlay = false;
var GuessSelectedPicture;
var GuessPictureFirstCorrect = "";
var media_audio_playing = false;
var media_audio2_playing = false;

var AllWordsData;
var AlfaWords = [];

var LessonCategories;
var LessonLanguage;
var LessonParameters;
var LessonLength;

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function capitalize(s) {
	if (typeof s !== 'string') return '';
	s = s.toLocaleLowerCase('tr-TR');

	if (Math.random() * 100 > 65) {
		return s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);
	}
	else {
		return s;
	}
}

$.fn.shuffleChildren = function () {
	$.each(this.get(), function (index, el) {
		var $el = $(el);
		var $find = $el.children();

		$find.sort(function () {
			return 0.5 - Math.random();
		});

		$el.empty();
		$find.appendTo($el);
	});
};


function CreateWordBoard() {
	$("#WordContainer").show();
	$("#CorrectWordContainer").show();
	play_sound("", "media_audio2", true);

	GuessPictureCount++;

	GuessPictureSpellingLesson = true;
	GuessPictureSpellingFirstPlay = true;
	GuessPictureFirstCorrect = "";

	var WordList = "";

	var WordX = AlfaWords[CurrentWordCardArrayPos].word1.toLocaleUpperCase('tr-TR');
	if (LowerCaseCard) {
		WordX = capitalize(AlfaWords[CurrentWordCardArrayPos].word1);
	}

	CurrentWordCardArrayPos++;
	GuessPictureCorrectWordAudio = "../../audio/opposites/" + LessonLanguage + "/" + AlfaWords[CurrentWordCardArrayPos].question_audio;


	if (LessonLanguage === "ch") {
		$("#CorrectWordContainer").html("<div style='font-size: 50px; color:white; font-weight: bold; text-align: center; font-family: hanwangmingboldregular;'>" + AlfaWords[CurrentWordCardArrayPos].question + "</div>");
	}
	else {
		$("#CorrectWordContainer").html("<div style='font-size: 50px; color:white; font-weight: bold; text-align: center'>" + AlfaWords[CurrentWordCardArrayPos].question + "</div>");
	}

	play_sound(GuessPictureCorrectWordAudio, "media_audio", false);

	$("#WordContainer").html("");


	$("#WordContainer").append("<div class='word_card' data-correct='yes' data-word_audio='" + "../../audio/opposites/" + LessonLanguage + "/" + AlfaWords[CurrentWordCardArrayPos].audio1 + "' style='margin-left: 50px; margin-right: 50px;'>" + "<div style='font-size: 50px; color:black; font-weight: bold; text-align: center;' class='Opacity0 picture-hints'>" + AlfaWords[CurrentWordCardArrayPos].word1 + "</div>" + "<img src=\"../../pictures/opposites/" + AlfaWords[CurrentWordCardArrayPos].image1 + "\" alt=\"" + AlfaWords[CurrentWordCardArrayPos].word1 + "\" style='max-width:350px;' /></div>");


	$("#WordContainer").append("<div class='word_card' data-correct='no' data-word_audio='" + "../../audio/opposites/" + LessonLanguage + "/" + AlfaWords[CurrentWordCardArrayPos].audio2 + "' style='margin-left: 50px; margin-right: 50px;'>" + "<div style='font-size: 50px; color:black; font-weight: bold; text-align: center;' class='Opacity0 picture-hints'>" + AlfaWords[CurrentWordCardArrayPos].word2 + "</div>" + "<img src=\"../../pictures/opposites/" + AlfaWords[CurrentWordCardArrayPos].image2 + "\" alt=\"" + AlfaWords[CurrentWordCardArrayPos].word2 + "\" style='max-width:350px; ' /></div>");

	var WordX = AlfaWords[CurrentWordCardArrayPos].word1.toLocaleUpperCase('tr-TR');
	if (LowerCaseCard) {
		WordX = capitalize(AlfaWords[CurrentWordCardArrayPos].word1);
	}

	clearTimeout(PictureHintTimeout);
	PictureHintTimeout = setTimeout(function () {
		$(".picture-hints").addClass("Opacity1");
	}, 9000);

	$("#WordContainer").shuffleChildren();
	$(".word_card").hide();

	$(".word_card").off().on('click touchstart', function () {
		if (!media_audio_playing && !media_audio2_playing) {
			$(".word_card").addClass("LowOpacity");
			$(this).removeClass("LowOpacity");
			$(this).addClass("word_card-active");
			play_sound($(this).data("word_audio"), "media_audio", false);

			GuessPictureSpellingCorrect = $(this).data("correct") === "yes";
			if (GuessPictureSpellingCorrect) {
				$(".picture-hints").addClass("Opacity1");
			}
			if (GuessPictureFirstCorrect === "") {
				GuessPictureFirstCorrect = GuessPictureSpellingCorrect;
			}
			GuessSelectedPicture = this;
		}
	});
}


//---------------------------------------------------------------

function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}


function shuffleArray(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function play_sound(mp3, playerid, pause_play) {
	var AudioSrc = mp3;
	let promise;

	if (pause_play) {
		console.log("______________ STOP AUDIO " + playerid);
		if (playerid === "media_audio") {
			media_audio_playing = false;
		}

		if (playerid === "media_audio2") {
			media_audio2_playing = false;
		}

		//pause/stop audio
		try {
			promise = document.querySelector("#" + playerid).pause();

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
	}
	else {
		console.log("try to play: " + AudioSrc);

		$("#" + playerid + "_source").attr("src", AudioSrc);

		if (playerid === "media_audio") {
			media_audio_playing = true;
		}

		if (playerid === "media_audio2") {
			media_audio2_playing = true;
		}


		try {
			$("#" + playerid)[0].load();//suspends and restores all audio element
		} catch (e) {
			if (playerid === "media_audio") {
				media_audio_playing = false;
			}

			if (playerid === "media_audio2") {
				media_audio2_playing = false;
			}
			console.log("Error playing audio (1) " + AudioSrc);
		}

		//pause/stop audio
		try {
			promise = document.querySelector("#" + playerid).pause();

			if (promise !== undefined) {
				promise.then(function (_) {
					console.log("audio paused!");
					if (playerid === "media_audio") {
						media_audio_playing = false;
					}

					if (playerid === "media_audio2") {
						media_audio2_playing = false;
					}

				}).catch(function (error) {
					console.log("pause was prevented!");
					console.log(error);
					if (playerid === "media_audio") {
						media_audio_playing = false;
					}

					if (playerid === "media_audio2") {
						media_audio2_playing = false;
					}
				});
			}
		} catch (e) {
			console.log("Error pausing media (6) ");
			if (playerid === "media_audio") {
				media_audio_playing = false;
			}

			if (playerid === "media_audio2") {
				media_audio2_playing = false;
			}
		}


		//play
		try {
			promise = document.querySelector("#" + playerid).play();

			document.querySelector("#" + playerid).removeEventListener('ended', _listener, true);
			document.querySelector("#" + playerid).addEventListener("ended", _listener, true);

			if (promise !== undefined) {
				promise.then(function (_) {
					console.log(" autoplay started!");
				}).catch(function (error) {
					console.log(" autoplay was prevented!");
					console.log(error);
					if (playerid === "media_audio") {
						media_audio_playing = false;
					}

					if (playerid === "media_audio2") {
						media_audio2_playing = false;
					}
				});
			}
		} catch (e) {
			console.log("Error playing media (5) " + playerid);
			if (playerid === "media_audio") {
				media_audio_playing = false;
			}

			if (playerid === "media_audio2") {
				media_audio2_playing = false;
			}
		}
	}
}

var _listener = function (playerid) {

	if (playerid.target.id === "media_audio") {
		media_audio_playing = false;
	}

	if (playerid.target.id === "media_audio2") {
		media_audio2_playing = false;
	}


	if (playerid.target.id === "media_audio") {
		if (GuessPictureSpellingLesson) {
			if (GuessPictureSpellingFirstPlay) {
				$(".word_card").fadeIn();
				GuessPictureSpellingFirstPlay = false;
			}
			else {

				if (GuessPictureSpellingCorrect) {

					GuessPictureSpellingCorrect = false;

					LessonProgress++;
					$("#progress_bar_box").css({"width": ((LessonProgress / (LessonLength)) * 100) + "%"});

					if (GuessPictureFirstCorrect) {

						play_sound("../../audio/correct-sound/clap_2.mp3", "media_audio2", false);

						setTimeout(function () {
							// play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 10) + 1) + ".mp3", "media_audio2");

							$("#ballons").show();
							$("#ballons").addClass("balloons_hide");

						}, 400);

						setTimeout(function () {
							$("#ballons").hide();

							LowerCaseCard = (Math.random() * 100 > 30);
							CreateWordBoard();

						}, 3000);
					}
					else {
						play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 10) + 1) + ".mp3", "media_audio2", false);

						setTimeout(function () {
							LowerCaseCard = (Math.random() * 100 > 30);
							CreateWordBoard();

						}, 1200);
					}
				}
				else {
					$("#CorrectWordContainer").fadeOut();
					play_sound("../../audio/wrong-sound/yanlis-15.mp3", "media_audio2", false);
					setTimeout(function () {
						play_sound(GuessPictureCorrectWordAudio, "media_audio2", false);
						$("#CorrectWordContainer").fadeIn();
					}, 1000);
					setTimeout(function () {
						$(".word_card").removeClass("LowOpacity");
						$(".word_card").removeClass("word_card-active");
						$(GuessSelectedPicture).css('opacity', 0.1);
					}, 1400);
				}
			}
		}
	}
};


function InitLesson() {
	shuffleArray(AlfaWords);
	LowerCaseCard = (Math.random() * 100 > 30);
	CreateWordBoard();
}

$(document).ready(function () {
	LessonParameters = window.sendSyncCmd('get-lesson-parameters', '');
	console.log(LessonParameters);
	LessonLanguage = LessonParameters["language"];

	AllWordsData = JSON.parse(window.sendSyncCmd('get-all-opposites', ''));

	for (var i = 0; i < AllWordsData.length; i++) {
		if (AllWordsData[i].Turkish1 !== "" && AllWordsData[i].Turkish1 !== null && AllWordsData[i].Turkish2 !== "" && AllWordsData[i].Turkish2 !== null && LessonLanguage === "tr") {
			AlfaWords.push({
				"correct_word": AllWordsData[i].Turkish1,
				"question": "Hangisi " + AllWordsData[i].Turkish1 + "?", "question_audio": "opposite_" + AllWordsData[i].ID + "_1_q_tr.mp3",
				"word1": AllWordsData[i].Turkish1, "image1": AllWordsData[i].Picture1, "audio1": "opposite_" + AllWordsData[i].ID + "_1_tr.mp3",
				"word2": AllWordsData[i].Turkish2, "image2": AllWordsData[i].Picture2, "audio2": "opposite_" + AllWordsData[i].ID + "_2_tr.mp3"
			});


			AlfaWords.push({
				"correct_word": AllWordsData[i].Turkish2,
				"question": "Hangisi " + AllWordsData[i].Turkish2 + "?", "question_audio": "opposite_" + AllWordsData[i].ID + "_2_q_tr.mp3",
				"word1": AllWordsData[i].Turkish2, "image1": AllWordsData[i].Picture2, "audio1": "opposite_" + AllWordsData[i].ID + "_2_tr.mp3",
				"word2": AllWordsData[i].Turkish1, "image2": AllWordsData[i].Picture1, "audio2": "opposite_" + AllWordsData[i].ID + "_1_tr.mp3"
			});
		}

		if (AllWordsData[i].English1 !== "" && AllWordsData[i].English1 !== null && AllWordsData[i].English2 !== "" && AllWordsData[i].English2 !== null && LessonLanguage === "en") {
			AlfaWords.push({
				"correct_word": AllWordsData[i].English1,
				"question": "Which on is " + AllWordsData[i].English1 + "?", "question_audio": "opposite_" + AllWordsData[i].ID + "_1_q_en.mp3",
				"word1": AllWordsData[i].English1, "image1": AllWordsData[i].Picture1, "audio1": "opposite_" + AllWordsData[i].ID + "_1_en.mp3",
				"word2": AllWordsData[i].English2, "image2": AllWordsData[i].Picture2, "audio2": "opposite_" + AllWordsData[i].ID + "_2_en.mp3"
			});


			AlfaWords.push({
				"correct_word": AllWordsData[i].English2,
				"question": "Which on is " + AllWordsData[i].English2 + "?", "question_audio": "opposite_" + AllWordsData[i].ID + "_2_q_en.mp3",
				"word1": AllWordsData[i].English2, "image1": AllWordsData[i].Picture2, "audio1": "opposite_" + AllWordsData[i].ID + "_2_en.mp3",
				"word2": AllWordsData[i].English1, "image2": AllWordsData[i].Picture1, "audio2": "opposite_" + AllWordsData[i].ID + "_1_en.mp3"
			});
		}

		if (AllWordsData[i].Chinese1 !== "" && AllWordsData[i].Chinese1 !== null && AllWordsData[i].Chinese2 !== "" && AllWordsData[i].Chinese2 !== null && LessonLanguage === "ch") {
			AlfaWords.push({
				"correct_word": AllWordsData[i].Chinese1,
				"question": AllWordsData[i].Question1_CH, "question_audio": "opposite_" + AllWordsData[i].ID + "_1_q_ch.mp3",
				"word1": AllWordsData[i].Chinese1, "image1": AllWordsData[i].Picture1, "audio1": "opposite_" + AllWordsData[i].ID + "_1_ch.mp3",
				"word2": AllWordsData[i].Chinese2, "image2": AllWordsData[i].Picture2, "audio2": "opposite_" + AllWordsData[i].ID + "_2_ch.mp3"
			});


			AlfaWords.push({
				"correct_word": AllWordsData[i].Chinese2,
				"question": AllWordsData[i].Question2_CH, "question_audio": "opposite_" + AllWordsData[i].ID + "_2_q_ch.mp3",
				"word1": AllWordsData[i].Chinese2, "image1": AllWordsData[i].Picture2, "audio1": "opposite_" + AllWordsData[i].ID + "_2_ch.mp3",
				"word2": AllWordsData[i].Chinese1, "image2": AllWordsData[i].Picture1, "audio2": "opposite_" + AllWordsData[i].ID + "_1_ch.mp3"
			});
		}
	}
	LessonLength = (AlfaWords.length + 1);

	InitLesson();


	$(document).on("contextmenu", function (e) {
		return false;
	});

	$(window).bind(
		'touchmove',
		function (e) {
			e.preventDefault();
		}
	);

	$("#skip_lesson").on('click', function () {
		LowerCaseCard = (Math.random() * 100 > 30);
		CreateWordBoard();
	});

	$("#reset_lesson").on('click', function () {
		GuessPictureCount--;
		LowerCaseCard = (Math.random() * 100 > 30);
		CreateWordBoard();
	});

	if (1 === 2) {
		$("#full_screen_dialog").modal("show");

		$("#make_full_screen").on("click touchstart", function () {

			$("#full_screen_dialog").modal("hide");
			var
				el = document.documentElement
				, rfs =
				el.requestFullScreen
				|| el.webkitRequestFullScreen
				|| el.mozRequestFullScreen
			;
			rfs.call(el);
		});
	}

	$("#ballons").hide();


});

/*
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi ne yapıyor?","kedi_kutudan_uzaklasiyor.png","kedi kutudan uzaklaşıyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi nerede?","kedi_kutunun_altinda.png","kedi kutunun altında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi nerede?","kedi_kutunun_arasinda.png","kedi kutunun arasında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi nerede?","kedi_kutunun_arkasinda.png","kedi kutunun arkasında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi ne yapıyor?","kedi_kutunun_asagi_atliyor.png","kedi kutudan aşagı atlıyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi ne yapıyor?","kedi_kutunun_cevresinde_yuruyor.png","kedi kutunun çevresinde yürüyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi nerede?","kedi_kutunun_icinde.png","kedi kutunun içinde");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi ne yapıyor?","kedi_kutunun_icinden_geciyor.png","kedi kutunun içinden geçiyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi ne yapıyor?","kedi_kutunun_icine_giriyor.png","kedi kutunun içine giriyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi nerede?","kedi_kutunun_onunde.png","kedi kutunun önünde");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi ne yapıyor?","kedi_kutunun_onunden_kosuyor.png","kedi kutunun önünden koşuyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi ne yapıyor?","kedi_kutunun_onunden_yuruyor.png","kedi kutuların önünden duruyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi nerede?","kedi_kutunun_ustunde.png","kedi kutunun üstünde");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi nerede?","kedi_kutunun_ustunde2.png","kedi kapalı kutunun üstünden atlıyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi ne yapıyor?","kedi_kutunun_ustunden_atliyor.png","kedi açık kutunun üstünden atlıyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi nerede?","kedi_kutunun_yakininda.png","kedi kutunun yanında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi ne yapıyor?","kedi_kutunun_yukari_atliyor.png","kedi kutunun üstüne atlıyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi ne yapıyor?","kedi_kutuya_dogru_gidiyor.png","kedi kutuya doğru gidiyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Kedi ne yapıyor?","kedi_kutudan_cikiyor.png","kedi kutudan çıkıyor
");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Ayı nerede?","ayi_kutunun_altinda.png","ayı kutunun altında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Ayı nerede?","ayi_kutunun_arasinda.png","ayı kutuların arasında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Ayı nerede?","ayi_kutunun_arkasinda.png","ayı kutunun arkasında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Ayı nerede?","ayi_kutunun_icinde.png","ayı kutunun içinde");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Ayı nerede?","ayi_kutunun_onunde.png","ayı kutunun önünde");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Ayı nerede?","ayi_kutunun_ustunde2.png","ayı kutunun üstünde");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Ayı nerede?","ayi_kutunun_yaninda.png","ayı kutunun yanında
");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_kutunun_altinda.png","çocuk kutunun altında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_kutunun_arasinda.png","çocuk kutuların arasında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_kutunun_arkasinda.png","çocuk kutunun arkasında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_kutunun_icinde.png","çocuk kutunun içinde");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk ne yapıyor?","cocuk_kutunun_icinden_geciyor.png","çocuk kutunun içinden geçiyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_kutunun_orada.png","çocuk kutunun yanında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_kutunun_ortasinda.png","çocuk kutuların ortasında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_kutunun_saginda.png","çocuk kutunun sağında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_kutunun_solunda.png","çocuk kutunun solunda");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_kutunun_yaninda.png","çocuk kutunun yanında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_topun_altinda.png","çocuk topun altında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_topun_arasinda.png","çocuk topların arasında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_topun_arkasinda.png","çocuk topun arkasında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_topun_onunda.png","çocuk topun önünda");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_topun_ustunde.png","çocuk topun üstünde");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Çocuk nerede?","cocuk_topun_yaninda.png","çocuk topun yanında
");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Köpek Nerede?","kopek_evin_altinda.png","köpek evin altında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Köpek Nerede?","kopek_evin_arasinda.png","köpek evlerin arasında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Köpek Nerede?","kopek_evin_arkasinda.png","köpek evin arkasında");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Köpek Nerede?","kopek_evin_icinde.png","köpek evin içinde");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Köpek Nerede?","kopek_evin_onunde.png","köpek evin önünde");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Köpek Nerede?","kopek_evin_ustunde.png","köpek evin üstünde");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Köpek Nerede?","kopek_evin_yakininda.png","köpek evin yanında
");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_arasindan_geciyor.png","dinazor halkanın içinden geçiyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_cevresinde_donuyor.png","dinazor borunun çevresinde dönüyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_disari_cikiyor.png","dinazor kapıdan dışarı çıkıyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_dusuyor.png","dinazor düşüyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_geliyor.png","dinazor geliyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_gidiyor.png","dinazor gidiyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_icine_giriyor.png","dinazor kapıdan içeri giriyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_uzerinde_yuruyor.png","dinazor yolun üstünde yürüyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_uzerinden_atliyor.png","dinazor çitin üzerinden atlıyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_uzerinden_yuruyor.png","dinazor ipin üzerinde yürüyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_yanindan_geciyor.png","dinazor duvarın yanından geçiyor");
Insert INTO prepositions (QuestionTR,Image,AnswerTR) VALUES ("Dinazor ne yapıyor?","dinazor_yukari_cikiyor.png","dinazor merdivenlerden yukarı çıkıyor");















 */