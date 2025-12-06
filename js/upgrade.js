// Global Upgrade system (per-run upgrades that affect the player tower)
class UpgradeManager {
    constructor(game) {
        this.game = game;
        this.levels = {};
        
        // Initialize upgrade levels
        for (const key of Object.keys(CONFIG.UPGRADES)) {
            this.levels[key] = 0;
        }
    }

    // Get upgrade level
    getLevel(key) {
        return this.levels[key] || 0;
    }

    // Get upgrade cost
    getCost(key) {
        const config = CONFIG.UPGRADES[key];
        return Math.floor(config.baseCost * Math.pow(config.costMultiplier, this.levels[key]));
    }

    // Check if upgrade is maxed
    isMaxed(key) {
        return this.levels[key] >= CONFIG.UPGRADES[key].maxLevel;
    }

    // Purchase upgrade
    purchase(key) {
        const cost = this.getCost(key);
        
        if (this.game.gold >= cost && !this.isMaxed(key)) {
            this.game.spendGold(cost);
            this.levels[key]++;
            this.game.ui.updateUpgrades();
            return true;
        }
        
        return false;
    }

    // Get total bonus from upgrade
    getBonus(key) {
        const config = CONFIG.UPGRADES[key];
        return this.levels[key] * config.effect;
    }

    // Reset upgrades
    reset() {
        for (const key of Object.keys(CONFIG.UPGRADES)) {
            this.levels[key] = 0;
        }
    }

    // Get save data
    getSaveData() {
        return { levels: { ...this.levels } };
    }

    // Load save data
    loadSaveData(data) {
        if (data && data.levels) {
            this.levels = { ...data.levels };
        }
    }
}
