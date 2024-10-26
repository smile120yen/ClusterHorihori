import { initListeners } from "./modules/BreakableOreItemScriptModule.js";

const itemSettings = {
	itemName: "clystal",
	itemDisplayName: "クリスタル",
	consumeDuration: 5,
	price: 30,
	maxHp: 5,
	respawnTime: 120,
	dropChance: 0.05,
	durationPower: 2,
	enchantPower: 25,
	craftDifficulty: 5,
};

initListeners(itemSettings);
