const bgmDefault = $.subNode("BGMDefault");
const bgmWarning = $.subNode("BGMWarning");

$.onStart(()=>{
    bgmDefault.setEnabled(true);
});

$.onReceive((messageType, arg, sender) => {
    if(messageType == "PlayBGM"){
        $.log("PlayBGM:"+arg);
        switch(arg){
            case "BGMDefault":
                bgmDefault.setEnabled(true);
                break;
            case "BGMWarning":
                bgmWarning.setEnabled(true);
                break;
        }
    }    
    if(messageType == "StopBGM"){
        $.log("StopBGM:"+arg);
        switch(arg){
            case "BGMDefault":
                bgmDefault.setEnabled(false);
                break;
            case "BGMWarning":
                bgmWarning.setEnabled(false);
                break;
        }
    }    
}, {item: true, player:true});