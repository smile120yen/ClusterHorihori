const pickupSound = $.audio("Pickup");

$.onInteract(player => {
    pickupSound.play();
    player.send("RepairItem","all");
});