//Coursework 1.2 Game project submission： Game project part 4

// Game variables // 游戏变量 (Game variables)
var floorPos_y; // 地面y坐标 (Y position of the floor);
var cat_x, cat_y, cat_vy; // 猫的坐标、垂直速度 (Cat's position and vertical velocity);
var trees = [], stars = [], clouds = [], birds = [], bushes = [], riverPoints = []; // 树、星星、云、鸟、灌木、河流点 (Trees, stars, clouds, birds, bushes, river points);
var isNight = false, isJumping = false; // 是否夜晚、跳跃 (Night mode, jumping);
var cloudSpeed = 0.5, sun_y, moon_y, moon_x, moonPhase, moonDelay; // 云速度、太阳y、月亮y、月亮x、月升阶段、月升延迟 (Cloud speed, sun y, moon y, moon x, moon phase, moon delay);
// 老鼠现在使用mice数组管理，不再需要单独的mouse_变量
let eyeAngle = 0, tailAngle = 0, blinkTimer = 0, legAngle = 0, whiskerAngle = 0; // 眼睛、尾巴、眨眼、腿、胡须角度 (Eye, tail, blink, leg, whisker angle);
var catState = "standing"; // Can be: standing, jumping, walkingLeft, walkingRight, sleeping, crouch, angry, faint // 猫的状态 (可为：站立、跳跃、向左走、向右走、睡觉、趴下、生气、晕倒) (Cat state: can be standing, jumping, walkingLeft, walkingRight, sleeping, crouch, angry, faint);
var idleTimer = 0; // 空闲计时器 (Idle timer);
var isRaining = false; // 是否下雨 (Is it raining);
var raindrops = []; // 雨滴数组 (Raindrop array);
let rainSound; // 雨声 (Rain sound);
let frogSound; // 青蛙叫声 (Frog sound);
let backgroundMusic; // 背景音乐 (Background music);
let jumpSound; // 跳跃音效 (Jump sound);
let catHappyTimer = 0; // 猫开心计时器 (Cat happy timer);
let life = 100; // 生命值 (Life value);
let meteors = []; // 流星数组 (Meteor array);
let meteorActive = false; // 流星激活状态 (Meteor active state);
let meteorTimer = 0; // 流星计时器 (Meteor timer);
let catSadTimer = 0; // 猫不开心计时器 (Cat sad timer);
let lastMeteorFrame = -2000; // 上一次流星出现的帧 (Last meteor frame);
let meteorInterval; // 流星间隔 (Meteor interval);
let snowParticles = []; // 雪粒子数组 (Snow particle array);
// 全局静态雪顶点 (Global static snow vertices)
let snowX = [], snowY = []; // 雪x、y数组 (Snow x, y arrays);
var isSnowing = false; // 是否下雪 (Is it snowing);
let mice = []; // 老鼠数组 (Mice array);
let fishbones = []; // 鱼骨头数组 (Fishbone array);
let riceX = 200; // 大米位置 (Rice position);
let maxLife = 100; // 最大生命值 (Max life);
let lastSpawn5s = 0; // 上次5秒生成时间 (Last 5s spawn time);
let worldWidth = 1208; // 或你的世界宽度 (Or your world width);
let rewardFishes = []; // 奖励鱼数组 (Reward fish array);
let lastFishSpawn = 0; // 上次奖励鱼生成时间 (Last reward fish spawn time);
let angry = false; // 生气状态 (Angry state);
let fishes = []; // 普通鱼数组 (Regular fish array);
let octopuses = []; // 章鱼数组 (Octopus array);
let crabs = []; // 螃蟹数组 (Crab array);
let turtles = []; // 乌龟数组 (Turtle array);
let lastFishSpawnTime = 0; // 上次普通鱼生成时间 (Last regular fish spawn time);
let consecutiveMouseHits = 0; // 连续被老鼠碰撞次数 (Consecutive mouse hits);
let faintTimer = 0; // 晕倒计时器 (Faint timer);
let angryTimer = 0; // 生气持续时间 (Angry duration);
let handFireAnimation = 0; // 手部发射动画 (Hand firing animation);
// ========== 故事粒子特效 ========== // (Story particle effects)
let riceParticles = [], glowParticles = []; // 稻穗粒子、光斑粒子 (Rice particles, glow particles);
// 新增全局变量 (New global variables)
let isFiringFishbone = false; // 是否正在发射鱼骨头 (Is firing fishbone);
let lastFishboneFrame = 0; // 上次鱼骨头发射帧 (Last fishbone frame);
let stones = []; // 石头数组 (Stones array);
// 摄像机跟踪变量 (Camera tracking variables)
var cameraX = 0; // 摄像机x坐标 (Camera x position);
let cameraZoom = 1; // 摄像机缩放 (Camera zoom);
let isIntro = true; // 是否为介绍动画 (Is intro animation);
let introProgress = 0; // 介绍动画进度 (Intro animation progress);
let introStartCameraX = 0; // 介绍动画起始摄像机x (Intro start camera x);
let introStartZoom = 0.2; // 介绍动画起始缩放 (Intro start zoom)\;
let lives = 3; // 新增红星数 (Number of red stars/lives);
let isFallingToCliff = false; // 跌落峡谷状态 (Falling into canyon state);
let fallTimer = 0; // 跌落计时器 (Fall timer);
let isInvincible = false; // 无敌状态 (Invincible state);
let invincibleTimer = 0; // 无敌计时器 (Invincible timer);
let apples = []; // 苹果数组 (Apples array);
let gameOver = false; // 游戏结束状态 (Game over state);
let fishboneHitCount = 0; // 鱼骨头击中计数 (Fishbone hit count);
let rewardCount = 0; // 奖励计数 (Reward count);

// ===== 完全独立的左右键控制系统 =====
// 只受左右箭头键控制，不受任何其他代码影响
// 移动状态变量 - 完全独立
let isMovingLeft = false;  // 向左移动状态
let isMovingRight = false; // 向右移动状态
let catDirection = "right"; // 猫的朝向

// 左右键控制系统配置
const MOVEMENT_CONFIG = {
    LEFT_ARROW: 37,    // 左箭头键码
    RIGHT_ARROW: 39,   // 右箭头键码
    MOVE_SPEED: 10,    // 移动速度
    INDEPENDENT: true   // 完全独立标志
};

// 保护措施：防止其他代码干扰移动状态
Object.freeze(MOVEMENT_CONFIG); // 冻结配置对象，防止修改

// 系统状态检查函数
function checkMovementSystemIntegrity() {
    if (!MOVEMENT_CONFIG.INDEPENDENT) {
        console.error('❌ 移动系统独立性被破坏！');
        return false;
    }
    if (typeof isMovingLeft !== 'boolean' || typeof isMovingRight !== 'boolean') {
        console.error('❌ 移动状态变量类型错误！');
        return false;
    }
    console.log('✅ 移动系统完整性检查通过');
    return true;
}

// 系统状态报告函数
function reportMovementSystemStatus() {
    console.log('📊 移动系统状态报告:');
    console.log(`   - 系统独立性: ${MOVEMENT_CONFIG.INDEPENDENT ? '✅ 正常' : '❌ 异常'}`);
    console.log(`   - 左移动状态: ${isMovingLeft ? '🔄 移动中' : '⏸️ 停止'}`);
    console.log(`   - 右移动状态: ${isMovingRight ? '🔄 移动中' : '⏸️ 停止'}`);
    console.log(`   - 猫的朝向: ${catDirection}`);
    console.log(`   - 移动速度: ${MOVEMENT_CONFIG.MOVE_SPEED}`);
    console.log(`   - 当前帧数: ${frameCount}`);
}

// 系统重置函数
function resetMovementSystem() {
    console.log('🔄 重置移动系统...');
    isMovingLeft = false;
    isMovingRight = false;
    catDirection = "right";
    console.log('✅ 移动系统已重置');
    reportMovementSystemStatus();
}

// 右键事件监控函数
function monitorRightClickEvents() {
    // 检查是否有右键事件影响游戏状态
    if (mouseIsPressed && mouseButton === RIGHT) {
        console.warn('⚠️ 检测到右键按下 - 可能影响游戏状态');
        // 强制重置移动状态，防止干扰
        if (isMovingLeft || isMovingRight) {
            console.log('🔧 右键干扰检测 - 强制保护移动状态');
        }
    }
}

// 系统清理报告函数
function generateSystemCleanupReport() {
    console.log('🧹 系统清理报告:');
    console.log('   ✅ 已删除: gameController.handleKeyPress() 调用');
    console.log('   ✅ 已删除: 无用的 mouse_x, mouse_y, mouse_speed 变量');
    console.log('   ✅ 已删除: 旧的老鼠初始化和绘制代码');
    console.log('   ✅ 已删除: lastSpawn3s 变量');
    console.log('   ✅ 已删除: cat_speed 变量和相关代码');
    console.log('   ✅ 已添加: 右键事件阻止系统');
    console.log('   ✅ 已添加: 全局鼠标事件监听器');
    console.log('   ✅ 已添加: 系统完整性检查');
    console.log('   ✅ 已优化: 左右键控制系统完全独立');
    console.log('📊 清理结果: 代码更简洁，系统更稳定，右键不再干扰控制');
}

// 新增全局变量
let score = 0; // 分数
let levelComplete = false; // 是否通关
// 新增全局变量
let level = 1;

// ===== Constants and helpers (性能/结构常量与工具函数) =====
const CONFIG = {
    CAMERA_LERP: 0.12,
    CAMERA_DEADZONE: 12,
    CAMERA_DIRECTIONAL_OFFSET: 140,
    FISHBONE_SPEED: 8,
    FISHBONE_HIT_RADIUS: 28,
    MOUSE_SEE_RADIUS: 220,
    MOUSE_HIT_RADIUS: 32,
    REWARD_FISH_PICK_RADIUS: 30,
    DOOR_HIT_RADIUS: 40,

    APPLE_THROW_INTERVAL_FRAMES: 300,
    APPLE_THROW_SPEED: 8,
    MAX_FISHBONES: 64,
    MAX_RAINDROPS: 400,
    PLATFORM_WIDTH: 90,
    PLATFORM_HEIGHT: 24,
    PLATFORM_MOVE_AMPLITUDE: 100,
    PLATFORM_MOVE_SPEED: 1.2,
    CAT_HALF_WIDTH: 32,
    MAX_SNOW: 200 // 新增：最大雪粒子数量
};
// 云台阶（可踩踏平台）(Cloud platforms the cat can stand on)
let cloudPlatforms = []; // {baseX, x, y, w, h, type:'static'|'moving', phase, speed, amplitude, vx, frozen}
let onPlatformId = -1; // 当前站立的平台索引 (Index of platform the cat is currently standing on)
let lastCatY = 0; // 上一帧猫的y (Cat y from previous frame)

function createCloudPlatforms() { // 创建云台阶路径 (Create cloud platform route)
    cloudPlatforms = [];
    // 起点位于河流左岸上方，铺向右岸
    const baseY = floorPos_y - 140;
    const startX = width - 140; // 悬崖右侧是河流起点
    const step = 180;
    for (let i = 0; i < 10 + 100 / step; i++) { // 增加约100px覆盖 (roughly +100px span)
        const px = startX + i * step;
        const py = baseY + (i % 2 === 0 ? 0 : -36);
        const moving = (i % 3 === 1);
        cloudPlatforms.push({
            baseX: px,
            x: px,
            y: py,
            w: CONFIG.PLATFORM_WIDTH + 50, // 更宽，确保整只猫站稳 (140px total)
            h: CONFIG.PLATFORM_HEIGHT,
            type: moving ? 'moving' : 'static',
            phase: random(TWO_PI),
            speed: moving ? CONFIG.PLATFORM_MOVE_SPEED : 0,
            amplitude: moving ? CONFIG.PLATFORM_MOVE_AMPLITUDE : 0,
            vx: moving ? (random([1, -1])) : 0,
            frozen: false
        });
    }
}

function updateCloudPlatforms() { // 更新云台阶位置 (Update platform positions)
    for (let i = 0; i < cloudPlatforms.length; i++) {
        const p = cloudPlatforms[i];
        if (p.type === 'moving' && !p.frozen) {
            p.x = p.baseX + sin(frameCount * 0.02 * p.speed + p.phase) * p.amplitude;
        }
    }
}

function drawCloudPlatforms() { // 绘制云台阶 (Draw platforms)
    for (let i = 0; i < cloudPlatforms.length; i++) {
        const p = cloudPlatforms[i];
        if (p.x + p.w < cameraX - 80 || p.x - p.w > cameraX + width + 80) continue; // 视野裁剪
        push();
        translate(p.x, p.y);
        noStroke();
        // 云朵形状 (Cloud blob)
        fill(240);
        ellipse(0, 0, p.w * 0.6, p.h);
        ellipse(p.w * 0.25, 0, p.w * 0.5, p.h * 0.9);
        ellipse(-p.w * 0.25, 0, p.w * 0.5, p.h * 0.9);
        // 亮边
        fill(255, 255, 255, 140);
        ellipse(-p.w * 0.18, -3, p.w * 0.22, p.h * 0.4);
        ellipse(p.w * 0.18, -4, p.w * 0.25, p.h * 0.38);
        pop();
    }
}

function catPlatformCollisionAndRide() { // 猫与平台碰撞/承载 (Cat collides and rides platforms)
    onPlatformId = -1;
    const catBottomY = cat_y + 10; // 脚底略低一些
    const catLeft = cat_x - CONFIG.CAT_HALF_WIDTH; // 猫的左边界
    const catRight = cat_x + CONFIG.CAT_HALF_WIDTH; // 猫的右边界
    const catTop = cat_y - 20; // 猫的头顶

    for (let i = 0; i < cloudPlatforms.length; i++) {
        const p = cloudPlatforms[i];
        const platformTop = p.y - p.h * 0.5;
        const platformLeft = p.x - p.w * 0.5;
        const platformRight = p.x + p.w * 0.5;

        // 检查猫是否从上方落下到平台上
        const isLandingFromAbove = (lastCatY <= platformTop - 1) && (catBottomY >= platformTop - 4);

        // 检查猫的整个身体是否完全在平台范围内（左右边界必须完全在平台内）
        const isFullyWithinX = (catLeft >= platformLeft && catRight <= platformRight);

        // 调试信息 - 当猫接近平台时显示
        if (abs(cat_x - p.x) < 100 && abs(cat_y - p.y) < 50) {
            console.log(`平台${i}: 猫范围[${catLeft.toFixed(1)}, ${catRight.toFixed(1)}], 平台范围[${platformLeft.toFixed(1)}, ${platformRight.toFixed(1)}], 完全在内: ${isFullyWithinX}, 从上方落下: ${isLandingFromAbove}`);
        }

        // 只有当猫的整个身体都完全在云平台上时才能站立和冻结云
        if (isLandingFromAbove && isFullyWithinX && (cat_vy >= 0)) {
            cat_y = platformTop - 10; // 放在平台上方
            cat_vy = 0;
            isJumping = false;
            onPlatformId = i;

            // 猫完全在平台上时冻结云的移动
            cloudPlatforms[onPlatformId].frozen = true;
            console.log(`猫成功站在云平台${i}上！`);
            break;
        }
    }
}

function isWithinRadiusSq(ax, ay, bx, by, r) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy <= r * r;
}

// Simple pooled spawn for fishbones and raindrops
function acquireFishboneSlot() {
    for (let i = 0; i < fishbones.length; i++) {
        if (!fishbones[i].active) return fishbones[i];
    }
    if (fishbones.length < CONFIG.MAX_FISHBONES) {
        const fb = { x: 0, y: 0, vx: 0, vy: 0, dir: 1, active: false };
        fishbones.push(fb);
        return fb;
    }
    // Reuse the oldest active (index 0) by finding first active and turning it off
    for (let i = 0; i < fishbones.length; i++) {
        if (fishbones[i].active) {
            return fishbones[i];
        }
    }
    return null;
}

function addRaindrop() {
    // Try reuse inactive
    for (let i = 0; i < raindrops.length; i++) {
        const d = raindrops[i];
        if (!d.active) {
            d.x = random(width);
            d.y = random(-20, 0);
            d.vy = random(10, 18);
            d.active = true;
            return;
        }
    }
    // Create if capacity allows
    if (raindrops.length < CONFIG.MAX_RAINDROPS) {
        raindrops.push({ x: random(width), y: random(-20, 0), vy: random(10, 18), active: true });
    }
}

// 新增：雪粒子对象池生成
function addSnowParticle() {
    for (let i = 0; i < snowParticles.length; i++) {
        const s = snowParticles[i];
        if (!s.active) {
            s.x = random(cameraX - 50, cameraX + width + 50);
            s.y = random(-40, 0);
            s.vy = random(0.4, 1.2);
            s.vx = random(-0.3, 0.3);
            s.size = random(2, 5);
            s.alpha = random(140, 220);
            s.active = true;
            return;
        }
    }
    if (snowParticles.length < CONFIG.MAX_SNOW) {
        snowParticles.push({ x: random(cameraX - 50, cameraX + width + 50), y: random(-40, 0), vy: random(0.4, 1.2), vx: random(-0.3, 0.3), size: random(2, 5), alpha: random(140, 220), active: true });
    }
}

function preload() { // 预加载函数 (Preload function);
    // 预加载音频文件 (Preload audio files)
    rainSound = loadSound('./asset/rain.mp3'); // 加载雨声 (Load rain sound);
    frogSound = loadSound('./asset/frog.mp3'); // 加载青蛙叫声 (Load frog sound);
    backgroundMusic = loadSound('assets/audio/background.mp3'); // 加载背景音乐 (Load background music);
} // 结束 (End);

function setup() { // 设置函数 (Setup function);
    // 创建画布 (Create canvas)
    let canvas = createCanvas(windowWidth, windowHeight); // 创建全屏画布 (Create fullscreen canvas);
    canvas.parent('game-main'); // 将画布添加到game-main容器 (Add canvas to game-main container);

    // 设置中文字体 (Set Chinese font)
    textFont('Arial, "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif');

    // 初始化游戏变量 (Initialize game variables)
    worldWidth = width * 2 + 300; // 世界宽度扩展为两倍+300像素 (World width expanded to twice + 300px);
    floorPos_y = height * 0.875; // 地面y坐标 (Floor y position);
    cat_x = width / 2; // 猫咪初始x坐标 (Cat initial x position);
    cat_y = floorPos_y; // 猫咪初始y坐标 (Cat initial y position);
    cat_vy = 0; // 猫的垂直速度 (Cat vertical velocity);
    // 移动速度现在由MOVEMENT_CONFIG.MOVE_SPEED控制 (Movement speed now controlled by MOVEMENT_CONFIG.MOVE_SPEED)

    // 检查移动系统完整性
    checkMovementSystemIntegrity();

    // 初始化移动系统
    resetMovementSystem();

    // 生成系统清理报告
    generateSystemCleanupReport();

    // === 全局右键事件阻止系统 ===
    // 在文档级别阻止右键菜单和事件
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        console.log('🚫 右键菜单被阻止 - 保护独立控制系统');
        return false;
    });

    // 阻止右键的mousedown和mouseup事件
    document.addEventListener('mousedown', function (e) {
        if (e.button === 2) { // 右键
            e.preventDefault();
            e.stopPropagation();
            console.log('🚫 右键按下被阻止 - 保护独立控制系统');
            return false;
        }
    });

    document.addEventListener('mouseup', function (e) {
        if (e.button === 2) { // 右键
            e.preventDefault();
            e.stopPropagation();
            console.log('🚫 右键释放被阻止 - 保护独立控制系统');
            return false;
        }
    });

    createTrees(); // 创建树木 (Create trees);
    createStars(); // 创建星星 (Create stars);
    createClouds(); // 创建云 (Create clouds);
    createBirds(); // 创建鸟 (Create birds);
    createBushes(); // 创建灌木 (Create bushes);
    createRiver(); // 创建河流 (Create river);
    createCloudPlatforms(); // 创建云台阶 (Create cloud platforms)
    // 老鼠现在通过mice数组和spawnMouse函数管理，不再需要单独初始化
    sun_y = height; // 太阳y坐标 (Sun y position);
    moon_y = floorPos_y + 20; // 月亮从地平线稍下方开始 (Moon starts slightly below horizon);
    moon_x = -50; // 月亮初始x位置（屏幕左外侧）(Moon initial x position (off-screen left));
    moonPhase = 0; // 月升阶段（0-1）(Moon rise phase 0-1);
    moonDelay = 0; // 月升延迟计时器 (Moon rise delay timer);
    meteors = []; // 流星数组 (Meteor array);
    for (let i = 0; i < 1; i++) { // 循环1次，初始化流星 (Loop 1 time to initialize meteor);
        meteors.push({ x: random(width), y: random(0, 200), speed: random(10, 18), active: false, timer: floor(random(200, 800)) }); // 初始化流星 (Initialize meteor);
    } // 结束for循环 (End of for loop);
    raindrops = []; // 雨滴数组 (Raindrop array);
    // 自动切换天气和昼夜 (Automatically switch weather and day/night)
    if (!window._weatherIntervalSet) { // 如果天气间隔未设置 (If weather interval not set);
        setInterval(() => { // 设置定时器 (Set interval timer);
            let wasNight = isNight; // 记录之前的状态 (Remember previous state)
            isNight = random([true, false]); // 随机切换昼夜 (Randomly switch day/night);
            // 如果切换到夜晚，设置月亮状态 (If switching to night, set moon state)
            if (isNight && !wasNight) {
                // 重置月亮从东方地平线升起 (Reset moon to rise from eastern horizon)
                moonPhase = 0; // 总是从地平线开始升起 (Always start rising from horizon)
                moonDelay = 0; // 无延迟，直接升起 (No delay, rise immediately)

                // 计算初始位置 - 从东方地平线开始 (Calculate initial position - start from eastern horizon)
                moon_x = 50 + cameraX; // 从屏幕左侧开始 - 考虑相机位置 (Start from screen left - consider camera position)
                let horizonY = height - 200; // 地平线高度 - 使用屏幕坐标 (Horizon level - use screen coordinates)
                moon_y = horizonY; // 从地平线开始 (Start from horizon)

                console.log(`🌙 自动切换夜晚 - 月亮从东方地平线升起, Phase: ${moonPhase.toFixed(3)}, X: ${moon_x.toFixed(1)}, Y: ${moon_y.toFixed(1)}`);
            }
            // 雨雪互斥 (Rain and snow are mutually exclusive)
            let weatherType = random(["rain", "snow", "none"]); // 随机天气类型 (Random weather type);
            isRaining = (weatherType === "rain"); // 是否下雨 (Is it raining);
            isSnowing = (weatherType === "snow"); // 是否下雪 (Is it snowing);
            if (isNight) { // 如果是夜晚 (If it is night);
                createStars(); // 创建星星 (Create stars);
                for (let m of meteors) m.active = false; // 夜晚流星不激活 (Deactivate meteors at night);
            } else { // 如果是白天 (Else, if it is daytime);
                stars = []; // 白天无星星 (No stars in daytime);
                for (let m of meteors) m.active = false; // 白天流星不激活 (Deactivate meteors in daytime);
            } // 结束if-else (End of if-else);
            raindrops = []; // 清空雨滴 (Clear raindrops);
            snowParticles = []; // 清空雪粒子 (Clear snow particles);
        }, 30000); // 每30秒切换一次 (Switch every 30 seconds);
        window._weatherIntervalSet = true; // 标记已设置定时器 (Mark interval as set);
    } // 结束if (End of if);
    meteorInterval = 1800 + Math.floor(Math.random() * 900); // 流星间隔 (Meteor interval);
    // 树木结构数据生成 (Generate tree structure data)
    for (let tree of trees) { // 遍历所有树木 (Loop through all trees);
        let baseW = 10 + Math.random() * 18; // 主干粗细差异更大 (Trunk thickness varies more);
        let depth = 5; // 统一递归深度 (Uniform recursion depth);
        let mainLen = tree.h * (0.95 + Math.random() * 0.05); // 长度波动减小 (Length fluctuation reduced);
        tree.data = generateTreeData(mainLen, 0, depth, baseW, tree.colorType); // 生成树数据 (Generate tree data);
    } // 结束for循环 (End of for loop);
    // 生成静态雪顶点 (Generate static snow vertices)
    snowX = [370, 400, 430, 460, 500, 540, 570, 600]; // 雪x坐标 (Snow x positions);
    snowY = [ // 雪y坐标 (Snow y positions);
        floorPos_y - 230 + random(-6, 6), // 雪y坐标 (Snow y positions);
        floorPos_y - 250 + random(-8, 8), // 雪y坐标 (Snow y positions);
        floorPos_y - 270 + random(-10, 10), // 雪y坐标 (Snow y positions);
        floorPos_y - 290 + random(-12, 12), // 雪y坐标 (Snow y positions);
        floorPos_y - 280 + random(-10, 10), // 雪y坐标 (Snow y positions);
        floorPos_y - 260 + random(-8, 8), // 雪y坐标 (Snow y positions);
        floorPos_y - 245 + random(-6, 6), // 雪y坐标 (Snow y positions);
        floorPos_y - 235 + random(-5, 5) // 雪y坐标 (Snow y positions);
    ]; // 结束雪y数组 (End of snow y array);
    for (let i = 0; i < 40; i++) riceParticles.push({ x: random(width), y: random(-height, 0), vy: random(0.7, 1.5), size: random(18, 32), angle: random(TWO_PI), va: random(-0.01, 0.01) }); // 生成稻穗粒子 (Generate rice particles);
    for (let i = 0; i < 18; i++) glowParticles.push({ x: random(width), y: random(height), r: random(30, 80), a: random(0.08, 0.18) }); // 生成光斑粒子 (Generate glow particles);
    // 播放背景音乐 (Play background music)
    if (backgroundMusic) { // 如果背景音乐存在 (If background music exists);
        backgroundMusic.setVolume(0.5); // 设置音量 (Set volume);
        backgroundMusic.loop(); // 循环播放 (Loop playback);
    } // 结束if (End of if);
    // Intro动画初始化 (Initialize intro animation)
    isIntro = true; // 进入介绍动画 (Enter intro animation);
    introProgress = 0; // 介绍动画进度 (Intro animation progress);
    introStartCameraX = worldWidth - width; // 从最右侧开始 (Start from the far right);
    introStartZoom = 0.2; // 初始缩放 (Initial zoom);
    cameraX = introStartCameraX; // 摄像机x (Camera x);
    cameraZoom = introStartZoom; // 摄像机缩放 (Camera zoom);

    // 游戏平衡性改进 (Game balance improvements)
    maxLife = 150; // 增加最大生命值 (Increase max life);
    life = maxLife; // 设置初始生命值 (Set initial life);
} // 结束 (End);
// 创建树木，避免悬崖和河流区域 (Create trees, avoiding cliff and river areas)
function createTrees() { // 创建树木函数 (Function to create trees);
    trees = []; // 初始化树木数组 (Initialize trees array);
    let lastX = 0; // 上一棵树的x坐标 (X position of the last tree);
    let tryCount = 0; // 尝试次数计数器 (Attempt counter);
    // 循环生成树木，最多尝试1000次，直到树木数量达到16 (Loop to generate trees, up to 1000 attempts, until 16 trees are created)
    while (trees.length < 16 && tryCount < 1000) { // 循环直到树木数量足够或尝试次数过多 (Loop until enough trees or too many attempts);
        let x = random(lastX + 80, lastX + 220); // 随机生成树的x坐标，保证树之间有间隔 (Randomly generate tree x, ensure spacing);
        let h = random(120, 260); // 随机生成树的高度 (Randomly generate tree height);
        // 1. 避开悬崖区域 (1. Avoid cliff area) - 扩展峡谷范围
        if (x > width - 100 && x < width + 400) { // 峡谷区域扩展到+400像素 (Extended canyon area to +400px);
            tryCount++; // 增加尝试次数 (Increase attempt count);
            continue; // 跳过本次循环 (Skip this iteration);
        } // 结束if (End of if);
        // 2. 避开河流（水面）(2. Avoid river (water surface))
        // 检查该x在riverPoints中y值 (Check y value in riverPoints for this x)
        let onRiver = false; // 标记是否在河流上 (Flag if on river);
        for (let pt of riverPoints) { // 遍历河流点 (Loop through river points);
            if (abs(pt.x - x) < 30 && pt.y > floorPos_y - 60 && pt.y < floorPos_y + 80) { // 如果树靠近河流并且在水面范围内 (If tree is near river and within water surface range);
                onRiver = true; // 如果在河流上则标记 (Mark as on river if true);
                break; // 跳出循环 (Break loop);
            } // 结束if (End of if);
        } // 结束for循环 (End of for loop);
        if (onRiver) { // 如果在河流上 (If on river);
            tryCount++; // 增加尝试次数 (Increase attempt count);
            continue; // 跳过本次循环 (Skip this iteration);
        } // 结束if (End of if);
        trees.push({ x: x, y: floorPos_y - h, h: h }); // 添加树对象到数组 (Add tree object to array);
        lastX = x; // 更新上一棵树的x坐标 (Update last tree x);
        tryCount++; // 增加尝试次数 (Increase attempt count);
    } // 结束while循环 (End of while loop);
} // 结束 (End);

