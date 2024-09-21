const pickupSound = $.audio("Pickup");
const cancelSound = $.audio("Cancel");
const fukidashiText = $.subNode("FukidashiText").getUnityComponent("Text");

// @field(string)
const itemName = "turuhashiNormal";
// @field(string)
const itemDisplayName = "ボロいつるはし";
// @field(int)
const duration = 10;
// @field(int)
const maxDuration = 10;
// @field(float)
const motionMultiple = 1;
// @field(int)
const rarity =  1;
const specialEffect = [];
// @field(int)
const count = 1;
// @field(int)
const price = 0;
// @field(bool)
const useableAnvil = false;

const talkCooltimeMax = 1;
const defaultTalkText = "新入りかい？\nボロでよけりゃツルハシをやるぜ";

$.onStart(()=>{
    $.state.talkCooltime = talkCooltimeMax;
    $.state.isTalkStart = false;
    $.state.getPlayerList = [];
    fukidashiText.unityProp.text = defaultTalkText;
    $.state.talkCooltime = talkCooltimeMax;
});

$.onInteract(player => {
    if(!$.state.isTalkStart){
        player.send("CheckHasItem",itemName);
    }
});

$.onReceive((requestName, arg, sender) => {
    const time = GetTuruhashiRecentoryTime(sender);
    if(requestName == "CheckHasItemReceved"){
        if(time){
            fukidashiText.unityProp.text = "さっきあげただろ！\nもう少しがんばってからまた来な\n（クールタイム:"+(30-time)+"秒）";
            cancelSound.play();
            
            $.state.isTalkStart = true;
            $.state.talkCooltime = talkCooltimeMax;
        }        
        else{
            fukidashiText.unityProp.text = "ほらよ！がんばんな！"
            pickupSound.play();

            $.state.isTalkStart = true;
            $.state.talkCooltime = talkCooltimeMax;

            sender.send("getItem",{
                itemName: itemName,
                itemDisplayName: itemDisplayName,
                duration : duration,
                maxDuration : maxDuration,
                motionMultiple : motionMultiple,
                rarity : rarity,
                specialEffect : specialEffect,
                count : count,
                price : price,
                useableAnvil :useableAnvil
            });
        }
    }
}, {item: true, player:true});


$.onUpdate((deltaTime) => {
    if(!$.state.isTalkStart)return;
    
    $.state.talkCooltime-= deltaTime;
    if($.state.talkCooltime<0){
        fukidashiText.unityProp.text = defaultTalkText;
        $.state.isTalkStart = false;
    }
});


const GetTuruhashiRecentoryTime = (player) => {
    const playerDataIndex = $.state.getPlayerList.findIndex(item => item.userId === player.userId);
    const playerList = $.state.getPlayerList;

    if(playerDataIndex != -1){
        const playerData = playerList[playerDataIndex];
        const time = Math.floor((new Date().getTime() - playerData.getTime)/1000);
        if(time<30){
            return time;
        }
    }

    //取得時間をリセット
    if(playerDataIndex == -1){
        playerList.push({userId:player.userId,getTime:new Date().getTime()})
    }else{
        playerList[playerDataIndex].getTime = new Date().getTime();
    }
    $.state.getPlayerList = playerList;
    return null;
};