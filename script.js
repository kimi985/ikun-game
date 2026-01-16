// 游戏状态变量
let score = 0; // 游戏得分
let lives = 3; // 玩家生命数
let gameStarted = false; // 游戏是否开始
let level = 1; // 当前关卡
let gameMode = 'hit'; // 游戏模式：'hit' 击球模式，'dribble' 运球模式
let gameType = 'level'; // 游戏类型：'level' 关卡模式，'endless' 无尽模式
let bossActive = false; // boss是否激活
let bossHits = 0; // boss当前被击中次数
let bossMaxHits = 200; // boss1需要被击中的次数，改为200次
let bossPhase = 1; // boss当前阶段，1为第一阶段，2为第二阶段
let bosses = []; // 存储多个boss
let nextPhaseUnlocked = false; // 下一阶段是否解锁
let lastBossHitTime = 0; // 上次击中boss的时间，用于限制击中频率
let bossCooldown = false; // boss激活冷却，避免频繁激活
let gameStartTime = 0; // 游戏开始时间
let gameDuration = 0; // 游戏持续时间（秒）

// Canvas 相关变量
let canvas, ctx; // Canvas元素和2D上下文
let canvasWidth = window.innerWidth; // Canvas宽度，初始化为窗口宽度
let canvasHeight = window.innerHeight; // Canvas高度，初始化为窗口高度

// 图片资源
let kunkunImage = null; // 普通砖块图片
let ikunImage = null; // 底板图片
let jiImage = null; // 双重砖块图片
let imagesLoaded = false; // 图片是否加载完成
let speedMultiplier = 1; // 球速倍率

// 游戏对象
// 初始球 - 游戏开始时的球
let balls = [{
    x: canvasWidth / 2, // 球的初始X坐标，位于画布中心
    y: canvasHeight - canvasHeight * 0.1, // 球的初始Y坐标，根据画布高度动态调整
    radius: Math.min(canvasWidth, canvasHeight) * 0.02, // 球的半径，根据画布大小动态调整
    speedX: Math.min(canvasWidth, canvasHeight) * 0.03, // 球的X轴速度，根据画布大小动态调整
    speedY: -Math.min(canvasWidth, canvasHeight) * 0.03, // 球的Y轴速度，负值表示向上移动，根据画布大小动态调整
    color: '#4CAF50' // 球的颜色
}];


let buffs = []; // 游戏中的buff数组

// 底板对象 - 玩家控制的对象
let paddle = {
    x: canvasWidth / 2 - canvasWidth * 0.0625, // 底板X坐标，初始位于画布中心
    y: canvasHeight - canvasHeight * 0.25, // 底板Y坐标，根据画布高度动态调整
    width: canvasWidth * 0.125, // 底板宽度，根据画布宽度动态调整
    height: canvasHeight * 0.25, // 底板高度，根据画布高度动态调整
    speed: canvasWidth * 0.01, // 底板移动速度，根据画布宽度动态调整
    color: '#2196F3' // 底板颜色
};

// 砖块相关变量
let bricks = []; // 砖块数组
let brickWidth = 50; // 砖块宽度
let brickHeight = 25; // 砖块高度
let brickGap = 10; // 砖块间隙
let brickOffsetTop = 60; // 砖块顶部偏移
let brickOffsetLeft = 35; // 砖块左侧偏移
let rows = 5; // 砖块行数
let cols = 10; // 砖块列数

// 键盘控制状态 - 跟踪方向键的按下状态
let keys = {
    left: false, // 左方向键是否按下
    right: false // 右方向键是否按下
};

// 初始化游戏 - 游戏启动时调用
function initGame() {
    // 获取 Canvas 元素
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // 设置Canvas大小
    resizeCanvas();
    
    // 监听窗口大小变化，当窗口大小改变时调整Canvas大小
    window.addEventListener('resize', resizeCanvas);
    
    // 加载图片资源
    kunkunImage = document.getElementById('kunkun-image');
    ikunImage = document.getElementById('ikun-image');
    jiImage = document.getElementById('ji-image');
    buff2Image = document.getElementById('buff-2-image');
    buff5Image = document.getElementById('buff-5-image');
    
    // 检查图片是否加载完成
    let loadedImages = 0;
    const totalImages = 5;
    
    // 图片加载完成回调函数
    function imageLoaded() {
        loadedImages++;
        if (loadedImages === totalImages) {
            imagesLoaded = true;
            // 图片加载完成后初始化游戏
            createBricks();
            
            // 监听键盘事件
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // 监听球速调整滑块
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    if (speedSlider && speedValue) {
        speedSlider.addEventListener('input', function() {
            const newMultiplier = parseFloat(this.value);
            
            // 立即更新所有球的速度
            if (balls.length > 0) {
                for (let ball of balls) {
                    const currentSpeed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY);
                    const angle = Math.atan2(ball.speedX, ball.speedY);
                    const newSpeed = currentSpeed * (newMultiplier / speedMultiplier);
                    ball.speedX = Math.sin(angle) * newSpeed;
                    ball.speedY = Math.cos(angle) * newSpeed;
                }
            }
            
            // 更新速度倍率和显示
            speedMultiplier = newMultiplier;
            speedValue.textContent = speedMultiplier.toFixed(1) + 'x';
        });
    }
            
            // 显示排行榜
            showLeaderboard();
            
            // 开始游戏循环
            animate();
        }
    }
    
    // 监听图片加载事件
    if (kunkunImage.complete) {
        imageLoaded();
    } else {
        kunkunImage.onload = imageLoaded;
    }
    
    if (ikunImage.complete) {
        imageLoaded();
    } else {
        ikunImage.onload = imageLoaded;
    }
    
    if (jiImage.complete) {
        imageLoaded();
    } else {
        jiImage.onload = imageLoaded;
    }
    
    if (buff2Image.complete) {
        imageLoaded();
    } else {
        buff2Image.onload = imageLoaded;
    }
    
    if (buff5Image.complete) {
        imageLoaded();
    } else {
        buff5Image.onload = imageLoaded;
    }
}

// 调整Canvas大小以适应窗口
function resizeCanvas() {
    // 更新Canvas大小
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // 更新底板位置和大小
    paddle.x = canvasWidth / 2 - canvasWidth * 0.0625; // 底板X坐标，位于画布中心
    paddle.y = canvasHeight - canvasHeight * 0.25; // 底板Y坐标，根据画布高度动态调整
    paddle.width = canvasWidth * 0.125; // 底板宽度，根据画布宽度动态调整
    paddle.height = canvasHeight * 0.25; // 底板高度，根据画布高度动态调整
    paddle.speed = Math.min(canvasWidth, canvasHeight) * 0.03; // 底板移动速度，和球的速度一样快
    
    // 更新球的位置、大小和速度
    if (balls.length > 0) {
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            ball.radius = Math.min(canvasWidth, canvasHeight) * 0.02; // 球的半径，根据画布大小动态调整
            
            // 球速随着屏幕的增大而变快
            const currentSpeed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY);
            const screenSize = Math.min(canvasWidth, canvasHeight);
            // 使用非线性增长方式，使球速随着屏幕增大而增长得更快
            const newSpeed = screenSize * 0.03 * speedMultiplier;
            if (currentSpeed > 0) {
                const speedRatio = newSpeed / currentSpeed;
                ball.speedX *= speedRatio;
                ball.speedY *= speedRatio;
            } else {
                ball.speedX = newSpeed;
                ball.speedY = -newSpeed;
            }
        }
    }
    
    // 更新物块的大小，跟板子的一样
    brickWidth = canvasWidth * 0.06; // 物块宽度，根据画布宽度动态调整
    brickHeight = canvasHeight * 0.04; // 物块高度，根据画布高度动态调整
    
    // 更新物块的偏移量，跟板子的一样
    brickOffsetTop = canvasHeight * 0.1; // 物块顶部偏移，根据画布高度动态调整
    brickOffsetLeft = canvasWidth * 0.05; // 物块左侧偏移，根据画布宽度动态调整
    
    // 更新物块的间隙，跟板子的一样
    brickGap = canvasWidth * 0.01; // 物块间隙，根据画布宽度动态调整
    
    // 更新buff的大小，跟板子的一样
    for (let i = 0; i < buffs.length; i++) {
        const buff = buffs[i];
        buff.radius = Math.min(canvasWidth, canvasHeight) * 0.015; // buff的半径，根据画布大小动态调整
    }
}

