// 游戏模块化系统
// 包含所有功能的模块化组织

// ===== 天气系统模块 =====
class WeatherSystem {
    constructor() {
        this.isNight = false;
        this.isRaining = false;
        this.isSnowing = false;
        this.raindrops = [];
        this.snowParticles = [];
        this.stars = [];
        this.meteors = [];
        this.meteorInterval = 1800 + Math.floor(Math.random() * 900);

        // 地面积雪系统
        this.groundSnow = []; // 存储地面上的积雪点
        this.snowAccumulation = 0; // 积雪累积程度 (0-100)
        this.lastMeteorFrame = -2000;
        this.weatherInterval = null;

        this.config = {
            // 统一计时器设置（毫秒）
            SNOW_DURATION: 30000,    // 下雪持续30秒（与昼夜循环一致）
            DAY_DURATION: 30000,     // 白天持续30秒  
            NIGHT_DURATION: 30000,   // 黑夜持续30秒
            MAX_RAINDROPS: 400,
            MAX_SNOW: 500 // 🚀 大幅增加最大雪花数量：从200提升到500
        };

        // 天气计时器状态
        this.currentWeatherStartTime = Date.now();
        this.currentWeatherType = 'none';
        this.currentDayNight = 'day';

        // 闪电系统
        this.lightning = {
            active: false,
            duration: 0,
            maxDuration: 12, // 闪电持续12帧
            brightness: 255,
            nextLightningTime: 0,
            minInterval: 2000, // 最小间隔2秒
            maxInterval: 8000  // 最大间隔8秒
        };

        this.init();
    }

    init() {
        for (let i = 0; i < 1; i++) {
            this.meteors.push({
                x: random(width),
                y: random(0, 200),
                speed: random(10, 18),
                active: false,
                timer: floor(random(120, 480))
            });
        }

        this.generateStaticSnow();
        this.startAutoWeatherSwitch();
    }

    startAutoWeatherSwitch() {
        if (!window._weatherIntervalSet) {
            // 使用统一时间系统，每30秒检查一次是否需要切换
            this.weatherInterval = setInterval(() => {
                this.checkWeatherSwitch();
            }, 30000);
            window._weatherIntervalSet = true;
            console.log('🌤️ 动态天气系统启动：下雪40秒，白天10秒，黑夜40秒');
        }
    }

    // 新的动态天气检查系统
    checkWeatherSwitch() {
        const currentTime = Date.now();
        const elapsed = currentTime - this.currentWeatherStartTime;

        let shouldSwitch = false;
        let nextWeather = null;
        let nextDayNight = null;

        // 检查当前天气是否应该结束
        if (this.currentWeatherType === 'snow' && elapsed >= this.config.SNOW_DURATION) {
            // 下雪30秒后，检查是否完全落地
            if (this.isSnowFullyGrounded()) {
                shouldSwitch = true;
                nextWeather = 'none';
                nextDayNight = this.currentDayNight; // 保持昼夜不变
            } else {
                // 如果雪花未落地，延长下雪时间
                console.log(`❄️ 下雪时间到但雪花未完全落地，延长下雪时间...`);
                return;
            }
        } else if (this.currentDayNight === 'day' && elapsed >= this.config.DAY_DURATION) {
            // 白天30秒后切换
            shouldSwitch = true;
            nextDayNight = 'night';
            nextWeather = random(['snow', 'none']); // 夜晚可能下雪
        } else if (this.currentDayNight === 'night' && elapsed >= this.config.NIGHT_DURATION) {
            // 黑夜30秒后切换
            shouldSwitch = true;
            nextDayNight = 'day';
            nextWeather = 'none'; // 白天不下雪
        }

        if (shouldSwitch) {
            this.performWeatherSwitch(nextWeather, nextDayNight);
        }
    }

    // 执行天气切换
    performWeatherSwitch(weatherType, dayNight) {
        // 更新状态
        this.currentWeatherType = weatherType;
        this.currentDayNight = dayNight;
        this.currentWeatherStartTime = Date.now();

        // 设置天气
        this.isRaining = (weatherType === "rain");
        this.isSnowing = (weatherType === "snow");
        this.isNight = (dayNight === "night");

        // 如果开始下雪，立即激活超级快速雪花
        if (this.isSnowing) {
            let activatedCount = 0;
            for (let i = 0; i < this.snowParticles.length && activatedCount < 80; i++) {
                if (!this.snowParticles[i].active) {
                    let p = this.snowParticles[i];
                    p.x = random(-200, worldWidth + 200);
                    p.y = random(-300, -50); // 从更高位置开始
                    p.vy = random(12.0, 20.0); // 超级快速下降
                    p.vx = random(-1.5, 1.5); // 增加横向漂移
                    p.alpha = random(220, 255);
                    p.active = true;
                    activatedCount++;
                }
            }
            console.log(`❄️ 超级快速下雪开始！激活了${activatedCount}个雪花粒子，持续40秒`);
        } else {
            // 停止下雪时清理雪花
            this.snowParticles.forEach(p => p.active = false);
        }

        // 设置星空
        if (this.isNight) {
            this.createStars();
            for (let m of this.meteors) m.active = false;
        } else {
            this.stars = [];
            for (let m of this.meteors) m.active = false;
        }

        // 清理雨滴
        this.raindrops = [];

        // 通知音频系统天气变化
        if (gameController && gameController.audioSystem) {
            gameController.audioSystem.onWeatherChange(this.getWeatherStatus());
        }

        // 计算下次切换时间
        let duration = 0;
        if (weatherType === 'snow') duration = this.config.SNOW_DURATION / 1000;
        else if (dayNight === 'day') duration = this.config.DAY_DURATION / 1000;
        else if (dayNight === 'night') duration = this.config.NIGHT_DURATION / 1000;

        console.log(`✅ 天气切换: ${dayNight === 'night' ? '夜晚🌙' : '白天☀️'}, ${weatherType === 'snow' ? '下雪❄️' : weatherType === 'none' ? '晴朗🌤️' : weatherType} (持续${duration}秒)`);
    }

    // 保留原来的手动切换方法，但更新为新系统
    switchWeather() {
        // 手动切换天气（保持兼容性）
        this.performWeatherSwitch(
            random(["rain", "snow", "none"]),
            random(["day", "night"])
        );
    }

