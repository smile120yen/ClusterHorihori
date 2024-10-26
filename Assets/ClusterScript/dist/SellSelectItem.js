/******/ (() => { // webpackBootstrap
/*!*******************************!*\
  !*** ./src/SellSelectItem.js ***!
  \*******************************/
const pickupSound = $.audio("Pickup");
const sellItemSound = $.audio("SellItem");
const sellerText = $.subNode("FukidashiText").getUnityComponent("Text");
const canvas = $.subNode("FukidashiCanvas");

$.onStart(() => {
	$.state.isCheckItemPrice = false;
	$.state.checkedItem = null;
	$.state.resetCooldownTime = 5;
	sellerText.unityProp.text = "まいど！\nどんなアイテムでも買い取るぜ";

	canvas.setEnabled(false);
	$.state.enableCanvas = false;
});

$.onInteract((player) => {
	player.send("CheckSelectItem", null);
});

$.onReceive(
	(requestName, arg, sender) => {
		if (requestName == "itemChecked") {
			if (!arg) return;
			if (arg.uuid == $.state.checkedItemUUID) {
				sellerText.unityProp.text = "まいどあり！";
				sender.send("RemoveSelectItem", { count: arg.count });
				sender.send("AddMoney", { count: arg.count * arg.price });
				sellItemSound.play();
			} else {
				pickupSound.play();
				if (!arg.price) arg.price = 0;
				sellerText.unityProp.text = arg.itemDisplayName + "を" + arg.count + "コ売ってくれるのかい？\nそれなら" + arg.price * arg.count + "Gでどうだ";
			}
			$.state.isCheckItemPrice = true;
			$.state.checkedItemUUID = arg.uuid;
		}

		$.log("receve:" + (requestName || "null") + "," + JSON.stringify(arg));
	},
	{ item: true, player: true }
);

$.onUpdate((deltaTime) => {
	if ($.getPlayersNear($.getPosition(), 3).length >= 1 && !$.state.enableCanvas) {
		canvas.setEnabled(true);
		$.state.enableCanvas = true;
	} else if ($.getPlayersNear($.getPosition(), 3).length <= 0 && $.state.enableCanvas) {
		canvas.setEnabled(false);
		$.state.enableCanvas = false;
	}

	if ($.state.isCheckItemPrice) {
		let cooldown = $.state.resetCooldownTime;
		cooldown -= deltaTime;

		if (cooldown <= 0) {
			sellerText.unityProp.text = "まいど！\nどのアイテムを売ってくれるんだ？";
			$.state.isCheckItemPrice = false;
			$.state.checkedItemUUID = null;
		}
	}
});

/******/ })()
;