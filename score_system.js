// Score System Module - Manages all scoring, achievements, and statistics
class ScoreSystem {
    constructor() {
        // Core scoring properties
        this.score = 0;                           // Current score
        this.highScore = this.loadHighScore();     // Highest score achieved
        this.level = 1;                            // Current player level
        this.experience = 0;                       // Current experience points
        this.experienceToNext = 100;               // Experience needed for next level

        // Scoring rules configuration
        this.scoreConfig = {
            KILL_MOUSE: 10,                        // Points for killing a mouse
            COLLECT_FISH: 25,                      // Points for collecting fish
            COLLECT_APPLE: 5,                      // Points for collecting apple
            COLLECT_RICE: 15,                      // Points for collecting rice
            SURVIVAL_BONUS: 1,                     // Survival bonus (per second)
            COMBO_MULTIPLIER: 1.5,                 // Combo multiplier factor
            LEVEL_COMPLETE: 100,                   // Level completion bonus
            WEATHER_BONUS: 2,                      // Bad weather survival bonus
            JUMP_BONUS: 1,                         // Jump action bonus
            PERFECT_LANDING: 5                     // Perfect landing bonus
        };

        // Combo system for consecutive actions
        this.combo = 0;                            // Current combo count
        this.maxCombo = 0;                         // Highest combo achieved
        this.comboTimer = 0;                       // Combo timer counter
        this.comboTimeout = 180;                   // Combo reset after 3 seconds of inactivity

        // Achievement system
        this.achievements = [];                     // Array of all available achievements
        this.unlockedAchievements = this.loadAchievements();  // Previously unlocked achievements
        this.initAchievements();                    // Initialize achievement definitions

        // Player statistics tracking
        this.stats = {
            miceKilled: 0,                         // Total mice eliminated
            fishCollected: 0,                      // Total fish collected
            applesCollected: 0,                    // Total apples collected
            riceCollected: 0,                      // Total rice collected
            jumps: 0,                              // Total jumps performed
            distanceTraveled: 0,                   // Total distance moved
            timeAlive: 0,                          // Total survival time
            weatherSurvived: 0,                    // Time survived in bad weather
            perfectLandings: 0,                    // Perfect landings achieved
            gamesPlayed: 0                         // Total games played
        };

        // Load previously saved statistics
        this.loadStats();

        // Visual score popup effects
        this.scorePopups = [];                     // Array of floating score numbers

        // Time tracking for various bonuses
        this.gameStartTime = frameCount;           // Frame when game started
        this.lastSurvivalBonus = 0;                // Last survival bonus given
        this.lastWeatherCheck = 0;                 // Last weather status check

        console.log('Score system initialized');
    }

    // Initialize achievement system with predefined achievements
    initAchievements() {
        this.achievements = [
            // Basic combat achievements
            { id: 'first_kill', name: 'First Kill', desc: 'Kill your first mouse', condition: () => this.stats.miceKilled >= 1, unlocked: false },
            { id: 'mouse_hunter', name: 'Mouse Hunter', desc: 'Kill 10 mice', condition: () => this.stats.miceKilled >= 10, unlocked: false },
            { id: 'mouse_destroyer', name: 'Mouse Destroyer', desc: 'Kill 50 mice', condition: () => this.stats.miceKilled >= 50, unlocked: false },

            // Collection achievements
            { id: 'fish_lover', name: 'Fish Lover', desc: 'Collect 10 fish', condition: () => this.stats.fishCollected >= 10, unlocked: false },
            { id: 'apple_collector', name: 'Apple Collector', desc: 'Collect 20 apples', condition: () => this.stats.applesCollected >= 20, unlocked: false },
            { id: 'rice_master', name: 'Rice Master', desc: 'Collect 15 rice portions', condition: () => this.stats.riceCollected >= 15, unlocked: false },

            // Skill achievements
            { id: 'combo_starter', name: 'Combo Starter', desc: 'Achieve 5x combo', condition: () => this.maxCombo >= 5, unlocked: false },
            { id: 'combo_master', name: 'Combo Master', desc: 'Achieve 20x combo', condition: () => this.maxCombo >= 20, unlocked: false },
            { id: 'perfect_cat', name: 'Perfect Cat', desc: 'Complete 10 perfect landings', condition: () => this.stats.perfectLandings >= 10, unlocked: false },

            // Score achievements
            { id: 'score_100', name: 'Century Club', desc: 'Score 100 points', condition: () => this.score >= 100, unlocked: false },
            { id: 'score_500', name: 'Half Grand', desc: 'Score 500 points', condition: () => this.score >= 500, unlocked: false },
            { id: 'score_1000', name: 'Grand Master', desc: 'Score 1000 points', condition: () => this.score >= 1000, unlocked: false },

            // Survival achievements
            { id: 'survivor_1min', name: 'Survival Rookie', desc: 'Survive for 1 minute', condition: () => this.stats.timeAlive >= 3600, unlocked: false },
            { id: 'survivor_5min', name: 'Survival Expert', desc: 'Survive for 5 minutes', condition: () => this.stats.timeAlive >= 18000, unlocked: false },
            { id: 'weather_warrior', name: 'Weather Warrior', desc: 'Survive 300 seconds in bad weather', condition: () => this.stats.weatherSurvived >= 300, unlocked: false },

            // Level achievements
            { id: 'level_up', name: 'Level Up!', desc: 'Reach level 2', condition: () => this.level >= 2, unlocked: false },
            { id: 'level_5', name: 'Advanced Cat', desc: 'Reach level 5', condition: () => this.level >= 5, unlocked: false },
            { id: 'level_10', name: 'Elite Cat', desc: 'Reach level 10', condition: () => this.level >= 10, unlocked: false }
        ];

        // Check previously unlocked achievements
        for (let achievement of this.achievements) {
            if (this.unlockedAchievements.includes(achievement.id)) {
                achievement.unlocked = true;
            }
        }
    }

