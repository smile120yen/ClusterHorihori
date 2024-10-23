/******/ (() => { // webpackBootstrap
/*!******************************!*\
  !*** ./src/SimpleGetItem.js ***!
  \******************************/
const pickupSound = $.audio("Pickup");

// @field(string)
const itemName = "turuhashiNormal";
// @field(string)
const itemDisplayName = "すばやいつるはし";
// @field(int)
const duration = 15;
// @field(int)
const maxDuration = 15;
// @field(float)
const motionMultiple = 2;
// @field(int)
const rarity =  1;
const specialEffect = [];
// @field(int)
const count = 1;
// @field(int)
const price = 0;
// @field(int)
const enchantPower = 0;
// @field(int)
const durationPower = 0;
// @field(int)
const craftDifficulty = 0;
// @field(bool)
const useableAnvil = false;

$.onInteract(player => {
    pickupSound.play();
    player.send("getItem",{
        itemName: itemName,
        itemDisplayName: itemDisplayName,
        duration : duration,
        maxDuration : maxDuration,
        motionMultiple : motionMultiple,
        rarity : rarity,
        specialEffect : specialEffect,
        count : count,
        price : price,
        useableAnvil :useableAnvil,
        enchantPower : enchantPower,
        durationPower : durationPower,
        craftDifficulty : craftDifficulty
    });
});
/******/ })()
;