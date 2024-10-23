/******/ (() => { // webpackBootstrap
/*!********************************!*\
  !*** ./src/ForceSpawnMeteo.js ***!
  \********************************/
const meteo = $.worldItemReference("Meteo");

$.onInteract((player) => {
	$.log("send:forceStartMeteoEvent");
	meteo.send("forceStartMeteoEvent", null);
});

/******/ })()
;