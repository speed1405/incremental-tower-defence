// Research system (permanent upgrades using research points)
class ResearchManager {
    constructor(game) {
        this.game = game;
        this.points = 0;
        this.levels = {};
        
        // Initialize research levels
        for (const key of Object.keys(CONFIG.RESEARCH)) {
            this.levels[key] = 0;
        }
    }

    // Add research points
    addPoints(amount) {
        this.points += amount;
        this.game.ui.updateResearchPoints();
    }

    // Get research level
    getLevel(key) {
        return this.levels[key] || 0;
    }

    // Get research cost
    getCost(key) {
        const config = CONFIG.RESEARCH[key];
        if (config.costMultiplier) {
            return Math.floor(config.cost * Math.pow(config.costMultiplier, this.levels[key]));
        }
        return config.cost;
    }

    // Check if research is maxed
    isMaxed(key) {
        return this.levels[key] >= CONFIG.RESEARCH[key].maxLevel;
    }

    // Check if can afford
    canAfford(key) {
        return this.points >= this.getCost(key);
    }

    // Purchase research
    purchase(key) {
        const cost = this.getCost(key);
        
        if (this.canAfford(key) && !this.isMaxed(key)) {
            this.points -= cost;
            this.levels[key]++;
            this.game.ui.updateResearchPoints();
            this.game.ui.updateResearch();
            return true;
        }
        
        return false;
    }

    // Get total bonus from research
    getBonus(key) {
        const config = CONFIG.RESEARCH[key];
        if (config.effect) {
            return this.levels[key] * config.effect;
        }
        return 0;
    }

    // Check if unlock is acquired
    hasUnlock(unlockKey) {
        for (const [key, config] of Object.entries(CONFIG.RESEARCH)) {
            if (config.unlock === unlockKey && this.levels[key] > 0) {
                return true;
            }
        }
        return false;
    }

    // Get save data
    getSaveData() {
        return {
            points: this.points,
            levels: { ...this.levels }
        };
    }

    // Load save data
    loadSaveData(data) {
        if (data) {
            this.points = data.points || 0;
            if (data.levels) {
                this.levels = { ...data.levels };
            }
        }
    }
}
