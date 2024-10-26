const bgmDefault = $.subNode("BGMDefault");
const bgmWarning = $.subNode("BGMWarning");

$.onStart(() => {
	bgmDefault.setEnabled(true);
});

$.onReceive(
	(messageType, arg, sender) => {
		if (messageType == "PlayBGM") {
			switch (arg) {
				case "BGMDefault":
					bgmDefault.setEnabled(true);
					break;
				case "BGMWarning":
					bgmWarning.setEnabled(true);
					break;
			}
		}
		if (messageType == "StopBGM") {
			switch (arg) {
				case "BGMDefault":
					bgmDefault.setEnabled(false);
					break;
				case "BGMWarning":
					bgmWarning.setEnabled(false);
					break;
			}
		}

		$.log("receve:" + (messageType || "null") + "," + JSON.stringify(arg));
	},
	{ item: true, player: true }
);