    createStars() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: random(worldWidth),
                y: random(height / 2),
                brightness: random(150, 255),
                size: random(2, 7),
                flicker: random(0.01, 0.05)
            });
        }
    }

    generateStaticSnow() {
        this.snowX = [370, 400, 430, 460, 500, 540, 570, 600];
        this.snowY = [
            floorPos_y - 230 + random(-6, 6),
            floorPos_y - 250 + random(-8, 8),
            floorPos_y - 270 + random(-10, 10),
            floorPos_y - 290 + random(-12, 12),
            floorPos_y - 280 + random(-10, 10),
            floorPos_y - 260 + random(-8, 8),
            floorPos_y - 245 + random(-6, 6),
            floorPos_y - 235 + random(-5, 5)
        ];

        // 预生成一些雪花粒子
        for (let i = 0; i < 30; i++) {
            this.snowParticles.push({
                x: random(-200, worldWidth + 200), // 扩展到整个世界宽度
                y: random(-height, floorPos_y), // 在地面以上的区域分布
                vy: random(12.0, 20.0), // 🚀 超级快速下降：从4.0-8.0提升到12.0-20.0
                vx: random(-1.0, 1.0), // 增加横向漂移范围
                size: random(2, 5),
                alpha: random(200, 255), // 提高预生成雪花的初始透明度
                active: false // 初始设为false，等下雪时激活
            });
        }
    }

    addRaindrop() {
        for (let i = 0; i < this.raindrops.length; i++) {
            const d = this.raindrops[i];
            if (!d.active) {
                d.x = random(-100, worldWidth + 100); // 扩展到整个世界宽度
                d.y = random(-20, 0);
                d.vy = random(10, 18);
                d.active = true;
                return;
            }
        }

        if (this.raindrops.length < this.config.MAX_RAINDROPS) {
            this.raindrops.push({
                x: random(-100, worldWidth + 100), // 扩展到整个世界宽度
                y: random(-20, 0),
                vy: random(10, 18),
                active: true
            });
        }
    }

    addSnowParticle() {
        // 优先复用现有粒子
        for (let i = 0; i < this.snowParticles.length; i++) {
            const s = this.snowParticles[i];
            if (!s.active) {
                s.x = random(-200, width + 200); // 使用屏幕宽度，不跟随相机
                s.y = random(-200, -50); // 从更高位置开始，确保有足够下降空间
                s.vy = random(12.0, 20.0); // 🚀 超级快速下降：从4.0-8.0提升到12.0-20.0
                s.vx = random(-1.0, 1.0); // 增加横向漂移范围
                s.size = random(2, 5);
                s.alpha = random(220, 255); // 进一步提高初始透明度，让雪花更明显
                s.active = true;
                return;
            }
        }

        // 如果没有可复用的粒子且未达到上限，创建新粒子
        if (this.snowParticles.length < this.config.MAX_SNOW) {
            this.snowParticles.push({
                x: random(-200, width + 200), // 使用屏幕宽度，不跟随相机
                y: random(-200, -50), // 从更高位置开始 
                vy: random(12.0, 20.0), // 🚀 超级快速下降
                vx: random(-1.0, 1.0), // 增加横向漂移范围
                size: random(2, 5),
                alpha: random(220, 255), // 进一步提高初始透明度
                active: true
            });
        }
    }

    // 在地面创建积雪点
    addGroundSnow(x, y) {
        // 检查附近是否已有积雪点，避免重复
        let nearby = this.groundSnow.find(snow =>
            Math.abs(snow.x - x) < 15 && Math.abs(snow.y - y) < 10
        );

        if (!nearby) {
            // 创建新的积雪点
            this.groundSnow.push({
                x: x,
                y: y,
                size: random(3, 8),
                alpha: random(180, 220),
                createdTime: frameCount
            });

            // 增加积雪累积程度
            this.snowAccumulation = Math.min(100, this.snowAccumulation + 0.5);
        } else {
            // 增加现有积雪点的大小
            nearby.size = Math.min(12, nearby.size + 0.5);
            nearby.alpha = Math.min(255, nearby.alpha + 5);
        }

        // 限制积雪点数量，避免性能问题
        if (this.groundSnow.length > 300) {
            this.groundSnow.splice(0, 50); // 移除最老的50个积雪点
        }
    }

    updateRain() {
        if (!this.isRaining) return;

        for (let i = 0; i < this.raindrops.length; i++) {
            let drop = this.raindrops[i];
            if (!drop.active) continue;

            drop.y += (drop.vy !== undefined ? drop.vy : 7);
            drop.x -= 1;

            if (drop.y > height) {
                drop.active = false;
            }
        }

        if (frameCount % 2 === 0) {
            for (let i = 0; i < 5; i++) {
                this.addRaindrop();
            }
        }
    }

    updateSnow() {
        if (!this.isSnowing) return;

        // 每帧生成新的雪花粒子 - 大幅增加生成频率和数量
        if (frameCount % 1 === 0) { // 🚀 每帧都生成雪花，最高频率
            for (let i = 0; i < 12; i++) { // 🚀 大幅增加每次生成数量：12个雪花
                this.addSnowParticle();
            }
        }

        // 更新现有雪花粒子
        for (let i = 0; i < this.snowParticles.length; i++) {
            const p = this.snowParticles[i];
            if (!p.active) continue;

            // 移动雪花
            p.y += p.vy;
            p.x += p.vx + sin(frameCount * 0.01 + i) * 0.1;

            // 进一步减缓透明度递减速度，确保快速雪花能到达地面
            p.alpha -= 0.01; // 🚀 大幅减慢透明度递减，配合快速下降

            // 雪花落到地面时创建积雪并回收粒子
            if (p.y >= floorPos_y + 5) { // 确保雪花完全到达地面以下
                // 在地面创建积雪点
                this.addGroundSnow(p.x, floorPos_y);
                p.active = false;
            } else if (p.alpha < 10) {
                // 透明度过低时也回收
                p.active = false;
            }
        }
    }

    updateMeteors() {
        if (!this.isNight || !this.meteors || this.meteors.length === 0) return;

        if (frameCount - this.lastMeteorFrame > this.meteorInterval) {
            for (let m of this.meteors) {
                if (!m.active) {
                    m.x = random(width);
                    m.y = random(0, 200);
                    m.active = true;
                    m.timer = floor(random(200, 800));
                    this.lastMeteorFrame = frameCount;
                    this.meteorInterval = 1800 + Math.floor(Math.random() * 900);
                    break;
                }
            }
        }

        for (let m of this.meteors) {
            if (m.active) {
                m.x -= m.speed;
                m.y += m.speed * 0.5;

                if (m.x < -50 || m.y > height) {
                    m.active = false;
                }
            }
        }
    }

    drawRain() {
        if (!this.isRaining) return;

        // 下雨时的整体阴影效果（减少阴影）
        push();
        fill(0, 0, 0, 15); // 轻微的阴影覆盖
        rect(-cameraX, 0, width, height);
        pop();

        // 绘制雨滴
        for (let drop of this.raindrops) {
            if (!drop.active) continue;

            push();
            // 主雨滴
            stroke(180, 200, 255, 180);
            strokeWeight(2);
            line(drop.x - cameraX, drop.y, drop.x - cameraX - 6, drop.y + 12);

            // 雨滴光效
            stroke(220, 240, 255, 100);
            strokeWeight(1);
            line(drop.x - cameraX + 1, drop.y, drop.x - cameraX - 4, drop.y + 10);
            pop();
        }

        // 下雨时的大气效果
        if (frameCount % 3 === 0) {
            push();
            fill(200, 220, 255, 8);
            rect(-cameraX, 0, width, height);
            pop();
        }
    }

    drawSnow() {
        if (!this.isSnowing) return;

        noStroke();

        // 重置变换矩阵，确保雪花粒子不受相机影响
        push();
        resetMatrix();

        for (let p of this.snowParticles) {
            if (!p.active) continue;

            // 雪花绘制
            fill(255, 255, 255, p.alpha);
            ellipse(p.x, p.y, p.size, p.size);

            // 添加雪花细节效果
            fill(255, 255, 255, p.alpha * 0.6);
            ellipse(p.x + 1, p.y + 1, p.size * 0.7, p.size * 0.7);

            // 雪花闪烁效果
            if (sin(frameCount * 0.05 + p.x * 0.01) > 0.7) {
                fill(255, 255, 255, p.alpha * 0.8);
                ellipse(p.x, p.y, p.size * 1.2, p.size * 1.2);
            }
        }

        pop();
    }

    // 绘制地面积雪
    drawGroundSnow() {
        if (this.groundSnow.length === 0) return;

        noStroke();

        // 重置变换矩阵，确保地面积雪不受相机影响
        push();
        resetMatrix();

        for (let snow of this.groundSnow) {
            // 主要积雪点
            fill(255, 255, 255, snow.alpha);
            ellipse(snow.x, snow.y, snow.size, snow.size * 0.7);

            // 添加积雪的层次感
            fill(255, 255, 255, snow.alpha * 0.6);
            ellipse(snow.x - 1, snow.y + 1, snow.size * 0.8, snow.size * 0.5);

            // 大积雪点添加额外细节
            if (snow.size > 8) {
                fill(255, 255, 255, snow.alpha * 0.4);
                ellipse(snow.x + 2, snow.y - 1, snow.size * 0.6, snow.size * 0.4);
            }
        }

        pop();
    }

    drawStars() {
        if (!this.isNight || !this.stars || this.stars.length === 0) return;

        for (let star of this.stars) {
            push();
            drawingContext.shadowBlur = star.size * 2;
            drawingContext.shadowColor = color(255, 255, 255, star.brightness);
            fill(255, 255, 255, star.brightness);
            ellipse(star.x, star.y, star.size, star.size);
            drawingContext.shadowBlur = 0;
            pop();
        }
    }

    drawMeteors() {
        if (!this.isNight || !this.meteors || this.meteors.length === 0) return;

        for (let m of this.meteors) {
            if (m.active) {
                stroke(255, 255, 200, 200);
                strokeWeight(4);
                line(m.x, m.y, m.x - 40, m.y + 20);
                noStroke();
            }
        }
    }

    updateLightning() {
        const currentTime = Date.now();

        if (this.isRaining) {
            // 下雨时可能产生闪电
            if (!this.lightning.active && currentTime >= this.lightning.nextLightningTime) {
                // 触发闪电
                this.lightning.active = true;
                this.lightning.duration = 0;
                this.lightning.brightness = random(200, 255);

                // 设置下一次闪电时间
                let interval = random(this.lightning.minInterval, this.lightning.maxInterval);
                this.lightning.nextLightningTime = currentTime + interval;

                console.log('⚡ 闪电出现！');
            }

            // 更新闪电状态
            if (this.lightning.active) {
                this.lightning.duration++;
                if (this.lightning.duration >= this.lightning.maxDuration) {
                    this.lightning.active = false;
                }
            }
        } else {
            // 不下雨时关闭闪电
            this.lightning.active = false;
        }
    }

    update() {
        this.updateRain();
        this.updateSnow();
        this.updateMeteors();
        this.updateLightning();
    }

    draw() {
        // 先绘制星空（背景层）
        this.drawStars();

        // 然后绘制流星（中间层）
        this.drawMeteors();

        // 绘制地面积雪（地面层，在天气效果之前）
        this.drawGroundSnow();

        // 绘制天气效果（前景层）
        this.drawRain();
        this.drawSnow();

        // 最后绘制闪电（最前层，覆盖所有内容）
        this.drawLightning();
    }

    drawLightning() {
        if (!this.lightning.active || !this.isRaining) return;

        push();

        // 闪电背景光效（全屏闪白）
        let alpha = map(this.lightning.duration, 0, this.lightning.maxDuration,
            this.lightning.brightness * 0.3, 0);
        fill(255, 255, 255, alpha);
        rect(-cameraX, 0, width, height);

        // 绘制闪电分叉
        stroke(255, 255, 255, this.lightning.brightness);
        strokeWeight(3);

        // 主闪电路径
        let startX = random(width * 0.2, width * 0.8);
        let startY = 0;
        let segments = 8;
        let segmentHeight = height / segments;

        let currentX = startX;
        let currentY = startY;

        for (let i = 0; i < segments; i++) {
            let nextX = currentX + random(-40, 40);
            let nextY = currentY + segmentHeight + random(-20, 20);

            // 主分支
            line(currentX, currentY, nextX, nextY);

            // 随机添加侧分支
            if (random() > 0.6) {
                let branchX = nextX + random(-60, 60);
                let branchY = nextY + random(10, 30);
                strokeWeight(2);
                line(nextX, nextY, branchX, branchY);
                strokeWeight(3);
            }

            currentX = nextX;
            currentY = nextY;
        }

        pop();
    }

    // 清除地面积雪
    clearGroundSnow() {
        this.groundSnow = [];
        this.snowAccumulation = 0;
        console.log('地面积雪已清除');
    }

    // 获取积雪状态信息
    getSnowStatus() {
        return {
            snowPoints: this.groundSnow.length,
            accumulation: this.snowAccumulation,
            isSnowing: this.isSnowing
        };
    }

    // 检查雪花是否完全落地
    isSnowFullyGrounded() {
        if (!this.isSnowing) return true; // 如果不在下雪，认为已经完全落地

        // 检查是否还有活跃的雪花粒子在空中
        let activeSnowInAir = this.snowParticles.filter(p =>
            p.active && p.y < floorPos_y - 5 // 🚀 调整检测范围，配合快速下降
        ).length;

        // 更宽松的完全落地条件：要求地面积雪达到一定数量且空中雪花较少
        let hasGroundSnow = this.groundSnow.length > 30; // 要求至少30个积雪点
        let fewSnowInAir = activeSnowInAir < 20; // 允许少量雪花在空中
        let fullyGrounded = fewSnowInAir && hasGroundSnow;

        if (fullyGrounded) {
            console.log(`❄️ 雪花完全落地检测: 空中雪花=${activeSnowInAir}, 地面积雪=${this.groundSnow.length}个`);
        }

        return fullyGrounded;
    }

    // 获取雪花落地状态信息（用于界面显示）
    getSnowGroundingStatus() {
        if (!this.isSnowing) return null;

        let activeSnowInAir = this.snowParticles.filter(p =>
            p.active && p.y < floorPos_y - 5 // 与检测逻辑保持一致
        ).length;
        let totalActiveSnow = this.snowParticles.filter(p => p.active).length;
        let groundSnowCount = this.groundSnow.length;

        return {
            snowInAir: activeSnowInAir,
            totalActive: totalActiveSnow,
            groundSnow: groundSnowCount,
            fullyGrounded: this.isSnowFullyGrounded(),
            progressPercent: Math.min(100, (groundSnowCount / 30) * 100) // 进度百分比
        };
    }

    // 调试函数：强制检查雪花落地状态
    debugSnowGrounding() {
        if (!this.isSnowing) {
            console.log('🌞 当前未在下雪');
            return;
        }

        let status = this.getSnowGroundingStatus();
        console.log('❄️ 快速雪花落地状态调试:');
        console.log(`  - 空中雪花: ${status.snowInAir}个 (要求 < 20)`);
        console.log(`  - 总活跃雪花: ${status.totalActive}个`);
        console.log(`  - 地面积雪: ${status.groundSnow}个 (要求 ≥ 30)`);
        console.log(`  - 落地进度: ${Math.floor(status.progressPercent)}%`);
        console.log(`  - 是否完全落地: ${status.fullyGrounded ? '✅ 是' : '❌ 否'}`);
        console.log(`  - 天气切换状态: ${status.fullyGrounded ? '✅ 允许' : '🚫 禁止'}`);
        console.log(`  - 雪花速度: 12.0-20.0 像素/帧 (超级快速)`);
        console.log(`  - 生成频率: 每帧12个雪花 (最高密度)`);
        console.log(`  - 下雪持续: 40秒 | 剩余时间: ${this.getRemainingTime()}秒`);

        return status;
    }

    // 新增：调试雪花显示状态
    debugSnowDisplay() {
        console.log('❄️ 雪花显示状态调试:');
        console.log(`  - 是否正在下雪: ${this.isSnowing ? '✅ 是' : '❌ 否'}`);
        console.log(`  - 雪花粒子总数: ${this.snowParticles.length}个`);

        let activeCount = 0;
        let visibleCount = 0;
        let positionInfo = [];

        for (let i = 0; i < this.snowParticles.length; i++) {
            let p = this.snowParticles[i];
            if (p.active) {
                activeCount++;
                if (p.alpha > 10 && p.y > -100 && p.y < height + 100) {
                    visibleCount++;
                    if (positionInfo.length < 5) {
                        positionInfo.push(`[${i}]: x=${Math.floor(p.x)}, y=${Math.floor(p.y)}, alpha=${Math.floor(p.alpha)}`);
                    }
                }
            }
        }

        console.log(`  - 活跃雪花数: ${activeCount}个`);
        console.log(`  - 可见雪花数: ${visibleCount}个`);
        console.log(`  - 前5个可见雪花位置:`);
        positionInfo.forEach(info => console.log(`    ${info}`));

        if (activeCount === 0) {
            console.log('⚠️ 没有活跃的雪花！请按S键开始下雪');
        } else if (visibleCount === 0) {
            console.log('⚠️ 有活跃雪花但都不可见，可能位置或透明度有问题');
        }

        return { activeCount, visibleCount, totalCount: this.snowParticles.length };
    }

    // 调试雨天效果
    debugRainEffects() {
        console.log('🌧️ 雨天效果状态调试:');
        console.log(`  - 是否正在下雨: ${this.isRaining ? '✅ 是' : '❌ 否'}`);
        console.log(`  - 雨滴数量: ${this.raindrops.filter(d => d.active).length}个`);
        console.log(`  - 闪电状态: ${this.lightning.active ? '⚡ 活跃' : '❌ 无'}`);
        if (this.lightning.active) {
            console.log(`  - 闪电亮度: ${this.lightning.brightness}`);
            console.log(`  - 闪电持续: ${this.lightning.duration}/${this.lightning.maxDuration}帧`);
        }
        console.log(`  - 下次闪电: ${Math.max(0, Math.ceil((this.lightning.nextLightningTime - Date.now()) / 1000))}秒后`);
        console.log(`  - 视觉效果: 黑云⛈️ | 减少阴影 | 大气效果`);

        return {
            isRaining: this.isRaining,
            raindrops: this.raindrops.filter(d => d.active).length,
            lightning: this.lightning.active,
            nextLightning: Math.max(0, Math.ceil((this.lightning.nextLightningTime - Date.now()) / 1000))
        };
    }

    // 调试云朵平台位置
    debugCloudPlatformPositions() {
        console.log('☁️ 云朵平台位置调试:');

        let cloudPlatforms = [];
        if (gameController && gameController.environmentSystem) {
            cloudPlatforms = gameController.environmentSystem.cloudPlatforms;
        }

        cloudPlatforms.forEach((platform, index) => {
            let platformTop = platform.y - platform.h / 2;
            let platformBottom = platform.y + platform.h / 2;

            console.log(`  ☁️ 平台${index + 1}:`);
            console.log(`    - 中心位置: (${Math.floor(platform.x)}, ${Math.floor(platform.y)})`);
            console.log(`    - 顶部位置: (${Math.floor(platform.x)}, ${Math.floor(platformTop)})`);
            console.log(`    - 底部位置: (${Math.floor(platform.x)}, ${Math.floor(platformBottom)})`);
            console.log(`    - 大小: ${platform.w}x${platform.h}`);

            if (index === 0) {
                console.log(`    - 🎯 第一块云朵 - 猫咪脚部应该在Y: ${Math.floor(platformTop)}`);
                console.log(`    - 🎯 第一块云朵 - 猫咪中心应该在Y: ${Math.floor(platformTop - 100)}`);
            }
        });

        return cloudPlatforms;
    }

    // 检查特定坐标的云朵平台
    checkCloudAtPosition(worldX, worldY) {
        console.log(`🔍 检查世界坐标 (${worldX}, ${worldY}) 的云朵平台:`);

        let cloudPlatforms = [];
        if (gameController && gameController.environmentSystem) {
            cloudPlatforms = gameController.environmentSystem.cloudPlatforms;
        }

        let foundPlatform = null;
        let minDistance = Infinity;

        cloudPlatforms.forEach((platform, index) => {
            let distance = Math.sqrt(
                Math.pow(platform.x - worldX, 2) +
                Math.pow(platform.y - worldY, 2)
            );

            let platformTop = platform.y - platform.h / 2;
            let platformLeft = platform.x - platform.w / 2;
            let platformRight = platform.x + platform.w / 2;

            console.log(`  ☁️ 平台${index + 1}:`);
            console.log(`    - 中心: (${Math.floor(platform.x)}, ${Math.floor(platform.y)})`);
            console.log(`    - 顶部Y: ${Math.floor(platformTop)}`);
            console.log(`    - X范围: ${Math.floor(platformLeft)} - ${Math.floor(platformRight)}`);
            console.log(`    - 距离目标: ${Math.floor(distance)}px`);

            if (distance < minDistance) {
                minDistance = distance;
                foundPlatform = { platform, index, platformTop };
            }
        });

        if (foundPlatform) {
            console.log(`🎯 最近的平台是平台${foundPlatform.index + 1}:`);
            console.log(`  - 猫咪跳上去后，脚部应该在Y: ${Math.floor(foundPlatform.platformTop)}`);
            console.log(`  - 猫咪跳上去后，中心应该在Y: ${Math.floor(foundPlatform.platformTop - 100)}`);
        }

        return foundPlatform;
    }

    // 自动验证和修正猫咪位置
    autoVerifyAndFixPosition() {
        // 目标坐标：世界坐标 (1725, 815)
        const TARGET_WORLD_X = 1725;
        const TARGET_WORLD_Y = 815;
        const TOLERANCE = 50; // 容差范围

        // 检查猫咪是否在目标区域附近
        if (Math.abs(this.cat.x - TARGET_WORLD_X) < TOLERANCE) {
            // 获取云朵平台
            let cloudPlatforms = [];
            if (gameController && gameController.environmentSystem) {
                cloudPlatforms = gameController.environmentSystem.cloudPlatforms;
            }

            // 找到最接近目标坐标的云朵平台
            let targetPlatform = null;
            let minDistance = Infinity;

            for (let platform of cloudPlatforms) {
                let distance = Math.sqrt(
                    Math.pow(platform.x - TARGET_WORLD_X, 2) +
                    Math.pow(platform.y - TARGET_WORLD_Y, 2)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    targetPlatform = platform;
                }
            }

            // 如果找到目标平台且猫咪在平台上
            if (targetPlatform && this.isOnCloudPlatform()) {
                let platformTop = targetPlatform.y - targetPlatform.h / 2;
                let expectedCatY = platformTop - 100; // 猫咪中心应该在的位置
                let actualCatBottom = this.cat.y + 100; // 猫咪实际脚部位置

                // 检查位置是否准确
                let positionError = Math.abs(actualCatBottom - platformTop);

                if (positionError > 2) { // 如果误差超过2像素
                    // 自动修正位置
                    this.cat.y = expectedCatY;

                    console.log(`🔧 自动修正猫咪位置:`);
                    console.log(`  - 目标云朵中心: (${Math.floor(targetPlatform.x)}, ${Math.floor(targetPlatform.y)})`);
                    console.log(`  - 云朵顶部Y: ${Math.floor(platformTop)}`);
                    console.log(`  - 修正前猫咪脚部Y: ${Math.floor(actualCatBottom)}`);
                    console.log(`  - 修正后猫咪脚部Y: ${Math.floor(this.cat.y + 100)}`);
                    console.log(`  - 位置误差: ${Math.floor(positionError)}px → 0px`);

                    // 验证修正结果
                    this.verifyTargetPosition(TARGET_WORLD_X, TARGET_WORLD_Y);
                }
            }
        }
    }

    // 验证目标位置
    verifyTargetPosition(targetX, targetY) {
        let actualCatBottom = this.cat.y + 100;
        let distanceFromTarget = Math.abs(actualCatBottom - targetY);

        if (distanceFromTarget <= 2) {
            console.log(`✅ 位置验证成功！猫咪脚部精确站在目标坐标 (${targetX}, ${targetY})`);
            console.log(`  - 猫咪实际脚部: (${Math.floor(this.cat.x)}, ${Math.floor(actualCatBottom)})`);
            console.log(`  - 误差: ${Math.floor(distanceFromTarget)}px`);
        } else {
            console.log(`❌ 位置验证失败！需要进一步调整`);
            console.log(`  - 目标脚部Y: ${targetY}`);
            console.log(`  - 实际脚部Y: ${Math.floor(actualCatBottom)}`);
            console.log(`  - 误差: ${Math.floor(distanceFromTarget)}px`);
        }
    }

    // 自动测试系统 - 让猫咪自动跳到目标位置
    autoTestJumpToTarget() {
        const TARGET_X = 1725;
        const TARGET_Y = 815;

        // 将猫咪移动到目标X位置附近
        this.cat.x = TARGET_X - 100; // 稍微偏左一点，准备跳跃
        this.cat.y = floorPos_y; // 从地面开始
        this.cat.vy = 0;
        this.cat.isJumping = false;

        console.log(`🤖 自动测试开始：猫咪将跳到目标坐标 (${TARGET_X}, ${TARGET_Y})`);
        console.log(`  - 猫咪当前位置: (${Math.floor(this.cat.x)}, ${Math.floor(this.cat.y)})`);

        // 延迟执行跳跃，让位置稳定
        setTimeout(() => {
            this.jump(); // 执行跳跃
            console.log(`🚀 猫咪开始跳跃！`);

            // 在跳跃过程中持续监控
            let monitorInterval = setInterval(() => {
                if (this.isOnCloudPlatform()) {
                    console.log(`🎯 猫咪已着陆云朵平台！开始验证位置...`);
                    this.verifyTargetPosition(TARGET_X, TARGET_Y);
                    clearInterval(monitorInterval);
                } else if (this.cat.y >= floorPos_y) {
                    console.log(`❌ 猫咪落回地面，未成功跳上云朵`);
                    clearInterval(monitorInterval);
                }
            }, 100);

            // 10秒后停止监控
            setTimeout(() => {
                clearInterval(monitorInterval);
            }, 10000);
        }, 500);
    }

    // 重置猫咪到起始位置
    resetCatToStart() {
        this.cat.x = 200;
        this.cat.y = floorPos_y;
        this.cat.vy = 0;
        this.cat.vx = 0;
        this.cat.isJumping = false;
        console.log(`🔄 猫咪已重置到起始位置 (${this.cat.x}, ${this.cat.y})`);
    }

    // 手动触发闪电（调试用）
    triggerLightning() {
        if (this.isRaining) {
            this.lightning.active = true;
            this.lightning.duration = 0;
            this.lightning.brightness = 255;
            console.log('⚡ 手动触发闪电！');
        } else {
            console.log('❌ 需要下雨才能产生闪电');
        }
    }

    // 手动切换天气的方法
    toggleNight() {
        this.isNight = !this.isNight;
        if (this.isNight) {
            this.createStars();
        } else {
            this.stars = [];
        }

        // 通知音频系统昼夜变化
        if (gameController && gameController.audioSystem) {
            gameController.audioSystem.onWeatherChange(this.getWeatherStatus());
        }
    }

    toggleRain() {
        this.isRaining = !this.isRaining;
        if (this.isRaining) {
            this.isSnowing = false;
            this.snowParticles = [];
        } else {
            this.raindrops = [];
        }

        // 通知音频系统雨天变化
        if (gameController && gameController.audioSystem) {
            gameController.audioSystem.onWeatherChange(this.getWeatherStatus());
        }
    }

    toggleSnow() {
        // 手动切换下雪状态
        if (this.isSnowing) {
            // 如果当前正在下雪，检查是否完全落地才能停止
            if (!this.isSnowFullyGrounded()) {
                console.log('🚫 雪花尚未完全落地，无法停止下雪');
                return;
            }
            // 手动停止下雪
            this.performWeatherSwitch('none', this.currentDayNight);
        } else {
            // 手动开始超级快速下雪（持续40秒）
            this.performWeatherSwitch('snow', this.currentDayNight);
        }
    }

    // 开始积雪融化过程
    startSnowMelting() {
        let meltingInterval = setInterval(() => {
            if (this.groundSnow.length > 0 && !this.isSnowing) {
                // 每次移除一些积雪点，从最老的开始
                let removeCount = Math.min(8, this.groundSnow.length);
                this.groundSnow.splice(0, removeCount);
                this.snowAccumulation = Math.max(0, this.snowAccumulation - 1.5);

                if (this.groundSnow.length % 50 === 0) {
                    console.log(`🌡️ 积雪融化中... 剩余 ${this.groundSnow.length} 个积雪点`);
                }
            } else {
                clearInterval(meltingInterval);
                if (this.groundSnow.length === 0) {
                    console.log('☀️ 所有积雪已融化完毕');
                }
            }
        }, 500); // 每0.5秒融化一次
    }

    // 获取当前天气状态
    getWeatherStatus() {
        let status = {
            isNight: this.isNight,
            isRaining: this.isRaining,
            isSnowing: this.isSnowing,
            weatherType: this.isRaining ? "rain" : (this.isSnowing ? "snow" : "none"),
            currentWeatherType: this.currentWeatherType,
            currentDayNight: this.currentDayNight,
            remainingTime: this.getRemainingTime(),
            hasLightning: this.lightning.active,
            lightningBrightness: this.lightning.brightness
        };
        return status;
    }

    // 获取当前天气剩余时间
    getRemainingTime() {
        const currentTime = Date.now();
        const elapsed = currentTime - this.currentWeatherStartTime;

        let totalDuration = 0;
        if (this.currentWeatherType === 'snow') {
            totalDuration = this.config.SNOW_DURATION;
        } else if (this.currentDayNight === 'day') {
            totalDuration = this.config.DAY_DURATION;
        } else if (this.currentDayNight === 'night') {
            totalDuration = this.config.NIGHT_DURATION;
        }

        const remaining = Math.max(0, totalDuration - elapsed);
        return Math.ceil(remaining / 1000); // 返回秒数
    }
}

