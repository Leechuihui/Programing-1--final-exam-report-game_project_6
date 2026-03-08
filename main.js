// Main Game File - Uses modular system architecture
let gameController;                    // Main game controller instance
let cameraX = 0;                      // Camera horizontal position for scrolling
let worldWidth = 1208;                // Total world width for level design
let floorPos_y;                       // Ground level Y position

function preload() {
    // Preload audio files (commented out for now)
    // rainSound = loadSound('./asset/rain.mp3');
    // frogSound = loadSound('./asset/frog.mp3');
    // backgroundMusic = loadSound('assets/audio/background.mp3');
}

function setup() {
    // Create canvas and attach to HTML element
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('game-main');

    // Set frame rate to slow down the game
    frameRate(30);  // 从默认60fps降低到30fps

    // Set Chinese font for text rendering
    textFont('Arial');

    // Initialize game world dimensions
    worldWidth = width * 2 + 300;     // World width is 2x screen width + 300px
    floorPos_y = height * 0.875;      // Ground level at 87.5% of screen height

    // Create main game controller instance
    gameController = new GameController();

    // Delay audio system initialization to ensure p5.sound is ready
    setTimeout(() => {
        gameController.initAudio();
    }, 500);

    console.log('🎮 Game initialization complete');
    console.log('Control instructions:');
    console.log('  WASD - Move cat');
    console.log('  Spacebar - Jump');
    console.log('  Arrow keys - Directional control');
    console.log('  Left mouse button - Jump');
    console.log('  Right mouse button - Shoot fishbone');
    console.log('  Mouse wheel - Zoom camera');
    console.log('  C key - Show coordinates');
    console.log('  F key - Shoot fishbone');
    console.log('  L key - Trigger lightning');
    console.log('  P key - Pause/Resume');
    console.log('  R key - Restart game');
    console.log('  M key - Toggle audio');
    console.log('  N key - Toggle day/night');
    console.log('  G key - Toggle snow');

    console.log('  T key - 🤖 Auto-test jump to target position (1725, 815)');
    console.log('  X key - 🔄 Reset cat to starting position');
    console.log('🏆 Game objective: Collect fish for points, reach 1000 points to complete level!');
}

function draw() {
    // Update game state (physics, AI, etc.)
    gameController.update();

    // Render game graphics
    gameController.draw();

    // Only show additional info during active gameplay
    if (gameController.gameState === "playing") {
        // Get current weather and score information
        let weatherStatus = gameController.weatherSystem.getWeatherStatus();
        let scoreInfo = gameController.scoreSystem.getScoreInfo();

        // Set up text rendering
        fill(255);                     // White text color
        textSize(12);                  // Text size
        textAlign(LEFT, TOP);          // Text alignment

        // Display weather status with remaining time and lightning
        let weatherText = `Weather: ${weatherStatus.weatherType}`;
        if (weatherStatus.isRaining && weatherStatus.lightningActive) {
            weatherText += ` ⚡ Lightning active`;
        }
        if (weatherStatus.remainingTime > 0) {
            weatherText += ` (Remaining: ${weatherStatus.remainingTime}s)`;
        }
        text(weatherText, 30, 20);

        // Display score information
        text(`Score: ${scoreInfo.score} | Target: ${scoreInfo.targetScore}`, 30, 50);

        // Show remaining time display
        let remainingTime = gameController.weatherSystem.getRemainingTime();
        if (remainingTime > 0) {
            fill(255, 255, 100);       // Yellow color for time display
            textSize(10);
            text(`Remaining: ${remainingTime}s (Total 30s)`, 20, 80);
        }

        // Basic control instructions
        fill(255, 255, 255, 180);      // Semi-transparent white
        textSize(10);
        text(`WASD to move | Space to jump | Left click to jump | Right click to shoot`, 30, height - 80);

        // Game state indicators
        if (gameController.characterSystem.isInvincible) {
            fill(255, 100, 100);       // Red color for invincible state
            textSize(16);
            text('⭐ Invincible', width - 150, 30);
        }

        // Display snow grounding status
        let snowStatus = gameController.weatherSystem.getSnowGroundingStatus();
        if (snowStatus) {
            fill(snowStatus.fullyGrounded ? color(100, 255, 100) : color(255, 200, 100));
            textSize(9);
            let snowText = snowStatus.fullyGrounded ?
                `❄️ Snow fully grounded (Ground snow: ${snowStatus.groundSnow} points)` :
                `❄️ Quick snow grounding... (Air: ${snowStatus.snowInAir} points, Ground: ${snowStatus.groundSnow} points, Progress: ${Math.floor(snowStatus.progressPercent)}%)`;
            text(snowText, 30, 305);

            // Draw progress bar
            if (!snowStatus.fullyGrounded) {
                // Progress bar background (scaled down)
                fill(100);
                rect(30, 320, 150, 6);
                // Progress bar fill (scaled down)
                fill(snowStatus.progressPercent >= 100 ? color(100, 255, 100) : color(255, 200, 100));
                rect(30, 320, (snowStatus.progressPercent / 100) * 150, 6);

                fill(255, 150, 150);
                textSize(8);
                text('🚫 Need at least 30 snow points and less than 20 snow in the air to change weather', 30, 330);
            }
        }

        // Display control guide
        fill(200);
        textSize(9);
        text('P-Pause | R-Restart | M-Audio | N-Day/Night | G-Snow | T-Auto-test | X-Reset', 30, height - 40);
        text('WASD to move, Space to jump, collect fish for points, avoid mice', 30, height - 25);

        // Display health and statistics
        fill(255, 100, 100);
        textSize(14);
        text(`💖 Health: ${gameController.characterSystem.life}/100`, width - 200, 60);
        text(`⭐ Lives: ${gameController.characterSystem.lives}`, width - 200, 90);

        // Display weather feature description
        if (gameController.weatherSystem.isSnowing) {
            fill(150, 200, 255);
            textSize(8);
            text('❄️ Quick snow (12-20 pixels/frame) | Duration 30s', 30, height - 10);
        } else if (gameController.weatherSystem.isRaining) {
            fill(180, 200, 255);
            textSize(8);
            text('🌧️ Rain effect: Dark clouds ⛈️ | Lightning ⚡ | Reduced shadows', 30, height - 10);
        } else {
            fill(200, 200, 200);
            textSize(8);
            text('⏱️ Unified weather system: Snow 30s | Day 30s | Night 30s', 30, height - 10);
        }



        // Display game objective
        fill(255, 255, 100);
        textSize(12);
        text('🏆 Objective: Collect fish for 1000 points to complete level!', 30, 120);
    }
}

// Keyboard event handling
function keyPressed() {
    if (gameController) {
        gameController.handleKeyPressed(key, keyCode);
    }
}

function keyReleased() {
    if (gameController) {
        gameController.handleKeyReleased(key, keyCode);
    }
}

// Mouse event handling
function mousePressed() {
    if (gameController) {
        gameController.handleMousePressed();
    }
}

function mouseWheel(event) {
    if (gameController) {
        gameController.handleMouseWheel(event);
    }
}

// Window resize handling
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    if (gameController) {
        gameController.handleWindowResize();
    }
}
