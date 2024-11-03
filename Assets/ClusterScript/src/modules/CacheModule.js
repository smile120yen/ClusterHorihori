export const InitializeSendCache = () => {
	//$.log("InitializeSendCache");
	$.state.sendMessageCache = [];
	$.state.cacheWaitTime = 0;
	$.state.findCache = false;
};

export const ProcessCache = (deltaTime) => {
	//汎用メッセージキャッシュを処理
	if ($.state.findCache) {
		if ($.state.cacheWaitTime > 0) $.state.cacheWaitTime -= deltaTime;
		if ($.state.cacheWaitTime <= 0 && $.state.sendMessageCache.length > 0) {
			const sendMessageCache = $.state.sendMessageCache;
			const sendMessageData = sendMessageCache.shift();
			$.log("ProcessCache:" + JSON.stringify(sendMessageData));
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

			if ($.state.sendMessageCache.length <= 0) {
				$.state.findCache = false;
			}
		}
	}
};

export const AddSendMessageCache = (targetHandle, message, arg) => {
	//$.log("AddSendMessageCache");
	let currentCache = $.state.sendMessageCache;
	if (!currentCache) currentCache = [];
	currentCache.push({ targetHandle, message, arg });
	$.state.sendMessageCache = currentCache;
	$.state.findCache = true;
};