// 创建砖块 - 关卡模式下生成砖块
function createBricks() {
    bricks = []; // 清空砖块数组
    
    // 根据关卡调整砖块数量和生成范围
    // 第一关范围小，然后每一关的活动范围依次增加，第十关布满全网页
    const maxBricks = 80; // 最大砖块数
    const totalBricks = Math.min(20 + (level - 1) * 7, maxBricks); // 每关增加7个砖块，最多80个
    
    // 计算生成范围（只在上半区）
    const halfHeight = canvasHeight / 2; // 画布高度的一半
    const paddingX = Math.max(35, 150 - (level - 1) * 12); // 左右边距，每关减少12像素
    const paddingY = Math.max(60, 150 - (level - 1) * 10); // 上边距，每关减少10像素
    const maxX = Math.max(100, canvasWidth - brickWidth - paddingX * 2); // 确保maxX为正数
    const maxY = Math.max(50, halfHeight - brickHeight - paddingY); // 确保maxY为正数，只在上半区生成
    
    // 确保至少生成一些砖块
    for (let i = 0; i < Math.max(10, totalBricks); i++) {
        // 随机位置，根据关卡调整范围（只在上半区）
        const x = Math.random() * maxX + paddingX;
        const y = Math.random() * maxY + paddingY;
        
        // 随机颜色
        const color = getBrickColor(Math.floor(Math.random() * 5));
        
        // 根据关卡决定是否为双重砖块
        // 第一、二关不生成双重砖块，第三关开始生成双重砖块（30%的概率）
        const isDoubleBrick = level >= 3 && Math.random() < 0.3;
        
        // 添加砖块到数组
        bricks.push({
            x: x, // 砖块X坐标
            y: y, // 砖块Y坐标
            width: brickWidth, // 砖块宽度
            height: brickHeight, // 砖块高度
            color: color, // 砖块颜色
            active: true, // 砖块是否激活
            isDouble: isDoubleBrick, // 是否为双重砖块
            hits: isDoubleBrick ? 2 : 1, // 双重砖块需要打两下
            points: 10 * level // 每一关的积分倍数增加
        });
    }
}

// 根据行数获取砖块颜色
function getBrickColor(row) {
    const colors = ['#FF5722', '#FF9800', '#FFC107', '#4CAF50', '#2196F3']; // 砖块颜色数组
    return colors[row % colors.length]; // 返回对应颜色
}

// 处理键盘按下事件
function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') {
        keys.left = true; // 左方向键按下
    } else if (event.key === 'ArrowRight') {
        keys.right = true; // 右方向键按下
    } else if (event.key === ' ' && !gameStarted) {
        // 按空格键开始游戏
        gameStarted = true;
        // 初始轨迹在160度内旋转
        const angle = (Math.random() * 160 - 80) * Math.PI / 180;
        // 球的初始速度随着屏幕的增大而变快
        const screenSize = Math.min(canvasWidth, canvasHeight);
        const speed = screenSize * 0.03 * speedMultiplier;
        balls[0].speedX = speed * Math.sin(angle);
        balls[0].speedY = -speed * Math.cos(angle);
    } else if (event.key === 'r' || event.key === 'R') {
        // 按r键切换模式
        if (gameMode === 'hit') {
            gameMode = 'dribble';
            document.getElementById('mode').textContent = `模式：运球模式`;
        } else {
            gameMode = 'hit';
            document.getElementById('mode').textContent = `模式：击球模式`;
        }
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        // 上下箭头调整球速
        const speedSlider = document.getElementById('speed-slider');
        if (speedSlider) {
            if (event.key === 'ArrowUp') {
                // 上箭头加速
                let currentValue = parseFloat(speedSlider.value);
                if (currentValue < 10) {
                    currentValue += 0.1;
                    speedSlider.value = currentValue.toFixed(1);
                    // 触发input事件，更新球速
                    speedSlider.dispatchEvent(new Event('input'));
                }
            } else if (event.key === 'ArrowDown') {
                // 下箭头减速
                let currentValue = parseFloat(speedSlider.value);
                if (currentValue > 0.1) {
                    currentValue -= 0.1;
                    speedSlider.value = currentValue.toFixed(1);
                    // 触发input事件，更新球速
                    speedSlider.dispatchEvent(new Event('input'));
                }
            }
        }
    } else if (event.key === 'm' || event.key === 'M') {
        // M键结束无尽模式游戏
        if (gameType === 'endless') {
            endEndlessMode();
        }
    }
}

// 处理键盘松开事件
function handleKeyUp(event) {
    if (event.key === 'ArrowLeft') {
        keys.left = false; // 左方向键松开
    } else if (event.key === 'ArrowRight') {
        keys.right = false; // 右方向键松开
    }
}

// 绘制球 - 绘制所有球
function drawBalls() {
    balls.forEach(ball => { // 遍历所有球
        // 绘制篮球
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); // 绘制圆形
        
        // 篮球主体颜色
        ctx.fillStyle = '#FF6B6B';
        ctx.fill();
        
        // 篮球纹路
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 篮球垂直纹路
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y - ball.radius);
        ctx.lineTo(ball.x, ball.y + ball.radius);
        ctx.stroke();
        
        // 篮球水平纹路
        ctx.beginPath();
        ctx.ellipse(ball.x, ball.y, ball.radius * 0.8, ball.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.closePath();
    });
}

