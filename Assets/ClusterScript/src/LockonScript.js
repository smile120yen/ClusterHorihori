$.onStart(() => {
	$.state.visiblePlayerList = [];
	$.state.followTarget = null;

	const visiblePlayerList = [];
	$.setVisiblePlayers(visiblePlayerList);
});

$.onReceive(
	(messageType, arg, sender) => {
		if (messageType == "AddLockonPlayerByID") {
			const visiblePlayerList = $.state.visiblePlayerList;
			const existPlayerList = $.getPlayersNear($.getPosition(), Infinity);

			for (id of arg) {
				const playerHandle = existPlayerList.find((item) => item.id == id);
				visiblePlayerList.push(playerHandle);
			}

			$.setVisiblePlayers(visiblePlayerList);
			$.state.visiblePlayerList = visiblePlayerList;
		}

		if (messageType == "SetLockonPlayerByID") {
			const visiblePlayerList = [];
			const existPlayerList = $.getPlayersNear($.getPosition(), Infinity);

			for (id of arg) {
				const playerHandle = existPlayerList.find((item) => item.id == id);
				visiblePlayerList.push(playerHandle);
			}

			$.setVisiblePlayers(visiblePlayerList);
			$.state.visiblePlayerList = visiblePlayerList;
		}

		if (messageType == "Lockon") {
			const visiblePlayerList = $.state.visiblePlayerList;
			visiblePlayerList.push(sender);
			$.setVisiblePlayers(visiblePlayerList);
			$.state.visiblePlayerList = visiblePlayerList;
		}
		if (messageType == "Lockoff") {
			const visiblePlayerList = $.state.visiblePlayerList;
			const index = visiblePlayerList.findIndex((item) => item.id == sender.id);

			if (index !== -1) {
				visiblePlayerList.splice(index, 1);
				$.setVisiblePlayers(visiblePlayerList);
				$.state.visiblePlayerList = visiblePlayerList;
			}
		}

		if (messageType == "LockoffAll") {
			const visiblePlayerList = [];
			$.setVisiblePlayers(visiblePlayerList);
			$.state.visiblePlayerList = visiblePlayerList;
		}

		if (messageType == "LockOnAll") {
			const visiblePlayerList = $.getPlayersNear($.getPosition(), Infinity);
			$.setVisiblePlayers(visiblePlayerList);
			$.state.visiblePlayerList = visiblePlayerList;
		}

		$.log("receve:" + (messageType || "null") + "," + JSON.stringify(arg));
	},
	{ item: true, player: true }
);

$.onUpdate((deltaTime) => {
	if ($.state.followTarget) {
		$.setPosition(followTarget.getPosition());
	}
});
