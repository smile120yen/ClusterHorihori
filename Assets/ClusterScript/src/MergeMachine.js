//Extracter設定
const extracterUI = $.worldItemReference("ExtracterUI");

//音声
const damagedSound = $.audio("Metal");
const putonSound = $.audio("Puton");
const completeSound = $.audio("Complete");
const getItemSound = $.audio("GetItem");
const cancelSound = $.audio("Cancel");
const confirmedSound = $.audio("Confirmed");
const rouletSound = $.audio("Roulet");
const completeDisplaySound = $.audio("CompleteDisplay");
const mergeFailed = $.audio("MergeFailed");

const titleText = $.subNode("TitleText").getUnityComponent("Text");
const discriptionText = $.subNode("DiscriptinText").getUnityComponent("Text");
const costText = $.subNode("CostText").getUnityComponent("Text");
const itemUsingPlayerText = $.subNode("ItemUsingPlayerText").getUnityComponent("Text");
const warningText = $.subNode("WarningText").getUnityComponent("Text");
const canvas = $.subNode("Canvas");

$.onStart(() => {
	$.state.interactCoolTime = 0;
	$.state.usingPlayer = null;
	$.state.completeMerge = false;
	$.state.finishingProductItem = null;
	$.state.usedItemList = [];
	$.state.spawnDummyItemList = [];
	$.state.spawnDummyItemComplete = null;
	$.state.confirmedCount = 0;
	$.state.isMergeing = false;
	$.state.isMergeSuccess = false;
	$.state.mergeingTime = 0;
	$.state.removeAllDummyItem = false;
	$.state.removeAllDummyItemWaitTime = 0;
	$.state.mergeCost = 0;
	$.state.breakChance = 0;
	removeUsingPlayer();
	UpdateUI();
});

$.onReceive(
	(requestName, arg, sender) => {
		//使用可能なアイテムなら使用する
		if (requestName === "itemChecked") {
			if (arg.maxDuration != -1) {
				sender.send("UseSelectItem", 1);
				$.state.usingPlayer = sender;
				itemUsingPlayerText.unityProp.text = sender.userDisplayName + "が使用中";
			} else {
				cancelSound.play();
			}
		}

		//アイテムを消費した
		if (requestName == "itemRemoved") {
			const itemList = $.state.usedItemList;
			itemList.push(arg);
			$.state.usedItemList = itemList;
			SpawnDummyTuruhashi(arg, itemList.length);
			putonSound.play();
			UpdateUI();
		}

		if (requestName === "Extract") {
			if ($.state.isMergeing || $.state.completeMerge) {
				cancelSound.play();
				return;
			}
			const usingPlayer = $.state.usingPlayer;
			const usedItemList = $.state.usedItemList;
			$.state.confirmedCount = 0;

			const targetItemData = usedItemList.pop();
			if (targetItemData) {
				try {
					usingPlayer.send("getItem", targetItemData);
					RemoveDummyTuruhashiByUUID(targetItemData.uuid);
					getItemSound.play();
				} catch {
					usedItemList.push(targetItemData);
				}
			}
			if (usedItemList.length <= 0) {
				removeUsingPlayer();
			}

			$.state.usedItemList = usedItemList;
			UpdateUI();
		}

		if (requestName == "MoneyChecked") {
			if (arg) {
				if ($.state.confirmedCount <= 1) {
					confirmedSound.play();
					$.state.confirmedCount += 1;
					UpdateUI();
					return;
				} else if ($.state.confirmedCount >= 2) {
					try {
						sender.send("RemoveMoney", { count: $.state.mergeCost });
						OnStartMerge();
						UpdateUI();
					} catch {}
					return;
				}
			} else {
				cancelSound.play();
				UpdateUI();
				return;
			}
		}

		$.log("receve:" + (requestName || "null") + "," + JSON.stringify(arg));
	},
	{ item: true, player: true }
);

