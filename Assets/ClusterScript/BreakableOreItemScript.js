const dropKousekiItem = new WorldItemTemplateId("DropKouseki");
const oreBreakedItem = new WorldItemTemplateId("OreBreaked");
const damagedSound = $.audio("Clash");
const breakedSound = $.audio("Break");
const subNodeVisual = $.subNode("Visual");
const oreObject = $.subNode("Ore");

//@field(string)
const itemName = "cupperOre";
//@field(string)
const itemDisplayName = "銅鉱石";
//@field(int)
const comsumeDuration = 1;
//@field(int)
const price = 10;
//@field(int)
const maxHp = 5;
//@field(int)
const respawnTime = 120;
//@field(float)
const dropChance = 0.2;
//@field(int)
const durationPower = 1;
//@field(int)
const enchantPower = 1;

$.onStart(() => {
    RespawnItem();
    $.state.itemUsePlayers = [];
});


$.onInteract(player => {
    player.send("AttackCurrentItem",null);
});


$.onReceive((requestName, arg, sender) => {
    if (requestName == "damage") {
        $.log("ダメージ受信");
        $.sendSignalCompat("this", "damage");

        let hp = $.state.hp;
        hp -= 1;

        let isDroped = false;
        const rand = Math.random();
        if( rand < dropChance+arg.bonusDropChance || hp <= 0){
            isDroped= true;
        }

        let luck = 1;
        if(arg.luck)luck = arg.luck;

        const rarityRand = Math.floor(Math.random()*100);

        let newRarity = 1;
        if(rarityRand<55){
            newRarity = 1;
        }
        else if(rarityRand<75){
            newRarity = 2;
        }
        else if(rarityRand<85){
            newRarity = 3;
        }
        else if(rarityRand<95){
            newRarity = 4;
        }else{
            newRarity = 5;
        }

        if(luck<newRarity)newRarity = luck;


        if(isDroped){
            let spawnPosition = $.getPosition().clone().add(new Vector3(0,0.7,0));
            let followingItem = $.createItem(dropKousekiItem, spawnPosition, $.getRotation());
            followingItem.send("setStatus",{
                itemName: itemName,
                itemDisplayName: itemDisplayName,
                price : price,
                count : 1,
                useableAnvil : true,
                rarity: newRarity,
                durationPower : durationPower,
                enchantPower : enchantPower
            });
            
            let random_x = Math.random()*2-1;
            let random_z = Math.random()*2-1;
            followingItem.addImpulsiveForce(new Vector3(random_x,4,random_z));
        }
        

        if(hp>0){
            damagedSound.play();
        }else{
            breakedSound.play();
            subNodeVisual.setEnabled(false);
            $.createItem(oreBreakedItem, $.getPosition(), $.getRotation());
            $.state.enable = false;
            $.state.respawnTime = respawnTime;
        }

        $.state.hp = hp;

        const newComsumeDuration = comsumeDuration-arg.durationReduce;
        if(newComsumeDuration<1)newComsumeDuration=1;

        sender.send("ReceiveDamage",newComsumeDuration);
    }
});

$.onUpdate((deltaTime) => {
    if(!$.state.enable){
        $.state.respawnTime-=deltaTime;
        if($.state.respawnTime<=0){
            RespawnItem();
        }
    }
});

const RespawnItem = () => {
    subNodeVisual.setEnabled(true);
    $.state.maxHp = maxHp;
    $.state.hp = maxHp;
    $.state.enable = true;
};