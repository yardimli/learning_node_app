let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let disableUnlockBoard = false;

var LessonRowCount = 0;
var LessonProgress = 0;
var LessonLength = 0;
var CardsOpen = true;

let ScreenLessonType = 1;

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


var LessonParameters;
var LessonLength;
var LessonLanguage;
var LessonCategory;


function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function flipCard(xCard) {
	if (lockBoard) return;
	if (xCard === firstCard) return;

	lockBoard = true;

	play_sound($("#" + xCard).data("audio"), "media_audio", false);

	$("#" + xCard).addClass('flip');

	if (!hasFlippedCard) {
		// first click
		hasFlippedCard = true;
		firstCard = xCard;
		return;
	}

	// second click
	secondCard = xCard;

	if ($("#" + firstCard).data("framework") === $("#" + secondCard).data("framework")) {
		disableUnlockBoard = true;
		disableCards();
	}
	else {
		unflipCards();
	}
}

function disableCards() {
	$("#" + firstCard).off('click touchstart').off('click touchstart');
	$("#" + secondCard).off('click touchstart').off('click touchstart');

	LessonProgress++;
	$("#progress_bar_box").css({"width": ((LessonProgress / (LessonLength)) * 100) + "%"});

	play_sound("../../audio/correct-sound/clap_2.mp3", "media_audio2", false);

	setTimeout(function () {
		// play_sound("../audio/correct-sound/bravo-" + Math.floor((Math.random() * 10) + 1) + ".mp3", "media_audio2");
		$("#ballons").show();
		$("#ballons").addClass("balloons_hide");
	}, 400);

	setTimeout(function () {
		play_sound("", "media_audio2", true);
		$("#ballons").hide();
		$("#" + firstCard).find(".front-face").addClass("LowOpacity");
		$("#" + secondCard).find(".front-face").addClass("LowOpacity");
		resetBoard();
		lockBoard = false;
		disableUnlockBoard = false;

		var AllCardsOpen = true;
		$(".front-face").each(function () {
			if (!$(this).hasClass("LowOpacity")) {
				AllCardsOpen = false;
			}
		});

		if (AllCardsOpen) {
			LessonRowCount++;
			GuessPictureCount = 0;
			CreateWordBoard();
		}
	}, 3000);
}

function unflipCards() {
	setTimeout(() => {
		play_sound("../../audio/wrong-sound/yanlis-15.mp3", "media_audio2", false);
	}, 1000);

	setTimeout(() => {
		$("#" + firstCard).removeClass('flip');
		$("#" + secondCard).removeClass('flip');

		resetBoard();
		lockBoard = false;
	}, 1500);
}