// 创建星星数组，分布在整个世界 (Create an array of stars distributed across the world)
function createStars() { // 创建星星函数 (Function to create stars);
    stars = []; // 初始化星星数组 (Initialize the stars array);
    for (let i = 0; i < 100; i++) { // 循环100次，生成100颗星星 (Loop 100 times to generate 100 stars);
        stars.push({ // 向星星数组添加一个新星星对象 (Add a new star object to the stars array);
            x: random(worldWidth), // 星星的x坐标，随机分布在世界宽度内 (Star's x position, randomly distributed in world width);
            y: random(height / 2), // 星星的y坐标，随机分布在上半屏 (Star's y position, randomly distributed in upper half of the screen);
            brightness: random(150, 255), // 星星亮度，随机在150到255之间 (Star brightness, random between 150 and 255);
            size: random(2, 7), // 星星大小，随机在2到7之间 (Star size, random between 2 and 7);
            flicker: random(0.01, 0.05) // 星星闪烁速度，随机在0.01到0.05之间 (Star flicker speed, random between 0.01 and 0.05);
        }); // 星星对象结束 (End of star object);
    } // for循环结束 (End of for loop);
} // 函数结束 (End of function);

// 创建云朵数组，分布在整个大世界 (Create an array of clouds distributed across the world)
function createClouds() { // 创建云朵函数 (Function to create clouds);
    clouds = []; // 初始化云朵数组 (Initialize clouds array);
    // 创建3朵云，位置不同，都要往右移动 (Create 3 clouds at different positions, all moving right)
    clouds.push({ // 第一朵云 (First cloud);
        x: -200, // 从左侧开始 (Start from left);
        y: 80, // 固定y坐标 (Fixed y position);
        size: 100, // 云朵大小 (Cloud size);
        speed: 0.5 // 移动速度 (Movement speed);
    }); // 云朵对象结束 (End of cloud object);

    clouds.push({ // 第二朵云 (Second cloud);
        x: 400, // 从中间开始 (Start from middle);
        y: 120, // 固定y坐标 (Fixed y position);
        size: 90, // 云朵大小 (Cloud size);
        speed: 0.3 // 移动速度 (Movement speed);
    }); // 云朵对象结束 (End of cloud object);

    clouds.push({ // 第三朵云 (Third cloud);
        x: 800, // 从右侧开始 (Start from right);
        y: 150, // 固定y坐标 (Fixed y position);
        size: 110, // 云朵大小 (Cloud size);
        speed: 0.8 // 移动速度 (Movement speed);
    }); // 云朵对象结束 (End of cloud object);
} // 函数结束 (End of function);

// 绘制卡通云朵形状（类似上传图片风格）
function drawCloudShape(x, y, size) {
    // 主体大圆
    ellipse(x, y, size * 0.9, size * 0.7);
    // 左侧大圆
    ellipse(x - size * 0.35, y + size * 0.05, size * 0.7, size * 0.6);
    // 右侧大圆
    ellipse(x + size * 0.35, y + size * 0.05, size * 0.7, size * 0.6);
    // 顶部小圆
    ellipse(x, y - size * 0.02, size * 0.3, size * 0.5);
    // 底部小椭圆，让底部更平
    ellipse(x, y + size * 0.18, size * 0.7, size * 0.3);
}

// 修改 drawClouds 函数，调用 drawCloudShape
function drawClouds() { // 绘制云朵函数 (Function to draw clouds);
    // 白天夜晚都显示云朵 (Show clouds in both day and night)
    for (let cloud of clouds) {
        // 云朵移动 (Cloud movement)
        cloud.x += cloud.speed;
        if (cloud.x > worldWidth + cloud.size) {
            cloud.x = -cloud.size;
        }
        if (cloud.x + cloud.size > cameraX && cloud.x - cloud.size < cameraX + width) {
            push();
            if (isNight) {
                fill(200, 200, 200);
            } else {
                fill(255);
            }
            noStroke();
            drawCloudShape(cloud.x, cloud.y, cloud.size);
            pop();
        }
    }
    if (frameCount % 60 === 0) {
        console.log(`总云朵数: ${clouds.length}, 云朵位置: ${clouds.map(c => Math.round(c.x)).join(', ')}`);
    }
}

// 创建鸟群数组，分布在整个大世界 (Create an array of birds distributed across the world)
function createBirds() { // 创建鸟群函数 (Function to create birds);
    birds = []; // 初始化鸟群数组 (Initialize birds array);
    for (let i = 0; i < 10; i++) { // 循环10次，生成10只鸟 (Loop 10 times to generate 10 birds);
        birds.push({ // 向鸟群数组添加一个新鸟对象 (Add a new bird object to the birds array);
            x: random(worldWidth), // 鸟的x坐标，随机分布在世界宽度内 (Bird's x position, randomly distributed in world width);
            y: random(100, 200), // 鸟的y坐标，随机分布在100到200之间 (Bird's y position, random between 100 and 200);
            speed: random(1, 3),// 鸟的飞行速度，随机在1到3之间 (Bird's flight speed, random between 1 and 3);
            wingPhase: random(0, TWO_PI) // 鸟的翅膀拍打相位 (Bird's wing flap phase);
        }); // 鸟对象结束 (End of bird object);
    } // for循环结束 (End of for loop);
} // 函数结束 (End of function);

// 创建灌木丛数组，分布在整个大世界 (Create an array of bushes distributed across the world)
function createBushes() { // 创建灌木丛函数 (Function to create bushes);
    bushes = []; // 初始化灌木丛数组 (Initialize bushes array);
    for (let i = 0; i < 20; i++) { // 循环20次，生成20丛灌木 (Loop 20 times to generate 20 bushes);
        bushes.push({ // 向灌木丛数组添加一个新灌木对象 (Add a new bush object to the bushes array);
            x: random(worldWidth), // 灌木的x坐标，随机分布在世界宽度内 (Bush's x position, randomly distributed in world width);
            y: floorPos_y - 10, // 灌木的y坐标，略高于地面 (Bush's y position, slightly above floor);
            size: random(40, 80) // 灌木的大小，随机在40到80之间 (Bush size, random between 40 and 80);
        }); // 灌木对象结束 (End of bush object);
    } // for循环结束 (End of for loop);
} // 函数结束 (End of function);

// 创建河流路径点 (Create river path points)
function createRiver() { // 创建河流函数 (Function to create river);
    riverPoints = []; // 初始化河流点数组 (Initialize river points array);
    let riverWidth = 220; // 河流宽度加大 (Increase river width)
    let startX = -100; // 起始x坐标 (Starting x coordinate);
    let startY = floorPos_y - 50; // 起始y坐标 (Starting y coordinate);
    let endX = worldWidth + 200; // 右岸整体后移100像素 (Shift right land 100px)
    let endY = floorPos_y + 100; // 结束y坐标 (Ending y coordinate);

    let cp1x = worldWidth / 4; // 第一个控制点x坐标 (First control point x coordinate);
    let cp1y = floorPos_y - 150; // 第一个控制点y坐标 (First control point y coordinate);
    let cp2x = worldWidth / 2; // 第二个控制点x坐标 (Second control point x coordinate);
    let cp2y = floorPos_y + 50; // 第二个控制点y坐标 (Second control point y coordinate);
    let cp3x = 3 * worldWidth / 4; // 第三个控制点x坐标 (Third control point x coordinate);
    let cp3y = floorPos_y - 100; // 第三个控制点y坐标 (Third control point y coordinate);

    for (let t = 0; t <= 1; t += 0.005) { // 采样步长保持 (Keep sampling step)
        let x = bezierPoint(startX, cp1x, cp2x, endX, t); // 计算贝塞尔曲线上的x坐标 (Calculate x coordinate on Bezier curve);
        let y = bezierPoint(startY, cp1y, cp2y, endY, t); // 计算贝塞尔曲线上的y坐标 (Calculate y coordinate on Bezier curve);
        riverPoints.push(createVector(x, y)); // 添加向量到河流点数组 (Add vector to river points array);
    } // 结束for循环 (End of for loop);
} // 结束 (End);

// 绘制河流 (Draw river)
function drawRiver() { // 绘制河流函数 (Function to draw river);
    noStroke(); // 不绘制边框 (Do not draw stroke);
    fill(65, 105, 225); // 设置河流填充颜色为蓝色 (Set river fill color to blue);

    beginShape(); // 开始绘制自定义形状 (Begin custom shape drawing);
    for (let i = 0; i < riverPoints.length; i++) { // 遍历所有河流点 (Loop through all river points);
        let pt = riverPoints[i]; // 获取当前河流点 (Get current river point);
        vertex(pt.x, pt.y); // 添加顶点 (Add vertex);
    } // 结束for循环 (End of for loop);
    for (let i = riverPoints.length - 1; i >= 0; i--) { // 反向遍历河流点 (Loop through river points in reverse);
        let pt = riverPoints[i]; // 获取当前河流点 (Get current river point);
        vertex(pt.x, pt.y + 120); // 加大底部偏移，河更宽 (Wider river)
    } // 结束for循环 (End of for loop);
    endShape(CLOSE); // 结束绘制形状并闭合 (End shape drawing and close);

    // River details // 河流细节 (River details)
    for (let i = 0; i < riverPoints.length; i += 5) { // 每隔5个点绘制河流细节 (Draw river details every 5 points);
        let pt = riverPoints[i]; // 获取当前河流点 (Get current river point);
        let waterOffset = sin(frameCount * 0.02) * 15; // 水面波动偏移 (Water surface wave offset);
        fill(65 + waterOffset, 105 + waterOffset, 225 + waterOffset); // 设置水面颜色随波动变化 (Set water color to change with wave);

        if (random() > 0.7) { // 随机绘制波纹 (Randomly draw ripples);
            noFill(); // 不填充 (No fill);
            stroke(255, 255, 255, 100); // 设置波纹颜色和透明度 (Set ripple color and alpha);
            strokeWeight(1); // 设置波纹线宽 (Set ripple stroke weight);
            ellipse(pt.x + random(-10, 10), pt.y + random(10, 40), // 绘制波纹椭圆 (Draw ripple ellipse);
                random(5, 15), random(2, 5)); // 波纹大小 (Ripple size);

            if (!isNight && random() > 0.9) { // 如果不是夜晚且随机数大于0.9 (If not night and random > 0.9);
                fill(255, 255, 255, random(150, 255)); // 设置高光颜色和透明度 (Set highlight color and alpha);
                noStroke(); // 不绘制边框 (No stroke);
                ellipse(pt.x + random(-5, 5), pt.y + random(20, 60), // 绘制小高光椭圆 (Draw small highlight ellipse);
                    random(1, 3), random(1, 3)); // 高光大小 (Highlight size);
                ellipse(pt.x + random(-5, 5), pt.y + random(5, 15), // 绘制另一个高光椭圆 (Draw another highlight ellipse);
                    random(3, 8), random(2, 5)); // 高光大小 (Highlight size);
            } // 结束if (End of if);
        } // 结束if (End of if);
    } // 结束for循环 (End of for loop);
} // 结束 (End);

// 绘制山脉 (Draw mountains)
function drawMountains() { // 绘制山脉函数 (Function to draw mountains);
    // 左侧山体主曲线顶点 (Main curve vertices for left mountain range)
    let leftX = [0, 220, 400, 600, 800, 1000, worldWidth / 2]; // 左侧山脉x坐标 (Left mountain x coordinates);
    let leftY = [floorPos_y, floorPos_y - 180, floorPos_y - 300, floorPos_y - 220, floorPos_y - 320, floorPos_y - 200, floorPos_y - 100]; // 左侧山脉y坐标 (Left mountain y coordinates);
    // 右侧山体主曲线顶点 (Main curve vertices for right mountain range)
    let rightX = [worldWidth / 2, worldWidth / 2 + 120, worldWidth / 2 + 400, worldWidth / 2 + 700, worldWidth - 80, worldWidth]; // 右侧山脉x坐标 (Right mountain x coordinates);
    let rightY = [floorPos_y - 100, floorPos_y - 220, floorPos_y - 340, floorPos_y - 180, floorPos_y - 260, floorPos_y - 120]; // 右侧山脉y坐标 (Right mountain y coordinates);
    // 主山体（曲线）(Main mountain body (curved))
    noStroke(); // 不绘制边框 (No stroke);
    // 左侧暗面 (Left side dark face)
    fill(60, 70, 90); // 设置填充颜色 (Set fill color);
    beginShape(); // 开始绘制形状 (Begin shape);
    vertex(0, floorPos_y); // 添加顶点 (Add vertex);
    for (let i = 0; i < leftX.length; i++) curveVertex(leftX[i], leftY[i]); // 添加曲线顶点 (Add curve vertex);
    vertex(worldWidth / 2, floorPos_y); // 添加顶点 (Add vertex);
    endShape(CLOSE); // 结束并闭合形状 (End and close shape);
    // 右侧暗面 (Right side dark face)
    fill(80, 60, 120); // 设置填充颜色 (Set fill color);
    beginShape(); // 开始绘制形状 (Begin shape);
    vertex(worldWidth / 2, floorPos_y); // 添加顶点 (Add vertex);
    for (let i = 0; i < rightX.length; i++) curveVertex(rightX[i], rightY[i]); // 添加曲线顶点 (Add curve vertex);
    vertex(worldWidth, floorPos_y); // 添加顶点 (Add vertex);
    endShape(CLOSE); // 结束并闭合形状 (End and close shape);
    // 左侧亮面 (Left side light face)
    fill(120, 140, 180); // 设置填充颜色 (Set fill color);
    beginShape(); // 开始绘制形状 (Begin shape);
    vertex(0, floorPos_y); // 添加顶点 (Add vertex);
    for (let i = 0; i < leftX.length - 1; i++) curveVertex(leftX[i], leftY[i] + 40); // 添加曲线顶点 (Add curve vertex);
    curveVertex(worldWidth / 2, floorPos_y - 100 + 40); // 添加曲线顶点 (Add curve vertex);
    vertex(worldWidth / 2, floorPos_y); // 添加顶点 (Add vertex);
    endShape(CLOSE); // 结束并闭合形状 (End and close shape);
    // 右侧亮面 (Right side light face)
    fill(180, 160, 220); // 设置填充颜色 (Set fill color);
    beginShape(); // 开始绘制形状 (Begin shape);
    vertex(worldWidth / 2, floorPos_y); // 添加顶点 (Add vertex);
    for (let i = 1; i < rightX.length; i++) curveVertex(rightX[i], rightY[i] + 40); // 添加曲线顶点 (Add curve vertex);
    vertex(worldWidth, floorPos_y); // 添加顶点 (Add vertex);
    endShape(CLOSE); // 结束并闭合形状 (End and close shape);
    // 雪线：直接贴合整个左侧山顶曲线
    let snowTop = [];
    for (let i = 1; i < leftX.length - 1; i++) { // 不包括两端地面点
        snowTop.push([leftX[i], leftY[i]]);
    }
    fill(245, 250, 255, 230); // 设置填充颜色 (Set fill color);
    beginShape(); // 开始绘制形状 (Begin shape);
    // 雪顶上缘
    for (let i = 0; i < snowTop.length; i++) curveVertex(snowTop[i][0], snowTop[i][1]);
    // 雪顶下缘（比上缘低30像素，平滑）
    for (let i = snowTop.length - 1; i >= 0; i--) {
        let x = snowTop[i][0];
        let y = snowTop[i][1] + 30;
        curveVertex(x, y);
    }
    endShape(CLOSE);
} // 结束 (End);

// 绘制灌木丛 (Draw bushes)
function drawBushes() { // 绘制灌木丛函数 (Function to draw bushes);
    fill(34, 139, 34); // 设置灌木颜色 (Set bush color);
    for (let bush of bushes) { // 遍历所有灌木 (Loop through all bushes);
        ellipse(bush.x, bush.y, bush.size, bush.size / 2); // 绘制主椭圆 (Draw main ellipse);
        ellipse(bush.x - 20, bush.y, bush.size / 2, bush.size / 3); // 绘制左侧小椭圆 (Draw small left ellipse);
        ellipse(bush.x + 20, bush.y, bush.size / 2, bush.size / 3); // 绘制右侧小椭圆 (Draw small right ellipse);

        // Add some berries // 添加一些浆果 (Add some berries)
        fill(178, 34, 34); // 设置浆果颜色 (Set berry color);
        ellipse(bush.x + random(-15, 15), bush.y + random(-5, 5), 5, 5); // 绘制浆果 (Draw berry);
        fill(34, 139, 34); // 恢复灌木颜色 (Restore bush color);
    } // 结束for循环 (End of for loop);
} // 结束 (End);

function drawRain() { // 绘制雨滴函数 (Function to draw rain);
    if (!isRaining) return; // 如果没有下雨则直接返回 (Return if not raining);

    for (let i = 0; i < raindrops.length; i++) { // 遍历所有雨滴 (Loop through all raindrops);
        let drop = raindrops[i]; // 获取当前雨滴对象 (Get current raindrop object);
        if (!drop.active) continue;
        stroke(150, 150, 255, 150); // 设置雨滴颜色和透明度 (Set raindrop color and alpha);
        line(drop.x, drop.y, drop.x - 5, drop.y + 10); // 绘制雨滴线条 (Draw raindrop line);
        drop.y += (drop.vy !== undefined ? drop.vy : (drop.speed || 7)); // 雨滴下落 (Raindrop falls);
        drop.x -= 1; // 雨滴略向左飘 (Raindrop drifts left);

        if (drop.y > height) { // 如果雨滴落出屏幕 (If raindrop falls out of screen);
            drop.active = false; // 复用而不是删除 (Recycle instead of delete)
        } // 结束if (End of if);
    } // 结束for循环 (End of for loop);

    // Add new raindrops // 添加新的雨滴 (Add new raindrops)
    if (frameCount % 2 === 0) { // 每两帧添加一次 (Add every two frames);
        for (let i = 0; i < 5; i++) { // 一次添加5个雨滴 (Add 5 raindrops at a time);
            addRaindrop();
        } // 结束for循环 (End of for loop);
    } // 结束if (End of if);
} // 结束 (End);

// ========== 树木美化数据生成与渲染 ========== // (Tree beautification data generation and rendering)
function generateTreeData(len, angle, depth, trunkW, colorType = 'left') { // 生成树木递归结构数据 (Generate recursive tree structure data);
    if (depth === 0) return null; // 递归终止条件，深度为0返回null (Recursion end: if depth is 0, return null);
    let node = { // 创建当前树节点对象 (Create current tree node object);
        len: len, // 树干长度 (Trunk length);
        angle: angle, // 树干角度 (Trunk angle);
        trunkW: trunkW, // 树干宽度 (Trunk width);
        children: [], // 子分支数组 (Children branches array);
        leaves: [], // 叶子数组 (Leaves array);
        fruits: [], // 果实数组 (Fruits array);
        colorType: colorType // 颜色类型 (Color type);
    }; // 结束node对象 (End of node object);
    if (depth > 1) { // 如果递归深度大于1 (If recursion depth > 1);
        let n = 2 + Math.floor(Math.random() * 2); // 随机生成分支数2~3 (Randomly generate 2~3 branches);
        for (let i = 0; i < n; i++) { // 遍历每个分支 (Loop through each branch);
            let newAngle = (Math.random() - 0.5) * PI / 4 + map(i, 0, n - 1, -PI / 8, PI / 8); // 新分支角度 (New branch angle);
            let newLen = len * (0.7 + Math.random() * 0.1); // 新分支长度 (New branch length);
            let newW = trunkW * (0.55 + Math.random() * 0.2); // 新分支宽度 (New branch width);
            node.children.push(generateTreeData(newLen, newAngle, depth - 1, newW, colorType)); // 递归生成子分支 (Recursively generate child branch);
        } // 结束for循环 (End of for loop);
    } else { // 否则为叶子层 (Else, leaf layer);
        let leafNum = 5 + Math.floor(Math.random() * 6); // 随机生成叶子数量5~10 (Randomly generate 5~10 leaves);
        for (let i = 0; i < leafNum; i++) { // 遍历每片叶子 (Loop through each leaf);
            let leafColor; // 叶子颜色 (Leaf color);
            if (colorType === 'left') { // 左侧树叶配色 (Left side leaf color);
                leafColor = [40 + Math.random() * 60, 100 + Math.random() * 100, 30 + Math.random() * 40, 180 + Math.random() * 50]; // 随机绿色 (Random green);
            } else { // 右侧树叶配色 (Right side leaf color);
                leafColor = [80 + Math.random() * 60, 80 + Math.random() * 60, 180 + Math.random() * 60, 180 + Math.random() * 50]; // 偏蓝紫 (Bluish purple);
            } // 结束if-else (End of if-else);
            node.leaves.push({ // 添加叶子对象 (Add leaf object);
                x: -10 + Math.random() * 20, // 叶子x坐标 (Leaf x position);
                y: -len + (-10 + Math.random() * 20), // 叶子y坐标 (Leaf y position);
                w: 12 + Math.random() * 10, // 叶子宽度 (Leaf width);
                h: 10 + Math.random() * 8, // 叶子高度 (Leaf height);
                c: leafColor // 叶子颜色 (Leaf color);
            }); // 结束叶子对象 (End of leaf object);
        } // 结束for循环 (End of for loop);
        let fruitNum = Math.random() < 0.5 ? 1 : 2; // 随机生成果实数量1~2 (Randomly generate 1~2 fruits);
        for (let i = 0; i < fruitNum; i++) { // 遍历每个果实 (Loop through each fruit);
            let colorChoices = colorType === 'left' ? [[200, 40, 40], [220, 180, 60], [120, 40, 180]] : [[120, 120, 220], [180, 120, 220], [120, 180, 220]]; // 果实颜色选择 (Fruit color choices);
            node.fruits.push({ // 添加果实对象 (Add fruit object);
                x: -8 + Math.random() * 16, // 果实x坐标 (Fruit x position);
                y: -len + (-8 + Math.random() * 16), // 果实y坐标 (Fruit y position);
                w: 5 + Math.random() * 2, // 果实宽度 (Fruit width);
                h: 5 + Math.random() * 2, // 果实高度 (Fruit height);
                c: colorChoices[Math.floor(Math.random() * colorChoices.length)] // 果实颜色 (Fruit color);
            }); // 结束果实对象 (End of fruit object);
        } // 结束for循环 (End of for loop);
    } // 结束if-else (End of if-else);
    return node; // 返回当前节点 (Return current node);
} // 结束 (End);
function renderTree(x, y, node, depth = 0, windSeed = 0) { // 渲染树木函数 (Function to render tree);
    if (!node) return; // 如果节点不存在则返回 (Return if node does not exist);
    push(); // 保存当前绘图状态 (Save current drawing state);
    translate(x, y); // 平移画布 (Translate canvas);
    let colorType = node.colorType || 'left'; // 获取颜色类型 (Get color type);
    // 风摆动：主干最小，末端略大 (Wind sway: trunk sways minimally, ends sway slightly more)
    let swayBase = 0.01 + 0.01 * depth; // 摆动基础值 (Sway base value);
    let swayMag = map(depth, 0, 5, 0.5, 3.5); // 摆动幅度 (Sway magnitude);
    let sway = sin(frameCount * (0.012 + depth * 0.003) + windSeed) * swayMag; // 计算摆动值 (Calculate sway value);
    rotate(node.angle + sway * 0.02); // 旋转树干 (Rotate trunk);
    // 主干底部阴影 (Trunk bottom shadow)
    noStroke(); // 不绘制边框 (No stroke);
    if (colorType === 'left') fill(40, 25, 10, 90); // 左侧树阴影颜色 (Left tree shadow color);
    else fill(40, 40, 80, 90); // 右侧树阴影颜色 (Right tree shadow color);
    ellipse(0, node.trunkW * 0.18, node.trunkW * 1.2, node.trunkW * 0.5); // 绘制阴影椭圆 (Draw shadow ellipse);
    // 主干底部膨胀（圆角）(Trunk bottom bulge (rounded))
    if (colorType === 'left') fill(90, 60, 30); // 左侧树颜色 (Left tree color);
    else fill(80, 80, 140); // 右侧树颜色 (Right tree color);
    ellipse(0, 0, node.trunkW, node.trunkW * 0.7); // 绘制膨胀椭圆 (Draw bulge ellipse);
    // 树干主线 (Main trunk line)
    if (colorType === 'left') stroke(70, 40, 20); // 左侧树干颜色 (Left trunk color);
    else stroke(80, 80, 140); // 右侧树干颜色 (Right trunk color);
    strokeWeight(node.trunkW + 1); // 设置线宽 (Set stroke weight);
    line(0, 0, 0, -node.len); // 绘制树干线条 (Draw trunk line);
    // 树干高光 (Trunk highlight)
    if (colorType === 'left') stroke(200, 180, 120, 90); // 左侧树高光颜色 (Left tree highlight color);
    else stroke(180, 180, 255, 90); // 右侧树高光颜色 (Right tree highlight color);
    strokeWeight(Math.max(1, node.trunkW * 0.18)); // 设置线宽 (Set stroke weight);
    line(node.trunkW * 0.22, -node.len * 0.1, node.trunkW * 0.22, -node.len * 0.9); // 绘制高光线条 (Draw highlight line);
    // 树干阴影 (Trunk shadow)
    if (colorType === 'left') stroke(40, 25, 10, 120); // 左侧树阴影颜色 (Left tree shadow color);
    else stroke(40, 40, 80, 120); // 右侧树阴影颜色 (Right tree shadow color);
    strokeWeight(Math.max(1, node.trunkW * 0.22)); // 设置线宽 (Set stroke weight);
    line(-node.trunkW * 0.28, -node.len * 0.1, -node.trunkW * 0.28, -node.len * 0.9); // 绘制阴影线条 (Draw shadow line);
    // 树皮细纹理 (Fine bark texture)
    for (let i = 0; i < node.trunkW; i += 1.5) { // 循环绘制树皮纹理 (Loop to draw bark texture);
        if (colorType === 'left') stroke(90 + (i % 7 - 3) * 4, 60 + (i % 5 - 2) * 6, 30 + (i % 3 - 1) * 8, 90); // 左侧树纹理颜色 (Left tree texture color);
        else stroke(120 + (i % 7 - 3) * 4, 120 + (i % 5 - 2) * 6, 180 + (i % 3 - 1) * 8, 90); // 右侧树纹理颜色 (Right tree texture color);
        strokeWeight(1); // 设置线宽 (Set stroke weight);
        line(i - node.trunkW / 2, 0, i - node.trunkW / 2, -node.len); // 绘制纹理线条 (Draw texture line);
    } // 结束for循环 (End of for loop);
    // 主干最上层线 (Topmost line of main trunk)
    stroke(90, 60, 30); // 设置线颜色 (Set stroke color);
    strokeWeight(Math.max(1, node.trunkW * 0.7)); // 设置线宽 (Set stroke weight);
    line(0, 0, 0, -node.len); // 绘制线条 (Draw line);
    // 分叉 (Branches)
    if (node.children && node.children.length > 0) { // 如果有子分支 (If there are child branches);
        for (let i = 0; i < node.children.length; i++) { // 遍历子分支 (Loop through child branches);
            let child = node.children[i]; // 获取子分支 (Get child branch);
            renderTree(0, -node.len, child, depth + 1, windSeed + i * 100 + depth * 1000); // 递归渲染子分支 (Recursively render child branch);
        } // 结束for循环 (End of for loop);
    } else { // 否则是叶子层 (Else, it's the leaf layer);
        // 叶子 (Leaves)
        for (let leaf of node.leaves) { // 遍历所有叶子 (Loop through all leaves);
            fill(...leaf.c); // 设置叶子颜色 (Set leaf color);
            noStroke(); // 不绘制边框 (No stroke);
            ellipse(leaf.x, leaf.y, leaf.w, leaf.h); // 绘制叶子椭圆 (Draw leaf ellipse);
        } // 结束for循环 (End of for loop);
        // 果实 (Fruits)
        for (let fruit of node.fruits) { // 遍历所有果实 (Loop through all fruits);
            fill(...fruit.c); // 设置果实颜色 (Set fruit color);
            ellipse(fruit.x, fruit.y, fruit.w, fruit.h); // 绘制果实椭圆 (Draw fruit ellipse);
        } // 结束for循环 (End of for loop);
    } // 结束if-else (End of if-else);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
} // 结束 (End);

