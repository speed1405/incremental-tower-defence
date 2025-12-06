// Game configuration constants
const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // Grid settings
    GRID_SIZE: 40,
    
    // Game speed
    TICK_RATE: 60, // FPS
    
    // Starting resources
    STARTING_GOLD: 100,
    STARTING_LIVES: 20,
    
    // Gold generation (incremental mechanic)
    BASE_GOLD_PER_SECOND: 0.5,
    
    // Enemy path (waypoints)
    PATH: [
        { x: 0, y: 300 },
        { x: 200, y: 300 },
        { x: 200, y: 100 },
        { x: 400, y: 100 },
        { x: 400, y: 500 },
        { x: 600, y: 500 },
        { x: 600, y: 300 },
        { x: 800, y: 300 }
    ],
    
    // Enemy types
    ENEMIES: {
        basic: {
            name: 'Goblin',
            health: 50,
            speed: 50,
            gold: 10,
            color: '#6b8e23'
        },
        fast: {
            name: 'Scout',
            health: 30,
            speed: 100,
            gold: 15,
            color: '#87ceeb'
        },
        tank: {
            name: 'Ogre',
            health: 200,
            speed: 25,
            gold: 30,
            color: '#8b4513'
        },
        healer: {
            name: 'Shaman',
            health: 40,
            speed: 40,
            gold: 25,
            healAmount: 5,
            healRadius: 50,
            color: '#32cd32'
        },
        boss: {
            name: 'Boss',
            health: 1000,
            speed: 20,
            gold: 200,
            color: '#8b0000'
        },
        swarm: {
            name: 'Swarmling',
            health: 15,
            speed: 80,
            gold: 5,
            color: '#9932cc'
        }
    },
    
    // Global Upgrades (per run, affect the player tower)
    UPGRADES: {
        towerDamage: {
            name: 'Damage Boost',
            description: '+10% damage',
            baseCost: 100,
            costMultiplier: 1.5,
            maxLevel: 25,
            effect: 0.1
        },
        towerRange: {
            name: 'Range Boost',
            description: '+5% range',
            baseCost: 75,
            costMultiplier: 1.4,
            maxLevel: 20,
            effect: 0.05
        },
        towerFireRate: {
            name: 'Speed Boost',
            description: '+5% fire rate',
            baseCost: 100,
            costMultiplier: 1.5,
            maxLevel: 20,
            effect: 0.05
        },
        goldMultiplier: {
            name: 'Gold Bonus',
            description: '+10% gold earned',
            baseCost: 150,
            costMultiplier: 1.6,
            maxLevel: 20,
            effect: 0.1
        },
        goldPerSecond: {
            name: 'Passive Income',
            description: '+0.5 gold/second',
            baseCost: 200,
            costMultiplier: 1.8,
            maxLevel: 15,
            effect: 0.5
        }
    },
    
    // Research (permanent, uses research points, persists through prestiges)
    RESEARCH: {
        startingGold: {
            name: 'Starting Capital',
            description: '+50 starting gold',
            cost: 5,
            costMultiplier: 2,
            maxLevel: 10,
            effect: 50
        },
        baseDamage: {
            name: 'Base Damage',
            description: '+5% base damage',
            cost: 10,
            costMultiplier: 2.5,
            maxLevel: 10,
            effect: 0.05
        },
        researchGain: {
            name: 'Research Efficiency',
            description: '+10% research point gain',
            cost: 20,
            costMultiplier: 3,
            maxLevel: 5,
            effect: 0.1
        },
        enemyGoldBonus: {
            name: 'Bounty Hunter',
            description: '+5% gold from enemies',
            cost: 15,
            costMultiplier: 2,
            maxLevel: 10,
            effect: 0.05
        },
        startingLives: {
            name: 'Extra Lives',
            description: '+2 starting lives',
            cost: 25,
            costMultiplier: 3,
            maxLevel: 5,
            effect: 2
        }
    },
    
    // Prestige upgrades (uses prestige points, permanent meta-progression)
    PRESTIGE_UPGRADES: {
        prestigeMultiplier: {
            name: 'Prestige Power',
            description: '+25% damage per prestige level',
            cost: 1,
            costMultiplier: 2,
            maxLevel: 10,
            effect: 0.25
        },
        startingWave: {
            name: 'Head Start',
            description: 'Start at a higher wave',
            cost: 3,
            costMultiplier: 3,
            maxLevel: 5,
            effect: 1
        },
        autoStart: {
            name: 'Auto Wave',
            description: 'Automatically start next wave',
            cost: 2,
            maxLevel: 1,
            unlock: 'autoStart'
        },
        critChance: {
            name: 'Critical Mastery',
            description: '+5% crit chance (applies to all)',
            cost: 2,
            costMultiplier: 1.5,
            maxLevel: 10,
            effect: 0.05
        },
        moduleDiscount: {
            name: 'Module Discount',
            description: '-5% module costs',
            cost: 3,
            costMultiplier: 2,
            maxLevel: 5,
            effect: 0.05
        }
    }
};
