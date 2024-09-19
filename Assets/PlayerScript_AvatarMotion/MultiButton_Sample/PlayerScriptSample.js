let targetItem = null;
let motionTime = 0;
let isPlayingMotion = false;
let cameraMode = 0;

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

_.onStart(() => {
    _.showButton(2, _.iconAsset(""));
    _.showButton(3, _.iconAsset(""));
    targetItem = _.sourceItemId;
});

_.onButton(2, (isDown) => {
    if (isDown) {
        cameraMode++;

        switch(cameraMode) {
            case 1:
                _.cameraHandle.setThirdPersonDistance(0.5);
                break;
            case 2:
                _.cameraHandle.setThirdPersonAvatarScreenPosition(new Vector2(0.3, 0.3));
                break;
            default:
                cameraMode = 0;
                _.cameraHandle.setThirdPersonDistance(null);
                _.cameraHandle.setThirdPersonAvatarScreenPosition(null);
                break;
        }
    }
});

_.onButton(3, (isDown) => {
    if (isPlayingMotion) return;
    if (isDown) {
        // メッセージを送ってアイテムから音を鳴らす
        _.sendTo(targetItem, "PlaySound", null);

        // モーション再生開始
        isPlayingMotion = true;
        motionTime = 0;
    }
});

_.onFrame(deltaTime => {
    // モーション再生
    if (isPlayingMotion) {
        motionTime += deltaTime;
        isPlayingMotion = playMotion(animation1, motionTime);
    }
});
