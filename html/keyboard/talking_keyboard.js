function isAlphanumericKey(keycode) {
	return (keycode >= 48) && (keycode <= 90);
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

function update_keyboard(Keyboard_Keys, Correct_Key, Blink_Delay) {
	if (Keyboard_Keys !== old_data.keys || Correct_Key !== old_data.correct_key || Blink_Delay !== old_data.blink_delay) {
		Blink_Delay = parseInt(Blink_Delay, 10);

		old_data.keys = Keyboard_Keys;
		old_data.correct_key = Correct_Key;
		old_data.blink_delay = Blink_Delay;

		clearTimeout(BlinkTimer);

		$(".keyboard-key").removeClass("can_press");
		$(".keyboard-key").removeClass("blink_keyboard_key");

		BlinkTimer = setTimeout(function () {
			$('.keyboard-key').each(function (i, obj) {
				if ($(this).text() === Correct_Key) {
					$(this).addClass("blink_keyboard_key");
				}
			});
		}, Blink_Delay);

		if (!WaitForRelease) {

			if (Keyboard_Keys === "all") {
				$(".keyboard-key").css({"opacity": 1});
				$(".keyboard-key").addClass("can_press");
			}
			else {
				$(".keyboard-key").css({"opacity": 0.2});

				$('.keyboard-key').each(function (i, obj) {
					if (Keyboard_Keys.indexOf($(this).text()) !== -1) {
						$(this).css({"opacity": 1});
						$(this).addClass("can_press");
					}
				});
			}
		}
	}
}


function init_keyboard() {
	$(".keyboard-key").css({"opacity": 0.2});

// $("#CH_NUM_ROW").toggle();
// $("#key-CH").on('click', function () {
// 	$("#TR_KEY").hide();
// 	$("#CH_KEY").show();
// });
//
// $("#key-TR").on('click', function () {
// 	$("#CH_KEY").hide();
// 	$("#TR_KEY").show();
// });
//
// $("#key-CH-NUM").on('click', function () {
// 	$("#CH_NUM_ROW").toggle();
// });

	$(".keyboard-key").off().on({
		// Upon mouse-down, if letter is enabled or all speak the letter.
		mousedown: function () {
			console.log($(this));
			if ($(this).hasClass("can_press") && !WaitForRelease) {

				var event = new CustomEvent("virtual-keyboard-press", {detail: {"key": $(this).text()}});
				document.dispatchEvent(event);

				play_sound("../../" + $(this).data("mp3"), "media_audio2");

				$(".keyboard-key").css({"opacity": 0.2});
				WaitForRelease = true;

				setTimeout(function () {

					WaitForRelease = false;
					$('.keyboard-key').each(function (i, obj) {
						if ($(this).hasClass("can_press")) {
							$(this).css({"opacity": 1});
						}
					});
				}, 750);
			}
		},


		// Upon mouse-up, fade away the shown letter.
		mouseup: function () {
		}

	});
}