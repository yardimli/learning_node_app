// Talking_Keyboard.js
// Written by Aaron Gaba
//
// jQuery functions for animation and speech


// A small utility function that returns true if the given keycode
// is associated with an alphanumeric key (based upon jQuery's event.which property).
function isAlphanumericKey(keycode) {
  return (keycode >= 48) && (keycode <= 90);
}

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

document.body.addEventListener('touchmove', function (e) {
  e.preventDefault();
});

var keys = "";
var correct_key = "";
var blink_delay = 1000;
var BlinkTimer;
var WaitForRelease = false;

var zoomCount = 0;

var old_data = {"keys": "", "blink_delay": 100000, "correct_key": "?"};
$(document).ready(function () {
  addEventListener("click", function () {
    if (getParameterByName("nozoom") === "yes") {

    }
    else {
      zoomCount++;
      if (zoomCount < 2) {
        var
          el = document.documentElement
          , rfs =
          el.requestFullScreen
          || el.webkitRequestFullScreen
          || el.mozRequestFullScreen
        ;
        rfs.call(el);
      }
    }
  });


  setInterval(function () {
    $.ajax({
      url: "/surface_cmd?cmd=what_keys",
      method: 'get',
      success: function (data) {
        if (data.keys !== old_data.keys || data.correct_key !== old_data.correct_key || data.blink_delay !== old_data.blink_delay) {
          old_data = data;

          keys = data.keys;
          correct_key = data.correct_key;
          blink_delay = parseInt(data.blink_delay, 10);
          clearTimeout(BlinkTimer);

          $(".keyboard-key").removeClass("blink_keyboard_key");

          BlinkTimer = setTimeout(function () {
            $('.keyboard-key').each(function (i, obj) {
              if ($(this).text() === correct_key) {
                $(this).addClass("blink_keyboard_key");
              }
            });
          }, blink_delay);

          if (!WaitForRelease) {

            if (keys === "all") {
              $(".keyboard-key").css({"opacity": 1});
            }
            else {
              $(".keyboard-key").css({"opacity": 0.2});

              $('.keyboard-key').each(function (i, obj) {
                if (keys.indexOf($(this).text()) !== -1) {
                  $(this).css({"opacity": 1});
                }
              });
            }
          }
        }
      }
    });

  }, 500);

  $(".keyboard-key").css({"opacity": 0.2});

  if (keys === "all") {
    $(".keyboard-key").css({"opacity": 1});
  }
  else {
    $('.keyboard-key').each(function (i, obj) {
      if (keys.indexOf($(this).text()) !== -1) {
        $(this).css({"opacity": 1});
      }
    });
  }

  $("#CH_NUM_ROW").toggle();
  $("#key-CH").on('click', function () {
    $("#TR_KEY").hide();
    $("#CH_KEY").show();
  });

  $("#key-TR").on('click', function () {
    $("#CH_KEY").hide();
    $("#TR_KEY").show();
  });

  $("#key-CH-NUM").on('click', function () {
    $("#CH_NUM_ROW").toggle();
  });

  $(".keyboard-key").on({
    // Upon mouse-down, if letter is enabled or all speak the letter.
    mousedown: function () {
      if (((keys.indexOf($(this).text()) !== -1) || (keys === "all")) && !WaitForRelease) {

        $.ajax({
          url: "/surface_cmd?cmd=key_press&key=" + $(this).text(),
          method: 'get',
          success: function (data) {
            console.log(data);
          }
        });

//				$("#selectedLetter").stop().css('opacity', '1.0').text($(this).text()); --not available on mini keyboard
        play_sound($(this).data("mp3"));

        if (keys === "all") {

        }
        else {
          $(".keyboard-key").css({"opacity": 0.2});
          WaitForRelease = true;

          setTimeout(function () {

            WaitForRelease = false;
            $('.keyboard-key').each(function (i, obj) {
              if (keys.indexOf($(this).text()) !== -1) {
                $(this).css({"opacity": 1});
              }
            });
          }, 750);
        }


      }
    },


    // Upon mouse-up, fade away the shown letter.
    mouseup: function () {

      //--not available on mini keyboard
      // if (keys.indexOf($(this).text()) !== -1) {
      // 	setTimeout(function () {
      // 		$("#selectedLetter").stop().animate({opacity: 0}, 250);
      // 	}, 2000);
      // }

    }

  });

});


// Emulates a mousedown event on a keyboard-key button.
// $(document).keydown(function (e) {
//     if (isAlphanumericKey(e.which)) {
//         var myID = "#key-" + String.fromCharCode(e.which);
//         $(myID).trigger("mousedown").addClass('active-style');
//     }
// });

// Emulates a mouseup event on a keyboard-key button.
// $(document).keyup(function (e) {
//     if (isAlphanumericKey(e.which)) {
//         var myID = "#key-" + String.fromCharCode(e.which);
//         $(myID).trigger("mouseup").removeClass('active-style');
//     }
// });