// ===== 角色系统模块 =====
class CharacterSystem {
    constructor() {
        this.cat = {
            x: width / 2,
            y: floorPos_y,
            vy: 0,
            speed: 10,
            state: "standing",
            direction: "right",
            isJumping: false,
            isMovingLeft: false,
            isMovingRight: false
        };

        this.mice = [];
        this.fishes = [];
        this.collectibles = []; // 通用收集物品数组
        this.fishbones = [];
        this.life = 100;
        this.maxLife = 150;
        this.lives = 3;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.powerUpTimer = 0;
        this.activePowerUps = {};

        this.init();
    }

    init() {
        this.spawnMouse(1);
        this.spawnFishes();
        this.spawnCollectibles();
    }

    spawnCollectibles() {
        // 生成苹果
        for (let i = 0; i < 5; i++) {
            this.collectibles.push({
                x: random(100, worldWidth - 100),
                y: random(floorPos_y - 180, floorPos_y - 60),
                type: 'apple',
                collected: false,
                size: 15,
                bobOffset: random(0, TWO_PI),
                sparkleTimer: 0
            });
        }

        // 生成大米
        for (let i = 0; i < 4; i++) {
            this.collectibles.push({
                x: random(100, worldWidth - 100),
                y: random(floorPos_y - 160, floorPos_y - 40),
                type: 'rice',
                collected: false,
                size: 12,
                bobOffset: random(0, TWO_PI),
                sparkleTimer: 0
            });
        }

        // 生成能力提升道具
        for (let i = 0; i < 2; i++) {
            let powerUpTypes = ['speed', 'jump', 'shield', 'magnet'];
            this.collectibles.push({
                x: random(200, worldWidth - 200),
                y: random(floorPos_y - 200, floorPos_y - 80),
                type: random(powerUpTypes),
                collected: false,
                size: 18,
                bobOffset: random(0, TWO_PI),
                sparkleTimer: 0,
                glowIntensity: 0
            });
        }
    }

