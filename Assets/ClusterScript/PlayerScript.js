let grabbedItem = null;
let motionTime = 0;
let isPlayingMotion = false;
let isClashed = false;
let sourceItem = null;
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
let playerSelf = null;

const allItemList = [
	"clystal",
	"cupperOre",
	"goldOre",
	"goldCoinBag",
	"ironOre",
	"trophyCatClystal",
	"trophyCatCupper",
	"trophyCatGold",
	"trophyCatIron",
	"trophyCowClystal",
	"trophyCowCupper",
	"trophyCowGold",
	"trophyCowIron",
	"trophyDeerClystal",
	"trophyDeerCupper",
	"trophyDeerGold",
	"trophyDeerIron",
	"trophyRabbitClystal",
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

const lockonMarkerGameStart = _.worldItemReference("LockonMarkerGameStart");

const updateInventory = () => {
	if (savedData && followItem) {
		let targetSpeed = 1;
		if (savedData.inventoryData[savedData.currentSelectIndex] && savedData.inventoryData[savedData.currentSelectIndex].baseMovementSpeed) {
			targetSpeed = savedData.inventoryData[savedData.currentSelectIndex].baseMovementSpeed;
		}

		if (currentSpeed != targetSpeed) {
			_.sendTo(followItem, "SetDefaultMovementSpeed", targetSpeed);
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

		for (itemName of allItemList) {
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
			itemIcon.setEnabled(true);

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
					unityProp.color = [0, 1, 0.2, 1];
				} else if (durationRatio > 0.3) {
					unityProp.color = [1, 0.8, 0.2, 1];
				} else {
					unityProp.color = [1, 0.2, 0.2, 1];
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
		_.sendTo(followItem, "VisibleItem", targetItemName);

		//特定の子要素を一括で非表示にするみたいなのができない(getChildsみたいなのがない)ので手動で非表示処理
		for (itemName of allItemList) {
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
		} else {
			itemText.unityProp.text = targetItem.itemDisplayName + " " + rarityText + "\nきれいな飾り。" + targetItem.price + "Gで売れる";
		}
	} else {
		_.sendTo(followItem, "VisibleItem", "");
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
	_.sendTo(lockonMarkerGameStart, "Lockon", null);
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
		_.sendTo(followItem, "PlaySound", "Cancel");
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

_.onStart(() => {
	savedData = _.getPlayerStorageData();
	_.log("getSaveData:" + JSON.stringify(savedData));
	if (!savedData) {
		ResetSavedData();
	}

	if (!savedData.mineExp) savedData.mineExp = 0;
	if (!savedData.mineLv) savedData.mineLv = 1;
	if (!savedData.money) savedData.money = 0;

	updateInventory();
	_.sendTo(lockonMarkerGameStart, "Lockon", null);
});

_.onReceive(
	(messageType, arg, sender) => {
		if (messageType === "RegisterFollowItem") {
			followItem = sender;
			_.showButton(1, _.iconAsset("Next"));
			_.showButton(2, _.iconAsset("Drop"));
			updateInventory();
			_.sendTo(lockonMarkerGameStart, "Lockoff", null);
		}

		if (messageType === "UnRegisterFollowItem") {
			Initialize();
		}

		if (messageType === "ResetAllSaveData") {
			ResetSavedData();
			updateInventory();
		}

		if (messageType === "getItem") {
			_.log("receve:getItem");
			const success = AddItem(arg);
			if (success) {
				_.sendTo(sender, "GetItemReceived", null);
			}
			updateInventory();
		}

		if (messageType === "getItemList") {
			for (var itemData of arg) {
				AddItem(itemData);
			}
			_.sendTo(sender, "GetItemReceived", null);
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
			AttackCurrentItem(sender);
		}

		if (messageType === "AttackCurrentItemWithEffect") {
			isClashEffectOn = true;
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

			_.sendTo(sender, "itemRemoved", itemData);

			updateInventory();
		}

		if (messageType === "RemoveSelectItem") {
			const targetIndex = savedData.currentSelectIndex;

			if (savedData.inventoryData.length <= targetIndex) return;
			savedData.inventoryData[targetIndex].count -= arg.count;

			const itemData = JSON.parse(JSON.stringify(savedData.inventoryData[targetIndex]));
			itemData.count = arg.count;

			if (savedData.inventoryData[targetIndex].count <= 0) {
				//test
				//savedData.inventoryData.splice(targetIndex,1);
				savedData.inventoryData[targetIndex] = null;
			}
			_.sendTo(sender, "itemRemoved", itemData);
			updateInventory();
		}

		if (messageType === "consumeItem") {
			const targetIndex = savedData.currentSelectIndex;

			savedData.inventoryData[targetIndex].duration -= arg;

			if (savedData.inventoryData[targetIndex].duration <= 0) {
				savedData.inventoryData[targetIndex].duration = 0;
				_.sendTo(followItem, "PlaySound", "Break");
			}

			updateInventory();
		}

		if (messageType === "RepairItem") {
			_.log("receve:RepairItem:" + arg);

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
			_.sendTo(sender, "itemChecked", itemData);
		}

		if (messageType === "CheckHasItem") {
			_.sendTo(sender, "CheckHasItemReceved", HasTargetItemName(arg));
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
				_.sendTo(sender, "MoneyChecked", true);
			} else {
				MissingGoldText.unityProp.text = "ゴールドが足りません！（価格：" + arg + "G）";
				VerticalLayoutMessageAnim.setTrigger("MissingGold");
				_.sendTo(sender, "MoneyChecked", false);
			}
		}

		if (messageType === "CheckMoneyAndKabanAddable") {
			if (savedData.kabanSize >= 9) {
				_.sendTo(sender, "MoneyAndKabanChecked", {
					moneyCheck: null,
					kabanSize: false,
				});
			} else if (arg > savedData.money) {
				MissingGoldText.unityProp.text = "ゴールドが足りません！（価格：" + arg + "G）";
				VerticalLayoutMessageAnim.setTrigger("MissingGold");
				_.sendTo(sender, "MoneyAndKabanChecked", {
					moneyCheck: false,
					kabanSize: true,
				});
			} else {
				_.sendTo(sender, "MoneyAndKabanChecked", {
					moneyCheck: true,
					kabanSize: true,
				});
			}
		}

		if (messageType === "AddKabanSize") {
			savedData.kabanSize += arg;
			if (savedData.kabanSize > 9) savedData.kabanSize = 9;
			updateInventory();
		}

		if (messageType === "MeteoUIStart") {
			_.log("MeteoUIStart");
			MeteoUI.setEnabled(true);
		}

		if (messageType === "MeteoUIEnd") {
			_.log("MeteoUIEnd");
			MeteoUI.setEnabled(false);
			MeteoCompleteUI.setEnabled(false);
			MeteoCompleteUI.setEnabled(true);
		}

		if (messageType === "GetMineLv") {
			_.sendTo(sender, "ReceveMineLv", savedData.mineLv);
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
					_.sendTo(followItem, "PlaySound", "Cancel");
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
		_.sendTo(followItem, "PlaySound", "Cancel");
		VerticalLayoutMessageAnim.setTrigger("CantUseItem");
		isClashEffectOn = false;
		return;
	} else if (savedData.inventoryData[targetIndex].duration == -1) {
		_.sendTo(followItem, "PlaySound", "Cancel");
		VerticalLayoutMessageAnim.setTrigger("CantUseItem");
		isClashEffectOn = false;
		return;
	} else if (savedData.inventoryData[targetIndex].duration == 0) {
		_.sendTo(followItem, "PlaySound", "Cancel");
		VerticalLayoutMessageAnim.setTrigger("ItemDurationZero");
		isClashEffectOn = false;
		return;
	}

	multipleAttackCount = 0;
	if (savedData.inventoryData[targetIndex].multipleAttackCount) {
		multipleAttackCount = savedData.inventoryData[targetIndex].multipleAttackCount;
	}
	multipleAttackSpeed = 1;

	_.sendTo(followItem, "Attack", {
		target: target,
		itemData: savedData.inventoryData[targetIndex],
	});
	if (savedData.inventoryData[targetIndex].swingSound) {
		_.sendTo(followItem, "PlaySound", savedData.inventoryData[targetIndex].swingSound);
	} else {
		_.sendTo(followItem, "PlaySound", "Swing");
	}

	//経験値増加
	savedData.mineExp++;
	const nextMineLvExp = GetNextMineLvUpExp();
	if (nextMineLvExp <= savedData.mineExp) {
		savedData.mineLv++;
		_.sendTo(followItem, "PlaySound", "LvUp");
		AddMineLevelText.getUnityComponent("Text").unityProp.text = "レベルアップ！採掘Lvが" + savedData.mineLv + "になった！";
		savedData.mineExp -= nextMineLvExp;
	} else {
		AddMineLevelText.getUnityComponent("Text").unityProp.text = "経験値+1 ( " + savedData.mineExp + " / " + nextMineLvExp + " )";
	}
	VerticalLayoutMessageAnim.setTrigger("AddMineLevel");

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
			_.sendTo(followItem, "DropItem", dropItem);
			updateInventory();
		}
	}
});

let saveTime = 5.0;

_.onFrame((deltaTime) => {
	if (saveTime > 0) saveTime -= deltaTime;
	if (dropCoolTime > 0) dropCoolTime -= deltaTime;

	//オートセーブ処理
	if (saveTime <= 0 && isNeedSave && followItem) {
		if (savedData) {
			_.log("savedData:" + JSON.stringify(savedData));
			_.setPlayerStorageData(savedData);
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

	// モーション再生
	if (isPlayingMotion && followItem) {
		const targetItem = savedData.inventoryData[savedData.currentSelectIndex];

		let motionMultiple = 1;
		if (targetItem && targetItem.motionMultiple) motionMultiple *= targetItem.motionMultiple;
		motionMultiple *= multipleAttackSpeed;

		motionTime += deltaTime * motionMultiple;
		isPlayingMotion = playMotion(swingAnimation, motionTime);

		if (motionTime > 0.4 - multipleAttackCount * 0.01 && !isClashed) {
			if (isClashEffectOn) {
				_.sendTo(followItem, "ClashWithEffect", null);
			} else {
				_.sendTo(followItem, "Clash", null);
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
	//_.log(isCancelableMotion);

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
