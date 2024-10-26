/******/ (() => { // webpackBootstrap
/*!*************************************!*\
  !*** ./src/PlayerGrabberSpawner.js ***!
  \*************************************/
const playerFollowItem = new WorldItemTemplateId("GrabItem");
const spawnPoint = $.subNode("SpawnPoint");

$.onStart(() => {
	$.state.currentSpawnItem = null;
	$.state.sendMessageCache = [];
	$.state.checkCoolTime = 20;
	$.state.cacheWaitTime = 0;
	createGrabItem();
});

$.onReceive((messageType, arg, sender) => {
	if (messageType == "SpawnNewGrabItem") {
		createGrabItem();
	}

	$.log("receve:" + (messageType || "null") + "," + JSON.stringify(arg));
});

$.onUpdate((deltaTime) => {
	let cooltime = $.state.checkCoolTime;
	cooltime -= deltaTime;
	if (cooltime <= 0) {
		if (!$.state.currentSpawnItem) {
			createGrabItem();
		}

		if ($.state.currentSpawnItem && !$.state.currentSpawnItem.exists()) {
			createGrabItem();
		}
		cooltime = 20;
	}
	$.state.checkCoolTime = cooltime;

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

const createGrabItem = () => {
	const grabItem = $.createItem(playerFollowItem, spawnPoint.getGlobalPosition(), $.getRotation());
	$.state.currentSpawnItem = grabItem;
	AddSendMessageCache(grabItem, "RegisterGrabItemSpawner", null);
	//grabItem.send("RegisterGrabItemSpawner", null);
};

const AddSendMessageCache = (targetHandle, message, arg) => {
	let currentCache = $.state.sendMessageCache;
	if (!currentCache) currentCache = [];
	currentCache.push({ targetHandle, message, arg });
	$.state.sendMessageCache = currentCache;
};

/******/ })()
;