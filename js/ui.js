// UI Manager
class UI {
    constructor(game) {
        this.game = game;
        game.ui = this;
        
        // Cache DOM elements
        this.elements = {
            gold: document.getElementById('gold'),
            researchPoints: document.getElementById('research-points'),
            prestigePoints: document.getElementById('prestige-points'),
            waveNumber: document.getElementById('wave-number'),
            enemiesRemaining: document.getElementById('enemies-remaining'),
            lives: document.getElementById('lives'),
            startWaveBtn: document.getElementById('start-wave-btn'),
            // Biome selector
            currentBiome: document.getElementById('current-biome'),
            biomeDropdown: document.getElementById('biome-dropdown'),
            // Player stats
            playerDamage: document.getElementById('player-damage'),
            playerRange: document.getElementById('player-range'),
            playerFirerate: document.getElementById('player-firerate'),
            playerMultishot: document.getElementById('player-multishot'),
            playerKills: document.getElementById('player-kills'),
            playerSplash: document.getElementById('player-splash'),
            playerSlow: document.getElementById('player-slow'),
            playerCrit: document.getElementById('player-crit'),
            playerGoldbonus: document.getElementById('player-goldbonus'),
            splashStat: document.getElementById('splash-stat'),
            slowStat: document.getElementById('slow-stat'),
            critStat: document.getElementById('crit-stat'),
            goldBonusStat: document.getElementById('gold-bonus-stat'),
            // Module panel
            moduleList: document.getElementById('module-list'),
            // Right panel
            upgradesList: document.getElementById('upgrades-list'),
            researchList: document.getElementById('research-list'),
            prestigeLevel: document.getElementById('prestige-level'),
            prestigeGain: document.getElementById('prestige-gain'),
            prestigeBtn: document.getElementById('prestige-btn'),
            prestigeUpgradesList: document.getElementById('prestige-upgrades-list'),
            // Footer
            totalGold: document.getElementById('total-gold'),
            enemiesKilled: document.getElementById('enemies-killed'),
            highestWave: document.getElementById('highest-wave'),
            saveBtn: document.getElementById('save-btn'),
            resetBtn: document.getElementById('reset-btn')
        };
        
        this.setupEventListeners();
        this.updateAll();
    }

