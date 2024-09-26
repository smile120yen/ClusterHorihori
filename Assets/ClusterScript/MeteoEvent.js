const visual = $.subNode("Visual");
const lockonMarkerVisibleChecker = $.subNode("LockOnMarkerVisibleChecker");
const crashStartChecker = $.subNode("CrashStartChecker");
const crashTimeLineEndChecker = $.subNode("CrashTimeLineEndChecker");
let lockonMarker = $.worldItemReference("LockonMarker");
const MeteoHP = $.subNode("MeteoHP");
const bgmPlayer = $.worldItemReference("BGMPlayer");
const meteoRespawnWaitTimeMax = 300;
const damagedSound = $.audio("Clash");
const meteoHPMaterial = $.material("MeteoHpMaterial");

//バトル用
const consumeDuration = 1;
const maxHp = 100;

$.onStart(()=>{
    $.state.breakedMeteo = true;
    $.state.meteoRespawnWaitTime = 30;
    $.state.markerVisiblePlayerList = [];
    $.state.visibleMarker = false;
    $.state.isEndMeteoEvent = false;
    $.state.isStartMeteoClashEvent = false;
    $.state.sendMessageCache = [];
    $.state.tryLockOff = false;
    $.state.sendCoolTime = 0.1;
    MeteoHP.setEnabled(false);
});

$.onInteract(player => {
    player.send("AttackCurrentItemWithEffect",null);
    $.state.ownerPlayer = player;
});

$.onReceive((requestName, arg, sender) => {
    
    if (requestName == "damage") {
        if($.state.breakedMeteo) return;
        $.log("ダメージ受信");
        $.sendSignalCompat("this", "damage");
        let hp = $.state.hp;
        hp -= 1;

        meteoHPMaterial.setFloat("_FillAmount",hp/maxHp);

        if(hp>0){
            //ダメージ
            damagedSound.play();
        }else{
            BreakMeteoAnim();
        }
        
        $.state.hp = hp;
        
        let newConsumeDuration = consumeDuration;
        if(arg.durationReduce) {
            newConsumeDuration -= arg.durationReduce;
        }
        if(newConsumeDuration<1)newConsumeDuration=1;
        
        sender.send("ReceiveDamage",newConsumeDuration);
    }
});


$.onUpdate((deltaTime) => {

    if($.state.tryLockOff){
        try{
            lockonMarker.send("LockoffAll",null);
            $.state.tryLockOff = false;
        }catch{

        }
    }
    if($.state.sendCoolTime>0)$.state.sendCoolTime-=deltaTime;
    if($.state.sendMessageCache.length>0&&$.state.sendCoolTime<=0){
        $.state.sendCoolTime = 0.3;
        const cache = $.state.sendMessageCache;
        const messageCache = cache.pop();
        try{
            $.log("tryMessage:"+messageCache.messageType);
            const arg = messageCache.arg;
            const messageType = messageCache.messageType;
            const handle = messageCache.handle;
            handle.send(messageType,arg);
        }catch{
            $.log("miss:"+messageCache.messageType);
            cache.push(messageCache);
        }
        $.state.sendMessageCache = cache;
        $.log("cache:"+JSON.stringify(cache));
    }
    
    if(lockonMarkerVisibleChecker.getEnabled() && !$.state.visibleMarker){
        EnableMaker();
    }else if(!lockonMarkerVisibleChecker.getEnabled() && $.state.visibleMarker){
        DisableMarker();
    }

    if(crashStartChecker.getEnabled() && !$.state.isStartMeteoClashEvent){
        //bgmPlayer.send("StopBGM","BGMWarning");
        $.state.isStartMeteoClashEvent = true;
    }else if(!crashStartChecker.getEnabled() && $.state.isStartMeteoClashEvent){
        $.state.isStartMeteoClashEvent = false;
    }

    if(crashTimeLineEndChecker.getEnabled() && !$.state.isEndMeteoEvent){
        //bgmPlayer.send("PlayBGM","BGMDefault");
        $.state.isEndMeteoEvent = true;
    }else if(!crashTimeLineEndChecker.getEnabled() && $.state.isEndMeteoEvent){
        $.state.isEndMeteoEvent = false;
    }

    if($.state.visibleMarker){
        AddMarkerVisiblePlayer();
    }

    if($.state.breakedMeteo){
        $.state.meteoRespawnWaitTime -= deltaTime;
        if($.state.meteoRespawnWaitTime<=0){
            $.state.breakedMeteo = false; 
            StartMeteoAnim();
        }
    }
});

const AddMarkerVisiblePlayer = () =>{
    let markerVisiblePlayerList = $.state.markerVisiblePlayerList.filter(player => player.exists());

    // ワールド内の全プレイヤーのうち、適用済み一覧に入っていないプレイヤーを取得
    let players = $.getPlayersNear($.getPosition(), Infinity);
    let newVisiblePlayers = players.filter(player => !markerVisiblePlayerList.some(visiblePlayer => visiblePlayer.id === player.id));

    newVisiblePlayers.forEach(player => {
        // 適用済みプレイヤーに追加
        markerVisiblePlayerList.push(player);
        player.send("MeteoUIStart",null);
    });

    if(newVisiblePlayers.length>0){
        const idList = [];
        for(playerHandle of markerVisiblePlayerList){
            idList.push(playerHandle.id);
        }
        lockonMarker.send("SetLockonPlayerByID",idList);
    }

    $.state.markerVisiblePlayerList = markerVisiblePlayerList;
}

const EnableMaker = () => {
    $.log("Meteo:EnableMarker");
    $.state.visibleMarker = true;
    $.state.markerVisiblePlayerList = [];
    MeteoHP.setEnabled(true);
}

const DisableMarker = () =>{
    $.log("Meteo:DisableMarker");
    $.state.visibleMarker = false;
    $.state.markerVisiblePlayerList = [];
    $.state.tryLockOff = true;
    //try{
    //    lockonMarker.send("LockoffAll",null);
    //}catch{   
    //const cache = $.state.sendMessageCache;
    //cache.push({handle:lockonMarker,messageType:"LockoffAll",arg:null});
    //$.state.sendMessageCache = cache; 
    //}
    MeteoHP.setEnabled(false);
}


const StartMeteoAnim = () => {
    $.log("Meteo:sendSignal");
    $.sendSignalCompat("this","Start");
    //bgmPlayer.send("StopBGM","BGMDefault");
    //bgmPlayer.send("PlayBGM","BGMWarning");
    $.state.hp = maxHp;
    meteoHPMaterial.setFloat("_FillAmount",1);
}

const BreakMeteoAnim = () => {
    $.log("Meteo:sendSignal");
    $.sendSignalCompat("this","Break");    
    $.state.breakedMeteo = true;
    $.state.meteoRespawnWaitTime = meteoRespawnWaitTimeMax;
    
    let players = $.getPlayersNear($.getPosition(), Infinity);
    
    const cache = $.state.sendMessageCache;
    players.forEach(player => {
        cache.push({handle:player,messageType:"MeteoUIEnd",arg:"dummy"});
        cache.push({handle:player,messageType:"AddMoney",arg:{count:2000}});
        //player.send("MeteoUIEnd",null);
        //player.send("AddMoney",{count:2000});
    });
    $.state.sendMessageCache = cache; 
}