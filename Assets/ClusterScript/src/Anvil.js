import { allItemList } from "./modules/allItemList.js";
import { InitializeSendCache, ProcessCache, AddSendMessageCache } from "./modules/CacheModule.js";

const damagedSound = $.audio("Metal");
const putonSound = $.audio("Puton");
const completeSound = $.audio("Complete");
const getItemSound = $.audio("GetItem");
const cancelSound = $.audio("Cancel");
const ItemText = $.subNode("ItemText").getUnityComponent("Text");
const usingPlayerText = $.subNode("UsingPlayer").getUnityComponent("Text");
const CraftProgress = $.subNode("CraftProgress").getUnityComponent("Image");
const CraftProgressText = $.subNode("CraftProgressText").getUnityComponent("Text");
const ProgressWaku = $.subNode("ProgressWaku");
const CompleteWaku = $.subNode("CompleteWaku");
const completeItemText = $.subNode("CompleteItemDiscriptionText").getUnityComponent("Text");
const ExpectationItemText = $.subNode("ExpectationItem").getUnityComponent("Text");
const canvas = $.subNode("Canvas");
const countWarning = $.subNode("CountWarning");
const CountWarningItemText = $.subNode("CountWarningItemText").getUnityComponent("Text");
const nothingItemWarning = $.subNode("NothingItemWarning");

const defaultCraftProgressMax = 2;
const extracterUI = $.worldItemReference("ExtracterUI");
const defaultMaxUsableItemCount = 10;

const getPriorityItemName = (usedItemList) => {
	//usedItemListから一番多く使っているアイテムの名前を返す
	let usedItemCountList = [];
	for (item of usedItemList) {
		if (usedItemCountList[item.itemName]) {
			usedItemCountList[item.itemName].count += item.count;
		} else {
			usedItemCountList[item.itemName] = { count: item.count };
		}
	}

	let priorityItemName = "";
	let maxCount = 0;
	for (let itemName in usedItemCountList) {
		if (usedItemCountList[itemName].count > maxCount) {
			maxCount = usedItemCountList[itemName].count;
			priorityItemName = itemName;
		}
	}

	return priorityItemName;
};

const getBasePrice = (usedItemList) => {
	let basePrice = 0;
	for (item of usedItemList) {
		basePrice += item.price;
	}
	return basePrice;
};

const getItemTotalCount = (usedItemList) => {
	let usedItemCount = 0;
	for (item of usedItemList) {
		usedItemCount += item.count;
	}
	return usedItemCount;
};

