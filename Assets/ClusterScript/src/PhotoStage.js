import { allItemList } from "./modules/allItemList.js";
import { GetItemDiscriptionText } from "./modules/GetItemDiscriptionTextModule.js";
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
		for (itemName of allItemList) {
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
			$.subNode("ItemDiscription").getUnityComponent("Text").unityProp.text = GetItemDiscriptionText(arg) + "\n\n価格：" + arg.price + "G\n" + durationText;
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
