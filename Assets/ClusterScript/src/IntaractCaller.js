$.onStart(() => {
	$.state.itemUsePlayers = [];
});

$.onInteract((player) => {
	const itemUsePlayers = $.state.itemUsePlayers;
	itemUsePlayers.push({ playerHandle: player, cooldown: 0.3 });
	$.state.itemUsePlayers = itemUsePlayers;
	player.send("UseSelectItem", null);
});

$.onReceive((requestName, arg, sender) => {
	if (requestName == "Enable") {
		$.subNode("Visual").setEnabled(true);
	}

	if (requestName == "Disable") {
		$.subNode("Visual").setEnabled(false);
	}

	$.log("receve:" + (requestName || "null") + "," + JSON.stringify(arg));
});

$.onUpdate((deltaTime) => {
	const itemUsePlayers = $.state.itemUsePlayers;
	for (itemUsePlayer of itemUsePlayers) {
		itemUsePlayer.cooldown -= deltaTime;
	}
	const newItemUsePlayers = itemUsePlayers.filter((n) => n.cooldown > 0);
	$.state.itemUsePlayers = newItemUsePlayers;

	let allPlayers = $.getPlayersNear($.getPosition(), Infinity);

	const visiblePlayers = allPlayers.filter((n) => !newItemUsePlayers.find((item) => item.playerHandle.id === n.id));

	$.setVisiblePlayers(visiblePlayers);
});