const getRandomItem = (usedItemList) => {
	$.log(JSON.stringify(usedItemList));

	let newItem = {
		count: 1,
		motionMultiple: 1,
	};

	let priorityItemName = getPriorityItemName(usedItemList);
	let usedItemCount = getItemTotalCount(usedItemList);
	let basePrice = getBasePrice(usedItemList);
	let enchantPower = $.state.enchantPower;

	if (usedItemCount >= 10) {
		newItem.itemName = "turuhashi";
		newItem.itemDisplayName = "つるはし";
		newItem.duration = 10 + $.state.durationPower;
		newItem.maxDuration = 10 + $.state.durationPower;
		newItem.specialEffect = [];
		newItem.baseMovementSpeed = 1;
		newItem.bonusDropChance = 0;
		newItem.luck = 1;
		newItem.craftSpeed = 0;
		newItem.durationReduce = 0;
		newItem.motionMultiple = 1;
		newItem.multipleAttackCount = 0;
		newItem.price = basePrice * 1;
		newItem.attack = 1;
	} else {
		const trophyList = [];
		trophyList.push({ itemName: "trophyRabbit", itemDisplayName: "ウサギ" });
		trophyList.push({ itemName: "trophyCow", itemDisplayName: "ウシ" });
		trophyList.push({ itemName: "trophyDeer", itemDisplayName: "シカ" });
		trophyList.push({ itemName: "trophyCat", itemDisplayName: "ネコ" });

		const rand = Math.trunc(Math.random() * trophyList.length);

		newItem.itemName = trophyList[rand].itemName;
		newItem.itemDisplayName = trophyList[rand].itemDisplayName;
		newItem.duration = -1;
		newItem.maxDuration = -1;
		newItem.price = basePrice * 1.5;
	}

	switch (priorityItemName) {
		case "cupperOre":
			newItem.itemName += "Cupper";
			newItem.itemDisplayName = "銅の" + newItem.itemDisplayName;
			newItem.price *= 3;
			break;
		case "ironOre":
			newItem.itemName += "Iron";
			newItem.itemDisplayName = "鉄の" + newItem.itemDisplayName;
			newItem.price *= 4;

			if (newItem.maxDuration != -1) {
				newItem.duration *= 2;
				newItem.maxDuration *= 2;
			}

			break;
		case "goldOre":
			newItem.itemName += "Gold";
			newItem.itemDisplayName = "金の" + newItem.itemDisplayName;
			newItem.price *= 5;

			if (newItem.maxDuration != -1) {
				newItem.duration *= 3;
				newItem.maxDuration *= 3;
			}

			break;
		case "clystal":
			newItem.itemName += "Clystal";
			newItem.itemDisplayName = "クリスタルの" + newItem.itemDisplayName;
			newItem.price *= 6;

			if (newItem.maxDuration != -1) {
				newItem.duration *= 4;
				newItem.maxDuration *= 4;
			}

			break;

		case "crimsonOre":
			if (newItem.maxDuration != -1) {
				newItem.itemName = "turuhashiEngine";
				newItem.itemDisplayName = "エンジンハンマー";
				newItem = AddSpecialEffectText(newItem, "[固有]発動機", true);
				newItem.multipleAttackCount = 2;
				newItem.swingSound = "SwingEngine";
				newItem.duration *= 2;
				newItem.maxDuration *= 2;
			} else {
				newItem.itemName += "Crimson";
				newItem.itemDisplayName = "クリムゾンの" + newItem.itemDisplayName;
			}
			newItem.price *= 3;
			break;
	}

	newItem.rarity = Math.floor($.state.rarityPower / usedItemCount + Math.random() * 1.2);
	if (newItem.rarity > 5) newItem.rarity = 5;
	if (newItem.rarity < 1) newItem.rarity = 1;

	switch (newItem.rarity) {
		case 2:
			if (newItem.maxDuration != -1) {
				newItem.duration *= 1.3;
				newItem.maxDuration *= 1.3;
				enchantPower *= 1.3;
			}
			newItem.price *= 1.3;
			break;
		case 3:
			if (newItem.maxDuration != -1) {
				newItem.duration *= 1.6;
				newItem.maxDuration *= 1.6;
				enchantPower *= 1.6;
			}
			newItem.price *= 1.6;
			break;
		case 4:
			if (newItem.maxDuration != -1) {
				newItem.duration *= 2;
				newItem.maxDuration *= 2;
				enchantPower *= 2;
			}
			newItem.price *= 2;
			break;
		case 5:
			if (newItem.maxDuration != -1) {
				newItem.duration *= 3;
				newItem.maxDuration *= 3;
				enchantPower *= 3;
			}
			newItem.price *= 3;
			break;
	}

	const statusRand = Math.floor(Math.random() * 3);

	switch (statusRand) {
		case 0:
			newItem.itemDisplayName = "ショボい" + newItem.itemDisplayName;
			newItem.price *= 0.7;
			if (newItem.maxDuration != -1) {
				newItem.duration *= 0.9;
				newItem.maxDuration *= 0.9;
			}
			break;
		case 1:
			newItem.itemDisplayName = "ふつうの" + newItem.itemDisplayName;
			break;
		case 2:
			newItem.itemDisplayName = "上等な" + newItem.itemDisplayName;
			newItem.price *= 1.3;
			if (newItem.maxDuration != -1) {
				newItem.duration *= 1.5;
				newItem.maxDuration *= 1.5;
			}
			break;
	}

	if (newItem.maxDuration != -1) {
		while (enchantPower > 0) {
			const randEnchant = Math.random() * 100;
			if (randEnchant <= enchantPower) {
				newItem = AddRandomSpecialEffect(newItem);
			}
			enchantPower -= 100;
		}
	}

	newItem.price = Math.floor(newItem.price);
	newItem.duration = Math.floor(newItem.duration);
	newItem.maxDuration = Math.floor(newItem.maxDuration);

	if (newItem.duration < 0) newItem.duration = -1;
	if (newItem.maxDuration < 0) newItem.maxDuration = -1;

	return newItem;
};

