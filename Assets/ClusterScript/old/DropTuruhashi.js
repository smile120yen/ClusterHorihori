const pickupSound = $.audio("Pickup");
const subNode = $.subNode("Visual");

$.onStart(()=>{
    $.state.interactCoolTime = 0;
    $.state.isPickuped = false;
});

$.onReceive((messageType, arg, sender) => {

    if(messageType === "setStatus"){
        $.log("receve on :"+JSON.stringify(arg));
        $.state.itemStatus = arg;
    }

    if (messageType === "GetItemReceived") {
        $.log("GetItemReceived");
        pickupSound.play();
        subNode.setEnabled(false);
        $.state.isPickuped = true;
        $.state.time = 3;
    }

    if(messageType === "ForceDestory"){
        $.Destroy();
    }
    
}, {item: true, player:true});

$.onInteract(player => {
    if($.state.interactCoolTime>0)return;
    $.state.interactCoolTime = 3;
    player.send("getItem",$.state.itemStatus);
});

$.onUpdate((deltaTime) => {

    $.state.interactCoolTime -= deltaTime;

    if($.state.isPickuped){
        $.state.time = ($.state.time ?? 0) - deltaTime;
        if ($.state.time <= 0) {
            $.Destroy();
        }
    }
});