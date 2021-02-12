var fan_animations = [];
var CorrectKey = "";
var fan_1_anime = 1;
var StartAnimation = false;

var LessonProgress = 0;
var LessonInProgress = false;

var RandomList = [];

var WordAudio = "";
var nozoom = false;
var key_string = "";


var LessonParameters;
var LessonLanguage;
var LessonLength;
var MaxFans;
var WordHints;
var RandomType;


function play_sound(mp3,playerid) {
  var AudioSrc = mp3;
  console.log("try to play: "+AudioSrc);

  $("#"+playerid+"_source").attr("src", AudioSrc);

  try {
    $("#"+playerid)[0].load();//suspends and restores all audio element
  } catch (e) {
    console.log("Error playing audio (1) " + AudioSrc);
  }

  //pause/stop audio
  try {
    var promise = document.querySelector("#"+playerid).pause();

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
    var promise = document.querySelector("#"+playerid).play();

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


function addFan(fan_number, left, top, width, x_visible, x_animate) {
  fan_animations.push({
    fan_id: fan_number,
    fan_position: 1,
    max_position: 4,
    is_visible: x_visible,
    is_animate: x_animate
  });
  $("#animation_view").append("<img id='fan_image_" + (fan_animations.length - 1) + "' " +
    "src='ceiling-fan-anim/" + fan_animations[fan_animations.length - 1].fan_id +
    "/" + fan_animations[fan_animations.length - 1].fan_position + ".png' " +
    "class='fan_1' style='width:" + width + "px; left:" + left + "px; top:" + top + "px;'>");
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function clickable_numbers(total_numbers, correct_number, left, top, width) {
  for (i = 0; i < total_numbers; i++) {

    $("#animation_view").append("<img id='number_image_" + (i + 1) + "' " +
      "src='numbers/" + (i + 1) + "-a.png' " +
      "class='fan_1' style='width:" + width + "px; left:" + (left + (i * width)) + "px; top:" + top + "px;'>");
  }

}


// addFan(3, 60, 0, 300, true, false);
// addFan(1, 500, 50, 300, true, false);
// addFan(2, 200, 130, 300, true, false);
//    clickable_numbers(8,3,20,500,180);


function intersectRect(r1_top, r1_left, r2_top, r2_left) {
  var x_number_r1 = 100;
  var x_number_r2 = 150;
  return !(r2_left > (r1_left + x_number_r1) ||
    (r2_left + x_number_r2) < r1_left ||
    r2_top > (r1_top + x_number_r1) ||
    (r2_top + x_number_r2) < r1_top);
}

function CreateLesson() {

  LessonInProgress = true;
  LessonProgress++;
  $("#ballons").hide();

  $("#progress_bar_box").css({"width": ((LessonProgress / LessonLength) * 100) + "%"});


  $(".fan_1").remove();

  var NumberOfFans = RandomList[LessonProgress - 1];

  if (LessonLanguage === "tr") {
    play_sound("/audio/letters/tr/Default_" + RandomList[LessonProgress - 1] + ".wav","media_audio");
  }

  if (LessonLanguage === "en") {
    play_sound("/audio/letters/en/" + RandomList[LessonProgress - 1] + ".mp3","media_audio");
  }

  if (LessonLanguage === "ch") {
    play_sound("/audio/letters/ch/number_" + RandomList[LessonProgress - 1] + "_ch.mp3","media_audio");
  }

  if (WordHints) {
    $("#word_letter").html("<span style='text-shadow: 2px 2px 2px rgba(0,0,0,0.5); color:" + getRandomColor() + "; font-size: 150px; line-height: 150px;'>" + RandomList[LessonProgress - 1] + "</span>");
  }


  var fan_list = [];
  fan_animations = [];

  var fan_width = 300;
  fan_1_anime = 1;
  StartAnimation = false;
  var j = 0;
  var random_x = 0;
  var random_y = 0;
  var break_loop = true;

  for (let i = 0; i < (NumberOfFans); i++) {
    j = 0;
    while (j < 500) {
      j++;
      random_x = Math.floor(Math.random() * 900) + 50;

      // if (nozoom) {
        random_y = Math.floor(Math.random() * 10) + 10;
      // }
      // else {
      //   random_y = Math.floor(Math.random() * 300) + 50;
      // }

      break_loop = true;
      for (let k = 0; k < fan_list.length; k++) {

        if (intersectRect(random_x, random_y, fan_list[k].x, fan_list[k].y)) {
          break_loop = false;
        }
      }

      if (break_loop) {
        break;
      }
    }
    fan_list.push({x: random_x, y: random_y});
    addFan((i + 1), random_x, random_y, fan_width, true, false);
  }


  if (RandomType === "sequential") {
    key_string = "";
    for (var i = 0; i < (NumberOfFans + 3); i++) {
      key_string = key_string + "" + (i + 1);
    }
  }

  if (RandomType === "one_more") {
    key_string = NumberOfFans + "";
    var j = 0;
    while (j === 0) {
      var RandNum = Math.floor(Math.random() * 9) + 1;
      if (RandNum !== NumberOfFans) {
        key_string += "" + RandNum;
        j = 1;
      }
    }
  }

  if (RandomType === "two_more") {
    key_string = NumberOfFans + "";
    var j = 0;
    while (j === 0) {
      var RandNum = Math.floor(Math.random() * (9 - parseInt(NumberOfFans, 10))) + parseInt(NumberOfFans, 10);
      if (RandNum !== NumberOfFans) {
        key_string += "" + RandNum;
        j = 1;
      }
    }

    var j = 0;
    if (parseInt(NumberOfFans, 10) > 1) {
      while (j === 0) {
        var RandNum = Math.floor(Math.random() * parseInt(NumberOfFans, 10));
        if (RandNum !== NumberOfFans) {
          key_string += "" + RandNum;
          j = 1;
        }
      }
    }

  }

  // CorrectKey = NumberOfFans + "";
  // $.ajax({
  //   url: "/surface_cmd?cmd=keyboard_keys&keys=" + key_string,
  //   method: 'get',
  //   success: function (data) {
  //     console.log("---");
  //     console.log(data);
  //   }
  // });

}

function CorrectAnswer() {

  // $.ajax({
  //   url: "/surface_cmd?cmd=keyboard_keys&keys=ABC",
  //   method: 'get',
  //   success: function (data) {
  //     console.log("---");
  //     console.log(data);
  //   }
  // });

  CorrectKey = "";
  setTimeout(function () {
    play_sound("../audio/correct-sound/switch_1.mp3","media_audio");
  }, 150);

  setTimeout(function () {
    play_sound("../audio/correct-sound/clap_2.mp3","media_audio");
  }, 400);

  setTimeout(function () {
    play_sound("../audio/correct-sound/bravo-"+ Math.floor( (Math.random() * 10) +1 ) +".mp3","media_audio2");
  }, 400);


  if (WordHints) {
    $("#word_letter").removeClass("animate-flicker");
    $("#word_letter").addClass("animate-zoom");
  }
  $("#ballons").show();
  $("#ballons").addClass("balloons_hide");

  StartAnimation = true;
  for (var i = 0; i < fan_animations.length; i++) {
    fan_animations[i].is_animate = true;
  }

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
  LessonParameters = window.sendSyncCmd('get-lesson-parameters', '');

  WordHints =  LessonParameters["hints"] === "yes";
  MaxFans = parseInt( LessonParameters["max_fans"], 10);
  RandomType = LessonParameters["random"];
  LessonLength = parseInt( LessonParameters["length"], 10);
  LessonLanguage = LessonParameters["language"];


  if (!WordHints) {
    $("#word_letter").hide();
  }

  // if (getParameterByName("nozoom") === "yes") {
  //   nozoom = true;
  // }
  //
  // addEventListener("click", function () {
  //   if (getParameterByName("nozoom") === "yes") {
  //     nozoom = true;
  //
  //   }
  //   else {
  //     var
  //       el = document.documentElement
  //       , rfs =
  //       el.requestFullScreen
  //       || el.webkitRequestFullScreen
  //       || el.mozRequestFullScreen
  //     ;
  //     rfs.call(el);
  //   }
  // });



  for (var i = 0; i < LessonLength; i++) {
    var TempRandom = Math.floor(Math.random() * MaxFans) + 1;

    if (i > 0) {
      var k = 0;
      var l = 0;
      while (k == 0 && l < LessonLength) {
        for (var j = 0; j < i; j++) {
          if (TempRandom === RandomList[j]) {
            TempRandom = Math.floor(Math.random() * MaxFans) + 1;
            break;
          }
        }
        l++;
      }
    }
    if (i > 0) {
      if (RandomList[i - 1] === TempRandom) {
        TempRandom = Math.floor(Math.random() * MaxFans) + 1;
      }
    }
    RandomList[i] = TempRandom;
  }


  CreateLesson();

  var KeyboardPath = "../keyboard/mini_" + LessonLanguage + "_keyboard.html";

  $.ajax({
    url: KeyboardPath,
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
      init_keyboard();

    }
  });

  document.addEventListener("virtual-keyboard-press", function (event) {
    if (event.detail.key !== "" && LessonProgress > 0) {
      CorrectAnswer(event.detail.key);
    }
  });


//   setInterval(function () {
//
//     $.ajax({
//       url: "/surface_cmd?cmd=what_key",
//       method: 'get',
//       success: function (data) {
//         if (data.key !== "") {
//           if (data.key == CorrectKey) {
//             CorrectAnswer();
//           }
//           else if (CorrectKey === "") {
//             play_sound("../audio/correct-sound/switch_1.mp3","media_audio");
//           }
//           else {
//
//             key_string = key_string.replace(data.key.toUpperCase(),"");
//
//             $.ajax({
//               url: "/surface_cmd?cmd=keyboard_keys&keys=" + key_string,
//               method: 'get',
//               success: function (data) {
//                 console.log("---");
//                 console.log(data);
//               }
//             });
//
//
//             setTimeout(function () {
// //              play_sound("../audio/wrong-sound/wrong-answer-short-buzzer-double-01.mp3");
//               play_sound("../audio/wrong-sound/yanlis-"+ Math.floor( (Math.random() * 16) +1 ) +".mp3","media_audio2");
//             }, 700);
//           }
//         }
//       }
//     });
//
//
//     if (StartAnimation) {
//       for (var i = 0; i < fan_animations.length; i++) {
//         if (fan_animations[i].is_animate) {
//           fan_animations[i].fan_position++;
//           $("#fan_image_" + i).attr("src", "ceiling-fan-anim/" + fan_animations[i].fan_id + "/" + fan_animations[i].fan_position + ".png");
//           if (fan_animations[i].fan_position >= fan_animations[i].max_position) {
//             fan_animations[i].fan_position = 0;
//           }
//         }
//
//         if (fan_animations[i].is_visible) {
//           $("#fan_image_" + i).show();
//         }
//         else {
//           $("#fan_image_" + i).hide();
//         }
//       }
//
//       $("#fan_1").attr("src", "ceiling-fan-anim/1/" + fan_1_anime + ".png");
//       fan_1_anime++;
//       if (fan_1_anime >= 4) {
//         fan_1_anime = 1;
//       }
//     }
//
//   }, 100);

});
