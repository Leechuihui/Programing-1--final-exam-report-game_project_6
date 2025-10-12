// Environment System Module - Manages all environmental elements and scenery
class EnvironmentSystem {
    constructor() {
        // Environmental object arrays
        this.trees = [];                // Array of tree objects for forest scenery
        this.clouds = [];               // Array of cloud objects for sky
        this.birds = [];                // Array of bird objects for wildlife
        this.bushes = [];               // Array of bush objects for ground vegetation
        this.riverPoints = [];          // Array of river path points for water rendering
        this.cloudPlatforms = [];       // Array of cloud platforms for gameplay

        this.init();
    }

    // Initialize all environment components
    init() {
        this.createTrees();             // Generate forest trees
        this.createClouds();            // Create sky clouds
        this.createBirds();             // Spawn flying birds
        this.createBushes();            // Generate ground bushes
        this.createRiver();             // Create river path
        this.createCloudPlatforms();    // Build cloud platforms
    }

    // Generate forest trees with natural spacing
    createTrees() {
        this.trees = [];
        let lastX = 0;                  // Track last tree position
        let tryCount = 0;               // Prevent infinite loops

        // Create 16 trees with natural spacing
        while (this.trees.length < 16 && tryCount < 1000) {
            let x = random(lastX + 80, lastX + 220);    // Random spacing between trees
            let h = random(120, 260);                    // Random tree height

            // Avoid placing trees too close to screen edges
            if (x > width - 100 && x < width + 400) {
                tryCount++;
                continue;
            }

            this.trees.push({ x: x, y: floorPos_y - h, h: h });  // Add tree object
            lastX = x;                  // Update last tree position
            tryCount++;
        }
    }

    // Create sky clouds with different properties
    createClouds() {
        this.clouds = [];
        // Add three clouds with different positions, sizes, and speeds
        this.clouds.push({ x: -200, y: 80, size: 100, speed: 0.5 });    // Left cloud
        this.clouds.push({ x: 400, y: 120, size: 90, speed: 0.3 });     // Middle cloud
        this.clouds.push({ x: 800, y: 150, size: 110, speed: 0.7 });    // Right cloud
    }

    // Generate flying birds for wildlife atmosphere
    createBirds() {
        this.birds = [];
        for (let i = 0; i < 10; i++) {
            this.birds.push({
                x: random(worldWidth),              // Random horizontal position
                y: random(100, 200),                // Random height in sky
                speed: random(1, 3),                // Random flight speed
                wingPhase: random(0, TWO_PI)        // Random wing animation phase
            });
        }
    }

    // Create ground vegetation (bushes)
    createBushes() {
        this.bushes = [];
        for (let i = 0; i < 20; i++) {
            this.bushes.push({
                x: random(worldWidth),              // Random horizontal position
                y: floorPos_y - 10,                 // Slightly above ground
                size: random(40, 80)                // Random bush size
            });
        }
    }

    // Generate river path using interpolation
    createRiver() {
        this.riverPoints = [];
        let startX = -100;                          // River start (off-screen left)
        let startY = floorPos_y - 50;               // River top edge
        let endX = worldWidth + 200;                // River end (off-screen right)
        let endY = floorPos_y + 100;                // River bottom edge

        // Create smooth river path using linear interpolation
        for (let t = 0; t <= 1; t += 0.005) {
            let x = lerp(startX, endX, t);          // Interpolate X position
            let y = lerp(startY, endY, t);          // Interpolate Y position
            this.riverPoints.push(createVector(x, y));  // Add point to river path
        }
    }

