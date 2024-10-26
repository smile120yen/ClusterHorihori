/******/ (() => { // webpackBootstrap
/*!*****************************************!*\
  !*** ./src/InteractSendNextToTarget.js ***!
  \*****************************************/
const target = $.worldItemReference("Target");
const cooltimeMax = 0.1;

// @field(string)
const message = "Next";
// @field(int)
const arg = 0;

$.onStart(() => {
	$.state.cooltime = 0;
	$.state.isEnable = true;
});

$.onInteract((player) => {
	if ($.state.isEnable) {
		target.send(message, arg);
	}
});

$.onUpdate((deltaTime) => {
	if (!$.state.isEnable) {
		$.state.cooltime -= deltaTime;
		if ($.state.cooltime <= 0) {
			$.state.isEnable = true;
		}
	}
});

/******/ })()
;