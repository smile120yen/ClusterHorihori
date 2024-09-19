const pickupSound = $.audio("Pickup");
const sellItemSound = $.audio("SellItem");
const sellerText = $.subNode("SellerText").getUnityComponent("Text");


$.onStart(()=>{
    $.state.isCheckItemPrice = false;
    $.state.checkedItem = null;
    $.state.resetCooldownTime = 5;
    sellerText.unityProp.text = "まいど！\nどのアイテムを売ってくれるんだ？";
});

$.onInteract(player => {
    player.send("CheckSelectItem",null);
});


$.onReceive((requestName, arg, sender) => {
    if(requestName == "itemChecked"){
        $.log("itemCheckReceve:"+JSON.stringify(arg));

        if(arg.uuid == $.state.checkedItemUUID){
            sellerText.unityProp.text = "まいどあり！";
            sender.send("RemoveSelectItem",{count:arg.count});
            sender.send("AddMoney",{count:(arg.count*arg.price)});
            sellItemSound.play();
        }else{
            pickupSound.play();
            if(!arg.price)arg.price = 0;
            sellerText.unityProp.text = arg.itemDisplayName + "を" + arg.count+"コ売ってくれるのかい？\nそれなら"+(arg.price * arg.count)+"Gでどうだ";
    
            $.state.isCheckItemPrice = true;
            $.state.checkedItemUUID = arg.uuid;
        }
    }

}, {item: true, player:true});


$.onUpdate((deltaTime) => {
    if($.state.isCheckItemPrice){
        let cooldown = $.state.resetCooldownTime;
        cooldown -= deltaTime;

        if(cooldown<=0){
            sellerText.unityProp.text = "まいど！\nどのアイテムを売ってくれるんだ？";
            $.state.isCheckItemPrice = false;
            $.state.checkedItemUUID = null;
        }
    }
});