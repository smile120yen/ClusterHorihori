/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/SavedataCompressor.js":
/*!*******************************************!*\
  !*** ./src/modules/SavedataCompressor.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   binaryToHex: () => (/* binding */ binaryToHex),
/* harmony export */   compressJSON: () => (/* binding */ compressJSON),
/* harmony export */   compressionMap: () => (/* binding */ compressionMap),
/* harmony export */   decodeBase64: () => (/* binding */ decodeBase64),
/* harmony export */   decompressJSON: () => (/* binding */ decompressJSON),
/* harmony export */   encodeBase64: () => (/* binding */ encodeBase64),
/* harmony export */   jsonToBinary: () => (/* binding */ jsonToBinary),
/* harmony export */   valueCompressionMap: () => (/* binding */ valueCompressionMap)
/* harmony export */ });
// 圧縮マッピング
//import { nanoid } from "nanoid";

const compressionMap = {
	itemName: "a",
	itemDisplayName: "b",
	maxDuration: "c",
	duration: "d",
	price: "e",
	rarity: "f",
	uuid: "g",
	count: "h",
	specialEffect: "i",
	baseMovementSpeed: "j",
	bonusDropChance: "k",
	luck: "l",
	craftSpeed: "m",
	durationReduce: "n",
	motionMultiple: "o",
	multipleAttackCount: "p",
	damage: "q",
	totalMergeCount: "r",
	durationPower: "s",
	enchantPower: "t",
	craftDifficulty: "u",
	isStackable: "v",
	useableAnvil: "w",
	mineExp: "x",
	mineLv: "y",
	money: "z",
	kabanSize: "A",
	currentSelectIndex: "B",
	inventoryData: "C",
	stockItemData: "D",
	batch: "E",
	power: "F",
	effectName: "G",
	attack: "H",
};

// 新しい値の圧縮マッピングを追加
const valueCompressionMap = {
	clystal: "ia",
	crimsonOre: "ib",
	cupperOre: "ic",
	goldCoinBag: "id",
	goldOre: "ie",
	ironOre: "if",
	trophyCatClystal: "ig",
	trophyCatCrimson: "il",
	trophyCatCupper: "im",
	trophyCatGold: "in",
	trophyCatIron: "iv",
	trophyCowClystal: "iw",
	trophyCowCrimson: "ix",
	trophyCowCupper: "iy",
	trophyCowGold: "iz",
	trophyCowIron: "iA",
	trophyDeerClystal: "iB",
	trophyDeerCrimson: "iC",
	trophyDeerCupper: "iD",
	trophyDeerGold: "iE",
	trophyDeerIron: "iF",
	trophyRabbitClystal: "iG",
	trophyRabbitCrimson: "iH",
	trophyRabbitCupper: "iI",
	trophyRabbitGold: "iJ",
	trophyRabbitIron: "iK",
	turuhashiClystal: "iL",
	turuhashiCupper: "iM",
	turuhashiEngine: "iN",
	turuhashiGold: "iV",
	turuhashiIron: "iW",
	turuhashiNormal: "iX",
	ドロップ鉱石強化: "ea",
	採掘速度アップ: "eb",
	クラフト速度アップ: "ec",
	攻撃力アップ: "ed",
	移動速度アップ: "ee",
	ドロップ確率アップ: "ef",
	耐久力消費軽減: "eg",
};

const replaceCompressedUUID = (data) => {
	// stockItemDataの各アイテムに対して処理を行う
	data.stockItemData.forEach((item) => {
		if (item && item.uuid) {
			//item.uuid = nanoid(10); // UUIDをnanoidで生成した10文字の文字列に置き換える
			item.uuid = compressUUID(item.uuid);
		}
	});

	// inventoryDataの各アイテムに対して処理を行う
	data.inventoryData.forEach((item) => {
		if (item && item.uuid) {
			//item.uuid = nanoid(10); // UUIDをnanoidで生成した10文字の文字列に置き換える
			item.uuid = compressUUID(item.uuid);
		}
	});
};

const replaceDecompressedUUID = (data) => {
	// stockItemDataの各アイテムに対して処理を行う
	data.stockItemData.forEach((item) => {
		if (item && item.uuid) {
			//item.uuid = nanoid(10); // UUIDをnanoidで生成した10文字の文字列に置き換える
			item.uuid = decompressUUID(item.uuid);
		}
	});

	// inventoryDataの各アイテムに対して処理を行う
	data.inventoryData.forEach((item) => {
		if (item && item.uuid) {
			//item.uuid = nanoid(10); // UUIDをnanoidで生成した10文字の文字列に置き換える
			item.uuid = decompressUUID(item.uuid);
		}
	});
};

function compressUUID(uuid) {
	// UUIDをハイフンで分割し、16進数の各部分を結合
	const hexString = uuid.replace(/-/g, "");
	return encodeBase64(hexString);
}
function encodeBase64(hexString) {
	// 16進数の文字列をバイト配列に変換
	const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

	const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	let base64String = "";

	for (let i = 0; i < byteArray.length; i += 3) {
		const byte1 = byteArray[i];
		const byte2 = i + 1 < byteArray.length ? byteArray[i + 1] : 0;
		const byte3 = i + 2 < byteArray.length ? byteArray[i + 2] : 0;

		const triplet = (byte1 << 16) | (byte2 << 8) | byte3;

		base64String += base64Chars[(triplet >> 18) & 0x3f];
		base64String += base64Chars[(triplet >> 12) & 0x3f];
		base64String += i + 1 < byteArray.length ? base64Chars[(triplet >> 6) & 0x3f] : "=";
		base64String += i + 2 < byteArray.length ? base64Chars[triplet & 0x3f] : "=";
	}

	return base64String;
}