const AddRandomSpecialEffect = (itemData) => {
	let newItemData = itemData;

	let specialEffectList = [
		"ドロップ鉱石強化",
		"移動速度アップ",
		"ドロップ確率アップ",
		"クラフト速度アップ",
		"耐久力消費軽減",
		"採掘速度アップ",
		"攻撃力アップ",
	];

	for (specialEffectData of itemData.specialEffect) {
		if (specialEffectData.power >= 5) {
			specialEffectList = specialEffectList.filter((n) => n != specialEffectData.effectName);
		}
	}

	if (specialEffectList.length <= 0) return newItemData;
	const randSpecialEffect = Math.floor(Math.random() * specialEffectList.length);
	const targetSpecialEffectName = specialEffectList[randSpecialEffect];

	switch (targetSpecialEffectName) {
		case "ドロップ鉱石強化":
			newItemData = AddSpecialEffectText(newItemData, targetSpecialEffectName);
			newItemData.luck += 1;
			break;
		case "移動速度アップ":
			newItemData = AddSpecialEffectText(newItemData, targetSpecialEffectName);
			newItemData.baseMovementSpeed += 0.4;
			break;
		case "ドロップ確率アップ":
			newItemData = AddSpecialEffectText(newItemData, targetSpecialEffectName);
			newItemData.bonusDropChance += 0.1;
			break;
		case "クラフト速度アップ":
			newItemData = AddSpecialEffectText(newItemData, targetSpecialEffectName);
			newItemData.craftSpeed += 1;
			break;
		case "耐久力消費軽減":
			newItemData = AddSpecialEffectText(newItemData, targetSpecialEffectName);
			newItemData.durationReduce += 1;
			break;
		case "採掘速度アップ":
			newItemData = AddSpecialEffectText(newItemData, targetSpecialEffectName);
			newItemData.motionMultiple += 0.2;
			break;
		case "攻撃力アップ":
			newItemData = AddSpecialEffectText(newItemData, targetSpecialEffectName);
			newItemData.attack += 1;
			break;
	}

	return newItemData;
};

const AddSpecialEffectText = (itemData, effectName, isUnique) => {
	const newItemData = JSON.parse(JSON.stringify(itemData));
	const index = newItemData.specialEffect.findIndex((item) => item.effectName == effectName);

	if (index == -1) {
		newItemData.specialEffect.push({ effectName: effectName, power: 1, isUnique: isUnique });
	} else {
		newItemData.specialEffect[index].power++;
	}

	return newItemData;
};

const updateUsedItemText = () => {
	const usedItemList = $.state.usedItemList;
	const itemCountList = GetItemCountList(usedItemList);
	const itemTotalCount = getItemTotalCount(usedItemList);

	let maxUsableItemCount = $.state.maxUsableItemCount;
	if (!maxUsableItemCount) maxUsableItemCount = "?";

	let text = "使用済みの素材アイテム( " + itemTotalCount + " / " + maxUsableItemCount + " ):\n";
	for (const itemCountData of itemCountList) {
		text += itemCountData.itemDisplayName + " " + itemCountData.count + "コ\n";
	}
	if (itemCountList.length <= 0) {
		text += "なし";
	}

	ItemText.unityProp.text = text;

	let newExpectationText = "";
	if (0 < itemTotalCount) {
		if (itemTotalCount < 10) {
			newExpectationText += "素材が10個以下のため、装飾品を制作します\n";
		} else {
			newExpectationText += "ツルハシを制作します\n";
		}

		let basePrice = getBasePrice(usedItemList);
		newExpectationText += "ベース価格：" + basePrice + "\n";
		newExpectationText += "ベース耐久力：" + $.state.durationPower + "\n";

		let rarityPower = 0;
		if (itemTotalCount > 0) {
			rarityPower = ($.state.rarityPower / itemTotalCount).toFixed(1);
		}
		newExpectationText += "レアリティパワー：" + rarityPower + "\n";
		newExpectationText += "エンチャント追加確率：" + $.state.enchantPower + "%";
	} else {
		//アイテムが1個も入っていないとき
		newExpectationText = "";
	}

	ExpectationItemText.unityProp.text = newExpectationText;
};