function resetBoard() {
	[hasFlippedCard, lockBoard] = [false, false];
	[firstCard, secondCard] = [null, null];
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


//-----------------------------------------------------------------------
function CreateMemoryLessonBoard(RowCount) {
	$(".memory-game").html("");
	$("#GameContainer").show();
	$("#WordContainer").hide();
	$("#CorrectWordContainer").hide();

	$(".word_card").removeClass("LowOpacity");
	$(".word_card").removeClass("word_card-active");

	ScreenLessonType = 1;

	GuessPictureSpellingLesson = false;

	var ColWidth = "col-2";
	var CardCount = 3;

	if (RowCount === 1) {
		ColWidth = "col-2";
		CardCount = 6;
		CardsOpen = true;
	}

	if (RowCount === 2) {
		ColWidth = "col-2";
		CardCount = 6;
		CardsOpen = false;
	}

	if (RowCount === 3) {
		ColWidth = "col-2";
		CardCount = 6;
		CardsOpen = true;
	}

	if (RowCount === 4) {
		ColWidth = "col-2";
		CardCount = 6;
		CardsOpen = false;
	}

	if (RowCount === 5) {
		ColWidth = "col-2";
		CardCount = 9;
		CardsOpen = true;
	}

	if (RowCount === 6) {
		ColWidth = "col-2";
		CardCount = 9;
		CardsOpen = false;
	}


	var CardID = 0;
	var HtmlString = "";

	var WordList = "";

	for (var iii = 0; iii < CardCount; iii++) {

		var CardAdded = false;
		while (!CardAdded) {
			for (var ii = 0; ii < AlfaWords.length; ii++) {
				if ((Math.random() * 100 > 95) && (WordList.indexOf(AlfaWords[ii].word) === -1)) {
					WordList += AlfaWords[ii].word + ",";
					console.log(AlfaWords[ii].word +" "+AlfaWords[ii].image);

					var WordAudio = "poster://audio/" + LessonLanguage + "/" + AlfaWords[ii].audio;

					var Card1FrontSide = "<img class=\"front-face\" src=\"poster://pictures/" + AlfaWords[ii].image + "\" alt=\"" + AlfaWords[ii].word + "\" />";

					var Card1OtherSide = "<img class=\"back-face\" src=\"card.png\"  />";
					var Card2OtherSide = "<img class=\"back-face\" src=\"card.png\"  />";

					if (CardsOpen) {

						Card1FrontSide = "<img class=\"front-face\" src=\"poster://pictures/" + AlfaWords[ii].image + "\" alt=\"" + AlfaWords[ii].word + "\"  />";


						if (LessonLanguage === "ch") {
							Card1OtherSide = "<img class=\"back-face\" src=\"poster://pictures/" + AlfaWords[ii].image + "\" alt=\"" + AlfaWords[ii].word + "\" /><div class='back-face' style='position: absolute; left:0px; right:0px; height:100%; width:100%; background-color: black;  opacity: 0.6;'></div>";

							Card2OtherSide = "<div class=\"back-face\" style='font-size: 45px; text-align: center; padding-top: 20px; background-color: " + getRandomColor() + "; color:white;  text-shadow: 2px 2px #000000; font-family: hanwangmingboldregular'>" + AlfaWords[ii].word + "</div>";

						}
						else {
							Card1OtherSide = "<img class=\"back-face\" src=\"poster://pictures/" + AlfaWords[ii].image + "\" alt=\"" + AlfaWords[ii].word + "\" /><div class='back-face' style='position: absolute; left:0px; right:0px; height:100%; width:100%; background-color: black;  opacity: 0.6;'></div>";

							Card2OtherSide = "<div class=\"back-face\" style='font-size: 35px; text-align: center; padding-top: 20px; background-color: " + getRandomColor() + "; color:white;  text-shadow: 2px 2px #000000;'>" + AlfaWords[ii].word + "</div>";
						}


					}

					CardID++;
					HtmlString = HtmlString + "\
      <div class=\"memory-card " + ColWidth + " \" data-audio='" + WordAudio + "' data-framework=\"" + AlfaWords[ii].word + "\" ID='card_" + CardID + "'>" + Card1FrontSide + "\
          " + Card1OtherSide + "\
          </div>\
          ";


					if (LessonLanguage === "ch") {
						CardID++;
						HtmlString = HtmlString + "\
      <div class=\"memory-card " + ColWidth + " \" data-audio='" + WordAudio + "' data-framework=\"" + AlfaWords[ii].word + "\" ID='card_" + CardID + "'>\
          <div class=\"front-face\" style='font-size: 45px; text-align: center; padding-top: 20px; background-color: white; font-family: hanwangmingboldregular'>" + AlfaWords[ii].word + "</div>" + Card2OtherSide + "\
          </div>\
          ";

					}
					else {

						CardID++;
						HtmlString = HtmlString + "\
      <div class=\"memory-card " + ColWidth + " \" data-audio='" + WordAudio + "' data-framework=\"" + AlfaWords[ii].word + "\" ID='card_" + CardID + "'>\
          <div class=\"front-face\" style='font-size: 35px; text-align: center; padding-top: 20px; background-color: white;'>" + AlfaWords[ii].word + "</div>" + Card2OtherSide + "\
          </div>\
          ";
					}

					CardAdded = true;

					break;
				}
			}
		}


	}
	$(".memory-game").html(HtmlString);

	$("#card-container").shuffleChildren();

	$(".memory-card").on('click touchstart', function () {
		flipCard($(this).attr("id"));
	});

}

function CreateWordBoard() {
	$("#GameContainer").hide();
	$("#WordContainer").show();
	$("#CorrectWordContainer").show();
	play_sound("", "media_audio2", true);

	ScreenLessonType = 2;

	GuessPictureCount++;

	GuessPictureSpellingLesson = true;
	GuessPictureSpellingFirstPlay = true;
	GuessPictureFirstCorrect = "";

	var CorrectWord = -1;
	var CorrectImagePos = -1;
	var WordList = "";
	for (var iii = 0; iii < 1000; iii++) {
		ii = Math.round(Math.random() * AlfaWords.length);
		if ((Math.random() * 100 > 95)) {
			CorrectWord = ii;
			console.log(AlfaWords[ii].word);
			GuessPictureCorrectWordAudio = "poster://audio/" + LessonLanguage + "/" + AlfaWords[ii].audio;

			$("#CorrectWordContainer").html("<img src=\"poster://pictures/" + AlfaWords[ii].image + "\" alt=\"" + AlfaWords[CorrectWord].word + "\" style='max-width:400px;  display: block; margin-left: auto; margin-right: auto;' />");


			play_sound(GuessPictureCorrectWordAudio, "media_audio", false);

			break;

			//AlfaWords[ii].word
		}
	}

	$("#WordContainer").html("");


	if (LessonLanguage === "ch") {
		$("#WordContainer").append("<div class='word_card' data-correct='yes' data-word_audio='" + "poster://audio/" + LessonLanguage + "/" + AlfaWords[ii].audio + "' style='display:inline-block; font-size:60px; vertical-align: top; font-family: hanwangmingboldregular'>" + AlfaWords[ii].word + "</div>");

	}
	else {
		$("#WordContainer").append("<div class='word_card' data-correct='yes' data-word_audio='" + "poster://audio/" + LessonLanguage + "/" + AlfaWords[CorrectWord].audio + "'>" + AlfaWords[CorrectWord].word + "</div>");
	}

	var WordList = AlfaWords[CorrectWord].word + ",";

	var RandomWordChoices = 0;
	for (var iii = 0; iii < 1000; iii++) {
		var ii = Math.round(Math.random() * AlfaWords.length);
		if (ii > 0) {
			ii--;
		}

		if ((Math.random() * 100 > 95 && RandomWordChoices < 5 && (WordList.indexOf(AlfaWords[ii].word) === -1))) {
			RandomWordChoices++;
			console.log(AlfaWords[ii].word);

			if (LessonLanguage === "ch") {
				$("#WordContainer").append("<div class='word_card' data-correct='no'  data-word_audio='" + "poster://audio/" + LessonLanguage + "/" + AlfaWords[ii].audio + "' style='display:inline-block; font-size:60px; vertical-align: top; font-family: hanwangmingboldregular'>" + AlfaWords[ii].word + "</div>");

			}
			else {

				$("#WordContainer").append("<div class='word_card' data-correct='no'  data-word_audio='" + "poster://audio/" + LessonLanguage + "/" + AlfaWords[ii].audio + "'>" + AlfaWords[ii].word + "</div>");
			}
			WordList += AlfaWords[ii].word + ",";

		}
	}

	$("#WordContainer").shuffleChildren();

	$(".word_card").hide();


	$(".word_card").off().on('click touchstart', function () {

		if (!media_audio_playing && !media_audio2_playing) {

			$(".word_card").addClass("LowOpacity");
			$(this).removeClass("LowOpacity");
			$(this).addClass("word_card-active");
			play_sound($(this).data("word_audio"), "media_audio", false);

			GuessPictureSpellingCorrect = $(this).data("correct") === "yes";
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


var _listener = function (playerid) {

	if (playerid.target.id === "media_audio") {
		media_audio_playing = false;
	}

	if (playerid.target.id === "media_audio2") {
		media_audio2_playing = false;
	}


	if (playerid.target.id === "media_audio") {
		if (!disableUnlockBoard) {
			lockBoard = false;
			console.log("unlock board");
		}
		disableUnlockBoard = false;
		console.log("!!!!!");

		if (GuessPictureSpellingLesson) {
			if (GuessPictureSpellingFirstPlay) {
				$(".word_card").show();
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

							if (GuessPictureCount > 3) {
								CreateMemoryLessonBoard(LessonRowCount);
								GuessPictureCount = 0;
							}
							else {
								CreateWordBoard();
							}

						}, 3000);
					}
					else {
						play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 10) + 1) + ".mp3", "media_audio2", false);

						setTimeout(function () {
							if (GuessPictureCount > 3) {
								CreateMemoryLessonBoard(LessonRowCount);
								GuessPictureCount = 0;
							}
							else {
								CreateWordBoard();
							}

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


$(document).ready(function () {

	LessonParameters = window.sendSyncCmd('get-lesson-parameters', '');

	LessonLength =  parseInt(LessonParameters["length"], 10);
	LessonLanguage = LessonParameters["language"];
	LessonLanguage = "tr";
	LessonCategory = LessonParameters["category"];

	AllWordsData = JSON.parse(window.sendSyncCmd('get-all-words', ''));
	for (var i = 0; i < AllWordsData.length; i++) {
		if (LessonCategory.indexOf("-" + AllWordsData[i].categoryID + "-") !== -1) {
			if (AllWordsData[i].word_TR !== "" && AllWordsData[i].word_TR !== null && LessonLanguage === "tr") {
				// console.log(AllWordsData[i]);
				AlfaWords.push({"word": AllWordsData[i].word_TR, "image": AllWordsData[i].picture, "audio": AllWordsData[i].audio_TR});
			}

			if (AllWordsData[i].word_EN !== "" && AllWordsData[i].word_EN !== null && LessonLanguage === "en") {
				AlfaWords.push({"word": AllWordsData[i].word_EN, "image": AllWordsData[i].picture, "audio": AllWordsData[i].audio_EN});
			}
			if (AllWordsData[i].word_CH !== "" && AllWordsData[i].word_CH !== null && LessonLanguage === "ch") {
				// console.log(AllWordsData[i]);
				AlfaWords.push({
					"word": AllWordsData[i].word_CH,
					"pinyin": AllWordsData[i].pinyin,
					"bopomofo": AllWordsData[i].bopomofo,
					"image": AllWordsData[i].picture,
					"audio": AllWordsData[i].audio_CH
				});
			}
		}
	}

	LessonLength = 24 + 18 + 24;
	ScreenLessonType = 2;
	if (ScreenLessonType === 2) {
		if (LessonRowCount === 0) {
			LessonRowCount = 1;
		}
		CreateWordBoard();
	}


	if (ScreenLessonType === 1) {
		LessonRowCount++;
		CreateMemoryLessonBoard(LessonRowCount);
	}

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
		if (GuessPictureCount > 3) {
			CreateMemoryLessonBoard(LessonRowCount);
			GuessPictureCount = 0;
		}
		else {
			CreateWordBoard();
		}
	});

	$("#reset_lesson").on('click', function () {
		if (ScreenLessonType === 1) {
			CreateMemoryLessonBoard(LessonRowCount);
		}
		if (ScreenLessonType === 2) {
			GuessPictureCount--;
			CreateWordBoard();
		}
	});

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

	$("#ballons").hide();

});

