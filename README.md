# 🏰 Incremental Tower Defence

An incremental tower defence game where **you are the tower**! Defend against waves of enemies, upgrade your abilities with modules, and progress through research and prestige systems for permanent power gains.

## 🎮 How to Play

1. **Click anywhere on the map** to move your tower to that position
2. Your tower **automatically attacks** enemies within range
3. **Kill enemies** to earn gold and research points
4. **Start waves** by clicking the "Start Wave" button
5. Don't let too many enemies reach the end of the path!

## 💎 Game Systems

### Modules (Left Panel)
Modules are upgrades you can install on your tower. Each module can be leveled up multiple times for stacking effects:

- ⚔️ **Damage Module** - Increases your attack damage
- 🎯 **Range Module** - Extends your attack range
- ⚡ **Speed Module** - Increases fire rate
- 🔱 **Multishot Module** - Attack multiple targets at once
- 💥 **Splash Module** - Deal area damage
- ❄️ **Frost Module** - Slow enemies you hit
- 💀 **Critical Module** - Chance for double damage
- 💰 **Gold Module** - Bonus gold from kills
- 💚 **Regen Module** - Recover lives between waves
- 🛡️ **Armor Module** - Reduce damage from enemies reaching the end

### Global Upgrades (Right Panel - "Global" Tab)
Per-run upgrades that provide percentage bonuses to all your stats. These reset on prestige.

### Research (Right Panel - "Research" Tab)
Permanent upgrades purchased with research points. Research points are earned by killing enemies (with a chance per kill, guaranteed from bosses). These persist through prestiges!

### Prestige (Right Panel - "Prestige" Tab)
Once you reach wave 10, you can **prestige** to:
- Reset your gold, modules, and upgrades
- Gain **prestige points** based on your wave progress
- Increase your tower's base power level
- Unlock powerful prestige upgrades

## 🎯 Strategy Tips

1. **Position wisely** - Place your tower near path intersections for maximum coverage
2. **Balance your modules** - Don't just stack damage, range and fire rate matter too!
3. **Multishot is powerful** - Hitting multiple enemies greatly increases your DPS
4. **Save research points** - They're rare, so spend them on upgrades that matter
5. **Prestige early and often** - The permanent damage bonus compounds over time
6. **Splash + Slow combo** - Freeze enemies in your splash radius for massive damage

## 🛠️ Technologies Used

- Vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- CSS3 for UI styling
- Local Storage for save/load

## 🚀 Running the Game

Simply open `index.html` in a web browser. No server required!

```bash
# Or use a simple HTTP server
python -m http.server 8000
# Then open http://localhost:8000
```

## 📁 Project Structure

```
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Game styling
├── js/
│   ├── config.js       # Game configuration and constants
│   ├── utils.js        # Utility functions
│   ├── tower.js        # Player tower class and modules
│   ├── enemy.js        # Enemy class
│   ├── wave.js         # Wave management
│   ├── upgrade.js      # Global upgrade system
│   ├── research.js     # Research system
│   ├── prestige.js     # Prestige system
│   ├── game.js         # Main game logic
│   ├── ui.js           # UI management
│   └── main.js         # Entry point
└── README.md
```

## 🎮 Controls

- **Left Click** - Move your tower
- **Start Wave Button** - Begin the next wave of enemies

## 💾 Saving

The game auto-saves every 30 seconds. You can also manually save using the "Save Game" button. Progress is stored in your browser's local storage.

## License

MIT License - Feel free to modify and share!