    // Add points to the score
    addScore(points, reason = '', x = width / 2, y = height / 2) {
        let actualPoints = points;

        // Apply combo multiplier
        if (this.combo > 1) {
            actualPoints = Math.floor(points * (1 + (this.combo - 1) * 0.1));
        }

        this.score += actualPoints;
        this.experience += actualPoints;

        // Create score popup effect
        this.createScorePopup(actualPoints, reason, x, y);

        // Check for level up
        this.checkLevelUp();

        // Check for achievements
        this.checkAchievements();

        console.log(`+${actualPoints} points (${reason}) Total score: ${this.score}`);
    }

    // Score for killing a mouse
    killMouse(x, y) {
        this.stats.miceKilled++;
        this.addCombo();
        this.addScore(this.scoreConfig.KILL_MOUSE, 'Kill mouse', x, y);
    }

    // Score for collecting items
    collectFish(x, y) {
        this.stats.fishCollected++;
        this.addCombo();
        this.addScore(this.scoreConfig.COLLECT_FISH, 'Collect fish', x, y);
    }

    collectApple(x, y) {
        this.stats.applesCollected++;
        this.addScore(this.scoreConfig.COLLECT_APPLE, 'Collect apple', x, y);
    }

    collectRice(x, y) {
        this.stats.riceCollected++;
        this.addScore(this.scoreConfig.COLLECT_RICE, 'Collect rice', x, y);
    }

    // Score for jumping
    jump() {
        this.stats.jumps++;
        this.addScore(this.scoreConfig.JUMP_BONUS, 'Jump');
    }

    // Score for perfect landing
    perfectLanding(x, y) {
        this.stats.perfectLandings++;
        this.addScore(this.scoreConfig.PERFECT_LANDING, 'Perfect landing', x, y);
    }

    // Score for completing a level
    levelComplete() {
        this.addScore(this.scoreConfig.LEVEL_COMPLETE, 'Level complete bonus');
    }

    // Combo system
    addCombo() {
        this.combo++;
        this.comboTimer = this.comboTimeout;

        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
    }

    resetCombo() {
        this.combo = 0;
        this.comboTimer = 0;
    }

    updateCombo() {
        if (this.comboTimer > 0) {
            this.comboTimer--;
        } else if (this.combo > 0) {
            this.resetCombo();
        }
    }

    // Survival bonus
    updateSurvivalBonus() {
        this.stats.timeAlive = frameCount - this.gameStartTime;

        // Give survival bonus every second
        let currentSecond = Math.floor(this.stats.timeAlive / 60);
        if (currentSecond > this.lastSurvivalBonus) {
            this.addScore(this.scoreConfig.SURVIVAL_BONUS, 'Survival bonus');
            this.lastSurvivalBonus = currentSecond;
        }
    }

    // Weather survival bonus
    updateWeatherBonus(isRaining, isSnowing) {
        if (isRaining || isSnowing) {
            this.stats.weatherSurvived++;

            // Give extra bonus every 30 frames (0.5 seconds) in bad weather
            if (frameCount - this.lastWeatherCheck >= 30) {
                this.addScore(this.scoreConfig.WEATHER_BONUS, 'Weather survival');
                this.lastWeatherCheck = frameCount;
            }
        }
    }

    // Level check
    checkLevelUp() {
        while (this.experience >= this.experienceToNext) {
            this.experience -= this.experienceToNext;
            this.level++;
            this.experienceToNext = Math.floor(this.experienceToNext * 1.2);

            // Level up reward
            this.addScore(this.level * 10, 'Level up reward');

            console.log(`Congratulations! Level ${this.level} achieved!`);
        }
    }

    // Achievement check
    checkAchievements() {
        for (let achievement of this.achievements) {
            if (!achievement.unlocked && achievement.condition()) {
                this.unlockAchievement(achievement);
            }
        }
    }

