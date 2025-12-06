// Biome management system
const STARTING_WAVE_DISPLAY = 1; // Display wave 1 instead of 0 for first biome

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

    // Get the biome for a specific wave (automatic progression)
    getBiomeForWave(wave) {
        // Get all biomes sorted by unlock wave in descending order
        const biomes = Object.entries(CONFIG.BIOMES)
            .sort((a, b) => b[1].unlockWave - a[1].unlockWave);
        
        // Find the highest biome that the wave qualifies for
        for (const [key, config] of biomes) {
            if (wave >= config.unlockWave) {
                return key;
            }
        }
        return 'forest'; // Default fallback
    }

    // Check and update biome based on current wave (automatic progression)
    checkBiomeProgression(currentWave) {
        const appropriateBiome = this.getBiomeForWave(currentWave);
        
        if (appropriateBiome !== this.currentBiome) {
            const oldBiome = this.currentBiome;
            this.currentBiome = appropriateBiome;
            
            // Add to unlocked biomes if not already there
            if (!this.unlockedBiomes.includes(appropriateBiome)) {
                this.unlockedBiomes.push(appropriateBiome);
            }
            
            // Move player to center of new biome
            this.game.player.x = CONFIG.CANVAS_WIDTH / 2;
            this.game.player.y = CONFIG.CANVAS_HEIGHT / 2;
            this.game.player.targetX = this.game.player.x;
            this.game.player.targetY = this.game.player.y;
            
            // Update UI
            if (this.game.ui) {
                this.game.ui.updateBiomeDisplay();
                this.game.ui.showBiomeTransition(oldBiome, appropriateBiome);
            }
            
            return true; // Biome changed
        }
        return false; // No change
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

    // Get all biomes with their unlock status and wave ranges
    getAllBiomes() {
        const biomeEntries = Object.entries(CONFIG.BIOMES);
        const biomes = [];
        
        // Sort by unlock wave to determine wave ranges
        const sortedBiomes = [...biomeEntries].sort((a, b) => a[1].unlockWave - b[1].unlockWave);
        
        for (let i = 0; i < sortedBiomes.length; i++) {
            const [key, config] = sortedBiomes[i];
            const nextBiome = sortedBiomes[i + 1];
            const waveEnd = nextBiome ? nextBiome[1].unlockWave - 1 : '∞';
            
            biomes.push({
                key,
                ...config,
                unlocked: this.isBiomeUnlocked(key),
                current: key === this.currentBiome,
                waveRange: `${config.unlockWave === 0 ? STARTING_WAVE_DISPLAY : config.unlockWave}-${waveEnd}`
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

    // Reset biome to forest (for prestige)
    reset() {
        this.currentBiome = 'forest';
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
