// Player Tower - The player IS the tower
// Modules are upgrades that enhance the player's abilities

const MODULES = {
    damage: {
        name: 'Damage Module',
        description: '+15% damage',
        icon: '⚔️',
        baseCost: 50,
        costMultiplier: 1.5,
        maxLevel: 25,
        effect: { damage: 0.15 }
    },
    range: {
        name: 'Range Module',
        description: '+10% range',
        icon: '🎯',
        baseCost: 40,
        costMultiplier: 1.4,
        maxLevel: 20,
        effect: { range: 0.10 }
    },
    fireRate: {
        name: 'Speed Module',
        description: '+10% fire rate',
        icon: '⚡',
        baseCost: 60,
        costMultiplier: 1.5,
        maxLevel: 20,
        effect: { fireRate: 0.10 }
    },
    multishot: {
        name: 'Multishot Module',
        description: '+1 additional target',
        icon: '🔱',
        baseCost: 200,
        costMultiplier: 2.5,
        maxLevel: 5,
        effect: { multishot: 1 }
    },
    splash: {
        name: 'Splash Module',
        description: '+20px splash radius',
        icon: '💥',
        baseCost: 150,
        costMultiplier: 2,
        maxLevel: 8,
        effect: { splashRadius: 20 }
    },
    slow: {
        name: 'Frost Module',
        description: '+8% slow, +0.3s duration',
        icon: '❄️',
        baseCost: 100,
        costMultiplier: 1.8,
        maxLevel: 10,
        effect: { slowAmount: 0.08, slowDuration: 0.3 }
    },
    critical: {
        name: 'Critical Module',
        description: '+5% crit chance (2x damage)',
        icon: '💀',
        baseCost: 80,
        costMultiplier: 1.8,
        maxLevel: 10,
        effect: { critChance: 0.05 }
    },
    goldBonus: {
        name: 'Gold Module',
        description: '+15% gold from kills',
        icon: '💰',
        baseCost: 75,
        costMultiplier: 1.6,
        maxLevel: 15,
        effect: { goldBonus: 0.15 }
    },
    regen: {
        name: 'Regen Module',
        description: '+0.5 life regen per wave',
        icon: '💚',
        baseCost: 300,
        costMultiplier: 2.5,
        maxLevel: 5,
        effect: { lifeRegen: 0.5 }
    },
    armor: {
        name: 'Armor Module',
        description: 'Enemies deal -1 life damage',
        icon: '🛡️',
        baseCost: 500,
        costMultiplier: 3,
        maxLevel: 3,
        effect: { armor: 1 }
    }
};

// Player class - The single tower controlled by the player
class Player {
    constructor(game) {
        this.game = game;
        
        // Position (center of map, can be moved)
        this.x = CONFIG.CANVAS_WIDTH / 2;
        this.y = CONFIG.CANVAS_HEIGHT / 2;
        
        // Base stats
        this.baseDamage = 10;
        this.baseRange = 120;
        this.baseFireRate = 1;
        
        // Appearance
        this.color = '#4a90d9';
        this.icon = '🏰';
        this.size = 25;
        
        // Installed modules { moduleKey: level }
        this.modules = {};
        
        // State
        this.level = 1;
        this.kills = 0;
        this.lastFireTime = 0;
        this.targets = [];
        
        // Visual effects
        this.shootEffects = [];
        this.hitEffects = [];
        
        // Movement
        this.targetX = this.x;
        this.targetY = this.y;
        this.moveSpeed = 150; // pixels per second
    }

    // Get module level
    getModuleLevel(moduleKey) {
        return this.modules[moduleKey] || 0;
    }

    // Get module cost
    getModuleCost(moduleKey) {
        const config = MODULES[moduleKey];
        const level = this.getModuleLevel(moduleKey);
        return Math.floor(config.baseCost * Math.pow(config.costMultiplier, level));
    }

