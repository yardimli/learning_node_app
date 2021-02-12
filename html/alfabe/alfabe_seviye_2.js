var CorrectKey = "";

var LessonProgress = -1;
var LessonInProgress = false;

var WordAudio = "";
var WordVideo = "";
var RandomLetters = "";
var KeyboardLetters = "";
var ProgressiveKeys = "";

var RandomList = [];
var LessonRealLength = -1;

var WrongCount = 0;

var Timer1, Timer2, Timer3, Timer4;

var AllWordsData;
var AllCategoriesData;
var AlfaWords = [];

var LessonParameters;
var LessonLength;
var LessonLanguage;
var LessonCategory;
var LessonRandom;
var WordHints = "yes";
var AlphabeticOrder;
var LessonLetters;
var nozoom = false;

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

function CreateLesson(GoToNextLetter, ResetKeyboard) {
	LessonInProgress = true;

	if (GoToNextLetter) {
		var WordIndex = RandomList[LessonProgress];
		var OldCorrectKey = AlfaWords[WordIndex].word.charAt(0);
		var CurrentCorrectKey = AlfaWords[WordIndex].word.charAt(0);

		while (OldCorrectKey === CurrentCorrectKey && LessonProgress < LessonRealLength) {
			LessonProgress++;
			WordIndex = RandomList[LessonProgress];
			CurrentCorrectKey = AlfaWords[WordIndex].word.charAt(0);
		}
	}
	else {
		LessonProgress++;
	}
	$("#ballons").hide();


	KeyboardLetters = LessonLetters;
	if (LessonRandom === "singleletter" || LessonRandom === "random_one" || LessonRandom === "random_two" || LessonRandom === "random_three" || LessonRandom === "random_many" || LessonRandom === "random_many_az" || LessonRandom === "random_eliminate") {
		KeyboardLetters = CorrectKey;
	}

	console.log(LessonProgress + " " + LessonRealLength);

	$("#progress_bar_box").css({"width": ((LessonProgress / LessonRealLength) * 100) + "%"});

	var WordIndex = RandomList[LessonProgress];
	CorrectKey = AlfaWords[WordIndex].word.charAt(0);
	ProgressiveKeys = ProgressiveKeys + CorrectKey;
	console.log("LESSON Correct Key: " + CorrectKey + ", Lessson Word:" + AlfaWords[WordIndex].word);

	WordAudio = "poster://audio/" + LessonLanguage + "/" + AlfaWords[WordIndex].audio;
	WordVideo = "poster://video/" + AlfaWords[WordIndex].audio.replace("mp3", "mp4");

	$("#word_image").attr("src", "poster://pictures/" + AlfaWords[WordIndex].image);


	if (WordHints) {
		$("#word_letter").html("<span style='text-shadow: 2px 2px 2px rgba(0,0,0,0.5); color:" + getRandomColor() + "; font-size: 150px; line-height: 150px;'>" + CorrectKey + "</span>");
	}

	$("#word_spelling").html('<h1 class="ml11">\
					<span class="text-wrapper">\
					<span class="line line1"></span>\
					<span id="letters_span" class="letters" style="text-shadow: 2px 2px 2px rgba(0,0,0,0.5); color:' + getRandomColor() + ';">' + AlfaWords[WordIndex].word + '</span>\
				</span>\
				</h1>');


	// Wrap every letter in a span
	var textWrapper = document.querySelector('.ml11 .letters');
	textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");

	anime.timeline({loop: false})
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
	});

	setTimeout(function () {
		$("#letters_span span:first").addClass("fadeout_letter");
	}, 3000);

	play_sound(WordAudio, "media_audio");
	play_sound(WordVideo, "media_video");

	if (ResetKeyboard) {
		RandomLetters = "";
		var RandomLetter = "ELKAİNOMUTÜYÖRIDSBZÇGŞCPHVĞFJ";


		if (LessonRandom === "random_one") {
			for (var i = 0; i < 1; i++) {
				var TempRandomLetter = RandomLetter[Math.floor(Math.random() * 29)];
				if (RandomLetters.indexOf(TempRandomLetter) === -1 && TempRandomLetter !== CorrectKey) {
					RandomLetters += TempRandomLetter;
				}
				else {
					i--;
				}
			}
		}

		if (LessonRandom === "random_two") {
			for (var i = 0; i < 2; i++) {
				var TempRandomLetter = RandomLetter[Math.floor(Math.random() * 29)];
				if (RandomLetters.indexOf(TempRandomLetter) === -1 && TempRandomLetter !== CorrectKey) {
					RandomLetters += TempRandomLetter;
				}
				else {
					i--;
				}
			}
		}

		if (LessonRandom === "random_three") {
			for (var i = 0; i < 3; i++) {
				var TempRandomLetter = RandomLetter[Math.floor(Math.random() * 29)];
				if (RandomLetters.indexOf(TempRandomLetter) === -1 && TempRandomLetter !== CorrectKey) {
					RandomLetters += TempRandomLetter;
				}
				else {
					i--;
				}
			}
		}

		if (LessonRandom === "random_many") {
			for (var i = 0; i < 6; i++) {
				var TempRandomLetter = RandomLetter[Math.floor(Math.random() * 29)];
				if (RandomLetters.indexOf(TempRandomLetter) === -1 && TempRandomLetter !== CorrectKey) {
					RandomLetters += TempRandomLetter;
				}
				else {
					i--;
				}
			}
		}

		if (LessonRandom === "random_many_az") {
			RandomLetters = RandomLetter + "QWX";
		}

		if (LessonRandom === "random_eliminate") {
			for (var i = 0; i < 6; i++) {
				var TempRandomLetter = RandomLetter[Math.floor(Math.random() * 29)];
				if (RandomLetters.indexOf(TempRandomLetter) === -1 && TempRandomLetter !== CorrectKey) {
					RandomLetters += TempRandomLetter;
				}
				else {
					i--;
				}
			}
		}

		KeyboardLetters = LessonLetters;
		if (LessonRandom === "singleletter" || LessonRandom === "random_one" || LessonRandom === "random_two" || LessonRandom === "random_three" || LessonRandom === "random_many" || LessonRandom === "random_many_az" || LessonRandom === "random_eliminate") {
			KeyboardLetters = CorrectKey;
		}

	}

	setTimeout(function () {
		init_keyboard();

		if (LessonRandom === "full") {
			update_keyboard("all", CorrectKey, 10000);
		}
		else if (LessonRandom === "full_inc") {
			update_keyboard(ProgressiveKeys, CorrectKey, 10000)
		}
		else {
			update_keyboard(KeyboardLetters + RandomLetters, CorrectKey, 90000)
		}
	}, 1000);
}

