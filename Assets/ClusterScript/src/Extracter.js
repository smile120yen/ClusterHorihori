const target = $.worldItemReference("Target");
const collider = $.subNode("Collider");
const canvas = $.subNode("Canvas");
const cooltimeMax = 0.2;

$.onStart(() => {
	$.state.cooltime = 0;
	$.state.isEnable = true;
});

$.onReceive(
	(requestName, arg, sender) => {
		$.log("receve:" + (requestName || "null") + "," + JSON.stringify(arg));

		if (requestName == "SetEnable") {
			canvas.setEnabled(arg.enabled);
			collider.setEnabled(arg.enabled);
		}
	},
	{ item: true, player: true }
);

$.onInteract((player) => {
	if ($.state.isEnable) {
		target.send("Extract", null);
		$.state.isEnable = false;
		$.state.cooltime = cooltimeMax;
	}
});

$.onUpdate((deltaTime) => {
	if (!$.state.isEnable) {
		$.state.cooltime -= deltaTime;
		if ($.state.cooltime <= 0) {
			$.state.isEnable = true;
		}
	}
});
