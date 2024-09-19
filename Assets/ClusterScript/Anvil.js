const damagedSound = $.audio("Metal");
const putonSound = $.audio("Puton");
const completeSound = $.audio("Complete");
const getItemSound = $.audio("GetItem");
const cancelSound = $.audio("Cancel");
const ItemText = $.subNode("ItemText").getUnityComponent("Text");
const usingPlayerText = $.subNode("UsingPlayer").getUnityComponent("Text");
const CraftProgress = $.subNode("CraftProgress").getUnityComponent("Image");
const CraftProgressText = $.subNode("CraftProgressText").getUnityComponent("Text");
const ItemSpawnPoint = $.subNode("ItemSpawnPoint");
const ProgressWaku = $.subNode("ProgressWaku");
const CompleteWaku = $.subNode("CompleteWaku");
const completeItemText = $.subNode("CompleteItemDiscriptionText").getUnityComponent("Text");
const ExpectationItemText = $.subNode("ExpectationItem").getUnityComponent("Text");
const canvas = $.subNode("Canvas");
const countWarning = $.subNode("CountWarning");
const nothingItemWarning = $.subNode("NothingItemWarning");
const allItemList =["cupperOre","clystal","ironOre","goldOre",
    "turuhashiNormal","turuhashiGold","turuhashiIron","turuhashiCupper","turuhashiClystal",
    "trophyRabbitCupper","trophyRabbitIron","trophyRabbitGold","trophyRabbitClystal"];

const getRandomItem = (usedItemList) => {

    $.log(JSON.stringify(usedItemList));

    const newItem = {
        count :1,
        motionMultiple : 1
    }

    //使用したアイテムの個数に応じてランダムで完成品の見た目が決まる
    let usedItemCount = 0;
    for(item of usedItemList){
        usedItemCount += item.count;
    }

    let randCount = Math.floor(Math.random() * usedItemCount)+1;
    
    let priorityItemName = "";
    for(item of usedItemList){
        randCount -= item.count;
        if(randCount<=0){
            priorityItemName = item.itemName;
        }
    }

    let basePrice = 0;
    for(item of usedItemList){
        basePrice += item.price;
    }
    
    if(usedItemCount>=10){
        newItem.itemName = "turuhashi";
        newItem.itemDisplayName = "つるはし"
        newItem.duration = 10 + $.state.durationPower;
        newItem.maxDuration = 10 + $.state.durationPower;
        newItem.specialEffect = [];
        newItem.baseMovementSpeed = 1;
        newItem.bonusDropChance = 0;
        newItem.luck = 1;
        newItem.craftSpeed = 1;
        newItem.durationReduce = 0;
        newItem.motionMultiple = 1;
    }else{
        newItem.itemName = "trophyRabbit";
        newItem.itemDisplayName = "うさぎ"
        newItem.duration = -1;
        newItem.maxDuration = -1;
    }

    switch(priorityItemName){
        case "cupperOre":
            newItem.itemName += "Cupper";
            newItem.itemDisplayName = "銅の"+newItem.itemDisplayName;
            newItem.price = basePrice*3;
            break;
        case "ironOre":
            newItem.itemName += "Iron";
            newItem.itemDisplayName = "鉄の"+newItem.itemDisplayName;
            newItem.price = basePrice*4;
            
            if(newItem.maxDuration!=-1){
                newItem.duration *= 2;
                newItem.maxDuration *= 2;
            }

            break;
        case "goldOre":
            newItem.itemName += "Gold";
            newItem.itemDisplayName = "金の"+newItem.itemDisplayName;
            newItem.price = basePrice*5;
            
            if(newItem.maxDuration!=-1){
                newItem.duration *= 3;
                newItem.maxDuration *= 3;
            }

            break;
        case "clystal":
            newItem.itemName += "Clystal";
            newItem.itemDisplayName = "クリスタルの"+newItem.itemDisplayName;
            newItem.price = basePrice*6;

            if(newItem.maxDuration!=-1){
                newItem.duration *= 4;
                newItem.maxDuration *= 4;
            }

            break;
    }

    newItem.rarity = Math.floor($.state.rarityPower/usedItemCount + Math.random()*1.2);
    if(newItem.rarity>5)newItem.rarity=5;
    if(newItem.rarity<1)newItem.rarity=1;

    switch(newItem.rarity){
        case 2:    
            if(newItem.maxDuration!=-1){   
                newItem.duration *= 1.3;
                newItem.maxDuration *= 1.3;
            }
            newItem.price *= 1.3;
            break;
        case 3:            
            if(newItem.maxDuration!=-1){   
                newItem.duration *= 1.6;
                newItem.maxDuration *= 1.6;
            }
            newItem.price *= 1.6;
            break;
        case 4:            
            if(newItem.maxDuration!=-1){   
                newItem.duration *= 2;
                newItem.maxDuration *= 2;
            }
            newItem.price *= 2;
            break;
        case 5:            
            if(newItem.maxDuration!=-1){   
                newItem.duration *= 3;
                newItem.maxDuration *= 3;
            }
            newItem.price *= 3;
            break;
    }

    const statusRand = Math.floor(Math.random()*3);
    
    switch(statusRand){
        case 0:
            newItem.itemDisplayName = "ショボい"+newItem.itemDisplayName;
            newItem.price *= 0.7;
            if(newItem.maxDuration!=-1){
                newItem.duration *= 0.9;
                newItem.maxDuration *= 0.9;
            }
            break;
        case 1:
            newItem.itemDisplayName = "ふつうの"+newItem.itemDisplayName;
            break;
        case 2:
            newItem.itemDisplayName = "上等な"+newItem.itemDisplayName;
            newItem.price *= 1.3;
            if(newItem.maxDuration!=-1){
                newItem.duration *= 1.5;
                newItem.maxDuration *= 1.5;
            }
            break;
    }

    const randSpecialEffect = Math.floor(Math.random()*5);
    switch(randSpecialEffect){
        case 0:
            newItem.specialEffect.push({effectName:"ドロップ鉱石強化",power:1});
            newItem.luck = 2;
            break;
        case 1:
            newItem.specialEffect.push({effectName:"移動速度アップ",power:1});
            newItem.baseMovementSpeed = 1.3;
            break;
        case 2:
            newItem.specialEffect.push({effectName:"ドロップ確率アップ",power:1});
            newItem.bonusDropChance = 0.2;
            break;
        case 3:
            newItem.specialEffect.push({effectName:"クラフト速度アップ",power:1});
            newItem.craftSpeed = 1;
            break;
        case 4:
            newItem.specialEffect.push({effectName:"耐久力消費軽減",power:1});
            newItem.durationReduce = 1;
            break;
    }

    newItem.price = Math.floor(newItem.price);
    newItem.duration = Math.floor(newItem.duration);
    newItem.maxDuration = Math.floor(newItem.maxDuration);

    if(newItem.duration<0)newItem.duration=-1;
    if(newItem.maxDuration<0)newItem.maxDuration=-1;

    return newItem;
}