$.onUpdate((deltaTime) => {
	if ($.state.interactCoolTime > 0) $.state.interactCoolTime -= deltaTime;
	if ($.state.mergeingTime > 0 && $.state.isMergeing) {
		$.state.mergeingTime -= deltaTime;
		if ($.state.mergeingTime <= 0) {
			$.state.completeMerge = true;
			OnMergeComplete();
			UpdateUI();
		}
	}

	const nearPlayerLength = $.getPlayersNear($.getPosition(), 3).length;
	if (nearPlayerLength >= 1 && !$.state.enableCanvas) {
		canvas.setEnabled(true);
		extracterUI.send("SetEnable", true);
		$.state.enableCanvas = true;
	} else if (nearPlayerLength <= 0 && $.state.enableCanvas) {
		canvas.setEnabled(false);
		extracterUI.send("SetEnable", false);
		$.state.enableCanvas = false;
	}

	if ($.state.removeAllDummyItemWaitTime > 0) $.state.removeAllDummyItemWaitTime -= deltaTime;
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
		$.state.removeAllDummyItemWaitTime = 0.1;
	}
});

$.onInteract((player) => {
	if ($.state.interactCoolTime > 0) return;
	$.state.interactCoolTime = 0.3;

	const itemList = $.state.usedItemList;

	//使用中のプレイヤーじゃなければ触れない
	if ($.state.usingPlayer != null && $.state.usingPlayer.id != player.id && $.state.usingPlayer.exists()) return;

	if ($.state.completeMerge && $.state.isMergeSuccess) {
		try {
			player.send("getItem", $.state.finishingProductItem);

			const dummyItem = $.state.spawnDummyItemComplete;
			const spawnDummyItemList = $.state.spawnDummyItemList;
			spawnDummyItemList.push({ itemHandle: dummyItem });
			$.state.spawnDummyItemList = spawnDummyItemList;

			removeAllDummyItem = true;
			getItemSound.play();
			removeUsingPlayer();
			UpdateUI();
		} catch {}
		return;
	} else if ($.state.completeMerge && !$.state.isMergeSuccess) {
		getItemSound.play();
		removeUsingPlayer();
		UpdateUI();
	} else if (itemList.length >= 2) {
		player.send("CheckMoney", $.state.mergeCost);
	} else if (itemList.length < 2) {
		player.send("CheckSelectItem", null);
	}
});

const OnStartMerge = () => {
	const MergeingParticle = $.subNode("MergeingParticle");
	MergeingParticle.setEnabled(true);
	rouletSound.play();
	$.state.isMergeing = true;
	$.state.mergeingTime = 3;
};

const OnMergeComplete = () => {
	const rand = Math.random() * 100;
	if ($.state.breakChance < rand) {
		$.state.isMergeSuccess = true;
	} else {
		$.state.isMergeSuccess = false;
	}

	rouletSound.stop();
	const MergeingParticle = $.subNode("MergeingParticle");
	MergeingParticle.setEnabled(false);
	$.state.removeAllDummyItem = true;
	$.state.removeAllDummyItemWaitTime = 0;

	if ($.state.isMergeSuccess) {
		const CompleteParticle = $.subNode("CompleteParticle");
		CompleteParticle.setEnabled(true);
		completeDisplaySound.play();

		const usedItemList = $.state.usedItemList;
		const finishingProductItem = {
			count: 1,
		};

		finishingProductItem.itemName = usedItemList[0].itemName;
		finishingProductItem.itemDisplayName = usedItemList[0].itemDisplayName;
		finishingProductItem.maxDuration = 10 + usedItemList[0].maxDuration + usedItemList[1].maxDuration;
		finishingProductItem.duration = finishingProductItem.maxDuration;
		finishingProductItem.price = Math.floor((usedItemList[0].price + usedItemList[1].price) * 2.5);
		finishingProductItem.rarity = Math.max(usedItemList[0].rarity, usedItemList[1].rarity);
		finishingProductItem.totalMergeCount = (usedItemList[0].totalMergeCount ?? 0) + (usedItemList[1].totalMergeCount ?? 0) + 1;
		finishingProductItem.specialEffect = usedItemList[0].specialEffect;
		finishingProductItem.swingSound = usedItemList[0].swingSound;

		//エンチャント合算
		for (specialEffectData of usedItemList[1].specialEffect) {
			const index = finishingProductItem.specialEffect.findIndex((item) => item.effectName == specialEffectData.effectName);
			if (index != -1) {
				finishingProductItem.specialEffect[index].power += specialEffectData.power;
				if (finishingProductItem.specialEffect[index].power > 5) finishingProductItem.specialEffect[index].power = 5;
			} else {
				if (!specialEffectData.isUnique) {
					finishingProductItem.specialEffect.push(specialEffectData);
				}
			}
		}

		//エンチャント効果再計算

		finishingProductItem.baseMovementSpeed = 1;
		finishingProductItem.bonusDropChance = 0;
		finishingProductItem.luck = 1;
		finishingProductItem.craftSpeed = 0;
		finishingProductItem.durationReduce = 0;
		finishingProductItem.motionMultiple = 1;
		finishingProductItem.multipleAttackCount = 0;
		finishingProductItem.damage = 1;

		for (specialEffectData of finishingProductItem.specialEffect) {
			switch (specialEffectData.effectName) {
				case "ドロップ鉱石強化":
					finishingProductItem.luck += 1 * specialEffectData.power;
					break;
				case "移動速度アップ":
					finishingProductItem.baseMovementSpeed += 0.4 * specialEffectData.power;
					break;
				case "ドロップ確率アップ":
					finishingProductItem.bonusDropChance += 0.1 * specialEffectData.power;
					break;
				case "クラフト速度アップ":
					finishingProductItem.craftSpeed += 1 * specialEffectData.power;
					break;
				case "耐久力消費軽減":
					finishingProductItem.durationReduce += 1 * specialEffectData.power;
					break;
				case "採掘速度アップ":
					finishingProductItem.motionMultiple += 0.2 * specialEffectData.power;
					break;
				case "攻撃力アップ":
					finishingProductItem.damage += 1 * specialEffectData.power;
					break;
				case "[固有]発動機":
					finishingProductItem.multipleAttackCount += 1 * specialEffectData.power;
					break;
			}
		}

		const turuhashiSpawnPosition = $.subNode("FinishingTuruhashiSpawnPosition");
		let spawnPosition = turuhashiSpawnPosition.getGlobalPosition();
		let spawnRotation = turuhashiSpawnPosition.getGlobalRotation();
		const usedItem = new WorldItemTemplateId(finishingProductItem.itemName);
		let followingItem = $.createItem(usedItem, spawnPosition, spawnRotation);
		followingItem.send("FreezePosition", true);
		$.state.spawnDummyItemComplete = followingItem;
		$.state.finishingProductItem = finishingProductItem;
	} else {
		mergeFailed.play();
	}

	$.state.usedItemList = [];
};