// 绘制 buff - 绘制所有buff
function drawBuffs() {
    buffs.forEach(buff => { // 遍历所有buff
        ctx.beginPath();
        ctx.arc(buff.x, buff.y, buff.radius, 0, Math.PI * 2); // 绘制圆形
        const gradient = ctx.createRadialGradient(buff.x, buff.y, 0, buff.x, buff.y, buff.radius); // 创建径向渐变
        gradient.addColorStop(0, buff.color); // 渐变中心颜色
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // 渐变边缘颜色
        ctx.fillStyle = gradient; // 设置填充样式为渐变
        ctx.fill();
        ctx.closePath();
        
        // 绘制 buff 图标
        if (imagesLoaded) {
            if (buff.type === 'multiball' && buff2Image && buff2Image.complete && buff2Image.naturalWidth > 0) {
                // 发两个球buff使用2.png图标
                ctx.drawImage(
                    buff2Image, // 图片对象
                    buff.x - buff.radius * 0.7, // 绘制X坐标
                    buff.y - buff.radius * 0.7, // 绘制Y坐标
                    buff.radius * 1.4, // 绘制宽度
                    buff.radius * 1.4 // 绘制高度
                );
            } else if (buff.type === 'double' && buff5Image && buff5Image.complete && buff5Image.naturalWidth > 0) {
                // 双倍球buff使用5.png图标
                ctx.drawImage(
                    buff5Image, // 图片对象
                    buff.x - buff.radius * 0.7, // 绘制X坐标
                    buff.y - buff.radius * 0.7, // 绘制Y坐标
                    buff.radius * 1.4, // 绘制宽度
                    buff.radius * 1.4 // 绘制高度
                );
            }
        } else {
            // 图片未加载时的 fallback - 绘制文字
            ctx.fillStyle = '#ffffff'; // 文字颜色
            ctx.font = '12px Arial'; // 文字字体
            ctx.textAlign = 'center'; // 文字对齐方式
            ctx.textBaseline = 'middle'; // 文字基线
            ctx.fillText('+', buff.x, buff.y); // 绘制文字
        }
    });
}

// 绘制边界线 - 绘制游戏区域边界
function drawBoundaries() {
    ctx.beginPath();
    ctx.rect(0, 0, canvasWidth, canvasHeight); // 绘制矩形
    ctx.strokeStyle = '#5D4037'; // 边界线颜色
    ctx.lineWidth = 3; // 边界线宽度
    ctx.setLineDash([10, 5]); // 设置虚线样式
    ctx.stroke(); // 绘制边界线
    ctx.setLineDash([]); // 重置为实线
    ctx.closePath();
}

// 绘制底板 - 绘制玩家控制的底板
function drawPaddle() {
    if (imagesLoaded && ikunImage && ikunImage.complete && ikunImage.naturalWidth > 0) { // 图片加载完成且成功
        // 绘制ikun图片
        ctx.drawImage(
            ikunImage, // 图片对象
            paddle.x, // 绘制X坐标
            paddle.y, // 绘制Y坐标
            paddle.width, // 绘制宽度
            paddle.height // 绘制高度
        );
    } else {
        // 图片未加载或加载失败时的 fallback - 绘制矩形
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height); // 绘制矩形
        ctx.fillStyle = paddle.color; // 填充颜色
        ctx.fill(); // 填充
        ctx.strokeStyle = '#000000'; // 边框颜色
        ctx.lineWidth = 1; // 边框宽度
        ctx.stroke(); // 绘制边框
        ctx.closePath();
    }
}

// 绘制砖块 - 绘制所有砖块
function drawBricks() {
    bricks.forEach(brick => { // 遍历所有砖块
        if (brick.active) { // 砖块激活
            if (imagesLoaded) { // 图片加载完成
                if (brick.isDouble && jiImage && jiImage.complete && jiImage.naturalWidth > 0) { // 双重砖块且图片加载成功
                    // 双重砖块使用ji图片
                    ctx.drawImage(
                        jiImage, // 图片对象
                        brick.x, // 绘制X坐标
                        brick.y, // 绘制Y坐标
                        brick.width, // 绘制宽度
                        brick.height // 绘制高度
                    );
                    
                    // 如果双重砖块已经被打了一下，添加一个半透明覆盖层
                    if (brick.hits === 1) {
                        ctx.beginPath();
                        ctx.rect(brick.x, brick.y, brick.width, brick.height); // 绘制矩形
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // 半透明白色
                        ctx.fill(); // 填充
                        ctx.closePath();
                    }
                } else if (kunkunImage && kunkunImage.complete && kunkunImage.naturalWidth > 0) { // 普通砖块且图片加载成功
                    // 普通砖块使用kunkun图片
                    ctx.drawImage(
                        kunkunImage, // 图片对象
                        brick.x, // 绘制X坐标
                        brick.y, // 绘制Y坐标
                        brick.width, // 绘制宽度
                        brick.height // 绘制高度
                    );
                } else {
                    // 图片加载失败时的 fallback - 绘制矩形
                    ctx.beginPath();
                    ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 3); // 绘制圆角矩形
                    if (brick.isDouble) { // 双重砖块
                        if (brick.hits === 2) {
                            ctx.fillStyle = '#9C27B0'; // 双重砖块未被打时使用紫色
                        } else {
                            ctx.fillStyle = '#BA68C8'; // 双重砖块被打了一下后使用浅紫色
                        }
                    } else {
                        ctx.fillStyle = '#FFE066'; // 普通砖块使用黄色
                    }
                    ctx.fill(); // 填充
                    ctx.strokeStyle = '#000000'; // 边框颜色
                    ctx.lineWidth = 1; // 边框宽度
                    ctx.stroke(); // 绘制边框
                    ctx.closePath();
                }
            } else {
                // 图片未加载时的 fallback - 绘制矩形
                ctx.beginPath();
                ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 3); // 绘制圆角矩形
                if (brick.isDouble) { // 双重砖块
                    if (brick.hits === 2) {
                        ctx.fillStyle = '#9C27B0'; // 双重砖块未被打时使用紫色
                    } else {
                        ctx.fillStyle = '#BA68C8'; // 双重砖块被打了一下后使用浅紫色
                    }
                } else {
                    ctx.fillStyle = '#FFE066'; // 普通砖块使用黄色
                }
                ctx.fill(); // 填充
                ctx.strokeStyle = '#000000'; // 边框颜色
                ctx.lineWidth = 1; // 边框宽度
                ctx.stroke(); // 绘制边框
                ctx.closePath();
            }
        }
    });
}

// 移动底板 - 根据键盘输入移动底板
function movePaddle() {
    if (keys.left && paddle.x > 0) { // 左方向键按下且底板未到左边界
        paddle.x -= paddle.speed; // 向左移动
    }
    if (keys.right && paddle.x < canvasWidth - paddle.width) { // 右方向键按下且底板未到右边界
        paddle.x += paddle.speed; // 向右移动
    }
    
    // 游戏未开始时，球跟随底板
    if (!gameStarted) {
        balls[0].x = paddle.x + paddle.width / 2; // 球的X坐标跟随底板中心
        balls[0].y = canvasHeight - 50; // 球的Y坐标保持不变
    }
}

