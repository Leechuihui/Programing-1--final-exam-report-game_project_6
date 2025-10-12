// Weather System Module - Handles all weather-related effects and transitions
class WeatherSystem {
    constructor() {
        // Weather state flags
        this.isNight = false;           // Current time of day (night/day)
        this.isRaining = false;         // Rain weather state
        this.isSnowing = false;         // Snow weather state

        // Particle arrays for visual effects
        this.raindrops = [];            // Array of rain particle objects
        this.snowParticles = [];        // Array of snow particle objects
        this.stars = [];                // Array of star objects for night sky
        this.meteors = [];              // Array of meteor objects for night sky

        // Meteor timing control
        this.meteorInterval = 1800 + Math.floor(Math.random() * 900);  // Random interval between meteors (30-45 seconds)
        this.lastMeteorFrame = -2000;   // Last frame when meteor was spawned

        // Auto weather switching timer
        this.weatherInterval = null;    // Interval timer for automatic weather changes

        // Configuration object for weather parameters
        this.config = {
            SWITCH_INTERVAL: 15000,     // Weather change interval in milliseconds (15 seconds)
            MAX_RAINDROPS: 400,         // Maximum number of rain particles
            MAX_SNOW: 200               // Maximum number of snow particles
        };

        this.init();
    }

    // Initialize weather system components
    init() {
        // Create meteor objects for night sky effects
        for (let i = 0; i < 1; i++) {
            this.meteors.push({
                x: random(width),                    // Random horizontal position
                y: random(0, 200),                   // Random vertical position in upper area
                speed: random(10, 18),               // Random fall speed
                active: false,                       // Whether meteor is currently falling
                timer: floor(random(200, 800))       // Random timer for activation
            });
        }

        // Generate static snow positions for ground accumulation
        this.generateStaticSnow();

        // Start automatic weather switching system
        this.startAutoWeatherSwitch();
    }

    // Start automatic weather switching timer
    startAutoWeatherSwitch() {
        // Prevent multiple timers from being created
        if (!window._weatherIntervalSet) {
            this.weatherInterval = setInterval(() => {
                this.switchWeather();
            }, this.config.SWITCH_INTERVAL);
            window._weatherIntervalSet = true;
        }
    }

    // Switch to a new random weather state
    switchWeather() {
        // Randomly choose day or night
        this.isNight = random([true, false]);

        // Randomly choose weather type: rain, snow, or clear
        let weatherType = random(["rain", "snow", "none"]);
        this.isRaining = (weatherType === "rain");
        this.isSnowing = (weatherType === "snow");

        // Handle night-specific effects
        if (this.isNight) {
            this.createStars();                     // Create star field
            for (let m of this.meteors) m.active = false;  // Reset meteor states
        } else {
            this.stars = [];                        // Clear stars during day
            for (let m of this.meteors) m.active = false;  // Reset meteor states
        }

        // Clear all weather particles for new weather
        this.raindrops = [];
        this.snowParticles = [];
    }

    // Create star field for night sky
    createStars() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: random(worldWidth),              // Random horizontal position across world
                y: random(height / 2),              // Random vertical position in upper half
                brightness: random(150, 255),       // Random brightness level
                size: random(2, 7),                 // Random star size
                flicker: random(0.01, 0.05)        // Random flicker intensity
            });
        }
    }

    // Generate static snow positions for ground accumulation effect
    generateStaticSnow() {
        // Predefined X positions for snow accumulation
        this.snowX = [370, 400, 430, 460, 500, 540, 570, 600];

        // Y positions with random variation for natural look
        this.snowY = [
            floorPos_y - 230 + random(-6, 6),      // Snow height with random variation
            floorPos_y - 250 + random(-8, 8),
            floorPos_y - 270 + random(-10, 10),
            floorPos_y - 290 + random(-12, 12),
            floorPos_y - 280 + random(-10, 10),
            floorPos_y - 260 + random(-8, 8),
            floorPos_y - 245 + random(-6, 6),
            floorPos_y - 235 + random(-5, 5)
        ];
    }

    // Update all weather effects (called each frame)
    update() {
        this.updateRain();      // Update rain particle physics
        this.updateSnow();      // Update snow particle physics
        this.updateMeteors();   // Update meteor animations
    }

    // Draw all weather effects (called each frame)
    draw() {
        this.drawRain();        // Render rain particles
        this.drawSnow();        // Render snow particles
        this.drawStars();       // Render star field
        this.drawMeteors();     // Render meteor trails
    }

    // Toggle methods for manual weather control
    toggleNight() { this.isNight = !this.isNight; }     // Switch between day/night
    toggleRain() { this.isRaining = !this.isRaining; }  // Toggle rain on/off
    toggleSnow() { this.isSnowing = !this.isSnowing; }  // Toggle snow on/off
}