const removeUsingPlayer = () => {
	$.log("removeUsingPlayer");
	$.state.usingPlayer = null;
	$.state.removeAllDummyItem = true;
	$.state.completeMerge = false;
	$.state.isMergeing = false;
	$.state.currentCraftProgress = 0;
	$.state.finishingProductItem = null;
	$.state.usedItemList = [];
	$.state.confirmedCount = 0;
	itemUsingPlayerText.unityProp.text = "使用可能";

	const CompleteParticle = $.subNode("CompleteParticle");
	CompleteParticle.setEnabled(false);
};

const SpawnDummyTuruhashi = (itemData, num) => {
	const turuhashiSpawnPosition = $.subNode("TuruhashiSpawnPosition0" + num);
	let spawnPosition = turuhashiSpawnPosition.getGlobalPosition();
	let spawnRotation = turuhashiSpawnPosition.getGlobalRotation();

	$.log(itemData.itemName + "," + JSON.stringify(spawnPosition) + "," + JSON.stringify(spawnRotation));

	const usedItem = new WorldItemTemplateId(itemData.itemName);
	let followingItem = $.createItem(usedItem, spawnPosition, spawnRotation);
	followingItem.send("FreezePosition", true);

	const spawnDummyItemList = $.state.spawnDummyItemList;
	spawnDummyItemList.push({ itemHandle: followingItem });
	$.state.spawnDummyItemList = spawnDummyItemList;
};

const RemoveDummyTuruhashiByUUID = (uuid) => {
	const dummyItemList = $.state.spawnDummyItemList;
	let index = dummyItemList.findIndex((item) => item.uuid == uuid);

	if (index != -1) {
		dummyItemList[index].itemHandle.send("ForceDestory", null);
		dummyItemList.splice(index, 1);
	}

	$.state.spawnDummyItemList = dummyItemList;
};

const UpdateUI = () => {
	UpdateDiscriptionText();
	UpdateCostText();
	UpdateTuruhashiStatusText();
};