    // Create cloud platforms for gameplay mechanics
    createCloudPlatforms() {
        this.cloudPlatforms = [];
        const baseY = floorPos_y - 140;             // Base height for platforms
        const startX = width - 140;                 // Starting X position
        const step = 180;                           // Spacing between platforms

        // Create 10 cloud platforms in a sequence
        for (let i = 0; i < 10; i++) {
            const px = startX + i * step;           // Calculate X position
            const py = baseY + (i % 2 === 0 ? 0 : -36);  // Alternate heights for variety

            this.cloudPlatforms.push({
                baseX: px,                          // Original X position
                x: px,                              // Current X position (for moving platforms)
                y: py,                              // Y position
                w: 140,                             // Platform width
                h: 24,                              // Platform height
                type: 'static',                     // Platform type (static/moving)
                frozen: false                       // Freeze state for weather effects
            });
        }
    }

    // Update cloud platform positions (for moving platforms)
    updateCloudPlatforms() {
        for (let i = 0; i < this.cloudPlatforms.length; i++) {
            const p = this.cloudPlatforms[i];
            // Only update moving platforms that aren't frozen
            if (p.type === 'moving' && !p.frozen) {
                // Use sine wave for smooth back-and-forth movement
                p.x = p.baseX + sin(frameCount * 0.02) * 100;
            }
        }
    }

    // Draw mountain background
    drawMountains() {
        noStroke();                                 // No outline
        fill(60, 70, 90);                          // Dark blue-gray color
        rect(0, floorPos_y - 300, worldWidth, 300);  // Mountain range rectangle
    }

    // Render and animate sky clouds
    drawClouds() {
        for (let cloud of this.clouds) {
            cloud.x += cloud.speed;                 // Move cloud horizontally

            // Reset cloud position when it goes off-screen
            if (cloud.x > worldWidth + cloud.size) {
                cloud.x = -cloud.size;
            }

            // Only draw clouds that are visible on screen
            if (cloud.x + cloud.size > cameraX && cloud.x - cloud.size < cameraX + width) {
                push();                             // Save drawing state
                fill(255);                          // White color for clouds
                noStroke();                         // No outline
                ellipse(cloud.x, cloud.y, cloud.size);  // Draw cloud as circle
                pop();                              // Restore drawing state
            }
        }
    }

    // Render river water
    drawRiver() {
        noStroke();                                 // No outline
        fill(65, 105, 225);                        // Blue color for water
        rect(0, floorPos_y - 50, worldWidth, 120);  // River rectangle
    }

    // Render forest trees
    drawTrees() {
        fill(34, 139, 34);                         // Forest green color
        for (let tree of this.trees) {
            // Only draw trees that are visible on screen
            if (tree.x + 100 > cameraX && tree.x - 100 < cameraX + width) {
                rect(tree.x, tree.y, 20, tree.h);   // Draw tree as rectangle
            }
        }
    }

    // Render ground bushes
    drawBushes() {
        fill(34, 139, 34);                         // Forest green color
        for (let bush of this.bushes) {
            ellipse(bush.x, bush.y, bush.size, bush.size / 2);  // Draw bush as ellipse
        }
    }

    // Render cloud platforms
    drawCloudPlatforms() {
        for (let i = 0; i < this.cloudPlatforms.length; i++) {
            const p = this.cloudPlatforms[i];
            // Skip platforms that are far off-screen
            if (p.x + p.w < cameraX - 80 || p.x - p.w > cameraX + width + 80) continue;

            push();                                 // Save drawing state
            translate(p.x, p.y);                    // Move to platform position
            noStroke();                             // No outline
            fill(240);                              // Light gray color
            ellipse(0, 0, p.w * 0.6, p.h);         // Draw platform as ellipse
            pop();                                  // Restore drawing state
        }
    }

    // Main update method called each frame
    update() {
        this.updateCloudPlatforms();                // Update moving platforms
    }

    // Main draw method called each frame
    draw() {
        this.drawMountains();                       // Draw background mountains
        this.drawClouds();                          // Render sky clouds
        this.drawRiver();                           // Draw water
        this.drawCloudPlatforms();                  // Render platforms
        this.drawTrees();                           // Draw forest
        this.drawBushes();                          // Render vegetation
    }
}
