import { InitializeSendCache, ProcessCache, AddSendMessageCache } from "./CacheModule.js";

export const initListeners = (itemSettings) => {
	const dropKousekiItem = new WorldItemTemplateId("DropKouseki");
	const oreBreakedItem = new WorldItemTemplateId("OreBreaked");
	const damagedSound = $.audio("Clash");
	const breakedSound = $.audio("Break");
	const subNodeVisual = $.subNode("Visual");
	const animator = $.subNode("Visual").getUnityComponent("Animator");
	const particle = $.subNode("Particle System").getUnityComponent("ParticleSystem");

	$.onStart(() => {
		RespawnItem();
		$.state.itemUsePlayers = [];
		$.state.interactWaitTime = 0;
		InitializeSendCache();
	});

	$.onInteract((player) => {
		if ($.state.interactWaitTime <= 0) {
			player.send("AttackCurrentItem", null);
			$.state.interactWaitTime = 0.2;
		}
	});

	$.onReceive((requestName, arg, sender) => {
		if (requestName == "damage") {
			animator.setTrigger("Clash");
			particle.play();

			let hp = $.state.hp;
			if (hp <= 0) return;
			if (arg.damage) {
				hp -= arg.damage;
			} else {
				hp -= 1;
			}
			$.state.hp = hp;

			CheckDropItem(arg);

			if (hp > 0) {
				damagedSound.play();
			} else {
				breakedSound.play();
				subNodeVisual.setEnabled(false);
				$.createItem(oreBreakedItem, $.getPosition(), $.getRotation());
				$.state.enable = false;
				$.state.respawnTime = itemSettings.respawnTime / $.getPlayersNear($.getPosition(), Infinity).length;
			}

			$.state.hp = hp;

			let newConsumeDuration = itemSettings.consumeDuration;
			if (arg.durationReduce) {
				newConsumeDuration -= arg.durationReduce;
			}
			if (newConsumeDuration < 1) newConsumeDuration = 1;

			AddSendMessageCache(sender, "ReceiveDamage", newConsumeDuration);
		}

		$.log("receve:" + (requestName || "null") + "," + JSON.stringify(arg));
	});

	$.onUpdate((deltaTime) => {
		if ($.state.interactWaitTime > 0) $.state.interactWaitTime -= deltaTime;

		if (!$.state.enable) {
			$.state.respawnTime -= deltaTime;
			if ($.state.respawnTime <= 0) {
				RespawnItem();
			}
		}

		ProcessCache(deltaTime);
	});

	const RespawnItem = () => {
		subNodeVisual.setEnabled(true);
		$.state.maxHp = itemSettings.maxHp;
		$.state.hp = itemSettings.maxHp;
		$.state.enable = true;
	};

	const CheckDropItem = (itemData) => {
		let isDroped = false;
		const rand = Math.random();
		let newDropChance = itemSettings.dropChance;
		let hp = $.state.hp;
		if (itemData.bonusDropChance) newDropChance += itemData.bonusDropChance;
		if (rand < newDropChance || hp <= 0) {
			isDroped = true;
		}

		let luck = 1;
		if (itemData.luck) luck = itemData.luck;

		const rarityRand = Math.floor(Math.random() * 100);

		let newRarity = 1;
		if (rarityRand < 55) {
			newRarity = 1;
		} else if (rarityRand < 75) {
			newRarity = 2;
		} else if (rarityRand < 85) {
			newRarity = 3;
		} else if (rarityRand < 95) {
			newRarity = 4;
		} else {
			newRarity = 5;
		}

		if (luck < newRarity) newRarity = luck;

		if (isDroped) {
			let spawnPosition = $.getPosition()
				.clone()
				.add(new Vector3(0, 0.7, 0));
			let followingItem = $.createItem(dropKousekiItem, spawnPosition, $.getRotation());

			AddSendMessageCache(followingItem, "setStatus", {
				itemName: itemSettings.itemName,
				itemDisplayName: itemSettings.itemDisplayName,
				price: itemSettings.price,
				count: 1,
				useableAnvil: true,
				rarity: newRarity,
				durationPower: itemSettings.durationPower,
				enchantPower: itemSettings.enchantPower,
				craftDifficulty: itemSettings.craftDifficulty,
			});

			let random_x = Math.random() * 2 - 1;
			let random_z = Math.random() * 2 - 1;
			followingItem.addImpulsiveForce(new Vector3(random_x, 4, random_z));
		}
	};
};
