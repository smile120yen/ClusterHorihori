// 圧縮マッピング
//import { nanoid } from "nanoid";

export const compressionMap = {
	itemName: "a",
	itemDisplayName: "b",
	maxDuration: "c",
	duration: "d",
	price: "e",
	rarity: "f",
	uuid: "g",
	count: "h",
	specialEffect: "i",
	baseMovementSpeed: "j",
	bonusDropChance: "k",
	luck: "l",
	craftSpeed: "m",
	durationReduce: "n",
	motionMultiple: "o",
	multipleAttackCount: "p",
	damage: "q",
	totalMergeCount: "r",
	durationPower: "s",
	enchantPower: "t",
	craftDifficulty: "u",
	isStackable: "v",
	useableAnvil: "w",
	mineExp: "x",
	mineLv: "y",
	money: "z",
	kabanSize: "A",
	currentSelectIndex: "B",
	inventoryData: "C",
	stockItemData: "D",
	batch: "E",
	power: "F",
	effectName: "G",
	attack: "H",
};

// 新しい値の圧縮マッピングを追加
export const valueCompressionMap = {
	clystal: "ia",
	crimsonOre: "ib",
	cupperOre: "ic",
	goldCoinBag: "id",
	goldOre: "ie",
	ironOre: "if",
	trophyCatClystal: "ig",
	trophyCatCrimson: "il",
	trophyCatCupper: "im",
	trophyCatGold: "in",
	trophyCatIron: "iv",
	trophyCowClystal: "iw",
	trophyCowCrimson: "ix",
	trophyCowCupper: "iy",
	trophyCowGold: "iz",
	trophyCowIron: "iA",
	trophyDeerClystal: "iB",
	trophyDeerCrimson: "iC",
	trophyDeerCupper: "iD",
	trophyDeerGold: "iE",
	trophyDeerIron: "iF",
	trophyRabbitClystal: "iG",
	trophyRabbitCrimson: "iH",
	trophyRabbitCupper: "iI",
	trophyRabbitGold: "iJ",
	trophyRabbitIron: "iK",
	turuhashiClystal: "iL",
	turuhashiCupper: "iM",
	turuhashiEngine: "iN",
	turuhashiGold: "iV",
	turuhashiIron: "iW",
	turuhashiNormal: "iX",
	ドロップ鉱石強化: "ea",
	採掘速度アップ: "eb",
	クラフト速度アップ: "ec",
	攻撃力アップ: "ed",
	移動速度アップ: "ee",
	ドロップ確率アップ: "ef",
	耐久力消費軽減: "eg",
};

const replaceCompressedUUID = (data) => {
	// stockItemDataの各アイテムに対して処理を行う
	data.stockItemData.forEach((item) => {
		if (item && item.uuid) {
			//item.uuid = nanoid(10); // UUIDをnanoidで生成した10文字の文字列に置き換える
			item.uuid = compressUUID(item.uuid);
		}
	});

	// inventoryDataの各アイテムに対して処理を行う
	data.inventoryData.forEach((item) => {
		if (item && item.uuid) {
			//item.uuid = nanoid(10); // UUIDをnanoidで生成した10文字の文字列に置き換える
			item.uuid = compressUUID(item.uuid);
		}
	});
};

const replaceDecompressedUUID = (data) => {
	// stockItemDataの各アイテムに対して処理を行う
	data.stockItemData.forEach((item) => {
		if (item && item.uuid) {
			//item.uuid = nanoid(10); // UUIDをnanoidで生成した10文字の文字列に置き換える
			item.uuid = decompressUUID(item.uuid);
		}
	});

	// inventoryDataの各アイテムに対して処理を行う
	data.inventoryData.forEach((item) => {
		if (item && item.uuid) {
			//item.uuid = nanoid(10); // UUIDをnanoidで生成した10文字の文字列に置き換える
			item.uuid = decompressUUID(item.uuid);
		}
	});
};

