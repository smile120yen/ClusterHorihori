const pickupSound = $.audio("Pickup");
const buyItemSound = $.audio("BuyItem");
const cancelSound = $.audio("Cancel");
const sellerText = $.subNode("SellerText").getUnityComponent("Text");

const buyItemName = "カバンの拡張";
const buyItemDiscription = "インベントリが1マス増える"
const price = 1000;

$.onStart(()=>{
    Initialize();
});

$.onInteract(player => {
    player.send("CheckMoney",price);
});


$.onReceive((requestName, arg, sender) => {
    if(requestName == "MoneyChecked"){
        $.state.isCheckItemPrice = true;
        if(arg){
            buyItemSound.play();
            sellerText.unityProp.text = "ご購入ありがとうございました！";
            sender.send("RemoveMoney",{count:price});
            sender.send("AddKabanSize",1);
        }else{
            cancelSound.play();
            sellerText.unityProp.text = "ゴールドが足りません\n（価格:"+price+"G）";
        }
    }
}, {item: true, player:true});


$.onUpdate((deltaTime) => {
    if($.state.isCheckItemPrice){
        let cooldown = $.state.resetCooldownTime;
        cooldown -= deltaTime;
        $.state.resetCooldownTime = cooldown;

        if(cooldown<=0){
            Initialize();
        }
    }
});

const Initialize = () => {
    $.state.isCheckItemPrice = false;
    $.state.resetCooldownTime = 5;
    sellerText.unityProp.text = buyItemName+"\n"+buyItemDiscription+"\n"+price+"G";
}