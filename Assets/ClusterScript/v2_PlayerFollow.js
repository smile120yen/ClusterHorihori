const DropSound = $.audio("Drop");

const registerPlayer = (player) => {
    $.state.followingPlayer = player;
};

$.onStart(() => {
    $.log("created");
    $.state.followingPlayer = null;
    $.state.beforeSelectItem = null;
    $.state.damageMessageCashe = [];
    $.state.damageMessageProcessTime = 0;
    $.state.underLimitHeight = -1.5;
    $.state.grabItemSpawner = null;
    $.state.attackedTarget = null
    $.state.damagedItem = null
    $.state.defaultMovementSpeed = 1;
});

$.onGrab((isGrab,isLeftHand,player) => {
    if(isGrab){
        registerPlayer(player);
        player.send("RegisterFollowItem",null);
        $.subNode("GetCollision").setEnabled(false);
        
        if($.state.grabItemSpawner){
            $.state.grabItemSpawner.send("SpawnNewGrabItem",null);
            $.state.grabItemSpawner = null;
        }

    }else{
        registerPlayer(null);
        player.send("UnRegisterFollowItem",null);
        player.setMoveSpeedRate(1);
        $.destroy();
    }
});

$.onReceive((messageType, arg, sender) => {
    if(messageType === "SetDefaultMovementSpeed"){
        $.state.defaultMovementSpeed = arg;
        player.setMoveSpeedRate($.state.defaultMovementSpeed);
    }

    if (messageType === "DropItem") {
        //このPlayerFollowのownerがスコアの所持者であることを前提としている
        DropSound.play();
        let headRotation = $.state.followingPlayer.getHumanoidBoneRotation(HumanoidBone.Head);
        let addPositon = new Vector3(0,0.5,0.6).applyQuaternion(headRotation);
        let spawnPosition = $.getPosition().clone().Add(addPositon);
        const dropItemPrefab = new WorldItemTemplateId(arg.itemName);
        let dropItem = $.createItem(dropItemPrefab, spawnPosition, headRotation);
        dropItem.send("setStatus",arg);
        
        $.state.followingPlayer.send("RemoveSelectItem",{itemName:[],count:1});

        let addForce = new Vector3(0,0,3).applyQuaternion(headRotation);
        dropItem.addImpulsiveForce(addForce);
    }

    if(messageType==="VisibleItem"){

        if($.state.beforeSelectItem){
            const beforeVisibleSubNode = $.subNode($.state.beforeSelectItem);
            if(beforeVisibleSubNode){
                beforeVisibleSubNode.setEnabled(false);
            }
        }

        const currentVisibleSubNode = $.subNode(arg);
        if(currentVisibleSubNode){
            currentVisibleSubNode.setEnabled(true);
        }

        $.state.beforeSelectItem = arg;
    }

    if(messageType==="PlaySound"){
        const playSound = $.audio(arg);
        playSound.play();
    }

    if (messageType === "Attack") {
        $.state.overlapItems = [];
        $.state.clashTime = 0.2;
        $.state.playerHandle = sender;
        $.state.attackedTarget = arg.target;
        $.state.damagedItem  = arg.itemData;
        sender.setMoveSpeedRate(0.2);
    }

    if (messageType === "Clash") {
        $.state.isClash = true;

        const target = $.state.attackedTarget;
        //ダメージキャッシュに保存
        const damageMessageCashe =$.state.damageMessageCashe;
        damageMessageCashe.push(target);
        $.state.damageMessageCashe = damageMessageCashe;

        $.log("Clash");
    }
    
    if(messageType === "ReceiveDamage"){        
        let followingPlayer = $.state.followingPlayer;
        followingPlayer.send("consumeItem",arg);
    }

    if(messageType === "RegisterGrabItemSpawner"){
        $.state.grabItemSpawner = sender;
    }

}, {item: true, player:true});

$.onUpdate((deltaTime) => {

    //ダメージキャッシュを処理
    $.state.damageMessageProcessTime-=deltaTime;
    if($.state.damageMessageProcessTime<0){
        const damageMessageCashe =$.state.damageMessageCashe;
        if(damageMessageCashe.length>0){
            const damageMessageTarget =  damageMessageCashe.shift();
            $.log("damage送信");
            try{
                damageMessageTarget.send("damage", $.state.damagedItem);
            }catch{
                damageMessageCashe.unshift(damageMessageTarget);
            }
            $.state.damageMessageCashe = damageMessageCashe;
            $.state.damageMessageProcessTime = 0.01;
        }
    }

    
    let followingPlayer = $.state.followingPlayer;

    // プレイヤーが居なくなるとアイテムも消える
    if (followingPlayer && followingPlayer.exists() === false)
    {
        $.destroy();
        return;
    };
    

    //破壊してから一定時間後に移動可能に
    if($.state.isClash){
        let clashTime = $.state.clashTime;
        clashTime -= deltaTime;
        //$.log(clashTime);
        if(clashTime <=0){
            //$.log("endClash");
            let followingPlayer = $.state.followingPlayer;
            followingPlayer.setMoveSpeedRate($.state.defaultMovementSpeed);
            $.state.isClash = false;
        }
        $.state.clashTime = clashTime;
    }
});