    // Setup event listeners
    setupEventListeners() {
        // Canvas events
        const canvas = this.game.canvas;
        
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.game.handleCanvasClick(x, y);
        });
        
        // Start wave button
        this.elements.startWaveBtn.addEventListener('click', () => {
            this.game.waveManager.startWave();
        });
        
        // Biome selector
        this.elements.currentBiome.addEventListener('click', () => {
            this.toggleBiomeDropdown();
        });
        
        // Close biome dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#biome-selector')) {
                this.elements.biomeDropdown.classList.add('hidden');
            }
        });
        
        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });
        
        // Save/Reset buttons
        this.elements.saveBtn.addEventListener('click', () => {
            this.game.save();
            this.showNotification('Game Saved!');
        });
        
        this.elements.resetBtn.addEventListener('click', () => {
            this.game.reset();
        });
        
        // Prestige button
        this.elements.prestigeBtn.addEventListener('click', () => {
            this.game.prestige();
        });
        
        // Auto-save every 30 seconds
        setInterval(() => {
            this.game.save();
        }, 30000);
    }
    
    // Toggle biome dropdown
    toggleBiomeDropdown() {
        this.elements.biomeDropdown.classList.toggle('hidden');
        this.updateBiomeSelector();
    }
    
    // Update biome selector
    updateBiomeSelector() {
        // Update current biome display
        const currentBiome = this.game.biomeManager.getCurrentBiome();
        this.elements.currentBiome.textContent = `${currentBiome.icon} ${currentBiome.name}`;
        
        // Update dropdown
        this.elements.biomeDropdown.innerHTML = '';
        const biomes = this.game.biomeManager.getAllBiomes();
        
        for (const biome of biomes) {
            const div = document.createElement('div');
            div.className = `biome-option ${biome.current ? 'current' : ''} ${biome.unlocked ? '' : 'locked'}`;
            
            if (biome.unlocked) {
                div.innerHTML = `
                    <span class="biome-icon">${biome.icon}</span>
                    <span class="biome-name">${biome.name}</span>
                    <span class="biome-stats">HP: ${Math.floor(biome.enemyHealthMod * 100)}% | Gold: ${Math.floor(biome.goldMod * 100)}%</span>
                `;
                div.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.game.biomeManager.switchBiome(biome.key);
                    this.elements.biomeDropdown.classList.add('hidden');
                });
            } else {
                div.innerHTML = `
                    <span class="biome-icon">🔒</span>
                    <span class="biome-name">${biome.name}</span>
                    <span class="biome-unlock">Reach Wave ${biome.unlockWave}</span>
                `;
            }
            
            this.elements.biomeDropdown.appendChild(div);
        }
    }

    // Switch tab
    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-tab`);
        });
    }

    // Update all UI
    updateAll() {
        this.updateGold();
        this.updateResearchPoints();
        this.updatePrestigePoints();
        this.updateWaveInfo();
        this.updateLives();
        this.updatePlayerStats();
        this.updateModuleList();
        this.updateUpgrades();
        this.updateResearch();
        this.updatePrestigeButton();
        this.updatePrestigeUpgrades();
        this.updateBiomeSelector();
        this.updateStats();
    }

    // Update gold display
    updateGold() {
        this.elements.gold.textContent = Utils.formatNumber(Math.floor(this.game.gold));
        // Also update module affordability
        this.updateModuleList();
    }

    // Update research points
    updateResearchPoints() {
        this.elements.researchPoints.textContent = Utils.formatNumber(Math.floor(this.game.researchManager.points));
    }

    // Update prestige points
    updatePrestigePoints() {
        this.elements.prestigePoints.textContent = Utils.formatNumber(Math.floor(this.game.prestigeManager.prestigePoints));
    }

    // Update wave info
    updateWaveInfo() {
        this.elements.waveNumber.textContent = this.game.waveManager.currentWave;
        this.elements.enemiesRemaining.textContent = this.game.waveManager.enemiesRemaining;
        
        // Update button state
        this.elements.startWaveBtn.disabled = this.game.waveManager.waveActive;
        this.elements.startWaveBtn.textContent = this.game.waveManager.waveActive ? 
            'Wave In Progress...' : 'Start Wave';
    }

    // Update lives display
    updateLives() {
        this.elements.lives.textContent = this.game.lives;
    }

    // Update player stats display
    updatePlayerStats() {
        const player = this.game.player;
        const info = player.getInfo();
        
        this.elements.playerDamage.textContent = info.damage;
        this.elements.playerRange.textContent = info.range;
        this.elements.playerFirerate.textContent = info.fireRate;
        this.elements.playerMultishot.textContent = info.multishot;
        this.elements.playerKills.textContent = Utils.formatNumber(info.kills);
        
        // Show/hide special stats
        if (info.splashRadius > 0) {
            this.elements.splashStat.style.display = 'flex';
            this.elements.playerSplash.textContent = Math.floor(info.splashRadius);
        } else {
            this.elements.splashStat.style.display = 'none';
        }
        
        if (info.slowAmount > 0) {
            this.elements.slowStat.style.display = 'flex';
            this.elements.playerSlow.textContent = Math.floor(info.slowAmount * 100);
        } else {
            this.elements.slowStat.style.display = 'none';
        }
        
        if (info.critChance > 0) {
            this.elements.critStat.style.display = 'flex';
            this.elements.playerCrit.textContent = Math.floor(info.critChance * 100);
        } else {
            this.elements.critStat.style.display = 'none';
        }
        
        if (info.goldBonus > 0) {
            this.elements.goldBonusStat.style.display = 'flex';
            this.elements.playerGoldbonus.textContent = Math.floor(info.goldBonus * 100);
        } else {
            this.elements.goldBonusStat.style.display = 'none';
        }
    }

    // Update module list
    updateModuleList() {
        const player = this.game.player;
        this.elements.moduleList.innerHTML = '';
        
        for (const [key, config] of Object.entries(MODULES)) {
            const level = player.getModuleLevel(key);
            const cost = player.getModuleCost(key);
            const isMaxed = player.isModuleMaxed(key);
            const canAfford = this.game.gold >= cost;
            
            const div = document.createElement('div');
            div.className = `module-item ${isMaxed ? 'maxed' : ''} ${canAfford && !isMaxed ? 'affordable' : ''}`;
            
            div.innerHTML = `
                <div class="module-header">
                    <span class="module-icon">${config.icon}</span>
                    <span class="module-name">${config.name}</span>
                    <span class="module-level">${level}/${config.maxLevel}</span>
                </div>
                <div class="module-desc">${config.description}</div>
                <div class="module-cost">${isMaxed ? 'MAX' : `💰 ${Utils.formatNumber(cost)}`}</div>
            `;
            
            if (!isMaxed) {
                div.addEventListener('click', () => {
                    if (player.installModule(key)) {
                        this.updateGold();
                        this.updatePlayerStats();
                    }
                });
            }
            
            this.elements.moduleList.appendChild(div);
        }
    }

    // Update global upgrades list
    updateUpgrades() {
        this.elements.upgradesList.innerHTML = '';
        
        for (const [key, config] of Object.entries(CONFIG.UPGRADES)) {
            const level = this.game.upgradeManager.getLevel(key);
            const cost = this.game.upgradeManager.getCost(key);
            const isMaxed = this.game.upgradeManager.isMaxed(key);
            const canAfford = this.game.gold >= cost;
            
            const div = document.createElement('div');
            div.className = `upgrade-item ${isMaxed ? 'maxed' : ''} ${canAfford && !isMaxed ? 'affordable' : ''}`;
            
            div.innerHTML = `
                <div class="upgrade-name">${config.name}</div>
                <span class="upgrade-level">${level}/${config.maxLevel}</span>
                <div class="upgrade-desc">${config.description}</div>
                <div class="upgrade-cost">${isMaxed ? 'MAX' : `💰 ${Utils.formatNumber(cost)}`}</div>
            `;
            
            if (!isMaxed) {
                div.addEventListener('click', () => {
                    if (this.game.upgradeManager.purchase(key)) {
                        this.updateGold();
                        this.updatePlayerStats();
                    }
                });
            }
            
            this.elements.upgradesList.appendChild(div);
        }
    }

    // Update research list
    updateResearch() {
        this.elements.researchList.innerHTML = '';
        
        for (const [key, config] of Object.entries(CONFIG.RESEARCH)) {
            const level = this.game.researchManager.getLevel(key);
            const cost = this.game.researchManager.getCost(key);
            const isMaxed = this.game.researchManager.isMaxed(key);
            const canAfford = this.game.researchManager.canAfford(key);
            
            const div = document.createElement('div');
            div.className = `research-item ${isMaxed ? 'maxed' : ''} ${canAfford && !isMaxed ? 'affordable' : ''}`;
            
            div.innerHTML = `
                <div class="research-name">${config.name}</div>
                <span class="research-level">${level}/${config.maxLevel}</span>
                <div class="research-desc">${config.description}</div>
                <div class="research-cost">${isMaxed ? 'UNLOCKED' : `🔬 ${Utils.formatNumber(cost)}`}</div>
            `;
            
            if (!isMaxed) {
                div.addEventListener('click', () => {
                    if (this.game.researchManager.purchase(key)) {
                        this.updateResearchPoints();
                        this.updateResearch();
                    }
                });
            }
            
            this.elements.researchList.appendChild(div);
        }
    }

    // Update prestige button
    updatePrestigeButton() {
        const canPrestige = this.game.prestigeManager.canPrestige();
        const gain = this.game.prestigeManager.calculatePrestigeGain();
        
        this.elements.prestigeLevel.textContent = this.game.prestigeManager.prestigeLevel;
        this.elements.prestigeGain.textContent = gain;
        
        this.elements.prestigeBtn.disabled = !canPrestige;
        this.elements.prestigeBtn.textContent = canPrestige ? 
            `⭐ Prestige (+${gain} PP)` : 'Prestige (Reach Wave 10)';
    }

    // Update prestige upgrades
    updatePrestigeUpgrades() {
        this.elements.prestigeUpgradesList.innerHTML = '';
        
        for (const [key, config] of Object.entries(CONFIG.PRESTIGE_UPGRADES)) {
            const level = this.game.prestigeManager.getLevel(key);
            const cost = this.game.prestigeManager.getCost(key);
            const isMaxed = this.game.prestigeManager.isMaxed(key);
            const canAfford = this.game.prestigeManager.canAfford(key);
            
            const div = document.createElement('div');
            div.className = `prestige-upgrade-item ${isMaxed ? 'maxed' : ''} ${canAfford && !isMaxed ? 'affordable' : ''}`;
            
            div.innerHTML = `
                <div class="prestige-upgrade-name">${config.name}</div>
                <span class="prestige-upgrade-level">${level}/${config.maxLevel}</span>
                <div class="prestige-upgrade-desc">${config.description}</div>
                <div class="prestige-upgrade-cost">${isMaxed ? 'MAX' : `⭐ ${Utils.formatNumber(cost)}`}</div>
            `;
            
            if (!isMaxed) {
                div.addEventListener('click', () => {
                    if (this.game.prestigeManager.purchase(key)) {
                        this.updatePrestigePoints();
                        this.updatePrestigeUpgrades();
                        this.updatePlayerStats();
                    }
                });
            }
            
            this.elements.prestigeUpgradesList.appendChild(div);
        }
    }

    // Update stats
    updateStats() {
        this.elements.totalGold.textContent = Utils.formatNumber(Math.floor(this.game.stats.totalGoldEarned));
        this.elements.enemiesKilled.textContent = Utils.formatNumber(this.game.stats.enemiesKilled);
        this.elements.highestWave.textContent = this.game.stats.highestWave;
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}
