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
    $.state.attackedTarget = null
});

$.onReceive((messageType, arg, sender) => {
    // 追従対象プレイヤーを登録
    if (messageType === "RegisterPlayer") {
        registerPlayer(arg);
    }

    if (messageType === "DropItem") {
        //このPlayerFollowのownerがスコアの所持者であることを前提としている
        //$.log("drop");
        DropSound.play();
        let headRotation = $.state.followingPlayer.getHumanoidBoneRotation(HumanoidBone.Head);
        let addPositon = new Vector3(0,0.5,0.6).applyQuaternion(headRotation);
        let spawnPosition = $.getPosition().clone().Add(addPositon);
        const dropItemPrefab = new WorldItemTemplateId(arg.itemName);
        let dropItem = $.createItem(dropItemPrefab, spawnPosition, headRotation);
        dropItem.send("setStatus",arg);
        
        $.state.followingPlayer.send("RemoveSelectItem",{itemName:[],count:1});

        //$.sendSignalCompat("owner","itemGetAnim");

        let addForce = new Vector3(0,0,3).applyQuaternion(headRotation);
        dropItem.addImpulsiveForce(addForce);
    }

    if(messageType==="VisibleItem"){
       
        //$.log(typeof $.state.beforeSelectItem);

        if($.state.beforeSelectItem){
            const beforeVisibleSubNode = $.subNode($.state.beforeSelectItem);
            if(beforeVisibleSubNode){
                beforeVisibleSubNode.setEnabled(false);
            }
        }
       
        //$.log($.state.beforeSelectItem);
        //$.log(arg);

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
        $.state.ClashTime = 0.3;
        $.state.playerHandle = sender;
    }

    if (messageType === "Clash") {
        $.state.isClash = true;
        $.log("Clash");
    }
    
    if(messageType === "SetMoveSpeedRate"){
        if($.state.playerHandle!=null)
            $.state.playerHandle.setMoveSpeedRate(arg);
    }

    if(messageType === "ReceiveDamage"){        
        let followingPlayer = $.state.followingPlayer;
        followingPlayer.send("consumeItem",arg);
    }

}, {item: true, player:true});

$.onUpdate((deltaTime) => {
    $.state.damageMessageProcessTime-=deltaTime;
    if($.state.damageMessageProcessTime<0){
        const damageMessageCashe =$.state.damageMessageCashe;
        if(damageMessageCashe.length>0){
            const damageMessageTarget =  damageMessageCashe.shift();
            $.log("damage送信");
            damageMessageTarget.send("damage", 10);
            $.state.damageMessageCashe = damageMessageCashe;
            $.state.damageMessageProcessTime = 0.1;
        }
    }

    let followingPlayer = $.state.followingPlayer;
    if (!followingPlayer) return;

    // プレイヤーが居なくなるとアイテムも消える
    if (followingPlayer.exists() === false)
    {
        $.destroy();
        return;
    };

    // プレイヤー位置・回転に追従
    //let position = followingPlayer.getPosition();
    let position = followingPlayer.getHumanoidBonePosition(HumanoidBone.RightHand);

    // 位置の下限を適用
    position.y = Math.max(position.y, $.state.underLimitHeight);
    //let rotation = followingPlayer.getRotation();
    let rotation = followingPlayer.getHumanoidBoneRotation(HumanoidBone.RightHand);
    $.setPosition(position);
    $.setRotation(rotation);

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
            //$.log("damage送信");
            //itemHandle.send("damage", 10);
            const damageMessageCashe =$.state.damageMessageCashe;
            damageMessageCashe.push(itemHandle);
            $.state.damageMessageCashe = damageMessageCashe;

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