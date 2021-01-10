var CorrectKey = "";


var WordAudio = "";
var nozoom = false;
var key_string = "";
var LessonString = "";
var LessonStringPos = 0;
var LessonKeyboardRandom = getParameterByName("random");
var AllLetters = "ELKAİNOMUTÜYÖRIDSBZÇGŞCPHVĞFJ1234567890";

var LessonLength = 11;
var LessonProgress = 0;
var LessonLanguage = getParameterByName("language");
var LessonCategory = getParameterByName("category");

var AllWordsData;
var AlfaWords = [];
var CorrectWordAudio = "";

var Timeout1, Timeout2, Timeout3, Timeout4, Timeout5, Timeout6, Timeout7, Timeout8, Timeout9, Timeout10;
var LastLetterEntered = false;

if (LessonLanguage === "tr") {
  var KeyboardSoundArray = [

    ["../audio/letters/tr/Default_1.wav", "1"], [
      "../audio/letters/tr/iki.mp3", "2"], [
      "../audio/letters/tr/Default_3.wav", "3"], [
      "../audio/letters/tr/Default_4.wav", "4"], [
      "../audio/letters/tr/Default_5.wav", "5"], [
      "../audio/letters/tr/Default_6.wav", "6"], [
      "../audio/letters/tr/Default_7.wav", "7"], [
      "../audio/letters/tr/Default_8.wav", "8"], [
      "../audio/letters/tr/Default_9.wav", "9"], [
      "../audio/letters/tr/Default_0.wav", "0"], [
      "../audio/letters/tr/Default_q.wav", "Q"], [
      "../audio/letters/tr/Default_w.wav", "W"], [
      "../audio/letters/tr/Default_e.wav", "E"], [
      "../audio/letters/tr/Default_r.wav", "R"], [
      "../audio/letters/tr/Default_t.wav", "T"], [
      "../audio/letters/tr/Default_y.wav", "Y"], [
      "../audio/letters/tr/Default_u.wav", "U"], [
      "../audio/letters/tr/Default_ii.wav", "I"], [
      "../audio/letters/tr/Default_o.wav", "O"], [
      "../audio/letters/tr/Default_p.wav", "P"], [
      "../audio/letters/tr/Default_gg.wav", "Ğ"], [
      "../audio/letters/tr/Default_uu.wav", "Ü"], [
      "../audio/letters/tr/Default_a.wav", "A"], [
      "../audio/letters/tr/Default_s.wav", "S"], [
      "../audio/letters/tr/Default_d.wav", "D"], [
      "../audio/letters/tr/Default_f.wav", "F"], [
      "../audio/letters/tr/Default_g.wav", "G"], [
      "../audio/letters/tr/Default_h.wav", "H"], [
      "../audio/letters/tr/Default_j.wav", "J"], [
      "../audio/letters/tr/Default_k.wav", "K"], [
      "../audio/letters/tr/Default_l.wav", "L"], [
      "../audio/letters/tr/Default_ss.wav", "Ş"], [
      "../audio/letters/tr/Default_i.wav", "İ"], [
      "../audio/letters/tr/Default_z.wav", "Z"], [
      "../audio/letters/tr/Default_x.wav", "X"], [
      "../audio/letters/tr/Default_c.wav", "C"], [
      "../audio/letters/tr/Default_v.wav", "V"], [
      "../audio/letters/tr/Default_b.wav", "B"], [
      "../audio/letters/tr/Default_n.wav", "N"], [
      "../audio/letters/tr/Default_m.wav", "M"], [
      "../audio/letters/tr/Default_oo.wav", "Ö"], [
      "../audio/letters/tr/Default_cc.wav", "Ç"]
  ];
}