const updateUsedItemText = () => {
    const itemList = $.state.usedItemList;
    const itemCountList = [];
    let itemTotalCount = 0;
    for(const itemData of itemList){
        const index = itemCountList.findIndex(({itemName})=> itemName === itemData.itemName);
        if(index == -1){
            itemCountList.push({itemName:itemData.itemName,itemDisplayName:itemData.itemDisplayName,count:itemData.count});
        }else{
            itemCountList[index].count += itemData.count;
        }
        itemTotalCount += itemData.count;
    }

    let text = "素材アイテム\n";
    for(const itemCountData of itemCountList){
        text += itemCountData.itemDisplayName + " " + itemCountData.count+"コ\n";
    }

    ItemText.unityProp.text = text;

    let newExpectationText = "";
    if(itemTotalCount<10){
        newExpectationText +="素材が10個以下のため、装飾品を制作します\n";
    }else{        
        newExpectationText +="ツルハシを制作します\n";
    }

    newExpectationText +="耐久性："+$.state.durationPower +"\n";

    let rarityPower = 0;
    if(itemTotalCount>0){
        rarityPower = ($.state.rarityPower/itemTotalCount).toFixed(1);
    }
    newExpectationText +="レアリティパワー："+ rarityPower +"\n";
    newExpectationText +="エンチャント追加確率："+$.state.enchantPower +"%";

    ExpectationItemText.unityProp.text = newExpectationText;
}

const updateProgressView = () => {
    
    const currentCraftProgress = $.state.currentCraftProgress;
    const craftProgressMax = $.state.craftProgressMax;
    
    CraftProgress.unityProp.fillAmount = currentCraftProgress / craftProgressMax;
    CraftProgressText.unityProp.text = currentCraftProgress +"/"+ craftProgressMax;
}


