let grabbedItem = null;
let motionTime = 0;
let isPlayingMotion = false;
let isClashed = false;
let sourceItem = null;
let followItem = null;

const animation1 = _.humanoidAnimation("Animation1");

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

_.onReceive((messageType, arg, sender) => {
    if(messageType === "Initialize"){
        _.log("Initialize");
        _.showButton(2, _.iconAsset("Drop"));
    }

    if (messageType === "RegisterFollowItem") {
        _.log("RegisterFollowItem");
        followItem = arg;
    }
  
    if (messageType === "Grabbed") {
      // ボタンを表示する
      _.showButton(0, _.iconAsset("Pixaxe"));
      grabbedItem = sender;
    }
  
    if (messageType === "Released") {
      // ボタンを非表示にする
      _.hideButton(0);
    }
}, {item: true, player:true});



_.onButton(0, (isDown) => {
    if (isPlayingMotion) return;
    if (isDown) {        
        // メッセージを送ってアイテムから音を鳴らす
        _.sendTo(grabbedItem, "PlaySound", null);
        _.sendTo(grabbedItem, "Attack", null);

        // モーション再生開始
        isPlayingMotion = true;
        isClashed = false;
        motionTime = 0;
    }
});

_.onButton(2, (isDown) => {
    if (isDown) {
        _.log("drop:"+followItem);
        _.sendTo(followItem, "DropItem", null);
    }
});

_.onFrame(deltaTime => {
    // モーション再生
    if (isPlayingMotion) {
        motionTime += deltaTime;
        isPlayingMotion = playMotion(animation1, motionTime);

        if(motionTime>0.4 && !isClashed){
            _.sendTo(grabbedItem, "Clash", null);
            isClashed = true;
        }
        
        if(!isPlayingMotion){          
            _.sendTo(grabbedItem, "EndAttack", null);
        }
        
    }
});