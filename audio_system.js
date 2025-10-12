// Audio System Module - Handles all game audio including music, sound effects, and environmental sounds
class AudioSystem {
    constructor() {
        // Audio storage and management
        this.sounds = {};                           // Dictionary of sound effect objects
        this.music = null;                          // Background music object
        this.enabled = true;                        // Master audio switch

        // Volume control for different audio types
        this.volume = {
            master: 0.5,                            // Master volume (affects all audio)
            music: 0.3,                             // Background music volume
            sfx: 0.8,                               // Sound effects volume
            frog: 0.1,                              // Frog sound volume (lower for ambient)
            rain: 0.6                               // Rain sound volume
        };

        // System state tracking
        this.isInitialized = false;                 // Whether audio system has been initialized
        this.loadingComplete = false;               // Whether all audio files have loaded

        // Current environmental sound states
        this.currentEnvironmentSounds = {
            rain: false,                            // Rain sound playing status
            frog: false                             // Frog sound playing status
        };

        // Weather state tracking for audio changes
        this.lastWeatherStatus = null;              // Previous weather state for comparison

        console.log('Audio system initializing...');
    }

    // Preload all audio files before game starts
    preloadSounds() {
        try {
            // Check if p5.sound library is available
            if (typeof loadSound !== 'undefined') {
                this.loadExistingSounds();
            } else {
                console.log('p5.sound library not loaded, audio disabled');
                this.enabled = false;
            }
        } catch (error) {
            console.log('Audio file loading failed, using silent mode:', error);
            this.enabled = false;
        }
    }

    // Load audio files from asset directories
    loadExistingSounds() {
        try {
            // Load background music if available
            if (this.fileExists('assets/audio/background.mp3')) {
                this.music = loadSound('assets/audio/background.mp3',
                    () => console.log('Background music loaded successfully'),
                    () => console.log('Background music loading failed')
                );
            }

            // Load rain sound effect
            if (this.fileExists('asset/rain.mp3')) {
                this.sounds.rain = loadSound('asset/rain.mp3',
                    () => console.log('Rain sound loaded successfully'),
                    () => console.log('Rain sound loading failed')
                );
            }

            // Load frog sound effect
            if (this.fileExists('asset/frog.mp3')) {
                this.sounds.frog = loadSound('asset/frog.mp3',
                    () => console.log('Frog sound loaded successfully'),
                    () => console.log('Frog sound loading failed')
                );
            }

            // Create programmatic sound effects as fallback
            this.createProgrammaticSounds();

        } catch (error) {
            console.log('Audio loading process error:', error);
            this.createProgrammaticSounds();
        }
    }

    // Simple file existence check (assumes files exist)
    fileExists(path) {
        try {
            return true;                             // Assume file exists, handle errors during loading
        } catch {
            return false;
        }
    }

    // Create procedural sound effects using p5.sound
    createProgrammaticSounds() {
        if (typeof p5 === 'undefined') {
            console.log('p5.js not loaded, cannot create programmatic sounds');
            return;
        }

        try {
            // Create simple tone-based sound effects
            this.sounds.jump = this.createTone(440, 0.1);                    // A4 note for jump
            this.sounds.collect = this.createTone(880, 0.2);                 // A5 note for collection
            this.sounds.hit = this.createTone(220, 0.3);                     // A3 note for hits
            this.sounds.achievement = this.createChord([523, 659, 784], 0.5); // C major chord for achievements

            console.log('Programmatic sounds created successfully');
        } catch (error) {
            console.log('Programmatic sound creation failed:', error);
        }
    }

    // Create a single tone sound effect
    createTone(frequency, duration) {
        try {
            if (typeof p5.Oscillator !== 'undefined') {
                return {
                    frequency: frequency,            // Sound frequency in Hz
                    duration: duration,              // Sound duration in seconds
                    play: () => {
                        if (!this.enabled) return;  // Skip if audio disabled

                        // Create oscillator for tone generation
                        let osc = new p5.Oscillator('sine');
                        osc.freq(frequency);         // Set frequency
                        osc.amp(0.3 * this.volume.sfx * this.volume.master);  // Set amplitude
                        osc.start();                 // Begin sound
                        setTimeout(() => osc.stop(), duration * 1000);  // Stop after duration
                    }
                };
            }
        } catch (error) {
            console.log('Tone creation failed:', error);
        }
        return { play: () => { } };                 // Return empty function as fallback
    }