const updateCompleteView = (finishingProductItem) =>{
    //手動で非表示処理
    for(itemName of allItemList){
        $.subNode(itemName).setEnabled(false);
    }

    itemIcon = $.subNode(finishingProductItem.itemName);
    itemIcon.setEnabled(true);

    let rarityText = "";
            
    for(var i=0; i<5; i++){
        if(finishingProductItem.rarity>i){
            rarityText += "★";
        }else{
            rarityText += "☆";
        }
    }

    let specialEffectText = "";

    if(finishingProductItem.specialEffect.length>0){
        for(const[index,specialEffect] of finishingProductItem.specialEffect.entries()){
            specialEffectText += specialEffect.effectName+RomanNum(specialEffect.power);
            if(index < finishingProductItem.specialEffect.length-1){
                specialEffectText += ",";
            }
        }
    }else{
        specialEffectText = "なし";
    }

    if(finishingProductItem.maxDuration!=-1){
        completeItemText.unityProp.text = finishingProductItem.itemDisplayName + "　" + rarityText+"\n"
        +"つかえる回数："+finishingProductItem.duration+" / "+finishingProductItem.maxDuration
        +"\n\n特殊効果：\n"+specialEffectText;
    }else{
        completeItemText.unityProp.text = finishingProductItem.itemDisplayName + " " + rarityText + "\n"
        +"売値："+finishingProductItem.price;
    }
} 


const RomanNum = (num) =>{
    switch(num){
        case 1:
            return "Ⅰ";
        case 2:
            return "Ⅱ";
        case 3:
            return "Ⅲ";
        case 4:
            return "Ⅳ";
        case 5:
            return "Ⅴ";
    }
}

$.onStart(()=>{
    $.state.interactCoolTime = 0;
    $.state.usedItemList = [];
    $.state.spawnDummyItemList = [];
    $.state.craftProgressMax = 10;
    $.state.currentCraftProgress = 0;
    $.state.usingPlayer = null;
    $.state.removeAllDummyItem = false;
    $.state.removeAllDummyItemWaitTime = 0;
    $.state.contentWarningEnableTime = 0;
    $.state.nothingItemWarningEnableTime = 0;
    
    $.state.durationPower = 0;
    $.state.rarityPower = 0;
    $.state.enchantPower = 0;
    
    updateUsedItemText();
    updateProgressView();
});

$.onReceive((requestName, arg, sender) => {
    if (requestName == "damage") {
        
        if($.state.usedItemList.length<=0){
            cancelSound.play();
            nothingItemWarning.setEnabled(true);
            $.state.nothingItemWarningEnableTime = 0.4;
            return;
        }

        if($.state.currentCraftProgress>= $.state.craftProgressMax) return;

        $.log("ダメージ受信");
        $.sendSignalCompat("this", "damage");
        damagedSound.play();
        sender.send("ReceiveDamage",1);

        $.state.currentCraftProgress++;
        if($.state.currentCraftProgress>= $.state.craftProgressMax){
            completeSound.play();
            ProgressWaku.setEnabled(false);
            CompleteWaku.setEnabled(true);

            //入っているアイテムで決まる

            $.state.finishingProductItem = getRandomItem($.state.usedItemList);
            $.log("Anvil complete:"+JSON.stringify($.state.finishingProductItem));

            updateCompleteView($.state.finishingProductItem);
                    
            $.state.durationPower = 0;
            $.state.rarityPower = 0;
            $.state.enchantPower = 0;
            
            spawnDummyItemList = $.state.spawnDummyItemList;
            $.state.removeAllDummyItem = true;

            $.state.usedItemList = [];
        }
        updateProgressView();
        updateUsedItemText();        
    }

    if(requestName == "itemRemoved"){
        const itemList = $.state.usedItemList;
        
        $.log("Receve itemRemoved:"+JSON.stringify(arg));
        
        $.state.durationPower += arg.durationPower;
        $.state.enchantPower += arg.enchantPower;
        if($.state.enchantPower<100) $.state.enchantPower = 100;
        $.state.rarityPower += arg.rarity;

        itemList.push(arg);

        $.log("Anvil:"+JSON.stringify(itemList));

        $.state.usedItemList = itemList;


        let addPositon = new Vector3(0,1.5,0);
        let spawnPosition = $.getPosition().clone().Add(addPositon);

        const usedItem = new WorldItemTemplateId(arg.itemName);
        let followingItem = $.createItem(usedItem, spawnPosition, $.getRotation());

        const spawnDummyItemList = $.state.spawnDummyItemList;
        spawnDummyItemList.push(followingItem);
        $.state.spawnDummyItemList = spawnDummyItemList;

        $.log("spawnDummyItemList:"+spawnDummyItemList.length+","+JSON.stringify(spawnDummyItemList));

        putonSound.play();

        updateProgressView();
        updateUsedItemText();

    }

    if(requestName == "GetItemReceived"){
        getItemSound.play();
        removeUsingPlayer();
    }

    if(requestName === "itemChecked"){
        if(arg.maxDuration!=-1){
            sender.send("AttackCurrentItem",null);
        }else if(arg.useableAnvil){
            const itemList = $.state.usedItemList;
            let itemCount = 0;
            for(item of itemList){
                itemCount += item.count;
            }
        
            if(itemCount<20){
                sender.send("UseSelectItem",1);
                $.state.usingPlayer = sender;
            }else{
                countWarning.setEnabled(true);
                $.state.contentWarningEnableTime = 0.4;
                cancelSound.play();
            }
        }else{            
            cancelSound.play();
        }           
    }

}, {item: true, player:true});