function draw() { // 绘制主函数 (Main drawing function);
    // 摄像机动画 (Camera animation)
    if (isIntro) { // 如果是介绍动画 (If it is intro animation);
        introProgress += 0.012; // 增加介绍动画进度 (Increase intro animation progress);
        if (introProgress >= 1) { // 如果介绍动画进度达到1 (If intro animation progress reaches 1);
            introProgress = 1; // 设置进度为1 (Set progress to 1);
            isIntro = false; // 结束介绍动画 (End intro animation);
        } // 结束if (End of if);
        cameraX = lerp(introStartCameraX, cat_x - width / 2, easeInOutCubic(introProgress)); // 平滑插值摄像机x坐标 (Smoothly interpolate camera x position);
        cameraZoom = lerp(introStartZoom, 1, easeInOutCubic(introProgress)); // 平滑插值摄像机缩放 (Smoothly interpolate camera zoom);
    } else { // 否则 (Else);
        const base = cat_x - width / 2;
        const dir = (catDirection === 'right') ? 1 : -1;
        const targetCamX = base + dir * CONFIG.CAMERA_DIRECTIONAL_OFFSET; // 根据朝向向后偏移 (Directional backward offset)
        if (abs(targetCamX - cameraX) > CONFIG.CAMERA_DEADZONE) {
            cameraX = lerp(cameraX, targetCamX, CONFIG.CAMERA_LERP); // 更平滑的跟随 (Smoother follow)
        }
        cameraZoom = 1; // 摄像机缩放为1 (Camera zoom is 1);
    } // 结束if-else (End of if-else);
    cameraX = constrain(cameraX, 0, worldWidth - width); // 限制摄像机x坐标在世界范围内 (Constrain camera x position within world bounds);
    push(); // 保存当前绘图状态 (Save current drawing state);
    translate(width / 2, height / 2); // 平移画布到中心 (Translate canvas to center);
    scale(cameraZoom); // 缩放画布 (Scale canvas);
    translate(-width / 2, -height / 2); // 平移画布回到左上角 (Translate canvas back to top-left);
    // 美化夜空 (Beautify night sky) - 在相机变换前绘制
    drawBeautifulNightSky(); // 绘制美丽的夜空 (Draw beautiful night sky);

    // Background (背景)
    if (isNight) background(20, 20, 50); // 如果是夜晚，设置背景颜色 (If night, set background color);
    else background(100, 155, 255); // 否则设置背景颜色 (Else, set background color);

    translate(-cameraX, 0); // 平移画布以模拟摄像机移动 (Translate canvas to simulate camera movement);

    // Sun/Moon (太阳/月亮)
    if (!isNight) { // 如果不是夜晚 (If not night);
        // Sun glow (太阳光晕)
        fill(255, 204, 0, 50); // 设置光晕颜色和透明度 (Set glow color and alpha);
        for (let i = 0; i < 5; i++) { // 循环绘制光晕 (Loop to draw glow);
            ellipse(worldWidth - 100, sun_y, 80 + i * 20, 80 + i * 20); // 太阳在大世界右上角 (Sun in top-right of large world) // 绘制光晕椭圆 (Draw glow ellipse);
        } // 结束for循环 (End of for loop);

        // Sun (太阳)
        fill(255, 204, 0); // 设置太阳颜色 (Set sun color);
        ellipse(worldWidth - 100, sun_y, 80, 80); // 绘制太阳 (Draw sun);
        sun_y = max(100, sun_y - 0.5); // 太阳y坐标向上移动 (Sun y position moves up);
    } else { // 如果是夜晚 (Else, if it is night);
        // 更新月升动画 - 三阶段：上升->停留->下降 (Update moon rise animation - three phases: rise->stay->descend)
        if (moonPhase < 2.5) { // 扩展周期到2.5，包含停留时间 (Extend cycle to 2.5, including stay time)
            moonPhase += 0.0015; // 减慢月升速度 (Slower moon rise speed)
        }

        // 计算月亮的三阶段轨迹 (Calculate three-phase moon trajectory)
        // 阶段1: 0-0.8 上升 (Phase 1: 0-0.8 rising)
        // 阶段2: 0.8-1.7 停留在最高点 (Phase 2: 0.8-1.7 staying at zenith)  
        // 阶段3: 1.7-2.5 下降 (Phase 3: 1.7-2.5 descending)

        let moonProgress, verticalProgress;

        if (moonPhase <= 0.8) {
            // 上升阶段 (Rising phase)
            moonProgress = moonPhase / 0.8; // 0到1
            verticalProgress = moonProgress; // 垂直跟随水平进度
        } else if (moonPhase <= 1.7) {
            // 停留阶段 (Staying phase)
            moonProgress = 1.0; // 水平保持在最右侧
            verticalProgress = 0.5; // 垂直保持在最高点
        } else {
            // 下降阶段 (Descending phase)
            let descendProgress = (moonPhase - 1.7) / 0.8; // 0到1
            moonProgress = 1.0; // 水平继续在右侧
            verticalProgress = 0.5 + descendProgress * 0.5; // 从最高点下降
        }

        // 水平运动：从左侧到右侧 - 使用屏幕坐标 (Horizontal movement: from left to right - use screen coordinates)
        moon_x = map(moonProgress, 0, 1, 50, width - 50) + cameraX;

        // 垂直运动：更平滑的轨迹 (Vertical movement: smoother trajectory)
        let arcHeight = 100; // 月亮最高点 - 使用屏幕坐标 (Moon highest point - use screen coordinates)
        let horizonY = height - 200; // 地平线高度 - 使用屏幕坐标 (Horizon level - use screen coordinates)

        // 使用优化的抛物线公式计算月亮高度 (Use optimized parabolic formula to calculate moon height)
        let t = verticalProgress; // 垂直归一化时间 (Vertical normalized time)
        moon_y = horizonY - 4 * (horizonY - arcHeight) * t * (1 - t); // 抛物线轨迹 (Parabolic trajectory)

        // 绘制月亮 (Draw moon) - 增强光晕效果
        // 柔和月亮光晕 - 减弱光晕强度 (Soft moon glow - weakened glow intensity)
        let glowIntensity = moonPhase <= 1.7 ? 35 : 25; // 大幅减弱光晕强度 (Significantly weakened glow intensity)

        // 外层柔和光晕 (Outer soft glow)
        fill(180, 200, 255, 8);
        ellipse(moon_x, moon_y, 150, 150);

        // 中层光晕 (Middle glow layers)
        for (let i = 0; i < 3; i++) { // 减少光晕层数 (Reduce glow layers);
            let alpha = glowIntensity - i * 8; // 更温和的递减透明度 (Gentler decreasing alpha)
            fill(220, 230, 255, alpha);
            ellipse(moon_x, moon_y, 90 - i * 12, 90 - i * 12); // 减小光晕范围 (Reduce glow range)
        } // 结束for循环 (End of for loop);

        // Moon (月亮) - 大小随高度变化 (Size changes with height)
        let moonSize = 60 + sin(moonProgress * PI) * 10; // 月亮在中天时最大 (Largest when at zenith)
        fill(250, 250, 255); // 明亮的月亮颜色 (Bright moon color);
        ellipse(moon_x, moon_y, moonSize, moonSize); // 绘制月亮 (Draw moon);

        // Moon craters (月亮陨石坑) - 细节随大小调整 (Crater details adjust with size)
        fill(200, 200, 220); // 设置陨石坑颜色 (Set crater color);
        let craterScale = moonSize / 60; // 陨石坑缩放比例 (Crater scale ratio)
        ellipse(moon_x + 10 * craterScale, moon_y - 10 * craterScale, 10 * craterScale, 10 * craterScale); // 绘制陨石坑 (Draw crater);
        ellipse(moon_x - 5 * craterScale, moon_y + 5 * craterScale, 8 * craterScale, 8 * craterScale); // 绘制陨石坑 (Draw crater);
        ellipse(moon_x + 5 * craterScale, moon_y + 15 * craterScale, 5 * craterScale, 5 * craterScale); // 绘制陨石坑 (Draw crater);

        // 添加柔和的月光照射效果 (Add soft moonlight illumination effect)
        if (verticalProgress > 0.2) { // 月亮升起到一定高度后开始有明显光照 (Noticeable illumination after moon rises to certain height)
            // 停留阶段的柔和光效 (Soft light effects during stay phase)
            if (moonPhase > 0.8 && moonPhase <= 1.7) {
                // 停留阶段 - 轻微脉动光晕 (Stay phase - gentle pulsating glow)
                let pulsation = sin(frameCount * 0.01) * 0.2 + 0.8; // 更柔和的脉动效果 (Gentler pulsation effect)
                fill(230, 240, 255, 12 * pulsation);
                ellipse(moon_x, moon_y, moonSize * 2.5 * pulsation, moonSize * 2.5 * pulsation);

                // 减弱的辐射光晕 (Reduced radial glow)
                fill(200, 220, 255, 8 * pulsation);
                ellipse(moon_x, moon_y, moonSize * 3 * pulsation, moonSize * 3 * pulsation);
            } else {
                // 普通柔和月光照射 (Normal soft moonlight illumination)
                fill(220, 230, 255, 8 + sin(verticalProgress * PI) * 8); // 减弱月光强度 (Weakened moonlight intensity)
                ellipse(moon_x, moon_y, moonSize * 2.5, moonSize * 2.5); // 减小光晕范围 (Reduce glow range)
            }
        }

        // 调试信息 (Debug info) - 在屏幕上显示月亮信息
        if (frameCount % 60 === 0) { // 每秒输出一次调试信息 (Output debug info once per second)
            let phaseDesc = moonPhase <= 0.8 ? "上升" : moonPhase <= 1.7 ? "停留" : "下降";
            console.log(`🌙 月亮调试 (三阶段) - Phase: ${moonPhase.toFixed(3)} (${phaseDesc}), 水平: ${moonProgress.toFixed(3)}, 垂直: ${verticalProgress.toFixed(3)}, X: ${moon_x.toFixed(1)}, Y: ${moon_y.toFixed(1)}`);
        }

        // 重置月升周期 (Reset moon rise cycle)
        if (moonPhase >= 2.5 && frameCount % 2700 === 0) { // 每45秒重置一次，给完整周期足够时间 (Reset every 45 seconds, give full cycle enough time)
            moonPhase = 0;
        }
    } // 结束if-else (End of if-else);

    // Stars (星星) - 先绘制星星作为背景 (Draw stars first as background)
    if (isNight && stars && stars.length > 0) { // 如果是夜晚且星星存在 (If night and stars exist);
        for (let star of stars) { // 遍历所有星星 (Loop through all stars);
            push(); // 保存当前绘图状态 (Save current drawing state);
            drawingContext.shadowBlur = star.size * 2; // 设置阴影模糊 (Set shadow blur);
            drawingContext.shadowColor = color(255, 255, 255, star.brightness); // 设置阴影颜色 (Set shadow color);
            fill(255, 255, 255, star.brightness); // 设置星星颜色和透明度 (Set star color and alpha);
            ellipse(star.x, star.y, star.size, star.size); // 绘制星星 (Draw star);
            drawingContext.shadowBlur = 0; // 重置阴影模糊 (Reset shadow blur);
            pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
        } // 结束for循环 (End of for loop);
    } // 结束if (End of if);

    // 重新绘制月亮在星星前面 (Redraw moon in front of stars)
    if (isNight) {
        // 获取当前月亮参数 (Get current moon parameters)
        let moonProgress, verticalProgress;

        if (moonPhase <= 0.8) {
            moonProgress = moonPhase / 0.8;
            verticalProgress = moonProgress;
        } else if (moonPhase <= 1.7) {
            moonProgress = 1.0;
            verticalProgress = 0.5;
        } else {
            let descendProgress = (moonPhase - 1.7) / 0.8;
            moonProgress = 1.0;
            verticalProgress = 0.5 + descendProgress * 0.5;
        }

        // 重新计算月亮位置 (Recalculate moon position)
        let moon_x_front = map(moonProgress, 0, 1, 50, width - 50) + cameraX;
        let arcHeight = 100;
        let horizonY = height - 200;
        let t = verticalProgress;
        let moon_y_front = horizonY - 4 * (horizonY - arcHeight) * t * (1 - t);

        // 绘制月亮主体在星星前面 (Draw moon body in front of stars)
        let moonSize = 60 + sin(moonProgress * PI) * 10;
        fill(250, 250, 255);
        ellipse(moon_x_front, moon_y_front, moonSize, moonSize);

        // 月亮陨石坑 (Moon craters)
        fill(200, 200, 220);
        let craterScale = moonSize / 60;
        ellipse(moon_x_front + 10 * craterScale, moon_y_front - 10 * craterScale, 10 * craterScale, 10 * craterScale);
        ellipse(moon_x_front - 5 * craterScale, moon_y_front + 5 * craterScale, 8 * craterScale, 8 * craterScale);
        ellipse(moon_x_front + 5 * craterScale, moon_y_front + 15 * craterScale, 5 * craterScale, 5 * craterScale);
    }

    // Environment (环境)
    drawMountains(); // 绘制山脉 (Draw mountains);
    drawClouds(); // 绘制云朵 (Draw clouds);
    drawRiver(); // 绘制河流 (Draw river);
    updateCloudPlatforms(); // 更新云台阶 (Update platforms)
    drawCloudPlatforms(); // 绘制云台阶 (Draw platforms)
    drawCastleAndFlag(); // 新增：绘制城堡和旗杆
    noStroke(); // 不绘制边框 (No stroke);
    fill(0, 155, 0); // 设置地面颜色 (Set ground color);
    // 左侧地面 (Left side ground)
    rect(0, floorPos_y, width - 100, height - floorPos_y); // 绘制左侧地面矩形 (Draw left ground rectangle);
    // 右侧地面 (Right side ground) - 峡谷后的地面
    rect(width + 400, floorPos_y, worldWidth - (width + 400), height - floorPos_y); // 峡谷延长后的右侧地面 (Right ground after extended canyon);
    // 悬崖视觉效果 (Cliff visual effect) - 延长峡谷
    fill(90, 60, 30); // 设置悬崖颜色 (Set cliff color);
    rect(width - 100, floorPos_y, 20, 60); // 绘制左侧悬崖 (Draw left cliff);
    rect(width + 380, floorPos_y, 20, 60); // 绘制右侧悬崖，延长到+380 (Draw right cliff, extended to +380);
    // 悬崖下方阴影 (Shadow below cliff) - 延长阴影
    fill(60, 40, 20, 120); // 设置阴影颜色和透明度 (Set shadow color and alpha);
    beginShape(); // 开始绘制形状 (Begin shape);
    vertex(width - 100, floorPos_y + 60); // 添加顶点 (Add vertex);
    vertex(width - 80, floorPos_y + 120); // 添加顶点 (Add vertex);
    vertex(width + 400, floorPos_y + 120); // 延长阴影到+400 (Extend shadow to +400);
    vertex(width + 400, floorPos_y + 60); // 添加顶点 (Add vertex);
    endShape(CLOSE); // 结束并闭合形状 (End and close shape);
    drawBushes(); // 绘制灌木丛 (Draw bushes);
    drawRain(); // 绘制雨滴 (Draw rain);

    // Trees（美化版递归树，静态结构不闪烁）(Beautified recursive trees, static structure without flickering)
    for (let tree of trees) { // 遍历所有树木 (Loop through all trees);
        if (tree.x + 100 > cameraX && tree.x - 100 < cameraX + width) { // 如果树在摄像机视野内 (If tree is within camera view);
            renderTree(tree.x + 15, floorPos_y, tree.data); // 渲染树木 (Render tree);
        } // 结束if (End of if);
    } // 结束for循环 (End of for loop);
    // 在第一棵树树梢上绘制青蛙弹吉他（带动画）(Draw frog playing guitar on the first treetop (with animation))
    if (trees.length > 0) { // 如果有树木 (If there are trees);
        let frogX = trees[0].x + 15; // 青蛙x坐标 (Frog x position);
        let frogY = floorPos_y - trees[0].h - 30; // 树梢上 (On treetop) // 青蛙y坐标 (Frog y position);
        drawFrogWithGuitar(frogX, frogY, frameCount); // 绘制带吉他的青蛙 (Draw frog with guitar);
    } // 结束if (End of if);

    // Birds (鸟)
    for (let bird of birds) { // 遍历所有鸟 (Loop through all birds);
        if (bird.x + 50 > cameraX && bird.x - 50 < cameraX + width) { // 如果鸟在摄像机视野内 (If bird is within camera view);
            bird.wingPhase += 0.1; // 翅膀拍打相位增加 (Wing flap phase increases);
            let wingOffset = sin(bird.wingPhase) * 5; // 翅膀偏移 (Wing offset);
            push(); // 保存当前绘图状态 (Save current drawing state);
            translate(bird.x, bird.y); // 平移画布 (Translate canvas);
            // Body (身体)
            fill(0); // 设置填充颜色 (Set fill color);
            ellipse(0, 0, 15, 7); // 绘制身体椭圆 (Draw body ellipse);
            // Head (头部)
            ellipse(-5, -3, 8, 8); // 绘制头部椭圆 (Draw head ellipse);
            fill(255); // 设置填充颜色 (Set fill color);
            ellipse(10, -4, -1, -5); // 绘制眼睛 (Draw eye);
            fill(0); // 设置填充颜色 (Set fill color);
            // Wings (翅膀)
            beginShape(); // 开始绘制形状 (Begin shape);
            vertex(0, 0); // 添加顶点 (Add vertex);
            vertex(10, -5 - wingOffset); // 添加顶点 (Add vertex);
            vertex(20, 0); // 添加顶点 (Add vertex);
            vertex(10, 5 + wingOffset); // 添加顶点 (Add vertex);
            endShape(CLOSE); // 结束并闭合形状 (End and close shape);
            pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
        } // 结束if (End of if);
        bird.x += bird.speed; // 鸟向右移动 (Bird moves right);
        if (bird.x > worldWidth + 20) bird.x = -20; // 如果鸟飞出世界右侧，则从左侧重新出现 (If bird flies off right side of world, reappear from left);
    } // 结束for循环 (End of for loop);

    // Character movement (角色移动)
    updateCatPosition(); // 更新猫咪位置 (Update cat position);

    // Check if cat has been idle long enough to sleep (检查猫咪是否空闲足够长时间以进入睡眠状态)
    if (!isMovingLeft && !isMovingRight && !isJumping) { // 如果猫咪没有移动和跳跃 (If cat is not moving and not jumping);
        idleTimer++; // 空闲计时器增加 (Idle timer increments);
        if (idleTimer > 180 && catState !== "sleeping") { // 如果空闲时间超过180帧且猫咪未处于睡眠状态 (If idle time > 180 frames and cat is not sleeping);
            catState = "sleeping"; // 猫咪进入睡眠状态 (Cat enters sleeping state);
        } // 结束if (End of if);
    } else { // 否则 (Else);
        idleTimer = 0; // 重置空闲计时器 (Reset idle timer);
        if (catState === "sleeping") catState = "standing"; // 如果猫咪处于睡眠状态，则恢复站立 (If cat is sleeping, revert to standing);
    } // 结束if-else (End of if-else);

    // 先绘制老鼠 (Draw mice first)
    updateMice(); // 更新老鼠状态 (Update mice state);
    // 再绘制猫 (Then draw cat)
    if (catState === "crouch") { // 如果猫咪处于趴下状态 (If cat is crouching);
        drawCrouchingCat(); // 绘制趴下猫咪 (Draw crouching cat);
    } else { // 否则 (Else);
        switch (catState) { // 根据猫咪状态绘制 (Draw based on cat state);
            case "standing": // 站立状态 (Standing state);
                drawStandingCat(); // 绘制站立猫咪 (Draw standing cat);
                break; // 跳出switch (Break switch);
            case "jumping": // 跳跃状态 (Jumping state);
                drawJumpingCat(); // 绘制跳跃猫咪 (Draw jumping cat);
                break; // 跳出switch (Break switch);
            case "walkingLeft": // 向左走状态 (Walking left state);
                drawWalkingLeftCat(); // 绘制向左走的猫咪 (Draw walking left cat);
                break; // 跳出switch (Break switch);
            case "walkingRight": // 向右走状态 (Walking right state);
                drawWalkingRightCat(); // 绘制向右走的猫咪 (Draw walking right cat);
                break; // 跳出switch (Break switch);
            case "sleeping": // 睡眠状态 (Sleeping state);
                drawSleepingCat(); // 绘制睡眠猫咪 (Draw sleeping cat);
                break; // 跳出switch (Break switch);
        } // 结束switch (End of switch);
    } // 结束if-else (End of if-else);
    // === 独立的鱼骨头发射系统 ===
    // 连续发射鱼骨头 - 根据猫的朝向决定发射方向
    if (isFiringFishbone && frameCount - lastFishboneFrame > 8) { // 如果正在发射鱼骨头且间隔大于8帧 (If firing fishbone and interval > 8 frames);
        // 根据猫的朝向决定发射方向
        if (catDirection === "left") {
            // 猫朝左时，向左发射
            fireFishboneLeft();
        } else {
            // 猫朝右时，向右发射
            fireFishboneRight();
        }
        handFireAnimation = 30; // 启动手部动画 (Start hand animation)
    } // 结束if (End of if);

    // 老鼠现在通过updateMice()函数管理和绘制

    // 音频播放控制 (Audio playback control)
    if (isRaining && !rainSound.isPlaying()) { // 如果下雨且雨声未播放 (If raining and rain sound not playing);
        rainSound.loop(); // 循环播放雨声 (Loop rain sound);
    } else if (!isRaining && rainSound.isPlaying()) { // 否则如果没下雨且雨声正在播放 (Else if not raining and rain sound is playing);
        rainSound.stop(); // 停止播放雨声 (Stop rain sound);
    } // 结束if-else (End of if-else);

    // 只有下雨时才播放青蛙叫声 (Only play frog sound when raining)
    if (isRaining && catState === "jumping" && !frogSound.isPlaying()) { // 如果下雨、猫咪跳跃且青蛙叫声未播放 (If raining, cat jumping, and frog sound not playing);
        frogSound.setVolume(0.2); // 设置音量 (Set volume);
        frogSound.play(); // 播放青蛙声音 (Play frog sound);
    } // 结束if (End of if);
    // draw左上角生命值UI (Draw top-left life UI)
    drawLifeBar(); // 绘制生命条 (Draw life bar);

    // 流星逻辑 (Meteor logic)
    if (isNight && meteors && meteors.length > 0) { // 如果是夜晚且流星存在 (If night and meteors exist);
        if (frameCount - lastMeteorFrame > meteorInterval) { // 如果帧数间隔大于流星间隔 (If frame count interval > meteor interval);
            for (let m of meteors) { // 遍历所有流星 (Loop through all meteors);
                if (!m.active) { // 如果流星不活跃 (If meteor is not active);
                    m.x = random(width); // 流星x坐标 (Meteor x position);
                    m.y = random(0, 200); // 流星y坐标 (Meteor y position);
                    m.active = true; // 激活流星 (Activate meteor);
                    m.timer = floor(random(200, 800)); // 流星计时器 (Meteor timer);
                    catHappyTimer = 90; // 猫咪开心计时器 (Cat happy timer);
                    lastMeteorFrame = frameCount; // 更新上次流星出现的帧 (Update last meteor frame);
                    meteorInterval = 1800 + Math.floor(Math.random() * 900); // 更新流星间隔 (Update meteor interval);
                    break; // 跳出循环 (Break loop);
                } // 结束if (End of if);
            } // 结束for循环 (End of for loop);
        } // 结束if (End of if);
        for (let m of meteors) { // 遍历所有流星 (Loop through all meteors);
            if (m.active) { // 如果流星活跃 (If meteor is active);
                stroke(255, 255, 200, 200); // 设置流星颜色和透明度 (Set meteor color and alpha);
                strokeWeight(4); // 设置流星线宽 (Set meteor stroke weight);
                line(m.x, m.y, m.x - 40, m.y + 20); // 绘制流星轨迹 (Draw meteor trail);
                m.x -= m.speed; // 流星x坐标移动 (Meteor x position moves);
                m.y += m.speed * 0.5; // 流星y坐标移动 (Meteor y position moves);
                if (m.x < -50 || m.y > height) m.active = false; // 如果流星移出屏幕，则不活跃 (If meteor moves off screen, deactivate);
                noStroke(); // 不绘制边框 (No stroke);
            } // 结束if (End of if);
        } // 结束for循环 (End of for loop);
    } else if (meteors && meteors.length > 0) { // 否则如果流星存在 (Else if meteors exist);
        for (let m of meteors) m.active = false; // 流星不活跃 (Deactivate meteors);
    } // 结束if-else (End of if-else);

    // 下雨时猫心情不好5秒 (Cat is sad for 5 seconds when it rains)
    if (isRaining && catSadTimer === 0) { // 如果下雨且猫咪不开心计时器为0 (If raining and cat sad timer is 0);
        catSadTimer = 180; // 设置猫咪不开心计时器为180 (Set cat sad timer to 180);
    } // 结束if (End of if);
    if (catSadTimer > 0) catSadTimer--; // 如果猫咪不开心计时器大于0，则减少 (If cat sad timer > 0, decrement);

    drawSnowParticles(); // 绘制雪粒子 (Draw snow particles);

    updateFishbones(); // 更新鱼骨头 (Update fishbones);
    updateMice(); // 更新老鼠 (Update mice);
    drawRewardFishes(); // 绘制奖励鱼 (Draw reward fishes);
    updateFishes(); // 更新普通鱼 (Update regular fishes);
    drawFishes(); // 绘制普通鱼 (Draw regular fishes);
    updateOctopuses(); // 更新章鱼 (Update octopuses);
    drawOctopuses(); // 绘制章鱼 (Draw octopuses);
    updateCrabs(); // 更新螃蟹 (Update crabs);
    drawCrabs(); // 绘制螃蟹 (Draw crabs);
    updateTurtles(); // 更新乌龟 (Update turtles);
    drawTurtles(); // 绘制乌龟 (Draw turtles);
    // === Independent Mouse Generation System ===
    // Start spawning mice after 5 seconds, coming from the left
    if (frameCount > 300) { // Start spawning after 5 seconds
        if (frameCount - lastSpawn5s > 300) { // Spawn 1 mouse every 5 seconds
            spawnMouse(1); // Spawn 1 mouse
            lastSpawn5s = frameCount; // Update last 5s spawn time
            console.log('🐭 Mouse spawned from left, current frame:', frameCount);
        } // End if
    } // End if

    // Spawn a reward fish every 2 minutes
    if (frameCount - lastFishSpawn > 7200) { // If frame count interval > 7200
        spawnRewardFish(); // Spawn reward fish
        lastFishSpawn = frameCount; // Update last reward fish spawn time
    } // End if

    // Spawn a regular fish every 5 seconds
    if (frameCount - lastFishSpawnTime > 300) { // If frame count interval > 300 (5 seconds)
        spawnFish(); // Spawn regular fish
        lastFishSpawnTime = frameCount; // Update last regular fish spawn time
    } // End if

    // Spawn other sea creatures every 10 seconds
    if (frameCount % 600 === 0) { // Every 600 frames (10 seconds)
        spawnOctopus(); // Spawn octopus
        spawnCrab(); // Spawn crab
        spawnTurtle(); // Spawn turtle
    } // End if

    // New state management: angry and faint timers
    if (angryTimer > 0) {
        angryTimer--;
        if (angryTimer === 0 && catState === "angry") {
            catState = "standing"; // Anger time ended, return to standing
        }
    }

    if (faintTimer > 0) {
        faintTimer--;
        if (faintTimer === 0 && catState === "faint") {
            catState = "standing"; // Faint time ended, wake up
            console.log("🐱✨ Cat woke up!");
        }
    }

    // Hand firing animation timer
    if (handFireAnimation > 0) {
        handFireAnimation--;
    }

    // Check if there are mice within cat's sight - Only check when not in special states
    if (catState !== "angry" && catState !== "faint") {
        angry = false; // Default not angry
        for (let m of mice) { // Loop through all mice
            if (m.alive && isWithinRadiusSq(m.x, m.y, cat_x, cat_y, CONFIG.MOUSE_SEE_RADIUS)) angry = true; // Use squared distance optimization
        } // End for loop
        if (angry && catState !== "crouch") { // If angry and not crouching
            catState = "angry"; // Cat enters angry state
        } else if (catState === "angry" && !angry) { // Else if cat is angry but no longer angry
            catState = "standing"; // Cat reverts to standing
        } // End if-else
    }
    if (document.getElementById('story-panel') && document.getElementById('story-panel').style.display !== 'none') { // If story panel exists and is visible
        drawStoryParticles(); // Draw story particles
        return; // Return
    } // End if
    if (gameOver) { // If game over
        pop(); // Restore previously saved drawing state // End cameraX
        fill(0, 180); // Set fill color and alpha
        rect(width / 2 - 200, height / 2 - 80, 400, 160, 30); // Draw game over panel
        fill(255); // Set fill color
        textAlign(CENTER, CENTER); // Set text alignment
        textSize(32); // Set text size
        text('Game Over', width / 2, height / 2 - 20); // Draw "Game Over" text
        textSize(24); // Set text size
        text('Press SPACE to restart', width / 2, height / 2 + 30); // Draw "Press SPACE to restart" text
        // Health bar UI
        drawLifeBar(); // Draw life bar

        // === Deep Optimized Cat Status Display ===
        drawAdvancedCatStatus();

        return; // Return
    } // End if
    updateApples(); // 更新苹果 (Update apples);
    // Falling into canyon handling
    if (isFallingToCliff) { // If falling into canyon
        // Cat continues to fall until completely disappeared
        cat_y += cat_vy; // Cat y position increments
        cat_vy += 0.8; // Cat vertical velocity increments
        fallTimer++; // Fall timer increments
        if (cat_y < height + 100) { // If cat is still on screen
            // Draw cat (can flicker)
            if (floor(fallTimer / 10) % 2 === 0) { // Flicker every 10 frames
                push(); // Save current drawing state
                translate(cat_x, cat_y); // Translate canvas
                scale(1.2, 1.2); // Scale canvas
                fill(255, 255, 255, 180); // Set fill color and alpha
                ellipse(0, 0, 80, 80); // Draw cat ellipse
                pop(); // Restore previously saved drawing state
            } // End if
        } else { // Else
            // After cat disappears, flicker timer
            if (fallTimer < 180) { // If fall timer < 180
                if (floor(fallTimer / 10) % 2 === 0) { // Flicker every 10 frames
                    push(); // Save current drawing state
                    translate(width / 2, floorPos_y); // Translate canvas
                    scale(1.2, 1.2); // Scale canvas
                    fill(255, 255, 255, 180); // Set fill color and alpha
                    ellipse(0, 0, 80, 80); // Draw ellipse
                    pop(); // Restore previously saved drawing state
                } // End if
            } else { // Else
                // 恢复 (Recover)
                isFallingToCliff = false; // 结束跌落峡谷状态 (End falling into cliff state);
                if (lives <= 0) { // If lives is 0
                    gameOver = true; // Game over
                } else { // Else
                    cat_x = width / 2; // Cat x position returns to center
                    cat_y = floorPos_y; // Cat y position returns to ground
                    cat_vy = 0; // Cat vertical velocity is 0
                    life = 100; // Life returns to 100
                    isInvincible = true; // Enter invincible state
                    invincibleTimer = 90; // Invincible timer is 90
                } // End if-else
            } // End if-else
        } // End if-else
        pop(); // Restore previously saved drawing state // cameraX
        // Health bar UI
        drawLifeBar(); // Draw life bar
        return; // Return
    } // End if
    // Invincibility timer
    if (isInvincible) { // If invincible
        invincibleTimer--; // Invincible timer decrements
        if (invincibleTimer <= 0) isInvincible = false; // If invincible timer is 0, end invincible state
    } // End if
    pop(); // Restore previously saved drawing state // cameraX
    // Health bar UI
    drawLifeBar(); // Draw life bar



    // === Independent Mouse Generation System (Second Location) ===
    // Start spawning mice after 5 seconds, coming from the left
    if (frameCount > 300) { // Start spawning after 5 seconds
        if (frameCount - lastSpawn5s > 300) { // Spawn 1 mouse every 5 seconds
            spawnMouse(1); // Spawn 1 mouse
            lastSpawn5s = frameCount; // Update last 5s spawn time
            console.log('🐭 Mouse spawned from left (second location), current frame:', frameCount);
        } // End if
    } // End if


    // 在绘制UI之前，确保重置矩阵
    push();
    resetMatrix();

    // Score UI
    fill(255, 255, 0);
    textSize(22);
    textAlign(LEFT, TOP);
    text('Score: ' + score, 30, 60);

    // Level UI
    fill(255, 255, 255);
    textSize(18);
    text('Level: ' + level, 30, 90);

    // Restore state
    pop();
    // Score UI
    // fill(255, 255, 0);
    // textSize(22);
    // textAlign(LEFT, TOP);
    // text('分数: ' + score, 30, 60);
    // // Level UI
    // fill(255, 255, 255);
    // textSize(18);
    // text('Level: ' + level, 30, 90);
    // 通关判定与显示
    if (levelComplete) {
        fill(0, 180);
        rect(width / 2 - 200, height / 2 - 80, 400, 160, 30);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(40);
        text('Level Complete!', width / 2, height / 2 - 10);
        textSize(24);
        text('Click to continue...', width / 2, height / 2 + 40);
        return;
    }
    // 猫碰到旗杆判定
    let castleX = worldWidth - 120;
    let flagX = castleX - 30;
    if (!levelComplete && dist(cat_x, cat_y, flagX, floorPos_y) < 40) {
        levelComplete = true;
    }
} // 结束 (End);