const GetItemCountList = (usedItemList) => {
	const itemCountList = [];

	for (const itemData of usedItemList) {
		const index = itemCountList.findIndex(({ itemName }) => itemName === itemData.itemName);
		if (index == -1) {
			itemCountList.push({
				itemName: itemData.itemName,
				itemDisplayName: itemData.itemDisplayName,
				count: itemData.count,
			});
		} else {
			itemCountList[index].count += itemData.count;
		}
	}
	return itemCountList;
};

const updateProgressView = () => {
	const currentCraftProgress = $.state.currentCraftProgress;
	const craftProgressMax = $.state.craftProgressMax;

	CraftProgress.unityProp.fillAmount = currentCraftProgress / craftProgressMax;
	CraftProgressText.unityProp.text = currentCraftProgress + "/" + craftProgressMax;
};

const updateCompleteView = (finishingProductItem) => {
	//手動で非表示処理
	for (itemName of allItemList) {
		$.subNode(itemName).setEnabled(false);
	}

	itemIcon = $.subNode(finishingProductItem.itemName);
	itemIcon.setEnabled(true);

	let rarityText = GetRarityText(finishingProductItem);
	let specialEffectText = GetSpecialEffectText(finishingProductItem);

	if (finishingProductItem.maxDuration != -1) {
		completeItemText.unityProp.text =
			finishingProductItem.itemDisplayName +
			"　" +
			rarityText +
			"\n" +
			"つかえる回数：" +
			finishingProductItem.duration +
			" / " +
			finishingProductItem.maxDuration +
			"\n\n特殊効果：\n" +
			specialEffectText;
	} else {
		completeItemText.unityProp.text = finishingProductItem.itemDisplayName + " " + rarityText + "\n" + "売値：" + finishingProductItem.price;
	}
};

const GetRarityText = (itemData) => {
	let rarityText = "";
	for (var i = 0; i < 5; i++) {
		if (itemData.rarity > i) {
			rarityText += "★";
		} else {
			rarityText += "☆";
		}
	}
	return rarityText;
};

