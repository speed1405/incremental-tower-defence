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
    
    // Biomes - different themed areas with unique paths and visuals
    BIOMES: {
        forest: {
            name: 'Enchanted Forest',
            icon: '🌲',
            unlockWave: 0, // Available from start
            background: '#0a3d2c',
            pathColor: '#3d2a0a',
            pathDetail: '#5a3d0f',
            pathEdge: '#2d1a05',
            gridColor: 'rgba(255, 255, 255, 0.05)',
            path: [
                { x: 0, y: 300 },
                { x: 200, y: 300 },
                { x: 200, y: 100 },
                { x: 400, y: 100 },
                { x: 400, y: 500 },
                { x: 600, y: 500 },
                { x: 600, y: 300 },
                { x: 800, y: 300 }
            ],
            enemyHealthMod: 1.0,
            enemySpeedMod: 1.0,
            goldMod: 1.0
        },
        desert: {
            name: 'Scorching Desert',
            icon: '🏜️',
            unlockWave: 15,
            background: '#3d2b1f',
            pathColor: '#c2a05a',
            pathDetail: '#d4b775',
            pathEdge: '#8b7355',
            gridColor: 'rgba(255, 200, 100, 0.05)',
            path: [
                { x: 0, y: 150 },
                { x: 150, y: 150 },
                { x: 150, y: 450 },
                { x: 350, y: 450 },
                { x: 350, y: 200 },
                { x: 550, y: 200 },
                { x: 550, y: 400 },
                { x: 800, y: 400 }
            ],
            enemyHealthMod: 1.2,
            enemySpeedMod: 1.1,
            goldMod: 1.25
        },
        tundra: {
            name: 'Frozen Tundra',
            icon: '❄️',
            unlockWave: 30,
            background: '#1a2a3a',
            pathColor: '#5a7a9a',
            pathDetail: '#7a9aba',
            pathEdge: '#3a5a7a',
            gridColor: 'rgba(150, 200, 255, 0.05)',
            path: [
                { x: 0, y: 500 },
                { x: 200, y: 500 },
                { x: 200, y: 200 },
                { x: 400, y: 200 },
                { x: 400, y: 400 },
                { x: 600, y: 400 },
                { x: 600, y: 100 },
                { x: 800, y: 100 }
            ],
            enemyHealthMod: 1.5,
            enemySpeedMod: 0.9,
            goldMod: 1.5
        },
        volcanic: {
            name: 'Volcanic Wastes',
            icon: '🌋',
            unlockWave: 50,
            background: '#2d1a1a',
            pathColor: '#4a2a2a',
            pathDetail: '#6a3a3a',
            pathEdge: '#2a1515',
            gridColor: 'rgba(255, 100, 50, 0.05)',
            path: [
                { x: 0, y: 300 },
                { x: 100, y: 300 },
                { x: 100, y: 100 },
                { x: 300, y: 100 },
                { x: 300, y: 500 },
                { x: 500, y: 500 },
                { x: 500, y: 250 },
                { x: 700, y: 250 },
                { x: 700, y: 450 },
                { x: 800, y: 450 }
            ],
            enemyHealthMod: 2.0,
            enemySpeedMod: 1.2,
            goldMod: 2.0
        }
    },
    
    // Default path (for backwards compatibility)
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