    // Unlock achievement
    unlockAchievement(achievement) {
        achievement.unlocked = true;
        this.unlockedAchievements.push(achievement.id);
        this.saveAchievements();

        // Achievement reward
        this.addScore(50, `Achievement: ${achievement.name}`);

        console.log(`🏆 Achievement unlocked: ${achievement.name} - ${achievement.desc}`);

        // Create achievement notification
        this.createAchievementNotification(achievement);
    }

    // Create score popup effect
    createScorePopup(points, reason, x, y) {
        this.scorePopups.push({
            points: points,
            reason: reason,
            x: x,
            y: y,
            startY: y,
            alpha: 255,
            life: 120, // 2 seconds
            scale: 1
        });
    }

    // Create achievement notification
    createAchievementNotification(achievement) {
        // You can add visual effects for achievement notifications here
        console.log(`🎉 New achievement unlocked: ${achievement.name}`);
    }

    // Update score popup effects
    updateScorePopups() {
        for (let i = this.scorePopups.length - 1; i >= 0; i--) {
            let popup = this.scorePopups[i];

            popup.life--;
            popup.y -= 1;
            popup.alpha = map(popup.life, 0, 120, 0, 255);
            popup.scale = map(popup.life, 120, 100, 1, 1.2);

            if (popup.life <= 0) {
                this.scorePopups.splice(i, 1);
            }
        }
    }

    // Draw score popup effects
    drawScorePopups() {
        for (let popup of this.scorePopups) {
            push();
            translate(popup.x, popup.y);
            scale(popup.scale);

            fill(255, 255, 0, popup.alpha);
            textAlign(CENTER);
            textSize(16);
            text(`+${popup.points}`, 0, 0);

            if (popup.reason) {
                fill(255, 255, 255, popup.alpha * 0.7);
                textSize(12);
                text(popup.reason, 0, 15);
            }

            pop();
        }
    }

    // Save and load data
    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('gameHighScore', this.highScore.toString());
        }
    }

    loadHighScore() {
        let saved = localStorage.getItem('gameHighScore');
        return saved ? parseInt(saved) : 0;
    }

    saveStats() {
        localStorage.setItem('gameStats', JSON.stringify(this.stats));
    }

    loadStats() {
        let saved = localStorage.getItem('gameStats');
        if (saved) {
            let loadedStats = JSON.parse(saved);
            this.stats = { ...this.stats, ...loadedStats };
        }
    }

    saveAchievements() {
        localStorage.setItem('gameAchievements', JSON.stringify(this.unlockedAchievements));
    }

    loadAchievements() {
        let saved = localStorage.getItem('gameAchievements');
        return saved ? JSON.parse(saved) : [];
    }

    // Called when game ends
    gameOver() {
        this.saveHighScore();
        this.saveStats();
        this.stats.gamesPlayed++;
        console.log('Game over, data saved');
    }

    // Reset game
    resetGame() {
        this.score = 0;
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        this.combo = 0;
        this.comboTimer = 0;
        this.scorePopups = [];
        this.gameStartTime = frameCount;
        this.lastSurvivalBonus = 0;
        this.lastWeatherCheck = 0;
    }

    // Main update function
    update() {
        this.updateCombo();
        this.updateSurvivalBonus();
        this.updateScorePopups();
    }

    // Main draw function
    draw() {
        this.drawScorePopups();
    }

    // Get score information
    getScoreInfo() {
        return {
            score: this.score,
            highScore: this.highScore,
            level: this.level,
            experience: this.experience,
            experienceToNext: this.experienceToNext,
            combo: this.combo,
            maxCombo: this.maxCombo,
            stats: this.stats,
            achievements: this.achievements.filter(a => a.unlocked)
        };
    }

    // Draw detailed UI
    drawDetailedUI(x, y) {
        push();
        fill(0, 150);
        rect(x, y, 250, 200, 10);

        fill(255);
        textAlign(LEFT);
        textSize(16);
        text(`Score: ${this.score}`, x + 10, y + 25);
        text(`High Score: ${this.highScore}`, x + 10, y + 45);
        text(`Level: ${this.level}`, x + 10, y + 65);

        // Experience bar
        fill(100);
        rect(x + 10, y + 75, 200, 10, 5);
        fill(0, 255, 0);
        let expPercent = this.experience / this.experienceToNext;
        rect(x + 10, y + 75, 200 * expPercent, 10, 5);

        text(`Experience: ${this.experience}/${this.experienceToNext}`, x + 10, y + 100);

        if (this.combo > 1) {
            fill(255, 255, 0);
            text(`Combo: ${this.combo}x`, x + 10, y + 120);
        }

        fill(255);
        text(`Kills: ${this.stats.miceKilled}`, x + 10, y + 140);
        text(`Collected: ${this.stats.fishCollected + this.stats.applesCollected + this.stats.riceCollected}`, x + 10, y + 160);
        text(`Achievements: ${this.unlockedAchievements.length}/${this.achievements.length}`, x + 10, y + 180);

        pop();
    }
}