    spawnFishes() {
        // 生成可收集的鱼
        for (let i = 0; i < 8; i++) {
            this.fishes.push({
                x: random(100, worldWidth - 100),
                y: random(floorPos_y - 200, floorPos_y - 50),
                collected: false,
                size: 20,
                type: 'normal'
            });
        }
    }

    updateCatPosition() {
        if (this.cat.isMovingLeft) {
            this.cat.x -= this.cat.speed;
            this.cat.state = "walkingLeft";
            this.cat.direction = "left";
        } else if (this.cat.isMovingRight) {
            this.cat.x += this.cat.speed;
            this.cat.state = "walkingRight";
            this.cat.direction = "right";
        } else if (this.cat.isJumping) {
            this.cat.state = "jumping";
        } else {
            this.cat.state = "standing";
        }

        this.cat.y += this.cat.vy;
        this.cat.vy += 0.8;

        // 检查云朵平台碰撞
        let onPlatform = this.checkCloudPlatformCollision();

        // 自动验证和修正位置
        this.autoVerifyAndFixPosition();

        if (!onPlatform && this.cat.y > floorPos_y) {
            // 只有不在云朵平台上时才落到地面
            this.cat.y = floorPos_y;
            this.cat.vy = 0;
            this.cat.isJumping = false;
        }

        this.cat.x = constrain(this.cat.x, 50, worldWidth - 50);

        // 检查是否在云朵平台上，如果是则自动趴下 (Check if on cloud platform, auto crouch if so)
        if (this.isOnCloudPlatform() && !this.cat.isMovingLeft && !this.cat.isMovingRight && this.cat.state !== "sleeping") {
            this.cat.state = "crouch"; // 在云朵平台上自动趴下 (Auto crouch on cloud platform);
        } else if (!this.cat.isMovingLeft && !this.cat.isMovingRight && !this.cat.isJumping && this.cat.state !== "sleeping" && this.cat.state !== "crouch") {
            this.cat.state = "standing"; // 默认站立状态 (Default standing state);
        }
    }

    checkCloudPlatformCollision() {
        // 获取环境系统的云朵平台
        let cloudPlatforms = [];
        if (gameController && gameController.environmentSystem) {
            cloudPlatforms = gameController.environmentSystem.cloudPlatforms;
        }

        for (let platform of cloudPlatforms) {
            // 猫咪的边界（根据实际绘制结构计算）
            let catLeft = this.cat.x - 40;   // 猫咪宽度80像素
            let catRight = this.cat.x + 40;
            let catBottom = this.cat.y + 100; // 猫咪实际底部（身体中心50 + 身体半高50）

            // 平台的边界
            let platformLeft = platform.x - platform.w / 2;
            let platformRight = platform.x + platform.w / 2;
            let platformTop = platform.y - platform.h / 2;
            let platformBottom = platform.y + platform.h / 2;

            // 检查水平重叠
            let horizontalOverlap = catRight > platformLeft && catLeft < platformRight;

            // 检查垂直碰撞（猫咪从上方落到平台上）
            if (horizontalOverlap && this.cat.vy >= 0) {
                // 检查猫咪底部是否接触平台顶部
                if (catBottom >= platformTop - 5 && catBottom <= platformTop + 15) {
                    // 让猫咪脚部精确贴合平台顶部
                    this.cat.y = platformTop - 100; // 猫咪中心 = 平台顶部 - 猫咪身体高度
                    this.cat.vy = 0;
                    this.cat.isJumping = false;

                    let actualCatBottom = this.cat.y + 100;
                    console.log(`🐱 猫咪站在云朵平台上！`);
                    console.log(`  - 平台中心: (${Math.floor(platform.x)}, ${Math.floor(platform.y)})`);
                    console.log(`  - 平台顶部: ${Math.floor(platformTop)}`);
                    console.log(`  - 猫咪中心: (${Math.floor(this.cat.x)}, ${Math.floor(this.cat.y)})`);
                    console.log(`  - 猫咪脚部: (${Math.floor(this.cat.x)}, ${Math.floor(actualCatBottom)})`);
                    console.log(`  - 脚部与平台顶部差距: ${Math.floor(actualCatBottom - platformTop)}px`);

                    return true;
                }
            }
        }

        return false;
    }

    updateMice() {
        for (let m of this.mice) {
            if (!m.alive) continue;

            // AI行为系统
            this.updateMouseAI(m);

            // 基础移动
            m.x += m.speed * m.direction;

            // 边界检查
            if (m.x > worldWidth + 100 || m.x < -100) {
                m.alive = false;
            }
        }

        // 动态生成老鼠
        if (frameCount % 240 === 0) { // 每4秒生成
            this.spawnMouse(1);
        }
    }

    updateMouseAI(mouse) {
        // 计算与猫咪的距离
        let distToCat = dist(mouse.x, mouse.y, this.cat.x, this.cat.y);

        // 防止老鼠与猫咪重叠 - 如果太近就强制后退
        if (distToCat < mouse.minDistanceFromCat) {
            let pushDirection = mouse.x > this.cat.x ? 1 : -1; // 远离猫咪的方向
            mouse.x += pushDirection * 4; // 快速后退
            mouse.speed = 0; // 停止其他移动
            console.log(`🐭 老鼠避免重叠，后退到距离: ${Math.floor(distToCat)}px`);
            return; // 跳过其他AI逻辑
        }

        switch (mouse.aiType) {
            case 'patrol':
                // 巡逻行为：在固定范围内来回移动，但保持安全距离
                if (mouse.x > mouse.patrolEnd || mouse.x < mouse.patrolStart) {
                    mouse.direction *= -1;
                }

                // 只有在安全距离外才移动
                if (distToCat > mouse.minDistanceFromCat + 30) {
                    mouse.speed = 1.2;
                } else {
                    mouse.speed = 0.5; // 减速
                }
                break;

            case 'chase':
                // 追踪行为：发现猫咪后追踪，但保持最小距离
                if (distToCat < mouse.detectionRange && distToCat > mouse.minDistanceFromCat + 40) {
                    mouse.isChasing = true;
                    mouse.speed = 2.5; // 追踪时加速

                    // 朝向猫咪
                    if (this.cat.x > mouse.x) {
                        mouse.direction = 1;
                    } else {
                        mouse.direction = -1;
                    }
                } else if (distToCat <= mouse.minDistanceFromCat + 40) {
                    // 太近了，停止追击并后退
                    mouse.isChasing = false;
                    mouse.speed = 0.8;
                    mouse.direction = mouse.x > this.cat.x ? 1 : -1; // 远离猫咪
                } else if (distToCat > mouse.detectionRange * 1.5) {
                    mouse.isChasing = false;
                    mouse.speed = 1.2; // 恢复正常速度
                }
                break;

            case 'guard':
                // 守卫行为：在固定位置附近警戒，但保持与猫咪的距离
                if (distToCat < mouse.detectionRange && distToCat > mouse.minDistanceFromCat + 50) {
                    // 朝向猫咪但不移动太远
                    let targetX = mouse.guardX + (this.cat.x > mouse.x ? 30 : -30);
                    if (abs(mouse.x - targetX) > 5) {
                        mouse.direction = targetX > mouse.x ? 1 : -1;
                        mouse.speed = 1.5;
                    } else {
                        mouse.speed = 0;
                    }
                } else if (distToCat <= mouse.minDistanceFromCat + 50) {
                    // 太近了，优先远离猫咪
                    mouse.direction = mouse.x > this.cat.x ? 1 : -1;
                    mouse.speed = 1.8;
                } else {
                    // 返回守卫位置
                    if (abs(mouse.x - mouse.guardX) > 10) {
                        mouse.direction = mouse.guardX > mouse.x ? 1 : -1;
                        mouse.speed = 1.0;
                    } else {
                        mouse.speed = 0;
                    }
                }
                break;
        }

        // 更新动画状态
        mouse.animFrame += 0.1;
        if (mouse.animFrame > TWO_PI) mouse.animFrame = 0;
    }

    spawnMouse(num = 1) {
        for (let i = 0; i < num; i++) {
            let aiTypes = ['patrol', 'chase', 'guard'];
            let aiType = random(aiTypes);

            // 确保老鼠不会在猫咪附近生成，避免重叠
            let spawnX;
            let minDistanceFromCat = 200; // 最小距离200像素
            let attempts = 0;

            do {
                spawnX = random([-60, worldWidth + 60]); // 从两边生成
                attempts++;
            } while (Math.abs(spawnX - this.cat.x) < minDistanceFromCat && attempts < 10);

            // 如果尝试10次还是太近，强制设置到远离猫咪的位置
            if (Math.abs(spawnX - this.cat.x) < minDistanceFromCat) {
                spawnX = this.cat.x > worldWidth / 2 ? -100 : worldWidth + 100;
            }

            let mouse = {
                x: spawnX,
                y: floorPos_y,
                alive: true,
                aiType: aiType,
                speed: random(1.0, 1.8),
                direction: spawnX < 0 ? 1 : -1,
                detectionRange: random(80, 150),
                animFrame: 0,
                isChasing: false,
                minDistanceFromCat: 80 // 与猫咪保持的最小距离
            };

            // 根据AI类型设置特殊属性
            switch (aiType) {
                case 'patrol':
                    mouse.patrolStart = mouse.x - random(50, 100);
                    mouse.patrolEnd = mouse.x + random(50, 100);
                    break;
                case 'chase':
                    mouse.speed *= 0.8; // 追踪型初始速度较慢
                    mouse.detectionRange *= 1.5; // 更大的检测范围
                    break;
                case 'guard':
                    mouse.guardX = random(100, worldWidth - 100);
                    mouse.x = mouse.guardX;
                    mouse.speed = 0.5;
                    break;
            }

            this.mice.push(mouse);
        }
    }

    jump() {
        // 检查猫咪是否在地面或云朵平台上
        let canJump = this.cat.y === floorPos_y || this.isOnCloudPlatform();

        if (canJump) {
            // 检查跳跃能力提升
            let jumpPower = this.activePowerUps.jump ? -25 : -18;
            this.cat.vy = jumpPower;
            this.cat.isJumping = true;

            // 播放跳跃音效
            if (gameController.audioSystem) {
                gameController.audioSystem.onJump();
            }

            console.log(`🐱 猫咪跳跃！从${this.cat.y === floorPos_y ? '地面' : '云朵平台'}起跳`);
        }
    }

    // 检查猫咪是否站在云朵平台上
    isOnCloudPlatform() {
        let cloudPlatforms = [];
        if (gameController && gameController.environmentSystem) {
            cloudPlatforms = gameController.environmentSystem.cloudPlatforms;
        }

        for (let platform of cloudPlatforms) {
            // 使用与碰撞检测相同的边界计算
            let catLeft = this.cat.x - 40;
            let catRight = this.cat.x + 40;
            let catBottom = this.cat.y + 100; // 猫咪实际底部

            let platformLeft = platform.x - platform.w / 2;
            let platformRight = platform.x + platform.w / 2;
            let platformTop = platform.y - platform.h / 2;

            // 检查猫咪是否正好站在平台上
            let horizontalOverlap = catRight > platformLeft && catLeft < platformRight;
            let onPlatformTop = Math.abs(catBottom - platformTop) < 8; // 允许8像素的误差

            if (horizontalOverlap && onPlatformTop) {
                return true;
            }
        }

        return false;
    }