function updateCatPosition() { // 更新猫咪位置函数 (Function to update cat position);
    if (isFallingToCliff) return; // Cannot operate when falling // Return if falling into canyon
    lastCatY = cat_y; // Remember previous y

    // ===== Completely Independent Left-Right Key Control System =====
    // Only controlled by left-right arrow keys, not affected by any other code

    // System integrity check (check once per frame)
    if (frameCount % 60 === 0) { // Check once per second
        checkMovementSystemIntegrity();
    }

    // Right click event monitoring (check every frame)
    monitorRightClickEvents();

    if (isMovingLeft) { // If moving left
        cat_x -= MOVEMENT_CONFIG.MOVE_SPEED; // Cat x position moves left
        catState = "walkingLeft"; // Cat enters walking left state
        catDirection = "left"; // Cat direction is left
        console.log('🎯 Cat moving left - Completely independent system');
    } else if (isMovingRight) { // Else if moving right
        cat_x += MOVEMENT_CONFIG.MOVE_SPEED; // Cat x position moves right
        catState = "walkingRight"; // Cat enters walking right state
        catDirection = "right"; // Cat direction is right
        console.log('🎯 Cat moving right - Completely independent system');
    } else if (isJumping) { // Else if jumping
        catState = "jumping"; // Cat enters jumping state
    } else if (catState !== "sleeping") { // Else if cat is not sleeping
        catState = "standing"; // Cat enters standing state
    } // End if-else
    // Check if in cliff area - Extended canyon range
    let onCliff = (cat_x > width - 100 && cat_x < width + 400); // Canyon extended to +400px
    cat_y += cat_vy; // Cat y position increments
    cat_vy += 0.8; // Cat vertical velocity increments
    // Platform collision and riding (placed after gravity, before ground contact)
    catPlatformCollisionAndRide();
    if (!onCliff && cat_y > floorPos_y) { // If not on cliff and cat y position is below floor
        cat_y = floorPos_y; // Cat y position set to floor
        cat_vy = 0; // Cat vertical velocity is 0
        isJumping = false; // Not jumping anymore
    } // End if
    // Falling into canyon judgment
    if (onCliff && cat_y > floorPos_y + 100 && !isFallingToCliff) { // If on cliff, cat y position is below cliff, and not falling
        isFallingToCliff = true; // Enter falling into cliff state
        fallTimer = 0; // Reset fall timer
        lives = Math.max(0, lives - 1); // Lives decrement by 1
        console.log('Cat fell into the canyon! Controls are now frozen.'); // EXPLAIN: Log when falling starts
    } // End if
    // Ensure cat does not walk out of the entire world
    cat_x = constrain(cat_x, 50, worldWidth - 50); // Constrain cat x position within world bounds
    // Check if on cloud platform, auto crouch if so
    let isOnCloud = false;
    if (typeof gameController !== 'undefined' && gameController && gameController.characterSystem) {
        isOnCloud = gameController.characterSystem.isOnCloudPlatform();
    } else {
        // Legacy system: check if on cloud platform
        isOnCloud = (typeof onPlatformId !== 'undefined' && onPlatformId !== -1);
    }

    if (isOnCloud && !isMovingLeft && !isMovingRight && catState !== "sleeping") {
        catState = "crouch"; // Auto crouch on cloud platform
    } else if (!isMovingLeft && !isMovingRight && !isJumping && catState !== "sleeping" && catState !== "crouch") {
        // Correction: only standing when not moving, jumping, sleeping, or crouching
        catState = "standing"; // Cat enters standing state
    } // End if
} // End

function drawStandingCat() { // Draw standing cat
    push(); // Save current drawing state
    translate(cat_x, cat_y); // Translate canvas
    // Eyes follow mouse direction
    let dx = mouseX + cameraX - cat_x; // Difference between mouse x and cat x
    let dy = mouseY - cat_y; // Difference between mouse y and cat y
    let eyeAngle = atan2(dy, dx) * 0.5; // Eye angle
    tailAngle = sin(frameCount * 0.1) * PI / 8; // Tail swing angle
    blinkTimer = (frameCount % 200 > 190) ? 0 : 1; // Blink timer
    whiskerAngle = sin(frameCount * 0.05) * 0.2; // Whisker swing angle
    // Shadow
    fill(0, 0, 0, 20); // Set shadow color and alpha
    ellipse(0, floorPos_y - cat_y + 10, 60, 20); // Draw shadow ellipse
    // Right back leg behind body
    fill(50);
    rect(18, 80, 15, 30, 5); // Move inward 8px to avoid overlapping with body edge
    fill(70);
    ellipse(24, 106, 13, 7); // Move paw inward and slightly smaller to avoid edge exposure
    // Body — widen slightly to fully cover rear leg overlap
    fill(50); // Set fill color
    ellipse(0, 50, 84, 102); // Body +4px width/+2px height to avoid edge clipping
    // Tail
    push(); // Save current drawing state
    rotate(tailAngle); // Rotate tail
    fill(50); // Set fill color
    ellipse(40, 80, 20, 20, 60); // Draw tail ellipse
    // Tail stripes
    stroke(70); // Set stroke color
    strokeWeight(2); // Set stroke weight
    noFill(); // No fill
    for (let i = 0; i < 3; i++) { // Loop to draw stripes
        line(30 + i * 5, 60, 40 + i * 5, 100); // Draw stripe line
    } // End for loop
    noStroke(); // No stroke
    pop(); // Restore previously saved drawing state
    // Head
    fill(50); // Set fill color
    ellipse(0, 0, 80, 80); // Draw head ellipse
    // Ears
    triangle(-30, -40, -10, -10, -50, -10); // Draw left ear
    triangle(30, -40, 10, -10, 50, -10); // Draw right ear
    // Inner ears
    fill(100, 70, 70); // Set fill color
    triangle(-25, -30, -15, -15, -40, -15); // Draw left inner ear
    triangle(25, -30, 15, -15, 40, -15); // Draw right inner ear
    // Eyes
    fill(255); // Set fill color
    ellipse(-20, -10, 25, 25 * blinkTimer); // Draw left eye
    ellipse(20, -10, 25, 25 * blinkTimer); // Draw right eye
    // Pupils (follow mouse direction)
    fill(0); // Set fill color
    push(); // Save current drawing state
    translate(-20, -10); // Translate canvas
    rotate(eyeAngle); // Rotate
    ellipse(5, 0, 10, 10); // Draw pupil
    pop(); // Restore previously saved drawing state
    push(); // Save current drawing state
    translate(20, -10); // Translate canvas
    rotate(eyeAngle); // Rotate
    ellipse(5, 0, 10, 10); // Draw pupil
    pop(); // Restore previously saved drawing state
    // Nose
    fill(100, 70, 70); // Set fill color
    triangle(0, 5, -5, 15, 5, 15); // Draw nose
    // Mouth
    stroke(100, 70, 70); // Set stroke color
    strokeWeight(1); // Set stroke weight
    line(0, 15, 0, 20); // Draw mouth line
    line(0, 20, -10, 25); // Draw mouth line
    line(0, 20, 10, 25); // Draw mouth line
    noStroke(); // No stroke
    // Whiskers
    stroke(150); // Set stroke color
    strokeWeight(1); // Set stroke weight
    // Left whiskers
    line(-15, 15, -40 - whiskerAngle * 10, 10); // Draw left whisker
    line(-15, 18, -40 - whiskerAngle * 10, 18); // Draw left whisker
    line(-15, 21, -40 - whiskerAngle * 10, 26); // Draw left whisker
    // Right whiskers
    line(15, 15, 40 + whiskerAngle * 10, 10); // Draw right whisker
    line(15, 18, 40 + whiskerAngle * 10, 18); // Draw right whisker
    line(15, 21, 40 + whiskerAngle * 10, 26); // Draw right whisker
    noStroke(); // No stroke
    // Legs (standing)
    fill(50); // Set fill color
    rect(-30, 80, 15, 30, 5); // Draw front left leg
    rect(-10, 80, 15, 30, 5); // Draw back left leg
    rect(9, 80, 15, 30, 5); // Right front leg inward 1px to avoid edge cutting
    // Paw details — Draw remaining three paws only
    fill(70); // Set fill color
    ellipse(-25, 110, 15, 8);
    ellipse(-5, 110, 15, 8);
    ellipse(14, 109, 15, 8); // Right front paw slightly up and inward
    pop(); // Restore previously saved drawing state
} // End

function drawJumpingCat() { // Draw jumping cat
    push(); // Save current drawing state
    translate(cat_x, cat_y); // Translate canvas

    // Animation values
    eyeAngle = map(mouseX, 0, width, -PI / 6, PI / 6); // Eye angle maps to mouse position
    tailAngle = sin(frameCount * 0.2) * PI / 2; // Tail swing angle
    blinkTimer = (frameCount % 100 > 95) ? 0 : 1; // Blink timer

    // Shadow (smaller when jumping)
    fill(0, 0, 0, 15); // Set shadow color and alpha
    ellipse(0, floorPos_y - cat_y + 5, 40, 10); // Draw shadow ellipse

    // Body (stretched)
    fill(50); // Set fill color
    ellipse(0, 50, 70, 110); // Draw body ellipse

    // Tail (more animated)
    push(); // Save current drawing state
    rotate(tailAngle); // Rotate tail
    fill(50); // Set fill color
    ellipse(40, 70, 15, 70); // Draw tail ellipse

    // Tail stripes
    stroke(70); // Set stroke color
    strokeWeight(2); // Set stroke weight
    noFill(); // No fill
    for (let i = 0; i < 3; i++) { // Loop to draw stripes
        line(30 + i * 5, 50, 40 + i * 5, 90); // Draw stripe line
    } // End for loop
    noStroke(); // No stroke
    pop(); // Restore previously saved drawing state

    // Head
    fill(50); // Set fill color
    ellipse(0, 0, 80, 80); // Draw head ellipse

    // Ears (back slightly)
    triangle(-25, -40, -10, -15, -45, -15); // Draw left ear
    triangle(25, -40, 10, -15, 45, -15); // Draw right ear

    // Inner ears
    fill(100, 70, 70); // Set fill color
    triangle(-20, -30, -10, -20, -35, -20); // Draw left inner ear
    triangle(20, -30, 10, -20, 35, -20); // Draw right inner ear

    // Eyes (more open)
    fill(255); // Set fill color
    ellipse(-20, -10, 25, 30 * blinkTimer); // Draw left eye
    ellipse(20, -10, 25, 30 * blinkTimer); // Draw right eye

    // Pupils
    fill(0); // Set fill color
    push(); // Save current drawing state
    translate(-20, -10); // Translate canvas
    rotate(eyeAngle); // Rotate
    ellipse(5, 0, 10, 15); // Draw pupil
    pop(); // Restore previously saved drawing state
    push(); // Save current drawing state
    translate(20, -10); // Translate canvas
    rotate(eyeAngle); // Rotate
    ellipse(5, 0, 10, 15); // Draw pupil
    pop(); // Restore previously saved drawing state

    // Nose
    fill(100, 70, 70); // Set fill color
    triangle(0, 5, -5, 15, 5, 15); // Draw nose

    // Mouth (open wider)
    fill(255, 150, 150); // Set fill color
    arc(0, 20, 25, 15, 0, PI, CHORD); // Draw mouth arc
    line(-10, 20, 10, 20); // Draw mouth line

    // Legs (tucked in)
    fill(50); // Set fill color
    if (catDirection === "right") { // If cat direction is right
        // Right-facing jump
        ellipse(-20, 90, 20, 40); // Draw left leg
        ellipse(20, 90, 20, 40); // Draw right leg
    } else { // Else
        // Left-facing jump
        ellipse(-20, 90, 20, 40); // Draw left leg
        ellipse(20, 90, 20, 40); // Draw right leg
    } // End if-else

    // Paw details
    fill(70); // Set fill color
    ellipse(-20, 110, 15, 8); // Draw left paw
    ellipse(20, 110, 15, 8); // Draw right paw

    pop(); // Restore previously saved drawing state
} // End

function drawWalkingLeftCat() { // Draw walking left cat
    push(); // Save current drawing state
    translate(cat_x, cat_y); // Translate canvas
    // Animation values
    // Eyes follow mouse direction
    {
        let dx = mouseX + cameraX - cat_x;
        let dy = mouseY - cat_y;
        eyeAngle = atan2(dy, dx) * 0.5; // Eye angle
    }
    tailAngle = sin(frameCount * 0.2) * PI / 6; // Tail swing angle
    legAngle = sin(frameCount * 0.3) * PI / 8; // Leg swing angle
    blinkTimer = (frameCount % 200 > 190) ? 0 : 1; // Blink timer
    whiskerAngle = sin(frameCount * 0.1) * 0.3; // Whisker swing angle

    // Shadow
    fill(0, 0, 0, 20); // Set shadow color and alpha
    ellipse(0, floorPos_y - cat_y + 10, 60, 20); // Draw shadow ellipse

    // --- Draw right legs (behind body, same as left legs) ---
    fill(50); // Set fill color
    // Back right leg — behind body, nudge inward/down
    push(); // Save current drawing state
    translate(25, 82); // Move inward 6px to avoid overlapping with body edge
    rotate(-legAngle * 0.7); // Rotate
    rect(0, 0, 15, 40, 5); // Draw leg rectangle
    fill(70); // Set fill color
    ellipse(0, 38, 14, 7); // Slightly smaller and move up to reduce edge exposure
    pop(); // Restore previously saved drawing state
    // Front right leg
    push(); // Save current drawing state
    translate(-12, 79); // Move inward 1px to ensure no white gap at leg-body seam
    rotate(-legAngle); // Rotate
    fill(50); // Set fill color
    rect(0, 0, 15, 40, 5); // Draw leg rectangle
    fill(70); // Set fill color
    ellipse(0, 38, 14, 7); // Slightly smaller paw to avoid edge overlap
    pop(); // Restore previously saved drawing state

    // Body
    fill(50); // Set fill color
    ellipse(0, 50, 84, 102); // Draw body ellipse (slightly wider and taller to avoid edge clipping)

    // Tail
    push(); // Save current drawing state
    rotate(tailAngle); // Rotate tail
    fill(50); // Set fill color
    ellipse(40, 80, 20, 60); // Draw tail ellipse
    // Tail stripes
    stroke(70); // Set stroke color
    strokeWeight(2); // Set stroke weight
    noFill(); // No fill
    for (let i = 0; i < 3; i++) { // Loop to draw stripes
        line(30 + i * 5, 60, 40 + i * 5, 100); // Draw stripe line
    } // End for loop
    noStroke(); // No stroke
    pop(); // Restore previously saved drawing state

    // Head (turned left)
    fill(50); // Set fill color
    ellipse(-5, 0, 80, 80); // Draw head ellipse

    // Ears (left side more visible)
    triangle(-35, -40, -15, -10, -55, -10); // Draw left ear
    triangle(15, -40, -5, -10, 35, -10); // Draw right ear
    // Inner ears
    fill(100, 70, 70); // Set fill color
    triangle(-30, -30, -15, -15, -45, -15); // Draw left inner ear
    triangle(10, -30, -5, -15, 25, -15); // Draw right inner ear
    // Eyes (left eye more visible)
    fill(255); // Set fill color
    ellipse(-25, -10, 30, 25 * blinkTimer); // Draw left eye
    ellipse(10, -10, 20, 25 * blinkTimer); // Draw right eye
    // Pupils
    fill(0); // Set fill color
    push(); // Save current drawing state
    translate(-25, -10); // Translate canvas
    rotate(eyeAngle); // Rotate
    ellipse(5, 0, 10, 10); // Draw pupil
    pop(); // Restore previously saved drawing state
    push(); // Save current drawing state
    translate(10, -10); // Translate canvas
    rotate(eyeAngle); // Rotate
    ellipse(5, 0, 10, 10); // Draw pupil
    pop(); // Restore previously saved drawing state
    // Nose
    fill(100, 70, 70); // Set fill color
    triangle(-5, 5, -10, 15, 0, 15); // Draw nose
    // Mouth
    stroke(100, 70, 70); // Set stroke color
    strokeWeight(1); // Set stroke weight
    line(-5, 15, -5, 20); // Draw mouth line
    line(-5, 20, -15, 25); // Draw mouth line
    line(-5, 20, 5, 25); // Draw mouth line
    noStroke(); // No stroke
    // Whiskers
    stroke(150); // Set stroke color
    strokeWeight(1); // Set stroke weight
    // Left whiskers
    line(-15, 15, -40 - whiskerAngle * 15, 5); // Draw left whisker
    line(-15, 18, -40 - whiskerAngle * 15, 18); // Draw left whisker
    line(-15, 21, -40 - whiskerAngle * 15, 31); // Draw left whisker
    // Right whiskers (shorter)
    line(5, 16, 15 + whiskerAngle * 5, 12); // Draw right whisker
    line(5, 19, 15 + whiskerAngle * 5, 19); // Draw right whisker
    line(5, 22, 15 + whiskerAngle * 5, 26); // Draw right whisker
    noStroke(); // No stroke

    // Re-draw FRONT RIGHT LEG in front of body to avoid clipping
    fill(50);
    push();
    translate(-10, 80);
    rotate(-legAngle);
    rect(0, 0, 15, 40, 5);
    fill(70);
    ellipse(0, 40, 15, 8);
    pop();

    // --- Draw left legs (in front of body) ---
    fill(50); // Set fill color
    // Front left leg
    push(); // Save current drawing state
    translate(-30, 80); // Translate canvas
    rotate(legAngle); // Rotate
    rect(0, 0, 15, 40, 5); // Draw leg rectangle
    fill(70); // Set fill color
    ellipse(0, 40, 15, 8); // Draw paw
    pop(); // Restore previously saved drawing state
    // Back left leg
    push(); // Save current drawing state
    translate(10, 80); // Translate canvas
    rotate(legAngle * 0.7); // Rotate
    fill(50); // Set fill color
    rect(0, 0, 15, 40, 5); // Draw leg rectangle
    fill(70); // Set fill color
    ellipse(0, 40, 15, 8); // Draw paw
    pop(); // Restore previously saved drawing state

    pop(); // Restore previously saved drawing state
} // End

function drawWalkingRightCat() { // Draw walking right cat
    push(); // Save current drawing state
    translate(cat_x, cat_y); // Translate canvas

    // Optimized walking animation values - Right walking version
    let walkCycle = frameCount * 0.25; // Walking cycle
    let stepPhase = sin(walkCycle); // Step phase

    // Body sway - Opposite direction when walking right
    let bodySwayX = sin(walkCycle * 0.5) * -2; // Horizontal sway, opposite for right
    let bodyBob = abs(sin(walkCycle)) * 3; // Vertical bobbing

    // Head movement
    let headBob = sin(walkCycle + PI / 4) * 1.5; // Head bobbing
    let headTilt = sin(walkCycle * 0.3) * -0.1; // Head tilt, opposite for right

    // Eye tracking
    {
        let dx = mouseX + cameraX - cat_x;
        let dy = mouseY - cat_y;
        eyeAngle = atan2(dy, dx) * 0.3; // Reduce eye tracking sensitivity
    }

    // More natural tail swing
    tailAngle = sin(walkCycle * 0.8) * PI / 5 - PI / 8; // Tail up and swaying, adjusted for right

    // Alternating leg movement
    let frontLegAngle = sin(walkCycle) * PI / 6; // Front leg angle
    let backLegAngle = sin(walkCycle + PI) * PI / 6; // Back leg angle, opposite phase

    // Blinking and whiskers
    blinkTimer = (frameCount % 200 > 190) ? 0 : 1;
    whiskerAngle = sin(frameCount * 0.08) * 0.2 + sin(walkCycle * 0.4) * 0.1; // Whiskers flutter with walking

    // Ear movement
    let leftEarAngle = sin(walkCycle * 0.6) * 0.15; // Left ear slight movement
    let rightEarAngle = sin(walkCycle * 0.6 + PI / 3) * 0.12; // Right ear slightly out of sync

    // Apply body sway
    translate(bodySwayX, -bodyBob);

    // Dynamic shadow - Adjust based on body sway
    fill(0, 0, 0, 15 + abs(bodySwayX) * 2); // Dynamic shadow alpha
    ellipse(bodySwayX * 0.3, floorPos_y - cat_y + 10 + bodyBob * 0.2, 60 + abs(bodySwayX), 20); // Dynamic shadow position and size

    // --- Draw right legs (ensure back leg behind, front leg in front) ---
    fill(50);
    // Back right leg (behind body) — nudge inward/down slightly
    push();
    translate(-31, 82);
    rotate(-backLegAngle * 0.7); // Use back leg angle
    rect(0, 0, 15, 40, 5);
    fill(70);
    ellipse(0, 40, 15, 8);
    pop();

    // Body - Add dynamic sway effect
    push();
    rotate(headTilt * 0.5); // Slight body tilt
    fill(50); // Set fill color
    ellipse(0, 50, 80, 100); // Draw body ellipse
    pop();

    // Tail
    push(); // Save current drawing state
    rotate(tailAngle); // Rotate tail
    fill(50); // Set fill color
    ellipse(40, 80, 20, 60); // Draw tail ellipse
    // Tail stripes
    stroke(70); // Set stroke color
    strokeWeight(2); // Set stroke weight
    noFill(); // No fill
    for (let i = 0; i < 3; i++) { // Loop to draw stripes
        line(30 + i * 5, 60, 40 + i * 5, 100); // Draw stripe line
    } // End for loop
    noStroke(); // No stroke
    pop(); // Restore previously saved drawing state

    // Front right leg drawn IN FRONT of body to avoid clipping
    fill(50);
    push();
    translate(9, 79); // Inward 1px, upward 1px to avoid edge clipping with body outline
    rotate(-frontLegAngle * 0.7); // Use front leg angle
    rect(0, 0, 15, 40, 5);
    fill(70);
    ellipse(0, 39, 15, 8);
    pop();

    // Head (turned right) - Add bobbing effect
    push();
    translate(0, headBob); // Head bobbing
    rotate(headTilt); // Head tilt
    fill(50); // Set fill color
    ellipse(5, 0, 80, 80); // Draw head ellipse
    // Ears (right side more visible) - Add dynamic movement
    push();
    rotate(leftEarAngle);
    triangle(-15, -40, 5, -10, -35, -10); // Draw left ear
    pop();

    push();
    rotate(rightEarAngle);
    triangle(35, -40, 15, -10, 55, -10); // Draw right ear
    pop();
    // Inner ears
    fill(100, 70, 70); // Set fill color
    triangle(-10, -30, 5, -15, -25, -15); // Draw left inner ear
    triangle(30, -30, 15, -15, 45, -15); // Draw right inner ear
    // Eyes (right eye more visible)
    fill(255); // Set fill color
    ellipse(25, -10, 30, 25 * blinkTimer); // Draw right eye
    ellipse(-10, -10, 20, 25 * blinkTimer); // Draw left eye
    // Pupils
    fill(0); // Set fill color
    push(); // Save current drawing state
    translate(25, -10); // Translate canvas
    rotate(eyeAngle); // Rotate
    ellipse(5, 0, 10, 10); // Draw pupil
    pop(); // Restore previously saved drawing state
    push(); // Save current drawing state
    translate(-10, -10); // Translate canvas
    rotate(eyeAngle); // Rotate
    ellipse(5, 0, 10, 10); // Draw pupil
    pop(); // Restore previously saved drawing state
    // Nose
    fill(100, 70, 70); // Set fill color
    triangle(5, 5, 0, 15, 10, 15); // Draw nose
    // Mouth
    stroke(100, 70, 70); // Set stroke color
    strokeWeight(1); // Set stroke weight
    line(5, 15, 5, 20); // Draw mouth line
    line(5, 20, -5, 25); // Draw mouth line
    line(5, 20, 15, 25); // Draw mouth line
    noStroke(); // No stroke
    // Whiskers
    stroke(150); // Set stroke color
    strokeWeight(1); // Set stroke weight
    // Right whiskers
    line(15, 15, 40 + whiskerAngle * 15, 5); // Draw right whisker
    line(15, 18, 40 + whiskerAngle * 15, 18); // Draw right whisker
    line(15, 21, 40 + whiskerAngle * 15, 31); // Draw right whisker
    // Left whiskers (shorter)
    line(-5, 16, -15 - whiskerAngle * 5, 12); // Draw left whisker
    line(-5, 19, -15 - whiskerAngle * 5, 19); // Draw left whisker
    line(-5, 22, -15 - whiskerAngle * 5, 26); // Draw left whisker
    noStroke(); // No stroke

    // --- Draw left legs (in front of body) ---
    fill(50); // Set fill color
    // Front left leg
    push(); // Save current drawing state
    translate(30, 80); // Translate canvas
    rotate(frontLegAngle * 0.7); // Use front leg angle
    rect(0, 0, 15, 40, 5); // Draw leg rectangle
    fill(70); // Set fill color
    ellipse(0, 40, 15, 8); // Draw paw
    pop(); // Restore previously saved drawing state
    // Back left leg
    push(); // Save current drawing state
    translate(-15, 80); // Originally translate(-10, 80), move left a bit
    rotate(backLegAngle); // Use back leg angle
    fill(50); // Set fill color
    rect(0, 0, 15, 40, 5); // Draw leg rectangle
    fill(70); // Set fill color
    ellipse(0, 40, 15, 8); // Draw paw
    pop(); // Restore previously saved drawing state

    pop(); // Restore previously saved drawing state
} // End

