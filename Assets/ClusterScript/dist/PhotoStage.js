/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/GetItemDiscriptionTextModule.js":
/*!*****************************************************!*\
  !*** ./src/modules/GetItemDiscriptionTextModule.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetItemDiscriptionText: () => (/* binding */ GetItemDiscriptionText),
/* harmony export */   RomanNum: () => (/* binding */ RomanNum)
/* harmony export */ });
const GetItemDiscriptionText = (targetItem) => {
	let rarityText = "";
	let targetItemDuration = targetItem.maxDuration;
	let targetItemName = targetItem.itemName;

	if (targetItem.rarity) {
		switch (targetItem.rarity) {
			case 1:
				rarityText = "（コモン）";
				break;
			case 2:
				rarityText = "（アンコモン）";
				break;
			case 3:
				rarityText = "（レア）";
				break;
			case 4:
				rarityText = "（エピック）";
				break;
			case 5:
				rarityText = "（レジェンダリー）";
				break;
		}
	}

	if (targetItemDuration != -1) {
		let specialEffectText = "";
		if (targetItem.specialEffect.length > 0) {
			for (const [index, spechialEffect] of targetItem.specialEffect.entries()) {
				specialEffectText += spechialEffect.effectName + RomanNum(spechialEffect.power);
				if (index < targetItem.specialEffect.length - 1) {
					specialEffectText += ",";
				}
			}
		} else {
			specialEffectText = "なし";
		}

		return targetItem.itemDisplayName + "　" + rarityText + "\n特殊効果:" + specialEffectText;
	} else if (targetItemName == "cupperOre") {
		return "銅鉱石 " + rarityText + "\n加工しやすい鉱石。よく取れる";
	} else if (targetItemName == "clystal") {
		return "クリスタル " + rarityText + "\nめずらしい鉱石。エンチャント確率が上がる";
	} else if (targetItemName == "goldOre") {
		return "金鉱石 " + rarityText + "\n柔らかくきれいな鉱石。価値が高い";
	} else if (targetItemName == "ironOre") {
		return "鉄鉱石 " + rarityText + "\n硬い鉱石。耐久力に優れる";
	} else if (targetItemName == "crimsonOre") {
		return "クリムゾン鉱石 " + rarityText + "\n高熱を放つ鉱石。特殊なツルハシの制作に使う";
	} else {
		return targetItem.itemDisplayName + " " + rarityText + "\nきれいな飾り。" + targetItem.price + "Gで売れる";
	}
};

const RomanNum = (num) => {
	switch (num) {
		case 1:
			return "Ⅰ";
		case 2:
			return "Ⅱ";
		case 3:
			return "Ⅲ";
		case 4:
			return "Ⅳ";
		case 5:
			return "Ⅴ";
	}
};


/***/ }),

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
/*!***************************!*\
  !*** ./src/PhotoStage.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_allItemList_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/allItemList.js */ "./src/modules/allItemList.js");
/* harmony import */ var _modules_GetItemDiscriptionTextModule_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/GetItemDiscriptionTextModule.js */ "./src/modules/GetItemDiscriptionTextModule.js");


const canvas = $.subNode("Canvas");

$.onStart(() => {
	$.state.sendMessageCache = [];
	$.state.cacheWaitTime = 0;
});

$.onRide((isGetOn, player) => {
	if (isGetOn) {
		AddSendMessageCache(player, "CheckSelectItem", null);
		for (let i = 1; i <= 5; i++) {
			$.subNode(i).setEnabled(false);
		}
		for (itemName of _modules_allItemList_js__WEBPACK_IMPORTED_MODULE_0__.allItemList) {
			$.subNode(itemName).setEnabled(false);
		}
	} else {
		canvas.setEnabled(false);
	}
});

$.onReceive(
	(messageType, arg, sender) => {
		if (messageType === "itemChecked") {
			if (!arg) return;
			let durationText = "";
			if (arg.maxDuration != -1) {
				durationText = "（つかえる回数:" + arg.duration + " / " + arg.maxDuration + "）";
			}
			$.subNode(arg.itemName).setEnabled(true);
			$.subNode("ItemDiscription").getUnityComponent("Text").unityProp.text = (0,_modules_GetItemDiscriptionTextModule_js__WEBPACK_IMPORTED_MODULE_1__.GetItemDiscriptionText)(arg) + "\n\n価格：" + arg.price + "G\n" + durationText;
			$.subNode(arg.rarity).setEnabled(true);
			canvas.setEnabled(true);
		}

		$.log("receve:" + (messageType || "null") + "," + JSON.stringify(arg));
	},
	{ player: true, item: true }
);

$.onUpdate((deltaTime) => {
	//汎用メッセージキャッシュを処理
	if ($.state.cacheWaitTime > 0) $.state.cacheWaitTime -= deltaTime;
	if ($.state.cacheWaitTime <= 0 && $.state.sendMessageCache.length > 0) {
		const sendMessageCache = $.state.sendMessageCache;
		const sendMessageData = sendMessageCache.shift();
		try {
			let arg = sendMessageData.arg;
			if (!arg) arg = "";
			sendMessageData.targetHandle.send(sendMessageData.message, arg);
		} catch {
			sendMessageCache.unshift(sendMessageData);
			$.log("キャッシュ処理失敗");
		}
		$.state.sendMessageCache = sendMessageCache;
		$.state.cacheWaitTime = 0.1;
	}
});

const AddSendMessageCache = (targetHandle, message, arg) => {
	let currentCache = $.state.sendMessageCache;
	if (!currentCache) currentCache = [];
	currentCache.push({ targetHandle, message, arg });
	$.state.sendMessageCache = currentCache;
};

})();

/******/ })()
;