// JSONデータをバイナリデータに変換するための関数
function jsonToBinary(json) {
	const jsonString = JSON.stringify(json);
	const binaryData = new Uint8Array(jsonString.length);

	for (let i = 0; i < jsonString.length; i++) {
		binaryData[i] = jsonString.charCodeAt(i);
	}

	return binaryData;
}

function binaryToHex(binaryData) {
	return Array.from(binaryData)
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}

function decodeBase64(base64String) {
	const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	const byteArray = [];

	for (let i = 0; i < base64String.length; i += 4) {
		const triplet =
			(base64Chars.indexOf(base64String[i]) << 18) |
			(base64Chars.indexOf(base64String[i + 1]) << 12) |
			(base64Chars.indexOf(base64String[i + 2]) << 6) |
			base64Chars.indexOf(base64String[i + 3]);

		byteArray.push((triplet >> 16) & 0xff);
		if (base64String[i + 2] !== "=") byteArray.push((triplet >> 8) & 0xff);
		if (base64String[i + 3] !== "=") byteArray.push(triplet & 0xff);
	}

	const hexString = byteArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
	return hexString;
}

function decompressUUID(base64String) {
	// バイト配列から16進数の文字列を生成
	const hexString = decodeBase64(base64String);

	// 16進数の文字列をUUID形式に戻す
	const uuid = [hexString.slice(0, 8), hexString.slice(8, 12), hexString.slice(12, 16), hexString.slice(16, 20), hexString.slice(20, 32)].join("-");

	return uuid;
}

// 圧縮関数
function compressJSON(data) {
	const compressedData = JSON.parse(JSON.stringify(data)); // deep copy
	replaceCompressedUUID(compressedData);
	const compress = (obj) => {
		for (const key in obj) {
			const newKey = compressionMap[key] || key;
			if (newKey !== key) {
				obj[newKey] = obj[key];
				delete obj[key];
			}
			if (typeof obj[newKey] === "object" && !Array.isArray(obj[newKey])) {
				compress(obj[newKey]);
			} else if (Array.isArray(obj[newKey])) {
				obj[newKey].forEach((item) => compress(item));
			}

			// valueの圧縮を追加
			if (typeof obj[newKey] === "string") {
				const compressedValue = valueCompressionMap[obj[newKey]] || obj[newKey];
				obj[newKey] = compressedValue;
			}
		}
	};
	compress(compressedData);

	//const encodeData = encodeBase64(JSON.stringify(compressData));
	return compressedData;
}

// 解凍関数
function decompressJSON(data) {
	const decompressionMap = Object.fromEntries(Object.entries(compressionMap).map(([k, v]) => [v, k]));
	const valueDecompressionMap = Object.fromEntries(Object.entries(valueCompressionMap).map(([k, v]) => [v, k]));

	//const decodeData = decodeBase64(data);
	const decompressedData = JSON.parse(JSON.stringify(data)); // deep copy

	const decompress = (obj) => {
		for (const key in obj) {
			const originalKey = decompressionMap[key] || key;
			if (originalKey !== key) {
				obj[originalKey] = obj[key];
				delete obj[key];
			}
			if (typeof obj[originalKey] === "object" && !Array.isArray(obj[originalKey])) {
				decompress(obj[originalKey]);
			} else if (Array.isArray(obj[originalKey])) {
				obj[originalKey].forEach((item) => decompress(item));
			}

			// valueの解凍を追加
			if (typeof obj[originalKey] === "string") {
				const decompressedValue = valueDecompressionMap[obj[originalKey]] || obj[originalKey];
				obj[originalKey] = decompressedValue;
			}
		}
	};
	decompress(decompressedData);

	replaceDecompressedUUID(decompressedData);
	return decompressedData;
}


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
/*!*****************************!*\
  !*** ./src/PlayerScript.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_allItemList_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/allItemList.js */ "./src/modules/allItemList.js");
/* harmony import */ var _modules_SavedataCompressor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/SavedataCompressor.js */ "./src/modules/SavedataCompressor.js");

//import { LZString } from "./modules/lz-string.js";
//import LZString from "https://cdn.jsdelivr.net/npm/lz-string@1.4.4/lz-string.min.js";
//import LZString from "lz-string";


let motionTime = 0;
let isPlayingMotion = false;
let isClashed = false;
let followItem = null;
let savedData = null;
let dropCoolTime = 0;
let isCancelableMotion = true;
let isNeedSave = false;
let currentSpeed = 1;
let isClashEffectOn = false;
let multipleAttackCount = 1;
let multipleAttackSpeed = 1;
let stockItemSendList = [];
let currentOpenedChest = null;
let salaryCoolTime = 90;
let clushItemStatus = null;
let sendToCache = [];
let sendCacheWaitTime = 0;
let enableCache = false;

let beforeVisibleItem = null;
const maxSalaryCoolTime = 90;
const salaryMultiple = 10;

const swingAnimation = _.humanoidAnimation("Swing");
const InventoryUI = _.playerLocalObject("InventoryUI");
const ItemDiscriptionUI = _.playerLocalObject("ItemDiscriptionUI");
const AddMineLevelText = _.playerLocalObject("AddMineLevelText");
const GoldUI = _.playerLocalObject("GoldUI");
const MeteoUI = _.playerLocalObject("MeteoUI");
const MeteoCompleteUI = _.playerLocalObject("MeteoCompleteUI");
const MineLvUI = _.playerLocalObject("MineLvUI");
const VerticalLayoutMessageAnim = _.playerLocalObject("VerticalLayoutMessage").getUnityComponent("Animator");
const MissingGoldText = _.playerLocalObject("MissingGoldText").getUnityComponent("Text");
const HanyouMessageText = _.playerLocalObject("HanyouMessageText").getUnityComponent("Text");
const StartDiscriptionUI = _.playerLocalObject("StartDiscriptionUI");
const ServerUpdateUI = _.playerLocalObject("ServerUpdateUI");
const BonusSalaryRatioUI = _.playerLocalObject("BonusSalaryRatio").getUnityComponent("Image");

