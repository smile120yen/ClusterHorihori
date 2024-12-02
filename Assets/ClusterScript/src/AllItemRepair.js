const pickupSound = $.audio("Pickup");
const fukidashiText = $.subNode("FukidashiText").getUnityComponent("Text");
const canvas = $.subNode("FukidashiCanvas");
const defaultTalkText = "ツルハシ修理……無料だよ";
const talkCooltimeMax = 1;

$.onStart(() => {
	$.state.talkCooltime = talkCooltimeMax;
	$.state.isTalkStart = false;
	fukidashiText.unityProp.text = defaultTalkText;

	canvas.setEnabled(false);
	$.state.enableCanvas = false;
});

$.onInteract((player) => {
	pickupSound.play();
	player.send("RepairItem", "all");
	fukidashiText.unityProp.text = "ほら、直したよ";
	$.state.isTalkStart = true;
	$.state.talkCooltime = talkCooltimeMax;
});

$.onUpdate((deltaTime) => {
	if ($.getPlayersNear($.getPosition(), 3).length >= 1 && !$.state.enableCanvas) {
		canvas.setEnabled(true);
		$.state.enableCanvas = true;
	} else if ($.getPlayersNear($.getPosition(), 3).length <= 0 && $.state.enableCanvas) {
		canvas.setEnabled(false);
		$.state.enableCanvas = false;
	}

	if ($.state.isTalkStart) {
		$.state.talkCooltime -= deltaTime;
		if ($.state.talkCooltime < 0) {
			fukidashiText.unityProp.text = defaultTalkText;
			$.state.isTalkStart = false;
		}
	}
});
