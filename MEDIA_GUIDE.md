# 📸 游戏截屏和视频指南

## 🎯 如何添加真实的游戏截屏和视频

### 📸 截屏指南

#### 1. 游戏截屏步骤
1. **启动游戏**
   - 打开: https://Leechuihui.github.io/Programing-1--final-exam-report-game_project_6
   - 或本地运行: `python -m http.server 8000`

2. **截屏场景**
   - **白天模式**: 按 `N` 键切换到白天
   - **夜晚模式**: 按 `N` 键切换到夜晚
   - **天气效果**: 按 `G` 键切换雪天
   - **战斗场景**: 等待老鼠出现并战斗

3. **截屏工具**
   - **Mac**: `Cmd + Shift + 4` (选择区域)
   - **Windows**: `Win + Shift + S`
   - **浏览器**: 右键 → 检查元素 → 截屏

#### 2. 推荐的截屏场景

**🌅 白天场景**
- 村庄粮仓远景
- Shadowpaw 在云朵平台上跳跃
- 收集物品的瞬间
- 与老鼠战斗的场面

**🌙 夜晚场景**
- 星空背景和流星效果
- 月光下的粮仓
- 夜晚的战斗场景
- 粒子效果特写

**⚡ 天气效果**
- 雨滴和闪电效果
- 雪花飘落动画
- 地面雪堆积累
- 天气转换过程

**🎁 道具系统**
- 速度提升效果
- 护盾保护状态
- 磁铁吸引物品
- 跳跃增强效果

### 🎥 视频录制指南

#### 1. 录制工具推荐

**免费工具**
- **OBS Studio**: 专业录屏软件
- **QuickTime Player** (Mac): 内置录屏
- **Xbox Game Bar** (Windows): 内置录屏
- **Loom**: 在线录屏工具

#### 2. 视频内容建议

**🎬 完整游戏演示 (3-5分钟)**
- 游戏开始和故事介绍
- 基本操作演示
- 战斗系统展示
- 天气系统变化
- 道具收集和使用
- 计分系统展示

**⚡ 快速亮点 (30-60秒)**
- 最精彩的战斗瞬间
- 天气效果切换
- 道具使用效果
- 高分连击展示

**🌟 个人故事视频 (2-3分钟)**
- 介绍童年山猫的故事
- 游戏开发过程
- 技术实现亮点
- 学术项目意义

#### 3. 视频上传平台

**YouTube (推荐)**
- 免费上传
- 高质量播放
- 易于嵌入
- 全球访问

**其他平台**
- **Bilibili**: 中文用户友好
- **Vimeo**: 高质量视频
- **GitHub**: 直接上传到仓库

### 📁 文件组织

创建以下文件夹结构：

```
assets/
├── screenshots/
│   ├── day-mode/
│   │   ├── granary-scene.png
│   │   ├── platform-jumping.png
│   │   └── item-collection.png
│   ├── night-mode/
│   │   ├── starry-sky.png
│   │   ├── meteor-effects.png
│   │   └── night-combat.png
│   ├── weather-effects/
│   │   ├── rain-lightning.png
│   │   ├── snow-fall.png
│   │   └── ground-snow.png
│   └── power-ups/
│       ├── speed-boost.png
│       ├── shield-effect.png
│       └── magnet-attraction.png
└── videos/
    ├── full-gameplay-demo.mp4
    ├── quick-highlights.mp4
    └── personal-story.mp4
```

### 🔗 更新 README.md

#### 1. 替换占位符图片

将 README.md 中的占位符链接替换为真实图片：

```markdown
<!-- 替换这个 -->
![Day Mode](https://via.placeholder.com/800x450/4a90e2/ffffff?text=Day+Mode+-+Village+Granary+Scene)

<!-- 替换为这个 -->
![Day Mode](assets/screenshots/day-mode/granary-scene.png)
```

#### 2. 添加视频链接

```markdown
<!-- 替换这个 -->
[![Gameplay Video](https://via.placeholder.com/800x450/9b59b6/ffffff?text=Click+to+Watch+Full+Gameplay+Demo)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

<!-- 替换为这个 -->
[![Gameplay Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)
```

### 🎨 图片优化建议

#### 1. 图片尺寸
- **截屏**: 1920x1080 或 1280x720
- **缩略图**: 800x450 (16:9 比例)
- **格式**: PNG (无损) 或 JPG (压缩)

#### 2. 文件大小
- **截屏**: < 2MB
- **视频缩略图**: < 500KB
- **总仓库大小**: < 100MB

#### 3. 命名规范
- 使用英文和连字符
- 描述性名称
- 版本号 (如需要)

### 🚀 发布步骤

1. **准备媒体文件**
   - 截屏游戏各个场景
   - 录制游戏演示视频
   - 优化文件大小

2. **上传到仓库**
   ```bash
   git add assets/
   git commit -m "Add game screenshots and videos"
   git push origin main
   ```

3. **更新 README.md**
   - 替换占位符链接
   - 添加真实媒体文件
   - 测试所有链接

4. **发布到视频平台**
   - 上传到 YouTube
   - 获取视频 ID
   - 更新 README.md 链接

### 📋 检查清单

- [ ] 游戏截屏已准备
- [ ] 视频已录制和上传
- [ ] 媒体文件已优化
- [ ] README.md 已更新
- [ ] 所有链接正常工作
- [ ] 文件大小符合要求

---

**完成这些步骤后，您的游戏主页将拥有专业的截屏和视频展示！** 🎮✨