// 移动球 - 移动所有球并处理碰撞
function moveBalls() {
    if (gameStarted) { // 游戏已开始

        
        // 遍历所有球
        for (let i = balls.length - 1; i >= 0; i--) {
            let ball = balls[i];
            if (!ball) continue; // 确保球存在
            ball.x += ball.speedX; // 移动球的X坐标
            ball.y += ball.speedY; // 移动球的Y坐标
            
            // 球与左右墙壁碰撞
            if (ball.x + ball.radius > canvasWidth || ball.x - ball.radius < 0) {
                ball.speedX *= -1; // 反转X轴速度
            }
            
            // 球与上墙壁碰撞
            if (ball.y - ball.radius < 0) {
                // 检查是否碰到boss
                let hitBoss = false;
                if (bossActive) {
                    // 限制击中频率，每100毫秒最多击中1次
                    const currentTime = Date.now();
                    if (currentTime - lastBossHitTime > 100) {
                        // 遍历所有boss，检查是否碰到
                        for (let j = 0; j < bosses.length; j++) {
                            const boss = bosses[j];
                            let isHit = false;
                            
                            if (boss.phase === 2) {
                                // boss2的受击框改为上方边界线
                                // 只检查球是否碰到boss的顶部边界
                                if (ball.x + ball.radius > boss.x && 
                                    ball.x - ball.radius < boss.x + boss.width && 
                                    ball.y - ball.radius < boss.y) {
                                    isHit = true;
                                }
                            } else {
                                // boss1的受击框保持不变
                                if (ball.x + ball.radius > boss.x && 
                                    ball.x - ball.radius < boss.x + boss.width && 
                                    ball.y - ball.radius < boss.y + boss.height) {
                                    isHit = true;
                                }
                            }
                            
                            if (isHit) {
                                // 增加boss被击中次数
                                bossHits = Math.min(bossHits + 1, bossMaxHits);
                                boss.hits = Math.min(boss.hits + 1, boss.maxHits);
                                lastBossHitTime = currentTime;
                                hitBoss = true;
                                
                                // 在受击位置产生雷电特效
                                createLightningEffectAtPosition(ball.x, ball.y);
                                
                                // 检查boss是否被击败
                                if (bossHits >= bossMaxHits) {
                                    // 检查是否进入boss二阶段
                                    if (bossPhase === 1) {
                                        enterBossPhase2();
                                    } else {
                                        bossActive = false;
                                        // 添加闪过去的提示
                                        showFlashMessage('恭喜击败boss！', 2000);
                                        // 释放闪电特效，和第十关的通关闪电一样
                                        createLightningEffect();
                                    }
                                }
                                
                                break;
                            }
                        }
                    }
                }
                
                // 如果没有碰到boss，才反转Y轴速度
                if (!hitBoss) {
                    // 确保球不会卡在边界上
                    ball.y = ball.radius; // 重置球的位置到边界内
                    ball.speedY *= -1; // 反转Y轴速度
                    // 确保球速不会太小，避免卡球
                    const minSpeed = Math.min(canvasWidth, canvasHeight) * 0.005;
                    if (Math.abs(ball.speedY) < minSpeed) {
                        ball.speedY = -minSpeed; // 保持最小速度
                    }
                }
            }
            
            // 球与底板碰撞
            if (ball.y + ball.radius > paddle.y && 
                ball.x > paddle.x && 
                ball.x < paddle.x + paddle.width &&
                !ball.recentlyHit) {
                // 标记球刚刚被板子打出去
                ball.recentlyHit = true;
                
                // 播放jinitaimei音效
                playSound('jinitaimei-audio');
                
                // 根据当前模式决定击球间隔
                let hitInterval;
                if (gameMode === 'hit') {
                    hitInterval = 350; // 击球模式：0.35秒
                } else {
                    hitInterval = 0; // 运球模式：0秒
                }
                
                // 间隔后允许球再次被板子抓住
                setTimeout(() => {
                    ball.recentlyHit = false;
                }, hitInterval);
                
                // 当碰到竖着的ikun板子时，将篮球放到图片上部，确保击出位置在上部
                ball.x = paddle.x + paddle.width / 2;
                ball.y = paddle.y + paddle.height * 0.15; // 放到上部15%的位置，确保击出位置在上部
                
                // 震动效果：让板子快速左右移动
                const originalX = paddle.x;
                paddle.x += 5;
                setTimeout(() => {
                    paddle.x -= 10;
                    setTimeout(() => {
                        paddle.x += 5;
                    }, 50);
                }, 50);
                
                // 根据当前模式决定球的运动方式
                const screenSize = Math.min(canvasWidth, canvasHeight);
                const speed = screenSize * 0.02 * speedMultiplier;
                
                if (gameMode === 'hit') {
                    // 击球模式：生成随机角度击出球
                    const angle = (Math.random() * 160 - 80) * Math.PI / 180;
                    ball.speedX = speed * Math.sin(angle);
                    ball.speedY = -speed * Math.cos(angle);
                } else {
                    // 运球模式：原地震动，球在板子上弹跳
                    ball.speedX = 0;
                    ball.speedY = -speed * 0.5; // 减小Y轴速度，让球在板子上弹跳
                }
            }
            
            // 球与砖块碰撞
            let hitBrick = false;
            for (let brick of bricks) {
                if (brick.active) { // 砖块激活
                    if (ball.x + ball.radius > brick.x && 
                        ball.x - ball.radius < brick.x + brick.width && 
                        ball.y + ball.radius > brick.y && 
                        ball.y - ball.radius < brick.y + brick.height) {
                        ball.speedY *= -1; // 反转Y轴速度
                        
                        // 减少砖块的生命值
                        brick.hits--;
                        
                        // 检查砖块是否被击碎
                        if (brick.hits <= 0) {
                            brick.active = false; // 砖块变为非激活状态
                            
                            // 增加得分
                            score += brick.points;
                            document.getElementById('score').textContent = `得分：${score}`;
                            
                            // 无尽模式下，记录砖块被打掉的时间
                            if (gameType === 'endless') {
                                brick.destroyTime = Date.now();
                                
                                // 当积分达到10000的倍数时，激活boss
                        const bossThreshold = Math.floor(score / 10000) * 10000;
                        if (score >= bossThreshold && score % 10000 === 0 && !bossActive && !bossCooldown) {
                            // 每10000积分出现一次boss，每次出现的boss血量增加100
                            bossMaxHits = 50 + (Math.floor(score / 10000) - 1) * 100;
                            activateBoss();
                            bossCooldown = true;
                            setTimeout(() => {
                                bossCooldown = false;
                            }, 30000); // 30秒后可以再次激活boss
                            // 添加闪过去的提示
                            showFlashMessage(`恭喜解锁下一阶段！boss已激活，需要敲击${bossMaxHits}下才会消失！`, 3000);
                        }
                            }
                            
                            hitBrick = true;
                            
                            // 有几率生成 buff
                            if (Math.random() < 0.15) { // 15% 几率
                                const buffType = Math.random() < 0.5 ? 'multiball' : 'double'; // 随机buff类型
                                buffs.push({
                                    x: brick.x + brick.width / 2, // buff的X坐标
                                    y: brick.y + brick.height / 2, // buff的Y坐标
                                    radius: Math.min(canvasWidth, canvasHeight) * 0.015, // buff的半径，根据画布大小动态调整
                                    speedY: 2, // buff的下落速度
                                    color: buffType === 'multiball' ? '#9C27B0' : '#FF5722', // buff的颜色
                                    type: buffType // buff的类型
                                });
                            }
                        }
                        
                        // 检查是否所有砖块都被击碎
                        const allBricksDestroyed = bricks.every(b => !b.active);
                        if (allBricksDestroyed && gameType === 'level') {
                            if (level < 10) {
                                // 所有砖块都被击碎，进入下一关
                                level++;
                                alert(`关卡 ${level-1} 完成！得分：${score}\n进入关卡 ${level}！`);
                                
                                // 更新关卡数显示
                                document.getElementById('level').textContent = `关卡：${level}`;
                                
                                // 重新创建砖块（根据新关卡生成）
                                createBricks();
                                
                                // 重置球的位置
                                resetBalls();
                            } else {
                                // 第十关完成，游戏胜利
                                alert(`游戏胜利！恭喜您通过了所有10关！\n最终得分：${score}`);
                                
                                // 出现闪电特效
                                createLightningEffect();
                                
                                // 1秒后显示游戏结束图片并播放音效
                                setTimeout(() => {
                                    showGameoverImage();
                                }, 1000);
                                
                                // 回到主菜单
                                setTimeout(() => {
                                    document.getElementById('main-menu').style.display = 'flex'; // 使用flex布局保持居中
                                    // 重置游戏状态
                                    resetGame();
                                }, 6000);
                            }
                            
                            // 跳出外层循环，避免重复处理
                            return;
                        } else if (allBricksDestroyed && gameType === 'endless') {
                            // 无尽模式下，所有砖块都被击碎后重新生成
                            createEndlessBricks();
                        }
                        
                        break;
                    }
                }
            }
            
            // 球掉落，减少生命值
            // 将死亡线再往下一点，确保球在被接到之前不会被判定为丢失
            const deathLine = canvasHeight + 50; // 死亡线在画布底部下方50像素
            if (ball.y + ball.radius > deathLine &&
                !(ball.x > paddle.x && ball.x < paddle.x + paddle.width &&
                  ball.y > paddle.y && ball.y < paddle.y + paddle.height)) {
                balls.splice(i, 1); // 移除掉落的球
            }
        }
        
        // 球的上限规则已经在生成新球时处理，达到上限后不产生新的球
        
        // 确保球不会因为数量过多而被自动清除
        // 只在球掉落时移除球，不在其他情况下自动清除球

        
        // 检查是否所有球都掉落
        if (balls.length === 0) {
            // 确保生命不会变成负数
            if (lives > 0) {
                lives--; // 减少生命
                document.getElementById('lives').textContent = `生命：${lives}`;
                
                // 检查生命是否为0
                if (lives <= 0) {
                    // 计算游戏持续时间
                    gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
                    // 游戏结束
                    // 回到主菜单
                    const mainMenu = document.getElementById('main-menu');
                    if (mainMenu) {
                        mainMenu.style.display = 'flex'; // 使用flex布局保持居中
                        // 显示游戏记录
                        showGameRecord();
                        // 确保排行榜显示
                        showLeaderboard();
                    }
                    // 重置游戏状态
                    resetGame();
                } else {
                    // 重置球的位置
                    resetBalls();
                }
            } else {
                // 计算游戏持续时间
                gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
                // 当生命为0且没有球时，确保游戏结束
                // 回到主菜单
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu) {
                    mainMenu.style.display = 'flex'; // 使用flex布局保持居中
                    // 显示游戏记录
                    showGameRecord();
                    // 确保排行榜显示
                    showLeaderboard();
                }
                // 重置游戏状态
                resetGame();
            }
        }
        
        // 额外的安全检查：当生命为0时，确保游戏结束
        if (lives <= 0) {
            if (balls.length > 0) {
                // 清空球数组，触发游戏结束逻辑
                balls = [];
            } else {
                // 计算游戏持续时间
                gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
                // 当生命为0且没有球时，确保游戏结束
                // 回到主菜单
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu) {
                    mainMenu.style.display = 'flex'; // 使用flex布局保持居中
                    // 显示游戏记录
                    showGameRecord();
                    // 确保排行榜显示
                    showLeaderboard();
                }
                // 重置游戏状态
                resetGame();
            }
        }
    }
}

