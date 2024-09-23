let grabbedItem = null;
let motionTime = 0;
let isPlayingMotion = false;
let isClashed = false;
let sourceItem = null;
let followItem = null;
let savedData = null;
let dropCoolTime = 0;
let isCancelableMotion = true;
let isNeedSave = false;
let currentSpeed = 1;
const allItemList =["cupperOre","clystal","ironOre","goldOre",
    "turuhashiNormal","turuhashiGold","turuhashiIron","turuhashiCupper","turuhashiClystal",
    "trophyRabbitCupper","trophyRabbitIron","trophyRabbitGold","trophyRabbitClystal"];

const animation1 = _.humanoidAnimation("Animation1");
const InventoryUI = _.playerLocalObject("InventoryUI");
const ItemDiscriptionUI = _.playerLocalObject("ItemDiscriptionUI");
const KabanMaxWarningText = _.playerLocalObject("KabanMaxWarningText");
const ItemDurationZeroText = _.playerLocalObject("ItemDurationZeroText");
const CantUseItemText = _.playerLocalObject("CantUseItemText");
const GoldUI = _.playerLocalObject("GoldUI");

const updateInventory = () => {

    if(savedData&&followItem){
        let targetSpeed = 1;
        if(savedData.inventoryData[savedData.currentSelectIndex] &&savedData.inventoryData[savedData.currentSelectIndex].baseMovementSpeed){
            targetSpeed = savedData.inventoryData[savedData.currentSelectIndex].baseMovementSpeed;
        }
        
        if(currentSpeed != targetSpeed){
            _.sendTo(followItem,"SetDefaultMovementSpeed",targetSpeed);
            currentSpeed = targetSpeed
        }
    }

    updateInventoryView();
    isNeedSave = true;
}