    // 调试云朵平台功能
    debugCloudPlatforms() {
        console.log('☁️ 云朵平台调试信息:');

        let cloudPlatforms = [];
        if (gameController && gameController.environmentSystem) {
            cloudPlatforms = gameController.environmentSystem.cloudPlatforms;
        }

        console.log(`  - 云朵平台数量: ${cloudPlatforms.length}个`);
        console.log(`  - 猫咪位置: (${Math.floor(this.cat.x)}, ${Math.floor(this.cat.y)})`);
        console.log(`  - 猫咪在地面: ${this.cat.y === floorPos_y ? '✅ 是' : '❌ 否'}`);
        console.log(`  - 猫咪在云朵平台: ${this.isOnCloudPlatform() ? '✅ 是' : '❌ 否'}`);

        // 显示每个平台的信息
        cloudPlatforms.forEach((platform, index) => {
            let distance = Math.sqrt(
                Math.pow(this.cat.x - platform.x, 2) +
                Math.pow(this.cat.y - platform.y, 2)
            );
            console.log(`  - 平台${index + 1}: 位置(${Math.floor(platform.x)}, ${Math.floor(platform.y)}) 大小(${platform.w}x${platform.h}) 距离: ${Math.floor(distance)}px`);
        });

        return {
            catPosition: { x: this.cat.x, y: this.cat.y },
            onGround: this.cat.y === floorPos_y,
            onPlatform: this.isOnCloudPlatform(),
            platformCount: cloudPlatforms.length
        };
    }

    // 详细调试云朵碰撞
    debugCloudCollision() {
        console.log('🔍 云朵碰撞详细调试:');

        let cloudPlatforms = [];
        if (gameController && gameController.environmentSystem) {
            cloudPlatforms = gameController.environmentSystem.cloudPlatforms;
        }

        // 猫咪边界（根据实际绘制结构）
        let catLeft = this.cat.x - 40;
        let catRight = this.cat.x + 40;
        let catBottom = this.cat.y + 100; // 实际底部

        console.log(`  🐱 猫咪边界: 左${Math.floor(catLeft)} 右${Math.floor(catRight)} 底部${Math.floor(catBottom)}`);
        console.log(`  🐱 猫咪中心: (${Math.floor(this.cat.x)}, ${Math.floor(this.cat.y)})`);
        console.log(`  🐱 猫咪速度: vy=${this.cat.vy.toFixed(2)}`);
        console.log(`  🐱 猫咪结构: 头部中心(${Math.floor(this.cat.x)}, ${Math.floor(this.cat.y)}) 身体中心(${Math.floor(this.cat.x)}, ${Math.floor(this.cat.y + 50)})`);

        cloudPlatforms.forEach((platform, index) => {
            let platformLeft = platform.x - platform.w / 2;
            let platformRight = platform.x + platform.w / 2;
            let platformTop = platform.y - platform.h / 2;

            let horizontalOverlap = catRight > platformLeft && catLeft < platformRight;
            let verticalDistance = Math.abs(catBottom - platformTop);

            console.log(`  ☁️ 平台${index + 1}:`);
            console.log(`    - 位置: (${Math.floor(platform.x)}, ${Math.floor(platform.y)})`);
            console.log(`    - 边界: 左${Math.floor(platformLeft)} 右${Math.floor(platformRight)} 顶部${Math.floor(platformTop)}`);
            console.log(`    - 水平重叠: ${horizontalOverlap ? '✅' : '❌'}`);
            console.log(`    - 垂直距离: ${Math.floor(verticalDistance)}px`);

            if (horizontalOverlap && verticalDistance < 20) {
                console.log(`    - ⭐ 这个平台很接近！`);
            }
        });
    }

    moveLeft() {
        this.cat.isMovingLeft = true;
        this.cat.isMovingRight = false;
    }

    moveRight() {
        this.cat.isMovingRight = true;
        this.cat.isMovingLeft = false;
    }

    stopMoving() {
        this.cat.isMovingLeft = false;
        this.cat.isMovingRight = false;
    }

    update() {
        this.updateCatPosition();
        this.updateMice();
        this.updateFishes();
        this.updateCollectibles();
        this.updatePowerUps();
        this.updateInvincibility();
        this.checkCollisions();
    }

    updateCollectibles() {
        for (let item of this.collectibles) {
            if (item.collected) continue;

            // 漂浮动画
            item.bobOffset += 0.05;
            item.sparkleTimer += 0.1;

            // 能力道具发光效果
            if (['speed', 'jump', 'shield', 'magnet'].includes(item.type)) {
                item.glowIntensity = sin(frameCount * 0.1) * 50 + 100;
            }

            // 检查收集
            if (dist(this.cat.x, this.cat.y, item.x, item.y) < item.size + 10) {
                item.collected = true;
                this.collectItem(item);
            }
        }
    }

    collectItem(item) {
        switch (item.type) {
            case 'apple':
                gameController.scoreSystem.collectApple(item.x, item.y);
                this.life = Math.min(this.life + 5, this.maxLife);
                break;
            case 'rice':
                gameController.scoreSystem.collectRice(item.x, item.y);
                this.life = Math.min(this.life + 10, this.maxLife);
                break;
            case 'speed':
                this.activatePowerUp('speed', 300); // 5秒
                break;
            case 'jump':
                this.activatePowerUp('jump', 300);
                break;
            case 'shield':
                this.activatePowerUp('shield', 600); // 10秒
                break;
            case 'magnet':
                this.activatePowerUp('magnet', 480); // 8秒
                break;
        }

        // 播放收集音效
        if (gameController.audioSystem) {
            gameController.audioSystem.onCollectFish();
        }
    }

    activatePowerUp(type, duration) {
        this.activePowerUps[type] = duration;

        // 能力效果
        switch (type) {
            case 'speed':
                this.cat.speed = 15; // 提升速度
                break;
            case 'jump':
                // 跳跃能力在jump()方法中检查
                break;
            case 'shield':
                this.isInvincible = true;
                break;
            case 'magnet':
                // 磁铁效果在updateMagnetEffect()中处理
                break;
        }

        console.log(`能力激活: ${type} (${duration / 60}秒)`);
    }

    updatePowerUps() {
        for (let [type, duration] of Object.entries(this.activePowerUps)) {
            this.activePowerUps[type] = duration - 1;

            if (duration <= 0) {
                this.deactivatePowerUp(type);
                delete this.activePowerUps[type];
            }
        }

        // 磁铁效果
        if (this.activePowerUps.magnet) {
            this.updateMagnetEffect();
        }
    }

    deactivatePowerUp(type) {
        switch (type) {
            case 'speed':
                this.cat.speed = 10; // 恢复正常速度
                break;
            case 'shield':
                if (!this.invincibleTimer) { // 如果不是因为受伤无敌
                    this.isInvincible = false;
                }
                break;
        }
        console.log(`能力结束: ${type}`);
    }

    updateMagnetEffect() {
        let magnetRange = 80;

        // 吸引鱼类
        for (let fish of this.fishes) {
            if (!fish.collected && dist(this.cat.x, this.cat.y, fish.x, fish.y) < magnetRange) {
                let angle = atan2(this.cat.y - fish.y, this.cat.x - fish.x);
                fish.x += cos(angle) * 3;
                fish.y += sin(angle) * 3;
            }
        }

        // 吸引收集物品
        for (let item of this.collectibles) {
            if (!item.collected && dist(this.cat.x, this.cat.y, item.x, item.y) < magnetRange) {
                let angle = atan2(this.cat.y - item.y, this.cat.x - item.x);
                item.x += cos(angle) * 2;
                item.y += sin(angle) * 2;
            }
        }
    }

    updateFishes() {
        // 检查鱼的收集
        for (let fish of this.fishes) {
            if (!fish.collected) {
                // 检查是否被猫咪收集
                if (dist(this.cat.x, this.cat.y, fish.x, fish.y) < fish.size + 15) {
                    fish.collected = true;
                    gameController.scoreSystem.collectFish(fish.x, fish.y);

                    // 播放收集音效
                    if (gameController.audioSystem) {
                        gameController.audioSystem.onCollectFish();
                    }

                    // 恢复生命值
                    this.life = Math.min(this.life + 15, this.maxLife);
                    console.log('鱼被收集！生命值恢复');
                }
            }
        }
    }

    updateInvincibility() {
        if (this.isInvincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.isInvincible = false;
            }
        }
    }

    checkCollisions() {
        // 检查老鼠碰撞（造成伤害）
        if (!this.isInvincible) {
            for (let mouse of this.mice) {
                if (mouse.alive && dist(this.cat.x, this.cat.y, mouse.x, mouse.y) < 40) {
                    this.takeDamage(20);
                    console.log('被老鼠攻击！');
                    break;
                }
            }
        }

        // 检查峡谷掉落
        this.checkCliffFall();
    }

    checkCliffFall() {
        // 峡谷区域判定
        let onCliff = (this.cat.x > width - 100 && this.cat.x < width + 400);
        if (onCliff && this.cat.y > floorPos_y + 100) {
            this.fallIntoCliff();
        }
    }

    fallIntoCliff() {
        this.lives--;
        console.log(`掉入峡谷！剩余生命: ${this.lives}`);

        if (this.lives <= 0) {
            gameController.gameOver();
        } else {
            // 重置位置
            this.resetPosition();
        }
    }

    resetPosition() {
        this.cat.x = width / 2;
        this.cat.y = floorPos_y;
        this.cat.vy = 0;
        this.life = this.maxLife;
        this.isInvincible = true;
        this.invincibleTimer = 120; // 2秒无敌
    }

    takeDamage(damage) {
        this.life -= damage;
        this.isInvincible = true;
        this.invincibleTimer = 90; // 1.5秒无敌

        if (this.life <= 0) {
            this.lives--;
            if (this.lives <= 0) {
                gameController.gameOver();
            } else {
                this.resetPosition();
            }
        }
    }

    // 击杀老鼠（由外部调用）
    killMouse(mouseIndex) {
        if (mouseIndex >= 0 && mouseIndex < this.mice.length) {
            this.mice[mouseIndex].alive = false;
            gameController.scoreSystem.killMouse(this.mice[mouseIndex].x, this.mice[mouseIndex].y);

            // 播放击杀音效
            if (gameController.audioSystem) {
                gameController.audioSystem.onKillMouse();
            }
        }
    }

    draw() {
        this.drawCat();
        this.drawMice();
        this.drawFishes();
        this.drawCollectibles();
        this.drawPowerUpEffects();
    }

    drawCat() {
        push();
        translate(this.cat.x, this.cat.y);

        // 能力效果光环
        if (this.activePowerUps.shield) {
            // 护盾效果
            noFill();
            stroke(100, 200, 255, 150);
            strokeWeight(3);
            ellipse(0, 25, 120 + sin(frameCount * 0.2) * 10, 120 + sin(frameCount * 0.2) * 10);
        }

        if (this.activePowerUps.speed) {
            // 速度效果
            for (let i = 0; i < 3; i++) {
                fill(255, 255, 0, 50 - i * 15);
                ellipse(-i * 5, 25, 80, 100);
            }
        }

        // 无敌时闪烁效果
        if (this.isInvincible && !this.activePowerUps.shield && Math.floor(frameCount / 10) % 2 === 0) {
            fill(100, 100, 255, 150); // 半透明蓝色
        } else {
            fill(50);
        }

        // 猫咪身体
        ellipse(0, 50, 80, 100);
        ellipse(0, 0, 80, 80);

        // 猫咪耳朵
        fill(40);
        triangle(-20, -30, -10, -50, 0, -30);
        triangle(0, -30, 10, -50, 20, -30);

        // 大眼睛外圈（白色）
        fill(255, 255, 255);
        ellipse(-18, -8, 25, 25);
        ellipse(18, -8, 25, 25);

        // 眼睛内圈（浅蓝色）
        fill(200, 230, 255);
        ellipse(-18, -8, 20, 20);
        ellipse(18, -8, 20, 20);

        // 瞳孔（黑色，更大）
        fill(0);
        ellipse(-18, -8, 12, 12);
        ellipse(18, -8, 12, 12);

        // 眼睛高光
        fill(255);
        ellipse(-15, -11, 4, 4);
        ellipse(21, -11, 4, 4);

        // 鼻子（三角形，更可爱）
        fill(255, 150, 150);
        triangle(-3, 3, 3, 3, 0, 8);

        // 嘴巴
        noFill();
        stroke(100);
        strokeWeight(2);
        arc(-5, 12, 8, 6, 0, PI);
        arc(5, 12, 8, 6, 0, PI);

        // 胡须
        stroke(200);
        strokeWeight(1);
        // 左胡须
        line(-25, 0, -35, -2);
        line(-25, 5, -35, 5);
        line(-25, 10, -35, 12);
        // 右胡须
        line(25, 0, 35, -2);
        line(25, 5, 35, 5);
        line(25, 10, 35, 12);

        // 重置描边
        noStroke();

        pop();
    }

    drawMice() {
        for (let m of this.mice) {
            if (!m.alive) continue;

            push();
            translate(m.x, m.y);

            // AI类型指示器
            if (m.aiType === 'chase' && m.isChasing) {
                fill(255, 0, 0, 100);
                ellipse(0, -10, 20, 8);
            } else if (m.aiType === 'guard') {
                fill(255, 255, 0, 100);
                ellipse(0, -10, 16, 6);
            }

            // 老鼠身体 (根据速度调整颜色)
            let bodyColor = map(m.speed, 0.5, 2.5, 100, 150);
            fill(bodyColor, 80, 80);
            ellipse(0, 0, 15, 10);

            // 老鼠尾巴 (动画)
            stroke(80);
            strokeWeight(2);
            let tailWag = sin(m.animFrame) * 2;
            line(7, 0, 15, -5 + tailWag);
            noStroke();

            // 老鼠耳朵
            fill(bodyColor - 20);
            ellipse(-5, -3, 4, 4);
            ellipse(-2, -3, 4, 4);

            // 老鼠眼睛 (根据AI状态变化)
            let eyeColor = m.isChasing ? color(255, 0, 0) : color(50);
            fill(eyeColor);
            ellipse(-3, -1, 2, 2);

            // 方向指示
            if (m.direction > 0) {
                scale(-1, 1);
            }

            pop();
        }
    }

    drawFishes() {
        for (let fish of this.fishes) {
            if (fish.collected) continue;

            push();
            translate(fish.x, fish.y);

            // 鱼身体
            fill(255, 150, 0);
            stroke(220, 120, 0);
            strokeWeight(2);
            ellipse(0, 0, fish.size, fish.size * 0.6);

            // 鱼尾巴
            fill(255, 100, 0);
            triangle(fish.size / 2, 0, fish.size, -fish.size / 4, fish.size, fish.size / 4);

            // 鱼眼睛
            fill(255);
            ellipse(-3, -2, 4, 4);
            fill(0);
            ellipse(-3, -2, 2, 2);

            // 鱼鳍
            stroke(255, 100, 0);
            line(0, -fish.size / 3, -5, -fish.size / 2);
            line(0, fish.size / 3, -5, fish.size / 2);

            noStroke();
            pop();
        }
    }

    drawCollectibles() {
        for (let item of this.collectibles) {
            if (item.collected) continue;

            push();
            translate(item.x, item.y + sin(item.bobOffset + frameCount * 0.05) * 3);

            switch (item.type) {
                case 'apple':
                    // 苹果
                    fill(255, 60, 60);
                    ellipse(0, 0, item.size, item.size);
                    fill(80, 180, 60);
                    ellipse(2, -6, 4, 6); // 叶子
                    break;

                case 'rice':
                    // 大米
                    fill(255, 255, 200);
                    for (let i = 0; i < 5; i++) {
                        let angle = (i / 5) * TWO_PI;
                        ellipse(cos(angle) * 3, sin(angle) * 3, 3, 6);
                    }
                    break;

                case 'speed':
                    // 速度道具
                    fill(255, 255, 0, item.glowIntensity);
                    ellipse(0, 0, item.size + 5, item.size + 5);
                    fill(255, 200, 0);
                    for (let i = 0; i < 3; i++) {
                        ellipse(i * 3, 0, 4, 8);
                    }
                    break;

                case 'jump':
                    // 跳跃道具
                    fill(0, 255, 100, item.glowIntensity);
                    ellipse(0, 0, item.size + 5, item.size + 5);
                    fill(0, 200, 100);
                    triangle(-6, 3, 0, -6, 6, 3);
                    break;

                case 'shield':
                    // 护盾道具
                    fill(100, 200, 255, item.glowIntensity);
                    ellipse(0, 0, item.size + 5, item.size + 5);
                    fill(100, 150, 255);
                    ellipse(0, 0, item.size - 4, item.size - 4);
                    break;

                case 'magnet':
                    // 磁铁道具
                    fill(255, 100, 255, item.glowIntensity);
                    ellipse(0, 0, item.size + 5, item.size + 5);
                    fill(200, 50, 200);
                    rect(-4, -6, 8, 12, 2);
                    fill(255, 150, 255);
                    rect(-2, -4, 4, 8);
                    break;
            }

            // 闪烁效果
            if (sin(item.sparkleTimer) > 0.8) {
                fill(255, 255, 255, 150);
                ellipse(random(-5, 5), random(-5, 5), 3, 3);
            }

            pop();
        }
    }

    drawPowerUpEffects() {
        // 磁铁效果可视化
        if (this.activePowerUps.magnet) {
            push();
            noFill();
            stroke(255, 100, 255, 100);
            strokeWeight(2);
            ellipse(this.cat.x, this.cat.y, 160, 160);

            // 磁力线
            for (let i = 0; i < 8; i++) {
                let angle = (i / 8) * TWO_PI;
                let x1 = this.cat.x + cos(angle) * 70;
                let y1 = this.cat.y + sin(angle) * 70;
                let x2 = this.cat.x + cos(angle) * 80;
                let y2 = this.cat.y + sin(angle) * 80;
                line(x1, y1, x2, y2);
            }
            pop();
        }
    }
}