// 移动 buff - 移动所有buff并处理碰撞
function moveBuffs() {
    for (let i = buffs.length - 1; i >= 0; i--) {
        let buff = buffs[i];
        buff.y += buff.speedY; // 移动buff的Y坐标
        
        // 检查是否与底板碰撞
        if (buff.y + buff.radius > paddle.y && 
            buff.x > paddle.x && 
            buff.x < paddle.x + paddle.width) {
            // 应用 buff 效果
            const maxBalls = 150; // 球的上限数量
            if (buff.type === 'multiball') {
                // 检查当前球的数量是否已经达到上限
                if (balls.length < maxBalls) {
                    // 生成额外的球
                    for (let j = 0; j < 2; j++) {
                        // 再次检查，确保不会超过上限
                        if (balls.length < maxBalls) {
                            // 球的大小和速度随着屏幕的增大而变大变快
                            const screenSize = Math.min(canvasWidth, canvasHeight);
                            const speed = screenSize * 0.03 * speedMultiplier;
                            const radius = screenSize * 0.02;
                            balls.push({
                                x: buff.x, // 球的X坐标
                                y: buff.y, // 球的Y坐标
                                radius: radius, // 球的半径，根据屏幕大小动态调整
                                speedX: speed * (j === 0 ? 1 : -1), // 球的X轴速度，一个向左，一个向右
                                speedY: -speed, // 球的Y轴速度
                                color: '#FF9800' // 球的颜色
                            });
                        }
                    }
                }
            } else if (buff.type === 'double') {
                // 检查当前球的数量是否已经达到上限
                if (balls.length < maxBalls) {
                    // 让小球翻倍
                    const newBalls = [];
                    balls.forEach(ball => {
                        // 复制当前球
                        newBalls.push({
                            x: ball.x,
                            y: ball.y,
                            radius: ball.radius,
                            speedX: ball.speedX * 0.8,
                            speedY: ball.speedY * 0.8,
                            color: '#FFEB3B'
                        });
                        // 复制一个反向的球
                        newBalls.push({
                            x: ball.x,
                            y: ball.y,
                            radius: ball.radius,
                            speedX: -ball.speedX * 0.8,
                            speedY: ball.speedY * 0.8,
                            color: '#FFEB3B'
                        });
                    });
                    // 限制新球的数量，确保不会超过上限
                    const remainingSlots = maxBalls - balls.length;
                    if (remainingSlots > 0) {
                        // 将新球添加到原数组，最多添加remainingSlots个
                        balls = [...balls, ...newBalls.slice(0, remainingSlots)];
                    }
                }
            }
            buffs.splice(i, 1); // 移除被收集的buff
        }
        
        // 检查是否掉落
        if (buff.y - buff.radius > canvasHeight) {
            buffs.splice(i, 1); // 移除掉落的buff
        }
    }
}

// 重置球的位置 - 游戏重新开始时调用
function resetBalls() {
    // 计算球的速度，和生成球的速度一样
    const screenSize = Math.min(canvasWidth, canvasHeight);
    const speed = screenSize * 0.03 * speedMultiplier;
    
    balls = [{ // 重置为一个新球
        x: paddle.x + paddle.width / 2, // 球的X坐标，位于底板中心
        y: canvasHeight - 50, // 球的Y坐标，位于画布底部上方
        radius: screenSize * 0.02, // 球的半径，根据屏幕大小动态调整
        speedX: speed, // 球的X轴速度
        speedY: -speed, // 球的Y轴速度
        color: '#4CAF50', // 球的颜色
        recentlyHit: false // 球是否刚刚被板子打出去
    }];
    buffs = []; // 清空buff数组
    gameStarted = false; // 游戏状态设为未开始
}

// 基础大小 - 用于调整游戏元素大小
const baseBrickWidth = 50; // 基础砖块宽度
const baseBrickHeight = 25; // 基础砖块高度
const basePaddleWidth = 100; // 基础底板宽度
const basePaddleHeight = 150; // 基础底板高度

// 开始关卡模式 - 点击关卡模式按钮时调用
function startLevelMode() {
    gameType = 'level'; // 设置游戏类型为关卡模式
    document.getElementById('game-type').textContent = `类型：关卡模式`; // 更新游戏类型显示
    document.getElementById('main-menu').style.display = 'none'; // 隐藏主菜单
    
    // 调用resizeCanvas函数，确保游戏元素大小适应画布大小
    resizeCanvas();
    
    resetGame(); // 重置游戏
    gameStartTime = Date.now(); // 记录游戏开始时间
}