const updateInventoryView = () => {
    
    if(!followItem){
        InventoryUI.setEnabled(false);
        ItemDiscriptionUI.setEnabled(false);
        GoldUI.setEnabled(false);
        return;
    }

    InventoryUI.setEnabled(true);
    GoldUI.setEnabled(true);
    ItemDiscriptionUI.setEnabled(true);

    if(savedData.money){
        GoldUI.findObject("GoldText").getUnityComponent("Text").unityProp.text = savedData.money +"G";
    }else{
        GoldUI.findObject("GoldText").getUnityComponent("Text").unityProp.text = "0G";
    }

    for (var i =0; i<10; i++){

        const waku = InventoryUI.findObject("Waku0" + i);
        if(savedData.kabanSize<=i){
            waku.setEnabled(false);
            continue;
        }
        waku.setEnabled(true);
        const inventoryCount = waku.findObject("InventoryCount");
        const selectWaku = waku.findObject("SelectWaku");

        if(savedData.currentSelectIndex==i){
            selectWaku.setEnabled(true);
        }else{
            selectWaku.setEnabled(false);
        }

        //特定の子要素を一括で非表示にするみたいなのができない(getChildsみたいなのがない)ので手動で非表示処理


        for(itemName of allItemList){
            const itemIcon = waku.findObject("Icons").findObject(itemName);
            itemIcon.setEnabled(false);
        }
        
        const itemDurationBack = waku.findObject("DurationBack");
        const itemDuration = itemDurationBack.findObject("Duration");
        const breakedView = waku.findObject("Breaked");
        itemDuration.setEnabled(false);
        itemDurationBack.setEnabled(false);
        breakedView.setEnabled(false);

        //すべてのレア度表記を非表示
        const rarityAura = waku.findObject("RarityAura");
        for(let i =1 ; i<=5; i++){
            const auraIcon = rarityAura.findObject(i);
            auraIcon.setEnabled(false);
        }

        if(savedData.inventoryData.length>i){
            const inventoryData = savedData.inventoryData[i]

            const itemIcon = waku.findObject("Icons").findObject(savedData.inventoryData[i].itemName);
            itemIcon.setEnabled(true);
            
            const duration = savedData.inventoryData[i].duration;
            const maxDuration = savedData.inventoryData[i].maxDuration;
            const rarity = savedData.inventoryData[i].rarity;

            if(rarity){
                const auraIcon = rarityAura.findObject(rarity);
                auraIcon.setEnabled(true);
            }


            if(duration!=-1){
                itemDuration.setEnabled(true);
                itemDurationBack.setEnabled(true);
                
                const unityProp = itemDuration.getUnityComponent("Image").unityProp;
                const durationRatio = duration/maxDuration;

                if(duration<=0){
                    breakedView.setEnabled(true);
                }

                if(durationRatio>0.6){
                    unityProp.color = [0,1,0.2,1];
                }
                else if(durationRatio>0.3){
                    unityProp.color = [1,0.8,0.2,1];
                }
                else{
                    unityProp.color = [1,0.2,0.2,1];
                }

                unityProp.fillAmount = durationRatio;
            }

            if(inventoryData.isStackable){
                inventoryCount.setEnabled(true);
                inventoryCount.getUnityComponent("Text").unityProp.text = `${inventoryData.count}`;
            }
            else{                
                inventoryCount.setEnabled(false);
            }
        }
        else{
            inventoryCount.setEnabled(false);
        }
    }

    //アイテム詳細表示
    if(savedData.inventoryData.length>savedData.currentSelectIndex){
        const targetItem = savedData.inventoryData[savedData.currentSelectIndex];
        const targetItemCount = savedData.inventoryData[savedData.currentSelectIndex].count;
        const targetItemDuration = savedData.inventoryData[savedData.currentSelectIndex].maxDuration;
        const targetItemName = savedData.inventoryData[savedData.currentSelectIndex].itemName;
        _.sendTo(followItem, "VisibleItem", targetItemName);

        
        //特定の子要素を一括で非表示にするみたいなのができない(getChildsみたいなのがない)ので手動で非表示処理
        for(itemName of allItemList){
            const itemIcon = ItemDiscriptionUI.findObject("Icons").findObject(itemName);
            itemIcon.setEnabled(false);
        }

        const itemIcon = ItemDiscriptionUI.findObject("Icons").findObject(targetItemName);
        itemIcon.setEnabled(true);
        ItemDiscriptionUI.setEnabled(true);

        const itemText = ItemDiscriptionUI.findObject("ItemText").getUnityComponent("Text");
        const durationText = ItemDiscriptionUI.findObject("DurationText").getUnityComponent("Text");

        if(targetItemDuration==-1){
            durationText.unityProp.text = "（所持数："+targetItemCount+"）";
        }else{
            durationText.unityProp.text = "（つかえる回数:"+targetItem.duration + " / " +targetItem.maxDuration +"）";
        }

        let rarityText = "";
 

        if(targetItem.rarity){
            //レア度表記
            for(let i = 1; i<=5; i++){
                ItemDiscriptionUI.findObject("RarityAura").findObject(i).setEnabled(false);
            }
            ItemDiscriptionUI.findObject("RarityAura").findObject(targetItem.rarity).setEnabled(true);

            switch(targetItem.rarity){
                case 1:
                    rarityText = "（コモン）"
                    break;
                case 2:
                    rarityText = "（アンコモン）"
                    break;
                case 3:
                    rarityText = "（レア）"
                    break;
                case 4:
                    rarityText = "（エピック）"
                    break;
                case 5:
                    rarityText = "（レジェンダリー）"
                    break;
            }
        }


        if(targetItemDuration != -1)
        {   
            let specialEffectText = "";
            if(targetItem.specialEffect.length>0){
                for(const[index,spechialEffect] of targetItem.specialEffect.entries()){
                    specialEffectText += spechialEffect.effectName+RomanNum(spechialEffect.power);
                    if(index < targetItem.specialEffect.length-1){
                        specialEffectText += ",";
                    }
                }
            }else{
                specialEffectText = "なし";
            }

            itemText.unityProp.text = targetItem.itemDisplayName+"　"+rarityText+"\n特殊効果:"+specialEffectText;
        }
        else if(targetItemName == "cupperOre")
        {
            itemText.unityProp.text = "銅鉱石 "+rarityText+"\n加工しやすい鉱石。よく取れる";    
        }
        else if(targetItemName == "clystal")
        {
            itemText.unityProp.text = "クリスタル "+rarityText+"\nめずらしい鉱石。エンチャント確率が上がる";
        }
        else if(targetItemName == "goldOre")
        {
            itemText.unityProp.text = "金鉱石 "+rarityText+"\n柔らかくきれいな鉱石。価値が高い";
        }
        else if(targetItemName == "ironOre")
        {
            itemText.unityProp.text = "鉄鉱石 "+rarityText+"\n硬い鉱石。耐久力に優れる";
        }
        else{
            itemText.unityProp.text = targetItem.itemDisplayName+" "+rarityText+"\nきれいな飾り。"+targetItem.price+"Gで売れる";
        }        

    }else{
        _.sendTo(followItem, "VisibleItem", "");
        ItemDiscriptionUI.setEnabled(false);
    }
};

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

