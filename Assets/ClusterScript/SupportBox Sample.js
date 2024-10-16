const productId = "5691f52c-6614-4f89-a10b-031b37ec9af0";
const SupportSE = $.audio("SupportSE");
const canvas = $.subNode("DetailCanvas");
const ChestSizeInfoText = $.subNode("ChestSizeInfo").getUnityComponent("Text");
const DiscriptionText = $.subNode("Discription").getUnityComponent("Text");

const defaultDiscriptionText =
	"ご支援用のお賽銭箱です！\n頂いたご支援はワールド製作者（物部モノ子）が\nおいしいお菓子を食べるためなどに使います……！\n\n100コイン分ご支援いただくたび、以下の特典があります\n\n" +
	"・椅子に座ったとき、頭の上にサポーターバッチが付きます\n・チェストの容量が1ページ分（6マス分）増えます\n（最大で7回目のご支援まで有効です）";

$.onStart(() => {
	// 購入通知を購読する
	$.subscribePurchase(productId);
	canvas.setEnabled(false);
	$.state.enableCanvas = false;
	$.state.purchasedTime = 0;
});

$.onUpdate((deltaTime) => {
	const nearPlayerLength = $.getPlayersNear($.getPosition(), 3).length;
	if (nearPlayerLength <= 0 && $.state.enableCanvas) {
		canvas.setEnabled(false);
		$.state.enableCanvas = false;
	}

	if ($.state.purchasedTime > 0) {
		$.state.purchasedTime -= deltaTime;
		if ($.state.purchasedTime <= 0) {
			DiscriptionText.unityProp.text = defaultDiscriptionText;
		}
	}
});

$.onInteract((player) => {
	if (!$.state.enableCanvas) {
		OpenCanvas(player);
	} else {
		player.requestPurchase(productId, "");
	}
});

$.onPurchaseUpdated((player, productId) => {
	$.getOwnProducts(productId, [player], "");
});

$.onGetOwnProducts((ownProducts, meta, errorReason) => {
	//  商品の所持状況を取得したとき
	let total = 3;
	for (let ownProduct of ownProducts) {
		// スペース内での商品所持数の合計を計算
		total += ownProduct.plusAmount - ownProduct.minusAmount;
	}

	total = Math.min(10, total);
	ChestSizeInfoText.unityProp.text = "現在のチェスト容量：" + total + "ページ（最大で10ページまで）";
});

$.onRequestPurchaseStatus((meta, status, errorReason, player) => {
	if (status == PurchaseRequestStatus.Purchased) {
		SupportSE.play();
		DiscriptionText.unityProp.text = "ご支援ありがとうございます！\n引き続きお楽しみください！";
		ChestSizeInfoText.unityProp.text = "読み込み中……";
		$.state.purchasedTime = 5;
	}
});

const OpenCanvas = (player) => {
	canvas.setEnabled(true);
	ChestSizeInfoText.unityProp.text = "読み込み中……";
	DiscriptionText.unityProp.text = defaultDiscriptionText;
	$.state.enableCanvas = true;
	$.getOwnProducts(productId, [player], "");
};