function compressUUID(uuid) {
	// UUIDをハイフンで分割し、16進数の各部分を結合
	const hexString = uuid.replace(/-/g, "");
	return encodeBase64(hexString);
}
export function encodeBase64(hexString) {
	// 16進数の文字列をバイト配列に変換
	const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

	const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	let base64String = "";

	for (let i = 0; i < byteArray.length; i += 3) {
		const byte1 = byteArray[i];
		const byte2 = i + 1 < byteArray.length ? byteArray[i + 1] : 0;
		const byte3 = i + 2 < byteArray.length ? byteArray[i + 2] : 0;

		const triplet = (byte1 << 16) | (byte2 << 8) | byte3;

		base64String += base64Chars[(triplet >> 18) & 0x3f];
		base64String += base64Chars[(triplet >> 12) & 0x3f];
		base64String += i + 1 < byteArray.length ? base64Chars[(triplet >> 6) & 0x3f] : "=";
		base64String += i + 2 < byteArray.length ? base64Chars[triplet & 0x3f] : "=";
	}

	return base64String;
}

// JSONデータをバイナリデータに変換するための関数
export function jsonToBinary(json) {
	const jsonString = JSON.stringify(json);
	const binaryData = new Uint8Array(jsonString.length);

	for (let i = 0; i < jsonString.length; i++) {
		binaryData[i] = jsonString.charCodeAt(i);
	}

	return binaryData;
}

export function binaryToHex(binaryData) {
	return Array.from(binaryData)
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}

export function decodeBase64(base64String) {
	const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	const byteArray = [];

	for (let i = 0; i < base64String.length; i += 4) {
		const triplet =
			(base64Chars.indexOf(base64String[i]) << 18) |
			(base64Chars.indexOf(base64String[i + 1]) << 12) |
			(base64Chars.indexOf(base64String[i + 2]) << 6) |
			base64Chars.indexOf(base64String[i + 3]);

		byteArray.push((triplet >> 16) & 0xff);
		if (base64String[i + 2] !== "=") byteArray.push((triplet >> 8) & 0xff);
		if (base64String[i + 3] !== "=") byteArray.push(triplet & 0xff);
	}

	const hexString = byteArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
	return hexString;
}

function decompressUUID(base64String) {
	// バイト配列から16進数の文字列を生成
	const hexString = decodeBase64(base64String);

	// 16進数の文字列をUUID形式に戻す
	const uuid = [hexString.slice(0, 8), hexString.slice(8, 12), hexString.slice(12, 16), hexString.slice(16, 20), hexString.slice(20, 32)].join("-");

	return uuid;
}

// 圧縮関数
export function compressJSON(data) {
	const compressedData = JSON.parse(JSON.stringify(data)); // deep copy
	replaceCompressedUUID(compressedData);
	const compress = (obj) => {
		for (const key in obj) {
			const newKey = compressionMap[key] || key;
			if (newKey !== key) {
				obj[newKey] = obj[key];
				delete obj[key];
			}
			if (typeof obj[newKey] === "object" && !Array.isArray(obj[newKey])) {
				compress(obj[newKey]);
			} else if (Array.isArray(obj[newKey])) {
				obj[newKey].forEach((item) => compress(item));
			}

			// valueの圧縮を追加
			if (typeof obj[newKey] === "string") {
				const compressedValue = valueCompressionMap[obj[newKey]] || obj[newKey];
				obj[newKey] = compressedValue;
			}
		}
	};
	compress(compressedData);

	//const encodeData = encodeBase64(JSON.stringify(compressData));
	return compressedData;
}

// 解凍関数
export function decompressJSON(data) {
	const decompressionMap = Object.fromEntries(Object.entries(compressionMap).map(([k, v]) => [v, k]));
	const valueDecompressionMap = Object.fromEntries(Object.entries(valueCompressionMap).map(([k, v]) => [v, k]));

	//const decodeData = decodeBase64(data);
	const decompressedData = JSON.parse(JSON.stringify(data)); // deep copy

	const decompress = (obj) => {
		for (const key in obj) {
			const originalKey = decompressionMap[key] || key;
			if (originalKey !== key) {
				obj[originalKey] = obj[key];
				delete obj[key];
			}
			if (typeof obj[originalKey] === "object" && !Array.isArray(obj[originalKey])) {
				decompress(obj[originalKey]);
			} else if (Array.isArray(obj[originalKey])) {
				obj[originalKey].forEach((item) => decompress(item));
			}

			// valueの解凍を追加
			if (typeof obj[originalKey] === "string") {
				const decompressedValue = valueDecompressionMap[obj[originalKey]] || obj[originalKey];
				obj[originalKey] = decompressedValue;
			}
		}
	};
	decompress(decompressedData);

	replaceDecompressedUUID(decompressedData);
	return decompressedData;
}
