/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/BreakableOreItemScriptModule.js":
/*!*****************************************************!*\
  !*** ./src/modules/BreakableOreItemScriptModule.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initListeners: () => (/* binding */ initListeners)
/* harmony export */ });
/* harmony import */ var _CacheModule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CacheModule.js */ "./src/modules/CacheModule.js");


const initListeners = (itemSettings) => {
	const dropKousekiItem = new WorldItemTemplateId("DropKouseki");
	const oreBreakedItem = new WorldItemTemplateId("OreBreaked");
	const damagedSound = $.audio("Clash");
	const breakedSound = $.audio("Break");
	const subNodeVisual = $.subNode("Visual");
	const animator = $.subNode("Visual").getUnityComponent("Animator");
	const particle = $.subNode("Particle System").getUnityComponent("ParticleSystem");

	$.onStart(() => {
		RespawnItem();
		$.state.itemUsePlayers = [];
		$.state.interactWaitTime = 0;
		(0,_CacheModule_js__WEBPACK_IMPORTED_MODULE_0__.InitializeSendCache)();
	});

	$.onInteract((player) => {
		if ($.state.interactWaitTime <= 0) {
			player.send("AttackCurrentItem", null);
			$.state.interactWaitTime = 0.2;
		}
	});

	$.onReceive((requestName, arg, sender) => {
		if (requestName == "damage") {
			animator.setTrigger("Clash");
			particle.play();

			let hp = $.state.hp;
			if (hp <= 0) return;
			if (arg.damage) {
				hp -= arg.damage;
			} else {
				hp -= 1;
			}
			$.state.hp = hp;

			CheckDropItem(arg);

			if (hp > 0) {
				damagedSound.play();
			} else {
				breakedSound.play();
				subNodeVisual.setEnabled(false);
				$.createItem(oreBreakedItem, $.getPosition(), $.getRotation());
				$.state.enable = false;
				$.state.respawnTime = itemSettings.respawnTime / $.getPlayersNear($.getPosition(), Infinity).length;
			}

			$.state.hp = hp;

			let newConsumeDuration = itemSettings.consumeDuration;
			if (arg.durationReduce) {
				newConsumeDuration -= arg.durationReduce;
			}
			if (newConsumeDuration < 1) newConsumeDuration = 1;

			(0,_CacheModule_js__WEBPACK_IMPORTED_MODULE_0__.AddSendMessageCache)(sender, "ReceiveDamage", newConsumeDuration);
		}

		$.log("receve:" + (requestName || "null") + "," + JSON.stringify(arg));
	});

	$.onUpdate((deltaTime) => {
		if ($.state.interactWaitTime > 0) $.state.interactWaitTime -= deltaTime;

		if (!$.state.enable) {
			$.state.respawnTime -= deltaTime;
			if ($.state.respawnTime <= 0) {
				RespawnItem();
			}
		}

		(0,_CacheModule_js__WEBPACK_IMPORTED_MODULE_0__.ProcessCache)(deltaTime);
	});

	const RespawnItem = () => {
		subNodeVisual.setEnabled(true);
		$.state.maxHp = itemSettings.maxHp;
		$.state.hp = itemSettings.maxHp;
		$.state.enable = true;
	};

	const CheckDropItem = (itemData) => {
		let isDroped = false;
		const rand = Math.random();
		let newDropChance = itemSettings.dropChance;
		let hp = $.state.hp;
		if (itemData.bonusDropChance) newDropChance += itemData.bonusDropChance;
		if (rand < newDropChance || hp <= 0) {
			isDroped = true;
		}

		let luck = 1;
		if (itemData.luck) luck = itemData.luck;

		const rarityRand = Math.floor(Math.random() * 100);

		let newRarity = 1;
		if (rarityRand < 55) {
			newRarity = 1;
		} else if (rarityRand < 75) {
			newRarity = 2;
		} else if (rarityRand < 85) {
			newRarity = 3;
		} else if (rarityRand < 95) {
			newRarity = 4;
		} else {
			newRarity = 5;
		}

		if (luck < newRarity) newRarity = luck;

		if (isDroped) {
			let spawnPosition = $.getPosition().clone().add(new Vector3(0, 0.7, 0));
			let followingItem = $.createItem(dropKousekiItem, spawnPosition, $.getRotation());

			(0,_CacheModule_js__WEBPACK_IMPORTED_MODULE_0__.AddSendMessageCache)(followingItem, "setStatus", {
				itemName: itemSettings.itemName,
				itemDisplayName: itemSettings.itemDisplayName,
				price: itemSettings.price,
				count: 1,
				useableAnvil: true,
				rarity: newRarity,
				durationPower: itemSettings.durationPower,
				enchantPower: itemSettings.enchantPower,
				craftDifficulty: itemSettings.craftDifficulty,
			});

			let random_x = Math.random() * 2 - 1;
			let random_z = Math.random() * 2 - 1;
			followingItem.addImpulsiveForce(new Vector3(random_x, 4, random_z));
		}
	};
};


/***/ }),

/***/ "./src/modules/CacheModule.js":
/*!************************************!*\
  !*** ./src/modules/CacheModule.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AddSendMessageCache: () => (/* binding */ AddSendMessageCache),
/* harmony export */   InitializeSendCache: () => (/* binding */ InitializeSendCache),
/* harmony export */   ProcessCache: () => (/* binding */ ProcessCache)
/* harmony export */ });
const InitializeSendCache = () => {
	//$.log("InitializeSendCache");
	$.state.sendMessageCache = [];
	$.state.cacheWaitTime = 0;
	$.state.findCache = false;
};

const ProcessCache = (deltaTime) => {
	//汎用メッセージキャッシュを処理
	if ($.state.findCache) {
		if ($.state.cacheWaitTime > 0) $.state.cacheWaitTime -= deltaTime;
		if ($.state.cacheWaitTime <= 0 && $.state.sendMessageCache.length > 0) {
			const sendMessageCache = $.state.sendMessageCache;
			const sendMessageData = sendMessageCache.shift();
			$.log("ProcessCache:" + JSON.stringify(sendMessageData));
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

			if ($.state.sendMessageCache.length <= 0) {
				$.state.findCache = false;
			}
		}
	}
};

const AddSendMessageCache = (targetHandle, message, arg) => {
	//$.log("AddSendMessageCache");
	let currentCache = $.state.sendMessageCache;
	if (!currentCache) currentCache = [];
	currentCache.push({ targetHandle, message, arg });
	$.state.sendMessageCache = currentCache;
	$.state.findCache = true;
};


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
/*!*******************************!*\
  !*** ./src/BreakedOreGold.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_BreakableOreItemScriptModule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/BreakableOreItemScriptModule.js */ "./src/modules/BreakableOreItemScriptModule.js");


const itemSettings = {
	itemName: "goldOre",
	itemDisplayName: "金鉱石",
	consumeDuration: 4,
	price: 40,
	maxHp: 10,
	respawnTime: 120,
	dropChance: 0.1,
	durationPower: 2,
	enchantPower: 15,
	craftDifficulty: 4,
};

(0,_modules_BreakableOreItemScriptModule_js__WEBPACK_IMPORTED_MODULE_0__.initListeners)(itemSettings);

})();

/******/ })()
;