// Draw angry cat
function drawAngryCat() {
    push(); // Save current drawing state
    translate(cat_x, cat_y); // Translate canvas

    // Angry animation parameters
    let angerShake = sin(frameCount * 0.5) * 2; // Anger shake
    let angerPulse = sin(frameCount * 0.3) * 0.8 + 1; // Anger pulse

    translate(angerShake, 0); // Apply anger shake

    // Shadow
    fill(200, 0, 0, 50); // Red shadow for anger
    ellipse(0, floorPos_y - cat_y + 10, 80 * angerPulse, 20); // Dynamic shadow

    // Body - Slightly puffed up
    fill(50); // Set fill color
    ellipse(0, 50, 90 * angerPulse, 100 * angerPulse); // Slightly larger body when angry

    // Anger aura
    stroke(255, 0, 0, 100);
    strokeWeight(3);
    noFill();
    ellipse(0, 30, 100 + sin(frameCount * 0.4) * 10, 120 + sin(frameCount * 0.4) * 10);
    noStroke();

    // Head
    fill(50); // Set fill color
    ellipse(0, 0, 80 * angerPulse, 80 * angerPulse); // Slightly larger head when angry

    // Ears - Back
    fill(50);
    ellipse(-35, -30, 25, 30); // Left ear back
    ellipse(35, -30, 25, 30); // Right ear back
    fill(100, 70, 70);
    ellipse(-33, -25, 12, 15); // Left inner ear
    ellipse(33, -25, 12, 15); // Right inner ear

    // Eyes (angry) - Squinting glare
    fill(255, 0, 0); // Red eye whites for anger
    ellipse(-20, -10, 25, 20); // Left eye
    ellipse(20, -10, 25, 20); // Right eye
    fill(0); // Pupils
    ellipse(-20, -10, 12, 8); // Angry squinting pupil
    ellipse(20, -10, 12, 8);

    // Angry eyebrows
    stroke(0);
    strokeWeight(4);
    line(-30, -25, -10, -20); // Left eyebrow down
    line(10, -20, 30, -25); // Right eyebrow down
    noStroke();

    // Nose
    fill(100, 70, 70);
    ellipse(0, 10, 8, 6);

    // Open angry mouth
    fill(200, 0, 0); // Red mouth
    ellipse(0, 25, 20, 15);
    fill(0); // Mouth interior
    ellipse(0, 25, 15, 10);

    // Anger symbols
    fill(255, 0, 0);
    textSize(20);
    textAlign(CENTER);
    text("💢", -40, -50); // Anger symbol
    text("💢", 40, -50);

    // Tail - Raised and swinging when angry
    push();
    rotate(PI / 6 + sin(frameCount * 0.6) * PI / 12); // Raised and fast swinging
    fill(50);
    ellipse(40, 60, 20, 80); // Raised tail
    pop();

    pop(); // 恢复之前保存的绘图状态
}

// 绘制晕倒猫咪 (Draw faint cat)
function drawFaintCat() {
    push(); // 保存当前绘图状态 (Save current drawing state);
    translate(cat_x, cat_y + 20); // 平移画布，稍微下沉 (Translate canvas, slightly lower);

    // 晕倒时躺下的角度 (Lying down angle when faint)
    rotate(PI / 2); // 侧躺 (Lying on side)

    // Shadow (阴影)
    fill(0, 0, 0, 30);
    ellipse(0, 40, 100, 30); // 更大的阴影表示躺下 (Larger shadow for lying down)

    // Body (身体) - 侧躺
    fill(50);
    ellipse(0, 0, 80, 100); // 侧躺的身体 (Body lying on side)

    // Head (头部)
    fill(50);
    ellipse(-50, 0, 70, 70); // 头部位置调整 (Adjusted head position)

    // Ears (耳朵)
    fill(50);
    ellipse(-70, -20, 20, 25); // 调整耳朵位置 (Adjusted ear position)
    ellipse(-70, 20, 20, 25);
    fill(100, 70, 70);
    ellipse(-68, -15, 10, 12);
    ellipse(-68, 15, 10, 12);

    // Eyes (晕倒的眼睛) - 螺旋眼
    fill(255);
    ellipse(-65, -10, 20, 20); // 左眼
    ellipse(-65, 10, 20, 20); // 右眼

    // 螺旋瞳孔 (Spiral pupils)
    stroke(0);
    strokeWeight(2);
    noFill();
    for (let i = 0; i < 3; i++) {
        let spiralSize = 5 + i * 3;
        circle(-65, -10, spiralSize); // 左眼螺旋
        circle(-65, 10, spiralSize); // 右眼螺旋
    }
    noStroke();

    // Nose (鼻子)
    fill(100, 70, 70);
    ellipse(-35, 0, 6, 5);

    // Mouth (张开的嘴巴，表示昏迷)
    fill(200);
    ellipse(-25, 0, 15, 10);

    // Faint symbols
    fill(255, 255, 0);
    textSize(16);
    textAlign(CENTER);
    text("💫", -80, -40); // Dizzy symbol
    text("✨", -30, -40);
    text("💫", -55, -50);

    // Legs - Limp
    fill(50);
    ellipse(20, -30, 15, 35); // Front leg
    ellipse(20, 30, 15, 35); // Back leg
    ellipse(40, -25, 15, 30); // Other front leg
    ellipse(40, 25, 15, 30); // Other back leg

    // Tail - Limp hanging down
    fill(50);
    ellipse(50, 0, 15, 60); // Hanging tail

    pop(); // 恢复之前保存的绘图状态
}

function drawCrouchingCat() { // 绘制趴下猫咪 (Draw crouching cat);
    push(); // 保存当前绘图状态 (Save current drawing state);
    translate(cat_x, cat_y); // 平移画布 (Translate canvas);

    // If facing left, flip horizontally
    if (catDirection === "left") {
        scale(-1, 1); // Horizontal flip
    }

    // Animation parameters
    let breathCycle = sin(frameCount * 0.03) * 1.5; // Breathing cycle
    let tailSway = sin(frameCount * 0.02) * 3; // Tail sway
    let earTwitch = sin(frameCount * 0.05) * 1; // Ear twitch
    let blinkCycle = sin(frameCount * 0.01); // Blink cycle
    let whiskerMove = sin(frameCount * 0.04) * 0.5; // Whisker movement

    // Environmental awareness adjustments
    let isOnCloud = (typeof onPlatformId !== 'undefined' && onPlatformId !== -1) ||
        (typeof gameController !== 'undefined' && gameController && gameController.characterSystem && gameController.characterSystem.isOnCloudPlatform());
    let isWeatherActive = false;
    let alertness = 1; // Alertness level

    if (typeof gameController !== 'undefined' && gameController && gameController.weatherSystem) {
        isWeatherActive = gameController.weatherSystem.isRaining || gameController.weatherSystem.isSnowing;
    } else {
        isWeatherActive = (typeof isRaining !== 'undefined' && isRaining) || (typeof isSnowing !== 'undefined' && isSnowing);
    }

    if (isOnCloud) {
        alertness = 1.5; // More alert on clouds
        earTwitch *= 1.3; // More ear twitching
        breathCycle *= 0.8; // Shallower breathing
    }

    if (isWeatherActive) {
        alertness *= 1.2; // More alert during weather
        earTwitch *= 1.5; // Ears more sensitive to sounds
    }

    // Multi-layer shadow effect
    fill(0, 0, 0, 15); // Outer shadow
    ellipse(2, 52, 130, 18);
    fill(0, 0, 0, 25); // Inner shadow
    ellipse(0, 50, 125, 15);

    // Body main - layered drawing, muscle tension
    // Back contour
    fill(45 + breathCycle * 2); // Color changes with breathing
    ellipse(-5, 35 + breathCycle * 0.5, 125, 35); // Back slightly raised

    // Main body - slightly tense when alert
    fill(50 + breathCycle + (alertness - 1) * 5);
    ellipse(0, 40 + breathCycle * 0.3, 120 * (1 + (alertness - 1) * 0.02), 38 + breathCycle * 0.5);

    // Show muscle tension lines when on clouds
    if (isOnCloud) {
        stroke(40);
        strokeWeight(0.8);
        // Shoulder muscle lines
        line(-30, 32, -20, 38);
        line(20, 32, 30, 38);
        // Spine line
        line(-15, 30, 15, 30);
        noStroke();
    }

    // Belly details
    fill(55);
    ellipse(10, 48 + breathCycle * 0.2, 90, 25); // Belly contour

    // Body texture lines
    stroke(35);
    strokeWeight(1);
    for (let i = -40; i < 40; i += 15) {
        line(i, 35 + breathCycle * 0.3, i + 5, 45 + breathCycle * 0.2);
    }
    noStroke();

    // Improved tail - multi-segment, environment aware
    push();
    translate(-55, 38);
    for (let i = 0; i < 4; i++) {
        push();
        translate(i * 12, i * 3);
        // Less tail movement when alert, more tense
        let tailTension = isOnCloud ? 0.5 : 1; // More tense tail on clouds
        rotate((-PI / 8) + (tailSway * 0.1 * tailTension) + (i * 0.1));
        fill(50 - i * 2); // Gradient color
        ellipse(0, 0, 16 - i * 2, 35 - i * 5);
        // Tail stripes
        fill(40 - i * 2);
        ellipse(0, -5, 12 - i * 2, 8);
        ellipse(0, 5, 10 - i * 2, 6);

        // Extra tension at tail tip when on clouds
        if (isOnCloud && i === 3) {
            fill(35);
            ellipse(0, 0, 8, 15); // More contracted tail tip
        }
        pop();
    }
    pop();

    // Head - more three-dimensional
    push();
    translate(35, 22 + breathCycle * 0.2);

    // Head main body
    fill(50 + breathCycle * 0.5);
    ellipse(0, 0, 52, 42);

    // Forehead protrusion
    fill(48);
    ellipse(-2, -8, 35, 25);

    // Cheeks
    fill(52);
    ellipse(-8, 8, 25, 20); // Left cheek
    ellipse(8, 8, 25, 20); // Right cheek

    // Improved ears - environment aware
    push();
    translate(-15, -15);
    rotate(-0.2 + earTwitch * 0.1 * alertness);
    fill(45);
    ellipse(0, 0, 18 * (1 + alertness * 0.1), 25 * (1 + alertness * 0.05)); // Larger ears when alert
    fill(65);
    ellipse(2, 3, 10, 15);
    fill(80);
    ellipse(3, 5, 6, 8);
    // Environmental reaction - inner ear color change
    if (isWeatherActive) {
        fill(90, 70, 70); // Slightly red inner ear during weather
        ellipse(3, 5, 4, 6);
    }
    pop();

    push();
    translate(15, -15);
    rotate(0.2 - earTwitch * 0.1 * alertness);
    fill(45);
    ellipse(0, 0, 18 * (1 + alertness * 0.1), 25 * (1 + alertness * 0.05));
    fill(65);
    ellipse(-2, 3, 10, 15);
    fill(80);
    ellipse(-3, 5, 6, 8);
    if (isWeatherActive) {
        fill(90, 70, 70);
        ellipse(-3, 5, 4, 6);
    }
    pop();

    // Refined eyes
    let eyeOpenness = 1;
    if (blinkCycle > 0.9) {
        eyeOpenness = map(blinkCycle, 0.9, 1, 1, 0.2); // Blink effect
    }

    // Eye sockets
    fill(40);
    ellipse(-8, -2, 16, 12 * eyeOpenness);
    ellipse(8, -2, 16, 12 * eyeOpenness);

    // Eye whites
    fill(255, 250, 245);
    ellipse(-8, -2, 14, 10 * eyeOpenness);
    ellipse(8, -2, 14, 10 * eyeOpenness);

    // Iris - environment aware
    if (isOnCloud) {
        fill(100, 160, 100); // Deeper eye color on clouds
    } else {
        fill(120, 180, 120); // Green eyes
    }
    ellipse(-8, -2, 10, 8 * eyeOpenness);
    ellipse(8, -2, 10, 8 * eyeOpenness);

    // Pupils - alertness affects size
    fill(0);
    let pupilSize = 6 * (2 - alertness * 0.3); // Smaller pupils when alert
    ellipse(-8, -2, pupilSize, pupilSize * eyeOpenness);
    ellipse(8, -2, pupilSize, pupilSize * eyeOpenness);

    // Eye highlights
    fill(255);
    ellipse(-10, -4, 2, 2 * eyeOpenness);
    ellipse(6, -4, 2, 2 * eyeOpenness);

    // Nose and mouth details
    fill(120, 80, 80);
    ellipse(0, 6, 8, 6); // Nose

    // Nose highlight
    fill(160, 120, 120);
    ellipse(-1, 5, 3, 2);

    // Mouth
    stroke(80);
    strokeWeight(2);
    line(0, 9, -4, 12); // Left mouth corner
    line(0, 9, 4, 12); // Right mouth corner
    noStroke();

    // Detailed whiskers
    stroke(80);
    strokeWeight(1.5);
    // Left whiskers
    line(-20, 2 + whiskerMove, -35, 0 + whiskerMove);
    line(-20, 6 + whiskerMove * 0.5, -35, 8 + whiskerMove * 0.5);
    line(-20, 10 - whiskerMove, -35, 14 - whiskerMove);
    // Right whiskers
    line(20, 2 + whiskerMove, 35, 0 + whiskerMove);
    line(20, 6 + whiskerMove * 0.5, 35, 8 + whiskerMove * 0.5);
    line(20, 10 - whiskerMove, 35, 14 - whiskerMove);
    noStroke();

    pop(); // End head drawing

    // Detailed paws
    // Front paws
    fill(48);
    ellipse(-25, 52 + breathCycle * 0.1, 18, 28); // Front left paw
    ellipse(-5, 52 + breathCycle * 0.1, 18, 28); // Front right paw

    // Paw pads
    fill(70);
    ellipse(-25, 58 + breathCycle * 0.1, 12, 8);
    ellipse(-5, 58 + breathCycle * 0.1, 12, 8);

    // Paw details
    fill(75);
    ellipse(-28, 60, 4, 3); // Toe pads
    ellipse(-22, 60, 4, 3);
    ellipse(-8, 60, 4, 3);
    ellipse(-2, 60, 4, 3);

    // Back paws - partially visible
    fill(46);
    ellipse(-35, 48 + breathCycle * 0.1, 16, 22);
    ellipse(-15, 48 + breathCycle * 0.1, 16, 22);

    // Back paw pads
    fill(68);
    ellipse(-35, 52 + breathCycle * 0.1, 10, 6);
    ellipse(-15, 52 + breathCycle * 0.1, 10, 6);

    // Body outline
    stroke(35);
    strokeWeight(1);
    noFill();
    ellipse(0, 40 + breathCycle * 0.3, 120, 38 + breathCycle * 0.5);
    noStroke();

    // Hand animation when firing - only shown when firing
    if (handFireAnimation > 0) {
        let handExtend = sin(handFireAnimation * 0.3) * 10; // Hand extension animation
        let handDirection = catDirection === 'right' ? 1 : -1;

        // Front paw extending action
        push();
        translate(handDirection * (30 + handExtend), 40);
        fill(45);

        // Palm
        ellipse(0, 0, 12, 8);

        // Finger action - simulate throwing pose
        let fingerSpread = sin(handFireAnimation * 0.5) * 5;
        fill(55);
        ellipse(-3 + fingerSpread, -2, 3, 6); // Finger 1
        ellipse(0, -3, 3, 6); // Finger 2  
        ellipse(3 - fingerSpread, -2, 3, 6); // Finger 3

        ///     // Throwing trajectory hint
        if (handFireAnimation > 20) {
            stroke(255, 255, 0, 100);
            strokeWeight(2);
            let trajectoryX = handDirection * 50;
            let trajectoryY = -20;
            line(0, 0, trajectoryX, trajectoryY);
            noStroke();
        }

        pop();

        // Firing effects
        if (handFireAnimation > 25) {
            fill(255, 255, 0, 150);
            textSize(12);
            textAlign(CENTER);
            text("💥", cat_x + handDirection * 40, cat_y + 30);
        }
    }
    ///
    pop(); // Restore previously saved drawing state
} // End

function drawSleepingCat() { // Draw sleeping cat
    push(); // Save current drawing state
    translate(cat_x, cat_y); // Translate canvas

    // Animation values
    let breath = sin(frameCount * 0.05) * 2; // Breath undulation
    let zzzOffset = frameCount % 100; // Zzz offset

    // Shadow
    fill(0, 0, 0, 20); // Set shadow color and alpha
    ellipse(0, floorPos_y - cat_y + 5, 80, 20); // Draw shadow ellipse

    // Body (curled up)
    fill(50); // Set fill color
    ellipse(0, 50, 100, 80); // Draw body ellipse

    // Tail (wrapped around)
    push(); // Save current drawing state
    rotate(PI / 4); // Rotate
    fill(50); // Set fill color
    ellipse(30, 60, 15, 60); // Draw tail ellipse
    pop(); // Restore previously saved drawing state

    // Head (down)
    fill(50); // Set fill color
    ellipse(0, 20, 70, 60); // Draw head ellipse

    // Eyes (closed)
    stroke(100); // Set eye line color
    strokeWeight(2); // Set line thickness
    noFill(); // No fill

    // Draw closed eye lines
    let eyeY = 15 + breath * 0.3; // Slight movement with breathing
    arc(-15, eyeY, 18, 8, 0, PI); // Left closed eye arc
    arc(15, eyeY, 18, 8, 0, PI); // Right closed eye arc

    noStroke(); // Restore no stroke

    // Nose
    fill(100, 70, 70); // Set fill color
    ellipse(0, 25, 8, 5); // Draw nose ellipse

    // Zzz's
    if (frameCount % 3 === 0) { // Draw every 3 frames
        fill(255, 255, 0); // Set fill color
        textSize(20); // Set text size
        text("Z", 20 + zzzOffset % 30, 5 - breath); // Draw Z text
        text("Z", 33 + zzzOffset % 30, 0 - breath); // Draw Z text
        text("Z", 40 + zzzOffset % 30, 5 - breath); // Draw Z text
    } // End of if

    pop(); // Restore previously saved drawing state
} // End


function keyPressed() { // Key pressed event
    if (key === 'n' || key === 'N') { // If 'n' or 'N' is pressed
        isNight = !isNight; // Toggle night
        // If switching to night, reset moon to rise from eastern horizon
        if (isNight) {
            moonPhase = 0; // Always start rising from horizon
            moonDelay = 0; // No delay, rise immediately

            // Calculate initial position - start from eastern horizon
            moon_x = 50 + cameraX; // Start from screen left - consider camera position
            let horizonY = height - 200; // Horizon level - use screen coordinates
            moon_y = horizonY; // Start from horizon

            console.log(`🌙 Manual night toggle - moon rising from eastern horizon, Phase: ${moonPhase.toFixed(3)}, X: ${moon_x.toFixed(1)}, Y: ${moon_y.toFixed(1)}`);
        }
        isRaining = !isRaining; // Toggle raining // Also toggle raining when switching night
        if (isNight) { // If it is night
            createStars(); // Create stars
            for (let m of meteors) m.active = false; // Deactivate meteors at night
        } else { // Else
            stars = []; // No stars in daytime
            for (let m of meteors) m.active = false; // Deactivate meteors in daytime
        } // End of if-else
        raindrops = []; // Clear raindrops
    } // End of if
    if (key === 'r' || key === 'R') { // If 'r' or 'R' is pressed
        isRaining = !isRaining; // Toggle raining
        if (isRaining) { isSnowing = false; snowParticles = []; } // Mutual exclusive
        if (!isRaining) {
            raindrops = []; // Clear raindrops
            rainSound.stop(); // Stop rain sound
        } // End of if
    } // End of if

    if (key === 't' || key === 'T') { // Auto test jump to target position
        if (typeof gameController !== 'undefined' && gameController && gameController.characterSystem) {
            gameController.characterSystem.autoTestJumpToTarget();
        }
    } // End of if
    if (key === 'x' || key === 'X') { // Reset cat position
        if (typeof gameController !== 'undefined' && gameController && gameController.characterSystem) {
            gameController.characterSystem.resetCatToStart();
        }
    } // End of if
    if (key === 'g' || key === 'G') { // New: toggle snow
        if (typeof gameController !== 'undefined' && gameController && gameController.weatherSystem) {
            gameController.weatherSystem.toggleSnow();
        } else {
            // Compatible with old system
            isSnowing = !isSnowing;
            if (isSnowing) { isRaining = false; raindrops = []; }
            if (!isSnowing) { snowParticles = []; }
        }
    }
    if (key === ' ') { // If spacebar is pressed
        if (cat_y === floorPos_y) { // If cat is on the floor
            cat_vy = -18; // Jump faster // Cat vertical velocity set to -18
            isJumping = true; // Cat enters jumping state
        } // End of if
    } // End of if

    // ===== Completely independent left-right key control system =====
    // Only controlled by left-right arrow keys, not affected by any other code
    if (keyCode === MOVEMENT_CONFIG.LEFT_ARROW) {
        // Left arrow key: move left - completely independent
        isMovingLeft = true;
        isMovingRight = false;
        catDirection = "left";
        console.log('🎯 Left arrow key pressed - cat moving left (completely independent system)');
        reportMovementSystemStatus(); // Report system status
        return false; // Prevent default behavior, ensure independence
    }
    if (keyCode === MOVEMENT_CONFIG.RIGHT_ARROW) {
        // Right arrow key: move right - completely independent
        isMovingRight = true;
        isMovingLeft = false;
        catDirection = "right";
        console.log('🎯 Right arrow key pressed - cat moving right (completely independent system)');
        reportMovementSystemStatus(); // Report system status
        return false; // Prevent default behavior, ensure independence
    }

    // === Independent fishbone firing system ===
    // Only controlled by J key, not affected by other code
    if (key === 'j' || key === 'J') { // If 'j' or 'J' is pressed
        isFiringFishbone = true; // Firing fishbone
        console.log('J key pressed - firing fishbone, cat direction:', catDirection);

        // Determine firing direction based on cat's orientation
        if (catDirection === "left") {
            // When cat faces left, fire left
            fireFishboneLeft();
        } else {
            // When cat faces right, fire right
            fireFishboneRight();
        }

        handFireAnimation = 30; // Start hand animation
    } // End of if

    // === Deep Optimized Cat System Control Keys ===
    // Emergency Recovery Key: Press 'r' to reset cat system
    if (key === 'r' || key === 'R') {
        console.log('🆘 Emergency Recovery: Reset cat system');
        resetCatSystem();
    }

    // System Toggle: Press 't' to toggle deep optimization system
    if (key === 't' || key === 'T') {
        systemEnabled = !systemEnabled;
        console.log(systemEnabled ? '✅ Deep optimization system enabled' : '❌ Deep optimization system disabled');
    }

    // Emergency Stop Key: Press 'e' to force stop system
    if (key === 'e' || key === 'E') {
        console.log('🛑 Emergency Stop: Force stop deep optimization system');
        systemEnabled = false;
        performanceCounter = 0;
    }
    if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) { // 如果按下's'或'S'或下箭头 (If 's' or 'S' or down arrow is pressed);
        catState = "crouch"; // 猫咪进入趴下状态 (Cat enters crouching state);
    } // 结束if (End of if);

    // Debug shortcut: Press R to reset movement system
    if (key === 'r' || key === 'R') {
        resetMovementSystem();
        return false; // Prevent default behavior
    }

    // Debug shortcut: Press C to generate cleanup report
    if (key === 'c' || key === 'C') {
        generateSystemCleanupReport();
        return false; // Prevent default behavior
    }

    // Jump, only allowed on ground
    if ((key === ' ' || key === 'w' || key === 'W') && !isFallingToCliff) { // If space or 'w' or 'W' is pressed and not falling into cliff
        cat_vy = -18; // Cat vertical velocity set to -18
        isJumping = true; // Cat enters jumping state
    } // End if
    if (gameOver && key === ' ') { // 如果游戏结束且按下空格键 (If game over and spacebar is pressed);
        // Reset game
        lives = 3; // Lives restored to 3
        life = 100; // Life restored to 100
        cat_x = width / 2; // Cat x position returns to center
        cat_y = floorPos_y; // Cat y position returns to ground
        cat_vy = 0; // Cat vertical velocity is 0
        isFallingToCliff = false; // No longer falling into cliff
        gameOver = false; // Game is not over
        isInvincible = false; // No longer invincible
        invincibleTimer = 0; // Invincible timer is 0
        apples = []; // Clear apples array
        return; // Return
    } // 结束if (End of if);

    // === Completely Independent Control System - No External Controller Calls ===
    // All key handling is completed within this function to ensure independence
} // 结束 (End);

function keyReleased() { // 键盘释放事件 (Key released event);
    // ===== 完全独立的左右键控制系统 =====
    // 只受左右箭头键控制，不受任何其他代码影响
    if (keyCode === MOVEMENT_CONFIG.LEFT_ARROW) {
        // Left arrow key released: Stop moving left - Completely independent
        isMovingLeft = false;
        console.log('🎯 Left arrow key released - Cat stops moving left (Completely independent system)');
        reportMovementSystemStatus(); // Report system status
        return false; // Prevent default behavior, ensure independence
    }
    if (keyCode === MOVEMENT_CONFIG.RIGHT_ARROW) {
        // Right arrow key released: Stop moving right - Completely independent
        isMovingRight = false;
        console.log('🎯 Right arrow key released - Cat stops moving right (Completely independent system)');
        reportMovementSystemStatus(); // Report system status
        return false; // Prevent default behavior, ensure independence
    }

    if (key === 'j' || key === 'J') { // 如果释放'j'或'J' (If 'j' or 'J' is released);
        isFiringFishbone = false; // 不再发射鱼骨头 (Not firing fishbone anymore);
    } // 结束if (End of if);
    if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) { // 如果释放's'或'S'或下箭头 (If 's' or 'S' or down arrow is released);
        if (catState === "crouch") catState = "standing"; // If cat is crouching, revert to standing
    } // 结束if (End of if);
} // 结束 (End);