const getStackable = (itemName) => {
    switch(itemName){
        case "cupperOre":
        case "clystal":
        case "ironOre":
        case "goldOre":
            return true;
    }
}

const getDefaultDuration = (itemName) => {
    switch(itemName){
        case "turuhashi":
            return 10;
    }
    return -1;
}

const ResetSavedData = () => {
    savedData = {
        currentSelectIndex : 0,
        inventoryData : [],
        kabanSize : 4
    }
}

const Initialize = () => {
    followItem = null;
    _.hideButton(0);
    _.hideButton(1);
    _.hideButton(2);
}

const AddItem = (arg)=>{
    const isStackable = getStackable(arg.itemName);
    const targetIndex = savedData.inventoryData.findIndex(inventoryData =>{
        return inventoryData.itemName === arg.itemName && inventoryData.rarity === arg.rarity;
    });
    
    if(savedData.inventoryData.length>=savedData.kabanSize && 
        ( (targetIndex == -1 && isStackable ) || !isStackable)){
        KabanMaxWarningText.setEnabled(false);
        KabanMaxWarningText.setEnabled(true);
        _.sendTo(followItem, "PlaySound", "Cancel");
        return false;
    }

    
    if(!("duration" in arg) || !("maxDuration" in arg)){
        arg.duration = -1;
        arg.maxDuration = -1;
    }
    

    if(!arg.uuid){
        arg.uuid = generateUUID();
    }

    arg.isStackable = isStackable;
    
    if(targetIndex == -1 || !isStackable){
        savedData.inventoryData.push(arg);
    }else{
        savedData.inventoryData[targetIndex].count += arg.count;
    }

    return true;
}


_.onStart(() => {
    savedData = _.getPlayerStorageData();
    if (!savedData || !savedData.inventoryData || !savedData.currentSelectIndex) {
        ResetSavedData();
    }
    updateInventory(); 
});