    // Create a chord sound effect (multiple frequencies)
    createChord(frequencies, duration) {
        try {
            return {
                frequencies: frequencies,            // Array of frequencies for chord
                duration: duration,                  // Chord duration in seconds
                play: () => {
                    if (!this.enabled) return;      // Skip if audio disabled

                    // Play each frequency with slight delay for chord effect
                    frequencies.forEach((freq, index) => {
                        setTimeout(() => {
                            if (typeof p5.Oscillator !== 'undefined') {
                                let osc = new p5.Oscillator('sine');
                                osc.freq(freq);      // Set frequency
                                osc.amp(0.2 * this.volume.sfx * this.volume.master);  // Set amplitude
                                osc.start();         // Begin sound
                                setTimeout(() => osc.stop(), duration * 1000);  // Stop after duration
                            }
                        }, index * 50);             // 50ms delay between notes
                    });
                }
            };
        } catch (error) {
            console.log('Chord creation failed:', error);
        }
        return { play: () => { } };                 // Return empty function as fallback
    }

    // Initialize the audio system
    init() {
        if (this.isInitialized) return;             // Prevent double initialization

        this.preloadSounds();                       // Load all audio files
        this.isInitialized = true;                  // Mark as initialized

        console.log('Audio system initialization complete, status:', this.enabled ? 'enabled' : 'disabled');
    }

    // Play a sound effect by name
    playSound(name, loop = false) {
        if (!this.enabled || !this.sounds[name]) return;  // Skip if disabled or sound not found

        try {
            if (this.sounds[name].play) {
                // Programmatic sound effect
                this.sounds[name].play();
            } else if (this.sounds[name].setVolume) {
                // p5.sound object - set volume based on sound type
                let volumeLevel;
                if (name === 'frog') {
                    volumeLevel = this.volume.frog * this.volume.master;
                    console.log(`🐸 Frog sound volume set to: ${volumeLevel.toFixed(2)}`);
                } else if (name === 'rain') {
                    volumeLevel = this.volume.rain * this.volume.master;
                    console.log(`🌧️ Rain sound volume set to: ${volumeLevel.toFixed(2)}`);
                } else {
                    volumeLevel = this.volume.sfx * this.volume.master;
                }

                this.sounds[name].setVolume(volumeLevel);

                // Skip if already playing and loop requested
                if (loop && this.sounds[name].isPlaying && this.sounds[name].isPlaying()) {
                    return;
                }

                // Play with or without loop
                if (loop) {
                    this.sounds[name].loop();
                } else {
                    this.sounds[name].play();
                }
            }
        } catch (error) {
            console.log(`Sound playback failed (${name}):`, error);
        }
    }

    // Play background music
    playMusic() {
        if (!this.enabled || !this.music) return;   // Skip if disabled or no music

        try {
            if (this.music.setVolume) {
                this.music.setVolume(this.volume.music * this.volume.master);  // Set music volume
                if (!this.music.isPlaying()) {
                    this.music.loop();               // Start looping if not playing
                }
            }
        } catch (error) {
            console.log('Background music playback failed:', error);
        }
    }

    // Stop background music
    stopMusic() {
        if (!this.enabled || !this.music) return;   // Skip if disabled or no music

        try {
            if (this.music.stop) {
                this.music.stop();                   // Stop music playback
            }
        } catch (error) {
            console.log('Background music stop failed:', error);
        }
    }

    // Set volume for specific audio type
    setVolume(type, value) {
        if (this.volume[type] !== undefined) {
            this.volume[type] = constrain(value, 0, 1);  // Clamp volume between 0 and 1
            console.log(`${type} volume set to: ${this.volume[type]}`);

            // Update volume immediately if currently playing
            if (type === 'frog' && this.sounds.frog && this.sounds.frog.isPlaying && this.sounds.frog.isPlaying()) {
                this.sounds.frog.setVolume(this.volume.frog * this.volume.master);
                console.log(`🐸 Frog sound volume updated in real-time to: ${(this.volume.frog * this.volume.master).toFixed(2)}`);
            }
            if (type === 'rain' && this.sounds.rain && this.sounds.rain.isPlaying && this.sounds.rain.isPlaying()) {
                this.sounds.rain.setVolume(this.volume.rain * this.volume.master);
                console.log(`🌧️ Rain sound volume updated in real-time to: ${(this.volume.rain * this.volume.master).toFixed(2)}`);
            }
        }
    }

