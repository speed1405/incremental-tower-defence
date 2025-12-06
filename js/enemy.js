// Enemy class
class Enemy {
    constructor(type, wave, game) {
        this.id = Utils.generateId();
        this.type = type;
        this.game = game;
        
        // Copy base stats from config
        const config = CONFIG.ENEMIES[type];
        this.name = config.name;
        this.baseHealth = config.health;
        this.baseSpeed = config.speed;
        this.baseGold = config.gold;
        this.color = config.color;
        this.healAmount = config.healAmount || 0;
        this.healRadius = config.healRadius || 0;
        
        // Scale with wave
        const waveMultiplier = 1 + (wave - 1) * 0.15;
        this.maxHealth = Math.floor(this.baseHealth * waveMultiplier);
        this.health = this.maxHealth;
        this.speed = this.baseSpeed;
        this.gold = Math.floor(this.baseGold * waveMultiplier);
        
        // Position and movement
        this.progress = 0; // Distance traveled along path
        this.x = CONFIG.PATH[0].x;
        this.y = CONFIG.PATH[0].y;
        this.angle = 0;
        
        // Status effects
        this.slowTimer = 0;
        this.slowAmount = 0;
        
        // Animation
        this.hitFlash = 0;
        this.healFlash = 0;
        
        // Size based on type
        this.size = type === 'boss' ? 20 : (type === 'tank' ? 15 : 12);
    }

    // Get current speed with slow effect
    get currentSpeed() {
        if (this.slowTimer > 0) {
            return this.speed * (1 - this.slowAmount);
        }
        return this.speed;
    }

    // Take damage
    takeDamage(amount, tower = null) {
        this.health -= amount;
        this.hitFlash = 0.2; // Flash duration in seconds
        
        if (this.health <= 0) {
            this.die(tower);
        }
    }

    // Apply slow effect
    applySlow(amount, duration) {
        // Only apply if stronger slow
        if (amount > this.slowAmount || this.slowTimer <= 0) {
            this.slowAmount = amount;
            this.slowTimer = duration;
        }
    }

    // Enemy dies
    die(tower = null) {
        // Calculate gold reward
        let goldReward = this.gold;
        
        // Gold multiplier from upgrades
        goldReward *= (1 + this.game.getUpgradeBonus('goldMultiplier'));
        
        // Gold bonus from research
        goldReward *= (1 + this.game.getResearchBonus('enemyGoldBonus'));
        
        this.game.addGold(goldReward);
        this.game.stats.enemiesKilled++;
        
        // Award research points (1 per 10 enemies, more for special types)
        const researchChance = this.type === 'boss' ? 1 : (this.type === 'tank' ? 0.3 : 0.1);
        if (Math.random() < researchChance) {
            let rpGain = this.type === 'boss' ? 5 : 1;
            rpGain *= (1 + this.game.getResearchBonus('researchGain'));
            this.game.addResearchPoints(rpGain);
        }
        
        // Update tower kill count
        if (tower) {
            tower.kills++;
        }
    }

    // Heal nearby enemies (for healer type)
    healNearby(enemies, deltaTime) {
        if (this.healAmount <= 0) return;
        
        for (const enemy of enemies) {
            if (enemy === this || enemy.health <= 0) continue;
            
            const dist = Utils.distance(this.x, this.y, enemy.x, enemy.y);
            if (dist <= this.healRadius) {
                const healAmt = this.healAmount * deltaTime;
                enemy.health = Math.min(enemy.maxHealth, enemy.health + healAmt);
                enemy.healFlash = 0.1;
            }
        }
    }

    // Update enemy
    update(deltaTime, enemies) {
        // Update slow timer
        if (this.slowTimer > 0) {
            this.slowTimer -= deltaTime;
        }
        
        // Update hit flash
        if (this.hitFlash > 0) {
            this.hitFlash -= deltaTime;
        }
        if (this.healFlash > 0) {
            this.healFlash -= deltaTime;
        }
        
        // Move along path
        this.progress += this.currentSpeed * deltaTime;
        
        const pathLength = Utils.getPathLength(CONFIG.PATH);
        if (this.progress >= pathLength) {
            // Reached end of path
            this.game.loseLife();
            this.health = 0;
            return;
        }
        
        // Update position
        const pos = Utils.getPointOnPath(CONFIG.PATH, this.progress);
        this.x = pos.x;
        this.y = pos.y;
        this.angle = pos.angle;
        
        // Heal nearby (for healer type)
        this.healNearby(enemies, deltaTime);
    }

    // Draw enemy
    draw(ctx) {
        // Don't draw dead enemies
        if (this.health <= 0) return;
        
        // Draw slow effect
        if (this.slowTimer > 0) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.fill();
        }
        
        // Draw enemy body
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Flash effect when hit
        let color = this.color;
        if (this.hitFlash > 0) {
            color = '#fff';
        } else if (this.healFlash > 0) {
            color = '#0f0';
        }
        
        // Draw based on type
        if (this.type === 'boss') {
            // Boss - octagon shape
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * this.size;
                const y = Math.sin(angle) * this.size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = '#ff0';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Regular enemies - circle
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Draw health bar
        const healthPercent = this.health / this.maxHealth;
        const barWidth = this.size * 2;
        const barHeight = 4;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 8, barWidth, barHeight);
        
        // Health bar color
        let healthColor = '#4caf50';
        if (healthPercent < 0.3) healthColor = '#f44336';
        else if (healthPercent < 0.6) healthColor = '#ff9800';
        
        ctx.fillStyle = healthColor;
        ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 8, barWidth * healthPercent, barHeight);
        
        // Draw healer indicator
        if (this.healAmount > 0) {
            ctx.font = '12px Arial';
            ctx.fillStyle = '#0f0';
            ctx.textAlign = 'center';
            ctx.fillText('+', this.x, this.y + 4);
        }
    }
}
