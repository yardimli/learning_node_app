var EffectNumber = Math.floor(Math.random() * 3);

if (EffectNumber === 0) {

	$("#word_spelling").html('<h1 class="ml2" style="text-shadow: 2px 2px 2px rgba(0,0,0,0.5); color:' + getRandomColor() + ';">' + WordToShow + '</h1>');

	$("#word_spelling").html("<span style='text-shadow: 2px 2px 2px rgba(0,0,0,0.5); color:" + getRandomColor() + ";' id='word_container' class='ml2'>" + WordToShow + "</span></span>");

	// Wrap every letter in a span
	var textWrapper = document.querySelector('#word_container');
	textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

	anime.timeline({loop: true})
		.add({
			targets: '.ml2 .letter',
			scale: [4, 1],
			opacity: [0, 1],
			translateZ: 0,
			easing: "easeOutExpo",
			duration: 950,
			delay: (el, i) => 70 * i
		}).add({
		targets: '.ml2',
		opacity: 0,
		duration: 1000,
		easing: "easeOutExpo",
		delay: 1000
	});

}
else if (EffectNumber === 1) {
	$("#word_spelling").html('<h1 class="ml6">\
					<span class="text-wrapper">\
					<span class="letters" style="text-shadow: 2px 2px 2px rgba(0,0,0,0.5); color:' + getRandomColor() + ';">' + WordToShow + '</span>\
				</span>\
				</h1>');


	// Wrap every letter in a span
	var textWrapper = document.querySelector('.ml6 .letters');
	textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

	anime.timeline({loop: true})
		.add({
			targets: '.ml6 .letter',
			translateY: ["1.1em", 0],
			translateZ: 0,
			duration: 750,
			delay: (el, i) => 50 * i
		}).add({
		targets: '.ml6',
		opacity: 0,
		duration: 1000,
		easing: "easeOutExpo",
		delay: 1000
	});
}
else if (EffectNumber === 2) {
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
}
