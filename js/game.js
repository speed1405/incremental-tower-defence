// Main game class
class Game {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gold = CONFIG.STARTING_GOLD;
        this.lives = CONFIG.STARTING_LIVES;
        this.enemies = [];
        
        // The player IS the tower
        this.player = new Player(this);
        
        // Stats
        this.stats = {
            totalGoldEarned: 0,
            enemiesKilled: 0,
            highestWave: 1
        };
        
        // Managers
        this.biomeManager = new BiomeManager(this);
        this.waveManager = new WaveManager(this);
        this.upgradeManager = new UpgradeManager(this);
        this.researchManager = new ResearchManager(this);
        this.prestigeManager = new PrestigeManager(this);
        
        // UI reference (set after UI is created)
        this.ui = null;
        
        // Timing
        this.lastTime = 0;
        this.running = false;
        
        // Gold per second (incremental)
        this.goldAccumulator = 0;
    }

    // Initialize the game
    init() {
        // Apply starting bonuses from research
        this.gold = CONFIG.STARTING_GOLD + this.researchManager.getBonus('startingGold');
        
        // Load saved game if exists
        this.load();
        
        // Start game loop
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Main game loop
    gameLoop(currentTime) {
        if (!this.running) return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Update game state
    update(deltaTime) {
        // Passive gold generation (incremental mechanic)
        const goldPerSecond = CONFIG.BASE_GOLD_PER_SECOND + 
                             this.upgradeManager.getBonus('goldPerSecond');
        this.goldAccumulator += goldPerSecond * deltaTime;
        
        if (this.goldAccumulator >= 1) {
            const goldToAdd = Math.floor(this.goldAccumulator);
            this.addGold(goldToAdd);
            this.goldAccumulator -= goldToAdd;
        }
        
        // Update wave manager
        this.waveManager.update(deltaTime, this.enemies);
        
        // Update player (the tower)
        this.player.update(deltaTime, this.enemies);
        
        // Update enemies
        for (const enemy of this.enemies) {
            if (enemy.health > 0) {
                enemy.update(deltaTime, this.enemies);
            }
        }
        
        // Remove dead enemies
        this.enemies = this.enemies.filter(e => e.health > 0);
        
        // Update UI
        if (this.ui) {
            this.ui.updateGold();
            this.ui.updateWaveInfo();
            this.ui.updateStats();
            this.ui.updateLives();
            this.ui.updatePlayerStats();
        }
    }

    // Draw game
    draw() {
        // Get current biome settings
        const biome = this.biomeManager.getCurrentBiome();
        
        // Clear canvas with biome background color
        this.ctx.fillStyle = biome.background;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // Draw path
        this.drawPath();
        
        // Draw grid (faintly)
        this.drawGrid();
        
        // Draw player (the tower)
        this.player.draw(this.ctx);
        
        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.draw(this.ctx);
        }
    }

    // Draw the enemy path
    drawPath() {
        const biome = this.biomeManager.getCurrentBiome();
        const path = biome.path;
        
        // Draw path background
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }
        this.ctx.strokeStyle = biome.pathColor;
        this.ctx.lineWidth = 40;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
        
        // Draw path detail
        this.ctx.strokeStyle = biome.pathDetail;
        this.ctx.lineWidth = 35;
        this.ctx.stroke();
        
        // Draw path edges
        this.ctx.strokeStyle = biome.pathEdge;
        this.ctx.lineWidth = 40;
        this.ctx.setLineDash([5, 15]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw start and end markers
        this.ctx.beginPath();
        this.ctx.arc(path[0].x, path[0].y, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#4caf50';
        this.ctx.fill();
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('▶', path[0].x, path[0].y);
        
        const endPoint = path[path.length - 1];
        this.ctx.beginPath();
        this.ctx.arc(endPoint.x, endPoint.y, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#f44336';
        this.ctx.fill();
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText('⬛', endPoint.x, endPoint.y);
    }

    // Draw grid
    drawGrid() {
        const biome = this.biomeManager.getCurrentBiome();
        this.ctx.strokeStyle = biome.gridColor;
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= CONFIG.CANVAS_WIDTH; x += CONFIG.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, CONFIG.CANVAS_HEIGHT);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= CONFIG.CANVAS_HEIGHT; y += CONFIG.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(CONFIG.CANVAS_WIDTH, y);
            this.ctx.stroke();
        }
    }

    // Handle canvas click - move player
    handleCanvasClick(x, y) {
        this.player.moveTo(x, y);
    }

    // Add gold
    addGold(amount) {
        this.gold += amount;
        this.stats.totalGoldEarned += amount;
    }

    // Spend gold
    spendGold(amount) {
        this.gold -= amount;
    }

    // Add research points
    addResearchPoints(amount) {
        this.researchManager.addPoints(amount);
    }

    // Lose a life (with armor reduction)
    loseLife() {
        const armor = this.player.armor;
        const damage = Math.max(1, 1 - armor); // Minimum 1 damage
        this.lives -= damage;
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    // Game over
    gameOver() {
        this.running = false;
        alert(`Game Over! You reached wave ${this.waveManager.currentWave}`);
        
        // Offer to prestige if possible
        if (this.prestigeManager.canPrestige()) {
            if (confirm('Would you like to prestige and gain permanent bonuses?')) {
                this.prestige();
            }
        }
    }

    // Get upgrade bonus
    getUpgradeBonus(key) {
        return this.upgradeManager.getBonus(key);
    }

    // Get research bonus
    getResearchBonus(key) {
        return this.researchManager.getBonus(key);
    }

    // Get prestige bonus
    getPrestigeBonus(key) {
        return this.prestigeManager.getBonus(key);
    }

    // Check if prestige unlock is acquired
    hasPrestigeUnlock(key) {
        return this.prestigeManager.hasUnlock(key);
    }

    // Check if research unlock is acquired
    hasResearchUnlock(key) {
        return this.researchManager.hasUnlock(key);
    }

    // Soft reset (for prestige)
    softReset() {
        this.gold = CONFIG.STARTING_GOLD + this.researchManager.getBonus('startingGold');
        this.lives = CONFIG.STARTING_LIVES;
        this.enemies = [];
        
        // Reset player
        this.player.softReset();
        
        // Reset wave manager
        this.waveManager.reset();
        
        // Reset biome to starting biome based on new wave
        this.biomeManager.reset();
        this.biomeManager.checkBiomeProgression(this.waveManager.currentWave);
        
        // Reset upgrades (but not research or prestige)
        this.upgradeManager.reset();
        
        // Restart game loop if stopped
        if (!this.running) {
            this.running = true;
            this.lastTime = performance.now();
            requestAnimationFrame((time) => this.gameLoop(time));
        }
        
        // Update UI
        if (this.ui) {
            this.ui.updateAll();
        }
    }

    // Prestige
    prestige() {
        if (this.prestigeManager.prestige()) {
            // Increase player level on prestige
            this.player.level++;
            
            if (this.ui) {
                this.ui.updateAll();
            }
        }
    }

    // Save game
    save() {
        const saveData = {
            gold: this.gold,
            lives: this.lives,
            stats: this.stats,
            wave: this.waveManager.currentWave,
            player: this.player.getSaveData(),
            upgrades: this.upgradeManager.getSaveData(),
            research: this.researchManager.getSaveData(),
            prestige: this.prestigeManager.getSaveData(),
            biome: this.biomeManager.getSaveData()
        };
        
        Utils.saveToStorage('towerDefenseSave', saveData);
        console.log('Game saved!');
    }

    // Load game
    load() {
        const saveData = Utils.loadFromStorage('towerDefenseSave');
        if (!saveData) return false;
        
        try {
            this.gold = saveData.gold || CONFIG.STARTING_GOLD;
            this.lives = saveData.lives || CONFIG.STARTING_LIVES;
            this.stats = saveData.stats || { totalGoldEarned: 0, enemiesKilled: 0, highestWave: 1 };
            this.waveManager.currentWave = saveData.wave || 1;
            
            // Load biome
            this.biomeManager.loadSaveData(saveData.biome);
            
            // Load upgrades
            this.upgradeManager.loadSaveData(saveData.upgrades);
            
            // Load research
            this.researchManager.loadSaveData(saveData.research);
            
            // Load prestige
            this.prestigeManager.loadSaveData(saveData.prestige);
            
            // Load player
            if (saveData.player) {
                this.player.loadSaveData(saveData.player);
            }
            
            console.log('Game loaded!');
            return true;
        } catch (e) {
            console.error('Failed to load save:', e);
            return false;
        }
    }

    // Reset game completely
    reset() {
        if (confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
            localStorage.removeItem('towerDefenseSave');
            location.reload();
        }
    }
}
