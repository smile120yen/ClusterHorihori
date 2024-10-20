const productId = "5691f52c-6614-4f89-a10b-031b37ec9af0";
const SupportSE = $.audio("SupportSE");
const CoinSE = $.audio("CoinSe");
const particle = $.subNode("Particle System").getUnityComponent("ParticleSystem");
const ThankYou = $.subNode("ThankYou");
const ChestSizeText = $.subNode("ChestSize").getUnityComponent("Text");

$.onStart(() => {
	// 購入通知を購読する
	$.subscribePurchase(productId);
	$.state.enableCanvas = false;
	$.state.purchasedTime = 0;
});

$.onUpdate((deltaTime) => {
	if ($.state.purchasedTime > 0) {
		$.state.purchasedTime -= deltaTime;
		if ($.state.purchasedTime <= 0) {
			ThankYou.setEnabled(false);
		}
	}
});

$.onInteract((player) => {
	player.requestPurchase(productId, "");
});

$.onRequestPurchaseStatus((meta, status, errorReason, player) => {
	if (status == PurchaseRequestStatus.Purchased) {
		SupportSE.play();
		CoinSE.play();
		particle.play();
		$.state.purchasedTime = 7;
		ThankYou.setEnabled(true);
		ChestSizeText.unityProp.text = "（現在のチェスト容量：読み込み中……）\n※チェスト容量は最大で10ページまでです";
		$.getOwnProducts(productId, [player], "");
	}
});

$.onGetOwnProducts((ownProducts, meta, errorReason) => {
	let total = 0;
	for (let ownProduct of ownProducts) {
		total += ownProduct.plusAmount - ownProduct.minusAmount;
	}
	const ChestSize = Math.min(3 + total, 10);
	ChestSizeText.unityProp.text = "（現在のチェスト容量：" + ChestSize + "ページ）\n※チェスト容量は最大で10ページまでです";
});
