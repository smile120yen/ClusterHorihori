const underLimitHeight = -1.5;
const dropKousekiItem = new WorldItemTemplateId("DropKouseki");

const registerPlayer = (player) => {
    $.state.followingPlayer = player;
};

$.onStart(() => {
    $.log("created");
    $.state.followingPlayer = null;
});

$.onReceive((messageType, arg, sender) => {
    // 追従対象プレイヤーを登録
    if (messageType === "RegisterPlayer") {
        $.log("RegisterPlayer");
        registerPlayer(arg);
    }

    if (messageType === "DropItem") {
        $.log("drop");
        let spawnPosition = $.getPosition().clone().Add(new Vector3(0,2,0));
        let dropItem = $.createItem(dropKousekiItem, spawnPosition, $.getRotation());
        dropItem.addImpulsiveForce(new Vector3(0,0,3));
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