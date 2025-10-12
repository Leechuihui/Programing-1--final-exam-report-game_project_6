# GitHub Packages 发布指南

## 📦 如何发布到 GitHub Packages

### 步骤 1: 设置认证

1. 在 GitHub 上生成 Personal Access Token:
   - 访问: https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择权限: `write:packages`, `read:packages`, `delete:packages`
   - 复制生成的 token

2. 配置 npm 认证:
   ```bash
   npm login --registry=https://npm.pkg.github.com
   ```
   - Username: 您的 GitHub 用户名
   - Password: 刚才生成的 Personal Access Token
   - Email: 您的 GitHub 邮箱

### 步骤 2: 发布包

```bash
# 确保在项目根目录
cd /path/to/game_project_6

# 发布到 GitHub Packages
npm publish
```

### 步骤 3: 验证发布

1. 访问您的 GitHub 仓库
2. 点击 "Packages" 标签页
3. 查看 "black-cat-granary-saga" 包

## 🎯 包信息

- **包名**: `@leechuihui/black-cat-granary-saga`
- **版本**: `1.0.0`
- **注册表**: `https://npm.pkg.github.com`
- **仓库**: `https://github.com/Leechuihui/Programing-1--final-exam-report-game_project_6`

## 📋 包含的文件

- `index.html` - 主游戏文件
- `main.js` - 核心游戏逻辑
- `character.js` - 角色系统
- `environment.js` - 环境系统
- `weather.js` - 天气系统
- `score_system.js` - 计分系统
- `game_modules.js` - 游戏模块
- `audio_system.js` - 音频系统
- `sketch.js` - p5.js 草图
- `assets/` - 游戏资源
- `README.md` - 项目文档
- `LICENSE` - 许可证

## 🔧 使用已发布的包

其他开发者可以通过以下方式使用您的包:

```bash
# 安装包
npm install @leechuihui/black-cat-granary-saga

# 或者从 GitHub Packages 安装
npm install @leechuihui/black-cat-granary-saga --registry=https://npm.pkg.github.com
```

## 📝 版本管理

- 更新版本号: `npm version patch/minor/major`
- 发布新版本: `npm publish`
- 查看版本历史: `npm view @leechuihui/black-cat-granary-saga versions`

## 🎉 发布成功后的效果

1. **GitHub Packages 页面**会显示您的包
2. **下载统计**会开始跟踪
3. **版本历史**会记录所有发布
4. **其他开发者**可以安装和使用您的包

## 🆘 常见问题

### 认证失败
- 检查 Personal Access Token 权限
- 确认用户名和密码正确
- 重新运行 `npm login`

### 发布失败
- 检查包名是否已存在
- 确认版本号唯一
- 检查文件是否在 `files` 数组中

### 找不到包
- 确认包已成功发布
- 检查包名拼写
- 确认使用正确的注册表

---

**恭喜！您的游戏现在可以作为 npm 包供全世界使用了！** 🎮✨