if (LessonLanguage === "en") {
  var KeyboardSoundArray = [

    ["../audio/letters/en/1.mp3", "1"], [
      "../audio/letters/en/iki.mp3", "2"], [
      "../audio/letters/en/3.mp3", "3"], [
      "../audio/letters/en/4.mp3", "4"], [
      "../audio/letters/en/5.mp3", "5"], [
      "../audio/letters/en/6.mp3", "6"], [
      "../audio/letters/en/7.mp3", "7"], [
      "../audio/letters/en/8.mp3", "8"], [
      "../audio/letters/en/9.mp3", "9"], [
      "../audio/letters/en/0.mp3", "0"], [
      "../audio/letters/en/q.mp3", "Q"], [
      "../audio/letters/en/w.mp3", "W"], [
      "../audio/letters/en/e.mp3", "E"], [
      "../audio/letters/en/r.mp3", "R"], [
      "../audio/letters/en/t.mp3", "T"], [
      "../audio/letters/en/y.mp3", "Y"], [
      "../audio/letters/en/u.mp3", "U"], [
      "../audio/letters/en/o.mp3", "O"], [
      "../audio/letters/en/p.mp3", "P"], [
      "../audio/letters/en/a.mp3", "A"], [
      "../audio/letters/en/s.mp3", "S"], [
      "../audio/letters/en/d.mp3", "D"], [
      "../audio/letters/en/f.mp3", "F"], [
      "../audio/letters/en/g.mp3", "G"], [
      "../audio/letters/en/h.mp3", "H"], [
      "../audio/letters/en/j.mp3", "J"], [
      "../audio/letters/en/k.mp3", "K"], [
      "../audio/letters/en/l.mp3", "L"], [
      "../audio/letters/en/i.mp3", "I"], [
      "../audio/letters/en/z.mp3", "Z"], [
      "../audio/letters/en/x.mp3", "X"], [
      "../audio/letters/en/c.mp3", "C"], [
      "../audio/letters/en/v.mp3", "V"], [
      "../audio/letters/en/b.mp3", "B"], [
      "../audio/letters/en/n.mp3", "N"], [
      "../audio/letters/en/m.mp3", "M"]
  ];
}

console.log(KeyboardSoundArray);

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
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


function randomColor() {
  let colorGen = "0123456789ABCDEF";
  let len = colorGen.length;
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += colorGen[Math.floor(Math.random() * len)];
  }

  return color;
}

