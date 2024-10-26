const pickupSound = $.audio("Pickup");
const buyItemSound = $.audio("BuyItem");
const cancelSound = $.audio("Cancel");
const canvas = $.subNode("DetailCanvas");

const buyItemName = "金貨袋";
const buyPrice = 1050;

// @field(string)
const itemName = "goldCoinBag";
// @field(string)
const itemDisplayName = "1000Gの金貨袋";
// @field(int)
const duration = -1;
// @field(int)
const maxDuration = -1;
// @field(int)
const rarity = 3;
// @field(int)
const count = 1;
// @field(int)
const price = 1000;
// @field(bool)
const useableAnvil = false;

$.onStart(() => {
	Initialize();
});

$.onInteract((player) => {
	player.send("CheckMoney", buyPrice);
});

$.onReceive(
	(requestName, arg, sender) => {
		if (requestName == "MoneyChecked") {
			$.state.isCheckItemPrice = true;
			if (arg) {
				const targetItemData = {
					itemName: itemName,
					itemDisplayName: itemDisplayName,
					duration: duration,
					maxDuration: maxDuration,
					rarity: rarity,
					count: count,
					price: price,
					useableAnvil: useableAnvil,
				};
				sender.send("getItem", targetItemData);
			} else {
				cancelSound.play();
			}
		}

		if (requestName == "GetItemReceived") {
			buyItemSound.play();
			sender.send("RemoveMoney", { count: buyPrice });
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
