// Prestige system (meta progression)
class PrestigeManager {
    constructor(game) {
        this.game = game;
        this.prestigeLevel = 0;
        this.prestigePoints = 0;
        this.totalPrestiges = 0;
        this.levels = {};
        
        // Initialize prestige upgrade levels
        for (const key of Object.keys(CONFIG.PRESTIGE_UPGRADES)) {
            this.levels[key] = 0;
        }
    }

    // Calculate prestige points gained on reset
    calculatePrestigeGain() {
        const waveManager = this.game.waveManager;
        const currentWave = waveManager.currentWave;
        
        if (currentWave < 10) return 0;
        
        // Base prestige points from waves
        let points = Math.floor((currentWave - 9) * 0.5);
        
        // Bonus for high waves
        if (currentWave >= 25) points += Math.floor((currentWave - 24) * 0.25);
        if (currentWave >= 50) points += Math.floor((currentWave - 49) * 0.1);
        
        return Math.floor(points);
    }

    // Can prestige?
    canPrestige() {
        return this.game.waveManager.currentWave >= 10;
    }

    // Perform prestige
    prestige() {
        if (!this.canPrestige()) return false;
        
        const pointsGained = this.calculatePrestigeGain();
        this.prestigePoints += pointsGained;
        this.prestigeLevel++;
        this.totalPrestiges++;
        
        // Reset game state (but keep research and prestige progress)
        this.game.softReset();
        
        return true;
    }

    // Get prestige upgrade level
    getLevel(key) {
        return this.levels[key] || 0;
    }

    // Get prestige upgrade cost
    getCost(key) {
        const config = CONFIG.PRESTIGE_UPGRADES[key];
        if (config.costMultiplier) {
            return Math.floor(config.cost * Math.pow(config.costMultiplier, this.levels[key]));
        }
        return config.cost;
    }

    // Check if prestige upgrade is maxed
    isMaxed(key) {
        return this.levels[key] >= CONFIG.PRESTIGE_UPGRADES[key].maxLevel;
    }

    // Can afford prestige upgrade?
    canAfford(key) {
        return this.prestigePoints >= this.getCost(key);
    }

    // Purchase prestige upgrade
    purchase(key) {
        const cost = this.getCost(key);
        
        if (this.canAfford(key) && !this.isMaxed(key)) {
            this.prestigePoints -= cost;
            this.levels[key]++;
            this.game.ui.updatePrestigePoints();
            this.game.ui.updatePrestigeUpgrades();
            return true;
        }
        
        return false;
    }

    // Get bonus from prestige upgrade
    getBonus(key) {
        const config = CONFIG.PRESTIGE_UPGRADES[key];
        if (config.effect) {
            return this.levels[key] * config.effect;
        }
        return 0;
    }

    // Check if unlock is acquired
    hasUnlock(unlockKey) {
        for (const [key, config] of Object.entries(CONFIG.PRESTIGE_UPGRADES)) {
            if (config.unlock === unlockKey && this.levels[key] > 0) {
                return true;
            }
        }
        return false;
    }

    // Get save data
    getSaveData() {
        return {
            prestigeLevel: this.prestigeLevel,
            prestigePoints: this.prestigePoints,
            totalPrestiges: this.totalPrestiges,
            levels: { ...this.levels }
        };
    }

    // Load save data
    loadSaveData(data) {
        if (data) {
            this.prestigeLevel = data.prestigeLevel || 0;
            this.prestigePoints = data.prestigePoints || 0;
            this.totalPrestiges = data.totalPrestiges || 0;
            if (data.levels) {
                this.levels = { ...data.levels };
            }
        }
    }
}
