/******/ (() => { // webpackBootstrap
/*!***********************************!*\
  !*** ./src/CommunicationChair.js ***!
  \***********************************/
const canvas = $.subNode("Canvas");
const mineLvTextFront = $.subNode("MineLvTextFront").getUnityComponent("Text");
const mineLvTextBack = $.subNode("MineLvTextBack").getUnityComponent("Text");
const SupporterBatchFront = $.subNode("SupporterBatchFront");
const SupporterBatchBack = $.subNode("SupporterBatchBack");
const productId = "5691f52c-6614-4f89-a10b-031b37ec9af0";

const batchList = ["Fugou,Supporter"];

$.onRide((isGetOn, player) => {
	if (isGetOn) {
		canvas.setEnabled(true);
		player.send("GetAchiveStatus", null);
		$.getOwnProducts(productId, [player], "");

		for (let batchName of batchList) {
			const BatchFront = $.subNode(batchName + "BatchFront").setEnabled(false);
			const BatchBack = $.subNode(batchName + "BatchBack").setEnabled(false);
		}
	} else {
		canvas.setEnabled(false);
	}
});

$.onReceive(
	(requestName, arg, sender) => {
		if (requestName == "ReceveAhiveStatus") {
			$.log(JSON.stringify(arg));
			mineLvTextFront.unityProp.text = "採掘Lv " + arg.mineLv;
			mineLvTextBack.unityProp.text = "採掘Lv " + arg.mineLv;

			if (!arg.batch) return;
			for (let batchName of arg.batch) {
				const BatchFront = $.subNode(batchName + "BatchFront").setEnabled(true);
				const BatchBack = $.subNode(batchName + "BatchBack").setEnabled(true);
			}
		}
	},
	{ item: true, player: true }
);

$.onGetOwnProducts((ownProducts, meta, errorReason) => {
	//  商品の所持状況を取得したとき
	let total = 0;
	for (let ownProduct of ownProducts) {
		// スペース内での商品所持数の合計を計算
		total += ownProduct.plusAmount - ownProduct.minusAmount;
	}

	if (total > 0) {
		SupporterBatchFront.setEnabled(true);
		SupporterBatchBack.setEnabled(true);
	}
});

/******/ })()
;