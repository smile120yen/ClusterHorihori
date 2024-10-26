import { initListeners } from "./modules/BreakableOreItemScriptModule.js";

const itemSettings = {
	itemName: "ironOre",
	itemDisplayName: "鉄鉱石",
	consumeDuration: 3,
	price: 20,
	maxHp: 10,
	respawnTime: 120,
	dropChance: 0.1,
	durationPower: 4,
	enchantPower: 5,
	craftDifficulty: 2,
};

initListeners(itemSettings);
