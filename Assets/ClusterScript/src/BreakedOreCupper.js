import { initListeners } from "./modules/BreakableOreItemScriptModule.js";

const itemSettings = {
	itemName: "cupperOre",
	itemDisplayName: "銅鉱石",
	consumeDuration: 1,
	price: 10,
	maxHp: 5,
	respawnTime: 120,
	dropChance: 0.2,
	durationPower: 2,
	enchantPower: 1,
	craftDifficulty: 1,
};

initListeners(itemSettings);
