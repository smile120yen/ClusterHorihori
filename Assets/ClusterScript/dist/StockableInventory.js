/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/allItemList.js":
/*!************************************!*\
  !*** ./src/modules/allItemList.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allItemList: () => (/* binding */ allItemList)
/* harmony export */ });
const allItemList = [
	"clystal",
	"crimsonOre",
	"cupperOre",
	"goldCoinBag",
	"goldOre",
	"ironOre",
	"trophyCatClystal",
	"trophyCatCrimson",
	"trophyCatCupper",
	"trophyCatGold",
	"trophyCatIron",
	"trophyCowClystal",
	"trophyCowCrimson",
	"trophyCowCupper",
	"trophyCowGold",
	"trophyCowIron",
	"trophyDeerClystal",
	"trophyDeerCrimson",
	"trophyDeerCupper",
	"trophyDeerGold",
	"trophyDeerIron",
	"trophyRabbitClystal",
	"trophyRabbitCrimson",
	"trophyRabbitCupper",
	"trophyRabbitGold",
	"trophyRabbitIron",
	"turuhashiClystal",
	"turuhashiCupper",
	"turuhashiEngine",
	"turuhashiGold",
	"turuhashiIron",
	"turuhashiNormal",
];


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************************!*\
  !*** ./src/StockableInventory.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_allItemList_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/allItemList.js */ "./src/modules/allItemList.js");
const chest = $.worldItemReference("Chest");


/*
const allItemList = [
	"clystal",
	"cupperOre",
	"goldOre",
	"goldCoinBag",
	"ironOre",
	"trophyCatClystal",
	"trophyCatCupper",
	"trophyCatGold",
	"trophyCatIron",
	"trophyCowClystal",
	"trophyCowCupper",
	"trophyCowGold",
	"trophyCowIron",
	"trophyDeerClystal",
	"trophyDeerCupper",
	"trophyDeerGold",
	"trophyDeerIron",
	"trophyRabbitClystal",
	"trophyRabbitCupper",
	"trophyRabbitGold",
	"trophyRabbitIron",
	"turuhashiClystal",
	"turuhashiCupper",
	"turuhashiEngine",
	"turuhashiGold",
	"turuhashiIron",
	"turuhashiNormal",
];
*/

const putinSound = $.audio("Putin");

$.onStart(() => {
	$.state.interactCoolTime = 0;
	$.state.usingPlayerId = null;
	$.state.itemData = null;
	$.state.chestIndex = 0;
});

$.onInteract((player) => {
	if ($.state.interactCoolTime > 0) return;
	$.state.interactCoolTime = 0.3;
	//使用中のプレイヤーじゃなければ触れない
	if (player.id != $.state.usingPlayerId) return;
	player.send("StockOrPickUpItem", $.state.chestIndex);
});

$.onUpdate((deltaTime) => {
	if ($.state.interactCoolTime > 0) $.state.interactCoolTime -= deltaTime;
});

$.onReceive(
	(requestName, arg, sender) => {
		if (requestName === "ViewItemData") {
			$.state.usingPlayerId = arg.sendPlayerId;

			if (arg.isPlaySound && (!$.state.itemData || !arg.itemData || $.state.itemData.count != arg.itemData.count)) {
				putinSound.play();
			}
			if (arg.itemData) {
				$.state.itemData = arg.itemData;
			} else {
				$.state.itemData = null;
			}

			$.state.chestIndex = arg.index;

			UpdateView();
		}

		$.log("receve:" + (requestName || "null") + "," + JSON.stringify(arg));
	},
	{ item: true, player: true }
);

const UpdateView = () => {
	const itemData = $.state.itemData;

	for (itemName of _modules_allItemList_js__WEBPACK_IMPORTED_MODULE_0__.allItemList) {
		const itemIcon = $.subNode(itemName);
		itemIcon.setEnabled(false);
	}

	const itemDurationBack = $.subNode("DurationBack");
	const itemDuration = $.subNode("Duration");
	const breakedView = $.subNode("Breaked");
	const inventoryCount = $.subNode("InventoryCount");
	itemDuration.setEnabled(false);
	itemDurationBack.setEnabled(false);
	breakedView.setEnabled(false);
	inventoryCount.setEnabled(false);

	//すべてのレア度表記を非表示
	for (let i = 1; i <= 5; i++) {
		const auraIcon = $.subNode(i);
		auraIcon.setEnabled(false);
	}

	if (itemData != null) {
		const itemIcon = $.subNode(itemData.itemName);
		itemIcon.setEnabled(true);

		const duration = itemData.duration;
		const maxDuration = itemData.maxDuration;
		const rarity = itemData.rarity;

		if (rarity) {
			const auraIcon = $.subNode(rarity);
			auraIcon.setEnabled(true);
		}

		if (duration != -1) {
			itemDuration.setEnabled(true);
			itemDurationBack.setEnabled(true);

			const unityProp = itemDuration.getUnityComponent("Image").unityProp;
			const durationRatio = duration / maxDuration;

			if (duration <= 0) {
				breakedView.setEnabled(true);
			}

			if (durationRatio > 0.6) {
				//unityProp.color = [0, 1, 0.2, 1];
				unityProp.color = new Color(0, 1, 0.2, 1);
			} else if (durationRatio > 0.3) {
				//unityProp.color = [1, 0.8, 0.2, 1];
				unityProp.color = new Color(1, 0.8, 0.2, 1);
			} else {
				//unityProp.color = [1, 0.2, 0.2, 1];
				unityProp.color = new Color(1, 0.2, 0.2, 1);
			}

			unityProp.fillAmount = durationRatio;
		}
		if (itemData.isStackable) {
			inventoryCount.setEnabled(true);
			inventoryCount.getUnityComponent("Text").unityProp.text = `${itemData.count}`;
		} else {
			inventoryCount.setEnabled(false);
		}
	}
};

})();

/******/ })()
;