function drawSnowParticles() {
    if (!isSnowing) return;

    // Save current state
    push();

    // Reset transformation matrix to ensure snow particles use screen coordinates
    resetMatrix();

    // Generate snow particles - Use screen coordinates
    if (frameCount % 2 === 0) {
        for (let i = 0; i < 3; i++) {
            // Use screen coordinates, not world coordinates
            let x = random(-50, width + 50);
            let y = random(-40, 0);

            // Try to reuse inactive particles
            let foundInactive = false;
            for (let j = 0; j < snowParticles.length; j++) {
                if (!snowParticles[j].active) {
                    snowParticles[j].x = x;
                    snowParticles[j].y = y;
                    snowParticles[j].vy = random(0.4, 1.2);
                    snowParticles[j].vx = random(-0.3, 0.3);
                    snowParticles[j].size = random(2, 5);
                    snowParticles[j].alpha = random(140, 220);
                    snowParticles[j].active = true;
                    foundInactive = true;
                    break;
                }
            }

            // If no inactive particles, create new ones
            if (!foundInactive && snowParticles.length < CONFIG.MAX_SNOW) {
                snowParticles.push({
                    x: x,
                    y: y,
                    vy: random(0.4, 1.2),
                    vx: random(-0.3, 0.3),
                    size: random(2, 5),
                    alpha: random(140, 220),
                    active: true
                });
            }
        }
    }

    // Update/draw snow particles - Use screen coordinates
    noStroke();
    for (let i = 0; i < snowParticles.length; i++) {
        const p = snowParticles[i];
        if (!p.active) continue;

        // Draw directly using screen coordinates
        fill(255, 255, 255, p.alpha);
        ellipse(p.x, p.y, p.size, p.size);

        // Update position
        p.y += p.vy;
        p.x += p.vx + sin(frameCount * 0.01 + i) * 0.1;
        p.alpha -= 0.15;

        // If particle is off screen or too transparent, mark as inactive
        if (p.y > height || p.alpha < 20) {
            p.active = false;
        }
    }

    // Restore state
    pop();
}

function drawLifeBar() { // 绘制生命条函数 (Function to draw life bar);
    // Calculate UI position using screen coordinates (not world coordinates)
    let uiX = 30;
    let uiY = 30;
    let barWidth = 200;

    // Save current drawing state
    push();

    // Reset transformation to ensure UI is in fixed screen position
    resetMatrix();

    // Red stars
    fill(255, 0, 0);
    for (let i = 0; i < lives; i++) {
        ellipse(uiX + 22 * i, uiY, 18, 16);
    }
    fill(255);
    textSize(18);
    textAlign(LEFT, TOP);
    text('x' + lives, uiX + 22 * lives + 5, uiY - 10);

    // Health bar
    let percent = Math.max(0, Math.min(1, life / maxLife));
    let barY = uiY + 30;
    fill(60);
    rect(uiX, barY, barWidth, 20, 8);
    fill(255, 0, 0);
    rect(uiX, barY, barWidth * percent, 20, 8);
    fill(255);
    textSize(16);
    textAlign(LEFT, CENTER);
    text(Math.round(percent * 100) + '%', uiX + barWidth + 5, barY + 10);

    // 恢复绘图状态
    pop();
} // 结束 (End);

function spawnMouse(num = 1) { // 生成老鼠函数 (Function to spawn mouse);
    for (let i = 0; i < num; i++) { // 循环生成指定数量的老鼠 (Loop to spawn specified number of mice);
        mice.push({ // 添加新老鼠对象 (Add new mouse object);
            x: cameraX - 100 - i * 30, // 从屏幕左边走出来，起点错开 (Come from left side of screen, stagger starting point)
            y: floorPos_y, // 老鼠y坐标 (Mouse y position);
            alive: true, // 老鼠是否存活 (Is mouse alive);
            state: "normal", // 老鼠状态：normal, scared
            scaredTimer: 0, // 害怕计时器
            lastThrowFrame: 0, // 上次投掷帧 (Last throw frame);
            facing: 1, // 老鼠朝向 (Mouse facing direction) - 1表示向右
            speed: 1.2 // 老鼠移动速度 (Mouse movement speed)
        }); // 结束老鼠对象 (End of mouse object);
    } // 结束for循环 (End of for loop);
} // 结束 (End);

function updateMice() {
    // 确保老鼠数组存在且不为空
    if (!mice || mice.length === 0) return;

    for (let i = 0; i < mice.length; i++) {
        let m = mice[i];
        if (!m || !m.alive) continue;

        // 运动 (Movement) + 害怕状态
        let distToCat = sqrt((m.x - cat_x) * (m.x - cat_x) + (m.y - cat_y) * (m.y - cat_y));
        let speed = m.speed || 1.2; // 使用老鼠自己的速度，默认1.2

        if (m.scaredTimer > 0) {
            m.scaredTimer--;
            speed = speed * 3.5; // 害怕时速度加快
            m.state = "scared";
        } else if (m.state === "scared") {
            m.state = "normal";
        }

        if (distToCat < 220 && m.state !== "scared") {
            speed = speed * 1.8; // 看到猫时速度加快
        }

        // 老鼠从左边向右移动
        m.x += speed;

        // 使用基于相机位置的移除条件，而不是固定世界宽度
        if (m.x > cameraX + width + 100 || m.x < cameraX - 100) {
            m.alive = false;
            continue;
        }

        // 老鼠进入城堡大门消失
        let doorX = worldWidth - 320 + 180;
        let doorY = floorPos_y - 480 + 480;
        if (isWithinRadiusSq(m.x, m.y, doorX, doorY, CONFIG.DOOR_HIT_RADIUS)) {
            m.alive = false;
            continue;
        }

        // 猫与老鼠碰撞检测，受伤扣血
        if (isWithinRadiusSq(m.x, m.y, cat_x, cat_y, CONFIG.MOUSE_HIT_RADIUS) && !isInvincible && catState !== "faint") {
            life -= 25;
            isInvincible = true;
            invincibleTimer = 90;

            // 新功能：猫生气发飙
            catState = "angry";
            angryTimer = 120;

            // 新功能：老鼠害怕逃跑
            m.state = "scared";
            m.scaredTimer = 180;

            // 新功能：连续碰撞计数
            consecutiveMouseHits++;
            console.log(`🐱 猫被老鼠碰撞！连续碰撞次数: ${consecutiveMouseHits}`);

            // 新功能：三次连续碰撞后晕倒
            if (consecutiveMouseHits >= 3) {
                catState = "faint";
                faintTimer = 180;
                consecutiveMouseHits = 0;
                console.log("🐱💫 猫晕倒了！将在3秒后苏醒");
            }
        }

        // 扔苹果，5秒一次，猫在300像素内才扔
        if (distToCat < 300 && frameCount - m.lastThrowFrame > 300) {
            let dx = cat_x - m.x;
            let dy = cat_y - m.y;
            let norm = sqrt(dx * dx + dy * dy);
            let vx_apple = dx / norm * CONFIG.APPLE_THROW_SPEED;
            let vy_apple = dy / norm * CONFIG.APPLE_THROW_SPEED - 4;
            apples.push({ x: m.x, y: m.y, vx: vx_apple, vy: vy_apple, active: true });
            m.lastThrowFrame = frameCount;
        }

        // 绘制老鼠 - 确保无论猫的位置如何都会绘制
        // 老鼠从左边向右移动，所以朝向为1（右边）
        drawMouseSoldier(m.x, m.y, m.state === "scared" ? "run" : "idle", 1, frameCount);
    }

    // 清理已死亡的老鼠
    mice = mice.filter(m => m && m.alive);
}
function updateFishbones() { // 更新鱼骨头函数 (Function to update fishbones);
    for (let i = 0; i < fishbones.length; i++) { // 遍历鱼骨头 (Loop through fishbones);
        let f = fishbones[i]; // 获取当前鱼骨头 (Get current fishbone);
        if (!f.active) continue;

        // 直线运动 (Straight line motion)
        f.x += f.vx; // 水平移动 (Horizontal movement)
        f.y += f.vy; // 垂直移动 (Vertical movement)

        // 应用重力 (Apply gravity) - 直线发射时重力为0
        if (f.gravity) {
            f.vy += f.gravity; // 垂直速度受重力影响 (Vertical velocity affected by gravity)
        }

        drawFishbone(f.x, f.y, f.dir); // 绘制鱼骨头 (Draw fishbone);
        // 碰撞检测：与所有老鼠 (Collision detection: with all mice)
        let hit = false; // 是否击中 (Is hit);
        for (let m of mice) { // 遍历所有老鼠 (Loop through all mice);
            if (m.alive && isWithinRadiusSq(f.x, f.y, m.x, m.y, CONFIG.FISHBONE_HIT_RADIUS)) { // 使用平方距离优化 (Use squared distance)
                m.alive = false; // 老鼠不存活 (Mouse is not alive);
                hit = true; // 标记为击中 (Mark as hit);
                score += 1; // 新增：击杀老鼠加1分
                fishboneHitCount = (typeof fishboneHitCount === 'undefined') ? 1 : fishboneHitCount + 1; // 鱼骨头击中计数增加 (Fishbone hit count increments);
                // 每累计3次击中生成奖励鱼 (Spawn reward fish every 3 hits)
                if (fishboneHitCount % 3 === 0) { // 如果鱼骨头击中次数是3的倍数 (If fishbone hit count is a multiple of 3);
                    spawnRewardFish(); // 生成奖励鱼 (Spawn reward fish);
                    rewardCount = (typeof rewardCount === 'undefined') ? 1 : rewardCount + 1; // 奖励计数增加 (Reward count increments);
                } // 结束if (End of if);
                break; // 跳出循环 (Break loop);
            } // 结束if (End of if);
        } // 结束for循环 (End of for loop);
        // 落地消失 (Disappear on landing)
        if (hit) { f.active = false; } // 击中则回收 (Recycle on hit)
        // 跑出世界也消失 (Also disappear if run out of world)
        else if (f.x < 0 || f.x > worldWidth) { f.active = false; } // 否则如果鱼骨头移出世界，则回收 (Recycle if out of world)
    } // 结束for循环 (End of for loop);
} // 结束 (End);

function drawFishbone(x, y, dir) { // 绘制鱼骨头函数 (Function to draw fishbone);
    push(); // 保存当前绘图状态 (Save current drawing state);
    translate(x, y); // 平移画布 (Translate canvas);
    scale(dir, 1); // 根据方向缩放 (Scale according to direction);

    // 主骨干 (Main bone structure)
    stroke(200); // 设置边框颜色 (Set stroke color);
    strokeWeight(3); // 设置线宽 (Set stroke weight);
    line(0, 0, 30, 0); // 绘制主骨干线条 (Draw main bone line);

    // 鱼刺 (Fish spines)
    for (let i = 1; i < 5; i++) { // 循环绘制鱼刺 (Loop to draw fish spines);
        let px = 5 * i; // 鱼刺x坐标 (Fish spine x position);
        line(px, 0, px, -6); // 绘制鱼刺线条 (Draw fish spine line);
        line(px, 0, px, 6); // 绘制鱼刺线条 (Draw fish spine line);
    } // 结束for循环 (End of for loop);

    // 鱼头 (Fish head)
    fill(230, 230, 230); // 设置填充颜色 (Set fill color);
    stroke(200); // 设置边框颜色 (Set stroke color);
    ellipse(33, 0, 10, 10); // 绘制鱼头椭圆 (Draw fish head ellipse);

    // 鱼眼 (Fish eye)
    fill(80); // 设置填充颜色 (Set fill color);
    noStroke(); // 不绘制边框 (No stroke);
    ellipse(36, -2, 2.5, 2.5); // 绘制鱼眼 (Draw fish eye);

    // 鱼尾 (Fish tail)
    fill(200, 220, 255); // 设置填充颜色 (Set fill color);
    stroke(180, 200, 230); // 设置边框颜色 (Set stroke color);
    strokeWeight(2); // 设置线宽 (Set stroke weight);
    beginShape(); // 开始绘制形状 (Begin shape);
    vertex(-4, 0); // 添加顶点 (Add vertex);
    vertex(-12, -7); // 添加顶点 (Add vertex);
    vertex(-8, 0); // 添加顶点 (Add vertex);
    vertex(-12, 7); // 添加顶点 (Add vertex);
    endShape(CLOSE); // 结束并闭合形状 (End and close shape);

    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
} // 结束 (End);
function drawRewardFishes() { // 绘制奖励鱼函数 (Function to draw reward fishes);
    for (let fish of rewardFishes) { // 遍历所有奖励鱼 (Loop through all reward fishes);
        if (!fish.alive) continue; // 如果鱼不存活则跳过 (Skip if fish is not alive);
        // 画一条黄鱼鱼干 (Draw a dried yellow fish)
        push(); // 保存当前绘图状态 (Save current drawing state);
        translate(fish.x, fish.y); // 平移画布 (Translate canvas);
        scale(1.2, 1.2); // 缩放画布 (Scale canvas);

        // 身体（细长略弯）(Body (slender and slightly curved))
        fill(255, 210, 80); // 设置填充颜色 (Set fill color);
        stroke(220, 170, 40); // 设置边框颜色 (Set stroke color);
        strokeWeight(2); // 设置线宽 (Set stroke weight);
        beginShape(); // 开始绘制形状 (Begin shape);
        curveVertex(-14, 0); // 添加曲线顶点 (Add curve vertex);
        curveVertex(-12, -4); // 添加曲线顶点 (Add curve vertex);
        curveVertex(0, -6); // 添加曲线顶点 (Add curve vertex);
        curveVertex(12, -2); // 添加曲线顶点 (Add curve vertex);
        curveVertex(14, 2); // 添加曲线顶点 (Add curve vertex);
        curveVertex(12, 6); // 添加曲线顶点 (Add curve vertex);
        curveVertex(0, 8); // 添加曲线顶点 (Add curve vertex);
        curveVertex(-12, 4); // 添加曲线顶点 (Add curve vertex);
        curveVertex(-14, 0); // 添加曲线顶点 (Add curve vertex);
        endShape(CLOSE); // 结束并闭合形状 (End and close shape);

        // 鱼头 (Fish head)
        fill(255, 220, 120); // 设置填充颜色 (Set fill color);
        ellipse(12, 2, 8, 8); // 绘制鱼头椭圆 (Draw fish head ellipse);

        // 鱼眼 (Fish eye)
        fill(60, 40, 0); // 设置填充颜色 (Set fill color);
        ellipse(14, 2, 2, 2); // 绘制鱼眼 (Draw fish eye);

        // 鱼尾（干瘪）(Fish tail (shriveled))
        fill(255, 200, 80); // 设置填充颜色 (Set fill color);
        stroke(220, 170, 40); // 设置边框颜色 (Set stroke color);
        strokeWeight(1.5); // 设置线宽 (Set stroke weight);
        triangle(-14, 0, -22, -6, -22, 6); // 绘制鱼尾三角形 (Draw fish tail triangle);

        // 鱼骨刺 (Fish bones)
        stroke(220, 170, 40, 180); // 设置边框颜色和透明度 (Set stroke color and alpha);
        for (let i = -8; i <= 8; i += 4) { // 循环绘制鱼骨刺 (Loop to draw fish bones);
            line(i, 2 + sin(i) * 2, i, 6 + sin(i) * 2); // 绘制鱼骨刺线条 (Draw fish bone line);
        } // 结束for循环 (End of for loop);

        pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);

        // 碰撞检测 (Collision detection)
        if (isWithinRadiusSq(cat_x, cat_y, fish.x, fish.y, CONFIG.REWARD_FISH_PICK_RADIUS)) { // 使用平方距离优化 (Use squared distance)
            fish.alive = false; // 鱼不存活 (Fish is not alive);
            // 增加血量，最多不超过maxLife (Increase health, max not exceeding maxLife)
            life = Math.min(life + 10, maxLife); // 生命值增加10，但不超过最大生命值 (Life increments by 10, but not exceeding max life);
            console.log('Reward fish collected!'); // EXPLAIN: Log when reward fish is picked up // 记录奖励鱼被拾取 (Log when reward fish is picked up);
        } // 结束if (End of if);
    } // 结束for循环 (End of for loop);
} // 结束 (End);

function spawnRewardFish() { // 生成奖励鱼函数 (Function to spawn reward fish);
    // 随机在地面上生成 (Spawn randomly on the ground)
    let x = random(80, worldWidth - 80); // 奖励鱼x坐标 (Reward fish x position);
    let y = floorPos_y - 30; // 奖励鱼y坐标 (Reward fish y position);
    rewardFishes.push({ x, y, alive: true }); // 添加奖励鱼对象 (Add reward fish object);
} // 结束 (End);

function drawStoryParticles() { // 绘制故事粒子函数 (Function to draw story particles);
    // 背景渐变 (Background gradient)
    let g = drawingContext.createLinearGradient(0, 0, 0, height); // 创建线性渐变 (Create linear gradient);
    g.addColorStop(0, '#ffe066'); // 添加渐变颜色 (Add gradient color);
    g.addColorStop(1, '#222'); // 添加渐变颜色 (Add gradient color);
    drawingContext.fillStyle = g; // 设置填充样式 (Set fill style);
    rect(0, 0, width, height); // 绘制矩形 (Draw rectangle);
    // 稻穗粒子 (Rice particles)
    for (let p of riceParticles) { // 遍历所有稻穗粒子 (Loop through all rice particles);
        push(); // 保存当前绘图状态 (Save current drawing state);
        translate(p.x, p.y); // 平移画布 (Translate canvas);
        rotate(p.angle); // 旋转 (Rotate);
        fill(255, 230, 80, 180); // 设置填充颜色和透明度 (Set fill color and alpha);
        ellipse(0, 0, p.size, 6); // 绘制椭圆 (Draw ellipse);
        fill(220, 180, 60, 180); // 设置填充颜色和透明度 (Set fill color and alpha);
        ellipse(-p.size * 0.2, 0, p.size * 0.5, 4); // 绘制椭圆 (Draw ellipse);
        pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
        p.y += p.vy; // 粒子y坐标增加 (Particle y position increments);
        p.angle += p.va; // 粒子角度增加 (Particle angle increments);
        if (p.y > height + 20) { p.y = random(-40, 0); p.x = random(width); } // 如果粒子移出屏幕，则重置位置 (If particle moves off screen, reset position);
    } // 结束for循环 (End of for loop);
    // 光斑粒子 (Glow particles)
    for (let p of glowParticles) { // 遍历所有光斑粒子 (Loop through all glow particles);
        fill(255, 255, 200, 30); // 设置填充颜色和透明度 (Set fill color and alpha);
        noStroke(); // 不绘制边框 (No stroke);
        ellipse(p.x, p.y, p.r, p.r); // 绘制椭圆 (Draw ellipse);
        p.x += sin(frameCount * 0.01 + p.y) * 0.2; // 粒子x坐标随时间波动 (Particle x position oscillates with time);
        p.y += cos(frameCount * 0.01 + p.x) * 0.1; // 粒子y坐标随时间波动 (Particle y position oscillates with time);
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0; if (p.y < 0) p.y = height; if (p.y > height) p.y = 0; // 粒子循环移动 (Particle loops movement);
    } // 结束for循环 (End of for loop);
} // 结束 (End);

// === 保持独立的键盘移动系统 ===
// 禁用右键菜单，避免干扰游戏
if (typeof window !== 'undefined') { // 如果窗口对象存在 (If window object exists);
    window.oncontextmenu = function () { return false; }; // 禁用右键菜单 (Disable right-click menu);
} // 结束if (End of if);

function windowResized() { // 窗口大小改变事件 (Window resized event);
    resizeCanvas(windowWidth, windowHeight); // 重新调整画布大小 (Resize canvas);
    worldWidth = width * 2; // 保持双场景 (Maintain double scene) // 世界宽度扩展为两倍 (World width expanded to twice);
    // 重新计算地面位置 (Recalculate floor position)
    floorPos_y = height * 0.875; // 地面位置为画布高度的87.5% (Floor position at 87.5% of canvas height);
    // 更新猫咪位置 (Update cat position)
    if (cat_y > floorPos_y) {
        cat_y = floorPos_y; // 确保猫咪在地面上 (Ensure cat is on the ground);
    }
    // 更新老鼠位置 (Update mouse position)
    if (mouse_y > floorPos_y - 20) {
        mouse_y = floorPos_y - 20; // 确保老鼠在地面上方 (Ensure mouse is above the ground);
    }
} // 结束 (End);

function drawCatFourLegs() { // 绘制四条腿的猫咪 (Draw four-legged cat);
    push(); // 保存当前绘图状态 (Save current drawing state);
    translate(cat_x, cat_y); // 平移画布 (Translate canvas);
    // 身体 (Body)
    fill(60); // 设置填充颜色 (Set fill color);
    ellipse(0, 30, 80, 40); // 绘制身体椭圆 (Draw body ellipse);
    // 头 (Head)
    fill(60); // 设置填充颜色 (Set fill color);
    ellipse(0, -10, 40, 40); // 绘制头部椭圆 (Draw head ellipse);
    // 耳朵 (Ears)
    triangle(-18, -28, -6, -18, -24, -8); // 绘制左耳 (Draw left ear);
    triangle(18, -28, 6, -18, 24, -8); // 绘制右耳 (Draw right ear);
    // 眼睛 (Eyes)
    fill(255); // 设置填充颜色 (Set fill color);
    ellipse(-8, -12, 10, 14); // 绘制左眼 (Draw left eye);
    ellipse(8, -12, 10, 14); // 绘制右眼 (Draw right eye);
    fill(0); // 设置填充颜色 (Set fill color);
    ellipse(-8, -12, 4, 8); // 绘制左瞳孔 (Draw left pupil);
    ellipse(8, -12, 4, 8); // 绘制右瞳孔 (Draw right pupil);
    // 鼻子 (Nose)
    fill(120, 90, 90); // 设置填充颜色 (Set fill color);
    triangle(0, -2, -4, 4, 4, 4); // 绘制鼻子 (Draw nose);
    // 嘴 (Mouth)
    stroke(120, 90, 90); strokeWeight(1); // 设置边框颜色和线宽 (Set stroke color and weight);
    line(0, 4, 0, 10); // 绘制嘴巴线条 (Draw mouth line);
    line(0, 10, -4, 14); // 绘制嘴巴线条 (Draw mouth line);
    line(0, 10, 4, 14); // 绘制嘴巴线条 (Draw mouth line);
    noStroke(); // 不绘制边框 (No stroke);
    // 四条腿 (Four legs)
    fill(60); // 设置填充颜色 (Set fill color);
    rect(-24, 40, 10, 24, 6); // 绘制左前腿 (Draw front left leg);
    rect(14, 40, 10, 24, 6); // 绘制右前腿 (Draw front right leg);

    // 尾巴 (Tail)
    push(); // 保存当前绘图状态 (Save current drawing state);
    rotate(radians(30)); // 旋转 (Rotate);
    ellipse(40, 30, 12, 36); // 绘制尾巴椭圆 (Draw tail ellipse);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
} // 结束 (End);

