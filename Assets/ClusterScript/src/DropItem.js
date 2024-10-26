const pickupSound = $.audio("Pickup");
const subNode = $.subNode("Visual");

$.onStart(() => {
	$.state.interactCoolTime = 0;
	$.state.isPickuped = false;
	$.state.deleteCoolTime = 180;
	$.state.initialize = false;
});

$.onReceive(
	(messageType, arg, sender) => {
		if (messageType === "setStatus") {
			$.state.itemStatus = arg;
			if (arg.rarity && arg.rarity != 1) {
				$.subNode(arg.rarity).setEnabled(true);
			}
			$.state.initialize = true;
		}

		if (messageType === "GetItemReceived") {
			pickupSound.play();
			subNode.setEnabled(false);
			$.state.isPickuped = true;
			$.state.time = 3;
		}

		if (messageType === "ForceDestory") {
			$.Destroy();
		}

		if (messageType === "FreezePosition") {
			$.getUnityComponent("Rigidbody").unityProp.isKinematic = arg;
			$.getUnityComponent("Rigidbody").unityProp.useGravity = !arg;
		}

		$.log("receve:" + (messageType || "null") + "," + JSON.stringify(arg));
	},
	{ item: true, player: true }
);

$.onInteract((player) => {
	if (!$.state.initialize) return;
	if ($.state.interactCoolTime > 0) return;
	$.state.interactCoolTime = 3;
	player.send("getItem", $.state.itemStatus);
});

$.onUpdate((deltaTime) => {
	$.state.interactCoolTime -= deltaTime;
	$.state.deleteCoolTime -= deltaTime;

	if ($.state.deleteCoolTime < 0) {
		$.Destroy();
	}

	if ($.state.isPickuped) {
		$.state.time = ($.state.time ?? 0) - deltaTime;
		if ($.state.time <= 0) {
			$.Destroy();
		}
	}
});