const GetSpecialEffectText = (itemData) => {
	let specialEffectText = "";
	if (itemData.specialEffect && itemData.specialEffect.length > 0) {
		for (const [index, specialEffect] of itemData.specialEffect.entries()) {
			specialEffectText += specialEffect.effectName + RomanNum(specialEffect.power);
			if (index < itemData.specialEffect.length - 1) {
				specialEffectText += ",";
			}
		}
	} else {
		specialEffectText = "なし";
	}

	return specialEffectText;
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

const UpdateCraftPowers = () => {
	let usedItemList = $.state.usedItemList;
	let durationPower = 0;
	let rarityPower = 0;
	let enchantPower = 100;
	let craftProgressMax = defaultCraftProgressMax;

	for (itemData of usedItemList) {
		durationPower += itemData.durationPower ?? 1;
		enchantPower += itemData.enchantPower ?? 1;
		rarityPower += itemData.rarity ?? 1;
		craftProgressMax += itemData.craftDifficulty ?? 1;
	}

	if (enchantPower < 100) enchantPower = 100;

	$.state.durationPower = durationPower;
	$.state.rarityPower = rarityPower;
	$.state.enchantPower = enchantPower;
	$.state.craftProgressMax = craftProgressMax;
};

$.onStart(() => {
	$.state.interactCoolTime = 0;
	$.state.usedItemList = [];
	$.state.spawnDummyItemList = [];
	$.state.usingPlayer = null;
	$.state.removeAllDummyItem = false;
	$.state.removeAllDummyItemWaitTime = 0;
	$.state.contentWarningEnableTime = 0;
	$.state.nothingItemWarningEnableTime = 0;
	$.state.enableCanvas = false;
	$.state.maxUsableItemCount = null;

	InitializeSendCache();

	$.state.currentCraftProgress = 0;
	$.state.craftProgressMax = defaultCraftProgressMax;

	$.state.durationPower = 0;
	$.state.rarityPower = 0;
	$.state.enchantPower = 0;
	$.state.cacheWaitTime = 0;

	updateUsedItemText();
	updateProgressView();
});

$.onReceive(
	(requestName, arg, sender) => {
		if (requestName == "damage") {
			if ($.state.usedItemList.length <= 0) {
				cancelSound.play();
				nothingItemWarning.setEnabled(true);
				$.state.nothingItemWarningEnableTime = 0.4;
				return;
			}

			if ($.state.currentCraftProgress >= $.state.craftProgressMax) return;
			$.sendSignalCompat("this", "damage");
			damagedSound.play();
			//sender.send("ReceiveDamage", 1);
			AddSendMessageCache(sender, "ReceiveDamage", 1);

			let craftSpeed = 1;
			if (arg.craftSpeed) craftSpeed += arg.craftSpeed;

			$.state.currentCraftProgress += craftSpeed;
			if ($.state.currentCraftProgress >= $.state.craftProgressMax) {
				completeSound.play();
				ProgressWaku.setEnabled(false);
				CompleteWaku.setEnabled(true);

				//入っているアイテムで決まる
				$.state.finishingProductItem = getRandomItem($.state.usedItemList);
				updateCompleteView($.state.finishingProductItem);
				$.state.removeAllDummyItem = true;
				$.state.usedItemList = [];
			}
			UpdateCraftPowers();
			updateProgressView();
			updateUsedItemText();
		}

		if (requestName == "itemRemoved") {
			const itemList = $.state.usedItemList;
			itemList.push(arg);
			$.state.usedItemList = itemList;
			SpawnDummyOreItem(arg);
			putonSound.play();
			UpdateCraftPowers();
			updateProgressView();
			updateUsedItemText();
		}

		if (requestName === "itemChecked") {
			if (arg == null) {
				cancelSound.play();
			} else if (arg.maxDuration != -1) {
				//sender.send("AttackCurrentItem", null);
				AddSendMessageCache(sender, "AttackCurrentItem", null);
			} else if (arg.useableAnvil) {
				const itemList = $.state.usedItemList;
				let itemCount = 0;
				for (item of itemList) {
					itemCount += item.count;
				}

				if (!$.state.maxUsableItemCount || itemCount < $.state.maxUsableItemCount) {
					//sender.send("UseSelectItem", 1);
					AddSendMessageCache(sender, "UseSelectItem", 1);
					$.state.usingPlayer = sender;
				} else {
					CountWarningItemText.unityProp.text = "アイテムは" + $.state.maxUsableItemCount + "個までしか入れられません！";
					countWarning.setEnabled(true);
					$.state.contentWarningEnableTime = 0.4;
					cancelSound.play();
				}
			} else {
				cancelSound.play();
			}
		}

		if (requestName === "Extract") {
			const usingPlayer = $.state.usingPlayer;
			const usedItemList = $.state.usedItemList;

			const targetItemData = usedItemList.pop();
			if (targetItemData) {
				try {
					usingPlayer.send("getItem", targetItemData);
				} catch {}
			}
			usedItemList.push(targetItemData);
		}

		if (requestName === "GetItemReceived") {
			getItemSound.play();

			let usedItemList = $.state.usedItemList;
			const index = usedItemList.findIndex((item) => item.uuid == arg.uuid);
			if (index != -1) {
				usedItemList.splice(index, 1);
				RemoveDummyItemToName(arg.itemName);
			}

			if (usedItemList.length <= 0) {
				removeUsingPlayer();
			}

			$.state.usedItemList = usedItemList;
			UpdateCraftPowers();
			updateUsedItemText();
			updateProgressView();
		}

		if (requestName === "GetItemFailed") {
			$.state.sendGetFinishingItem = false;
		}

		if (requestName === "ReceveMineLv") {
			$.state.maxUsableItemCount = defaultMaxUsableItemCount + arg;
		}

		$.log("receve:" + (requestName || "null") + "," + JSON.stringify(arg));
	},
	{ item: true, player: true }
);

const SpawnDummyOreItem = (itemData) => {
	let addPositon = new Vector3(0, 1.5, 0);
	let spawnPosition = $.getPosition().clone().Add(addPositon);

	const usedItem = new WorldItemTemplateId(itemData.itemName);
	let followingItem = $.createItem(usedItem, spawnPosition, $.getRotation());

	const spawnDummyItemList = $.state.spawnDummyItemList;
	spawnDummyItemList.push({
		itemName: itemData.itemName,
		itemHandle: followingItem,
	});
	$.state.spawnDummyItemList = spawnDummyItemList;
};

const RemoveDummyItemToName = (itemName) => {
	const dummyItemList = $.state.spawnDummyItemList;
	let index = dummyItemList.findIndex((item) => item.itemName == itemName);

	if (index != -1) {
		AddSendMessageCache(dummyItemList[index].itemHandle, "ForceDestory", null);
		dummyItemList.splice(index, 1);
	}

	$.state.spawnDummyItemList = dummyItemList;
};

const removeUsingPlayer = () => {
	$.log("removeUsingPlayer");
	$.state.usingPlayer = null;
	$.state.removeAllDummyItem = true;
	$.state.currentCraftProgress = 0;
	$.state.craftProgressMax = defaultCraftProgressMax;
	$.state.finishingProductItem = null;
	$.state.usedItemList = [];
	$.state.maxUsableItemCount = null;
	$.state.sendGetFinishingItem = false;
	ProgressWaku.setEnabled(true);
	CompleteWaku.setEnabled(false);
	updateProgressView();
	updateUsedItemText();
};

$.onUpdate((deltaTime) => {
	$.state.contentWarningEnableTime -= deltaTime;
	$.state.nothingItemWarningEnableTime -= deltaTime;
	$.state.interactCoolTime -= deltaTime;
	$.state.removeAllDummyItemWaitTime -= deltaTime;

	if ($.state.contentWarningEnableTime <= 0) {
		countWarning.setEnabled(false);
	}

	if ($.state.nothingItemWarningEnableTime <= 0) {
		nothingItemWarning.setEnabled(false);
	}

	if ($.getPlayersNear($.getPosition(), 3).length >= 1 && !$.state.enableCanvas) {
		canvas.setEnabled(true);
		//extracterUI.send("SetEnable", true);
		AddSendMessageCache(extracterUI, "SetEnable", { enabled: true });
		$.state.enableCanvas = true;
	} else if ($.getPlayersNear($.getPosition(), 3).length <= 0 && $.state.enableCanvas) {
		canvas.setEnabled(false);
		//extracterUI.send("SetEnable", false);
		AddSendMessageCache(extracterUI, "SetEnable", { enabled: false });
		$.state.enableCanvas = false;
	}

	if ($.state.usingPlayer && !$.state.usingPlayer.exists()) {
		removeUsingPlayer();
	}

	if ($.state.usingPlayer) {
		const distance = $.state.usingPlayer.getPosition().clone().sub($.getPosition()).length();

		if (distance > 7) {
			$.state.usingPlayerRemoveTime -= deltaTime;
		} else {
			$.state.usingPlayerRemoveTime = 60;
		}

		if ($.state.usingPlayerRemoveTime <= 0) {
			removeUsingPlayer();
		}
	}

	//ダミーアイテム削除処理
	if ($.state.removeAllDummyItem && $.state.removeAllDummyItemWaitTime <= 0) {
		const spawnDummyItemList = $.state.spawnDummyItemList;

		if (spawnDummyItemList.length > 0) {
			const dummyItemData = spawnDummyItemList.pop();
			if (dummyItemData) {
				try {
					dummyItemData.itemHandle.send("ForceDestory", null);
				} catch {
					spawnDummyItemList.push(dummyItemData);
				}
			}
		} else {
			$.state.removeAllDummyItem = false;
		}

		$.state.spawnDummyItemList = spawnDummyItemList;
		$.state.removeAllDummyItemWaitTime = 0.01;
	}

	ProcessCache(deltaTime);

	//未使用化処理
	if ($.state.usingPlayer && $.state.usingPlayer != null && $.state.usingPlayer.exists()) {
		usingPlayerText.unityProp.text = $.state.usingPlayer.userDisplayName + "が使用中";
	} else {
		usingPlayerText.unityProp.text = "使用可能";
	}
});

$.onInteract((player) => {
	if ($.state.interactCoolTime > 0) return;
	$.state.interactCoolTime = 0.3;

	//使用中のプレイヤーじゃなければ触れない
	if ($.state.usingPlayer != null && $.state.usingPlayer.id != player.id && $.state.usingPlayer.exists()) return;

	if (!$.state.sendGetFinishingItem && $.state.currentCraftProgress >= $.state.craftProgressMax) {
		AddSendMessageCache(player, "getItem", $.state.finishingProductItem);
		$.state.sendGetFinishingItem = true;
		return;
	}

	AddSendMessageCache(player, "CheckSelectItem", null);
	if (!$.state.maxUsableItemCount) {
		AddSendMessageCache(player, "GetMineLv", null);
	}
});
