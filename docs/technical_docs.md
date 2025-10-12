# Technical Documentation - Black Cat Granary Saga: Dream Prologue

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Core Modules](#core-modules)
3. [Data Structures](#data-structures)
4. [Algorithms](#algorithms)
5. [Performance Optimization](#performance-optimization)
6. [Browser Compatibility](#browser-compatibility)
7. [API Reference](#api-reference)

## System Architecture

### Overview
The game follows a modular architecture pattern with clear separation of concerns. Each system is responsible for specific functionality and communicates through well-defined interfaces.

```
┌─────────────────────────────────────────────────────────────┐
│                    GameController                           │
│                    (Main Coordinator)                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐    ┌───▼───┐    ┌───▼───┐
│Character│    │Environment│    │Weather │
│System  │    │System    │    │System  │
└────────┘    └──────────┘    └────────┘
    │             │             │
    └─────────────┼─────────────┘
                  │
            ┌─────▼─────┐
            │Score &    │
            │Audio      │
            │Systems    │
            └───────────┘
```

### Design Principles
- **Single Responsibility**: Each module handles one specific aspect
- **Loose Coupling**: Modules interact through interfaces, not direct dependencies
- **High Cohesion**: Related functionality grouped together
- **Event-Driven**: Systems communicate through events and callbacks

## Core Modules

### 1. GameController (`main.js`)
**Purpose**: Main game coordinator and state manager

**Key Responsibilities**:
- Game state management (playing, paused, gameOver, levelComplete)
- Input handling and event delegation
- System coordination and update cycles
- UI rendering and overlay management

**Key Methods**:
```javascript
class GameController {
    constructor() {
        this.weatherSystem = new WeatherSystem();
        this.characterSystem = new CharacterSystem();
        this.environmentSystem = new EnvironmentSystem();
        this.scoreSystem = new ScoreSystem();
        this.audioSystem = new AudioSystem();
    }
    
    update() {
        // Update all systems based on game state
        switch (this.gameState) {
            case "playing":
                this.updatePlaying();
                break;
            // ... other states
        }
    }
    
    handleKeyPress(key) {
        // Centralized input handling
        switch (key) {
            case ' ':
                this.characterSystem.jump();
                break;
            // ... other keys
        }
    }
}
```

### 2. CharacterSystem (`character.js`)
**Purpose**: Player character and enemy management

**Key Features**:
- Physics simulation (gravity, jumping, collision)
- AI behavior for mouse enemies
- Power-up system and effects
- Health and life management

**Physics Implementation**:
```javascript
updateCatPosition() {
    // Handle horizontal movement
    if (this.cat.isMovingLeft) {
        this.cat.x -= this.cat.speed;
    }
    
    // Apply gravity
    this.cat.y += this.cat.vy;
    this.cat.vy += 0.8; // Gravity constant
    
    // Ground collision
    if (this.cat.y > floorPos_y) {
        this.cat.y = floorPos_y;
        this.cat.vy = 0;
        this.cat.isJumping = false;
    }
}
```

**AI System**:
```javascript
updateMouseAI(mouse) {
    let distToCat = dist(mouse.x, mouse.y, this.cat.x, this.cat.y);
    
    switch (mouse.aiType) {
        case 'patrol':
            // Patrol behavior with distance checking
            break;
        case 'chase':
            // Chase behavior when cat is detected
            break;
        case 'guard':
            // Guard behavior at specific locations
            break;
    }
}
```

### 3. WeatherSystem (`weather.js`)
**Purpose**: Dynamic weather effects and environmental changes

**Key Features**:
- Particle systems for rain and snow
- Day/night cycle management
- Lightning effects
- Ground snow accumulation

**Particle System**:
```javascript
addSnowParticle() {
    // Object pooling for performance
    for (let i = 0; i < this.snowParticles.length; i++) {
        if (!this.snowParticles[i].active) {
            this.activateParticle(i);
            return;
        }
    }
    
    // Create new particle if pool is full
    if (this.snowParticles.length < this.config.MAX_SNOW) {
        this.snowParticles.push(createSnowParticle());
    }
}
```

**Weather State Machine**:
```javascript
checkWeatherSwitch() {
    const currentTime = Date.now();
    const elapsed = currentTime - this.currentWeatherStartTime;
    
    if (this.currentWeatherType === 'snow' && elapsed >= this.config.SNOW_DURATION) {
        if (this.isSnowFullyGrounded()) {
            this.performWeatherSwitch('none', this.currentDayNight);
        }
    }
}
```

### 4. EnvironmentSystem (`environment.js`)
**Purpose**: Environmental elements and scenery management

**Key Features**:
- Terrain generation and rendering
- Cloud platform system
- Environmental decorations
- Camera system integration

**Cloud Platform Collision**:
```javascript
checkCloudPlatformCollision() {
    for (let platform of cloudPlatforms) {
        let catLeft = this.cat.x - 40;
        let catRight = this.cat.x + 40;
        let catBottom = this.cat.y + 100;
        
        let platformLeft = platform.x - platform.w / 2;
        let platformRight = platform.x + platform.w / 2;
        let platformTop = platform.y - platform.h / 2;
        
        let horizontalOverlap = catRight > platformLeft && catLeft < platformRight;
        
        if (horizontalOverlap && this.cat.vy >= 0) {
            if (catBottom >= platformTop - 5 && catBottom <= platformTop + 15) {
                this.cat.y = platformTop - 100;
                this.cat.vy = 0;
                return true;
            }
        }
    }
    return false;
}
```

### 5. ScoreSystem (`score_system.js`)
**Purpose**: Scoring, achievements, and progress tracking

**Key Features**:
- Multi-layered scoring system
- Achievement tracking and unlocking
- Statistics collection
- Local storage integration

**Achievement System**:
```javascript
initAchievements() {
    this.achievements = [
        { 
            id: 'first_kill', 
            name: 'First Kill', 
            desc: 'Kill your first mouse', 
            condition: () => this.stats.miceKilled >= 1 
        },
        // ... more achievements
    ];
}

checkAchievements() {
    for (let achievement of this.achievements) {
        if (!achievement.unlocked && achievement.condition()) {
            this.unlockAchievement(achievement);
        }
    }
}
```

### 6. AudioSystem (`audio_system.js`)
**Purpose**: Audio management and sound effects

**Key Features**:
- Background music management
- Sound effect playback
- Dynamic audio based on game state
- Browser compatibility handling

**Audio Management**:
```javascript
class AudioSystem {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
    }
    
    init() {
        try {
            this.backgroundMusic = loadSound('assets/audio/background.mp3');
            this.backgroundMusic.setVolume(this.musicVolume);
            this.backgroundMusic.loop();
        } catch (error) {
            console.log('Audio initialization failed');
        }
    }
    
    onWeatherChange(weatherStatus) {
        if (weatherStatus.isRaining) {
            this.adjustMusicVolume(0.7);
            this.playRainSound();
        }
    }
}
```

## Data Structures

### Character Object
```javascript
this.cat = {
    x: width / 2,           // Horizontal position
    y: floorPos_y,          // Vertical position
    vy: 0,                  // Vertical velocity
    speed: 10,              // Movement speed
    state: "standing",      // Animation state
    direction: "right",     // Facing direction
    isJumping: false,       // Jump state
    isMovingLeft: false,    // Left movement flag
    isMovingRight: false    // Right movement flag
};
```

### Mouse Enemy Object
```javascript
let mouse = {
    x: spawnX,              // Position
    y: floorPos_y,
    alive: true,            // Active state
    aiType: 'patrol',       // AI behavior type
    speed: 1.2,             // Movement speed
    direction: 1,           // Movement direction
    detectionRange: 100,    // Detection radius
    animFrame: 0,           // Animation frame
    isChasing: false,       // Chase state
    minDistanceFromCat: 80  // Minimum safe distance
};
```

### Weather Particle Object
```javascript
let snowParticle = {
    x: random(-200, width + 200),  // Position
    y: random(-200, -50),
    vy: random(12.0, 20.0),        // Vertical velocity
    vx: random(-1.0, 1.0),         // Horizontal velocity
    size: random(2, 5),             // Particle size
    alpha: random(220, 255),        // Transparency
    active: true                    // Active state
};
```

## Algorithms

### 1. Collision Detection Algorithm
```javascript
function checkCollision(obj1, obj2) {
    let dx = obj1.x - obj2.x;
    let dy = obj1.y - obj2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (obj1.radius + obj2.radius);
}
```

### 2. Pathfinding Algorithm (Mouse AI)
```javascript
function calculatePathToTarget(start, target, obstacles) {
    // Simple A* pathfinding implementation
    let openSet = [start];
    let closedSet = [];
    let cameFrom = new Map();
    
    while (openSet.length > 0) {
        let current = getLowestFScore(openSet);
        
        if (current.equals(target)) {
            return reconstructPath(cameFrom, current);
        }
        
        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);
        
        let neighbors = getNeighbors(current, obstacles);
        for (let neighbor of neighbors) {
            if (closedSet.includes(neighbor)) continue;
            
            let tentativeG = current.g + distance(current, neighbor);
            
            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
            } else if (tentativeG >= neighbor.g) {
                continue;
            }
            
            cameFrom.set(neighbor, current);
            neighbor.g = tentativeG;
            neighbor.f = neighbor.g + heuristic(neighbor, target);
        }
    }
    
    return null; // No path found
}
```

### 3. Particle System Update Algorithm
```javascript
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i];
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Apply forces
        particle.vy += gravity;
        particle.vx *= airResistance;
        
        // Update life
        particle.life--;
        particle.alpha = map(particle.life, 0, particle.maxLife, 0, 255);
        
        // Remove dead particles
        if (particle.life <= 0 || particle.alpha <= 0) {
            particles.splice(i, 1);
        }
    }
}
```

## Performance Optimization

### 1. Object Pooling
```javascript
class ParticlePool {
    constructor(maxSize) {
        this.particles = [];
        this.maxSize = maxSize;
        this.activeCount = 0;
        
        // Pre-allocate particles
        for (let i = 0; i < maxSize; i++) {
            this.particles.push(createParticle());
        }
    }
    
    getParticle() {
        for (let particle of this.particles) {
            if (!particle.active) {
                particle.active = true;
                this.activeCount++;
                return particle;
            }
        }
        return null; // Pool exhausted
    }
    
    returnParticle(particle) {
        particle.active = false;
        this.activeCount--;
    }
}
```

### 2. Spatial Partitioning
```javascript
class SpatialGrid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }
    
    getCellKey(x, y) {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }
    
    addObject(obj) {
        let key = this.getCellKey(obj.x, obj.y);
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key).push(obj);
    }
    
    getNearbyObjects(x, y, radius) {
        let nearby = [];
        let cellRadius = Math.ceil(radius / this.cellSize);
        
        for (let dx = -cellRadius; dx <= cellRadius; dx++) {
            for (let dy = -cellRadius; dy <= cellRadius; dy++) {
                let key = this.getCellKey(x + dx * this.cellSize, y + dy * this.cellSize);
                if (this.grid.has(key)) {
                    nearby.push(...this.grid.get(key));
                }
            }
        }
        
        return nearby;
    }
}
```

### 3. Rendering Optimization
```javascript
function optimizedDraw() {
    // Only draw objects within viewport
    let viewport = {
        left: cameraX - 100,
        right: cameraX + width + 100,
        top: -100,
        bottom: height + 100
    };
    
    // Cull objects outside viewport
    let visibleObjects = objects.filter(obj => 
        obj.x > viewport.left && obj.x < viewport.right &&
        obj.y > viewport.top && obj.y < viewport.bottom
    );
    
    // Draw only visible objects
    for (let obj of visibleObjects) {
        obj.draw();
    }
}
```

## Browser Compatibility

### Supported Browsers
- **Chrome**: 80+ (Full support)
- **Firefox**: 75+ (Full support)
- **Safari**: 13+ (Full support)
- **Edge**: 80+ (Full support)

### Feature Detection
```javascript
function checkBrowserSupport() {
    let support = {
        canvas: !!document.createElement('canvas').getContext,
        webAudio: !!(window.AudioContext || window.webkitAudioContext),
        localStorage: typeof(Storage) !== "undefined",
        requestAnimationFrame: !!window.requestAnimationFrame
    };
    
    if (!support.canvas) {
        showError('Canvas not supported');
        return false;
    }
    
    if (!support.webAudio) {
        console.warn('Web Audio not supported, disabling audio');
        disableAudio();
    }
    
    return support;
}
```

### Fallback Mechanisms
```javascript
// Audio fallback
function initAudio() {
    try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioEnabled = true;
    } catch (error) {
        console.log('Audio not supported, continuing without sound');
        this.audioEnabled = false;
    }
}

// Canvas fallback
function initCanvas() {
    let canvas = document.createElement('canvas');
    if (!canvas.getContext) {
        showError('Canvas not supported in this browser');
        return null;
    }
    return canvas;
}
```

## API Reference

### GameController API
```javascript
// Initialize game
let gameController = new GameController();

// Handle input
gameController.handleKeyPress(key);
gameController.handleKeyRelease(key);
gameController.handleMousePressed();

// Game state
gameController.togglePause();
gameController.restartGame();
gameController.gameOver();

// Get game state
let state = gameController.getGameState();
```

### CharacterSystem API
```javascript
// Movement
characterSystem.moveLeft();
characterSystem.moveRight();
characterSystem.stopMoving();
characterSystem.jump();

// Combat
characterSystem.killMouse(mouseIndex);
characterSystem.takeDamage(amount);

// Power-ups
characterSystem.activatePowerUp(type, duration);
characterSystem.updatePowerUps();
```

### WeatherSystem API
```javascript
// Weather control
weatherSystem.toggleNight();
weatherSystem.toggleRain();
weatherSystem.toggleSnow();

// Weather status
let status = weatherSystem.getWeatherStatus();
let remainingTime = weatherSystem.getRemainingTime();

// Debug functions
weatherSystem.debugSnowGrounding();
weatherSystem.debugRainEffects();
```

### ScoreSystem API
```javascript
// Scoring
scoreSystem.addScore(points, reason, x, y);
scoreSystem.killMouse(x, y);
scoreSystem.collectFish(x, y);

// Achievements
scoreSystem.checkAchievements();
scoreSystem.unlockAchievement(achievement);

// Data management
scoreSystem.saveHighScore();
scoreSystem.loadHighScore();
scoreSystem.resetGame();
```

---

*This technical documentation provides comprehensive information about the game's architecture, implementation details, and usage patterns for developers and maintainers.*