// ===== 环境系统模块 =====
class EnvironmentSystem {
    constructor() {
        this.trees = [];
        this.clouds = [];
        this.birds = [];
        this.bushes = [];
        this.riverPoints = [];
        this.cloudPlatforms = [];
        this.lotusLeaves = []; // 荷叶数组

        // 新增多样化地形元素
        this.hills = [];           // 丘陵
        this.rocks = [];           // 岩石
        this.flowers = [];         // 花朵
        this.grassPatches = [];    // 草丛
        this.caves = [];           // 洞穴
        this.bridges = [];         // 桥梁
        this.waterfalls = [];      // 瀑布
        this.crystals = [];        // 水晶
        this.desertDunes = [];     // 沙丘
        this.icebergs = [];        // 冰山
        this.volcanoes = [];       // 火山

        this.init();
    }

    init() {
        this.createTrees();
        this.createClouds();
        this.createBirds();
        this.createBushes();
        this.createRiver();
        this.createCloudPlatforms();
        this.createLotusLeaves(); // 创建荷叶

        // 创建多样化地形
        this.createHills();
        this.createRocks();
        this.createFlowers();
        this.createGrassPatches();
        this.createCaves();
        this.createBridges();
        this.createWaterfalls();
        this.createCrystals();
        this.createDesertDunes();
        this.createIcebergs();
        this.createVolcanoes();

        console.log('🌍 多样化地形系统已创建！');
    }

    createTrees() {
        this.trees = [];
        let lastX = 0;
        let tryCount = 0;

        while (this.trees.length < 16 && tryCount < 1000) {
            let x = random(lastX + 80, lastX + 220);
            let h = random(120, 260);

            if (x > width - 100 && x < width + 400) {
                tryCount++;
                continue;
            }

            this.trees.push({ x: x, y: floorPos_y - h, h: h });
            lastX = x;
            tryCount++;
        }
    }

    createClouds() {
        this.clouds = [];
        this.clouds.push({ x: -200, y: 80, size: 100, speed: 0.5 });
        this.clouds.push({ x: 400, y: 120, size: 90, speed: 0.3 });
        this.clouds.push({ x: 800, y: 150, size: 110, speed: 0.7 });
    }

    createBirds() {
        this.birds = [];
        for (let i = 0; i < 10; i++) {
            this.birds.push({
                x: random(worldWidth),
                y: random(100, 200),
                speed: random(1, 3),
                wingPhase: random(0, TWO_PI)
            });
        }
    }

    createBushes() {
        // 删除灌木丛生成
        this.bushes = [];
    }

    createRiver() {
        this.riverPoints = [];
        let startX = -100;
        let startY = floorPos_y - 50;
        let endX = worldWidth + 200;
        let endY = floorPos_y + 100;

        for (let t = 0; t <= 1; t += 0.005) {
            let x = lerp(startX, endX, t);
            let y = lerp(startY, endY, t);
            this.riverPoints.push(createVector(x, y));
        }
    }

    createCloudPlatforms() {
        this.cloudPlatforms = [];
        const baseY = floorPos_y - 140;
        const startX = width - 140;
        const step = 180;

        for (let i = 0; i < 10; i++) {
            const px = startX + i * step;
            const py = baseY + (i % 2 === 0 ? 0 : -36);

            this.cloudPlatforms.push({
                baseX: px,
                x: px,
                y: py,
                w: 140,
                h: 24,
                type: 'static',
                frozen: false
            });
        }
    }

    createLotusLeaves() {
        this.lotusLeaves = [];
        // 在水面区域生成荷叶
        const waterY = floorPos_y - 30; // 水面高度调整
        const waterWidth = worldWidth;

        for (let i = 0; i < 30; i++) { // 生成30片荷叶
            this.lotusLeaves.push({
                x: random(100, waterWidth - 100),
                y: waterY + random(-10, 10), // 在水面附近
                size: random(35, 70),
                rotation: random(0, TWO_PI),
                bobPhase: random(0, TWO_PI), // 漂浮相位
                bobSpeed: random(0.008, 0.02),
                alpha: random(160, 220),
                leafType: random(['round', 'notched']) // 荷叶类型
            });
        }
    }

    updateCloudPlatforms() {
        for (let i = 0; i < this.cloudPlatforms.length; i++) {
            const p = this.cloudPlatforms[i];
            if (p.type === 'moving' && !p.frozen) {
                p.x = p.baseX + sin(frameCount * 0.02) * 100;
            }
        }
    }

    drawMountains() {
        noStroke();
        fill(60, 70, 90);
        rect(0, floorPos_y - 300, worldWidth, 300);
    }

    drawClouds() {
        // 检查是否下雨，决定云朵颜色
        let isRaining = false;
        if (gameController && gameController.weatherSystem) {
            isRaining = gameController.weatherSystem.isRaining;
        }

        for (let cloud of this.clouds) {
            cloud.x += cloud.speed;
            if (cloud.x > worldWidth + cloud.size) {
                cloud.x = -cloud.size;
            }

            if (cloud.x + cloud.size > cameraX && cloud.x - cloud.size < cameraX + width) {
                push();

                // 下雨时变成黑云，否则是白云
                if (isRaining) {
                    fill(60, 60, 70, 200); // 深灰黑色的雨云
                    // 添加阴影效果
                    fill(40, 40, 50, 150);
                    ellipse(cloud.x + 3, cloud.y + 3, cloud.size * 1.05);
                    fill(60, 60, 70, 200);
                } else {
                    fill(255, 255, 255, 220); // 白云
                }

                noStroke();
                ellipse(cloud.x - cameraX, cloud.y, cloud.size);

                // 为雨云添加更多层次
                if (isRaining) {
                    fill(80, 80, 90, 150);
                    ellipse(cloud.x - cameraX - 5, cloud.y - 5, cloud.size * 0.8);
                    fill(45, 45, 55, 180);
                    ellipse(cloud.x - cameraX + 8, cloud.y + 2, cloud.size * 0.6);
                }

                pop();
            }
        }
    }

    drawRiver() {
        noStroke();
        fill(65, 105, 225);
        rect(0, floorPos_y - 50, worldWidth, 120);
    }

    drawTrees() {
        fill(34, 139, 34);
        for (let tree of this.trees) {
            if (tree.x + 100 > cameraX && tree.x - 100 < cameraX + width) {
                rect(tree.x, tree.y, 20, tree.h);
            }
        }
    }

    drawBushes() {
        // 灌木丛已删除，不再绘制
    }

    drawLotusLeaves() {
        for (let leaf of this.lotusLeaves) {
            // 计算漂浮效果
            let bobOffset = sin(frameCount * leaf.bobSpeed + leaf.bobPhase) * 3;
            let currentY = leaf.y + bobOffset;

            push();
            translate(leaf.x - cameraX, currentY);
            rotate(leaf.rotation + sin(frameCount * 0.01 + leaf.x * 0.001) * 0.1);

            // 荷叶阴影
            fill(0, 0, 0, 30);
            if (leaf.leafType === 'round') {
                ellipse(2, 3, leaf.size, leaf.size * 0.9);
            } else {
                // 有缺口的荷叶阴影
                ellipse(2, 3, leaf.size, leaf.size * 0.9);
            }

            // 荷叶主体
            fill(34, 139, 34, leaf.alpha); // 深绿色
            if (leaf.leafType === 'round') {
                // 圆形荷叶
                ellipse(0, 0, leaf.size, leaf.size * 0.9);
            } else {
                // 有缺口的荷叶
                ellipse(0, 0, leaf.size, leaf.size * 0.9);
                // 添加缺口
                fill(65, 105, 225, leaf.alpha); // 水的颜色
                triangle(0, -leaf.size * 0.4, leaf.size * 0.2, -leaf.size * 0.1, -leaf.size * 0.2, -leaf.size * 0.1);
            }

            // 荷叶纹理线条
            stroke(28, 120, 28, leaf.alpha * 0.8);
            strokeWeight(1.5);
            // 中心到边缘的线条
            for (let i = 0; i < 8; i++) {
                let angle = (TWO_PI / 8) * i;
                let endX = cos(angle) * leaf.size * 0.35;
                let endY = sin(angle) * leaf.size * 0.35 * 0.9;
                line(0, 0, endX, endY);
            }

            // 荷叶边缘高光
            noStroke();
            fill(60, 180, 60, leaf.alpha * 0.4);
            ellipse(-leaf.size * 0.15, -leaf.size * 0.15, leaf.size * 0.7, leaf.size * 0.6);

            pop();
        }
    }

