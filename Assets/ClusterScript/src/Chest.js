const productId = "5691f52c-6614-4f89-a10b-031b37ec9af0";
const visualAnim = $.subNode("Visual").getUnityComponent("Animator");
const collider = $.subNode("Collider");
const openSound = $.audio("Open");
const closeSound = $.audio("Close");
const cooltimeMax = 0.2;
const canvas = $.subNode("Canvas");
const usingPlayerText = $.subNode("UsingPlayer").getUnityComponent("Text");
const chestIndexText = $.subNode("ChestIndexText").getUnityComponent("Text");
const defaultChestSize = 3;
const maxChestSize = 10;

$.onStart(() => {
	$.state.cooltime = 0;
	$.state.isCoolTime = false;
	$.state.isOpen = false;
	$.state.stockViewSendDataList = [];
	$.state.stockPlayerSendDataList = [];
	$.state.usingPlayer = null;
	$.state.chestIndex = 1;
	$.state.chestSize == null;
	visualAnim.setBool("Open", false);
});

$.onReceive(
	(messageType, arg, sender) => {
		if (messageType === "ReceveStockItem") {
			let stockViewSendDataList = $.state.stockViewSendDataList;
			arg.sendPlayerId = sender.id;
			stockViewSendDataList.push(arg);
			$.state.stockViewSendDataList = stockViewSendDataList;
		}

		if (messageType === "Next") {
			if ($.state.chestSize == null) return;
			$.state.chestIndex++;
			if ($.state.chestIndex > $.state.chestSize) $.state.chestIndex = 1;
			SendGetStockItemList($.state.usingPlayer);
		}

		if (messageType === "Prev") {
			if ($.state.chestSize == null) return;
			$.state.chestIndex--;
			if ($.state.chestIndex <= 0) $.state.chestIndex = $.state.chestSize;
			SendGetStockItemList($.state.usingPlayer);
		}

		$.log("receve:" + (messageType || "null") + "," + JSON.stringify(arg));
	},
	{ item: true, player: true }
);

const SetupPlayerChestSize = (player) => {
	$.state.chestSize = null;
	$.getOwnProducts(productId, [player], "");
};

$.onGetOwnProducts((ownProducts, meta, errorReason) => {
	let total = 0;
	for (let ownProduct of ownProducts) {
		total += ownProduct.plusAmount - ownProduct.minusAmount;
	}

	$.state.chestSize = Math.min(defaultChestSize + total, maxChestSize);
});

const SendGetStockItemList = () => {
	const min = ($.state.chestIndex - 1) * 6;
	const max = ($.state.chestIndex - 1) * 6 + 5;

	let stockPlayerSendDataList = $.state.stockPlayerSendDataList;
	stockPlayerSendDataList.push({ min: min, max: max });
	$.state.stockPlayerSendDataList = stockPlayerSendDataList;
};

$.onInteract((player) => {
	if (!$.state.isCoolTime) {
		if (!$.state.isOpen) {
			$.state.chestIndex = 1;
			SendGetStockItemList(player);
			OpenChest(player);
			SetupPlayerChestSize(player);
		}
		$.state.isCoolTime = true;
		$.state.cooltime = cooltimeMax;
	}
});

$.onUpdate((deltaTime) => {
	//離れたら閉じる
	if ($.state.usingPlayer != null && $.state.usingPlayer.exists()) {
		const distance = $.state.usingPlayer.getPosition().clone().sub($.getPosition()).length();
		if (distance > 3) {
			CloseChest();
		}
	} else if ($.state.isOpen) {
		CloseChest();
	}

	if ($.state.chestSize) {
		chestIndexText.unityProp.text = $.state.chestIndex + " / " + $.state.chestSize;
	}

	if ($.state.stockPlayerSendDataList.length > 0) {
		let stockPlayerSendDataList = $.state.stockPlayerSendDataList;
		const targetStockData = stockPlayerSendDataList.shift();

		try {
			$.state.usingPlayer.send("GetStockItemList", {
				min: targetStockData.min,
				max: targetStockData.max,
			});
			$.state.stockViewSendDataList = [];
		} catch {
			stockPlayerSendDataList.unshift(targetStockData);
			$.log("キャッシュ処理失敗");
		}

		$.state.stockPlayerSendDataList = stockPlayerSendDataList;
	}

	//ストックされてる更新データをViewに送る
	if ($.state.stockViewSendDataList.length > 0) {
		let stockViewSendDataList = $.state.stockViewSendDataList;
		const targetStockData = stockViewSendDataList.shift();
		const index = targetStockData.index % 6;

		if (targetStockData.isPlaySound) {
			targetStockData.isPlaySound = true;
		}

		try {
			$.worldItemReference("Waku0" + index).send("ViewItemData", targetStockData);
		} catch (e) {
			stockViewSendDataList.unshift(targetStockData);
			$.log("キャッシュ処理失敗");
		}

		$.state.stockViewSendDataList = stockViewSendDataList;
	}

	if ($.state.isCoolTime) {
		$.state.cooltime -= deltaTime;
		if ($.state.cooltime <= 0) {
			$.state.isCoolTime = false;
		}
	}
});

const OpenChest = (player) => {
	$.state.isOpen = true;
	visualAnim.setBool("Open", true);
	openSound.play();
	$.setStateCompat("this", "ActiveCollider", true);
	canvas.setEnabled(true);
	$.state.usingPlayer = player;
	collider.setEnabled(false);
	usingPlayerText.unityProp.text = player.userDisplayName + "が使用中";
};

const CloseChest = () => {
	$.state.isOpen = false;
	visualAnim.setBool("Open", false);
	closeSound.play();
	$.setStateCompat("this", "ActiveCollider", false);
	canvas.setEnabled(false);
	$.state.usingPlayer = null;
	collider.setEnabled(true);
};
