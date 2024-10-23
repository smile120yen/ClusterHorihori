/******/ (() => { // webpackBootstrap
/*!**************************************!*\
  !*** ./src/ImageChangeAbleCanvas.js ***!
  \**************************************/
const maxIndex = 9;

$.onStart(() => {
	$.state.currentIndex = 0;
	UpdateIndex($.state.currentIndex);
});

$.onReceive(
	(requestName, arg, sender) => {
		if (requestName == "Next") {
			const newIndex = ($.state.currentIndex + 1) % maxIndex;
			UpdateIndex(newIndex);
			$.state.currentIndex = newIndex;
		}
		if (requestName == "Prev") {
			let newIndex = $.state.currentIndex - 1;
			if (newIndex < 0) newIndex = maxIndex - 1;
			UpdateIndex(newIndex);
			$.state.currentIndex = newIndex;
		}
	},
	{ item: true, player: true }
);

const UpdateIndex = (index) => {
	for (let i = 0; i < maxIndex; i++) {
		const name = ("00" + i).slice(-2);
		const node = $.subNode(name);
		if (i == index) {
			node.setEnabled(true);
		} else {
			node.setEnabled(false);
		}
	}
};

/******/ })()
;