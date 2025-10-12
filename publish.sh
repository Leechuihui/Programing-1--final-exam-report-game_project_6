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

🚀 Ready for GitHub Pages deployment!"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Add remote origin (user needs to replace with their GitHub URL)
echo "🔗 Adding remote origin..."
echo "⚠️  Please replace 'your-username' with your actual GitHub username:"
echo "git remote add origin https://github.com/your-username/game_project_6.git"
echo ""
echo "📋 Next steps:"
echo "1. Replace 'your-username' in the command above with your GitHub username"
echo "2. Run: git remote add origin https://github.com/your-username/game_project_6.git"
echo "3. Run: git push -u origin main"
echo "4. Enable GitHub Pages in repository settings"
echo "5. Your game will be available at: https://your-username.github.io/game_project_6"
echo ""
echo "✅ Project is ready for GitHub publishing!"
echo "📖 Check README.md for complete documentation"
echo "🔧 Check DEPLOYMENT.md for deployment instructions"
