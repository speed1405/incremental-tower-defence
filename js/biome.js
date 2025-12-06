// Biome management system
class BiomeManager {
    constructor(game) {
        this.game = game;
        this.currentBiome = 'forest';
        this.unlockedBiomes = ['forest'];
    }

    // Get current biome configuration
    getCurrentBiome() {
        return CONFIG.BIOMES[this.currentBiome];
    }

    // Get the current path for the biome
    getCurrentPath() {
        return this.getCurrentBiome().path;
    }

    // Check if a biome is unlocked based on highest wave reached
    isBiomeUnlocked(biomeKey) {
        const biome = CONFIG.BIOMES[biomeKey];
        return this.game.stats.highestWave >= biome.unlockWave;
    }

    // Update unlocked biomes based on progress
    updateUnlockedBiomes() {
        for (const biomeKey of Object.keys(CONFIG.BIOMES)) {
            if (this.isBiomeUnlocked(biomeKey) && !this.unlockedBiomes.includes(biomeKey)) {
                this.unlockedBiomes.push(biomeKey);
            }
        }
    }

    // Switch to a different biome
    switchBiome(biomeKey) {
        if (!this.isBiomeUnlocked(biomeKey)) {
            return false;
        }
        
        this.currentBiome = biomeKey;
        
        // Reset enemies when switching biomes
        this.game.enemies = [];
        
        // Reset wave if switching during a wave
        if (this.game.waveManager.waveActive) {
            this.game.waveManager.waveActive = false;
            this.game.waveManager.enemiesRemaining = 0;
        }
        
        // Move player to center of new biome
        this.game.player.x = CONFIG.CANVAS_WIDTH / 2;
        this.game.player.y = CONFIG.CANVAS_HEIGHT / 2;
        this.game.player.targetX = this.game.player.x;
        this.game.player.targetY = this.game.player.y;
        
        // Update UI
        if (this.game.ui) {
            this.game.ui.updateBiomeSelector();
            this.game.ui.updateWaveInfo();
        }
        
        return true;
    }

    // Get all biomes with their unlock status
    getAllBiomes() {
        const biomes = [];
        for (const [key, config] of Object.entries(CONFIG.BIOMES)) {
            biomes.push({
                key,
                ...config,
                unlocked: this.isBiomeUnlocked(key),
                current: key === this.currentBiome
            });
        }
        return biomes;
    }

    // Get enemy modifiers for current biome
    getEnemyHealthMod() {
        return this.getCurrentBiome().enemyHealthMod;
    }

    getEnemySpeedMod() {
        return this.getCurrentBiome().enemySpeedMod;
    }

    getGoldMod() {
        return this.getCurrentBiome().goldMod;
    }

    // Get save data
    getSaveData() {
        return {
            currentBiome: this.currentBiome,
            unlockedBiomes: [...this.unlockedBiomes]
        };
    }

    // Load save data
    loadSaveData(data) {
        if (data) {
            this.currentBiome = data.currentBiome || 'forest';
            this.unlockedBiomes = data.unlockedBiomes || ['forest'];
        }
    }
}
