// Character System Module - Manages player character (cat) and enemies (mice)
class CharacterSystem {
    constructor() {
        // Player character (cat) object with all properties
        this.cat = {
            x: width / 2,               // Horizontal position (center of screen)
            y: floorPos_y,              // Vertical position (on ground level)
            vy: 0,                      // Vertical velocity for jumping/falling
            speed: 5,                   // Horizontal movement speed (reduced from 10)
            state: "standing",          // Current animation state
            direction: "right",         // Facing direction
            isJumping: false,           // Jump state flag
            isMovingLeft: false,        // Left movement flag
            isMovingRight: false        // Right movement flag
        };

        // Enemy management
        this.mice = [];                 // Array of mouse enemies

        // Health and life system
        this.life = 100;                // Current health points
        this.maxLife = 150;             // Maximum health capacity
        this.lives = 3;                 // Number of extra lives remaining

        this.init();
    }

    // Initialize character system
    init() {
        this.spawnMouse(1);             // Spawn initial mouse enemy
    }

    // Update cat's position and physics
    updateCatPosition() {
        // Handle horizontal movement
        if (this.cat.isMovingLeft) {
            this.cat.x -= this.cat.speed;           // Move left
            this.cat.state = "walkingLeft";         // Set walking animation
            this.cat.direction = "left";            // Update facing direction
        } else if (this.cat.isMovingRight) {
            this.cat.x += this.cat.speed;           // Move right
            this.cat.state = "walkingRight";        // Set walking animation
            this.cat.direction = "right";           // Update facing direction
        } else if (this.cat.isJumping) {
            this.cat.state = "jumping";             // Set jumping animation
        } else {
            this.cat.state = "standing";            // Set idle animation
        }

        // Apply gravity and update vertical position
        this.cat.y += this.cat.vy;                  // Update vertical position
        this.cat.vy += 0.5;                         // Apply gravity acceleration (reduced from 0.8)

        // Ground collision detection
        if (this.cat.y > floorPos_y) {
            this.cat.y = floorPos_y;                // Snap to ground level
            this.cat.vy = 0;                        // Stop falling
            this.cat.isJumping = false;             // Reset jump state
        }

        // Boundary constraints (prevent cat from going off-screen)
        this.cat.x = constrain(this.cat.x, 50, worldWidth - 50);
    }

    // Update mouse enemies behavior
    updateMice() {
        // Move each mouse enemy to the right
        for (let m of this.mice) {
            if (!m.alive) continue;                 // Skip dead mice
            m.x += 0.8;                             // Move mouse rightward (reduced from 1.2)
            if (m.x > worldWidth + 100) m.alive = false;  // Remove if off-screen
        }

        // Spawn new mouse every 5 seconds (300 frames at 60fps)
        if (frameCount % 300 === 0) {
            this.spawnMouse(1);
        }
    }

    // Create new mouse enemies
    spawnMouse(num = 1) {
        for (let i = 0; i < num; i++) {
            this.mice.push({
                x: -60 - i * 20,        // Start off-screen left with spacing
                y: floorPos_y,          // Place on ground level
                alive: true             // Set as active
            });
        }
    }

    // Make cat jump
    jump() {
        // Only allow jumping when on ground
        if (this.cat.y === floorPos_y) {
            this.cat.vy = -12;                      // Apply upward velocity (reduced from -18)
            this.cat.isJumping = true;              // Set jump state
        }
    }

    // Start moving left
    moveLeft() {
        this.cat.isMovingLeft = true;               // Enable left movement
        this.cat.isMovingRight = false;             // Disable right movement
    }

    // Start moving right
    moveRight() {
        this.cat.isMovingRight = true;              // Enable right movement
        this.cat.isMovingLeft = false;              // Disable left movement
    }

    // Stop all movement
    stopMoving() {
        this.cat.isMovingLeft = false;              // Disable left movement
        this.cat.isMovingRight = false;             // Disable right movement
    }

    // Main update method called each frame
    update() {
        this.updateCatPosition();                   // Update cat physics
        this.updateMice();                          // Update enemy behavior
    }

    // Main draw method called each frame
    draw() {
        this.drawCat();                             // Render cat character
        this.drawMice();                            // Render mouse enemies
    }

    // Render cat character
    drawCat() {
        push();                                     // Save current drawing state
        translate(this.cat.x, this.cat.y);          // Move to cat position

        // Draw cat body (simple ellipse representation)
        fill(50);                                   // Dark gray color
        ellipse(0, 50, 80, 100);                   // Body (lower ellipse)
        ellipse(0, 0, 80, 80);                     // Head (upper ellipse)

        pop();                                      // Restore drawing state
    }

    // Render mouse enemies
    drawMice() {
        fill(100);                                  // Medium gray color
        for (let m of this.mice) {
            if (!m.alive) continue;                 // Skip dead mice
            ellipse(m.x, m.y, 10, 5);              // Draw mouse as small ellipse
        }
    }
}