    // Check if module is maxed
    isModuleMaxed(moduleKey) {
        return this.getModuleLevel(moduleKey) >= MODULES[moduleKey].maxLevel;
    }

    // Install/upgrade a module
    installModule(moduleKey) {
        const cost = this.getModuleCost(moduleKey);
        
        if (this.game.gold >= cost && !this.isModuleMaxed(moduleKey)) {
            this.game.spendGold(cost);
            this.modules[moduleKey] = (this.modules[moduleKey] || 0) + 1;
            return true;
        }
        return false;
    }

    // Calculate total module bonus for a stat
    getModuleBonus(stat) {
        let bonus = 0;
        for (const [moduleKey, level] of Object.entries(this.modules)) {
            const moduleConfig = MODULES[moduleKey];
            if (moduleConfig.effect[stat]) {
                bonus += moduleConfig.effect[stat] * level;
            }
        }
        return bonus;
    }

    // Get current stats with modules and bonuses
    get damage() {
        let dmg = this.baseDamage;
        
        // Level bonus (from prestige)
        dmg *= (1 + (this.level - 1) * 0.1);
        
        // Module bonus
        dmg *= (1 + this.getModuleBonus('damage'));
        
        // Global upgrade bonus
        dmg *= (1 + this.game.getUpgradeBonus('towerDamage'));
        
        // Prestige bonus
        dmg *= (1 + this.game.getPrestigeBonus('prestigeMultiplier'));
        
        return dmg;
    }

    get range() {
        let rng = this.baseRange;
        rng *= (1 + this.getModuleBonus('range'));
        rng *= (1 + this.game.getUpgradeBonus('towerRange'));
        return rng;
    }

    get fireRate() {
        let rate = this.baseFireRate;
        rate *= (1 + this.getModuleBonus('fireRate'));
        rate *= (1 + this.game.getUpgradeBonus('towerFireRate'));
        return rate;
    }

    get splashRadius() {
        return this.getModuleBonus('splashRadius');
    }

    get slowAmount() {
        return Math.min(0.9, this.getModuleBonus('slowAmount'));
    }

    get slowDuration() {
        return this.getModuleBonus('slowDuration');
    }

    get critChance() {
        return this.getModuleBonus('critChance') + this.game.getPrestigeBonus('critChance');
    }

    get multishot() {
        return 1 + Math.floor(this.getModuleBonus('multishot'));
    }

    get goldBonus() {
        return this.getModuleBonus('goldBonus');
    }

    get lifeRegen() {
        return this.getModuleBonus('lifeRegen');
    }

    get armor() {
        return Math.floor(this.getModuleBonus('armor'));
    }

    // Find target enemies (multiple for multishot)
    findTargets(enemies) {
        const inRange = [];
        
        for (const enemy of enemies) {
            if (enemy.health <= 0) continue;
            
            const dist = Utils.distance(this.x, this.y, enemy.x, enemy.y);
            if (dist <= this.range) {
                inRange.push({ enemy, dist, progress: enemy.progress });
            }
        }
        
        // Sort by progress (furthest along path first)
        inRange.sort((a, b) => b.progress - a.progress);
        
        // Return up to multishot targets
        return inRange.slice(0, this.multishot).map(e => e.enemy);
    }

    // Move towards target position
    moveTo(x, y) {
        // Get current biome path for collision check
        const currentPath = this.game.biomeManager.getCurrentPath();
        // Clamp to valid area (not on path)
        if (!Utils.isOnPath(x, y, currentPath, 30)) {
            this.targetX = Utils.clamp(x, this.size, CONFIG.CANVAS_WIDTH - this.size);
            this.targetY = Utils.clamp(y, this.size, CONFIG.CANVAS_HEIGHT - this.size);
        }
    }