// 开始无尽模式 - 点击无尽模式按钮时调用
function startEndlessMode() {
    gameType = 'endless'; // 设置游戏类型为无尽模式
    document.getElementById('game-type').textContent = `类型：无尽模式`; // 更新游戏类型显示
    document.getElementById('main-menu').style.display = 'none'; // 隐藏主菜单
    
    // 调用resizeCanvas函数，确保游戏元素大小适应画布大小
    resizeCanvas();
    
    resetEndlessGame(); // 重置无尽模式游戏
    gameStartTime = Date.now(); // 记录游戏开始时间
}

// 重置游戏 - 关卡模式下重置游戏状态
function resetGame() {
    score = 0; // 重置得分
    lives = 3; // 重置生命
    level = 1; // 重置关卡
    gameStarted = false; // 游戏状态设为未开始
    document.getElementById('score').textContent = `得分：${score}`; // 更新得分显示
    document.getElementById('lives').textContent = `生命：${lives}`; // 更新生命显示
    document.getElementById('level').textContent = `关卡：${level}`; // 更新关卡显示
    
    // 重新创建砖块
    createBricks();
    
    // 重置球的位置
    resetBalls();
}

// 重置无尽模式游戏 - 无尽模式下重置游戏状态
function resetEndlessGame() {
    score = 0; // 重置得分
    lives = 3; // 重置生命
    gameStarted = false; // 游戏状态设为未开始
    document.getElementById('score').textContent = `得分：${score}`; // 更新得分显示
    document.getElementById('lives').textContent = `生命：${lives}`; // 更新生命显示
    document.getElementById('level').textContent = `关卡：-`; // 更新关卡显示
    
    // 重新创建砖块
    createEndlessBricks();
    
    // 重置球的位置
    resetBalls();
}

// 创建无尽模式的砖块
function createEndlessBricks() {
    bricks = []; // 清空砖块数组
    
    // 生成砖块，boss激活后翻倍生成
    let totalBricks = 30; // 基础砖块数
    if (bossActive) {
        totalBricks = 60; // boss激活后翻倍生成砖块
    }
    
    const halfHeight = canvasHeight / 2; // 画布高度的一半
    const paddingX = 35; // 左右边距
    const paddingY = 60; // 上边距
    const maxX = canvasWidth - brickWidth - paddingX * 2; // 砖块X坐标最大值
    let maxY = halfHeight - brickHeight - paddingY; // 砖块Y坐标最大值
    
    // 如果boss激活，调整maxY，确保砖块只生成在boss图片之外的上半区
    if (bossActive) {
        maxY = (halfHeight / 2) - brickHeight - paddingY;
    }
    
    for (let i = 0; i < totalBricks; i++) {
        const x = Math.random() * maxX + paddingX; // 随机X坐标
        const y = Math.random() * maxY + paddingY; // 随机Y坐标
        const color = getBrickColor(Math.floor(Math.random() * 5)); // 随机颜色
        const isDoubleBrick = Math.random() < 0.3; // 30%的概率为双重砖块
        
        bricks.push({
            x: x, // 砖块X坐标
            y: y, // 砖块Y坐标
            width: brickWidth, // 砖块宽度
            height: brickHeight, // 砖块高度
            color: color, // 砖块颜色
            active: true, // 砖块是否激活
            isDouble: isDoubleBrick, // 是否为双重砖块
            hits: isDoubleBrick ? 2 : 1, // 双重砖块需要打两下
            points: 10, // 砖块得分
            destroyTime: 0 // 记录砖块被打掉的时间
        });
    }
}

// 游戏主循环 - 游戏的核心循环，每帧执行
function animate() {
    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // 绘制游戏对象
    drawBoundaries(); // 绘制边界线
    drawBricks(); // 绘制砖块
    drawPaddle(); // 绘制底板
    drawBalls(); // 绘制球
    drawBuffs(); // 绘制buff
    drawFlashMessage(); // 绘制闪屏消息
    
    // 如果boss激活，绘制boss图片
    if (bossActive) {
        // 遍历所有boss
        for (let i = 0; i < bosses.length; i++) {
            const boss = bosses[i];
            // 根据boss阶段选择图片
            const bossImageId = boss.phase === 1 ? 'boss1-image' : 'boss2-image';
            const bossImage = document.getElementById(bossImageId);
            
            // 检查boss图片是否加载完成且加载成功
            if (bossImage && bossImage.complete && bossImage.naturalWidth > 0) {
                // 绘制boss图片
                ctx.drawImage(bossImage, boss.x, boss.y, boss.width, boss.height);
                
                // 只在boss1阶段显示每个boss的剩余敲击次数
                if (boss.phase === 1) {
                    // 在boss图片上方显示剩余敲击次数
                    ctx.fillStyle = 'white'; // 文字颜色
                    ctx.font = '24px Arial'; // 文字字体
                    ctx.textAlign = 'center'; // 文字对齐方式
                    ctx.fillText(`剩余敲击次数：${boss.maxHits - boss.hits}`, boss.x + boss.width / 2, boss.y - 20); // 绘制文字
                }
            } else {
                // 如果boss图片加载失败，绘制一个占位背景
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
                // 只在boss1阶段显示每个boss的剩余敲击次数
                if (boss.phase === 1) {
                    // 显示剩余敲击次数
                    ctx.fillStyle = 'white';
                    ctx.font = '24px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`剩余敲击次数：${boss.maxHits - boss.hits}`, boss.x + boss.width / 2, boss.y - 20);
                }
                ctx.fillText(`Boss${boss.phase}图片加载失败`, boss.x + boss.width / 2, boss.y + boss.height / 2);
            }
        }
        
        // 在屏幕中央显示总剩余敲击次数
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`总剩余敲击次数：${bossMaxHits - bossHits}`, canvasWidth / 2, 30);
    }
    
    // 移动游戏对象
    movePaddle(); // 移动底板
    moveBalls(); // 移动球
    moveBuffs(); // 移动buff
    
    // 移动boss
    if (bossActive) {
        for (let i = 0; i < bosses.length; i++) {
            const boss = bosses[i];
            if (boss.phase === 2) { // 只为第二个boss添加移动
                // 确保boss有speedX属性
                if (!boss.speedX) {
                    boss.speedX = (Math.random() - 0.5) * 8; // 增加初始随机水平速度
                }
                
                // 随机左右移动
                if (Math.random() < 0.1) { // 10%的概率改变移动方向
                    boss.speedX = (Math.random() - 0.5) * 8; // 增加移动速度
                }
                
                // 确保boss不会移出屏幕
                boss.x += boss.speedX;
                // 边界检查
                if (boss.x < 0) {
                    boss.x = 0;
                    boss.speedX = -boss.speedX; // 反弹
                } else if (boss.x + boss.width > canvasWidth) {
                    boss.x = canvasWidth - boss.width;
                    boss.speedX = -boss.speedX; // 反弹
                }
            }
        }
    }
    
    // 无尽模式下，砖块被打掉后3秒随机重生
    if (gameType === 'endless') {
        const now = Date.now(); // 当前时间
        const halfHeight = canvasHeight / 2; // 画布高度的一半
        const paddingX = 35; // 左右边距
        const paddingY = 60; // 上边距
        const maxX = canvasWidth - brickWidth - paddingX * 2; // 砖块X坐标最大值
        let maxY = halfHeight - brickHeight - paddingY; // 砖块Y坐标最大值
        
        // 如果boss激活，调整maxY，确保砖块只生成在boss图片之外的上半区
        if (bossActive) {
            maxY = (halfHeight / 2) - brickHeight - paddingY;
        }
        
        for (let i = 0; i < bricks.length; i++) {
            const brick = bricks[i];
            if (!brick.active && brick.destroyTime > 0 && now - brick.destroyTime >= 3000) {
                // 3秒后重生砖块
                brick.active = true; // 激活砖块
                brick.hits = brick.isDouble ? 2 : 1; // 重置砖块生命值
                brick.destroyTime = 0; // 重置销毁时间
                // 随机新位置
                brick.x = Math.random() * maxX + paddingX;
                brick.y = Math.random() * maxY + paddingY;
            }
        }
    }
    
    // 循环动画 - 递归调用animate函数，实现游戏循环
    requestAnimationFrame(animate);
}

