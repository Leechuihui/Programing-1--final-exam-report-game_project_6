#!/bin/bash

# Black Cat Granary Saga - GitHub Publishing Script
# University of London Computer Science Final Assignment

echo "🐱 Black Cat Granary Saga - Publishing to GitHub"
echo "================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files
echo "📦 Adding all files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Black Cat Granary Saga - University of London CS Final Assignment

🎮 Features:
- 2D platformer game with p5.js
- Dynamic weather system (rain, snow, day/night)
- Character system with physics and AI enemies
- Score system with achievements
- Audio system with background music
- Complete documentation and technical specs

📚 Academic Project:
- Course: Programming 1 Final Assignment
- Institution: University of London
- Technology: p5.js, JavaScript ES6+, HTML5, CSS3
- Architecture: Modular, event-driven design



