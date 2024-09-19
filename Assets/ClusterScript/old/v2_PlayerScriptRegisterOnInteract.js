const playerFollowItem = new WorldItemTemplateId("PlayerFollow");

$.onStart(() => {
    $.state.attachedPlayers = [];
});


$.onInteract(() => {
    let attachedPlayers = $.state.attachedPlayers.filter(player => player.exists());

    // ワールド内の全プレイヤーのうち、適用済み一覧に入っていないプレイヤーを取得
    let players = $.getPlayersNear($.getPosition(), Infinity);
    let playersToAttach = players.filter(player => !attachedPlayers.some(attachedPlayer => attachedPlayer.id === player.id));

    playersToAttach.forEach(player => {
        //プレイヤースクリプト適用
        $.setPlayerScript(player);
        player.send("Initialize",null);
        
        /*
        let followingItem = $.createItem(playerFollowItem, player.getPosition(),player.getRotation());
        followingItem.send("RegisterPlayer", player);
        player.send("RegisterFollowItem",followingItem);
        */

        // 適用済みプレイヤーに追加
        attachedPlayers.push(player);
    });

    $.state.attachedPlayers = attachedPlayers;
});