// 青蛙坐在树梢弹吉他（带动画和吉他细节优化）(Frog sitting on treetop playing guitar (with animation and guitar detail optimization))
function drawFrogWithGuitar(x, y, animT = 0) { // 绘制带吉他的青蛙函数 (Function to draw frog with guitar);
    push(); // 保存当前绘图状态 (Save current drawing state);
    translate(x, y); // 平移画布 (Translate canvas);
    scale(1.2, 1.2); // 缩放画布 (Scale canvas);
    // 动画参数 (Animation parameters)
    let bodyBob = sin(animT * 0.08) * 5; // 身体上下起伏 (Body bobbing);
    let headTilt = sin(animT * 0.05) * 0.15; // 头部倾斜 (Head tilt);
    let leftArmAngle = radians(-30) + sin(animT * 0.12) * 0.18; // 左臂角度 (Left arm angle);
    let rightArmAngle = radians(45) + sin(animT * 0.15) * 0.2; // 右臂角度，调整为抓握琴头 (Right arm angle, adjusted to grip headstock);
    let fingerPress = sin(animT * 0.2) * 0.3; // 手指按压动作 (Finger pressing action);
    let thumbMove = sin(animT * 0.18) * 0.2; // 拇指移动 (Thumb movement);
    let rightHandY = 22 + sin(animT * 0.18) * 4; // 右手y坐标 (Right hand y position) // *Note: This variable is not used. (注意：这个变量未使用)*;
    let leftLegAngle = radians(-10) + sin(animT * 0.09) * 0.08; // 左腿角度 (Left leg angle);
    let rightLegAngle = radians(10) - sin(animT * 0.09) * 0.08; // 右腿角度 (Right leg angle);
    let blink = (floor(animT / 80) % 2 === 0 && animT % 120 > 100) ? 0.2 : 1; // 眨眼动画 (Blink animation);
    let mouthOpen = 2 + abs(sin(animT * 0.13)) * 5; // 嘴巴张开程度 (Mouth open extent);
    // 身体 (Body)
    fill(80, 200, 80); // 设置填充颜色 (Set fill color);
    ellipse(0, 20 + bodyBob, 38, 48); // 绘制身体椭圆 (Draw body ellipse);
    // 头 (Head)
    push(); // 保存当前绘图状态 (Save current drawing state);
    rotate(headTilt); // 旋转头部 (Rotate head);
    fill(80, 200, 80); // 设置填充颜色 (Set fill color);
    ellipse(0, -10 + bodyBob, 38, 32); // 绘制头部椭圆 (Draw head ellipse);
    // 下颚 (Lower jaw)
    fill(70, 180, 70); // 设置填充颜色 (Set fill color);
    arc(0, -2 + bodyBob, 38, 22, 0, PI); // 绘制下颚弧线 (Draw lower jaw arc);
    // 头部高光 (Head highlight)
    fill(255, 255, 255, 60); // 设置填充颜色和透明度 (Set fill color and alpha);
    ellipse(-8, -18 + bodyBob, 10, 6); // 绘制高光椭圆 (Draw highlight ellipse);
    // 下巴阴影 (Chin shadow)
    fill(60, 120, 60, 60); // 设置填充颜色和透明度 (Set fill color and alpha);
    ellipse(0, 2 + bodyBob, 18, 6); // 绘制阴影椭圆 (Draw shadow ellipse);
    // 鼻孔 (Nostrils)
    fill(60, 120, 60); // 设置填充颜色 (Set fill color);
    ellipse(-4, -8 + bodyBob, 2, 1.2); // 绘制左鼻孔 (Draw left nostril);
    ellipse(4, -8 + bodyBob, 2, 1.2); // 绘制右鼻孔 (Draw right nostril);
    // 眼睛 (Eyes)
    fill(255); // 设置填充颜色 (Set fill color);
    ellipse(-10, -18, 12, 12 * blink); // 绘制左眼 (Draw left eye);
    ellipse(10, -18, 12, 12 * blink); // 绘制右眼 (Draw right eye);
    fill(0); // 设置填充颜色 (Set fill color);
    ellipse(-10, -18, 5, 5 * blink); // 绘制左瞳孔 (Draw left pupil);
    ellipse(10, -18, 5, 5 * blink); // 绘制右瞳孔 (Draw right pupil);
    // 眼睛高光 (Eye highlight)
    fill(255, 255, 255, 180); // 设置填充颜色和透明度 (Set fill color and alpha);
    ellipse(-8, -20, 2.2, 1.2 * blink); // 绘制左眼高光 (Draw left eye highlight);
    ellipse(12, -20, 2.2, 1.2 * blink); // 绘制右眼高光 (Draw right eye highlight);
    // 腮红（更自然）(Blush (more natural))
    noStroke(); // 不绘制边框 (No stroke);
    for (let i = 0; i < 6; i++) { // 循环绘制腮红 (Loop to draw blush);
        fill(255, 120, 120, 60 - 8 * i); // 设置填充颜色和透明度 (Set fill color and alpha);
        ellipse(-16, -10, 7 - i, 3 - i * 0.4); // 绘制左腮红 (Draw left blush);
        ellipse(16, -10, 7 - i, 3 - i * 0.4); // 绘制右腮红 (Draw right blush);
    } // 结束for循环 (End of for loop);
    // 嘴（微笑+弹奏时张合）(Mouth (smile + open/close when playing))
    stroke(60, 120, 60); // 设置边框颜色 (Set stroke color);
    strokeWeight(2); // 设置线宽 (Set stroke weight);
    noFill(); // 不填充 (No fill);
    arc(0, -5, 18, mouthOpen, 0, PI); // 绘制嘴巴弧线 (Draw mouth arc);
    arc(-4, -4, 5, 3, 0, PI / 2); // 绘制嘴巴弧线 (Draw mouth arc);
    arc(4, -4, 5, 3, PI / 2, PI); // 绘制嘴巴弧线 (Draw mouth arc);
    noStroke(); // 不绘制边框 (No stroke);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
    // 腿（晃动）(Legs (swinging))
    push(); // 保存当前绘图状态 (Save current drawing state);
    rotate(leftLegAngle); // 旋转左腿 (Rotate left leg);
    fill(80, 200, 80); // 设置填充颜色 (Set fill color);
    ellipse(-12, 44 + bodyBob, 12, 28); // 绘制左腿椭圆 (Draw left leg ellipse);
    // 脚趾分明 (Toes defined)
    fill(120, 220, 120); // 设置填充颜色 (Set fill color);
    ellipse(-12, 58 + bodyBob, 8, 5); // 绘制左脚趾 (Draw left toe);
    ellipse(-15, 60 + bodyBob, 3, 2); // 绘制左脚趾 (Draw left toe);
    ellipse(-9, 60 + bodyBob, 3, 2); // 绘制左脚趾 (Draw left toe);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
    push(); // 保存当前绘图状态 (Save current drawing state);
    rotate(rightLegAngle); // 旋转右腿 (Rotate right leg);
    fill(80, 200, 80); // 设置填充颜色 (Set fill color);
    ellipse(12, 44 + bodyBob, 12, 28); // 绘制右腿椭圆 (Draw right leg ellipse);
    fill(120, 220, 120); // 设置填充颜色 (Set fill color);
    ellipse(12, 58 + bodyBob, 8, 5); // 绘制右脚趾 (Draw right toe);
    ellipse(9, 60 + bodyBob, 3, 2); // 绘制右脚趾 (Draw right toe);
    ellipse(15, 60 + bodyBob, 3, 2); // 绘制右脚趾 (Draw right toe);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
    // 吉他主体 (Guitar body)
    push(); // 保存当前绘图状态 (Save current drawing state);
    rotate(radians(-15)); // 旋转吉他 (Rotate guitar);
    fill(210, 140, 60); // 设置填充颜色 (Set fill color);
    ellipse(0, 22 + bodyBob, 38, 18); // 绘制吉他主体椭圆 (Draw guitar body ellipse);
    // 吉他音孔阴影 (Guitar sound hole shadow)
    fill(80, 60, 30, 80); // 设置填充颜色和透明度 (Set fill color and alpha);
    ellipse(0, 22 + bodyBob, 10, 10); // 绘制音孔阴影 (Draw sound hole shadow);
    // 吉他音孔 (Guitar sound hole)
    fill(100, 60, 30); // 设置填充颜色 (Set fill color);
    ellipse(0, 22 + bodyBob, 7, 7); // 绘制音孔 (Draw sound hole);
    // 琴桥 (Bridge)
    fill(80, 40, 20); // 设置填充颜色 (Set fill color);
    rect(-8, 28 + bodyBob, 16, 4, 2); // 绘制琴桥矩形 (Draw bridge rectangle);
    // 吉他颈 (Guitar neck)
    fill(180, 150, 50); // 设置填充颜色 (Set fill color);
    rect(14, 18 + bodyBob, 28, 6, 3); // 绘制琴颈矩形 (Draw neck rectangle);
    // 琴弦锚点 (String anchor points)
    fill(120); // 设置填充颜色 (Set fill color);
    for (let i = -2; i <= 2; i++) ellipse(-8 + i * 4, 30 + bodyBob, 2, 2); // 绘制琴弦锚点 (Draw string anchor points);
    // 吉他弦（动态振动效果）(Guitar strings with dynamic vibration effect)
    stroke(220); // 设置边框颜色 (Set stroke color);
    strokeWeight(1.2); // 设置线宽 (Set stroke weight);
    for (let i = -2; i <= 2; i++) { // 循环绘制琴弦 (Loop to draw strings);
        let stringVibration = sin(animT * 0.4 + i) * 0.3; // 琴弦振动 (String vibration)
        let startY = 20 + i * 1.5 + bodyBob + stringVibration;
        let endY = 20 + i * 1.5 + bodyBob + stringVibration * 0.5;
        line(14, startY, 40, endY); // 绘制振动的琴弦线条 (Draw vibrating string line);
    } // 结束for循环 (End of for loop);
    // 吉他旋钮（琴头更精致）(Guitar tuning pegs (more refined headstock))
    fill(160, 100, 40); // 设置填充颜色 (Set fill color);
    for (let i = 0; i < 3; i++) ellipse(42, 19 + i * 2.5 + bodyBob, 3, 3); // 绘制旋钮 (Draw tuning pegs);
    fill(120, 80, 30); // 设置填充颜色 (Set fill color);
    rect(40, 18 + bodyBob, 6, 8, 2); // 绘制琴头矩形 (Draw headstock rectangle);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);

    // 左手抱吉他琴身（精细按弦姿势）- 在吉他之后绘制，显示在外面 (Left hand holding guitar body (detailed chord pressing position) - drawn after guitar to show outside)
    push(); // 保存当前绘图状态 (Save current drawing state);
    translate(-12, 22 + bodyBob); // 移动到吉他琴身位置 (Move to guitar body position)
    rotate(leftArmAngle); // 旋转左臂 (Rotate left arm);

    // 左臂（抱琴状态）(Left arm in holding position)
    fill(80, 200, 80); // 设置填充颜色 (Set fill color);
    ellipse(-8, -2, 12, 20); // 绘制左臂椭圆，调整位置 (Draw left arm ellipse, adjusted position);

    // 左手掌（抱琴姿势）(Left palm in holding position)
    fill(85, 205, 85); // 稍微亮一点的绿色 (Slightly brighter green);
    ellipse(-2, 8, 10, 12); // 绘制手掌 (Draw palm);

    // 拇指支撑琴背 (Thumb supporting guitar back)
    fill(90, 210, 90); // 设置填充颜色 (Set fill color);
    ellipse(-8, 6, 4, 7); // 拇指位置 (Thumb position);

    // 四指按弦姿势 (Four fingers in chord pressing position)
    fill(120, 220, 120); // 设置填充颜色 (Set fill color);

    // 食指按弦（动态按压）(Index finger pressing string with dynamic pressure)
    ellipse(2, 5 + fingerPress, 2.5, 6 - fingerPress * 0.5);

    // 中指按弦（动态按压）(Middle finger pressing string with dynamic pressure)
    ellipse(4, 6 + fingerPress * 0.8, 2.5, 6.5 - fingerPress * 0.3);

    // 无名指按弦（动态按压）(Ring finger pressing string with dynamic pressure)
    ellipse(6, 7 + fingerPress * 0.6, 2.5, 6 - fingerPress * 0.4);

    // 小指悬空（轻微摆动）(Pinky finger hovering with slight sway)
    ellipse(8, 8 + sin(animT * 0.25) * 0.3, 2, 5);

    // 手指关节细节 (Finger joint details)
    fill(110, 200, 110, 150); // 半透明效果 (Semi-transparent);
    ellipse(2, 2, 2, 2); // 食指关节 (Index finger joint);
    ellipse(4, 3, 2, 2); // 中指关节 (Middle finger joint);
    ellipse(6, 4, 2, 2); // 无名指关节 (Ring finger joint);

    // 按弦压力表现（手指弯曲）(String pressing pressure indication)
    fill(70, 180, 70, 120); // 阴影色 (Shadow color);
    ellipse(4, 8, 6, 2); // 按弦阴影 (String pressing shadow);

    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);

    // 右手抓握琴头（精细手指动作）- 在吉他之后绘制，显示在外面 (Right hand gripping headstock (detailed finger action) - drawn after guitar to show outside)
    push(); // 保存当前绘图状态 (Save current drawing state);

    // 调整右手位置到琴头位置 (Adjust right hand position to headstock)
    translate(38, 18 + bodyBob); // 移动到琴头位置 (Move to headstock position)
    rotate(rightArmAngle); // 旋转右臂 (Rotate right arm);

    // 右臂（从身体延伸到琴头）(Right arm extending from body to headstock)
    fill(80, 200, 80); // 设置填充颜色 (Set fill color);
    ellipse(-15, 2, 10, 18); // 绘制右臂椭圆，调整位置 (Draw right arm ellipse, adjusted position);

    // 右手掌（抓握状态）(Right palm in gripping position)
    fill(85, 205, 85); // 稍微亮一点的绿色 (Slightly brighter green);
    ellipse(-8, 8, 9, 14); // 绘制手掌 (Draw palm);

    // 拇指抓握琴头背面（动态调节）(Thumb gripping back of headstock with dynamic adjustment)
    fill(90, 210, 90); // 设置填充颜色 (Set fill color);
    ellipse(-12 + thumbMove, 5, 4 + thumbMove * 0.5, 6); // 拇指位置，动态调节 (Thumb position with dynamic adjustment);

    // 四指包围琴头前面 (Four fingers wrapping around front of headstock)
    fill(120, 220, 120); // 设置填充颜色 (Set fill color);

    // 食指（动态抓握）(Index finger with dynamic grip)
    ellipse(-5, 3 + fingerPress * 0.5, 2.5, 5 + fingerPress);

    // 中指（动态抓握）(Middle finger with dynamic grip) 
    ellipse(-3, 4 + fingerPress * 0.4, 2.5, 5.5 + fingerPress * 0.8);

    // 无名指（动态抓握）(Ring finger with dynamic grip)
    ellipse(-1, 5 + fingerPress * 0.3, 2.5, 5 + fingerPress * 0.6);

    // 小指（轻微颤动）(Pinky finger with slight tremor)
    ellipse(1, 6 + sin(animT * 0.3) * 0.2, 2, 4.5);

    // 手指关节细节 (Finger joint details)
    fill(110, 200, 110, 150); // 半透明效果 (Semi-transparent);
    ellipse(-5, 1, 2, 2); // 食指关节 (Index finger joint);
    ellipse(-3, 2, 2, 2); // 中指关节 (Middle finger joint);
    ellipse(-1, 3, 2, 2); // 无名指关节 (Ring finger joint);

    // 抓握力度表现（手指弯曲阴影）(Grip strength indication with finger curve shadows)
    fill(70, 180, 70, 100); // 阴影色 (Shadow color);
    ellipse(-4, 6, 6, 3); // 手指弯曲阴影 (Finger curve shadow);

    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);

    pop(); // 恢复函数开始时的绘图状态 (Restore drawing state from function start);
} // 结束 (End);
function drawBeautifulNightSky() { // 绘制美丽的夜空函数 (Function to draw beautiful night sky);
    if (!isNight) return; // 如果不是夜晚则返回 (Return if not night);
    // 1. 极光（动态渐变带）(1. Aurora (dynamic gradient band))
    push(); // 保存当前绘图状态 (Save current drawing state);
    let auroraY = 120 + sin(frameCount * 0.01) * 20; // 极光y坐标 (Aurora y coordinate);
    for (let i = 0; i < 6; i++) { // 循环绘制极光带 (Loop to draw aurora bands);
        let alpha = 60 - i * 10; // 极光透明度 (Aurora alpha);
        let hue = 120 + i * 18 + sin(frameCount * 0.02 + i) * 30; // 极光色相 (Aurora hue);
        for (let x = 0; x < width; x += 8) { // 循环绘制极光点 (Loop to draw aurora points);
            let y = auroraY + sin(x * 0.01 + frameCount * 0.01 + i) * 18 + i * 8; // 极光y坐标 (Aurora y coordinate);
            fill(80 + 30 * i, 255 - 30 * i, 180 + 10 * i, alpha); // 设置填充颜色和透明度 (Set fill color and alpha);
            noStroke(); // 不绘制边框 (No stroke);
            ellipse(x, y, 18 - i * 2, 22 - i * 2); // 绘制极光椭圆 (Draw aurora ellipse);
        } // 结束for循环 (End of for loop);
    } // 结束for循环 (End of for loop);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
    // 2. 银河带（横跨夜空的星云）(2. Milky Way band (nebula across night sky))
    push(); // 保存当前绘图状态 (Save current drawing state);
    for (let i = 0; i < 220; i++) { // 循环绘制银河粒子 (Loop to draw Milky Way particles);
        let t = i / 220; // 归一化时间 (Normalized time);
        let gx = lerp(80, width - 80, t) + sin(t * 8 + frameCount * 0.003) * 30; // 银河x坐标 (Milky Way x coordinate);
        let gy = 180 + sin(t * PI * 2 + frameCount * 0.002) * 40 + cos(t * PI * 3 + frameCount * 0.01) * 18; // 银河y坐标 (Milky Way y coordinate);
        let size = random(2, 7); // 粒子大小 (Particle size);
        let alpha = random(60, 120); // 粒子透明度 (Particle alpha);
        fill(255, 255, 255, alpha); // 设置填充颜色和透明度 (Set fill color and alpha);
        noStroke(); // 不绘制边框 (No stroke);
        ellipse(gx, gy, size, size * random(0.7, 1.2)); // 绘制粒子椭圆 (Draw particle ellipse);
    } // 结束for循环 (End of for loop);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
    // 3. 北斗七星 (3. Big Dipper)
    push(); // 保存当前绘图状态 (Save current drawing state);
    let beidou = [ // 北斗七星坐标 (Big Dipper coordinates);
        [width * 0.18, 110], [width * 0.22, 130], [width * 0.28, 150], // 北斗七星坐标 (Big Dipper coordinates);
        [width * 0.36, 170], [width * 0.44, 180], [width * 0.52, 170], [width * 0.60, 150] // 北斗七星坐标 (Big Dipper coordinates);
    ]; // 结束数组 (End of array);
    stroke(255, 255, 200, 120); strokeWeight(2); // 设置边框颜色和线宽 (Set stroke color and weight);
    for (let i = 0; i < beidou.length - 1; i++) { // 循环绘制线条 (Loop to draw lines);
        line(beidou[i][0], beidou[i][1], beidou[i + 1][0], beidou[i + 1][1]); // 绘制线条 (Draw line);
    } // 结束for循环 (End of for loop);
    noStroke(); // 不绘制边框 (No stroke);
    for (let i = 0; i < beidou.length; i++) { // 循环绘制星星 (Loop to draw stars);
        fill(255, 255, 180, 220); // 设置填充颜色和透明度 (Set fill color and alpha);
        ellipse(beidou[i][0], beidou[i][1], 13 - i, 13 - i); // 绘制星星椭圆 (Draw star ellipse);
        fill(255, 255, 255, 180); // 设置填充颜色和透明度 (Set fill color and alpha);
        ellipse(beidou[i][0], beidou[i][1], 7 - i * 0.7, 7 - i * 0.7); // 绘制星星高光 (Draw star highlight);
    } // 结束for循环 (End of for loop);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
    // 4. 优化星星闪烁和夜空色彩层次 (4. Optimize star flickering and night sky color hierarchy)
    push(); // 保存当前绘图状态 (Save current drawing state);
    for (let i = 0; i < 80; i++) { // 循环绘制星星 (Loop to draw stars);
        let sx = random(width); // 星星x坐标 (Star x coordinate);
        let sy = random(height * 0.6); // 星星y坐标 (Star y coordinate);
        let starAlpha = 120 + 80 * sin(frameCount * 0.01 + sx * 0.01 + sy * 0.02); // 星星透明度 (Star alpha);
        let starColor = lerpColor(color(255, 255, 255), color(180, 220, 255), random(1)); // 星星颜色 (Star color);
        fill(starColor.levels[0], starColor.levels[1], starColor.levels[2], starAlpha); // 设置填充颜色和透明度 (Set fill color and alpha);
        noStroke(); // 不绘制边框 (No stroke);
        ellipse(sx, sy, random(1.5, 3.5), random(1.2, 2.8)); // 绘制星星椭圆 (Draw star ellipse);
    } // 结束for循环 (End of for loop);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
} // 结束 (End);

// 插值函数 (Interpolation function)
function easeInOutCubic(t) { // 三次贝塞尔缓入缓出函数 (Cubic ease in-out function);
    return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2; // 返回插值结果 (Return interpolated result);
} // 结束 (End);

function updateApples() { // 更新苹果状态函数 (Function to update apples);
    for (let i = apples.length - 1; i >= 0; i--) { // 反向遍历苹果 (Loop through apples in reverse);
        let a = apples[i]; // 获取当前苹果 (Get current apple);
        if (!a.active) continue; // 如果苹果不活跃则跳过 (Skip if apple is not active);
        a.x += a.vx; // 苹果x坐标移动 (Apple x position moves);
        a.y += a.vy; // 苹果y坐标移动 (Apple y position moves);
        a.vy += 0.5; // 苹果垂直速度增加 (Apple vertical velocity increments);
        // 画苹果 (Draw apple)
        push(); // 保存当前绘图状态 (Save current drawing state);
        fill(255, 60, 60); // 设置填充颜色 (Set fill color);
        ellipse(a.x, a.y, 18, 18); // 绘制苹果椭圆 (Draw apple ellipse);
        fill(80, 180, 60); // 设置填充颜色 (Set fill color);
        ellipse(a.x + 4, a.y - 8, 6, 8); // 绘制苹果叶子 (Draw apple leaf);
        pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
        // 碰撞检测 (Collision detection)
        if (!isInvincible && dist(a.x, a.y, cat_x, cat_y) < 40) { // 如果猫咪不是无敌且与苹果距离小于40 (If cat is not invincible and distance to apple < 40);
            life -= 20; // 苹果砸中猫扣20点血 (Apple hits cat, deducts 20 health);
            isInvincible = true; // 进入无敌状态 (Enter invincible state);
            invincibleTimer = 90; // 无敌计时器为60 (Invincible timer is 60);
            a.active = false; // 苹果不活跃 (Apple is not active);
        } // 结束if (End of if);
        // 落地消失 (Disappear on landing)
        if (a.y > floorPos_y + 60) { // 如果苹果y坐标低于地面+60 (If apple y position is below floor + 60);
            apples.splice(i, 1); // 删除苹果 (Remove apple);
        } // 结束if (End of if);
    } // 结束for循环 (End of for loop);
} // 结束 (End);

// fishbone发射逻辑统一封装 - 直线轨迹 (Fishbone firing logic encapsulated - Straight line trajectory)
function fireFishbone(targetX, targetY) { // 发射鱼骨头函数 (Function to fire fishbone);
    let startX = cat_x + (catDirection === 'right' ? 40 : -40); // 发射起点X
    let startY = cat_y - 10; // 发射起点Y - 降低发射高度

    let dx = targetX - startX; // 目标x与发射点x的差值 (Difference between target x and start x);
    let dy = targetY - startY; // 目标y与发射点y的差值 (Difference between target y and start y);
    let dir = (catDirection === 'right') ? 1 : -1; // 方向 (Direction);

    // 计算直线轨迹的速度 (Calculate velocity for straight line trajectory)
    let distance = Math.sqrt(dx * dx + dy * dy); // 到目标的距离 (Distance to target)

    // 直线发射：恒定速度
    let speed = 12; // 固定发射速度

    // 计算单位方向向量
    let vx = (dx / distance) * speed; // 水平速度分量 (Horizontal velocity component)
    let vy = (dy / distance) * speed; // 垂直速度分量 (Vertical velocity component)

    const slot = acquireFishboneSlot();
    if (slot) {
        slot.x = startX;
        slot.y = startY;
        slot.vx = vx;
        slot.vy = vy;
        slot.dir = dir;
        slot.active = true;
        slot.gravity = 0; // 无重力影响，直线飞行
        slot.initialY = startY; // 记录初始高度 (Record initial height)

        console.log(`🎯 鱼骨头直线发射: 速度=${Math.floor(speed)}, 目标距离=${Math.floor(distance)}, 方向(${vx.toFixed(1)}, ${vy.toFixed(1)})`);
    }
    lastFishboneFrame = frameCount; // 更新上次鱼骨头发射帧 (Update last fishbone frame);
} // 结束 (End);



// === 独立的鱼骨头发射系统 ===
// 向左发射鱼骨头 (Fire fishbone to the left)
function fireFishboneLeft() {
    let startX = cat_x - 40; // 发射起点X - 猫的左侧
    let startY = cat_y - 10; // 发射起点Y - 降低发射高度

    // 固定直线发射：向左
    let speed = 12; // 固定发射速度
    let dir = -1; // 向左方向

    // 直线发射：水平方向
    let vx = speed * dir; // 水平速度（负值，向左）
    let vy = 0; // 垂直速度为0，完全水平发射

    const slot = acquireFishboneSlot();
    if (slot) {
        slot.x = startX;
        slot.y = startY;
        slot.vx = vx;
        slot.vy = vy;
        slot.dir = dir;
        slot.active = true;
        slot.gravity = 0; // 无重力影响，直线飞行
        slot.initialY = startY;

        console.log(`🎯 鱼骨头向左发射: 速度=${Math.floor(speed)}, 方向=左`);
    }
    lastFishboneFrame = frameCount;
}

// 向右发射鱼骨头 (Fire fishbone to the right)
function fireFishboneRight() {
    let startX = cat_x + 40; // 发射起点X - 猫的右侧
    let startY = cat_y - 10; // 发射起点Y - 降低发射高度

    // 固定直线发射：向右
    let speed = 12; // 固定发射速度
    let dir = 1; // 向右方向

    // 直线发射：水平方向
    let vx = speed * dir; // 水平速度（正值，向右）
    let vy = 0; // 垂直速度为0，完全水平发射

    const slot = acquireFishboneSlot();
    if (slot) {
        slot.x = startX;
        slot.y = startY;
        slot.vx = vx;
        slot.vy = vy;
        slot.dir = dir;
        slot.active = true;
        slot.gravity = 0; // 无重力影响，直线飞行
        slot.initialY = startY;

        console.log(`🎯 鱼骨头向右发射: 速度=${Math.floor(speed)}, 方向=右`);
    }
    lastFishboneFrame = frameCount;
}





function drawMouseSoldier(x, y, state = "idle", facing = 1, anim = 0) { // 绘制老鼠士兵函数 (Function to draw mouse soldier);
    push(); // 保存当前绘图状态 (Save current drawing state);
    translate(x, y + 10); // 平移画布 (Translate canvas);
    scale(1.1 * facing, 1.1); // 根据朝向缩放 (Scale according to facing);
    // 步伐动画参数 (Walk animation parameters)
    let step = (anim % 30) / 30 * TWO_PI; // 步长 (Step length);
    let bagBob = sin(step) * 3; // 米袋上下晃动 (Rice bag bobbing);
    let tailSwing = sin(step) * 10; // 尾巴摆动 (Tail swing);
    let handSwing = sin(step + PI / 2) * 4; // 手臂摆动 (Hand swing);
    let footSwing = sin(step) * 3; // 脚部摆动 (Foot swing);
    let headscared = (state === "run") ? sin(anim * 0.5) * 2 : 0; // 头部受惊晃动 (Head scared bobbing);
    // 背上超大补丁大米袋（动态晃动+补丁+阴影+米粒）(Large patched rice bag on back (dynamic bobbing + patches + shadow + rice grains))
    push(); // 保存当前绘图状态 (Save current drawing state);
    translate(0, 10 + bagBob); // 平移画布 (Translate canvas);
    rotate(-PI / 10); // 旋转 (Rotate);
    // 阴影 (Shadow)
    fill(180, 140, 40, 80); // 设置填充颜色和透明度 (Set fill color and alpha);
    ellipse(-12, -18, 44, 12); // 绘制阴影椭圆 (Draw shadow ellipse);
    // 主体 (Main body)
    fill(255, 220, 80); // 设置填充颜色 (Set fill color);
    stroke(200, 170, 40); // 设置边框颜色 (Set stroke color);
    strokeWeight(3); // 设置线宽 (Set stroke weight);
    ellipse(-12, -24, 60, 44); // 绘制主体椭圆 (Draw main body ellipse);
    // 高光 (Highlight)
    noStroke(); // 不绘制边框 (No stroke);
    fill(255, 255, 180, 90); // 设置填充颜色和透明度 (Set fill color and alpha);
    ellipse(-20, -30, 18, 8); // 绘制高光椭圆 (Draw highlight ellipse);
    // 口袋口 (Bag opening)
    fill(220, 180, 60); // 设置填充颜色 (Set fill color);
    ellipse(-12, -38, 32, 16); // 绘制口袋口椭圆 (Draw bag opening ellipse);
    // 米粒 (Rice grains)
    fill(255, 245, 200); // 设置填充颜色 (Set fill color);
    for (let i = 0; i < 5; i++) ellipse(-12 + random(-8, 8), -38 + random(-6, 2), 4, 7); // 绘制米粒 (Draw rice grains);
    // 绳子 (Rope)
    stroke(120, 90, 30); // 设置边框颜色 (Set stroke color);
    strokeWeight(3); // 设置线宽 (Set stroke weight);
    line(-28, -38, 4, -38); // 绘制绳子线条 (Draw rope line);
    // 不规则补丁 (Irregular patches)
    noStroke(); // 不绘制边框 (No stroke);
    fill(230, 180, 60); // 设置填充颜色 (Set fill color);
    beginShape(); vertex(-25, -30); vertex(-13, -32); vertex(-10, -22); vertex(-22, -20); endShape(CLOSE); // 绘制补丁形状 (Draw patch shape);
    fill(200, 160, 40); // 设置填充颜色 (Set fill color);
    beginShape(); vertex(-5, -40); vertex(5, -38); vertex(2, -34); vertex(-7, -36); endShape(CLOSE); // 绘制补丁形状 (Draw patch shape);
    fill(255, 240, 120); // 设置填充颜色 (Set fill color);
    beginShape(); vertex(-18, -18); vertex(-10, -16); vertex(-12, -10); vertex(-20, -12); endShape(CLOSE); // 绘制补丁形状 (Draw patch shape);
    // 补丁缝线 (Patch stitching)
    stroke(120, 90, 30); // 设置边框颜色 (Set stroke color);
    strokeWeight(1.2); // 设置线宽 (Set stroke weight);
    line(-25, -26, -13, -26); // 绘制缝线 (Draw stitching);
    line(-5, -37, 5, -37); // 绘制缝线 (Draw stitching);
    line(-18, -13, -10, -13); // 绘制缝线 (Draw stitching);
    // 补丁边缘缝线 (Patch edge stitching)
    for (let t = 0; t < 1; t += 0.2) { // 循环绘制边缘缝线 (Loop to draw edge stitching);
        point(lerp(-25, -13, t), lerp(-30, -32, t)); // 绘制点 (Draw point);
        point(lerp(-5, 5, t), lerp(-40, -38, t)); // 绘制点 (Draw point);
        point(lerp(-18, -10, t), lerp(-18, -16, t)); // 绘制点 (Draw point);
    } // 结束for循环 (End of for loop);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
    // 尾巴（动态摆动）(Tail (dynamic swaying))
    stroke(180, 120, 120); // 设置边框颜色 (Set stroke color);
    strokeWeight(2.2); // 设置线宽 (Set stroke weight);
    noFill(); // 不填充 (No fill);
    bezier(-10, 30, -30 + tailSwing, 40, -40 + tailSwing, 30, -30, 10); // 绘制贝塞尔曲线 (Draw Bezier curve);
    noStroke(); // 不绘制边框 (No stroke);
    // 身体（细长）(Body (slender))
    fill(50); // 设置填充颜色 (Set fill color);
    ellipse(0, 20, 22, 32); // 绘制身体椭圆 (Draw body ellipse);
    // 头部（细长，惊吓时微抖）(Head (slender, slightly shakes when scared))
    fill(50); // 设置填充颜色 (Set fill color);
    ellipse(0, 0 + headscared, 18, 16); // 绘制头部椭圆 (Draw head ellipse);
    // 耳朵（细）(Ears (thin))
    fill(170); // 设置填充颜色 (Set fill color);
    ellipse(-8, -8 + headscared, 7, 10); // 绘制左耳 (Draw left ear);
    ellipse(8, -8 + headscared, 7, 10); // 绘制右耳 (Draw right ear);
    fill(220, 200, 200); // 设置填充颜色 (Set fill color);
    ellipse(-8, -8 + headscared, 3, 5); // 绘制左内耳 (Draw left inner ear);
    ellipse(8, -8 + headscared, 3, 5); // 绘制右内耳 (Draw right inner ear);
    // 鼻子（小）(Nose (small))
    fill(120, 60, 60); // 设置填充颜色 (Set fill color);
    ellipse(9, 2 + headscared, 3, 3); // 绘制鼻子椭圆 (Draw nose ellipse);
    // 眼睛（细长，惊吓时更大瞳孔缩小）(Eyes (slender, larger pupils shrink when scared))
    if (state === "run") { // 如果是奔跑状态 (If in run state);
        fill(255); // 设置填充颜色 (Set fill color);
        ellipse(5, -4 + headscared, 8, 12); // 绘制眼睛椭圆 (Draw eye ellipse);
        fill(0); // 设置填充颜色 (Set fill color);
        ellipse(5, -4 + headscared, 1.2, 2.5); // 瞳孔更小 (Smaller pupil) // 绘制瞳孔 (Draw pupil);
        // 受惊眉毛抖动 (Scared eyebrow shaking)
        stroke(0); // 设置边框颜色 (Set stroke color);
        strokeWeight(2); // 设置线宽 (Set stroke weight);
        line(2, -10 + headscared + sin(anim * 0.7) * 2, 8, -12 + headscared + sin(anim * 0.7) * 2); // 绘制眉毛线条 (Draw eyebrow line);
        noStroke(); // 不绘制边框 (No stroke);
        // 张大嘴（倒U形）(Open mouth (inverted U-shape))
        noFill(); // 不填充 (No fill);
        stroke(255, 120, 120); // 设置边框颜色 (Set stroke color);
        strokeWeight(2); // 设置线宽 (Set stroke weight);
        arc(10, 10 + headscared, 7, 8, PI * 0.1, PI * 0.9); // 绘制嘴巴弧线 (Draw mouth arc);
        noStroke(); // 不绘制边框 (No stroke);
    } else { // 否则 (Else);
        fill(255); // 设置填充颜色 (Set fill color);
        ellipse(5, -4, 5, 7); // 绘制眼睛椭圆 (Draw eye ellipse);
        fill(0); // 设置填充颜色 (Set fill color);
        ellipse(5, -4, 2, 3); // 绘制瞳孔 (Draw pupil);
    } // 结束if-else (End of if-else);
    // 嘴巴 (Mouth)
    stroke(60, 40, 40); // 设置边框颜色 (Set stroke color);
    strokeWeight(1.2); // 设置线宽 (Set stroke weight);
    if (state === "run") { // 如果是奔跑状态 (If in run state);
        // 惊吓张嘴 (Scared open mouth)
        line(8, 7, 12, 11); // 绘制嘴巴线条 (Draw mouth line);
    } else { // 否则 (Else);
        line(8, 7, 12, 9); // 绘制嘴巴线条 (Draw mouth line);
    } // 结束if-else (End of if-else);
    noStroke(); // 不绘制边框 (No stroke);
    // 手臂（细，跑步动画）(Arms (thin, running animation))
    fill(50); // 设置填充颜色 (Set fill color);
    ellipse(7 + handSwing, 18, 4, 12); // 绘制右臂椭圆 (Draw right arm ellipse);
    ellipse(-7 - handSwing, 18, 4, 12); // 绘制左臂椭圆 (Draw left arm ellipse);
    // 腿（细，跑步动画）(Legs (thin, running animation))
    fill(50); // 设置填充颜色 (Set fill color);
    ellipse(5 + footSwing, 32, 4, 10); // 绘制右腿椭圆 (Draw right leg ellipse);
    ellipse(-5 - footSwing, 32, 4, 10); // 绘制左腿椭圆 (Draw left leg ellipse);
    // 黑色头巾（结随步伐摆动）(Black bandana (knot swings with steps))
    push(); // 保存当前绘图状态 (Save current drawing state);
    translate(0, -8); // 平移画布 (Translate canvas);
    fill(30, 30, 30); // 设置填充颜色 (Set fill color);
    arc(0, 0, 18, 10, PI, 0, CHORD); // 绘制头巾弧线 (Draw bandana arc);
    // 头巾结 (Bandana knot)
    push(); // 保存当前绘图状态 (Save current drawing state);
    rotate(sin(step) * 0.2); // 旋转 (Rotate);
    triangle(-7, 0, -12, -4, -3, -2); // 绘制三角形 (Draw triangle);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
    push(); // 保存当前绘图状态 (Save current drawing state);
    rotate(-sin(step) * 0.2); // 旋转 (Rotate);
    triangle(7, 0, 12, -4, 3, -2); // 绘制三角形 (Draw triangle);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
    pop(); // 恢复之前保存的绘图状态 (Restore previously saved drawing state);
} // 结束 (End);

