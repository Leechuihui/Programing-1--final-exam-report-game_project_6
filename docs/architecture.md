# Architecture Design - Black Cat Granary Saga: Dream Prologue

## Table of Contents
1. [System Overview](#system-overview)
2. [Architectural Patterns](#architectural-patterns)
3. [Module Dependencies](#module-dependencies)
4. [Data Flow](#data-flow)
5. [Event System](#event-system)
6. [Rendering Pipeline](#rendering-pipeline)
7. [Memory Management](#memory-management)

## System Overview

### High-Level Architecture
The game follows a **modular, event-driven architecture** with clear separation of concerns. Each module is responsible for specific functionality and communicates through well-defined interfaces.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │    HTML     │  │    CSS      │  │   Canvas    │  │  Audio  │ │
│  │  Structure  │  │   Styling   │  │  Rendering  │  │ Output  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    GameController                           │ │
│  │              (Main Coordinator & State Manager)             │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                         Domain Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ Character   │  │ Environment │  │   Weather   │  │  Score  │ │
│  │   System    │  │   System    │  │   System    │  │ System  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        Infrastructure Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   p5.js     │  │  p5.sound   │  │  Browser    │  │  Local  │ │
│  │  Framework  │  │   Library   │  │    APIs     │  │ Storage │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Architectural Patterns

### 1. Module Pattern
Each system is encapsulated as a self-contained module with a clear public interface.

```javascript
// Example: CharacterSystem Module
class CharacterSystem {
    constructor() {
        // Private properties
        this.cat = { /* ... */ };
        this.mice = [];
        this.life = 100;
    }
    
    // Public interface
    update() { /* ... */ }
    draw() { /* ... */ }
    jump() { /* ... */ }
    moveLeft() { /* ... */ }
    moveRight() { /* ... */ }
}
```

### 2. Observer Pattern
Systems communicate through events and callbacks, maintaining loose coupling.

```javascript
// Event system implementation
class EventSystem {
    constructor() {
        this.listeners = new Map();
    }
    
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
}
```

### 3. State Machine Pattern
Game states are managed through a finite state machine.

```javascript
class GameStateMachine {
    constructor() {
        this.currentState = 'playing';
        this.states = {
            'playing': new PlayingState(),
            'paused': new PausedState(),
            'gameOver': new GameOverState(),
            'levelComplete': new LevelCompleteState()
        };
    }
    
    transitionTo(newState) {
        this.states[this.currentState].exit();
        this.currentState = newState;
        this.states[this.currentState].enter();
    }
}
```

### 4. Object Pool Pattern
Efficient memory management for frequently created/destroyed objects.

```javascript
class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        
        // Pre-populate pool
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }
    
    get() {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        return this.createFn();
    }
    
    release(obj) {
        this.resetFn(obj);
        this.pool.push(obj);
    }
}
```

## Module Dependencies

### Dependency Graph
```
GameController
├── CharacterSystem
│   ├── PhysicsEngine
│   ├── AISystem
│   └── PowerUpSystem
├── EnvironmentSystem
│   ├── TerrainGenerator
│   ├── CloudPlatformSystem
│   └── CameraSystem
├── WeatherSystem
│   ├── ParticleSystem
│   ├── DayNightCycle
│   └── GroundSnowSystem
├── ScoreSystem
│   ├── AchievementSystem
│   ├── StatisticsTracker
│   └── LocalStorageManager
└── AudioSystem
    ├── MusicManager
    ├── SoundEffectManager
    └── AudioContextManager
```

### Dependency Injection
```javascript
class GameController {
    constructor() {
        // Create systems with dependency injection
        this.audioSystem = new AudioSystem();
        this.scoreSystem = new ScoreSystem();
        this.weatherSystem = new WeatherSystem();
        this.environmentSystem = new EnvironmentSystem();
        this.characterSystem = new CharacterSystem();
        
        // Inject dependencies
        this.characterSystem.setAudioSystem(this.audioSystem);
        this.characterSystem.setScoreSystem(this.scoreSystem);
        this.weatherSystem.setAudioSystem(this.audioSystem);
    }
}
```

## Data Flow

### Update Cycle
```
1. Input Events
   ↓
2. GameController.handleInput()
   ↓
3. System Updates (in order)
   ├── WeatherSystem.update()
   ├── EnvironmentSystem.update()
   ├── CharacterSystem.update()
   └── ScoreSystem.update()
   ↓
4. Rendering Pipeline
   ├── Background rendering
   ├── Environment rendering
   ├── Weather effects
   ├── Character rendering
   └── UI rendering
   ↓
5. Audio Updates
   └── AudioSystem.update()
```

### Data Flow Diagram
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Input     │───▶│ GameController│───▶│   Systems   │
│  Events     │    │              │    │  (Update)   │
└─────────────┘    └─────────────┘    └─────────────┘
                           │                   │
                           ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐
                   │   Render    │    │   Audio     │
                   │  Pipeline   │    │  Updates    │
                   └─────────────┘    └─────────────┘
```

## Event System

### Event Types
```javascript
const GameEvents = {
    // Character events
    CHARACTER_JUMP: 'character:jump',
    CHARACTER_MOVE: 'character:move',
    CHARACTER_DAMAGE: 'character:damage',
    CHARACTER_POWERUP: 'character:powerup',
    
    // Game state events
    GAME_PAUSE: 'game:pause',
    GAME_RESUME: 'game:resume',
    GAME_OVER: 'game:over',
    LEVEL_COMPLETE: 'level:complete',
    
    // Weather events
    WEATHER_CHANGE: 'weather:change',
    SNOW_START: 'weather:snow:start',
    SNOW_STOP: 'weather:snow:stop',
    
    // Score events
    SCORE_UPDATE: 'score:update',
    ACHIEVEMENT_UNLOCK: 'achievement:unlock',
    
    // Audio events
    AUDIO_PLAY: 'audio:play',
    AUDIO_STOP: 'audio:stop',
    AUDIO_VOLUME_CHANGE: 'audio:volume:change'
};
```

### Event Handling
```javascript
class EventManager {
    constructor() {
        this.events = new Map();
    }
    
    subscribe(event, callback, context = null) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        
        this.events.get(event).push({
            callback: callback,
            context: context
        });
    }
    
    publish(event, data = null) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(listener => {
                if (listener.context) {
                    listener.callback.call(listener.context, data);
                } else {
                    listener.callback(data);
                }
            });
        }
    }
    
    unsubscribe(event, callback) {
        if (this.events.has(event)) {
            let listeners = this.events.get(event);
            let index = listeners.findIndex(l => l.callback === callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }
}
```

## Rendering Pipeline

### Rendering Order
```
1. Background Layer
   ├── Sky gradient
   ├── Mountains
   └── Stars (night mode)

2. Environment Layer
   ├── Trees
   ├── Clouds
   ├── River
   └── Cloud platforms

3. Weather Layer
   ├── Rain particles
   ├── Snow particles
   └── Ground snow

4. Character Layer
   ├── Mice enemies
   ├── Collectible items
   └── Main character (cat)

5. Effects Layer
   ├── Particle effects
   ├── Power-up effects
   └── Lightning effects

6. UI Layer
   ├── Score display
   ├── Health indicators
   ├── Achievement notifications
   └── Game state overlays
```

### Rendering Optimization
```javascript
class RenderManager {
    constructor() {
        this.layers = [];
        this.camera = { x: 0, y: 0 };
        this.viewport = { width: 0, height: 0 };
    }
    
    addLayer(layer) {
        this.layers.push(layer);
    }
    
    render() {
        // Clear canvas
        clear();
        
        // Apply camera transformation
        push();
        translate(-this.camera.x, -this.camera.y);
        
        // Render each layer
        for (let layer of this.layers) {
            layer.render();
        }
        
        pop();
        
        // Render UI (not affected by camera)
        this.renderUI();
    }
    
    cullObjects(objects, viewport) {
        return objects.filter(obj => 
            obj.x > viewport.left && obj.x < viewport.right &&
            obj.y > viewport.top && obj.y < viewport.bottom
        );
    }
}
```

## Memory Management

### Object Pooling Strategy
```javascript
class MemoryManager {
    constructor() {
        this.pools = new Map();
        this.maxPoolSize = 100;
    }
    
    createPool(name, createFn, resetFn) {
        this.pools.set(name, new ObjectPool(createFn, resetFn));
    }
    
    getObject(poolName) {
        let pool = this.pools.get(poolName);
        return pool ? pool.get() : null;
    }
    
    releaseObject(poolName, obj) {
        let pool = this.pools.get(poolName);
        if (pool) {
            pool.release(obj);
        }
    }
    
    cleanup() {
        for (let [name, pool] of this.pools) {
            if (pool.size > this.maxPoolSize) {
                pool.trim(this.maxPoolSize);
            }
        }
    }
}
```

### Garbage Collection Optimization
```javascript
class GCOptimizer {
    constructor() {
        this.cleanupInterval = 1000; // 1 second
        this.lastCleanup = 0;
    }
    
    update() {
        let now = Date.now();
        if (now - this.lastCleanup > this.cleanupInterval) {
            this.performCleanup();
            this.lastCleanup = now;
        }
    }
    
    performCleanup() {
        // Remove inactive particles
        this.cleanupParticles();
        
        // Remove off-screen objects
        this.cleanupOffScreenObjects();
        
        // Trim object pools
        this.trimObjectPools();
    }
    
    cleanupParticles() {
        for (let system of this.particleSystems) {
            system.particles = system.particles.filter(p => p.active);
        }
    }
}
```

## Performance Considerations

### Frame Rate Management
```javascript
class PerformanceManager {
    constructor() {
        this.targetFPS = 60;
        this.frameTime = 1000 / this.targetFPS;
        this.lastFrameTime = 0;
        this.deltaTime = 0;
    }
    
    update() {
        let currentTime = Date.now();
        this.deltaTime = currentTime - this.lastFrameTime;
        
        if (this.deltaTime >= this.frameTime) {
            this.lastFrameTime = currentTime;
            return true; // Ready for next frame
        }
        
        return false; // Skip this frame
    }
    
    getDeltaTime() {
        return this.deltaTime / 1000; // Convert to seconds
    }
}
```

### LOD (Level of Detail) System
```javascript
class LODManager {
    constructor() {
        this.distanceLevels = [100, 200, 400]; // Distance thresholds
        this.detailLevels = ['high', 'medium', 'low'];
    }
    
    getDetailLevel(distance) {
        for (let i = 0; i < this.distanceLevels.length; i++) {
            if (distance <= this.distanceLevels[i]) {
                return this.detailLevels[i];
            }
        }
        return 'low';
    }
    
    renderObject(obj, distance) {
        let detailLevel = this.getDetailLevel(distance);
        
        switch (detailLevel) {
            case 'high':
                obj.renderFullDetail();
                break;
            case 'medium':
                obj.renderMediumDetail();
                break;
            case 'low':
                obj.renderLowDetail();
                break;
        }
    }
}
```

## Security Considerations

### Input Validation
```javascript
class InputValidator {
    static validateKey(key) {
        const allowedKeys = [
            ' ', 'a', 'A', 'd', 'D', 'w', 'W', 's', 'S',
            'p', 'P', 'r', 'R', 'm', 'M', 'n', 'N', 'g', 'G'
        ];
        return allowedKeys.includes(key);
    }
    
    static validatePosition(x, y) {
        return typeof x === 'number' && typeof y === 'number' &&
               !isNaN(x) && !isNaN(y) &&
               x >= 0 && y >= 0;
    }
}
```

### Data Sanitization
```javascript
class DataSanitizer {
    static sanitizeScore(score) {
        return Math.max(0, Math.min(score, 999999)); // Clamp between 0 and 999999
    }
    
    static sanitizeString(str) {
        return str.replace(/[<>\"'&]/g, ''); // Remove potentially dangerous characters
    }
}
```

---

*This architecture document provides a comprehensive overview of the game's design patterns, module organization, and technical implementation details for maintainability and future development.*
