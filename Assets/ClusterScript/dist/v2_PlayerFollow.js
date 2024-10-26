/******/ (() => { // webpackBootstrap
/*!********************************!*\
  !*** ./src/v2_PlayerFollow.js ***!
  \********************************/
const DropSound = $.audio("Drop");
const ClushParticle = $.subNode("ClushParticle").getUnityComponent("ParticleSystem");
const ClushItemSpawnPosition = $.subNode("ClushParticle");

const registerPlayer = (player) => {
	$.state.followingPlayer = player;
	$.state.isGrabed = true;
};

$.onStart(() => {
	$.state.followingPlayer = null;
	$.state.beforeSelectItem = null;
	$.state.damageMessageCashe = [];
	$.state.damageMessageProcessTime = 0;
	$.state.underLimitHeight = -1.5;
	$.state.grabItemSpawner = null;
	$.state.attackedTarget = null;
	$.state.damagedItem = null;
	$.state.defaultMovementSpeed = 1;
	$.state.spawnItemSetStatusCache = [];
	$.state.itemStatusSettingProcessTime = 0;
	$.state.sendMessageCache = [];
	$.state.cacheWaitTime = 0;
	$.state.isGrabed = false;
});

$.onGrab((isGrab, isLeftHand, player) => {
	if (isGrab) {
		registerPlayer(player);
		AddSendMessageCache(player, "RegisterFollowItem", null);
		//player.send("RegisterFollowItem", null);
		$.subNode("GetCollision").setEnabled(false);

		if ($.state.grabItemSpawner) {
			AddSendMessageCache($.state.grabItemSpawner, "SpawnNewGrabItem", null);
			//$.state.grabItemSpawner.send("SpawnNewGrabItem", null);
			$.state.grabItemSpawner = null;
		}
	} else {
		registerPlayer(null);
		//AddSendMessageCache(player, "UnRegisterFollowItem", null);
		player.send("UnRegisterFollowItem", null);
		player.setMoveSpeedRate(1);
		$.destroy();
	}
});

$.onReceive(
	(messageType, arg, sender) => {
		if (messageType === "SetDefaultMovementSpeed") {
			let followingPlayer = $.state.followingPlayer;
			$.state.defaultMovementSpeed = arg;
			followingPlayer.setMoveSpeedRate($.state.defaultMovementSpeed);
		}

		if (messageType === "DropItem") {
			//このPlayerFollowのownerがスコアの所持者であることを前提としている
			DropSound.play();
			let headRotation = $.state.followingPlayer.getHumanoidBoneRotation(HumanoidBone.Head);
			let addPositon = new Vector3(0, 0.5, 0.6).applyQuaternion(headRotation);
			let spawnPosition = $.getPosition().clone().Add(addPositon);
			const dropItemPrefab = new WorldItemTemplateId(arg.itemName);
			let dropItem = $.createItem(dropItemPrefab, spawnPosition, headRotation);

			AddSendMessageCache(dropItem, "setStatus", arg);
			//dropItem.send("setStatus", arg);

			AddSendMessageCache($.state.followingPlayer, "RemoveSelectItem", {
				itemName: [],
				count: 1,
			});
			/*
			$.state.followingPlayer.send("RemoveSelectItem", {
				itemName: [],
				count: 1,
			});
			*/

			let addForce = new Vector3(0, 0, 3).applyQuaternion(headRotation);
			dropItem.addImpulsiveForce(addForce);
		}

		if (messageType === "VisibleItem") {
			if ($.state.beforeSelectItem) {
				const beforeVisibleSubNode = $.subNode($.state.beforeSelectItem);
				if (beforeVisibleSubNode) {
					beforeVisibleSubNode.setEnabled(false);
				}
			}

			if (arg.itemName != null) {
				const currentVisibleSubNode = $.subNode(arg.itemName);
				if (currentVisibleSubNode) {
					currentVisibleSubNode.setEnabled(true);
				}
			}

			$.state.beforeSelectItem = arg.itemName;
		}

		if (messageType === "PlaySound") {
			const playSound = $.audio(arg);
			playSound.play();

			if (arg == "LvUp") {
				$.subNode("LvUpParticle").getUnityComponent("ParticleSystem").play();
			}
		}

		if (messageType === "Attack") {
			$.state.overlapItems = [];
			$.state.clashTime = 0.2;
			$.state.playerHandle = sender;
			$.state.attackedTarget = arg.target;
			$.state.damagedItem = arg.itemData;
			sender.setMoveSpeedRate(0.2);
		}

		if (messageType === "Clash") {
			StartClash();
		}

		if (messageType === "ClashWithEffect") {
			StartClash();
			ClushParticle.play();
			if (arg) SpawnDropItem(arg, ClushItemSpawnPosition.getGlobalPosition());
		}

		if (messageType === "ReceiveDamage") {
			let followingPlayer = $.state.followingPlayer;

			AddSendMessageCache(followingPlayer, "consumeItem", arg);
			//followingPlayer.send("consumeItem", arg);
		}

		if (messageType === "RegisterGrabItemSpawner") {
			$.state.grabItemSpawner = sender;
		}

		$.log("receve:" + (messageType || "null") + "," + JSON.stringify(arg));
	},
	{ item: true, player: true }
);

$.onUpdate((deltaTime) => {
	//ダメージキャッシュを処理
	$.state.damageMessageProcessTime -= deltaTime;
	if ($.state.damageMessageProcessTime < 0) {
		const damageMessageCashe = $.state.damageMessageCashe;
		if (damageMessageCashe.length > 0) {
			const damageMessageTarget = damageMessageCashe.shift();
			try {
				damageMessageTarget.send("damage", $.state.damagedItem);
			} catch {
				damageMessageCashe.unshift(damageMessageTarget);
				$.log("キャッシュ処理失敗");
			}
			$.state.damageMessageCashe = damageMessageCashe;
			$.state.damageMessageProcessTime = 0.01;
		}
	}

	//アイテムステータス設定キャッシュを処理
	$.state.itemStatusSettingProcessTime -= deltaTime;
	if ($.state.itemStatusSettingProcessTime < 0) {
		const spawnItemSetStatusCache = $.state.spawnItemSetStatusCache;
		if (spawnItemSetStatusCache.length > 0) {
			const spawnItemSetStatus = spawnItemSetStatusCache.shift();
			try {
				spawnItemSetStatus.followingItem.send("setStatus", spawnItemSetStatus.itemStatus);
			} catch {
				spawnItemSetStatusCache.unshift(spawnItemSetStatus);
				$.log("キャッシュ処理失敗");
			}
			$.state.spawnItemSetStatusCache = spawnItemSetStatusCache;
			$.state.itemStatusSettingProcessTime = 0.01;
		}
	}

	//汎用メッセージキャッシュを処理
	if ($.state.cacheWaitTime > 0) $.state.cacheWaitTime -= deltaTime;
	if ($.state.cacheWaitTime <= 0 && $.state.sendMessageCache.length > 0) {
		const sendMessageCache = $.state.sendMessageCache;
		const sendMessageData = sendMessageCache.shift();
		try {
			let arg = sendMessageData.arg;
			if (!arg) arg = "";
			sendMessageData.targetHandle.send(sendMessageData.message, arg);
		} catch {
			sendMessageCache.unshift(sendMessageData);
			$.log("キャッシュ処理失敗");
		}
		$.state.sendMessageCache = sendMessageCache;
		$.state.cacheWaitTime = 0.1;
	}

	let followingPlayer = $.state.followingPlayer;

	// プレイヤーが居なくなるとアイテムも消える
	if ((!followingPlayer && $.state.isGrabed) || (followingPlayer && followingPlayer.exists() === false)) {
		$.destroy();
		return;
	}

	//破壊してから一定時間後に移動可能に
	if ($.state.isClash) {
		let clashTime = $.state.clashTime;
		clashTime -= deltaTime;
		if (clashTime <= 0) {
			let followingPlayer = $.state.followingPlayer;
			if (followingPlayer) followingPlayer.setMoveSpeedRate($.state.defaultMovementSpeed);
			$.state.isClash = false;
		}
		$.state.clashTime = clashTime;
	}
});

const StartClash = () => {
	$.state.isClash = true;

	const target = $.state.attackedTarget;
	//ダメージキャッシュに保存
	const damageMessageCashe = $.state.damageMessageCashe;
	damageMessageCashe.push(target);
	$.state.damageMessageCashe = damageMessageCashe;
};

const SpawnDropItem = (itemStatus, spawnPosition) => {
	const dropKousekiItem = new WorldItemTemplateId(itemStatus.itemName);
	let followingItem = $.createItem(dropKousekiItem, spawnPosition, $.getRotation());

	const spawnItemSetStatusCache = $.state.spawnItemSetStatusCache;
	spawnItemSetStatusCache.push({ followingItem, itemStatus });
	$.state.spawnItemSetStatusCache = spawnItemSetStatusCache;

	let random_x = Math.random() * 2 - 1;
	let random_z = Math.random() * 2 - 1;
	followingItem.addImpulsiveForce(new Vector3(random_x, 4, random_z));
};

const AddSendMessageCache = (targetHandle, message, arg) => {
	let currentCache = $.state.sendMessageCache;
	if (!currentCache) currentCache = [];
	currentCache.push({ targetHandle, message, arg });
	$.state.sendMessageCache = currentCache;
};

/******/ })()
;