function CorrectAnswer() {
	LessonInProgress = false;

	if (WrongCount === 0) {
		play_sound("../../audio/correct-sound/clap_2.mp3", "media_audio");
	}

	$("#letters_span span:first").html(CorrectKey);
	$("#letters_span span:first").addClass("fadein_letter");

	setTimeout(function () {
		play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 10) + 1) + ".mp3", "media_audio2");
		if (WordHints) {
			$("#word_letter").removeClass("animate-flicker");
			$("#word_letter").addClass("animate-zoom");
		}
		if (WrongCount === 0) {
			$("#ballons").show();
			$("#ballons").addClass("balloons_hide");
		}
	}, 400);


	setTimeout(function () {

		if (LessonProgress >= LessonRealLength) {
			alert("lesson complete");
		}

		var GoToNextLetter = false;
		if (WrongCount === 0 && LessonLength === 99) {
			GoToNextLetter = true;
		}

		if (LessonRandom === "random_many_az") {
			GoToNextLetter = true;
		}

		WrongCount = 0;
		CreateLesson(GoToNextLetter, true);

		if (WordHints) {
			$("#word_letter").removeClass("animate-zoom");
			$("#word_letter").addClass("animate-flicker");
		}
		$("#ballons").hide();
	}, 5000);

}

function InitLesson() {
	LessonRealLength = -1;
	var BuildLessonCorrectKey = "";
	for (var iii = 0; iii < LessonLetters.length; iii++) {

//    var RandomLetterPos = Math.floor(Math.random() * LessonLetters.length);
		RandomLetterPos = iii;
		BuildLessonCorrectKey = LessonLetters[RandomLetterPos];
		console.log(BuildLessonCorrectKey + " " + LessonLetters + " " + LessonLength);

		for (var i = 0; i < LessonLength; i++) {
			var TryAgain = true;
			var BlockCPU_1 = 0;
			while (TryAgain && BlockCPU_1 < 33) {
				var RandomLetterPos = -1;
				var BlockCPU_2 = 0;
				while (RandomLetterPos === -1 && BlockCPU_2 < 33) {
					//find random word
					BlockCPU_2++;
					for (var ii = 0; ii < AlfaWords.length; ii++) {
						if (AlfaWords[ii].word.charAt(0) === BuildLessonCorrectKey && (Math.random() * 100 > 95)) {
//							console.log(i+" "+AlfaWords[ii].word);
							RandomLetterPos = ii;
							break;
						}
					}
				}

				TryAgain = false;
				if (RandomLetterPos === -1) {
					TryAgain = true;
				}
				if ((RandomList.indexOf(RandomLetterPos) !== -1)) {
					TryAgain = true;
				}
				BlockCPU_1++;
			}

			LessonRealLength++;
			RandomList[LessonRealLength] = RandomLetterPos;
		}
	}

	console.log(RandomList);
	if (!AlphabeticOrder) {
		shuffle(RandomList);
	}
	console.log(RandomList);

	CreateLesson(false, true);


}

