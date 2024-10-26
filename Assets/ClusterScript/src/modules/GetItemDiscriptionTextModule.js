export const GetItemDiscriptionText = (targetItem) => {
	let rarityText = "";
	let targetItemDuration = targetItem.maxDuration;
	let targetItemName = targetItem.itemName;

	if (targetItem.rarity) {
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

		return targetItem.itemDisplayName + "　" + rarityText + "\n特殊効果:" + specialEffectText;
	} else if (targetItemName == "cupperOre") {
		return "銅鉱石 " + rarityText + "\n加工しやすい鉱石。よく取れる";
	} else if (targetItemName == "clystal") {
		return "クリスタル " + rarityText + "\nめずらしい鉱石。エンチャント確率が上がる";
	} else if (targetItemName == "goldOre") {
		return "金鉱石 " + rarityText + "\n柔らかくきれいな鉱石。価値が高い";
	} else if (targetItemName == "ironOre") {
		return "鉄鉱石 " + rarityText + "\n硬い鉱石。耐久力に優れる";
	} else if (targetItemName == "crimsonOre") {
		return "クリムゾン鉱石 " + rarityText + "\n高熱を放つ鉱石。特殊なツルハシの制作に使う";
	} else {
		return targetItem.itemDisplayName + " " + rarityText + "\nきれいな飾り。" + targetItem.price + "Gで売れる";
	}
};

export const RomanNum = (num) => {
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