    // Convenience method for setting frog sound volume
    setFrogVolume(value) {
        this.setVolume('frog', value);
    }

    // Convenience method for setting rain sound volume
    setRainVolume(value) {
        this.setVolume('rain', value);
    }

    // Toggle audio system on/off
    toggle() {
        this.enabled = !this.enabled;               // Flip enabled state
        console.log('Audio system:', this.enabled ? 'enabled' : 'disabled');

        if (!this.enabled) {
            this.stopMusic();                        // Stop music when disabled
        } else {
            this.playMusic();                        // Resume music when enabled
        }
    }

    // Get current audio system status
    getStatus() {
        return {
            enabled: this.enabled,                   // Master audio state
            isInitialized: this.isInitialized,       // Initialization status
            volume: this.volume,                     // Current volume levels
            hasSounds: Object.keys(this.sounds).length > 0,  // Whether sounds are loaded
            hasMusic: !!this.music                   // Whether music is loaded
        };
    }

    // Update audio system (called each frame)
    update() {
        // Add audio-related update logic here
        // e.g., adjust music volume based on game state
    }

    // Game event sound effects
    onJump() {
        this.playSound('jump');                      // Play jump sound
    }

    onCollectFish() {
        this.playSound('collect');                   // Play collection sound
    }

    onKillMouse() {
        this.playSound('hit');                       // Play hit sound
    }

    onAchievement() {
        this.playSound('achievement');               // Play achievement sound
    }

    onGameOver() {
        this.stopMusic();                            // Stop background music
        this.stopEnvironmentSounds();                // Stop environmental sounds
        // Could add game over sound effect here
    }

    onLevelComplete() {
        this.playSound('achievement');               // Play achievement sound
        // Could add level complete sound effect here
    }

    // Smart weather audio control system
    onWeatherChange(weatherStatus) {
        // Stop all environmental sounds first
        this.stopEnvironmentSounds();

        // Play appropriate sounds based on weather and time
        if (weatherStatus.isRaining && !weatherStatus.isSnowing) {
            // Only play rain when raining and not snowing (loop playback)
            this.playSound('rain', true);
            console.log('🌧️ Playing rain sound (looped)');
        }

        if (weatherStatus.isNight && !weatherStatus.isSnowing) {
            // Only play frog sounds at night when not snowing (loop playback)
            this.playSound('frog', true);
            console.log('🐸 Playing frog sound (night loop)');
        }

        // Keep quiet during snow for peaceful atmosphere
        if (weatherStatus.isSnowing) {
            console.log('❄️ Snowy weather - keeping quiet for peaceful snow night atmosphere');
        }

        // Don't play frog sounds during day
        if (!weatherStatus.isNight) {
            console.log('☀️ Daytime - frogs resting, no frog sounds');
        }

        // Record current playback state
        this.currentEnvironmentSounds = {
            rain: weatherStatus.isRaining && !weatherStatus.isSnowing,
            frog: weatherStatus.isNight && !weatherStatus.isSnowing
        };
    }

    // Stop all environmental sound effects
    stopEnvironmentSounds() {
        try {
            if (this.sounds.rain && this.sounds.rain.stop) {
                this.sounds.rain.stop();             // Stop rain sound
            }
            if (this.sounds.frog && this.sounds.frog.stop) {
                this.sounds.frog.stop();             // Stop frog sound
            }
        } catch (error) {
            console.log('Error stopping environment sounds:', error);
        }
    }

    // Update audio system based on weather changes
    updateWeatherAudio(weatherStatus) {
        // Check if weather state has changed and adjust audio accordingly
        if (this.lastWeatherStatus &&
            (this.lastWeatherStatus.isRaining !== weatherStatus.isRaining ||
                this.lastWeatherStatus.isSnowing !== weatherStatus.isSnowing ||
                this.lastWeatherStatus.isNight !== weatherStatus.isNight)) {

            // Weather state changed, update audio
            this.onWeatherChange(weatherStatus);
        }

        // Save current weather state for next comparison
        this.lastWeatherStatus = {
            isRaining: weatherStatus.isRaining,
            isSnowing: weatherStatus.isSnowing,
            isNight: weatherStatus.isNight
        };
    }
}

// Export module for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioSystem;
}
