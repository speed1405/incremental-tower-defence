// Wave management
class WaveManager {
    constructor(game) {
        this.game = game;
        this.currentWave = 1;
        this.enemiesSpawned = 0;
        this.enemiesRemaining = 0;
        this.waveActive = false;
        this.spawnTimer = 0;
        this.spawnInterval = 1; // seconds between spawns
        
        // Wave composition
        this.waveEnemies = [];
    }

    // Generate enemies for a wave
    generateWave(waveNumber) {
        const enemies = [];
        
        // Base enemy count increases with wave
        const baseCount = 5 + Math.floor(waveNumber * 1.5);
        
        // Add basic enemies
        for (let i = 0; i < baseCount; i++) {
            enemies.push('basic');
        }
        
        // Add fast enemies starting wave 2
        if (waveNumber >= 2) {
            const fastCount = Math.floor(waveNumber * 0.5);
            for (let i = 0; i < fastCount; i++) {
                enemies.push('fast');
            }
        }
        
        // Add tank enemies starting wave 3
        if (waveNumber >= 3) {
            const tankCount = Math.floor((waveNumber - 2) * 0.3);
            for (let i = 0; i < tankCount; i++) {
                enemies.push('tank');
            }
        }
        
        // Add healer enemies starting wave 5
        if (waveNumber >= 5) {
            const healerCount = Math.floor((waveNumber - 4) * 0.2);
            for (let i = 0; i < healerCount; i++) {
                enemies.push('healer');
            }
        }
        
        // Add swarm enemies starting wave 7
        if (waveNumber >= 7) {
            const swarmCount = Math.floor((waveNumber - 6) * 2);
            for (let i = 0; i < swarmCount; i++) {
                enemies.push('swarm');
            }
        }
        
        // Add boss every 10 waves
        if (waveNumber % 10 === 0) {
            enemies.push('boss');
        }
        
        // Shuffle enemies
        for (let i = enemies.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [enemies[i], enemies[j]] = [enemies[j], enemies[i]];
        }
        
        return enemies;
    }

    // Start a wave
    startWave() {
        if (this.waveActive) return;
        
        this.waveActive = true;
        this.waveEnemies = this.generateWave(this.currentWave);
        this.enemiesSpawned = 0;
        this.enemiesRemaining = this.waveEnemies.length;
        this.spawnTimer = 0;
        
        // Faster spawns for higher waves
        this.spawnInterval = Math.max(0.3, 1 - this.currentWave * 0.02);
        
        // Update UI
        this.game.ui.updateWaveInfo();
    }

    // Update wave
    update(deltaTime, enemies) {
        if (!this.waveActive) return;
        
        // Spawn enemies
        this.spawnTimer += deltaTime;
        
        if (this.enemiesSpawned < this.waveEnemies.length && this.spawnTimer >= this.spawnInterval) {
            const enemyType = this.waveEnemies[this.enemiesSpawned];
            const enemy = new Enemy(enemyType, this.currentWave, this.game);
            enemies.push(enemy);
            this.enemiesSpawned++;
            this.spawnTimer = 0;
        }
        
        // Count remaining enemies
        this.enemiesRemaining = this.waveEnemies.length - this.enemiesSpawned + 
            enemies.filter(e => e.health > 0).length;
        
        // Check wave completion
        if (this.enemiesSpawned >= this.waveEnemies.length && 
            enemies.filter(e => e.health > 0).length === 0) {
            this.waveComplete();
        }
    }

    // Wave completed
    waveComplete() {
        this.waveActive = false;
        
        // Update highest wave
        if (this.currentWave > this.game.stats.highestWave) {
            this.game.stats.highestWave = this.currentWave;
        }
        
        // Wave completion bonus
        const waveBonus = 50 * this.currentWave;
        this.game.addGold(waveBonus);
        
        // Advance wave
        this.currentWave++;
        
        // Update UI
        this.game.ui.updateWaveInfo();
        
        // Auto start next wave if unlocked
        if (this.game.hasPrestigeUnlock('autoStart')) {
            setTimeout(() => this.startWave(), 2000);
        }
        
        // Update prestige button
        this.game.ui.updatePrestigeButton();
    }

    // Reset for new game
    reset() {
        // Account for prestige starting wave bonus
        const startingWaveBonus = this.game.getPrestigeBonus('startingWave');
        this.currentWave = 1 + Math.floor(startingWaveBonus);
        this.enemiesSpawned = 0;
        this.enemiesRemaining = 0;
        this.waveActive = false;
        this.spawnTimer = 0;
        this.waveEnemies = [];
    }
}
