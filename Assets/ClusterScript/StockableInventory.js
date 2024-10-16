const chest = $.worldItemReference("Chest");
const allItemList = [
	"cupperOre",
	"clystal",
	"ironOre",
	"goldOre",
	"turuhashiNormal",
	"turuhashiGold",
	"turuhashiIron",
	"turuhashiCupper",
	"turuhashiClystal",
	"turuhashiEngine",
	"trophyRabbitCupper",
	"trophyRabbitIron",
	"trophyRabbitGold",
	"trophyRabbitClystal",
	"goldCoinBag",
];
const putinSound = $.audio("Putin");

$.onStart(() => {
	$.state.interactCoolTime = 0;
	$.state.usingPlayerId = null;
	$.state.itemData = null;
	$.state.chestIndex = 0;
});

$.onInteract((player) => {
	if ($.state.interactCoolTime > 0) return;
	$.state.interactCoolTime = 0.3;
	//使用中のプレイヤーじゃなければ触れない
	if (player.id != $.state.usingPlayerId) return;
	player.send("StockOrPickUpItem", $.state.chestIndex);
});

$.onUpdate((deltaTime) => {
	if ($.state.interactCoolTime > 0) $.state.interactCoolTime -= deltaTime;
});

$.onReceive(
	(requestName, arg, sender) => {
		if (requestName === "ViewItemData") {
			$.state.usingPlayerId = arg.sendPlayerId;

			if (
				arg.isPlaySound &&
				(!$.state.itemData ||
					!arg.itemData ||
					$.state.itemData.count != arg.itemData.count)
			) {
				putinSound.play();
			}
			if (arg.itemData) {
				$.state.itemData = arg.itemData;
			} else {
				$.state.itemData = null;
			}

			$.state.chestIndex = arg.index;

			UpdateView();
		}
	},
	{ item: true, player: true }
);

const UpdateView = () => {
	const itemData = $.state.itemData;

	for (itemName of allItemList) {
		const itemIcon = $.subNode(itemName);
		itemIcon.setEnabled(false);
	}

	const itemDurationBack = $.subNode("DurationBack");
	const itemDuration = $.subNode("Duration");
	const breakedView = $.subNode("Breaked");
	const inventoryCount = $.subNode("InventoryCount");
	itemDuration.setEnabled(false);
	itemDurationBack.setEnabled(false);
	breakedView.setEnabled(false);
	inventoryCount.setEnabled(false);

	//すべてのレア度表記を非表示
	for (let i = 1; i <= 5; i++) {
		const auraIcon = $.subNode(i);
		auraIcon.setEnabled(false);
	}

	if (itemData != null) {
		const itemIcon = $.subNode(itemData.itemName);
		itemIcon.setEnabled(true);

		const duration = itemData.duration;
		const maxDuration = itemData.maxDuration;
		const rarity = itemData.rarity;

		if (rarity) {
			const auraIcon = $.subNode(rarity);
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
				unityProp.color = [0, 1, 0.2, 1];
			} else if (durationRatio > 0.3) {
				unityProp.color = [1, 0.8, 0.2, 1];
			} else {
				unityProp.color = [1, 0.2, 0.2, 1];
			}

			unityProp.fillAmount = durationRatio;
		}
		if (itemData.isStackable) {
			inventoryCount.setEnabled(true);
			inventoryCount.getUnityComponent("Text").unityProp.text =
				`${itemData.count}`;
		} else {
			inventoryCount.setEnabled(false);
		}
	}
};