// 闪屏消息变量
let flashMessage = null;
let flashMessageTime = 0;

// 音效播放时间记录
let isJinitaimeiPlaying = false; // jinitaimei音效是否正在播放
let isBossSoundPlaying = false; // boss音效是否正在播放

// 播放音效
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        // 检查是否是jinitaimei音效，如果是，确保播放完后才能进行下一次播放
        if (soundId === 'jinitaimei-audio') {
            if (isJinitaimeiPlaying) {
                return;
            }
            isJinitaimeiPlaying = true;
            
            // 监听音效播放结束事件
            sound.onended = function() {
                isJinitaimeiPlaying = false;
            };
        } else if (soundId === 'ganmaover-audio' || soundId === 'nigamma-audio') {
            // 对于boss音效，确保正在播放时不重复播放
            if (isBossSoundPlaying) {
                return;
            }
            isBossSoundPlaying = true;
            
            // 监听音效播放结束事件
            sound.onended = function() {
                isBossSoundPlaying = false;
            };
        } else {
            // 对于其他音效，重置播放位置
            sound.currentTime = 0;
        }
        
        sound.play().catch(e => {
            console.error('播放音效失败:', e);
            // 如果播放失败，重置标志
            if (soundId === 'jinitaimei-audio') {
                isJinitaimeiPlaying = false;
            } else if (soundId === 'ganmaover-audio' || soundId === 'nigamma-audio') {
                isBossSoundPlaying = false;
            }
        });
    }
}