    // Update player
    update(deltaTime, enemies) {
        // Update visual effects
        this.updateEffects(deltaTime);
        
        // Move towards target position
        const distToTarget = Utils.distance(this.x, this.y, this.targetX, this.targetY);
        if (distToTarget > 5) {
            const angle = Utils.angle(this.x, this.y, this.targetX, this.targetY);
            const moveAmount = Math.min(this.moveSpeed * deltaTime, distToTarget);
            this.x += Math.cos(angle) * moveAmount;
            this.y += Math.sin(angle) * moveAmount;
        }
        
        // Find targets
        this.targets = this.findTargets(enemies);
        
        if (this.targets.length === 0) return;
        
        // Check fire rate
        const now = Date.now();
        const fireInterval = 1000 / this.fireRate;
        
        if (now - this.lastFireTime >= fireInterval) {
            this.shoot(enemies);
            this.lastFireTime = now;
        }
    }

    // Player shoots at enemies
    shoot(enemies) {
        if (this.targets.length === 0) return;
        
        for (const target of this.targets) {
            // Calculate damage with critical hit
            let dmg = this.damage;
            let isCrit = false;
            if (Math.random() < this.critChance) {
                dmg *= 2;
                isCrit = true;
            }
            
            // Create shoot visual effect
            this.shootEffects.push({
                x: this.x,
                y: this.y,
                targetX: target.x,
                targetY: target.y,
                time: 0,
                maxTime: 0.15,
                color: isCrit ? '#ff0' : this.color,
                isCrit: isCrit
            });
            
            // Deal damage
            target.takeDamage(dmg, this);
            
            // Apply slow
            if (this.slowAmount > 0 && this.slowDuration > 0) {
                target.applySlow(this.slowAmount, this.slowDuration);
            }
            
            // Splash damage
            if (this.splashRadius > 0) {
                this.dealSplashDamage(target, dmg, enemies);
            }
            
            // Create hit effect
            this.hitEffects.push({
                x: target.x,
                y: target.y,
                time: 0,
                maxTime: 0.2,
                radius: isCrit ? 15 : 10,
                color: isCrit ? '#ff0' : this.color
            });
        }
    }

    // Deal splash damage around a target
    dealSplashDamage(centerTarget, damage, enemies) {
        for (const enemy of enemies) {
            if (enemy === centerTarget || enemy.health <= 0) continue;
            
            const dist = Utils.distance(centerTarget.x, centerTarget.y, enemy.x, enemy.y);
            if (dist <= this.splashRadius) {
                const falloff = 1 - (dist / this.splashRadius) * 0.5;
                enemy.takeDamage(damage * falloff, this);
                
                this.hitEffects.push({
                    x: enemy.x,
                    y: enemy.y,
                    time: 0,
                    maxTime: 0.15,
                    radius: 8,
                    color: '#ff8800'
                });
            }
        }
    }

    // Update visual effects
    updateEffects(deltaTime) {
        this.shootEffects = this.shootEffects.filter(effect => {
            effect.time += deltaTime;
            return effect.time < effect.maxTime;
        });
        
        this.hitEffects = this.hitEffects.filter(effect => {
            effect.time += deltaTime;
            return effect.time < effect.maxTime;
        });
    }