const UpdateDiscriptionText = () => {
	const itemList = $.state.usedItemList;

	if ($.state.completeMerge && $.state.isMergeSuccess) {
		titleText.unityProp.text = "合成完了！";
		warningText.unityProp.text = "";
	} else if ($.state.completeMerge && !$.state.isMergeSuccess) {
		titleText.unityProp.text = "合成失敗……";
		warningText.unityProp.text = "合成はランダムな確率で失敗し、ツルハシが破壊されます\n（※破壊されたツルハシは戻ってきません！）";
	} else {
		titleText.unityProp.text = "ツルハシ合成マシーン";
		warningText.unityProp.text = "合成はランダムな確率で失敗し、ツルハシが破壊されます\n（※破壊されたツルハシは戻ってきません！）";
	}

	if ($.state.completeMerge && $.state.isMergeSuccess) {
		discriptionText.unityProp.text = "";
	} else if ($.state.completeMerge && !$.state.isMergeSuccess) {
		discriptionText.unityProp.text = "素材のツルハシは破壊された……";
	} else if ($.state.isMergeing) {
		discriptionText.unityProp.text = "合成中……";
	} else if (itemList.length == 0) {
		discriptionText.unityProp.text = "合成元のつるはしを持って\nインタラクトしてください\n（見た目や[固有]エンチャントは合成元に依存します）";
	} else if (itemList.length == 1) {
		discriptionText.unityProp.text = "能力追加用のつるはしを持って\nインタラクトしてください\n（合成元が持たない[固有]エンチャントは引き継がれません）\n";
	} else if ($.state.confirmedCount <= 1) {
		discriptionText.unityProp.text = "本当につるはしを合成していいですか？\nあと" + (3 - $.state.confirmedCount) + "回インタラクトすると合成を開始します";
	} else if ($.state.confirmedCount <= 2) {
		discriptionText.unityProp.text = "本当につるはしを合成していいですか？\n次にインタラクトすると合成を開始します";
	}
};

const UpdateCostText = () => {
	if ($.state.completeMerge && $.state.isMergeSuccess) {
		costText.unityProp.text = ItemDataToText($.state.finishingProductItem);
	} else if ($.state.completeMerge && !$.state.isMergeSuccess) {
		const mergeCost = $.state.mergeCost;
		const breakChance = $.state.breakChance;
		costText.unityProp.text = "合成費用：" + mergeCost + " 破壊確率：" + breakChance + "%";
	} else {
		const itemList = $.state.usedItemList;

		let totalPrice = 0;
		let totalMergeCount = 0;
		for (itemData of itemList) {
			if (itemData.price) totalPrice += itemData.price;
			if (itemData.totalMergeCount) totalMergeCount += itemData.totalMergeCount;
		}

		let breakChance = (totalMergeCount + 1) * 10;
		let mergeCost = totalPrice;

		$.state.mergeCost = mergeCost;
		$.state.breakChance = breakChance;
		costText.unityProp.text = "合成費用：" + mergeCost + " 破壊確率：" + breakChance + "%";
	}
};

const UpdateTuruhashiStatusText = () => {
	const itemList = $.state.usedItemList;
	const turuhashiStatus1 = $.subNode("TuruhashiStatus1");
	const turuhashiStatus2 = $.subNode("TuruhashiStatus2");

	const turuhashiStatusText1 = $.subNode("TuruhashiStatusText1").getUnityComponent("Text");
	const turuhashiStatusText2 = $.subNode("TuruhashiStatusText2").getUnityComponent("Text");

	if (itemList.length >= 1) {
		turuhashiStatusText1.unityProp.text = ItemDataToText(itemList[0]);
		turuhashiStatus1.setEnabled(true);
	} else {
		turuhashiStatus1.setEnabled(false);
	}

	if (itemList.length >= 2) {
		turuhashiStatusText2.unityProp.text = ItemDataToText(itemList[1]);
		turuhashiStatus2.setEnabled(true);
	} else {
		turuhashiStatus2.setEnabled(false);
	}
};

const ItemDataToText = (itemData) => {
	let newText = "";
	newText += itemData.itemDisplayName + "\n";
	newText += "（使える回数：" + itemData.maxDuration + "）\n\n";
	newText += "特殊効果：\n";

	for (const [index, specialEffect] of itemData.specialEffect.entries()) {
		newText += specialEffect.effectName + RomanNum(specialEffect.power);
		if (index < itemData.specialEffect.length - 1) {
			newText += ",";
		}
	}
	if (itemData.specialEffect.length <= 0) {
		newText += "なし";
	}

	newText += "\n\n売値：" + itemData.price + "G";

	return newText;
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