function LoadWords() {

	AllWordsData = JSON.parse(window.sendSyncCmd('get-all-words', ''));
	console.log(AllWordsData.length);
	for (var i = 0; i < AllWordsData.length; i++) {
		if (LessonCategory.indexOf("-" + AllWordsData[i].categoryID + "-") !== -1) {
			if (AllWordsData[i].word_TR !== "" && AllWordsData[i].word_TR !== null && LessonLanguage === "tr") {
				// console.log(AllWordsData[i]);

				AlfaWords.push({"word": AllWordsData[i].word_TR.toLocaleUpperCase('tr-TR'), "image": AllWordsData[i].picture, "audio": AllWordsData[i].audio_TR});
			}

			if (AllWordsData[i].word_EN !== "" && AllWordsData[i].word_EN !== null && LessonLanguage === "en") {
				AlfaWords.push({"word": AllWordsData[i].word_EN.toLocaleUpperCase('en-US'), "image": AllWordsData[i].picture, "audio": AllWordsData[i].audio_EN});
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

	InitLesson();
}

$(document).ready(function () {
	$("#ballons").hide();

	LessonParameters = window.sendSyncCmd('get-lesson-parameters', '');

	LessonLength =  parseInt(LessonParameters["length"], 10);
	LessonLanguage = LessonParameters["language"];
	LessonLanguage = "tr";
	LessonCategory = LessonParameters["category"];

	WordHints = LessonParameters["hints"] === "yes";
	LessonRandom = LessonParameters["random"];
	LessonLetters = LessonParameters["letters"];

	AlphabeticOrder = LessonParameters["hints"] === "alpha_order";


	$.ajax({
		url: "../keyboard/mini_tr_keyboard.html",
		success: function (data, status, jqXHR) {

			var dom = $(data);

			dom.filter('script').each(function () {
				if (this.src) {
					var script = document.createElement('script'), i, attrName, attrValue, attrs = this.attributes;
					for (i = 0; i < attrs.length; i++) {
						attrName = attrs[i].name;
						attrValue = attrs[i].value;
						script[attrName] = attrValue;
					}
					document.body.appendChild(script);
				}
				else {
					$.globalEval(this.text || this.textContent || this.innerHTML || '');
				}
			});

			$("#bottom-half").html(data);
		}
	});

	nozoom = true;

	if (!WordHints) {
		$("#word_letter").hide();
	}


	LoadWords();

	document.addEventListener("virtual-keyboard-press", function (event) {
		if (event.detail.key !== "" && LessonInProgress) {

			console.log("clear timeouts");
			clearTimeout(Timer1);
			clearTimeout(Timer2);


			if (LessonRandom === "full" || LessonRandom === "full_inc") {
			}
			else {
				//turn off all keys
			}

			console.log(event.detail.key + " " + CorrectKey);
			if (event.detail.key == CorrectKey) {
				if (LessonRandom === "random_eliminate" && RandomLetters === "") {
					WrongCount = 0;
				}
				CorrectAnswer();
			}
			else {
				WrongCount++;

				$("#letters_span span:first").html(event.detail.key);
				$("#letters_span span:first").addClass("fadein_letter");

				Timer1 = setTimeout(function () {
					if (LessonRandom === "full" || LessonRandom === "full_inc") {
						play_sound("../../audio/wrong-sound/yanlis-" + Math.floor((Math.random() * 10) + 6) + ".mp3", "media_audio2");
					}
					else {
						play_sound("../../audio/wrong-sound/yanlis-" + Math.floor((Math.random() * 16) + 1) + ".mp3", "media_audio2");

					}
				}, 1500);


				if (LessonRandom === "random_many_az") {
					RandomLetters = RandomLetters.replace(event.detail.key, "");
					Timer2 = setTimeout(function () {
						CreateLesson(false, false);
					}, 4000);
				}
				else if (LessonRandom === "full" || LessonRandom === "full_inc") {


					Timer2 = setTimeout(function () {
						$("#letters_span span:first").removeClass("fadein_letter");
						play_sound(WordAudio, "media_audio");
						play_sound(WordVideo, "media_video");
					}, 4000);

				}
				else {

					setTimeout(function () {
						play_sound(WordAudio, "media_audio");
						play_sound(WordVideo, "media_video");
						$("#letters_span span:first").removeClass("fadein_letter");


						KeyboardLetters = LessonLetters;
						if (LessonRandom === "singleletter" || LessonRandom === "random_one" || LessonRandom === "random_two" || LessonRandom === "random_three" || LessonRandom === "random_many" || LessonRandom === "random_many_az" || LessonRandom === "random_eliminate") {
							KeyboardLetters = CorrectKey;
						}

						RandomLetters = RandomLetters.replace(event.detail.key, "");
						if (WrongCount >= 2 && LessonRandom !== "random_eliminate" && LessonRandom !== "random_many_az") {
							RandomLetters = "";
						}

						if (LessonRandom === "full") {
							update_keyboard("all", CorrectKey, 30000);
						}
						else if (LessonRandom === "full_inc") {
							update_keyboard(ProgressiveKeys, CorrectKey, 30000);
						}
						else {
							update_keyboard(KeyboardLetters + RandomLetters, CorrectKey, 100000);
						}

						//------------call key--------

					}, 4000);
				}

			}
		}
	});
});
