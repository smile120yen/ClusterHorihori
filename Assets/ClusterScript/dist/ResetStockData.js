/******/ (() => { // webpackBootstrap
/*!*******************************!*\
  !*** ./src/ResetStockData.js ***!
  \*******************************/
const pickupSound = $.audio("Pickup");

$.onInteract((player) => {
	pickupSound.play();
	player.send("ClearStockData", null);
});

/******/ })()
;