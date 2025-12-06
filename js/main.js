// Main entry point
document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    const game = new Game();
    
    // Create UI instance
    const ui = new UI(game);
    
    // Initialize game
    game.init();
    
    // Make game accessible for debugging
    window.game = game;
    
    console.log('🏰 Incremental Tower Defence loaded!');
    console.log('');
    console.log('How to Play:');
    console.log('- YOU are the tower! Click anywhere on the map to move.');
    console.log('- Your tower automatically attacks enemies in range.');
    console.log('- Kill enemies to earn gold and research points.');
    console.log('- Buy MODULES (left panel) to upgrade your tower with special abilities.');
    console.log('- Buy GLOBAL UPGRADES (right panel) for percentage bonuses.');
    console.log('- Research permanent upgrades that persist through prestiges.');
    console.log('- Prestige at wave 10+ to reset and gain permanent bonuses!');
    console.log('');
    console.log('Tips:');
    console.log('- Position yourself near path intersections for maximum coverage.');
    console.log('- Modules stack - multiple damage modules multiply your power!');
    console.log('- Research points are rare but permanent - spend wisely.');
    console.log('- Each prestige increases your base power!');
});
