const playerFollowItem = new WorldItemTemplateId("GrabItem");

$.onStart(() => {
    $.state.currentSpawnItem = null;
    createGrabItem();
    $.state.checkCoolTime = 20;
});


$.onReceive((messageType, arg, sender) => {
    if(messageType=="SpawnNewGrabItem"){
        createGrabItem();
    }
});

$.onUpdate((deltaTime) => {
    let cooltime = $.state.checkCoolTime;
    cooltime -= deltaTime;
    if(cooltime<=0){
        if(!$.state.currentSpawnItem){
            createGrabItem();
        }

        if($.state.currentSpawnItem && !$.state.currentSpawnItem.exists()){
            createGrabItem();
        }
        cooltime = 20;
    }
    $.state.checkCoolTime = cooltime;
});

const createGrabItem = () => {
    const grabItem = $.createItem(playerFollowItem, $.getPosition().clone().add(new Vector3(0,1,0)),$.getRotation());
    $.state.currentSpawnItem = grabItem;
    grabItem.send("RegisterGrabItemSpawner",null);
}