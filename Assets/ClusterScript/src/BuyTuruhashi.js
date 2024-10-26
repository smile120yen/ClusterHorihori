const pickupSound = $.audio("Pickup");
const buyItemSound = $.audio("BuyItem");
const cancelSound = $.audio("Cancel");
const canvas = $.subNode("DetailCanvas");

const buyItemName = "エンジンハンマー";
const buyPrice = 2000;

// @field(string)
const itemName = "turuhashiEngine";
// @field(string)
const itemDisplayName = "エンジンハンマー";
// @field(int)
const duration = 30;
// @field(int)
const maxDuration = 30;
// @field(float)
const motionMultiple = 1;
// @field(int)
const rarity = 3;
const specialEffect = [{ effectName: "[固有]発動機", power: 2, isUnique: true }];
// @field(int)
const count = 1;
// @field(int)
const price = 2000;
// @field(bool)
const useableAnvil = false;
// @field(int)
const totalMergeCount = 0;
// @field(int)
const multipleAttackCount = 2;
// @field(string)
const swingSound = "SwingEngine";

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
					motionMultiple: motionMultiple,
					rarity: rarity,
					specialEffect: specialEffect,
					count: count,
					price: price,
					useableAnvil: useableAnvil,
					totalMergeCount: totalMergeCount,
					multipleAttackCount: multipleAttackCount,
					swingSound: swingSound,
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