    drawCloudPlatforms() {
        for (let i = 0; i < this.cloudPlatforms.length; i++) {
            const p = this.cloudPlatforms[i];
            if (p.x + p.w < cameraX - 80 || p.x - p.w > cameraX + width + 80) continue;

            push();
            translate(p.x, p.y);
            noStroke();
            fill(240);
            ellipse(0, 0, p.w * 0.6, p.h);
            pop();
        }
    }

    update() {
        this.updateCloudPlatforms();
    }

    draw() {
        this.drawMountains();
        this.drawClouds();
        this.drawRiver();
        this.drawLotusLeaves(); // 在水面绘制荷叶
        this.drawCloudPlatforms();
        this.drawTrees();
        this.drawBushes();

        // 绘制新地形元素
        this.drawHills();
        this.drawRocks();
        this.drawFlowers();
        this.drawGrassPatches();
        this.drawCaves();
        this.drawBridges();
        this.drawWaterfalls();
        this.drawCrystals();
        this.drawDesertDunes();
        this.drawIcebergs();
        this.drawVolcanoes();
    }

    // ===== 基础地形绘制方法 =====

    drawHills() {
        for (let hill of this.hills) {
            if (hill.x + hill.width < cameraX - 100 || hill.x - hill.width > cameraX + width + 100) continue;
            noStroke();
            fill(hill.color[0], hill.color[1], hill.color[2]);
            ellipse(hill.x, hill.y, hill.width, hill.height);
        }
    }

    drawRocks() {
        for (let rock of this.rocks) {
            if (rock.x + rock.size < cameraX - 50 || rock.x - rock.size > cameraX + width + 50) continue;
            noStroke();
            fill(120, 100, 80);
            ellipse(rock.x, rock.y, rock.size, rock.size * 0.8);
        }
    }

    drawFlowers() {
        for (let flower of this.flowers) {
            if (flower.x + flower.size < cameraX - 20 || flower.x - flower.size > cameraX + width + 20) continue;
            noStroke();
            fill(flower.color[0], flower.color[1], flower.color[2]);
            ellipse(flower.x, flower.y, flower.size, flower.size);
        }
    }

    drawGrassPatches() {
        for (let patch of this.grassPatches) {
            if (patch.x + patch.width < cameraX - 50 || patch.x - patch.width > cameraX + width + 50) continue;
            stroke(50, 150, 50);
            strokeWeight(1);
            for (let i = 0; i < patch.density; i++) {
                let grassX = patch.x + random(-patch.width / 2, patch.width / 2);
                line(grassX, patch.y, grassX, patch.y - random(10, 25));
            }
        }
    }

    drawCaves() {
        for (let cave of this.caves) {
            if (cave.x + cave.width < cameraX - 50 || cave.x - cave.width > cameraX + width + 50) continue;
            noStroke();
            fill(20, 20, 30);
            ellipse(cave.x, cave.y, cave.width, cave.height);
        }
    }

    drawBridges() {
        for (let bridge of this.bridges) {
            if (bridge.x + bridge.width < cameraX - 50 || bridge.x - bridge.width > cameraX + width + 50) continue;
            fill(139, 69, 19);
            rect(bridge.x - bridge.width / 2, bridge.y, bridge.width, bridge.height);
        }
    }

    drawWaterfalls() {
        for (let waterfall of this.waterfalls) {
            if (waterfall.x + waterfall.width < cameraX - 50 || waterfall.x - waterfall.width > cameraX + width + 50) continue;
            noStroke();
            fill(200, 230, 255, 150);
            rect(waterfall.x - waterfall.width / 2, waterfall.y, waterfall.width, waterfall.height);
        }
    }

    drawCrystals() {
        for (let crystal of this.crystals) {
            if (crystal.x + crystal.size < cameraX - 50 || crystal.x - crystal.size > cameraX + width + 50) continue;
            noStroke();
            let colors = { 'blue': [100, 150, 255], 'purple': [200, 100, 255], 'green': [100, 255, 150], 'pink': [255, 150, 200] };
            let color = colors[crystal.color];
            fill(color[0], color[1], color[2], 200);
            ellipse(crystal.x, crystal.y, crystal.size, crystal.size);
        }
    }

    drawDesertDunes() {
        for (let dune of this.desertDunes) {
            if (dune.x + dune.width < cameraX - 100 || dune.x - dune.width > cameraX + width + 100) continue;
            noStroke();
            fill(255, 220, 160);
            ellipse(dune.x, dune.y, dune.width, dune.height);
        }
    }

    drawIcebergs() {
        for (let iceberg of this.icebergs) {
            if (iceberg.x + iceberg.width < cameraX - 100 || iceberg.x - iceberg.width > cameraX + width + 100) continue;
            noStroke();
            fill(200, 230, 255);
            triangle(iceberg.x, iceberg.y - iceberg.height,
                iceberg.x - iceberg.width / 2, iceberg.y,
                iceberg.x + iceberg.width / 2, iceberg.y);
        }
    }

    drawVolcanoes() {
        for (let volcano of this.volcanoes) {
            if (volcano.x + volcano.width < cameraX - 100 || volcano.x - volcano.width > cameraX + width + 100) continue;
            noStroke();
            fill(80, 60, 50);
            triangle(volcano.x, volcano.y - volcano.height,
                volcano.x - volcano.width / 2, volcano.y,
                volcano.x + volcano.width / 2, volcano.y);
            if (volcano.active) {
                fill(255, 100, 50);
                ellipse(volcano.x, volcano.y - volcano.height + 20, 40, 15);
            }
        }
    }

    // ===== 地形创建方法 =====

    createHills() {
        // 创建丘陵地形
        for (let i = 0; i < 8; i++) {
            this.hills.push({
                x: random(0, worldWidth),
                y: floorPos_y - random(50, 120),
                width: random(200, 400),
                height: random(80, 150),
                color: [random(100, 140), random(120, 160), random(80, 120)]
            });
        }
        console.log(`🏔️ 创建了 ${this.hills.length} 个丘陵`);
    }

    createRocks() {
        // 创建岩石
        for (let i = 0; i < 15; i++) {
            this.rocks.push({
                x: random(100, worldWidth - 100),
                y: floorPos_y - random(20, 60),
                size: random(30, 80),
                type: random(['boulder', 'crystal', 'volcanic']),
                rotation: random(0, TWO_PI)
            });
        }
        console.log(`🪨 创建了 ${this.rocks.length} 个岩石`);
    }

    createFlowers() {
        // 创建花朵
        for (let i = 0; i < 25; i++) {
            this.flowers.push({
                x: random(50, worldWidth - 50),
                y: floorPos_y - random(5, 25),
                type: random(['rose', 'tulip', 'daisy', 'sunflower']),
                color: [random(200, 255), random(100, 200), random(150, 255)],
                size: random(8, 20),
                swayPhase: random(0, TWO_PI)
            });
        }
        console.log(`🌸 创建了 ${this.flowers.length} 朵花`);
    }

    createGrassPatches() {
        // 创建草丛
        for (let i = 0; i < 20; i++) {
            this.grassPatches.push({
                x: random(0, worldWidth),
                y: floorPos_y,
                width: random(50, 150),
                density: random(15, 30),
                windPhase: random(0, TWO_PI)
            });
        }
        console.log(`🌱 创建了 ${this.grassPatches.length} 片草丛`);
    }

    createCaves() {
        // 创建洞穴入口
        for (let i = 0; i < 3; i++) {
            this.caves.push({
                x: random(300, worldWidth - 300),
                y: floorPos_y - random(80, 120),
                width: random(60, 100),
                height: random(80, 120),
                depth: random(20, 40)
            });
        }
        console.log(`🕳️ 创建了 ${this.caves.length} 个洞穴`);
    }

    createBridges() {
        // 创建桥梁（跨越河流或峡谷）
        this.bridges.push({
            x: width + 200, // 跨越峡谷的桥
            y: floorPos_y - 20,
            width: 200,
            height: 15,
            type: 'wooden'
        });
        console.log(`🌉 创建了 ${this.bridges.length} 座桥梁`);
    }

    createWaterfalls() {
        // 创建瀑布
        for (let i = 0; i < 2; i++) {
            this.waterfalls.push({
                x: random(worldWidth * 0.3, worldWidth * 0.7),
                y: floorPos_y - random(200, 300),
                width: random(30, 60),
                height: random(150, 250),
                particles: []
            });
        }
        console.log(`💧 创建了 ${this.waterfalls.length} 个瀑布`);
    }

    createCrystals() {
        // 创建水晶
        for (let i = 0; i < 8; i++) {
            this.crystals.push({
                x: random(200, worldWidth - 200),
                y: floorPos_y - random(30, 80),
                size: random(25, 50),
                color: random(['blue', 'purple', 'green', 'pink']),
                glow: random(0.5, 1.0),
                pulsePhase: random(0, TWO_PI)
            });
        }
        console.log(`💎 创建了 ${this.crystals.length} 个水晶`);
    }

    createDesertDunes() {
        // 创建沙丘（在世界右侧）
        for (let i = 0; i < 5; i++) {
            this.desertDunes.push({
                x: worldWidth * 0.6 + random(0, worldWidth * 0.4),
                y: floorPos_y - random(40, 100),
                width: random(150, 300),
                height: random(60, 120),
                sandParticles: []
            });
        }
        console.log(`🏜️ 创建了 ${this.desertDunes.length} 个沙丘`);
    }

    createIcebergs() {
        // 创建冰山（在世界左侧）
        for (let i = 0; i < 3; i++) {
            this.icebergs.push({
                x: random(0, worldWidth * 0.3),
                y: floorPos_y - random(100, 200),
                width: random(100, 200),
                height: random(120, 250),
                iceParticles: []
            });
        }
        console.log(`🧊 创建了 ${this.icebergs.length} 座冰山`);
    }

    createVolcanoes() {
        // 创建火山
        this.volcanoes.push({
            x: worldWidth * 0.8,
            y: floorPos_y - 300,
            width: 200,
            height: 300,
            lavaParticles: [],
            smokeParticles: [],
            active: random() > 0.5
        });
        console.log(`🌋 创建了 ${this.volcanoes.length} 座火山 (活跃: ${this.volcanoes[0].active})`);
    }
}

// ===== 游戏主控制器 =====
class GameController {
    constructor() {
        this.weatherSystem = new WeatherSystem();
        this.characterSystem = new CharacterSystem();
        this.environmentSystem = new EnvironmentSystem();
        this.scoreSystem = new ScoreSystem();
        this.audioSystem = null; // 将在页面加载后初始化

        // 游戏状态管理
        this.gameState = "playing"; // "playing", "paused", "gameOver", "levelComplete"
        this.gameOverTimer = 0;
        this.transitionAlpha = 0;
        this.showInstructions = true;
        this.instructionTimer = 180; // 3秒显示说明

        console.log('游戏控制器初始化完成，当前状态:', this.gameState);
    }

    // 初始化音频系统
    initAudio() {
        if (typeof AudioSystem !== 'undefined') {
            this.audioSystem = new AudioSystem();
            this.audioSystem.init();
            this.audioSystem.playMusic();
            console.log('音频系统已集成到游戏控制器');
        } else {
            console.log('AudioSystem 类未找到，音频功能禁用');
        }
    }

    update() {
        // 更新说明显示计时器
        if (this.showInstructions) {
            this.instructionTimer--;
            if (this.instructionTimer <= 0) {
                this.showInstructions = false;
            }
        }

        // 根据游戏状态更新
        switch (this.gameState) {
            case "playing":
                this.updatePlaying();
                break;
            case "paused":
                // 暂停时不更新游戏逻辑，但保持渲染
                break;
            case "gameOver":
                this.updateGameOver();
                break;
            case "levelComplete":
                this.updateLevelComplete();
                break;
        }
    }