const lockonMarkerGameStart = _.worldItemReference("LockonMarkerGameStart");

const updateInventory = () => {
	//savedData.inventoryData = savedData.inventoryData.filter((item) => !item || allItemList.includes(item.itemName));
	//savedData.stockItemData = savedData.stockItemData.filter((item) => !item || allItemList.includes(item.itemName));

	savedData.inventoryData = savedData.inventoryData.map((item) => {
		if (!item || _modules_allItemList_js__WEBPACK_IMPORTED_MODULE_0__.allItemList.includes(item.itemName)) {
			return item; // 条件を満たす場合はそのまま返す
		}
		return undefined; // 条件を満たさない場合はundefinedを返す
	});

	savedData.stockItemData = savedData.stockItemData.map((item) => {
		if (!item || _modules_allItemList_js__WEBPACK_IMPORTED_MODULE_0__.allItemList.includes(item.itemName)) {
			return item; // 条件を満たす場合はそのまま返す
		}
		return undefined; // 条件を満たさない場合はundefinedを返す
	});

	if (savedData && followItem) {
		let targetSpeed = 1;
		if (savedData.inventoryData[savedData.currentSelectIndex] && savedData.inventoryData[savedData.currentSelectIndex].baseMovementSpeed) {
			targetSpeed = savedData.inventoryData[savedData.currentSelectIndex].baseMovementSpeed;
		}

		if (currentSpeed != targetSpeed) {
			//_.sendTo(followItem, "SetDefaultMovementSpeed", targetSpeed);
			AddSendToCache(followItem, "SetDefaultMovementSpeed", targetSpeed);
			currentSpeed = targetSpeed;
		}
	}

	updateInventoryView();
	isNeedSave = true;
};

