import { InitializeSendCache, ProcessCache, AddSendMessageCache } from "./modules/CacheModule.js";
const dropKousekiItem = new WorldItemTemplateId("DropKouseki");

$.onStart(() => {
	$.state.count = 0;
});

$.onInteract((player) => {
	let position = $.getPosition();

	for (var i = 0; i < 100; i++) {
		let spawnPosition = position.clone().add(new Vector3(3 + 0.01 * $.state.count, 0.7, 0));

		try {
			let followingItem = $.createItem(dropKousekiItem, spawnPosition, $.getRotation());
			$.state.count++;
			$.log($.state.count);
		} catch {
			$.log("spawn failed");
		}
	}
});
