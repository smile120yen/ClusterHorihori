// アイテム位置の下限
// DespawnHeightより高くしておく
const underLimitHeight = -1.5;

const swingSound = $.audio("Swing");

const registerPlayer = (player) => {
    $.state.followingPlayer = player;
    $.setPlayerScript(player);
};

const playSound = () => {
    swingSound.play();
};

$.onStart(() => {
    $.state.followingPlayer = null;
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