    updatePlaying() {
        this.weatherSystem.update();
        this.characterSystem.update();
        this.environmentSystem.update();
        this.scoreSystem.update();

        // 更新音频系统
        if (this.audioSystem) {
            this.audioSystem.update();
            // 持续检查天气状态变化并更新音效
            this.audioSystem.updateWeatherAudio(this.weatherSystem.getWeatherStatus());
        }

        // 更新分数系统的天气奖励
        this.scoreSystem.updateWeatherBonus(this.weatherSystem.isRaining, this.weatherSystem.isSnowing);

        // 检查游戏结束条件
        if (this.characterSystem.lives <= 0) {
            this.gameOver();
        }

        // 检查通关条件（分数达到1000）
        if (this.scoreSystem.score >= 1000 && this.gameState === "playing") {
            this.levelComplete();
        }
    }

    updateGameOver() {
        this.gameOverTimer++;
        // 游戏结束动画效果
        this.transitionAlpha = Math.min(200, this.gameOverTimer * 3);
    }

    updateLevelComplete() {
        this.gameOverTimer++;
        this.transitionAlpha = Math.min(180, this.gameOverTimer * 2);
    }

    // 游戏结束
    gameOver() {
        if (this.gameState !== "gameOver") {
            this.gameState = "gameOver";
            this.gameOverTimer = 0;
            this.scoreSystem.gameOver();

            // 播放游戏结束音效
            if (this.audioSystem) {
                this.audioSystem.onGameOver();
            }

            console.log('游戏结束！最终分数:', this.scoreSystem.score);
        }
    }

    // 通关
    levelComplete() {
        if (this.gameState !== "levelComplete") {
            this.gameState = "levelComplete";
            this.gameOverTimer = 0;
            this.scoreSystem.levelComplete();

            // 播放通关音效
            if (this.audioSystem) {
                this.audioSystem.onLevelComplete();
            }

            console.log('恭喜通关！分数:', this.scoreSystem.score);
        }
    }

    // 暂停/继续游戏
    togglePause() {
        if (this.gameState === "playing") {
            this.gameState = "paused";
            console.log('游戏暂停');
        } else if (this.gameState === "paused") {
            this.gameState = "playing";
            console.log('游戏继续');
        }
    }

    // 重新开始游戏
    restartGame() {
        this.gameState = "playing";
        this.gameOverTimer = 0;
        this.transitionAlpha = 0;
        this.showInstructions = true;
        this.instructionTimer = 180;

        // 重置所有系统
        this.characterSystem.life = this.characterSystem.maxLife;
        this.characterSystem.lives = 3;
        this.characterSystem.cat.x = width / 2;
        this.characterSystem.cat.y = floorPos_y;
        this.characterSystem.cat.vy = 0;
        this.characterSystem.isInvincible = false;
        this.characterSystem.invincibleTimer = 0;

        // 重新生成鱼和收集物品
        this.characterSystem.fishes = [];
        this.characterSystem.collectibles = [];
        this.characterSystem.activePowerUps = {};
        this.characterSystem.spawnFishes();
        this.characterSystem.spawnCollectibles();

        // 重置分数系统
        this.scoreSystem.resetGame();

        console.log('游戏重新开始');
    }

    draw() {
        // 绘制背景
        if (this.weatherSystem.isNight) {
            background(20, 20, 50);
        } else {
            background(100, 155, 255);
        }

        // 绘制环境（背景层）
        this.environmentSystem.draw();

        // 绘制天气效果（中间层，在环境和角色之间）
        this.weatherSystem.draw();

        // 绘制角色（前景层）
        this.characterSystem.draw();

        // 绘制分数效果（UI层）
        this.scoreSystem.draw();

        // 绘制UI（最顶层）
        this.drawUI();

        // 根据游戏状态绘制覆盖层（最最顶层）
        this.drawGameStateOverlay();
    }

    drawGameStateOverlay() {
        switch (this.gameState) {
            case "paused":
                this.drawPauseScreen();
                break;
            case "gameOver":
                this.drawGameOverScreen();
                break;
            case "levelComplete":
                this.drawLevelCompleteScreen();
                break;
        }

        // 绘制操作说明
        if (this.showInstructions) {
            this.drawInstructions();
        }
    }

    drawPauseScreen() {
        // 半透明覆盖
        fill(0, 150);
        rect(0, 0, width, height);

        // 暂停文字
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        text("游戏暂停", width / 2, height / 2 - 40);

        textSize(24);
        text("按 P 键继续游戏", width / 2, height / 2 + 20);

        textSize(18);
        text("按 R 键重新开始", width / 2, height / 2 + 60);
    }

    drawGameOverScreen() {
        // 渐现的黑色覆盖
        fill(0, this.transitionAlpha);
        rect(0, 0, width, height);

        // 游戏结束界面
        fill(255, 255, 255, map(this.gameOverTimer, 0, 60, 0, 255));
        textAlign(CENTER, CENTER);
        textSize(52);
        text("Game Over", width / 2, height / 2 - 80);

        if (this.gameOverTimer > 30) {
            let scoreInfo = this.scoreSystem.getScoreInfo();

            textSize(28);
            fill(255, 255, 0);
            text(`Final Score: ${scoreInfo.score}`, width / 2, height / 2 - 20);

            fill(255);
            textSize(24);
            text(`High Score: ${scoreInfo.highScore}`, width / 2, height / 2 + 20);
            text(`Level Reached: ${scoreInfo.level}`, width / 2, height / 2 + 50);

            textSize(20);
            fill(200);
            text(`Mice Killed: ${scoreInfo.stats.miceKilled}`, width / 2, height / 2 + 90);
            text(`Fish Collected: ${scoreInfo.stats.fishCollected}`, width / 2, height / 2 + 115);
            text(`Max Combo: ${scoreInfo.maxCombo}x`, width / 2, height / 2 + 140);

            textSize(18);
            fill(100, 255, 100);
            text("Press R to restart", width / 2, height / 2 + 180);
        }
    }

    drawLevelCompleteScreen() {
        // 渐现的金色覆盖
        fill(255, 215, 0, this.transitionAlpha);
        rect(0, 0, width, height);

        // 通关界面
        fill(255, 255, 255, map(this.gameOverTimer, 0, 60, 0, 255));
        textAlign(CENTER, CENTER);
        textSize(52);
        text("🎉 Congratulations! Level Complete!", width / 2, height / 2 - 80);

        if (this.gameOverTimer > 30) {
            let scoreInfo = this.scoreSystem.getScoreInfo();

            textSize(28);
            fill(255, 215, 0);
            text(`Final Score: ${scoreInfo.score}`, width / 2, height / 2 - 20);

            fill(255);
            textSize(24);
            text(`🏆 New Record: ${scoreInfo.highScore}`, width / 2, height / 2 + 20);
            text(`⭐ Level: ${scoreInfo.level}`, width / 2, height / 2 + 50);

            textSize(20);
            fill(255, 255, 100);
            text(`🎯 Perfect Performance Stats`, width / 2, height / 2 + 90);
            text(`Kills: ${scoreInfo.stats.miceKilled} | Collected: ${scoreInfo.stats.fishCollected} | Combo: ${scoreInfo.maxCombo}x`, width / 2, height / 2 + 115);

            textSize(18);
            fill(100, 255, 100);
            text("Press R to challenge again", width / 2, height / 2 + 160);
        }
    }

    drawInstructions() {
        let alpha = map(this.instructionTimer, 0, 300, 0, 255);

        // 说明面板背景
        fill(0, 100, alpha);
        rect(width - 320, 20, 300, 200, 10);

        // 说明文字
        fill(255, alpha);
        textAlign(LEFT, TOP);
        textSize(16);
        text("🎮 Game Controls", width - 310, 40);

        textSize(12);
        text("WASD / Arrow Keys - Move", width - 310, 65);
        text("Spacebar - Jump", width - 310, 85);
        text("P Key - Pause Game", width - 310, 105);
        text("R Key - Restart", width - 310, 125);

        text("🎯 Game Objectives", width - 310, 150);
        text("🐟 Collect fish to restore health", width - 310, 170);
        text("🍎 Apple rice provides bonus points", width - 310, 185);
        text("⚡ Power-ups enhance abilities", width - 310, 200);
        text("🏆 Reach 1000 points to complete level", width - 310, 215);
    }

    drawUI() {
        // 获取分数信息
        let scoreInfo = this.scoreSystem.getScoreInfo();

        // 分数
        fill(255, 255, 0);
        textSize(22);
        textAlign(LEFT, TOP);
        text('Score: ' + scoreInfo.score, 30, 60);

        // 最高分
        fill(255, 255, 255);
        textSize(16);
        text('High Score: ' + scoreInfo.highScore, 30, 85);

        // 等级和经验
        textSize(18);
        text('Level: ' + scoreInfo.level, 30, 110);

        // 经验条
        fill(100);
        rect(30, 135, 150, 8, 4);
        fill(0, 255, 0);
        let expPercent = scoreInfo.experience / scoreInfo.experienceToNext;
        rect(30, 135, 150 * expPercent, 8, 4);

        // 经验文字
        fill(255);
        textSize(14);
        text(`经验: ${scoreInfo.experience}/${scoreInfo.experienceToNext}`, 30, 160);

        // 连击显示
        if (scoreInfo.combo > 1) {
            fill(255, 255, 0);
            textSize(20);
            text(`连击: ${scoreInfo.combo}x`, 30, 185);
        }

        // 生命值
        fill(255, 0, 0);
        for (let i = 0; i < this.characterSystem.lives; i++) {
            ellipse(30 + 22 * i, 220, 18, 16);
        }

        // 能力状态显示
        let powerUpY = 250;
        let activePowerUps = Object.keys(this.characterSystem.activePowerUps);
        if (activePowerUps.length > 0) {
            fill(255, 255, 0);
            textSize(14);
            text("🔥 激活能力:", 30, powerUpY);

            fill(255);
            textSize(12);
            for (let i = 0; i < activePowerUps.length; i++) {
                let powerUp = activePowerUps[i];
                let timeLeft = Math.ceil(this.characterSystem.activePowerUps[powerUp] / 60);
                let powerUpName = {
                    'speed': '⚡速度',
                    'jump': '🦘跳跃',
                    'shield': '🛡️护盾',
                    'magnet': '🧲磁铁'
                }[powerUp] || powerUp;
                text(`${powerUpName}: ${timeLeft}s`, 130 + i * 80, powerUpY);
            }
            powerUpY += 25;
        }

        // 统计信息（简化版）
        fill(200);
        textSize(12);
        text(`击杀: ${scoreInfo.stats.miceKilled} | 收集: ${scoreInfo.stats.fishCollected + scoreInfo.stats.applesCollected + scoreInfo.stats.riceCollected}`, 30, powerUpY);
        text(`成就: ${scoreInfo.achievements.length}/${this.scoreSystem.achievements.length}`, 30, powerUpY + 15);
    }

    handleKeyPress(key) {
        // 游戏状态相关按键（任何时候都可以使用）
        if (key === 'p' || key === 'P') {
            this.togglePause();
            return;
        }

        if (key === 'r' || key === 'R') {
            if (this.gameState === "gameOver" || this.gameState === "levelComplete" || this.gameState === "paused") {
                this.restartGame();
                return;
            }
        }

        // 只在游戏进行时处理其他按键
        if (this.gameState !== "playing") {
            return;
        }

        switch (key) {
            case ' ':
                this.characterSystem.jump();
                this.scoreSystem.jump(); // 添加跳跃得分
                break;
            case 'a':
            case 'A':
            case 'ArrowLeft':
                this.characterSystem.moveLeft();
                break;
            case 'd':
            case 'D':
            case 'ArrowRight':
                this.characterSystem.moveRight();
                break;
            case 'n':
            case 'N':
                this.weatherSystem.toggleNight();
                break;
            case 's':
            case 'S':
                this.weatherSystem.toggleSnow();
                break;
            case 'm':
            case 'M':
                // 切换音频开关
                if (this.audioSystem) {
                    this.audioSystem.toggle();
                }
                break;
        }
    }

    handleKeyRelease(key) {
        // 只在游戏进行时处理按键释放
        if (this.gameState !== "playing") {
            return;
        }

        switch (key) {
            case 'a':
            case 'A':
            case 'ArrowLeft':
            case 'd':
            case 'D':
            case 'ArrowRight':
                this.characterSystem.stopMoving();
                break;
        }
    }

    // 获取游戏状态信息
    getGameState() {
        return {
            state: this.gameState,
            score: this.scoreSystem.score,
            lives: this.characterSystem.lives,
            level: this.scoreSystem.level
        };
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WeatherSystem,
        CharacterSystem,
        EnvironmentSystem,
        GameController
    };
}
