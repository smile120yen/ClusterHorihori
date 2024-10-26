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
	});

	$.onInteract((player) => {
		player.send("AttackCurrentItem", null);
	});

	$.onReceive((requestName, arg, sender) => {
		if (requestName == "damage") {
			$.log("ダメージ受信");
			//$.sendSignalCompat("this", "damage");
			animator.setTrigger("Clash");
			particle.play();

			let hp = $.state.hp;
			if (hp <= 0) return;
			if (arg.damage) {
				hp -= arg.damage;
			} else {
				hp -= 1;
			}

			CheckDropItem(arg);

			if (hp > 0) {
				damagedSound.play();
			} else {
				breakedSound.play();
				subNodeVisual.setEnabled(false);
				$.createItem(oreBreakedItem, $.getPosition(), $.getRotation());
				$.state.enable = false;
				$.state.respawnTime = respawnTime / $.getPlayersNear($.getPosition(), Infinity).length;
			}

			$.state.hp = hp;

			let newConsumeDuration = consumeDuration;
			if (arg.durationReduce) {
				newConsumeDuration -= arg.durationReduce;
			}
			if (newConsumeDuration < 1) newConsumeDuration = 1;

			sender.send("ReceiveDamage", newConsumeDuration);
		}
	});

	$.onUpdate((deltaTime) => {
		if (!$.state.enable) {
			$.state.respawnTime -= deltaTime;
			if ($.state.respawnTime <= 0) {
				RespawnItem();
			}
		}
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
			let spawnPosition = $.getPosition()
				.clone()
				.add(new Vector3(0, 0.7, 0));
			let followingItem = $.createItem(dropKousekiItem, spawnPosition, $.getRotation());
			followingItem.send("setStatus", {
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
/*!***************************************!*\
  !*** ./src/BreakableOreItemScript.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_BreakableOreItemScriptModule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/BreakableOreItemScriptModule.js */ "./src/modules/BreakableOreItemScriptModule.js");


const itemSettings = {
	itemName: "cupperOre",
	itemDisplayName: "銅鉱石",
	consumeDuration: 1,
	price: 10,
	maxHp: 5,
	respawnTime: 120,
	dropChance: 0.2,
	durationPower: 2,
	enchantPower: 1,
	craftDifficulty: 1,
};

(0,_modules_BreakableOreItemScriptModule_js__WEBPACK_IMPORTED_MODULE_0__.initListeners)(itemSettings);

/*

const dropKousekiItem = new WorldItemTemplateId("DropKouseki");
const oreBreakedItem = new WorldItemTemplateId("OreBreaked");
const damagedSound = $.audio("Clash");
const breakedSound = $.audio("Break");
const subNodeVisual = $.subNode("Visual");
const oreObject = $.subNode("Ore");
const animator = $.subNode("Visual").getUnityComponent("Animator");
const particle = $.subNode("Particle System").getUnityComponent("ParticleSystem");

$.onStart(() => {
	RespawnItem();
	$.state.itemUsePlayers = [];
});

$.onInteract((player) => {
	player.send("AttackCurrentItem", null);
});

$.onReceive((requestName, arg, sender) => {
	if (requestName == "damage") {
		$.log("ダメージ受信");
		//$.sendSignalCompat("this", "damage");
		animator.setTrigger("Clash");
		particle.play();

		let hp = $.state.hp;
		if (hp <= 0) return;
		if (arg.damage) {
			hp -= arg.damage;
		} else {
			hp -= 1;
		}

		CheckDropItem(arg);

		if (hp > 0) {
			damagedSound.play();
		} else {
			breakedSound.play();
			subNodeVisual.setEnabled(false);
			$.createItem(oreBreakedItem, $.getPosition(), $.getRotation());
			$.state.enable = false;
			$.state.respawnTime = respawnTime / $.getPlayersNear($.getPosition(), Infinity).length;
		}

		$.state.hp = hp;

		let newConsumeDuration = consumeDuration;
		if (arg.durationReduce) {
			newConsumeDuration -= arg.durationReduce;
		}
		if (newConsumeDuration < 1) newConsumeDuration = 1;

		sender.send("ReceiveDamage", newConsumeDuration);
	}
});

$.onUpdate((deltaTime) => {
	if (!$.state.enable) {
		$.state.respawnTime -= deltaTime;
		if ($.state.respawnTime <= 0) {
			RespawnItem();
		}
	}
});

const RespawnItem = () => {
	subNodeVisual.setEnabled(true);
	$.state.maxHp = maxHp;
	$.state.hp = maxHp;
	$.state.enable = true;
};

const CheckDropItem = (itemData) => {
	let isDroped = false;
	const rand = Math.random();
	let newDropChance = dropChance;
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
		let spawnPosition = $.getPosition()
			.clone()
			.add(new Vector3(0, 0.7, 0));
		let followingItem = $.createItem(dropKousekiItem, spawnPosition, $.getRotation());
		followingItem.send("setStatus", {
			itemName: itemName,
			itemDisplayName: itemDisplayName,
			price: price,
			count: 1,
			useableAnvil: true,
			rarity: newRarity,
			durationPower: durationPower,
			enchantPower: enchantPower,
			craftDifficulty: craftDifficulty,
		});

		let random_x = Math.random() * 2 - 1;
		let random_z = Math.random() * 2 - 1;
		followingItem.addImpulsiveForce(new Vector3(random_x, 4, random_z));
	}
};
*/

})();

/******/ })()
;