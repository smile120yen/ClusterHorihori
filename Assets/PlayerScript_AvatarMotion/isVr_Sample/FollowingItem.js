// アイテム位置の下限
// DespawnHeightより高くしておく
const underLimitHeight = -1.5;

const sound = $.audio("Sound");

const vrButton = $.subNode("VRButton");

const registerPlayer = (player) => {
    $.state.followingPlayer = player;
    $.setPlayerScript(player);
};

const playSound = () => {
    sound.play();
};

const setVrMode = (isVr) => {
    // VR用ボタンを有効化
    vrButton.setEnabled(isVr);
}

$.onStart(() => {
    $.state.followingPlayer = null;
});

$.onInteract(player => {
    playSound();
});

$.onReceive((messageType, arg, sender) => {
    // 追従対象プレイヤーを登録
    if (messageType === "RegisterPlayer") {
        registerPlayer(arg);
    }

    // 効果音を鳴らす
    if (messageType === "PlaySound") {
        playSound();
    }

    // VR用機能の切り替え
    if (messageType === "SetIsVr") {
        setVrMode(arg);
    }
}, {item: true, player:true});

$.onUpdate((deltaTime) => {
    let followingPlayer = $.state.followingPlayer;
    if (!followingPlayer) return;

    // プレイヤーが居なくなるとアイテムも消える
    if (followingPlayer.exists() === false)
    {
        $.destroy();
        return;
    };

    // プレイヤー位置・回転に追従
    let position = followingPlayer.getPosition();
    // 位置の下限を適用
    position.y = Math.max(position.y, underLimitHeight);
    let rotation = followingPlayer.getRotation();
    $.setPosition(position);
    $.setRotation(rotation);
});