    // Draw player
    draw(ctx) {
        // Draw range circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(74, 144, 217, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'rgba(74, 144, 217, 0.05)';
        ctx.fill();
        
        // Draw splash radius indicator if applicable
        if (this.splashRadius > 0 && this.targets.length > 0) {
            ctx.beginPath();
            ctx.arc(this.targets[0].x, this.targets[0].y, this.splashRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 136, 0, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw shoot effects
        for (const effect of this.shootEffects) {
            const progress = effect.time / effect.maxTime;
            const alpha = 1 - progress;
            
            ctx.beginPath();
            ctx.moveTo(effect.x, effect.y);
            ctx.lineTo(effect.targetX, effect.targetY);
            ctx.strokeStyle = effect.color;
            ctx.lineWidth = effect.isCrit ? 4 : 2;
            ctx.globalAlpha = alpha;
            ctx.stroke();
            ctx.globalAlpha = 1;
            
            // Draw projectile dot
            const dotProgress = Math.min(1, progress * 3);
            const dotX = Utils.lerp(effect.x, effect.targetX, dotProgress);
            const dotY = Utils.lerp(effect.y, effect.targetY, dotProgress);
            ctx.beginPath();
            ctx.arc(dotX, dotY, effect.isCrit ? 6 : 4, 0, Math.PI * 2);
            ctx.fillStyle = effect.color;
            ctx.fill();
        }
        
        // Draw hit effects
        for (const effect of this.hitEffects) {
            const progress = effect.time / effect.maxTime;
            const alpha = 1 - progress;
            const radius = effect.radius * (1 + progress);
            
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = effect.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = alpha;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        // Draw player base (larger, more prominent)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Gradient fill
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, '#6ab0ff');
        gradient.addColorStop(1, this.color);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Glowing border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw module indicators around player
        const moduleCount = Object.keys(this.modules).length;
        if (moduleCount > 0) {
            const moduleKeys = Object.keys(this.modules);
            const maxShow = Math.min(moduleKeys.length, 8);
            for (let i = 0; i < maxShow; i++) {
                const angle = (i / maxShow) * Math.PI * 2 - Math.PI / 2;
                const mx = this.x + Math.cos(angle) * (this.size + 12);
                const my = this.y + Math.sin(angle) * (this.size + 12);
                
                ctx.beginPath();
                ctx.arc(mx, my, 8, 0, Math.PI * 2);
                ctx.fillStyle = '#222';
                ctx.fill();
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#fff';
                ctx.fillText(MODULES[moduleKeys[i]].icon, mx, my);
            }
        }
        
        // Draw player icon
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, this.x, this.y);
        
        // Draw level badge
        if (this.level > 1) {
            ctx.beginPath();
            ctx.arc(this.x + this.size - 5, this.y - this.size + 5, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#ffd700';
            ctx.fill();
            ctx.font = 'bold 10px Arial';
            ctx.fillStyle = '#000';
            ctx.fillText(this.level, this.x + this.size - 5, this.y - this.size + 5);
        }
        
        // Draw target indicator
        if (this.targets.length > 0) {
            for (const target of this.targets) {
                ctx.beginPath();
                ctx.arc(target.x, target.y, target.size + 5, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    }

    // Get player info for UI
    getInfo() {
        return {
            level: this.level,
            damage: Math.floor(this.damage),
            range: Math.floor(this.range),
            fireRate: this.fireRate.toFixed(2),
            kills: this.kills,
            modules: this.modules,
            multishot: this.multishot,
            splashRadius: this.splashRadius,
            slowAmount: this.slowAmount,
            slowDuration: this.slowDuration,
            critChance: this.critChance,
            goldBonus: this.goldBonus,
            lifeRegen: this.lifeRegen,
            armor: this.armor
        };
    }

    // Reset for prestige (keep some progress)
    softReset() {
        this.x = CONFIG.CANVAS_WIDTH / 2;
        this.y = CONFIG.CANVAS_HEIGHT / 2;
        this.targetX = this.x;
        this.targetY = this.y;
        this.kills = 0;
        this.lastFireTime = 0;
        this.targets = [];
        this.shootEffects = [];
        this.hitEffects = [];
        // Modules are reset on prestige
        this.modules = {};
    }

    // Get save data
    getSaveData() {
        return {
            x: this.x,
            y: this.y,
            level: this.level,
            kills: this.kills,
            modules: { ...this.modules }
        };
    }

    // Load save data
    loadSaveData(data) {
        if (data) {
            this.x = data.x || CONFIG.CANVAS_WIDTH / 2;
            this.y = data.y || CONFIG.CANVAS_HEIGHT / 2;
            this.targetX = this.x;
            this.targetY = this.y;
            this.level = data.level || 1;
            this.kills = data.kills || 0;
            this.modules = data.modules || {};
        }
    }
}
