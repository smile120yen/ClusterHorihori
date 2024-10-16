const canvas = $.subNode("Canvas");
const mineLvTextFront = $.subNode("MineLvTextFront").getUnityComponent("Text");
const mineLvTextBack = $.subNode("MineLvTextBack").getUnityComponent("Text");

$.onRide((isGetOn, player) => {
	if (isGetOn) {
		canvas.setEnabled(true);
		player.send("GetMineLv", null);
	} else {
		canvas.setEnabled(false);
	}
});

$.onReceive(
	(requestName, arg, sender) => {
		if (requestName == "ReceveMineLv") {
			mineLvTextFront.unityProp.text = "採掘Lv " + arg;
			mineLvTextBack.unityProp.text = "採掘Lv " + arg;
		}
	},
	{ item: true, player: true }
);