function randomChar() {
  let letters = "123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM";
  let len = letters.length;
  let char = letters[Math.floor(Math.random() * len)];
  return char;
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function CreateLesson(ArrayID) {

  clearTimeout(Timeout1);
  clearTimeout(Timeout2);
  clearTimeout(Timeout3);
  clearTimeout(Timeout4);
  clearTimeout(Timeout5);
  clearTimeout(Timeout6);
  clearTimeout(Timeout7);
  clearTimeout(Timeout8);
  clearTimeout(Timeout9);
  clearTimeout(Timeout10);

  console.log(ArrayID);
  $("#ballons").hide();
  $("#word_picture_box").show()
  $("#word_picture").attr('src', '/pictures/' + AlfaWords[ArrayID].image);

  play_sound("../audio/" + LessonLanguage + "/" + AlfaWords[ArrayID].audio, "media_audio", false);
  CorrectWordAudio = "../audio/" + LessonLanguage + "/" + AlfaWords[ArrayID].audio;

  LastLetterEntered = false;

  LessonString = AlfaWords[ArrayID].word;
  LessonStringPos = 0;
  CorrectKey = LessonString[LessonStringPos];

  Timeout1 = setTimeout(function () {
    for (var i = 0; i < KeyboardSoundArray.length; i++) {
      if (KeyboardSoundArray[i][1] === CorrectKey) {
        play_sound(KeyboardSoundArray[i][0], "media_audio");
      }
    }
  }, 10000);

  var KeyboardURL = "";
  if (LessonKeyboardRandom === "fromstring") {
    var unique = LessonString.split('').filter(function (item, i, ar) { return ar.indexOf(item) === i; }).join('');

    KeyboardURL = "/surface_cmd?cmd=keyboard_keys&keys=" + unique + "&correct_key=" + CorrectKey + "&blink_delay=20000";
  }
  else if (LessonKeyboardRandom === "full") {

    KeyboardURL = "/surface_cmd?cmd=keyboard_keys&keys=all&correct_key=" + CorrectKey + "&blink_delay=5000";
  }
  else if (LessonKeyboardRandom === "singleletter") {
    KeyboardURL = "/surface_cmd?cmd=keyboard_keys&keys=" + CorrectKey + "&correct_key=" + CorrectKey + "&blink_delay=20000";
  }


  $.ajax({
    url: KeyboardURL,
    method: 'get',
    success: function (data) {
      console.log("---");
      console.log(data);
    }
  });

}

function CorrectAnswer(InputKey) {

  clearTimeout(Timeout1);
  clearTimeout(Timeout2);
  clearTimeout(Timeout3);
  clearTimeout(Timeout4);
  clearTimeout(Timeout5);
  clearTimeout(Timeout6);
  clearTimeout(Timeout7);
  clearTimeout(Timeout8);
  clearTimeout(Timeout9);
  clearTimeout(Timeout10);

  if (LastLetterEntered) {
    LastLetterEntered = false;
    $("#WordsForLesson").html("");
    LessonProgress++;
    CreateLesson($(".word_selected:eq(" + (LessonProgress - 1) + ")").data("id"));
    $("#ballons").hide();
    $("#progress_bar_box").css({"width": ((LessonProgress / LessonLength) * 100) + "%"});
  }

  if (!LastLetterEntered) {

    if (CorrectKey === InputKey) {
      $("#WordsForLesson").append(CorrectKey);

      if (LessonStringPos === LessonString.length - 1) { //last letter of the word
        LastLetterEntered = true;
        Timeout2 = setTimeout(function () {
          play_sound(CorrectWordAudio, "media_audio", false);
        }, 1000);

        Timeout3 = setTimeout(function () {
          play_sound("../audio/correct-sound/clap_2.mp3", "media_audio");
          $("#ballons").show();
          $("#ballons").addClass("balloons_hide");

        }, 3000);


        let BallonTimeout = 6000;

        Timeout4 = setTimeout(function () {
          if (LessonProgress >= LessonLength) {
            Timeout5 = setTimeout(function () {
              top.window.location.href = '../index.html';
            }, 1500);
          }
          else {
            $("#WordsForLesson").html("");
            LessonProgress++;
            CreateLesson($(".word_selected:eq(" + (LessonProgress - 1) + ")").data("id"));

            $("#ballons").hide();
          }
        }, BallonTimeout);

        $("#progress_bar_box").css({"width": ((LessonProgress / LessonLength) * 100) + "%"});
      }
      else { //correct letter but not last, advance to next

        Timeout6 = setTimeout(function () {
          play_sound("../audio/correct-sound/bravo-" + Math.floor((Math.random() * 5) + 5) + ".mp3", "media_audio2");
        }, 1000);


        LessonStringPos++;

        CorrectKey = LessonString[LessonStringPos];

        // play_sound("../audio/correct-sound/bravo-6.mp3", "media_audio2");

        Timeout7 = setTimeout(function () {
          for (var i = 0; i < KeyboardSoundArray.length; i++) {
            if (KeyboardSoundArray[i][1] === CorrectKey) {
              play_sound(KeyboardSoundArray[i][0], "media_audio");
            }
          }
        }, 10000);

        var KeyboardURL = "";
        if (LessonKeyboardRandom === "fromstring") {
          var unique = LessonString.split('').filter(function (item, i, ar) { return ar.indexOf(item) === i; }).join('');

          KeyboardURL = "/surface_cmd?cmd=keyboard_keys&keys=" + unique + "&correct_key=" + CorrectKey + "&blink_delay=20000";
        }
        else if (LessonKeyboardRandom === "full") {

          KeyboardURL = "/surface_cmd?cmd=keyboard_keys&keys=all&correct_key=" + CorrectKey + "&blink_delay=5000";
        }
        else if (LessonKeyboardRandom === "singleletter") {
          KeyboardURL = "/surface_cmd?cmd=keyboard_keys&keys=" + CorrectKey + "&correct_key=" + CorrectKey + "&blink_delay=20000";
        }


        $.ajax({
          url: KeyboardURL,
          method: 'get',
          success: function (data) {
            console.log("---");
            console.log(data);
          }
        });

      }
    }
    else { //wrong letter pressed
      console.log("Wrong Letter: " + InputKey);
      Timeout8 = setTimeout(function () {
//              play_sound("../audio/wrong-sound/wrong-answer-short-buzzer-double-01.mp3");
        play_sound("../audio/wrong-sound/yanlis-" + Math.floor((Math.random() * 7) + 8) + ".mp3", "media_audio2");
      }, 700);

      Timeout9 = setTimeout(function () {
        for (var i = 0; i < KeyboardSoundArray.length; i++) {
          if (KeyboardSoundArray[i][1] === LessonString[LessonStringPos]) {
            play_sound(KeyboardSoundArray[i][0], "media_audio");
          }
        }
      }, 2000);
    }
  }

}

$(document).ready(function () {

  $.ajax({
    url: "/get_all_table",
    method: 'get',
    success: function (data) {
      AllWordsData = data;
      // console.log("---");
      // console.log(data);

      for (var i = 0; i < AllWordsData.length; i++) {
        if (LessonCategory.indexOf("-"+AllWordsData[i].categoryID+"-") !== -1) {
          if (AllWordsData[i].word_TR !== "" && AllWordsData[i].word_TR !== null && LessonLanguage === "tr") {
            // console.log(AllWordsData[i]);

            var wordX = AllWordsData[i].word_TR.toLocaleUpperCase('tr-TR');
            wordX = wordX.replace(" ", "_");

            AlfaWords.push({"word": wordX, "image": AllWordsData[i].picture, "audio": AllWordsData[i].audio_TR});

            $("#picture_box").append("<div data-id='" + (AlfaWords.length - 1) + "' class='word_select'><img src='../pictures/" + AllWordsData[i].picture + "'  class='word_select_image'><div style='background-color: #ccc;'>" + AllWordsData[i].word_TR + "</div></div>");
          }
          else if (AllWordsData[i].word_EN !== "" && AllWordsData[i].word_EN !== null && LessonLanguage === "en") {

            var wordX = AllWordsData[i].word_EN.toLocaleUpperCase('en-US');
            wordX = wordX.replace(" ", "_");

            AlfaWords.push({"word": wordX, "image": AllWordsData[i].picture, "audio": AllWordsData[i].audio_EN});

            $("#picture_box").append("<div data-id='" + (AlfaWords.length - 1) + "' class='word_select'><img src='../pictures/" + AllWordsData[i].picture + "'  class='word_select_image'><div style='background-color: #ccc;'>" + AllWordsData[i].word_EN + "</div></div>");

          }
          else if (AllWordsData[i].word_CH !== "" && AllWordsData[i].word_CH !== null && LessonLanguage === "ch") {
            // console.log(AllWordsData[i]);
            var wordX = AllWordsData[i].word_CH;
            wordX = wordX.replace(" ", "_");

            AlfaWords.push({
              "word": wordX,
              "pinyin": AllWordsData[i].pinyin,
              "bopomofo": AllWordsData[i].bopomofo,
              "image": AllWordsData[i].picture,
              "audio": AllWordsData[i].audio_CH
            });

            $("#picture_box").append("<div data-id='" + (AlfaWords.length - 1) + "' class='word_select'><img src='../pictures/" + AllWordsData[i].picture + "' class='word_select_image'><div style='background-color: #ccc;'>" + AllWordsData[i].word_CH + "</div></div>");

          }
        }
      }


      $(".word_select").on('click', function () {
        console.log($(this).data("id"));
        $(this).toggleClass("word_selected");
      });
    }
  });


  $.ajax({
    url: "/surface_cmd?cmd=keyboard_keys&keys=all&correct_key=A&blink_delay=9999999",
    method: 'get',
    success: function (data) {
      console.log("---");
      console.log(data);
    }
  });

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


  $("#BeginLesson").on('click', function () {
    $("#BeginLesson").hide();
    $("#picture_box").hide();
    LessonLength = $(".word_selected").length;
    $("#WordsForLesson").html("");

    LessonProgress++;
    console.log(LessonProgress);
    console.log($(".word_selected:eq(" + (LessonProgress - 1) + ")"));
    console.log($(".word_selected:eq(" + (LessonProgress - 1) + ")").data("id"));
    CreateLesson($(".word_selected:eq(" + (LessonProgress - 1) + ")").data("id"));
  });

  setInterval(function () {

    $.ajax({
      url: "/surface_cmd?cmd=what_key",
      method: 'get',
      success: function (data) {
        if (data.key !== "" && LessonProgress > 0) {
          CorrectAnswer(data.key);
        }
      }
    });

  }, 100);
});
