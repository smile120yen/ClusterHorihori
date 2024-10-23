/******/ (() => { // webpackBootstrap
/*!******************************!*\
  !*** ./src/ResetSaveData.js ***!
  \******************************/
const pickupSound = $.audio("Pickup");

$.onInteract(player => {
    pickupSound.play();
    player.send("ResetAllSaveData",null);
});
/******/ })()
;