// 闪电特效
function createLightningEffect() {
    const lightningContainer = document.getElementById('lightning-effect');
    lightningContainer.style.display = 'block';
    
    // 创建多个闪电元素
    for (let i = 0; i < 5; i++) {
        const lightning = document.createElement('div');
        lightning.style.position = 'absolute';
        lightning.style.top = '0';
        lightning.style.left = Math.random() * 100 + '%';
        lightning.style.width = '2px';
        lightning.style.height = '100%';
        lightning.style.backgroundColor = 'white';
        lightning.style.opacity = '0';
        lightning.style.boxShadow = '0 0 10px 2px white';
        lightning.style.animation = 'lightning ' + (0.5 + Math.random() * 0.5) + 's ease-out forwards';
        lightningContainer.appendChild(lightning);
        
        // 动画结束后移除元素
        setTimeout(() => {
            lightning.remove();
        }, 1000);
    }
    
    // 添加闪电动画样式
    if (!document.getElementById('lightning-style')) {
        const style = document.createElement('style');
        style.id = 'lightning-style';
        style.textContent = `
            @keyframes lightning {
                0% {
                    opacity: 0;
                    transform: translateY(-100%);
                }
                20% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                    transform: translateY(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 2秒后隐藏闪电容器
    setTimeout(() => {
        lightningContainer.style.display = 'none';
    }, 2000);
}

// 在指定位置创建闪电特效
function createLightningEffectAtPosition(x, y) {
    try {
        const lightningContainer = document.getElementById('lightning-effect');
        if (!lightningContainer) {
            console.error('闪电容器不存在');
            return;
        }
        lightningContainer.style.display = 'block';
        
        // 创建从受击位置向上的闪电
        const lightning = document.createElement('div');
        lightning.style.position = 'absolute';
        lightning.style.left = x + 'px';
        lightning.style.top = y + 'px';
        lightning.style.width = '3px';
        lightning.style.height = '200px';
        lightning.style.backgroundColor = 'white';
        lightning.style.opacity = '0';
        lightning.style.boxShadow = '0 0 15px 3px white';
        lightning.style.animation = 'lightning-at-position ' + (0.3 + Math.random() * 0.2) + 's ease-out forwards';
        lightningContainer.appendChild(lightning);
        
        // 创建额外的分支闪电
        for (let i = 0; i < 3; i++) {
            const branchLightning = document.createElement('div');
            branchLightning.style.position = 'absolute';
            branchLightning.style.left = x + (Math.random() - 0.5) * 50 + 'px';
            branchLightning.style.top = y - Math.random() * 100 + 'px';
            branchLightning.style.width = '2px';
            branchLightning.style.height = '150px';
            branchLightning.style.backgroundColor = 'white';
            branchLightning.style.opacity = '0';
            branchLightning.style.boxShadow = '0 0 10px 2px white';
            branchLightning.style.animation = 'lightning-at-position ' + (0.4 + Math.random() * 0.3) + 's ease-out forwards';
            branchLightning.style.animationDelay = Math.random() * 0.1 + 's';
            lightningContainer.appendChild(branchLightning);
            
            // 动画结束后移除元素
            setTimeout(() => {
                try {
                    branchLightning.remove();
                } catch (e) {
                    console.error('移除分支闪电失败:', e);
                }
            }, 1000);
        }
        
        // 添加闪电动画样式
        if (!document.getElementById('lightning-style')) {
            const style = document.createElement('style');
            style.id = 'lightning-style';
            style.textContent = `
                @keyframes lightning {
                    0% {
                        opacity: 0;
                        transform: translateY(-100%);
                    }
                    20% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(100%);
                    }
                }
                @keyframes lightning-at-position {
                    0% {
                        opacity: 0;
                        transform: translateY(0);
                    }
                    20% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-200px);
                    }
                }
            `;
            document.head.appendChild(style);
        } else {
            // 如果样式已存在，检查是否包含lightning-at-position动画
            const existingStyle = document.getElementById('lightning-style');
            if (existingStyle && !existingStyle.textContent.includes('lightning-at-position')) {
                existingStyle.textContent += `
                    @keyframes lightning-at-position {
                        0% {
                            opacity: 0;
                            transform: translateY(0);
                        }
                        20% {
                            opacity: 1;
                        }
                        100% {
                            opacity: 0;
                            transform: translateY(-200px);
                        }
                    }
                `;
            }
        }
        
        // 动画结束后移除元素
        setTimeout(() => {
            try {
                lightning.remove();
            } catch (e) {
                console.error('移除闪电失败:', e);
            }
        }, 1000);
        
        // 2秒后隐藏闪电容器
        setTimeout(() => {
            try {
                lightningContainer.style.display = 'none';
            } catch (e) {
                console.error('隐藏闪电容器失败:', e);
            }
        }, 2000);
    } catch (e) {
        console.error('创建闪电特效失败:', e);
    }
}

// 显示游戏结束图片
function showGameoverImage() {
    const gameoverContainer = document.getElementById('gameover-container');
    gameoverContainer.style.display = 'block';
    
    // 播放gameover.wav
    const gameoverAudio = document.getElementById('ganmaover-audio');
    if (gameoverAudio) {
        gameoverAudio.currentTime = 0;
        gameoverAudio.play().catch(e => {
            console.error('播放游戏结束音效失败:', e);
        });
    }
    
    // 5秒后隐藏游戏结束图片
    setTimeout(() => {
        gameoverContainer.style.display = 'none';
    }, 5000);
}

// 保存游戏记录到排行榜
function saveGameRecord() {
    // 格式化游戏持续时间
    const minutes = Math.floor(gameDuration / 60);
    const seconds = gameDuration % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // 创建新的游戏记录
    const newRecord = {
        score: score,
        time: timeString,
        date: new Date().toLocaleString()
    };
    
    // 从localStorage获取排行榜数据
    let leaderboard = JSON.parse(localStorage.getItem('brickBreakerLeaderboard') || '[]');
    
    // 添加新记录
    leaderboard.push(newRecord);
    
    // 按得分排序，降序排列
    leaderboard.sort((a, b) => b.score - a.score);
    
    // 只保留前10名
    leaderboard = leaderboard.slice(0, 10);
    
    // 保存回localStorage
    localStorage.setItem('brickBreakerLeaderboard', JSON.stringify(leaderboard));
    
    return leaderboard;
}

// 显示游戏记录排行榜
function showGameRecord() {
    // 保存当前游戏记录
    const leaderboard = saveGameRecord();
    
    // 检查主菜单是否存在游戏记录区域
    let recordArea = document.getElementById('game-record');
    if (!recordArea) {
        // 创建游戏记录区域
        recordArea = document.createElement('div');
        recordArea.id = 'game-record';
        recordArea.style.cssText = 'position: absolute; right: 50px; top: 50%; transform: translateY(-50%); background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); font-size: 16px; color: #333; width: 300px;';
        document.getElementById('main-menu').appendChild(recordArea);
    }
    
    // 生成排行榜HTML
    let leaderboardHTML = '<h3>排行榜</h3><ol style="list-style-type: decimal; padding-left: 20px; margin: 10px 0;">';
    
    leaderboard.forEach((record, index) => {
        leaderboardHTML += `<li style="margin: 8px 0;">${record.time} - ${record.score}分</li>`;
    });
    
    leaderboardHTML += '</ol>';
    
    // 更新游戏记录
    recordArea.innerHTML = leaderboardHTML;
}

// 显示排行榜
function showLeaderboard() {
    // 确保主菜单元素存在
    const mainMenu = document.getElementById('main-menu');
    if (!mainMenu) {
        console.error('主菜单元素不存在');
        return;
    }
    
    // 检查主菜单是否存在游戏记录区域
    let recordArea = document.getElementById('game-record');
    if (!recordArea) {
        // 创建游戏记录区域
        recordArea = document.createElement('div');
        recordArea.id = 'game-record';
        recordArea.style.cssText = 'position: absolute; right: 50px; top: 50%; transform: translateY(-50%); background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); font-size: 16px; color: #333; width: 300px; z-index: 1000;';
        mainMenu.appendChild(recordArea);
    }
    
    try {
        // 从localStorage获取排行榜数据
        let leaderboard = JSON.parse(localStorage.getItem('brickBreakerLeaderboard') || '[]');
        
        // 生成排行榜HTML
        let leaderboardHTML = '<h3>排行榜</h3><ol style="list-style-type: decimal; padding-left: 20px; margin: 10px 0;">';
        
        if (leaderboard.length === 0) {
            leaderboardHTML += '<li>暂无记录</li>';
        } else {
            leaderboard.forEach((record, index) => {
                leaderboardHTML += `<li style="margin: 8px 0;">${record.time} - ${record.score}分</li>`;
            });
        }
        
        leaderboardHTML += '</ol>';
        
        // 更新游戏记录
        recordArea.innerHTML = leaderboardHTML;
        console.log('排行榜显示成功');
    } catch (error) {
        console.error('显示排行榜失败:', error);
        // 显示错误信息
        if (recordArea) {
            recordArea.innerHTML = '<h3>排行榜</h3><p>加载排行榜失败</p>';
        }
    }
}

// 结束无尽模式
function endEndlessMode() {
    // 计算游戏持续时间
    gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
    // 回到主菜单
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) {
        mainMenu.style.display = 'flex'; // 使用flex布局保持居中
        // 显示游戏记录
        showGameRecord();
        // 确保排行榜显示
        showLeaderboard();
    }
    // 重置游戏状态
    resetGame();
}

// 激活boss
function activateBoss() {
    bossActive = true;
    bossHits = 0;
    bossPhase = 1;
    bossMaxHits = 200; // boss1需要被击中的次数，改为200次
    
    // 清空boss数组
    bosses = [];
    
    // 添加第一个boss
    bosses.push({
        x: (canvasWidth - 250) / 2, // 水平居中
        y: (canvasHeight - 250) / 3, // 向上移动，位于画布上方1/3处
        width: 250,
        height: 250,
        hits: 0,
        maxHits: 200, // boss1需要被击中的次数，改为200次
        phase: 1
    });
    
    // 播放boss1登场音效
    playSound('ganmaover-audio');
}

// 进入boss二阶段
function enterBossPhase2() {
    bossPhase = 2;
    bossHits = 0;
    bossMaxHits = 500; // boss2需要被击中的次数，改为500次
    
    // 清空boss数组
    bosses = [];
    
    // 添加两个boss，分别在左上角和右上角
    bosses.push({
        x: 50, // 左上角
        y: 50,
        width: 250,
        height: 250,
        hits: 0,
        maxHits: 500, // boss2需要被击中的次数，改为500次
        phase: 2,
        speedX: (Math.random() - 0.5) * 8 // 增加初始随机水平速度
    });
    
    bosses.push({
        x: canvasWidth - 250 - 50, // 右上角
        y: 50,
        width: 250,
        height: 250,
        hits: 0,
        maxHits: 500, // boss2需要被击中的次数，改为500次
        phase: 2,
        speedX: (Math.random() - 0.5) * 8 // 增加初始随机水平速度
    });
    
    // 播放boss2登场音效
    playSound('nigamma-audio');
    
    // 添加闪过去的提示
    showFlashMessage('boss进入第二阶段！生成两个boss，需要分别敲击500下才会消失！', 3000);
}

// 显示闪屏消息
function showFlashMessage(message, duration) {
    flashMessage = message;
    flashMessageTime = Date.now();
    
    // 一段时间后清除消息
    setTimeout(() => {
        flashMessage = null;
    }, duration);
}

// 绘制闪屏消息
function drawFlashMessage() {
    if (flashMessage) {
        // 计算消息框位置和大小
        const messageWidth = 400;
        const messageHeight = 100;
        const messageX = (canvasWidth - messageWidth) / 2;
        const messageY = (canvasHeight - messageHeight) / 2;
        
        // 绘制半透明背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.roundRect(messageX, messageY, messageWidth, messageHeight, 10);
        ctx.fill();
        
        // 绘制消息文本
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(flashMessage, canvasWidth / 2, canvasHeight / 2);
    }
}

// 初始化游戏 - 页面加载完成后调用
window.onload = initGame;