const updateInventoryView = () => {
	ServerUpdateUI.setEnabled(false);

	if (!followItem) {
		InventoryUI.setEnabled(false);
		ItemDiscriptionUI.setEnabled(false);
		GoldUI.setEnabled(false);
		MineLvUI.setEnabled(false);
		StartDiscriptionUI.setEnabled(true);
		return;
	}

	InventoryUI.setEnabled(true);
	GoldUI.setEnabled(true);
	MineLvUI.setEnabled(true);
	ItemDiscriptionUI.setEnabled(true);
	StartDiscriptionUI.setEnabled(false);

	GoldUI.findObject("GoldText").getUnityComponent("Text").unityProp.text = savedData.money + "G";
	MineLvUI.findObject("MineLvText").getUnityComponent("Text").unityProp.text = "採掘 Lv " + savedData.mineLv;

	for (var i = 0; i < 10; i++) {
		const waku = InventoryUI.findObject("Waku0" + i);
		if (savedData.kabanSize <= i) {
			waku.setEnabled(false);
			continue;
		}
		waku.setEnabled(true);
		const inventoryCount = waku.findObject("InventoryCount");
		const selectWaku = waku.findObject("SelectWaku");

		if (savedData.currentSelectIndex == i) {
			selectWaku.setEnabled(true);
		} else {
			selectWaku.setEnabled(false);
		}

		//特定の子要素を一括で非表示にするみたいなのができない(getChildsみたいなのがない)ので手動で非表示処理

		for (itemName of _modules_allItemList_js__WEBPACK_IMPORTED_MODULE_0__.allItemList) {
			const itemIcon = waku.findObject("Icons").findObject(itemName);
			itemIcon.setEnabled(false);
		}

		const itemDurationBack = waku.findObject("DurationBack");
		const itemDuration = itemDurationBack.findObject("Duration");
		const breakedView = waku.findObject("Breaked");
		itemDuration.setEnabled(false);
		itemDurationBack.setEnabled(false);
		breakedView.setEnabled(false);

		//すべてのレア度表記を非表示
		const rarityAura = waku.findObject("RarityAura");
		for (let i = 1; i <= 5; i++) {
			const auraIcon = rarityAura.findObject(i);
			auraIcon.setEnabled(false);
		}

		if (savedData.inventoryData.length > i && savedData.inventoryData[i] != null) {
			const inventoryData = savedData.inventoryData[i];

			const itemIcon = waku.findObject("Icons").findObject(savedData.inventoryData[i].itemName);

			try {
				itemIcon.setEnabled(true);
			} catch {
				_.log("itemIcon " + savedData.inventoryData[i].itemName + " is notfound:" + i);
			}

			const duration = savedData.inventoryData[i].duration;
			const maxDuration = savedData.inventoryData[i].maxDuration;
			const rarity = savedData.inventoryData[i].rarity;

			if (rarity) {
				const auraIcon = rarityAura.findObject(rarity);
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

			if (inventoryData.isStackable) {
				inventoryCount.setEnabled(true);
				inventoryCount.getUnityComponent("Text").unityProp.text = `${inventoryData.count}`;
			} else {
				inventoryCount.setEnabled(false);
			}
		} else {
			inventoryCount.setEnabled(false);
		}
	}

	//アイテム詳細表示
	if (savedData.inventoryData.length > savedData.currentSelectIndex && savedData.inventoryData[savedData.currentSelectIndex] != null) {
		const targetItem = savedData.inventoryData[savedData.currentSelectIndex];
		const targetItemCount = savedData.inventoryData[savedData.currentSelectIndex].count;
		const targetItemDuration = savedData.inventoryData[savedData.currentSelectIndex].maxDuration;
		const targetItemName = savedData.inventoryData[savedData.currentSelectIndex].itemName;
		//_.sendTo(followItem, "VisibleItem", targetItemName);
		if (beforeVisibleItem != targetItemName) {
			AddSendToCache(followItem, "VisibleItem", { itemName: targetItemName });
			beforeVisibleItem = targetItemName;
		}

		//特定の子要素を一括で非表示にするみたいなのができない(getChildsみたいなのがない)ので手動で非表示処理
		for (itemName of _modules_allItemList_js__WEBPACK_IMPORTED_MODULE_0__.allItemList) {
			const itemIcon = ItemDiscriptionUI.findObject("Icons").findObject(itemName);
			itemIcon.setEnabled(false);
		}

		const itemIcon = ItemDiscriptionUI.findObject("Icons").findObject(targetItemName);
		itemIcon.setEnabled(true);
		ItemDiscriptionUI.setEnabled(true);

		const itemText = ItemDiscriptionUI.findObject("ItemText").getUnityComponent("Text");
		const durationText = ItemDiscriptionUI.findObject("DurationText").getUnityComponent("Text");

		if (targetItemDuration == -1) {
			durationText.unityProp.text = "（所持数：" + targetItemCount + "）";
		} else {
			durationText.unityProp.text = "（つかえる回数:" + targetItem.duration + " / " + targetItem.maxDuration + "）";
		}

		let rarityText = "";

		if (targetItem.rarity) {
			//レア度表記
			for (let i = 1; i <= 5; i++) {
				ItemDiscriptionUI.findObject("RarityAura").findObject(i).setEnabled(false);
			}
			ItemDiscriptionUI.findObject("RarityAura").findObject(targetItem.rarity).setEnabled(true);

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

			itemText.unityProp.text = targetItem.itemDisplayName + "　" + rarityText + "\n特殊効果:" + specialEffectText;
		} else if (targetItemName == "cupperOre") {
			itemText.unityProp.text = "銅鉱石 " + rarityText + "\n加工しやすい鉱石。よく取れる";
		} else if (targetItemName == "clystal") {
			itemText.unityProp.text = "クリスタル " + rarityText + "\nめずらしい鉱石。エンチャント確率が上がる";
		} else if (targetItemName == "goldOre") {
			itemText.unityProp.text = "金鉱石 " + rarityText + "\n柔らかくきれいな鉱石。価値が高い";
		} else if (targetItemName == "ironOre") {
			itemText.unityProp.text = "鉄鉱石 " + rarityText + "\n硬い鉱石。耐久力に優れる";
		} else if (targetItemName == "crimsonOre") {
			itemText.unityProp.text = "クリムゾン鉱石 " + rarityText + "\n高熱を放つ鉱石。特殊なツルハシの制作に使う";
		} else {
			itemText.unityProp.text = targetItem.itemDisplayName + " " + rarityText + "\nきれいな飾り。" + targetItem.price + "Gで売れる";
		}
	} else {
		if (beforeVisibleItem != null) {
			AddSendToCache(followItem, "VisibleItem", { itemName: null });
			beforeVisibleItem = null;
		}
		ItemDiscriptionUI.setEnabled(false);
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

const getStackable = (itemName) => {
	switch (itemName) {
		case "cupperOre":
		case "clystal":
		case "ironOre":
		case "goldOre":
		case "goldCoinBag":
		case "crimsonOre":
			return true;
	}
};

const getDefaultDuration = (itemName) => {
	switch (itemName) {
		case "turuhashi":
			return 10;
	}
	return -1;
};

const ResetSavedData = () => {
	_.log("ResetSaveData");
	savedData = {
		currentSelectIndex: 0,
		inventoryData: [],
		kabanSize: 4,
		mineExp: 0,
		mineLv: 1,
		money: 0,
		stockItemData: [],
	};
};

const Initialize = () => {
	followItem = null;
	_.hideButton(0);
	_.hideButton(1);
	_.hideButton(2);
	updateInventory();

	AddSendToCache(lockonMarkerGameStart, "Lockon", null);
	//_.sendTo(lockonMarkerGameStart, "Lockon", null);
};

const AddItem = (arg) => {
	const isStackable = getStackable(arg.itemName);

	const nullIndex = savedData.inventoryData.findIndex((inventoryData) => {
		return inventoryData == null;
	});

	const targetIndex = savedData.inventoryData.findIndex((inventoryData) => {
		return inventoryData && inventoryData.itemName === arg.itemName && inventoryData.rarity === arg.rarity;
	});

	if (savedData.inventoryData.length >= savedData.kabanSize && ((targetIndex == -1 && isStackable) || !isStackable) && nullIndex == -1) {
		VerticalLayoutMessageAnim.setTrigger("KabanMax");

		AddSendToCache(followItem, "PlaySound", "Cancel");
		//_.sendTo(followItem, "PlaySound", "Cancel");
		return false;
	}

	if (!("duration" in arg) || !("maxDuration" in arg)) {
		arg.duration = -1;
		arg.maxDuration = -1;
	}

	if (!arg.uuid) {
		arg.uuid = generateUUID();
	}

	arg.isStackable = isStackable;
	if (targetIndex != -1 && isStackable) {
		savedData.inventoryData[targetIndex].count += arg.count;
	} else if (nullIndex != -1) {
		savedData.inventoryData[nullIndex] = arg;
	} else {
		savedData.inventoryData.push(arg);
	}

	return true;
};

_.onReceive(
	(messageType, arg, sender) => {
		if (messageType === "RegisterFollowItem") {
			followItem = sender;
			_.showButton(1, _.iconAsset("Next"));
			_.showButton(2, _.iconAsset("Drop"));
			updateInventory();
			AddSendToCache(lockonMarkerGameStart, "Lockoff", null);
			//_.sendTo(lockonMarkerGameStart, "Lockoff", null);
		}

		if (messageType === "UnRegisterFollowItem") {
			Initialize();
		}

		if (messageType === "ResetAllSaveData") {
			ResetSavedData();
			updateInventory();
		}

		if (messageType === "getItem") {
			const success = AddItem(arg);
			if (success) {
				AddSendToCache(sender, "GetItemReceived", arg);
			} else {
				AddSendToCache(sender, "GetItemFailed", arg);
			}
			updateInventory();
		}

		if (messageType === "getItemList") {
			for (var itemData of arg) {
				AddItem(itemData);
			}
			AddSendToCache(sender, "GetItemReceived", null);
			//_.sendTo(sender, "GetItemReceived", null);
			updateInventory();
		}

		if (messageType === "removeItem") {
			const targetIndex = savedData.inventoryData.findIndex((inventoryData) => {
				return inventoryData.itemName === arg.itemName;
			});

			if (targetIndex == -1) {
				_.log("存在しないアイテムを消去しようとしている:" + JSON.stringify(arg));
				return;
			} else {
				if (savedData.inventoryData[targetIndex].count < arg.count) {
					_.log("所持しているアイテムより多い量を消去しようとしている:" + JSON.stringify(arg));
				} else {
					savedData.inventoryData[targetIndex].count -= arg.count;
					if (savedData.inventoryData[targetIndex].count == 0) {
						savedData.inventoryData = savedData.inventoryData.filter(function (item) {
							return item.itemName !== arg.itemName;
						});
					}
				}
			}
			updateInventory();
		}

		if (messageType === "AttackCurrentItem") {
			isClashEffectOn = false;
			clushItemStatus = null;
			AttackCurrentItem(sender);
		}

		if (messageType === "AttackCurrentItemWithEffect") {
			isClashEffectOn = true;
			clushItemStatus = SetRarityByDropChance(arg);
			AttackCurrentItem(sender);
		}

		if (messageType === "UseSelectItem") {
			const targetIndex = savedData.currentSelectIndex;

			if (savedData.inventoryData.length <= targetIndex) return;

			savedData.inventoryData[targetIndex].count -= arg;

			const itemData = JSON.parse(JSON.stringify(savedData.inventoryData[targetIndex]));
			itemData.count = arg;

			if (savedData.inventoryData[targetIndex].count == 0) {
				savedData.inventoryData[targetIndex] = null;
				//savedData.inventoryData.splice(targetIndex,1);
			}

			AddSendToCache(sender, "itemRemoved", itemData);
			//_.sendTo(sender, "itemRemoved", itemData);

			updateInventory();
		}

		if (messageType === "RemoveSelectItem") {
			const targetIndex = savedData.currentSelectIndex;

			if (savedData.inventoryData.length <= targetIndex) return;
			savedData.inventoryData[targetIndex].count -= arg.count;

			const itemData = JSON.parse(JSON.stringify(savedData.inventoryData[targetIndex]));
			itemData.count = arg.count;

			if (savedData.inventoryData[targetIndex].count <= 0) {
				savedData.inventoryData[targetIndex] = null;
			}

			AddSendToCache(sender, "itemRemoved", itemData);
			updateInventory();
		}

		if (messageType === "consumeItem") {
			const targetIndex = savedData.currentSelectIndex;

			savedData.inventoryData[targetIndex].duration -= arg;

			if (savedData.inventoryData[targetIndex].duration <= 0) {
				savedData.inventoryData[targetIndex].duration = 0;

				AddSendToCache(followItem, "PlaySound", "Break");
				//_.sendTo(followItem, "PlaySound", "Break");
			}

			updateInventory();
		}

		if (messageType === "RepairItem") {
			if (arg == "all") {
				for (let i = 0; i < savedData.inventoryData.length; i++) {
					if (savedData.inventoryData[i] && savedData.inventoryData[i].maxDuration) {
						savedData.inventoryData[i].duration = savedData.inventoryData[i].maxDuration;
					}
				}
			}
			updateInventory();
		}

		if (messageType === "CheckSelectItem") {
			const targetIndex = savedData.currentSelectIndex;
			if (savedData.inventoryData.length <= targetIndex) return;
			const itemData = JSON.parse(JSON.stringify(savedData.inventoryData[targetIndex]));

			AddSendToCache(sender, "itemChecked", itemData);
		}

		if (messageType === "CheckHasItem") {
			AddSendToCache(sender, "CheckHasItemReceved", HasTargetItemName(arg));
		}

		if (messageType === "AddMoney") {
			if (savedData.money) {
				savedData.money += arg.count;
			} else {
				savedData.money = arg.count;
			}
			updateInventory();
		}

		if (messageType === "RemoveMoney") {
			savedData.money -= arg.count;
			updateInventory();
		}

		if (messageType === "CheckMoney") {
			if (arg <= savedData.money) {
				AddSendToCache(sender, "MoneyChecked", true);
				//_.sendTo(sender, "MoneyChecked", true);
			} else {
				MissingGoldText.unityProp.text = "ゴールドが足りません！（価格：" + arg + "G）";
				VerticalLayoutMessageAnim.setTrigger("MissingGold");

				AddSendToCache(sender, "MoneyChecked", false);
				//_.sendTo(sender, "MoneyChecked", false);
			}
		}

		if (messageType === "CheckMoneyAndKabanAddable") {
			if (savedData.kabanSize >= 9) {
				AddSendToCache(sender, "MoneyAndKabanChecked", {
					moneyCheck: null,
					kabanSize: false,
				});
				/*
				_.sendTo(sender, "MoneyAndKabanChecked", {
					moneyCheck: null,
					kabanSize: false,
				});
				*/
			} else if (arg > savedData.money) {
				MissingGoldText.unityProp.text = "ゴールドが足りません！（価格：" + arg + "G）";
				VerticalLayoutMessageAnim.setTrigger("MissingGold");
				AddSendToCache(sender, "MoneyAndKabanChecked", {
					moneyCheck: false,
					kabanSize: true,
				});
				/*
				_.sendTo(sender, "MoneyAndKabanChecked", {
					moneyCheck: false,
					kabanSize: true,
				});
				*/
			} else {
				AddSendToCache(sender, "MoneyAndKabanChecked", {
					moneyCheck: true,
					kabanSize: true,
				});
				/*
				_.sendTo(sender, "MoneyAndKabanChecked", {
					moneyCheck: true,
					kabanSize: true,
				});
				*/
			}
		}

		if (messageType === "AddKabanSize") {
			savedData.kabanSize += arg;
			if (savedData.kabanSize > 9) savedData.kabanSize = 9;
			updateInventory();
		}

		if (messageType === "MeteoUIStart") {
			MeteoUI.setEnabled(true);
		}

		if (messageType === "MeteoUIEnd") {
			MeteoUI.setEnabled(false);
			MeteoCompleteUI.setEnabled(false);
			MeteoCompleteUI.setEnabled(true);
		}

		if (messageType === "GetAchiveStatus") {
			if (!savedData.batch) savedData.batch = [];
			//_.sendTo(sender, "ReceveAhiveStatus", { mineLv: savedData.mineLv, batch: savedData.batch });
			AddSendToCache(sender, "ReceveAhiveStatus", { mineLv: savedData.mineLv, batch: savedData.batch });
		}

		if (messageType === "StockOrPickUpItem") {
			const targetIndex = savedData.currentSelectIndex;
			const InputItem = savedData.inventoryData[targetIndex];
			if (!savedData.stockItemData) savedData.stockItemData = [];

			if (InputItem) {
				//アイテムをストックする
				//const stockIndex = savedData.stockItemData
				//.findIndex(n=> n.itemName == stockItem.itemName && n.rarity == stockItem.rarity);
				if (savedData.stockItemData[arg] == null) {
					savedData.stockItemData[arg] = InputItem;
					savedData.inventoryData[targetIndex] = null;
				} else if (
					InputItem.isStackable &&
					savedData.stockItemData[arg].itemName == InputItem.itemName &&
					savedData.stockItemData[arg].rarity == InputItem.rarity
				) {
					savedData.stockItemData[arg].count += InputItem.count;
					savedData.inventoryData[targetIndex] = null;
				} else {
					//収納失敗
					//_.sendTo(followItem, "PlaySound", "Cancel");
					AddSendToCache(followItem, "PlaySound", "Cancel");
					HanyouMessageText.unityProp.text = "アイテムを手に持った状態では取り出せません！";
					VerticalLayoutMessageAnim.setTrigger("Hanyou");
				}
			} else {
				//アイテムを取り出す
				//AddItem(stockItemData);
				savedData.inventoryData[targetIndex] = savedData.stockItemData[arg];
				savedData.stockItemData[arg] = null;
			}

			stockItemSendList.push({
				currentOpenedChest,
				index: arg,
				isPlaySound: true,
			});
			updateInventory();
		}

		if (messageType === "GetStockItemList") {
			currentOpenedChest = sender;
			stockItemSendList = [];
			for (var i = arg.min; i <= arg.max; i++) {
				stockItemSendList.push({
					currentOpenedChest,
					index: i,
				});
			}
		}

		if (messageType === "ClearStockData") {
			savedData.stockItemData = [];
		}

		if (messageType === "GetBatch") {
			if (!savedData.batch) savedData.batch = [];
			savedData.batch.push(arg);
		}

		if (messageType === "GetMineLv") {
			AddSendToCache(sender, "ReceveMineLv", savedData.mineLv);
		}

		_.log("playerReceve:" + messageType + "," + JSON.stringify(arg));
	},
	{ item: true, player: true }
);

const HasTargetItemName = (targetItemName) => {
	for (itemData of savedData.inventoryData) {
		if (itemData == null) continue;
		if (itemData.itemName == targetItemName) {
			return true;
		}
	}
	return false;
};

const AttackCurrentItem = (target) => {
	if (!isCancelableMotion) return;
	if (!followItem) return;

	const targetIndex = savedData.currentSelectIndex;
	if (savedData.inventoryData[targetIndex] == null) {
		AddSendToCache(followItem, "PlaySound", "Cancel");
		VerticalLayoutMessageAnim.setTrigger("CantUseItem");
		isClashEffectOn = false;
		return;
	} else if (savedData.inventoryData[targetIndex].duration == -1) {
		AddSendToCache(followItem, "PlaySound", "Cancel");
		VerticalLayoutMessageAnim.setTrigger("CantUseItem");
		isClashEffectOn = false;
		return;
	} else if (savedData.inventoryData[targetIndex].duration == 0) {
		AddSendToCache(followItem, "PlaySound", "Cancel");
		VerticalLayoutMessageAnim.setTrigger("ItemDurationZero");
		isClashEffectOn = false;
		return;
	}

	multipleAttackCount = 0;
	if (savedData.inventoryData[targetIndex].multipleAttackCount) {
		multipleAttackCount = savedData.inventoryData[targetIndex].multipleAttackCount;
	}
	multipleAttackSpeed = 1;

	AddSendToCache(followItem, "Attack", {
		target: target,
		itemData: savedData.inventoryData[targetIndex],
	});

	if (savedData.inventoryData[targetIndex].swingSound) {
		AddSendToCache(followItem, "PlaySound", savedData.inventoryData[targetIndex].swingSound);
	} else {
		AddSendToCache(followItem, "PlaySound", "Swing");
	}

	//経験値増加
	savedData.mineExp++;
	const nextMineLvExp = GetNextMineLvUpExp();
	if (nextMineLvExp <= savedData.mineExp) {
		savedData.mineLv++;
		//_.sendTo(followItem, "PlaySound", "LvUp");
		AddSendToCache(followItem, "PlaySound", "LvUp");
		HanyouMessageText.unityProp.text =
			"Lv" +
			savedData.mineLv +
			"にレベルアップ！\nプレイ時間ボーナス増加が増加した（90秒につき" +
			savedData.mineLv * salaryMultiple +
			"G）\n金床に入れられる素材の最大数が増加した（" +
			(savedData.mineLv + 10) +
			"コ）";
		VerticalLayoutMessageAnim.setTrigger("Hanyou");
		savedData.mineExp -= nextMineLvExp;
	} else {
		AddMineLevelText.getUnityComponent("Text").unityProp.text = "経験値+1 ( " + savedData.mineExp + " / " + nextMineLvExp + " )";
		VerticalLayoutMessageAnim.setTrigger("AddMineLevel");
	}

	// モーション再生開始
	isPlayingMotion = true;
	isCancelableMotion = false;
	isClashed = false;
	motionTime = 0;
};

const GetNextMineLvUpExp = () => {
	return Math.trunc(10 * Math.pow(1.3, savedData.mineLv - 1));
};

_.onButton(1, (isDown) => {
	if (!isCancelableMotion) return;
	if (isDown) {
		savedData.currentSelectIndex++;
		savedData.currentSelectIndex %= savedData.kabanSize;
		_.log(JSON.stringify(savedData));
		updateInventory();
	}
});

_.onButton(2, (isDown) => {
	if (!isCancelableMotion) return;
	if (isDown) {
		if (dropCoolTime > 0) return;
		dropCoolTime = 0.2;

		if (savedData.inventoryData.length > savedData.currentSelectIndex) {
			//参照渡しを回避
			const dropItem = JSON.parse(JSON.stringify(savedData.inventoryData[savedData.currentSelectIndex]));
			dropItem.count = 1;
			//_.sendTo(followItem, "DropItem", dropItem);
			AddSendToCache(followItem, "DropItem", dropItem);
			updateInventory();
		}
	}
});

let saveTime = 5.0;

_.onFrame((deltaTime) => {
	if (!followItem) return;
	if (saveTime > 0) saveTime -= deltaTime;
	if (dropCoolTime > 0) dropCoolTime -= deltaTime;
	if (salaryCoolTime > 0) {
		salaryCoolTime -= deltaTime;
		BonusSalaryRatioUI.unityProp.fillAmount = (maxSalaryCoolTime - salaryCoolTime) / maxSalaryCoolTime;
	}

	//オートセーブ処理
	if (saveTime <= 0 && isNeedSave && followItem) {
		if (savedData) {
			_.log("savedData:" + JSON.stringify(savedData));

			/*
			if (!savedData.isReplaced) {
				replaceUUIDsWithNanoid(savedData);
				savedData.isReplaced = true;
			}
			*/

			savedData.isCompressed = true;

			const compressedData = (0,_modules_SavedataCompressor_js__WEBPACK_IMPORTED_MODULE_1__.compressJSON)(savedData);
			const compressSize = _.computeSendableSize(JSON.stringify(compressedData));
			_.log("圧縮データ:" + compressSize + "," + JSON.stringify(compressedData));

			/*
			const encodeData = {};
			encodeData.data = encodeBase64(jsonToBinary(JSON.stringify(compressedData)));
			encodeData.encodeBase64 = true;
			const encodeDataSize = _.computeSendableSize(JSON.stringify(encodeData));
			_.log("エンコードデータ:" + encodeDataSize + "," + JSON.stringify(encodeData));
			*/

			//savedData = decompressedData;
			try {
				_.setPlayerStorageData(compressedData);
			} catch {}

			/*
			const jsonString = JSON.stringify(savedData);
			// LZ-Stringで圧縮
			const compressJson = LZString.compressToUTF16(jsonString);
			const compressSize = _.computeSendableSize(compressJson);

			_.log("圧縮後:" + compressSize + "," + compressJson);

			const decompressJson = LZString.decompressFromUTF16(compressJson);
			const decompressSize = _.computeSendableSize(decompressJson);
			// 解凍された文字列をJSONに変換

			_.log("解凍後:" + decompressSize + "," + decompressJson);
			*/
			//_.setPlayerStorageData(savedData);
		}
		saveTime = 5.0;
		isNeedSave = false;
	}

	//StockItemSend処理
	if (stockItemSendList.length > 0) {
		const sender = stockItemSendList[0].currentOpenedChest;
		const index = stockItemSendList[0].index;
		const isPlaySound = stockItemSendList[0].isPlaySound;
		if (!savedData.stockItemData) savedData.stockItemData = [];
		const itemData = savedData.stockItemData.length - 1 >= index ? savedData.stockItemData[index] : null;

		try {
			_.sendTo(sender, "ReceveStockItem", {
				index: index,
				itemData: itemData,
				isPlaySound: isPlaySound,
			});
			stockItemSendList.shift();
		} catch {}
	}

	//SendToCache処理
	if (enableCache) {
		if (sendCacheWaitTime > 0) sendCacheWaitTime -= deltaTime;
		if (sendCacheWaitTime <= 0) {
			const sendToData = sendToCache.shift();
			try {
				_.sendTo(sendToData.targetHandle, sendToData.message, sendToData.arg);
			} catch {
				sendToCache.unshift(sendToData);
				$.log("キャッシュ処理失敗");
			}
			sendCacheWaitTime = 0.1;
			if (sendToCache.length <= 0) {
				enableCache = false;
			}
		}
	}

	//お給料処理
	if (salaryCoolTime <= 0) {
		AddSendToCache(followItem, "PlaySound", "Coin");
		//_.sendTo(followItem, "PlaySound", "Coin");
		savedData.money += savedData.mineLv * salaryMultiple;
		salaryCoolTime = maxSalaryCoolTime;

		HanyouMessageText.unityProp.text = "プレイ時間ボーナスをゲットした！(" + savedData.mineLv * salaryMultiple + "G)";
		VerticalLayoutMessageAnim.setTrigger("Hanyou");
		updateInventory();
	}

	// モーション再生
	if (isPlayingMotion) {
		const targetItem = savedData.inventoryData[savedData.currentSelectIndex];

		let motionMultiple = 1;
		if (targetItem && targetItem.motionMultiple) motionMultiple *= targetItem.motionMultiple;
		motionMultiple *= multipleAttackSpeed;

		motionTime += deltaTime * motionMultiple;
		isPlayingMotion = playMotion(swingAnimation, motionTime);

		if (motionTime > 0.4 - multipleAttackCount * 0.01 && !isClashed) {
			if (isClashEffectOn) {
				AddSendToCache(followItem, "ClashWithEffect", clushItemStatus);
			} else {
				AddSendToCache(followItem, "Clash", null);
			}
			isClashed = true;

			//再クラッシュ可能判定オン
			if (multipleAttackCount > 0) {
				multipleAttackCount--;
				isClashed = false;
				multipleAttackSpeed = 0.06;
			} else {
				multipleAttackSpeed = 1;
			}
		}
	}
});

// 値がある範囲に収まるようにする
const clamp = (x, min, max) => {
	if (x < min) {
		return min;
	} else if (max < x) {
		return max;
	} else {
		return x;
	}
};

// xが0→1になるとき、0→1→0となる値を返す
// 最初からeaseInRateの期間で0→1、最後からeaseOutRateの期間で1→0になる
const easeInOut = (x, easeInRate, easeOutRate) => {
	x = clamp(x, 0, 1);

	let y = 1;

	if (x < easeInRate) {
		y = x / easeInRate;
	} else if (1 - easeOutRate < x) {
		y = (1 - x) / easeOutRate;
	}

	return y;
};

// モーションを適用し、モーションが終わりならfalseを返す
const playMotion = (animation, time) => {
	let animationLength = animation.getLength();
	let continuePlaying = motionTime <= animationLength;

	//モーションが7割終わってたらキャンセル可能
	let motionTimeRatio = motionTime / animationLength;
	isCancelableMotion = motionTimeRatio >= 0.7;

	if (continuePlaying) {
		let pose = animation.getSample(time);

		// 通常モーションとスムーズに切り替わるよう、モーションの始めと終わりでweightが小さくなるようにする
		let timeRate = time / animationLength;
		let weight = easeInOut(timeRate, 0.1, 0.1);

		_.setHumanoidPoseOnFrame(pose, weight);

		// モーション再生は終わっていない
		return true;
	}

	return continuePlaying;
};

function generateUUID() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

const SetRarityByDropChance = (clushItemStatus) => {
	const newItemStatus = clushItemStatus;
	const itemData = savedData.inventoryData[savedData.currentSelectIndex];

	let isDroped = false;
	const rand = Math.random();
	let newDropChance = clushItemStatus.dropChance;
	if (itemData.bonusDropChance) newDropChance += itemData.bonusDropChance;
	if (rand < newDropChance) {
		isDroped = true;
	}

	if (!isDroped) return null;

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

	newItemStatus.rarity = newRarity;
	delete newItemStatus.dropChance;

	return newItemStatus;
};

const AddSendToCache = (targetHandle, message, arg) => {
	sendToCache.push({ targetHandle, message: message, arg: arg });
	enableCache = true;
};

//_.onStart(() => {
savedData = _.getPlayerStorageData();
_.log("rawData:" + JSON.stringify(savedData));

/*
		if (savedData.encodeBase64) {
			savedData = decodeBase64(binaryToHex(savedData.data));
			_.log("decodedデータ:" + JSON.stringify(savedData));
		}
		*/

if (savedData && savedData.isCompressed) {
	const decompressedData = (0,_modules_SavedataCompressor_js__WEBPACK_IMPORTED_MODULE_1__.decompressJSON)(savedData);
	const decompressSize = _.computeSendableSize(JSON.stringify(decompressedData));
	_.log("解凍データ:" + decompressSize + "," + JSON.stringify(decompressedData));
	//_.log("getSaveData:" + JSON.stringify(savedData));
	savedData = decompressedData;
}

if (!savedData) {
	ResetSavedData();
}

if (!savedData.mineExp) savedData.mineExp = 0;
if (!savedData.mineLv) savedData.mineLv = 1;
if (!savedData.money) savedData.money = 0;

updateInventory();

AddSendToCache(lockonMarkerGameStart, "Lockon", null);
//});

})();

/******/ })()
;