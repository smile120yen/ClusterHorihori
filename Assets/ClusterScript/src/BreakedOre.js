$.onStart(() => {
    $.state.time = 2;
});


$.onUpdate((deltaTime) => {
    $.state.time -= deltaTime;

    if($.state.time<=0){
        $.Destroy();
    }
});