const swingSound = $.audio("Swing");
const pickupSound = $.audio("Pickup");
const subNode = $.subNode("Visual");

const playSound = () => {
    swingSound.play();
};

$.onGrab((isGrab, isLeftHand, player) => {
    if (isGrab) {
      player.send("Grabbed", null);
      $.state.playerHandle = player;
      $.state.isAttack = false;
    }
    else {
      player.send("Released", null);
      $.state.playerHandle.setMoveSpeedRate(1);
      $.state.playerHandle = null;
    }
  
});
  
$.onReceive((messageType, arg, sender) => {    
    // 効果音を鳴らす
    if (messageType === "PlaySound") {
        playSound();
    }

    if (messageType === "Attack") {
        $.state.overlapItems = [];
        $.state.ClashTime = 0.3;
        if($.state.playerHandle!=null)
            $.state.playerHandle.setMoveSpeedRate(0.2);
    }
    
    if (messageType === "EndAttack") {
        if($.state.playerHandle!=null)
            $.state.playerHandle.setMoveSpeedRate(1);
    }

    if (messageType === "Clash") {
        $.state.isClash = true;
        $.log("Clash");
    }

    if(messageType === "PutIn"){
        if($.state.isPickuped == true)return;
        pickupSound.play();
        subNode.setEnabled(false);

        sender.send("getItem",{
            itemName: "turuhashi",
            count : 1
        });
            
        $.state.isPickuped = true;
        $.state.time = 1;
    }

}, {item: true, player:true});


$.onUpdate(deltaTime => {   

    //ピックアップ処理
    if($.state.isPickuped){
        $.state.time = ($.state.time ?? 0) - deltaTime;
        if ($.state.time <= 0) {
            $.Destroy();
        }
    }

    //破壊処理
    if($.state.isClash){
        // 接触していたアイテムIDの一覧
        let previousOverlapItems = $.state.overlapItems;

        // 接触しているオブジェクトをすべて取得
        let overlaps = $.getOverlaps();

        overlaps.forEach(overlap => {
            // 接触しているオブジェクトがアイテムであるかどうかを確認
            let itemHandle = overlap.object.itemHandle;
            if (itemHandle == null) return;

            // 前のフレームで接触していたアイテムは除外
            if (previousOverlapItems.includes(itemHandle.id)) {
                //$.log("除外");
                return;
            }

            // メッセージを送信
            $.log("damage送信");
            itemHandle.send("damage", 10);

            // 現在接触しているアイテムの一覧に追加
            previousOverlapItems.push(itemHandle.id);
        });
        
        $.state.overlapItems = previousOverlapItems;

        $.state.ClashTime -= deltaTime;
        if($.state.ClashTime <=0){
            $.state.isClash = false;
        }
    }
});