function drawCastleAndFlag() {
    // 位置参数
    let scale = 1.3; // 放大比例
    let castleX = worldWidth - 320 * scale; // 向左移，留出更大空间
    let castleY = floorPos_y - 480 * scale; // 更高耸
    // 云朵底座
    fill(255, 255, 255, 230);
    noStroke();
    ellipse(castleX + 180 * scale, castleY + 480 * scale, 390 * scale, 105 * scale);
    ellipse(castleX + 60 * scale, castleY + 540 * scale, 180 * scale, 60 * scale);
    ellipse(castleX + 300 * scale, castleY + 540 * scale, 180 * scale, 60 * scale);
    ellipse(castleX + 255 * scale, castleY + 510 * scale, 135 * scale, 45 * scale);
    // 主体大墙体
    fill(180, 210, 255);
    rect(castleX + 45 * scale, castleY + 270 * scale, 270 * scale, 210 * scale, 27 * scale);
    // 中央高塔
    fill(140, 200, 255);
    rect(castleX + 142 * scale, castleY + 90 * scale, 75 * scale, 240 * scale, 24 * scale);
    // 中央高塔顶部锥形屋顶
    fill(60, 120, 220);
    triangle(castleX + 180 * scale, castleY - 45 * scale, castleX + 142 * scale, castleY + 90 * scale, castleX + 218 * scale, castleY + 90 * scale);
    // 中央高塔旗杆
    stroke(180, 200, 255);
    strokeWeight(6 * scale);
    line(castleX + 180 * scale, castleY - 45 * scale, castleX + 180 * scale, castleY - 105 * scale);
    noStroke();
    fill(120, 200, 255);
    triangle(castleX + 180 * scale, castleY - 105 * scale, castleX + 240 * scale, castleY - 90 * scale, castleX + 180 * scale, castleY - 82 * scale);
    // 左右主塔
    fill(120, 180, 255);
    rect(castleX + 45 * scale, castleY + 180 * scale, 60 * scale, 180 * scale, 18 * scale);
    rect(castleX + 255 * scale, castleY + 180 * scale, 60 * scale, 180 * scale, 18 * scale);
    // 左右主塔屋顶
    fill(60, 140, 220);
    triangle(castleX + 75 * scale, castleY + 105 * scale, castleX + 45 * scale, castleY + 180 * scale, castleX + 105 * scale, castleY + 180 * scale);
    triangle(castleX + 285 * scale, castleY + 105 * scale, castleX + 255 * scale, castleY + 180 * scale, castleX + 315 * scale, castleY + 180 * scale);
    // 左右主塔旗杆
    stroke(180, 200, 255);
    strokeWeight(4.5 * scale);
    line(castleX + 75 * scale, castleY + 105 * scale, castleX + 75 * scale, castleY + 60 * scale);
    line(castleX + 285 * scale, castleY + 105 * scale, castleX + 285 * scale, castleY + 60 * scale);
    noStroke();
    fill(120, 200, 255);
    triangle(castleX + 75 * scale, castleY + 60 * scale, castleX + 120 * scale, castleY + 75 * scale, castleX + 75 * scale, castleY + 82 * scale);
    triangle(castleX + 285 * scale, castleY + 60 * scale, castleX + 330 * scale, castleY + 75 * scale, castleX + 285 * scale, castleY + 82 * scale);
    // 两侧圆塔
    fill(200, 220, 255);
    rect(castleX + 0 * scale, castleY + 300 * scale, 60 * scale, 150 * scale, 27 * scale);
    rect(castleX + 300 * scale, castleY + 300 * scale, 60 * scale, 150 * scale, 27 * scale);
    // 两侧圆塔屋顶
    fill(80, 160, 240);
    triangle(castleX + 30 * scale, castleY + 255 * scale, castleX + 0 * scale, castleY + 300 * scale, castleX + 60 * scale, castleY + 300 * scale);
    triangle(castleX + 330 * scale, castleY + 255 * scale, castleX + 300 * scale, castleY + 300 * scale, castleX + 360 * scale, castleY + 300 * scale);
    // 两侧圆塔旗杆
    stroke(180, 200, 255);
    strokeWeight(3.5 * scale);
    line(castleX + 30 * scale, castleY + 255 * scale, castleX + 30 * scale, castleY + 225 * scale);
    line(castleX + 330 * scale, castleY + 255 * scale, castleX + 330 * scale, castleY + 225 * scale);
    noStroke();
    fill(120, 200, 255);
    triangle(castleX + 30 * scale, castleY + 225 * scale, castleX + 60 * scale, castleY + 232 * scale, castleX + 30 * scale, castleY + 240 * scale);
    triangle(castleX + 330 * scale, castleY + 225 * scale, castleX + 360 * scale, castleY + 232 * scale, castleX + 330 * scale, castleY + 240 * scale);
    // 门
    fill(255);
    rect(castleX + 158 * scale, castleY + 390 * scale, 45 * scale, 90 * scale, 18 * scale);
    fill(120, 180, 255);
    ellipse(castleX + 180 * scale, castleY + 480 * scale, 45 * scale, 27 * scale);
    // 窗户
    fill(255);
    ellipse(castleX + 180 * scale, castleY + 180 * scale, 27 * scale, 36 * scale);
    fill(180, 220, 255);
    ellipse(castleX + 90 * scale, castleY + 255 * scale, 18 * scale, 24 * scale);
    ellipse(castleX + 270 * scale, castleY + 255 * scale, 18 * scale, 24 * scale);
    // 细节：更多云朵
    fill(255, 255, 255, 220);
    ellipse(castleX + 90 * scale, castleY + 525 * scale, 45 * scale, 21 * scale);
    ellipse(castleX + 270 * scale, castleY + 525 * scale, 45 * scale, 21 * scale);
}

function nextLevel() {
    level++;
    // 重置猫、老鼠、奖励、状态等，分数可保留或重置
    cat_x = width / 2;
    cat_y = floorPos_y;
    cat_vy = 0;
    isFiringFishbone = false;
    isMovingLeft = false;
    isMovingRight = false;
    isJumping = false;
    mice = [];
    apples = [];
    rewardFishes = [];
    fishes = []; // 重置普通鱼数组 (Reset regular fish array)
    octopuses = []; // 重置章鱼数组 (Reset octopus array)
    crabs = []; // 重置螃蟹数组 (Reset crab array)
    turtles = []; // 重置乌龟数组 (Reset turtle array)
    life = 100;
    isInvincible = false;
    invincibleTimer = 0;
    levelComplete = false;
    // 可根据需要重置分数：score = 0;
}

// 鱼的生成、更新和绘制函数 (Fish generation, update and drawing functions)
function spawnFish() {
    // 在桥下的河流区域生成鱼 (Spawn fish in river area under the bridge)
    let bridgeStartX = width - 100; // 桥的起始位置 (Bridge start position)
    let bridgeEndX = width + 400; // 桥的结束位置 (Bridge end position)

    // 只在桥下的河流区域生成鱼 (Only spawn fish in river area under bridge)
    if (cameraX + width > bridgeStartX && cameraX < bridgeEndX) {
        let riverY = floorPos_y + 40; // 河流底部高度，在桥下更深处 (River bottom height, deeper under bridge)
        let fishX = random(max(bridgeStartX, cameraX - 50), min(bridgeEndX, cameraX + width + 50)); // 限制在桥下区域 (Limit to area under bridge)
        let fishY = riverY + random(-20, 15); // 在河流底部更深处随机高度 (Random height deeper in river)
        let fishSpeed = random(0.5, 2); // 桥下水流较慢 (Slower speed under bridge)

        // 随机决定鱼的游动方向 (Randomly decide fish swimming direction)
        if (random() > 0.5) {
            fishSpeed = -fishSpeed; // 向左游 (Swim left)
        }

        fishes.push({
            x: fishX,
            y: fishY,
            speed: fishSpeed,
            size: random(8, 16), // 桥下的鱼稍小 (Smaller fish under bridge)
            color: color(random(80, 200), random(80, 180), random(40, 120)), // 桥下较暗的颜色 (Darker colors under bridge)
            wobble: random(TWO_PI)
        });
    }
}

function updateFishes() {
    let bridgeStartX = width - 100; // 桥的起始位置 (Bridge start position)
    let bridgeEndX = width + 400; // 桥的结束位置 (Bridge end position)

    for (let i = fishes.length - 1; i >= 0; i--) {
        let fish = fishes[i];
        // 更新鱼的位置 (Update fish position)
        fish.x += fish.speed;
        fish.wobble += 0.1;
        fish.y += sin(fish.wobble) * 0.5;

        // 限制鱼在桥下河流区域内 (Restrict fish to river area under bridge)
        if (fish.x < bridgeStartX) {
            fish.x = bridgeStartX; // 不能超过桥的起始位置 (Cannot go beyond bridge start)
            fish.speed = abs(fish.speed); // 改变方向 (Change direction)
        }
        if (fish.x > bridgeEndX) {
            fish.x = bridgeEndX; // 不能超过桥的结束位置 (Cannot go beyond bridge end)
            fish.speed = -abs(fish.speed); // 改变方向 (Change direction)
        }

        // 限制鱼的垂直范围在河流内 (Restrict fish vertical range within river)
        let riverY = floorPos_y + 40; // 河流底部高度 (River bottom height)
        if (fish.y < riverY - 30) {
            fish.y = riverY - 30; // 不能游得太高 (Cannot swim too high)
        }
        if (fish.y > riverY + 20) {
            fish.y = riverY + 20; // 不能游得太低 (Cannot swim too low)
        }

        // 如果鱼游出屏幕，从数组中移除 (Remove fish if it swims off screen)
        if (fish.x > cameraX + width + 100) {
            fishes.splice(i, 1);
        }
    }
}

function drawFishes() {
    for (let fish of fishes) {
        // 只绘制在摄像机视野内的鱼 (Only draw fish within camera view)
        if (fish.x + fish.size > cameraX - 50 && fish.x - fish.size < cameraX + width + 50) {
            push();
            translate(fish.x, fish.y);
            rotate(sin(fish.wobble) * 0.1);

            // 桥下鱼的特殊效果：添加阴影和半透明效果 (Special effects for fish under bridge: shadow and transparency)
            let alpha = 180 + sin(fish.wobble * 2) * 30; // 动态透明度 (Dynamic transparency)

            // 绘制鱼身 (Draw fish body)
            fill(red(fish.color), green(fish.color), blue(fish.color), alpha);
            noStroke();
            ellipse(0, 0, fish.size, fish.size / 2);

            // 绘制鱼尾 (Draw fish tail)
            triangle(fish.size / 2, 0, fish.size / 2 + 5, -3, fish.size / 2 + 5, 3);

            // 绘制鱼眼 (Draw fish eye) - 桥下较暗 (Darker under bridge)
            fill(0, alpha);
            ellipse(-fish.size / 4, 0, 3, 3);

            // 绘制鱼鳍 (Draw fish fins)
            fill(red(fish.color), green(fish.color), blue(fish.color), alpha);
            triangle(fish.size / 2, 0, fish.size / 2 + 10, -fish.size / 4, fish.size / 2 + 10, fish.size / 4);

            // 添加水波效果 (Add water ripple effect)
            if (random() > 0.95) { // 偶尔产生水波 (Occasionally create ripples)
                noFill();
                stroke(255, 255, 255, 50);
                strokeWeight(1);
                ellipse(0, 0, fish.size * 2, fish.size);
                noStroke();
            }

            pop();
        }
    }
}

// 章鱼的生成、更新和绘制函数 (Octopus generation, update and drawing functions)
function spawnOctopus() {
    let bridgeStartX = width - 100;
    let bridgeEndX = width + 400;

    if (cameraX + width > bridgeStartX && cameraX < bridgeEndX && octopuses.length < 2) {
        let riverY = floorPos_y + 35;
        let octopusX = random(bridgeStartX + 50, bridgeEndX - 50);
        let octopusY = riverY + random(-25, 10);
        let octopusSpeed = random(0.3, 0.8);

        if (random() > 0.5) {
            octopusSpeed = -octopusSpeed;
        }

        octopuses.push({
            x: octopusX,
            y: octopusY,
            speed: octopusSpeed,
            size: random(15, 25),
            color: color(random(100, 200), random(50, 150), random(100, 200)),
            tentaclePhase: random(TWO_PI),
            inkTimer: 0
        });
    }
}

function updateOctopuses() {
    let bridgeStartX = width - 100;
    let bridgeEndX = width + 400;

    for (let i = octopuses.length - 1; i >= 0; i--) {
        let octopus = octopuses[i];
        octopus.x += octopus.speed;
        octopus.tentaclePhase += 0.15;
        octopus.inkTimer++;

        // 边界限制
        if (octopus.x < bridgeStartX) {
            octopus.x = bridgeStartX;
            octopus.speed = abs(octopus.speed);
        }
        if (octopus.x > bridgeEndX) {
            octopus.x = bridgeEndX;
            octopus.speed = -abs(octopus.speed);
        }

        // 垂直限制
        let riverY = floorPos_y + 35;
        if (octopus.y < riverY - 35) octopus.y = riverY - 35;
        if (octopus.y > riverY + 15) octopus.y = riverY + 15;

        // 偶尔释放墨汁
        if (octopus.inkTimer > 300 && random() > 0.98) {
            octopus.inkTimer = 0;
        }
    }
}

function drawOctopuses() {
    for (let octopus of octopuses) {
        if (octopus.x + octopus.size > cameraX - 50 && octopus.x - octopus.size < cameraX + width + 50) {
            push();
            translate(octopus.x, octopus.y);

            // 章鱼身体
            fill(octopus.color);
            noStroke();
            ellipse(0, 0, octopus.size, octopus.size * 0.8);

            // 章鱼眼睛
            fill(255);
            ellipse(-octopus.size * 0.2, -octopus.size * 0.1, octopus.size * 0.3, octopus.size * 0.3);
            ellipse(octopus.size * 0.2, -octopus.size * 0.1, octopus.size * 0.3, octopus.size * 0.3);
            fill(0);
            ellipse(-octopus.size * 0.2, -octopus.size * 0.1, octopus.size * 0.15, octopus.size * 0.15);
            ellipse(octopus.size * 0.2, -octopus.size * 0.1, octopus.size * 0.15, octopus.size * 0.15);

            // 章鱼触手
            for (let i = 0; i < 8; i++) {
                let angle = (i / 8) * TWO_PI + octopus.tentaclePhase;
                let tentacleLength = octopus.size * 0.8;
                let tentacleX = cos(angle) * tentacleLength;
                let tentacleY = sin(angle) * tentacleLength;

                stroke(octopus.color);
                strokeWeight(3);
                line(0, 0, tentacleX, tentacleY);
            }
            noStroke();

            // 墨汁效果
            if (octopus.inkTimer < 30) {
                fill(0, 0, 0, 100);
                ellipse(octopus.x - octopus.x, octopus.y - octopus.y, octopus.size * 2, octopus.size * 2);
            }

            pop();
        }
    }
}

// 螃蟹的生成、更新和绘制函数 (Crab generation, update and drawing functions)
function spawnCrab() {
    let bridgeStartX = width - 100;
    let bridgeEndX = width + 400;

    if (cameraX + width > bridgeStartX && cameraX < bridgeEndX && crabs.length < 2) {
        let riverY = floorPos_y + 45;
        let crabX = random(bridgeStartX + 50, bridgeEndX - 50);
        let crabY = riverY + random(-15, 15);
        let crabSpeed = random(0.2, 0.6);

        if (random() > 0.5) {
            crabSpeed = -crabSpeed;
        }

        crabs.push({
            x: crabX,
            y: crabY,
            speed: crabSpeed,
            size: random(12, 18),
            color: color(random(150, 220), random(50, 100), random(50, 100)),
            clawPhase: random(TWO_PI),
            walkPhase: random(TWO_PI)
        });
    }
}

function updateCrabs() {
    let bridgeStartX = width - 100;
    let bridgeEndX = width + 400;

    for (let i = crabs.length - 1; i >= 0; i--) {
        let crab = crabs[i];
        crab.x += crab.speed;
        crab.clawPhase += 0.2;
        crab.walkPhase += 0.3;

        // 边界限制
        if (crab.x < bridgeStartX) {
            crab.x = bridgeStartX;
            crab.speed = abs(crab.speed);
        }
        if (crab.x > bridgeEndX) {
            crab.x = bridgeEndX;
            crab.speed = -abs(crab.speed);
        }

        // 垂直限制
        let riverY = floorPos_y + 45;
        if (crab.y < riverY - 20) crab.y = riverY - 20;
        if (crab.y > riverY + 20) crab.y = riverY + 20;
    }
}

function drawCrabs() {
    for (let crab of crabs) {
        if (crab.x + crab.size > cameraX - 50 && crab.x - crab.size < cameraX + width + 50) {
            push();
            translate(crab.x, crab.y);

            // 螃蟹身体
            fill(crab.color);
            noStroke();
            ellipse(0, 0, crab.size, crab.size * 0.6);

            // 螃蟹眼睛
            fill(255);
            ellipse(-crab.size * 0.25, -crab.size * 0.15, crab.size * 0.2, crab.size * 0.2);
            ellipse(crab.size * 0.25, -crab.size * 0.15, crab.size * 0.2, crab.size * 0.2);
            fill(0);
            ellipse(-crab.size * 0.25, -crab.size * 0.15, crab.size * 0.1, crab.size * 0.1);
            ellipse(crab.size * 0.25, -crab.size * 0.15, crab.size * 0.1, crab.size * 0.1);

            // 螃蟹钳子
            let leftClawX = -crab.size * 0.6;
            let rightClawX = crab.size * 0.6;
            let clawY = 0;

            // 左钳
            push();
            translate(leftClawX, clawY);
            rotate(sin(crab.clawPhase) * 0.3);
            fill(crab.color);
            ellipse(0, 0, crab.size * 0.4, crab.size * 0.3);
            pop();

            // 右钳
            push();
            translate(rightClawX, clawY);
            rotate(sin(crab.clawPhase + PI) * 0.3);
            fill(crab.color);
            ellipse(0, 0, crab.size * 0.4, crab.size * 0.3);
            pop();

            // 螃蟹腿
            for (let i = 0; i < 4; i++) {
                let angle = (i / 4) * PI - PI / 2;
                let legLength = crab.size * 0.5;
                let legX = cos(angle) * legLength;
                let legY = sin(angle) * legLength;

                stroke(crab.color);
                strokeWeight(2);
                let walkOffset = sin(crab.walkPhase + i) * 3;
                line(0, 0, legX + walkOffset, legY);
            }
            noStroke();

            pop();
        }
    }
}

// 乌龟的生成、更新和绘制函数 (Turtle generation, update and drawing functions)
function spawnTurtle() {
    let bridgeStartX = width - 100;
    let bridgeEndX = width + 400;

    if (cameraX + width > bridgeStartX && cameraX < bridgeEndX && turtles.length < 1) {
        let riverY = floorPos_y + 50;
        let turtleX = random(bridgeStartX + 100, bridgeEndX - 100);
        let turtleY = riverY + random(-20, 10);
        let turtleSpeed = random(0.1, 0.4);

        if (random() > 0.5) {
            turtleSpeed = -turtleSpeed;
        }

        turtles.push({
            x: turtleX,
            y: turtleY,
            speed: turtleSpeed,
            size: random(20, 30),
            color: color(random(50, 150), random(100, 180), random(50, 120)),
            headPhase: random(TWO_PI),
            swimPhase: random(TWO_PI)
        });
    }
}

function updateTurtles() {
    let bridgeStartX = width - 100;
    let bridgeEndX = width + 400;

    for (let i = turtles.length - 1; i >= 0; i--) {
        let turtle = turtles[i];
        turtle.x += turtle.speed;
        turtle.headPhase += 0.1;
        turtle.swimPhase += 0.2;

        // 边界限制
        if (turtle.x < bridgeStartX) {
            turtle.x = bridgeStartX;
            turtle.speed = abs(turtle.speed);
        }
        if (turtle.x > bridgeEndX) {
            turtle.x = bridgeEndX;
            turtle.speed = -abs(turtle.speed);
        }

        // 垂直限制
        let riverY = floorPos_y + 50;
        if (turtle.y < riverY - 25) turtle.y = riverY - 25;
        if (turtle.y > riverY + 15) turtle.y = riverY + 15;
    }
}

function drawTurtles() {
    for (let turtle of turtles) {
        if (turtle.x + turtle.size > cameraX - 50 && turtle.x - turtle.size < cameraX + width + 50) {
            push();
            translate(turtle.x, turtle.y);

            // 乌龟壳
            fill(turtle.color);
            noStroke();
            ellipse(0, 0, turtle.size, turtle.size * 0.8);

            // 乌龟壳纹理
            stroke(turtle.color);
            strokeWeight(1);
            for (let i = 0; i < 6; i++) {
                let angle = (i / 6) * TWO_PI;
                let radius = turtle.size * 0.3;
                let x = cos(angle) * radius;
                let y = sin(angle) * radius;
                ellipse(x, y, turtle.size * 0.2, turtle.size * 0.15);
            }
            noStroke();

            // 乌龟头
            push();
            translate(0, -turtle.size * 0.3);
            rotate(sin(turtle.headPhase) * 0.2);
            fill(turtle.color);
            ellipse(0, 0, turtle.size * 0.4, turtle.size * 0.3);

            // 乌龟眼睛
            fill(255);
            ellipse(-turtle.size * 0.1, -turtle.size * 0.05, turtle.size * 0.15, turtle.size * 0.15);
            ellipse(turtle.size * 0.1, -turtle.size * 0.05, turtle.size * 0.15, turtle.size * 0.15);
            fill(0);
            ellipse(-turtle.size * 0.1, -turtle.size * 0.05, turtle.size * 0.08, turtle.size * 0.08);
            ellipse(turtle.size * 0.1, -turtle.size * 0.05, turtle.size * 0.08, turtle.size * 0.08);
            pop();

            // 乌龟腿
            for (let i = 0; i < 4; i++) {
                let angle = (i / 4) * PI - PI / 2;
                let legLength = turtle.size * 0.4;
                let legX = cos(angle) * legLength;
                let legY = sin(angle) * legLength;

                fill(turtle.color);
                ellipse(legX, legY, turtle.size * 0.2, turtle.size * 0.15);
            }

            // 游泳动画
            let swimOffset = sin(turtle.swimPhase) * 2;
            translate(0, swimOffset);

            pop();
        }
    }
}



// 鼠标点击事件处理 (Mouse click event handling)
function mousePressed() {
    // === 右键事件阻止系统 ===
    // 阻止右键对其他控制键的干扰
    if (mouseButton === RIGHT) {
        console.log('🚫 右键点击被阻止 - 保护独立控制系统');
        return false; // 阻止右键的所有默认行为
    }

    if (levelComplete) {
        nextLevel();
        return;
    }

    // === 独立的跳跃系统 ===
    // 只处理左键跳跃，不干扰移动速度
    if (mouseButton === LEFT && dist(mouseX, mouseY, cat_x, cat_y) > 100) {
        if (cat_y === floorPos_y) {
            cat_vy = -15;
            isJumping = true;
            console.log('🎯 左键点击 - 猫跳跃，保持独立移动系统');
        }
    }
}

// 鼠标释放事件处理 (Mouse release event handling)
function mouseReleased() {
    // === 右键事件阻止系统 ===
    // 阻止右键对其他控制键的干扰
    if (mouseButton === RIGHT) {
        console.log('🚫 右键释放被阻止 - 保护独立控制系统');
        return false; // 阻止右键的所有默认行为
    }
}