_.onReceive((messageType, arg, sender) => {
    if (messageType === "RegisterFollowItem") {
        followItem = sender;
        _.showButton(1, _.iconAsset("Next"));
        _.showButton(2, _.iconAsset("Drop"));
        updateInventory(); 
    }

    if (messageType === "UnRegisterFollowItem") {
        Initialize();
    }
    
    if(messageType === "ResetAllSaveData"){
        ResetSavedData();
        updateInventory(); 
    }

    if(messageType === "getItem"){
        _.log("receve:getItem");
        const success = AddItem(arg);
        if(success){
            _.sendTo(sender,"GetItemReceived",null);
        }
        updateInventory();
    }

    if(messageType === "getItemList"){
        for(var itemData of arg){
            AddItem(itemData);
        }
        _.sendTo(sender,"GetItemReceived",null);
        updateInventory();
    }

    if(messageType === "removeItem"){

        const targetIndex = savedData.inventoryData.findIndex(inventoryData =>{
            return inventoryData.itemName === arg.itemName;
        });
        
        if(targetIndex == -1){
            _.log("存在しないアイテムを消去しようとしている:"+JSON.stringify(arg));
            return;
        }else{
            if(savedData.inventoryData[targetIndex].count<arg.count){
                _.log("所持しているアイテムより多い量を消去しようとしている:"+JSON.stringify(arg));
            }else{
                savedData.inventoryData[targetIndex].count -= arg.count;
                if(savedData.inventoryData[targetIndex].count==0){
                    savedData.inventoryData = savedData.inventoryData.filter(function(item){
                        return item.itemName !== arg.itemName;
                    });
                }
            }
        }
        updateInventory();
    }

    if(messageType === "AttackCurrentItem"){
        AttackCurrentItem(sender);
    }

    if(messageType === "UseSelectItem"){

        const targetIndex = savedData.currentSelectIndex;
        
        if(savedData.inventoryData.length<=targetIndex)return;

        savedData.inventoryData[targetIndex].count -= arg;

        const itemData = JSON.parse(JSON.stringify(savedData.inventoryData[targetIndex]));
        itemData.count = arg;
        
        if(savedData.inventoryData[targetIndex].count==0){
            savedData.inventoryData.splice(targetIndex,1);
        }
       

        _.sendTo(sender,"itemRemoved",itemData)

        updateInventory();
    }

    
    if(messageType === "RemoveSelectItem"){

        const targetIndex = savedData.currentSelectIndex;
        
        if(savedData.inventoryData.length<=targetIndex)return;
        savedData.inventoryData[targetIndex].count -= arg.count;

        const itemData = JSON.parse(JSON.stringify(savedData.inventoryData[targetIndex]));
        itemData.count = arg.count;
        
        if(savedData.inventoryData[targetIndex].count<=0){
            savedData.inventoryData.splice(targetIndex,1);
        }       

        _.sendTo(sender,"itemRemoved",itemData);
        updateInventory();
    }

    if(messageType === "consumeItem"){
        const targetIndex = savedData.currentSelectIndex;
        
        savedData.inventoryData[targetIndex].duration -= arg;
        
        if(savedData.inventoryData[targetIndex].duration<=0){
            savedData.inventoryData[targetIndex].duration = 0;
            _.sendTo(followItem, "PlaySound", "Break");
        }

        updateInventory();
    }

    if(messageType === "RepairItem"){
        _.log("receve:RepairItem:"+arg);

        if(arg=="all"){
            for(let i =0; i<savedData.inventoryData.length; i++){
                if(savedData.inventoryData[i].maxDuration){
                    savedData.inventoryData[i].duration = savedData.inventoryData[i].maxDuration;
                }
            }
        }
        updateInventory();
    }

    if(messageType === "CheckSelectItem"){
        const targetIndex = savedData.currentSelectIndex;
        if(savedData.inventoryData.length<=targetIndex)return;
        const itemData = JSON.parse(JSON.stringify(savedData.inventoryData[targetIndex]));    
        _.sendTo(sender,"itemChecked",itemData);
    }

    if(messageType === "CheckHasItem"){
        _.sendTo(sender,"CheckHasItemReceved",HasTargetItemName(arg));
    }

    if(messageType === "AddMoney"){
        if(savedData.money){
            savedData.money += arg.count;
        }else{
            savedData.money = arg.count;
        }
        updateInventory();
    }

    if(messageType === "RemoveMoney"){
        savedData.money -= arg.count;
        updateInventory();
    }

    if(messageType === "CheckMoney"){
        if(arg<=savedData.money){
            _.sendTo(sender,"MoneyChecked",true);
        }else{            
            _.sendTo(sender,"MoneyChecked",false);
        }
    }

    if(messageType === "AddKabanSize"){
        savedData.kabanSize+=arg;
        if(savedData.kabanSize>9)savedData.kabanSize = 9;
        updateInventory();
    }

}, {item: true, player:true});


const HasTargetItemName = (targetItemName) => {
    for(itemData of savedData.inventoryData){
        if(itemData.itemName == targetItemName){
            return true;
        }
    }
    return false;
}

