import { initListeners } from "./modules/BreakableOreItemScriptModule.js";

const itemSettings = {
	itemName: "goldOre",
	itemDisplayName: "金鉱石",
	consumeDuration: 4,
	price: 40,
	maxHp: 10,
	respawnTime: 120,
	dropChance: 0.1,
	durationPower: 2,
	enchantPower: 15,
	craftDifficulty: 4,
};

initListeners(itemSettings);
