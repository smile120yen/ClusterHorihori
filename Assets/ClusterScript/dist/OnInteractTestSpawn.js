/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/*!************************************!*\
  !*** ./src/OnInteractTestSpawn.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_CacheModule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/CacheModule.js */ "./src/modules/CacheModule.js");

const dropKousekiItem = new WorldItemTemplateId("DropKouseki");

$.onStart(() => {
	$.state.count = 0;
});

$.onInteract((player) => {
	let position = $.getPosition();

	for (var i = 0; i < 100; i++) {
		let spawnPosition = position.clone().add(new Vector3(3 + 0.01 * $.state.count, 0.7, 0));

		try {
			let followingItem = $.createItem(dropKousekiItem, spawnPosition, $.getRotation());
			$.state.count++;
			$.log($.state.count);
		} catch {
			$.log("spawn failed");
		}
	}
});

})();

/******/ })()
;