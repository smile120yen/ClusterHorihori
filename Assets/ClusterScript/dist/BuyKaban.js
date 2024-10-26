/******/ (() => { // webpackBootstrap
/*!*************************!*\
  !*** ./src/BuyKaban.js ***!
  \*************************/
const pickupSound = $.audio("Pickup");
const buyItemSound = $.audio("BuyItem");
const cancelSound = $.audio("Cancel");
const canvas = $.subNode("DetailCanvas");

const buyItemName = "カバン拡張";
const buyItemDiscription = "インベントリを1マス拡張する(最大9マスまで)";
const price = 1000;

$.onStart(() => {
	Initialize();
});

$.onInteract((player) => {
	player.send("CheckMoneyAndKabanAddable", price);
});

$.onReceive(
	(requestName, arg, sender) => {
		if (requestName == "MoneyAndKabanChecked") {
			$.state.isCheckItemPrice = true;
			if (arg.moneyCheck && arg.kabanSize) {
				buyItemSound.play();
				sender.send("RemoveMoney", { count: price });
				sender.send("AddKabanSize", 1);
			} else if (!arg.kabanSize) {
				cancelSound.play();
			} else {
				cancelSound.play();
			}
		}

		$.log("receve:" + (requestName || "null") + "," + JSON.stringify(arg));
	},
	{ item: true, player: true }
);

$.onUpdate((deltaTime) => {
	const nearPlayerLength = $.getPlayersNear($.getPosition(), 3).length;
	if (nearPlayerLength >= 1 && !$.state.enableCanvas) {
		canvas.setEnabled(true);
		$.state.enableCanvas = true;
	} else if (nearPlayerLength <= 0 && $.state.enableCanvas) {
		canvas.setEnabled(false);
		$.state.enableCanvas = false;
	}

	if ($.state.isCheckItemPrice) {
		let cooldown = $.state.resetCooldownTime;
		cooldown -= deltaTime;
		$.state.resetCooldownTime = cooldown;

		if (cooldown <= 0) {
			Initialize();
		}
	}
});

const Initialize = () => {
	$.state.isCheckItemPrice = false;
	$.state.resetCooldownTime = 5;
};

/******/ })()
;