const AttackCurrentItem = (target) => {
    if (!isCancelableMotion) return;

    const targetIndex = savedData.currentSelectIndex;
    if(savedData.inventoryData[targetIndex].duration==-1){
        _.sendTo(followItem, "PlaySound", "Cancel");
        CantUseItemText.setEnabled(false);
        CantUseItemText.setEnabled(true);
        return;
    }else if(savedData.inventoryData[targetIndex].duration==0){
        _.sendTo(followItem, "PlaySound", "Cancel");
        ItemDurationZeroText.setEnabled(false);
        ItemDurationZeroText.setEnabled(true);
        return;
    }

    _.sendTo(followItem, "Attack", {target:target,itemData:savedData.inventoryData[targetIndex]});
    _.sendTo(followItem, "PlaySound", "Swing");

    // モーション再生開始
    isPlayingMotion = true;
    isCancelableMotion = false;
    isClashed = false;
    motionTime = 0;
}

_.onButton(1, (isDown) => {
    if (!isCancelableMotion) return;
    if (isDown) {
        savedData.currentSelectIndex++;
        savedData.currentSelectIndex%=savedData.kabanSize;
        _.log(JSON.stringify(savedData));
        updateInventory();
    }
});

_.onButton(2, (isDown) => {
    if (!isCancelableMotion) return;
    if (isDown) {
        if(dropCoolTime>0)return;
        dropCoolTime = 0.2;
        
        if(savedData.inventoryData.length>savedData.currentSelectIndex){
            //参照渡しを回避
            const dropItem = JSON.parse(JSON.stringify(savedData.inventoryData[savedData.currentSelectIndex]));
            dropItem.count = 1;
            _.sendTo(followItem, "DropItem", dropItem);
            updateInventory();
        }
    }
});


let saveTime = 5.0;

_.onFrame(deltaTime => {

    if(saveTime>0)saveTime -= deltaTime;
    if(dropCoolTime>0)dropCoolTime -= deltaTime;

    if(saveTime<=0 && isNeedSave){
        if(savedData){
            _.log("savedData:"+JSON.stringify(savedData));
            _.setPlayerStorageData(savedData);
        }
        saveTime = 5.0;
        isNeedSave = false;
    }

    // モーション再生
    if (isPlayingMotion && followItem) {
        const targetItem = savedData.inventoryData[savedData.currentSelectIndex];
        
        let motionMultiple = 1;
        if(targetItem && targetItem.motionMultiple)motionMultiple *= targetItem.motionMultiple;

        motionTime += deltaTime * motionMultiple;
        isPlayingMotion = playMotion(animation1, motionTime);

        if(motionTime>0.35 && !isClashed){
            _.sendTo(followItem, "Clash", null);
            isClashed = true;
        }
    }
});


// 値がある範囲に収まるようにする
const clamp = (x, min, max) => {
    if (x < min) {
        return min;
    }
    else if (max < x) {
        return max;
    }
    else {
        return x;
    }
};

// xが0→1になるとき、0→1→0となる値を返す
// 最初からeaseInRateの期間で0→1、最後からeaseOutRateの期間で1→0になる
const easeInOut = (x, easeInRate, easeOutRate) => {
    x = clamp(x, 0, 1);

    let y = 1;

    if (x < easeInRate) {
        y = x / easeInRate;
    }
    else if (1 - easeOutRate < x) {
        y = (1 - x) / easeOutRate;
    }

    return y;
};

// モーションを適用し、モーションが終わりならfalseを返す
const playMotion = (animation, time) => {
    let animationLength = animation.getLength();
    let continuePlaying = (motionTime <= animationLength);

    //モーションが7割終わってたらキャンセル可能    
    let motionTimeRatio = motionTime / animationLength;
    isCancelableMotion = motionTimeRatio >= 0.7;
    //_.log(isCancelableMotion);    

    if (continuePlaying) {
        let pose = animation.getSample(time);

        // 通常モーションとスムーズに切り替わるよう、モーションの始めと終わりでweightが小さくなるようにする
        let timeRate = time / animationLength;
        let weight = easeInOut(timeRate, 0.1, 0.1);

        _.setHumanoidPoseOnFrame(pose, weight);

        // モーション再生は終わっていない
        return true;
    }

    return continuePlaying;
};


function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}