const removeUsingPlayer = () =>{
    $.state.usingPlayer = null;
    $.state.removeAllDummyItem = true;
    $.state.currentCraftProgress = 0;
    $.state.finishingProductItem = null;
    $.state.usedItemList = [];
    ProgressWaku.setEnabled(true);
    CompleteWaku.setEnabled(false);
    updateProgressView();
    updateUsedItemText();
}

$.onUpdate((deltaTime) => {    
    $.state.contentWarningEnableTime = $.state.contentWarningEnableTime - deltaTime;
    $.state.nothingItemWarningEnableTime = $.state.nothingItemWarningEnableTime - deltaTime;
    $.state.interactCoolTime -= deltaTime;
    $.state.removeAllDummyItemWaitTime -= deltaTime;

    if($.state.contentWarningEnableTime<=0){
        countWarning.setEnabled(false);
    }

    if($.state.nothingItemWarningEnableTime<=0){
        nothingItemWarning.setEnabled(false);
    }

    if($.getPlayersNear($.getPosition(), 3).length>=1){
        canvas.setEnabled(true);
    }else{
        canvas.setEnabled(false);
    }

    if($.state.usingPlayer && !$.state.usingPlayer.exists()){
        removeUsingPlayer();
    }

    if($.state.usingPlayer){
        const distance = $.state.usingPlayer.getPosition().clone().sub($.getPosition()).length();
        
        if(distance>7){
            $.state.usingPlayerRemoveTime -= deltaTime;
        }else{
            $.state.usingPlayerRemoveTime = 5;
        }

        if($.state.usingPlayerRemoveTime<=0){
            removeUsingPlayer();
        }        
    }    

    if($.state.removeAllDummyItem && $.state.removeAllDummyItemWaitTime<=0){        
        const spawnDummyItemList = $.state.spawnDummyItemList;

        if(spawnDummyItemList.length>0){
            const targetItemHandle = spawnDummyItemList.pop();
            if(targetItemHandle){
                try{
                    targetItemHandle.send("ForceDestory",null);
                }catch{
                    spawnDummyItemList.push(targetItemHandle);
                }
            }
        }

        $.state.spawnDummyItemList = spawnDummyItemList;
        $.state.removeAllDummyItemWaitTime = 0.01;

        if(spawnDummyItemList.length<=0){
            $.state.removeAllDummyItem = false;
        }
    }

    if($.state.usingPlayer && $.state.usingPlayer != null && $.state.usingPlayer.exists()){
        usingPlayerText.unityProp.text = $.state.usingPlayer.userDisplayName+"が使用中";
    }
    else{
        usingPlayerText.unityProp.text = "使用可能";
    }
});

$.onInteract(player => {

    if($.state.interactCoolTime>0)return;
    $.state.interactCoolTime = 0.3;

    //使用中のプレイヤーじゃなければ触れない
    if($.state.usingPlayer != null && $.state.usingPlayer.id != player.id && $.state.usingPlayer.exists())return;

    if($.state.currentCraftProgress>= $.state.craftProgressMax) {
        player.send("getItem",$.state.finishingProductItem);
        return;
    }

    player.send("CheckSelectItem",null);
    
});