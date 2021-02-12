let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let disableUnlockBoard = false;

var LessonRowCount = 0;
var LessonProgress = 0;
var CardsOpen = true;
var BuildLessonCorrectKey;
var CurrentWordCardArrayPos = 0;

var LowerCaseCard = true;

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

	if (isMatch = $("#" + firstCard).data("framework") === $("#" + secondCard).data("framework")) {
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
		// play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 10) + 1) + ".mp3", "media_audio2");
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

		AllCardsOpen = true;
		$(".front-face").each(function () {
			if (!$(this).hasClass("LowOpacity")) {
				AllCardsOpen = false;
			}
		});

		if (AllCardsOpen) {
			LessonRowCount++;
			GuessPictureCount = 0;
			LowerCaseCard = (Math.random() * 100 > 30);
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
	var LessonLetters = "ELKAİNOMUTÜYÖRIDSBZÇGŞCPHVFJ";
	LessonLetters = LessonLetters.toLocaleLowerCase('tr-TR');

	var WordList = "";

	for (var iii = 0; iii < CardCount; iii++) {

		var CardAdded = false;
		while (!CardAdded) {

			var RandomLetterPos = Math.floor(Math.random() * LessonLetters.length);
			BuildLessonCorrectKey = LessonLetters[RandomLetterPos];

			for (var ii = 0; ii < AlfaWords.length; ii++) {
				var WordX = AlfaWords[ii].word.toLocaleUpperCase('tr-TR');
				if (LowerCaseCard) {
					WordX = capitalize(AlfaWords[ii].word);
				}

				if (WordX.charAt(0) === BuildLessonCorrectKey && (Math.random() * 100 > 95) && (WordList.indexOf(WordX) === -1)) {
					WordList += WordX + ",";
					console.log(WordX);
					RandomLetterPos = ii;

					WordAudio = "poster://audio/" + LessonLanguage + "/" + AlfaWords[ii].audio;

					var Card1FrontSide = "<img class=\"front-face\" src=\"poster://pictures/" + AlfaWords[ii].image + "\" alt=\"" + WordX + "\" />";

					var Card1OtherSide = "<img class=\"back-face\" src=\"card.png\"  />";
					var Card2OtherSide = "<img class=\"back-face\" src=\"card.png\"  />";

					if (CardsOpen) {

						Card1FrontSide = "<img class=\"front-face\" src=\"poster://pictures/" + AlfaWords[ii].image + "\" alt=\"" + WordX + "\"  />";

						Card1OtherSide = "<img class=\"back-face\" src=\"poster://pictures/" + AlfaWords[ii].image + "\" alt=\"" + WordX + "\" /><div class='back-face' style='position: absolute; left:0px; right:0px; height:100%; width:100%; background-color: black;  opacity: 0.6;'></div>";

						Card2OtherSide = "<div class=\"back-face\" style='font-size: 35px; text-align: center; padding-top: 20px; background-color: " + getRandomColor() + "; color:white;  text-shadow: 2px 2px #000000;'>" + WordX + "</div>";
					}

					CardID++;
					HtmlString = HtmlString + "\
      <div class=\"memory-card " + ColWidth + " \" data-audio='" + WordAudio + "' data-framework=\"" + WordX + "\" ID='card_" + CardID + "'>" + Card1FrontSide + "\
          " + Card1OtherSide + "\
          </div>\
          ";

					CardID++;
					HtmlString = HtmlString + "\
      <div class=\"memory-card " + ColWidth + " \" data-audio='" + WordAudio + "' data-framework=\"" + WordX + "\" ID='card_" + CardID + "'>\
          <div class=\"front-face\" style='font-size: 35px; text-align: center; padding-top: 20px; background-color: white;'>" + AlfaWords[ii].word + "</div>" + Card2OtherSide + "\
          </div>\
          ";

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

	var WordList = "";

	var WordX = AlfaWords[CurrentWordCardArrayPos].word.toLocaleUpperCase('tr-TR');
	if (LowerCaseCard) {
		WordX = capitalize(AlfaWords[CurrentWordCardArrayPos].word);
	}

	CurrentWordCardArrayPos++;
	GuessPictureCorrectWordAudio = "poster://audio/" + LessonLanguage + "/" + AlfaWords[CurrentWordCardArrayPos].audio;

	$("#CorrectWordContainer").html("<img src=\"poster://pictures/" + AlfaWords[CurrentWordCardArrayPos].image + "\" alt=\"" + AlfaWords[CurrentWordCardArrayPos].word + "\" style='max-width:400px;  display: block; margin-left: auto; margin-right: auto;' />");

	play_sound(GuessPictureCorrectWordAudio, "media_audio", false);

	$("#WordContainer").html("");

	if (LessonLanguage === "ch") {

		WordX = "<div style='display:inline-block; font-size:60px; vertical-align: top; font-family: hanwangmingboldregular'>" + AlfaWords[CurrentWordCardArrayPos].word + "</div>";

		if (1 === 2) {
			var bopomofo = AlfaWords[CurrentWordCardArrayPos].bopomofo;
			var word_ch = AlfaWords[CurrentWordCardArrayPos].word;
			var bopo_list = bopomofo.split(" ");

			var NewWord = "<div>";
			for (let i = 0; i < word_ch.length; i++) {
				NewWord += "<div style='display:inline-block; font-size:60px; vertical-align: top;'>" + word_ch[i] + "</div>";
				NewWord += "<div style='display:inline-block; font-size:20px; vertical-align: top; margin-top:12px; text-align: left;'>";

				var bopo_new = bopo_list[i];
				for (let j = 0; j < bopo_new.length; j++) {
					if (bopo_new[j] === "ˋ" || bopo_new[j] === "ˊ" || bopo_new[j] === "ˇ" || bopo_new[j] === "˙" || (j == 0)) {
					}
					else {
						NewWord += "<br>";
					}
					NewWord += bopo_new[j];
				}
				NewWord += "</div>";
			}

			WordX = NewWord;// + "<br><span style='font-size:20px;'>" + AlfaWords[CurrentWordCardArrayPos].bopomofo + "</span>";
			WordX = "<span style=\"font-family: 'hanwangmingboldregular'; \">" + AlfaWords[CurrentWordCardArrayPos].word + "</span>";
		}
	}
	else {
		var WordX = AlfaWords[CurrentWordCardArrayPos].word.toLocaleUpperCase('tr-TR');
		if (LowerCaseCard) {
			WordX = capitalize(AlfaWords[CurrentWordCardArrayPos].word);
		}
	}

	$("#WordContainer").append("<div class='word_card' data-correct='yes' data-word_audio='" + "poster://audio/" + LessonLanguage + "/" + AlfaWords[CurrentWordCardArrayPos].audio + "'>" + WordX + "</div>");

	var WordList = AlfaWords[CurrentWordCardArrayPos].word + ",";

	var RandomWordChoices = 0;
	for (var iii = 0; iii < 1000; iii++) {
		var ii = Math.round(Math.random() * AlfaWords.length);
		if (ii > 0) {
			ii--;
		}

		var WordX = AlfaWords[ii].word;

		if ((Math.random() * 100 > 95 && RandomWordChoices < 3 && (WordList.indexOf(WordX) === -1))) {

			WordList += WordX + ",";

			if (LessonLanguage === "ch") {
				WordX = "<div style='display:inline-block; font-size:60px; vertical-align: top; font-family: hanwangmingboldregular'>" + AlfaWords[ii].word + "</div>";

				if (1 === 2) {
					if (AlfaWords[ii].bopomofo === null || AlfaWords[ii].bopomofo === "") {
						WordX = "<div style='display:inline-block; font-size:60px; vertical-align: top;'>" + AlfaWords[ii].word + "</div>";
					}
					else {

						var bopomofo = AlfaWords[ii].bopomofo;
						var word_ch = AlfaWords[ii].word;
						var bopo_list = bopomofo.split(" ");

						var NewWord = "<div>";
						for (let i = 0; i < word_ch.length; i++) {
							NewWord += "<div style='display:inline-block; font-size:60px; vertical-align: top;'>" + word_ch[i] + "</div>";
							NewWord += "<div style='display:inline-block; font-size:20px; vertical-align: top; margin-top:12px; text-align: left;'>";

							var bopo_new = bopo_list[i];
							for (let j = 0; j < bopo_new.length; j++) {
								if (bopo_new[j] === "ˋ" || bopo_new[j] === "ˊ" || bopo_new[j] === "ˇ" || bopo_new[j] === "˙" || (j == 0)) {
								}
								else {
									NewWord += "<br>";
								}
								NewWord += bopo_new[j];
							}
							NewWord += "</div>";
						}

						WordX = NewWord;// + "<br><span style='font-size:20px;'>" + AlfaWords[CurrentWordCardArrayPos].bopomofo + "</span>";

						// WordX = AlfaWords[ii].word + "<br><span style='font-size:20px;'>" + AlfaWords[ii].bopomofo + "</span>";
					}
				}
			}
			else {
				var WordX = AlfaWords[ii].word.toLocaleUpperCase('tr-TR');
				if (LowerCaseCard) {
					WordX = capitalize(AlfaWords[ii].word);
				}
			}

			RandomWordChoices++;
			$("#WordContainer").append("<div class='word_card' data-correct='no'  data-word_audio='" + "poster://audio/" + LessonLanguage + "/" + AlfaWords[ii].audio + "'>" + WordX + "</div>");
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

							if (GuessPictureCount > 999) {
								CreateMemoryLessonBoard(LessonRowCount);
								GuessPictureCount = 0;
							}
							else {
								LowerCaseCard = (Math.random() * 100 > 30);
								CreateWordBoard();
							}

						}, 3000);
					}
					else {
						play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 10) + 1) + ".mp3", "media_audio2", false);

						setTimeout(function () {
							if (GuessPictureCount > 999) {
								CreateMemoryLessonBoard(LessonRowCount);
								GuessPictureCount = 0;
							}
							else {
								LowerCaseCard = (Math.random() * 100 > 30);
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

function InitLesson() {
	shuffleArray(AlfaWords);

	ScreenLessonType = 2;
	if (ScreenLessonType === 2) {
		if (LessonRowCount === 0) {
			LessonRowCount = 1;
		}
		LowerCaseCard = (Math.random() * 100 > 30);
		CreateWordBoard();
	}


	if (ScreenLessonType === 1) {
		LessonRowCount++;
		CreateMemoryLessonBoard(LessonRowCount);
	}

}

$(document).ready(function () {
	LessonParameters = window.sendSyncCmd('get-lesson-parameters', '');

	LessonLength =  parseInt(LessonParameters["word_count"], 10);
	LessonLanguage = LessonParameters["language"];
	LessonCategory = LessonParameters["category"];

	AllWordsData = JSON.parse(window.sendSyncCmd('get-all-words', ''));

	while (AlfaWords.length<(LessonLength+1)) {
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
				if (AlfaWords.length>=(LessonLength+1)) {
					break;
				}
			}
		}
	}

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
		if (GuessPictureCount > 999) {
			CreateMemoryLessonBoard(LessonRowCount);
			GuessPictureCount = 0;
		}
		else {
			LowerCaseCard = (Math.random() * 100 > 30);
			CreateWordBoard();
		}
	});

	$("#reset_lesson").on('click', function () {
		if (ScreenLessonType === 1) {
			CreateMemoryLessonBoard(LessonRowCount);
		}
		if (ScreenLessonType === 2) {
			GuessPictureCount--;
			LowerCaseCard = (Math.random() * 100 > 30);
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

